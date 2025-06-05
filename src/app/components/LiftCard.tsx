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
import {LiftHistory, LiftProgressStatus, PerformanceChange} from '@/types';
import {format, parseISO} from 'date-fns';

const {Text, Paragraph} = Typography;

interface LiftCardProps {
  lift: LiftHistory;
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

const getProgressStatusIcon = (status?: LiftProgressStatus) => {
  switch (status) {
    case LiftProgressStatus.Progressing:
      return <ArrowUpOutlined style={{color: 'green', marginRight: 8}}/>;
    case LiftProgressStatus.NeedsAttention:
      return <EyeOutlined style={{color: 'orange', marginRight: 8}}/>;
    case LiftProgressStatus.Plateaued:
      return <WarningOutlined style={{color: 'gold', marginRight: 8}}/>;
    case LiftProgressStatus.Regressing:
      return <ArrowDownOutlined style={{color: 'red', marginRight: 8}}/>;
    default:
      return <Tag>{status}</Tag>;
  }
};

const getPerformanceColor = (performance?: PerformanceChange) => {
  switch (performance) {
    case PerformanceChange.Increase:
      return 'green';
    case PerformanceChange.Decrease:
      return 'red';
    case PerformanceChange.NoChange:
      return 'orange';
    default:
      return 'gray';
  }
};

const getPerformanceIcon = (performance?: PerformanceChange) => {
  switch (performance) {
    case PerformanceChange.Increase:
      return <CheckCircleOutlined style={{color: 'green'}}/>;
    case PerformanceChange.Decrease:
      return <CloseCircleOutlined style={{color: 'red'}}/>;
    case PerformanceChange.NoChange:
      return <MinusCircleOutlined style={{color: 'orange'}}/>;
    default:
      return <QuestionCircleOutlined style={{color: 'gray'}}/>;
  }
};

export const LiftCard: React.FC<LiftCardProps> = ({lift}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleTimelineExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const workouts = lift.workouts

  // Limit to 5 most recent entries if not expanded
  const visibleEntries = isExpanded ? workouts : workouts.slice(-5);
  const hasMoreEntries = workouts.length > 5;

  // Helper to render popover content
  const renderNotesPopover = (currentLift: LiftHistory) => {
    // Collect all unique notes and workout notes
    const uniqueNotes = new Set<string>();
    const uniqueWorkoutNotes = new Set<string>();

    currentLift.workouts.forEach(workout => {
      if (workout.note) {
        uniqueNotes.add(workout.note.trim());
      }
      workout.sets.forEach((it) => {
        if (it.notes) {
          uniqueNotes.add(it.notes.trim());
        }
      })
    });

    if (uniqueNotes.size === 0 && uniqueWorkoutNotes.size === 0) {
      return null; // No notes to show
    }

    return (
      <div style={{maxWidth: 300}}>
        {uniqueNotes.size > 0 && (
          <>
            <Text strong>Notes:</Text>
            {[...uniqueNotes].map((note, index) => (
              <Paragraph key={index} style={{margin: '4px 0'}}>
                {note}
              </Paragraph>
            ))}
          </>
        )}

        {uniqueWorkoutNotes.size > 0 && (
          <>
            <Text strong>Workout Notes:</Text>
            {[...uniqueWorkoutNotes].map((note, index) => (
              <Paragraph key={index} style={{margin: '4px 0'}}>
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
          {getProgressStatusIcon(lift.progressStatus)}
          {lift.name}
        </span>
      }
      style={{marginRight: 8, marginBottom: 8, flex: '1 1 300px'}}
    >
      <Timeline
        mode="left"
        reverse
        items={visibleEntries
          .map((liftingDay) => {
            // Check if there are any notes to show
            const notesContent = renderNotesPopover(lift);
            const hasNotes = notesContent !== null;

            return {
              color: getPerformanceColor(liftingDay.performanceChange),
              label: <Tag>{formatDate(liftingDay.date)}</Tag>,
              children: (
                <div>
                  <Text strong style={{
                    color: getPerformanceColor(liftingDay.performanceChange),
                  }}>
                    {liftingDay.performanceChange}
                    {hasNotes && (
                      <Popover
                        content={notesContent}
                        title="Notes"
                        placement="right"
                        trigger="hover"
                      >
                        <InfoCircleOutlined
                          style={{marginLeft: 8, color: 'rgba(0,0,0,0.45)'}}/>
                      </Popover>
                    )}
                  </Text>
                  <div>
                    {liftingDay.sets.map((exercise, i) => (
                      <div key={i}
                           style={{marginBottom: i < liftingDay.sets.length - 1 ? 2 : 0}}>
                        <Text>
                          {exercise.setMark}: {exercise.weight}kg
                          × {exercise.reps}
                        </Text>
                      </div>
                    ))}
                  </div>
                </div>
              ),
              dot: getPerformanceIcon(liftingDay.performanceChange)
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
