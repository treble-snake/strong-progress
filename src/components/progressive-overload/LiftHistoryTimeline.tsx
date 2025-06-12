import React from 'react';
import { Timeline, Tag, Typography } from 'antd';
import { format, parseISO } from 'date-fns';
import { LiftDayData, PerformanceChange } from '@/types';
import { NotesPopover } from './NotesPopover';
import { CheckCircleOutlined, CloseCircleOutlined, MinusCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { green, grey, orange, red } from '@ant-design/colors';

const { Text } = Typography;

interface LiftHistoryTimelineProps {
  visibleWorkouts: LiftDayData[];
}

const formatDate = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    return format(date, 'PP');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
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

export default function LiftHistoryTimeline({ visibleWorkouts }: LiftHistoryTimelineProps) {
  if (!visibleWorkouts || visibleWorkouts.length === 0) {
    return <Text>No workout entries to display.</Text>;
  }

  return (
    <Timeline
      mode="left"
      reverse
      items={visibleWorkouts.map((liftingDay) => ({
        color: getPerformanceColor(liftingDay.performanceChange),
        label: <Tag>{formatDate(liftingDay.date)}</Tag>,
        children: (
          <div>
            <Text strong style={{ color: getPerformanceColor(liftingDay.performanceChange) }}>
              {liftingDay.performanceChange}
              <NotesPopover session={liftingDay} />
            </Text>
            <div>
              {liftingDay.sets.map((exercise, i) => (
                <div key={i} style={{ marginBottom: i < liftingDay.sets.length - 1 ? 2 : 0 }}>
                  <Text>
                    {exercise.setMark}: {exercise.weight}kg × {exercise.reps}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        ),
        dot: getPerformanceIcon(liftingDay.performanceChange),
      }))}
    />
  );
};
