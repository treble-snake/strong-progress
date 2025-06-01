'use client';
import React, {useEffect, useState} from 'react';
import {Divider, Flex, Select, Spin, Typography} from 'antd';
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
  const [selectedLifts, setSelectedLifts] = useState<string[]>([]);

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

  // Get all unique lift names for the select options
  const liftOptions = workoutData
    .map(exercise => ({
      label: exercise.label,
      value: exercise.label
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  // Filter workout data based on selected lifts
  const filterWorkoutData = (data: ExerciseData[]) => {
    if (selectedLifts.length === 0) {
      return data; // Show all if nothing selected
    }
    return data.filter(exercise => selectedLifts.includes(exercise.label));
  };

  // Separate active and history lifts after filtering
  const filteredWorkoutData = filterWorkoutData(workoutData);
  const activeLifts = filteredWorkoutData.filter(exercise => exercise.isActive);
  const historyLifts = filteredWorkoutData.filter(exercise => !exercise.isActive);

  return (
    <>
      <Title level={2}>Progress Analysis</Title>
      
      {/* Lift filter select */}
      <Select
        mode="multiple"
        allowClear
        style={{ width: '100%', marginBottom: 16 }}
        placeholder="Filter by lift (show all if none selected)"
        value={selectedLifts}
        onChange={setSelectedLifts}
        options={liftOptions}
        maxTagCount={5}
      />

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
