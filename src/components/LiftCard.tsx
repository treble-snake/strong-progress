import React, {useState} from 'react';
import {Button, Card, Tag, Timeline, Typography} from 'antd';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  MinusCircleOutlined,
  QuestionCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import {ProgressStatus} from '@/types';
import {format, parseISO} from 'date-fns';

const {Text} = Typography;

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
          .map((dateGroup) => ({
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
                </Text>
                <div>
                  {dateGroup.exercises.map((exercise, i) => (
                    <div key={i}
                         style={{marginBottom: i < dateGroup.exercises.length - 1 ? 2 : 0}}>
                      <Text>{exercise.setOrder}: {exercise.weight}kg
                        × {exercise.reps}</Text>
                    </div>
                  ))}
                </div>
              </div>
            ),
            dot: getPerformanceIcon(dateGroup.overallPerformance)
          }))}
      />

      {hasMoreEntries && (
        <Button onClick={toggleTimelineExpansion}>
          {isExpanded ? "Show Recent Only" : "Show Previous"}
        </Button>
      )}
    </Card>
  );
};
