import {useProgressByActivity} from '@/components/api/hooks';
import {Empty, Flex, Select} from 'antd';
import React, {useMemo, useState} from 'react';
import {MemoizedLiftCard} from '@/components/progressive-overload/LiftCard';
import {LiftActivityStatus, LiftHistory, LiftProgressStatus} from '@/types';
import {NoDataLoaded} from '@/components/common/Loading';
import {
  ProgressStatusFilter
} from '@/components/progressive-overload/ProgressStatusFilter';


const getSessionsOptions = (data: LiftHistory[] | undefined) => {
  if (!data) {
    return [];
  }
  const uniqueSessions = Array.from(new Set(data.flatMap(exercise => exercise.sessionNames)));
  return uniqueSessions.map(session => ({
    label: session,
    value: session
  })).sort((a, b) => a.label.localeCompare(b.label));
}

const getLiftOptions = (
  data: LiftHistory[] | undefined,
  selectedSessions: string[] = []
) => {
  if (!data) {
    return [];
  }
  return data
    .filter(lift => {
      return selectedSessions.length === 0 ?
        true :
        selectedSessions.some(sess => lift.name.endsWith(sess));
    })
    .map(exercise => ({
      label: exercise.name,
      value: exercise.name
    })).sort((a, b) => a.label.localeCompare(b.label));
}

export function ActiveLiftsList() {
  const {data, error, isLoading} =
    useProgressByActivity({activityStatus: LiftActivityStatus.Active});
  const [selectedLifts, setSelectedLifts] = useState<string[]>([]);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [selectedProgress, setSelectedProgress] = useState<LiftProgressStatus[]>([]);

  const sessionsOptions = useMemo(() => getSessionsOptions(data), [data]);
  const liftOptions = useMemo(() => getLiftOptions(data, selectedSessions), [data, selectedSessions]);

  const liftsToShow = useMemo(() => {
    if (!data || selectedLifts.length === 0 && selectedSessions.length === 0 && selectedProgress.length === 0) {
      return data || [];
    }

    return data.filter((lift) => {
      let result = true;
      if (selectedLifts.length > 0) {
        result = result && selectedLifts.includes(lift.name);
      }
      if (result && selectedSessions.length > 0) {
        result = result && lift.sessionNames.some(session => selectedSessions.includes(session));
      }
      if (result && selectedProgress.length > 0) {
        result = result && selectedProgress.includes(lift.progressStatus);
      }
      return result;
    });
  }, [selectedSessions, selectedLifts, selectedProgress, data]);

  if (isLoading || error || !data) {
    return <NoDataLoaded error={error} isLoading={isLoading}/>
  }


  return (
    <>
      <Flex>
        <Select
          mode='multiple'
          allowClear
          style={{width: '30%', marginBottom: 16}}
          placeholder='Filter by Training Session (show all if none selected)'
          value={selectedSessions}
          onChange={setSelectedSessions}
          options={sessionsOptions}
        />
        <ProgressStatusFilter
          selectedProgress={selectedProgress}
          setSelectedProgress={setSelectedProgress}/>
      </Flex>
      <Select
        mode='multiple'
        allowClear
        style={{width: '100%', marginBottom: 16}}
        placeholder='Filter by lift (show all if none selected)'
        value={selectedLifts}
        onChange={setSelectedLifts}
        options={liftOptions}
      />
      {
        liftsToShow.length === 0 ?
          <Empty description={
            data.length === 0 ?
              'No active lifts found' :
              'No lifts match the selected filters'
          }/> :
          <Flex style={{width: '100%'}} wrap='wrap' justify='start'>
            {liftsToShow.map((exercise, index) => (
              <MemoizedLiftCard key={`active-${index}`} lift={exercise}/>
            ))}
          </Flex>
      }
    </>
  )
}