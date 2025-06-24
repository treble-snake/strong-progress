'use client';

import React from 'react';
import {useParams, useRouter} from 'next/navigation';
import {
  Alert,
  Button,
  Card,
  Divider,
  Empty,
  List,
  Popover,
  Space,
  Statistic,
  Typography
} from 'antd';
import {
  ArrowLeftOutlined,
  InfoCircleOutlined,
  RedditOutlined,
  WarningOutlined
} from '@ant-design/icons';
import {useAtomValue} from 'jotai';
import {setsForWeeklyVolumeAtom} from '@/components/data/atoms';
import Link from "next/link";
import {RedditUrl} from "@/constants";

const {Title, Text} = Typography;

type TmpStats = {
  primary: string[];
  secondary: string[];
}

// Helper function to find exercises contributing to a muscle group
const getExercisesForMuscleGroup = (
  muscleGroup: string,
  liftMuscleGroups: Record<string, TmpStats>
): { primary: string[], secondary: string[] } => {
  const result = {primary: [] as string[], secondary: [] as string[]};

  Object.entries(liftMuscleGroups).forEach(([liftName, stats]) => {
    if (stats.primary.includes(muscleGroup)) {
      result.primary.push(liftName);
    } else if (stats.secondary.includes(muscleGroup)) {
      result.secondary.push(liftName);
    }
  });

  return result;
};

const MuscleGroupPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const muscleGroupName = decodeURIComponent(params.name as string);
  const weekVolume = useAtomValue(setsForWeeklyVolumeAtom);

  // Get average volume data for this muscle group
  const averageVolume = weekVolume.weeklyAverageByMuscleGroup[muscleGroupName];

  // Get exercises that contribute to this muscle group
  const exercises = getExercisesForMuscleGroup(muscleGroupName, weekVolume.liftMuscleGroups);

  // Get weekly volume data for this muscle group
  const weeklyVolume = Object.entries(weekVolume.weeks).map(([weekLabel, weekData]) => ({
    weekLabel,
    volume: weekData.muscleGroups[muscleGroupName] || {
      primary: 0,
      secondary: 0,
      fractional: 0
    }
  }));

  // If muscle group not found, show empty state
  if (!averageVolume) {
    return (
      <div>
        <Button
          type="link"
          icon={<ArrowLeftOutlined/>}
          onClick={() => router.push('/weekly-volume')}
          style={{marginBottom: 16}}
        >
          Back to Weekly Volume
        </Button>
        <Empty
          description={`No data found for muscle group: ${muscleGroupName}`}
          style={{marginTop: 48}}
        />
      </div>
    );
  }

  // Calculate fractional volume explanation
  const fractionalExplanation = (
    <div>
      <p>Fractional volume is calculated as:</p>
      <p>
        <strong>{averageVolume.primary} Direct</strong> + <strong>{averageVolume.secondary} Indirect</strong>/2
        = <strong>{averageVolume.fractional}</strong></p>
    </div>
  );

  return (
    <div>
      <Button
        type="link"
        icon={<ArrowLeftOutlined/>}
        onClick={() => router.push('/weekly-volume')}
        style={{marginBottom: 16}}
      >
        Back to Weekly Volume
      </Button>

      <Alert type={'error'} showIcon icon={<WarningOutlined/>} message={<>
        This page is super-duper early stage 🤣️️️️️️
        Basically a preview draft - I&apos;ll be working on it soon.
        Stay tuned for updates and get in touch on <Link target={'_blank'}
                                        href={RedditUrl}>
        <RedditOutlined/> Reddit
      </Link>!
      </>}/>

      <Title level={2}>{muscleGroupName} Details</Title>

      {/* Average Volume Section */}
      <Card title="Average Weekly Volume" style={{marginBottom: 24}}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <Statistic
              title="Direct volume"
              value={averageVolume.primary}
              valueStyle={{color: '#1890ff'}}
              style={{marginBottom: 0}}
            />
          </div>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <Statistic
              title="Fractional volume"
              value={averageVolume.fractional}
              valueStyle={{color: '#722ed1'}}
              style={{marginBottom: 0}}
              suffix={
                <Popover
                  content={fractionalExplanation}
                  title="Fractional Volume"
                  trigger="hover"
                >
                  <InfoCircleOutlined style={{
                    color: '#722ed1',
                    cursor: 'pointer',
                    marginLeft: 5
                  }}/>
                </Popover>
              }
            />
          </div>
        </div>
      </Card>

      {/* Contributing Exercises Section */}
      <Card title="Contributing Exercises" style={{marginBottom: 24}}>
        <div style={{marginBottom: 16}}>
          <Title level={4}>Direct Contributors</Title>
          {exercises.primary.length > 0 ? (
            <List
              bordered
              dataSource={exercises.primary}
              renderItem={item => (
                <List.Item>
                  <Text>{item}</Text>
                </List.Item>
              )}
            />
          ) : (
            <Empty description="No direct contributors found"/>
          )}
        </div>

        <Divider/>

        <div>
          <Title level={4}>Indirect Contributors</Title>
          {exercises.secondary.length > 0 ? (
            <List
              bordered
              dataSource={exercises.secondary}
              renderItem={item => (
                <List.Item>
                  <Text>{item}</Text>
                </List.Item>
              )}
            />
          ) : (
            <Empty description="No indirect contributors found"/>
          )}
        </div>
      </Card>

      {/* Weekly Volume Section */}
      <Card title="Volume Change Week-by-Week">
        {weeklyVolume.length > 0 ? (
          <List
            dataSource={weeklyVolume}
            renderItem={({weekLabel, volume}) => (
              <List.Item>
                <div style={{width: '100%'}}>
                  <Text strong>{weekLabel}</Text>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 8
                  }}>
                    <Space>
                      <Statistic
                        title="Direct"
                        value={volume.primary}
                        valueStyle={{color: '#1890ff'}}
                        style={{marginRight: 24}}
                      />
                      <Statistic
                        title="Indirect"
                        value={volume.secondary}
                        valueStyle={{color: '#52c41a'}}
                        style={{marginRight: 24}}
                      />
                      <Statistic
                        title="Fractional"
                        value={volume.fractional}
                        valueStyle={{color: '#722ed1'}}
                      />
                    </Space>
                  </div>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Empty description="No weekly data found"/>
        )}
      </Card>
    </div>
  );
};

export default MuscleGroupPage;