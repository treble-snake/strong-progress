import React, {useState} from 'react';
import {Button, Card, Space} from 'antd';
import {LiftHistory} from '@/types';
import {ProgressStatusIcon} from "./ProgressStatusIcon";
import LiftHistoryTimeline from './LiftHistoryTimeline';
import {DownOutlined, UpOutlined} from "@ant-design/icons";
import {Loader} from "@/components/common/Loading";
import dynamic from "next/dynamic";
import {useAtomValue} from "jotai";
import {uiSettingsAtom, UnitSystem} from "@/components/data/atoms";

const LazyLiftHistoryTimeline = dynamic(() => import('./LiftHistoryTimeline'), {
  // ssr: false,
  loading: () => <Loader/>
})

interface LiftCardProps {
  lift: LiftHistory;
}

export const LiftCard: React.FC<LiftCardProps> = ({lift}) => {
  const {units} = useAtomValue(uiSettingsAtom);
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleTimelineExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  console.debug('Rendering LiftCard for:', lift.name);
  const weightUnit = units === UnitSystem.Metric ? 'kg' : 'lbs';

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
      hoverable
      title={
        <Space>
          <ProgressStatusIcon status={lift.progressStatus}/>
          {lift.name}
        </Space>
      }
      style={{marginRight: 8, marginBottom: 8, flex: '1 1 300px'}}
    >
      <LiftHistoryTimeline visibleWorkouts={firstWorkouts} weightUnit={weightUnit}/>
      {expansionButton}
      {
        isExpanded && otherWorkouts.length > 0 && (
          <div style={{marginTop: 32}}>
            <LazyLiftHistoryTimeline
              visibleWorkouts={otherWorkouts} weightUnit={weightUnit}
            />
            {expansionButton}
          </div>
        )
      }
    </Card>
  );
};

export const MemoizedLiftCard = React.memo(LiftCard);
