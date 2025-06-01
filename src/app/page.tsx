'use client';
import React, {useEffect, useState} from 'react';
import {Card, Flex, Spin, Tag, theme, Timeline, Typography} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
  QuestionCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PauseOutlined,
  MinusOutlined, WarningOutlined, FlagOutlined
} from '@ant-design/icons';
import { ProgressStatus } from '../types';

const {Title, Text} = Typography;

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

const getProgressStatusIcon = (status?: ProgressStatus) => {
  switch (status) {
    case ProgressStatus.Progressing:
      return <ArrowUpOutlined style={{color: 'green', marginRight: 8}} />;
    case ProgressStatus.NeedsAttention:
      return <FlagOutlined style={{color: 'orange', marginRight: 8}} />;
    case ProgressStatus.Plateaued:
      return <WarningOutlined style={{color: 'gold', marginRight: 8}} />;
    case ProgressStatus.Regressing:
      return <ArrowDownOutlined style={{color: 'red', marginRight: 8}} />;
    default:
      return <Tag>{status}</Tag>;
  }
};

export default function Home() {
  const [workoutData, setWorkoutData] = useState<ExerciseData[]>([]);
  const [loading, setLoading] = useState(true);
  const {token} = theme.useToken();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/parsed-workout-data.json');
        const data = await response.json();
        setWorkoutData(data);
      } catch (error) {
        console.error('Error fetching workout data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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

  return (
    <>
      <Title level={2}>Progress Analysis</Title>

      {loading ? (
        <Spin size="large" fullscreen={true}/>
      ) : (
        <Flex style={{width: '100%'}} wrap="wrap" justify="start">
          {workoutData.map((exercise, index) => (
            <Card
              key={index}
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
                items={Object.values(exercise.dateGroups)
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((dateGroup) => ({
                    color: getPerformanceColor(dateGroup.overallPerformance),
                    label: dateGroup.date,
                    children: (
                      <div>
                        <Text strong style={{
                          color: getPerformanceColor(dateGroup.overallPerformance),
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          {dateGroup.overallPerformance}
                        </Text>
                        <div style={{
                          marginTop: '4px',
                          color: token.colorBgContainer === '#ffffff'
                            ? 'rgba(0, 0, 0, 0.65)'
                            : 'rgba(255, 255, 255, 0.65)'
                        }}>
                          <Text>Top Set: {dateGroup.exercises[0].weight}kg
                            × {dateGroup.exercises[0].reps} reps</Text>
                        </div>
                      </div>
                    ),
                    dot: getPerformanceIcon(dateGroup.overallPerformance)
                  }))}
              />
            </Card>
          ))}
        </Flex>
      )}
    </>
  );
}
