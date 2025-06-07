import React, {useState} from 'react';
import {Button, Card, Space, Tag, Timeline, Typography} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import {green, grey, orange, red} from '@ant-design/colors';
import {LiftHistory, PerformanceChange} from '@/types';
import {format, parseISO} from 'date-fns';
import {NotesPopover} from './NotesPopover';
import {
  ProgressStatusIcon
} from "@/components/progressive-overload/ProgressStatusIcon";

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
        <Space>
          <ProgressStatusIcon status={lift.progressStatus} />
          {lift.name}
        </Space>
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

export const MemoizedLiftCard = React.memo(LiftCard);