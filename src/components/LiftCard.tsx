import React, {useState} from 'react';
import {Button, Card, Popover, Tag, Timeline, Typography} from 'antd';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  MinusCircleOutlined,
  QuestionCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import {ProgressStatus} from '@/types';
import {format, parseISO} from 'date-fns';

const {Text, Paragraph} = Typography;

interface Exercise {
  date: string;
  workoutName: string;
  exerciseName: string;
  setOrder: string;
  weight: number;
  reps: number;
  distance: number;
  seconds: number;
  notes: string;
  workoutNotes: string;
  rpe: number | null;
}

interface DateGroup {
  date: string;
  exercises: Exercise[];
  topSetPerformance: string;
  overallPerformance: string;
}

interface ExerciseData {
  label: string;
  dateGroups: {
    [key: string]: DateGroup;
  };
  progressStatus?: ProgressStatus;
}

interface LiftCardProps {
  exercise: ExerciseData;
}

const formatDate = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    return format(date, 'PP');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return original string if there's an error
  }
};

const getProgressStatusIcon = (status?: ProgressStatus) => {
  switch (status) {
    case ProgressStatus.Progressing:
      return <ArrowUpOutlined style={{color: 'green', marginRight: 8}}/>;
    case ProgressStatus.NeedsAttention:
      return <EyeOutlined style={{color: 'orange', marginRight: 8}}/>;
    case ProgressStatus.Plateaued:
      return <WarningOutlined style={{color: 'gold', marginRight: 8}}/>;
    case ProgressStatus.Regressing:
      return <ArrowDownOutlined style={{color: 'red', marginRight: 8}}/>;
    default:
      return <Tag>{status}</Tag>;
  }
};

const getPerformanceColor = (performance: string) => {
  switch (performance) {
    case 'Increase':
      return 'green';
    case 'Decrease':
      return 'red';
    case 'No Change':
      return 'orange';
    default:
      return 'gray';
  }
};

const getPerformanceIcon = (performance: string) => {
  switch (performance) {
    case 'Increase':
      return <CheckCircleOutlined style={{color: 'green'}}/>;
    case 'Decrease':
      return <CloseCircleOutlined style={{color: 'red'}}/>;
    case 'No Change':
      return <MinusCircleOutlined style={{color: 'orange'}}/>;
    default:
      return <QuestionCircleOutlined style={{color: 'gray'}}/>;
  }
};

export const LiftCard: React.FC<LiftCardProps> = ({exercise}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleTimelineExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // Get date entries sorted from newest to oldest
  const dateEntries = Object.values(exercise.dateGroups)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Limit to 5 most recent entries if not expanded
  const visibleEntries = isExpanded ? dateEntries : dateEntries.slice(0, 5);
  const hasMoreEntries = dateEntries.length > 5;

  // Helper to render popover content
  const renderNotesPopover = (dateGroup: DateGroup) => {
    // Collect all unique notes and workout notes
    const uniqueNotes = new Set<string>();
    const uniqueWorkoutNotes = new Set<string>();
    
    dateGroup.exercises.forEach(exercise => {
      if (exercise.notes && exercise.notes.trim()) uniqueNotes.add(exercise.notes.trim());
      if (exercise.workoutNotes && exercise.workoutNotes.trim()) uniqueWorkoutNotes.add(exercise.workoutNotes.trim());
    });
    
    if (uniqueNotes.size === 0 && uniqueWorkoutNotes.size === 0) {
      return null; // No notes to show
    }
    
    return (
      <div style={{ maxWidth: 300 }}>
        {uniqueNotes.size > 0 && (
          <>
            <Text strong>Exercise Notes:</Text>
            {[...uniqueNotes].map((note, index) => (
              <Paragraph key={index} style={{ margin: '4px 0' }}>
                {note}
              </Paragraph>
            ))}
          </>
        )}
        
        {uniqueWorkoutNotes.size > 0 && (
          <>
            <Text strong>Workout Notes:</Text>
            {[...uniqueWorkoutNotes].map((note, index) => (
              <Paragraph key={index} style={{ margin: '4px 0' }}>
                {note}
              </Paragraph>
            ))}
          </>
        )}
      </div>
    );
  };

  return (
    <Card
      title={
        <span>
          {getProgressStatusIcon(exercise.progressStatus)}
          {exercise.label}
        </span>
      }
      style={{marginRight: 8, marginBottom: 8, flex: '1 1 300px'}}
    >
      <Timeline
        mode="left"
        items={visibleEntries
          .map((dateGroup) => {
            // Check if there are any notes to show
            const notesContent = renderNotesPopover(dateGroup);
            const hasNotes = notesContent !== null;
            
            return {
              color: getPerformanceColor(dateGroup.overallPerformance),
              label: <Tag>{formatDate(dateGroup.date)}</Tag>,
              children: (
                <div>
                  <Text strong style={{
                    color: getPerformanceColor(dateGroup.overallPerformance),
                    marginBottom: '4px',
                    display: 'block'
                  }}>
                    {dateGroup.overallPerformance}
                    {hasNotes && (
                      <Popover 
                        content={notesContent} 
                        title="Notes" 
                        placement="right"
                        trigger="hover"
                      >
                        <InfoCircleOutlined style={{ marginLeft: 8, color: 'rgba(0,0,0,0.45)' }} />
                      </Popover>
                    )}
                  </Text>
                  <div>
                    {dateGroup.exercises.map((exercise, i) => (
                      <div key={i}
                           style={{marginBottom: i < dateGroup.exercises.length - 1 ? 2 : 0}}>
                        <Text>
                          {exercise.setOrder}: {exercise.weight}kg × {exercise.reps}
                        </Text>
                      </div>
                    ))}
                  </div>
                </div>
              ),
              dot: getPerformanceIcon(dateGroup.overallPerformance)
            };
          })}
      />

      {hasMoreEntries && (
        <Button onClick={toggleTimelineExpansion}>
          {isExpanded ? "Show Recent Only" : "Show Previous"}
        </Button>
      )}
    </Card>
  );
};
