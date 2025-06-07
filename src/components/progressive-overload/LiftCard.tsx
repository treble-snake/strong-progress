import React, {useState} from 'react';
import {Button, Card, Tag, Timeline, Typography} from 'antd';
import {
  AlertOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FallOutlined,
  MinusCircleOutlined,
  QuestionCircleOutlined,
  RiseOutlined,
  SearchOutlined,
  WarningOutlined
} from '@ant-design/icons';
import {red, volcano, orange, grey, green} from '@ant-design/colors';
import {LiftHistory, LiftProgressStatus, PerformanceChange} from '@/types';
import {format, parseISO} from 'date-fns';
import {NotesPopover} from './NotesPopover';

const {Text} = Typography;

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
      return <RiseOutlined style={{color: green[6], marginRight: 8}}/>;
    case LiftProgressStatus.Struggling:
      return <SearchOutlined style={{color: orange.primary, marginRight: 8}}/>;
    case LiftProgressStatus.AtRisk:
       return <WarningOutlined style={{color: orange.primary, marginRight: 8}}/>;
    case LiftProgressStatus.Plateaued:
      return <AlertOutlined style={{color: volcano.primary, marginRight: 8}}/>;
    case LiftProgressStatus.Regressing:
      return <FallOutlined style={{color: red.primary, marginRight: 8}}/>;
    case LiftProgressStatus.NotSure:
      return <QuestionCircleOutlined style={{color: grey.primary, marginRight: 8}}/>;
    default:
      return <Tag>{status}</Tag>;
  }
};

const getPerformanceColor = (performance?: PerformanceChange) => {
  switch (performance) {
    case PerformanceChange.Increase:
      return green[6];
    case PerformanceChange.Decrease:
      return red.primary;
    case PerformanceChange.NoChange:
      return orange.primary;
    default:
      return grey.primary;
  }
};

const getPerformanceIcon = (performance?: PerformanceChange) => {
  switch (performance) {
    case PerformanceChange.Increase:
      return <CheckCircleOutlined />;
    case PerformanceChange.Decrease:
      return <CloseCircleOutlined />;
    case PerformanceChange.NoChange:
      return <MinusCircleOutlined />;
    default:
      return <QuestionCircleOutlined />;
  }
};

export const LiftCard: React.FC<LiftCardProps> = ({lift}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleTimelineExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const workouts = lift.workouts;
  // Limit to 5 most recent entries if not expanded
  const visibleEntries = isExpanded ? workouts : workouts.slice(-5);
  const hasMoreEntries = workouts.length > 5;

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
            return {
              color: getPerformanceColor(liftingDay.performanceChange),
              label: <Tag>{formatDate(liftingDay.date)}</Tag>,
              children: (
                <div>
                  <Text strong style={{
                    color: getPerformanceColor(liftingDay.performanceChange),
                  }}>
                    {liftingDay.performanceChange}
                    <NotesPopover session={liftingDay} />
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
