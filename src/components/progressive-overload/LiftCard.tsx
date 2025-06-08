import React, {useState} from 'react';
import {Button, Card, Space} from 'antd';
import {LiftHistory} from '@/types';
import {ProgressStatusIcon} from "./ProgressStatusIcon";
import {LiftHistoryTimeline} from './LiftHistoryTimeline';
import {DownOutlined, UpOutlined} from "@ant-design/icons";

interface LiftCardProps {
  lift: LiftHistory;
}

export const LiftCard: React.FC<LiftCardProps> = ({lift}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleTimelineExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  console.debug('Rendering LiftCard for:', lift.name);

  const workouts = lift.workouts;
  const firstWorkouts = workouts.slice(-5);
  const otherWorkouts = workouts.slice(0, -5);
  const hasMoreEntries = workouts.length > 5;

  const expansionButton = hasMoreEntries && (
    <div style={{margin: '0 auto', textAlign: 'center'}}>
      <Button icon={
        isExpanded ? <UpOutlined/> : <DownOutlined/>
      } onClick={toggleTimelineExpansion}>
        {isExpanded ? "Show Recent Only" : "Show All History"}
      </Button>
    </div>
  )

  return (
    <Card
      title={
        <Space>
          <ProgressStatusIcon status={lift.progressStatus}/>
          {lift.name}
        </Space>
      }
      style={{marginRight: 8, marginBottom: 8, flex: '1 1 300px'}}
    >
      <LiftHistoryTimeline visibleWorkouts={firstWorkouts}/>
      {expansionButton}
      {
        isExpanded && otherWorkouts.length > 0 && (
          <div style={{marginTop: 32}}>
            <LiftHistoryTimeline
              visibleWorkouts={otherWorkouts}
            />
            {expansionButton}
          </div>
        )
      }
    </Card>
  );
};

export const MemoizedLiftCard = React.memo(LiftCard);
