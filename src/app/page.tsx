'use client';
import React, {useEffect, useState} from 'react';
import {Divider, Flex, Spin, Typography} from 'antd';
import { LiftCard } from '@/components/LiftCard';
import {ProgressStatus} from '@/types';

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
  isActive: boolean;
  lastPerformedDate: string;
}

export default function Home() {
  const [workoutData, setWorkoutData] = useState<ExerciseData[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Separate active and history lifts
  const activeLifts = workoutData.filter(exercise => exercise.isActive);
  const historyLifts = workoutData.filter(exercise => !exercise.isActive);

  return (
    <>
      <Title level={2}>Progress Analysis</Title>

      {loading ? (
        <Spin size="large" fullscreen={true}/>
      ) : (
        <>
          {/* Active Lifts Section */}
          <Title level={3}>Active Lifts ({activeLifts.length})</Title>
          <Flex style={{width: '100%'}} wrap="wrap" justify="start">
            {activeLifts.map((exercise, index) => (
              <LiftCard key={`active-${index}`} exercise={exercise} />
            ))}
          </Flex>

          {historyLifts.length > 0 && (
            <>
              <Divider style={{ margin: '32px 0 16px' }} />
              
              {/* History Lifts Section */}
              <Title level={3}>History ({historyLifts.length})</Title>
              <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
                Exercises not performed in the last 14 days
              </Text>
              <Flex style={{width: '100%'}} wrap="wrap" justify="start">
                {historyLifts.map((exercise, index) => (
                  <LiftCard key={`history-${index}`} exercise={exercise} />
                ))}
              </Flex>
            </>
          )}
        </>
      )}
    </>
  );
}
