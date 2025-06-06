import {useProgressiveOverloadHistory} from "@/app/components/api/hooks";
import {Flex, Select} from "antd";
import React, {useMemo, useState} from "react";
import {LiftCard} from "@/app/components/progressive-overload/LiftCard";
import {LiftActivityStatus, LiftHistory} from "@/types";
import {NoDataLoaded} from "@/app/components/common/Loading";


const getSessionsOptions = (data: LiftHistory[] | undefined) => {
  if (!data) {
    return [];
  }
  const uniqueSessions = Array.from(new Set(data.flatMap(exercise => exercise.sessions)));
  return uniqueSessions.map(session => ({
    label: session,
    value: session
  })).sort((a, b) => a.label.localeCompare(b.label));
}

const getLiftOptions = (data: LiftHistory[] | undefined) => {
  if (!data) {
    return [];
  }
  return data.map(exercise => ({
    label: exercise.name,
    value: exercise.name
  })).sort((a, b) => a.label.localeCompare(b.label));
}


export function ActiveLiftsList() {
  const {data, error, isLoading} =
    useProgressiveOverloadHistory({activityStatus: LiftActivityStatus.Active});
  const [selectedLifts, setSelectedLifts] = useState<string[]>([]);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);

  const sessionsOptions = useMemo(() => getSessionsOptions(data), [data]);
  const liftOptions = useMemo(() => getLiftOptions(data), [data]);

  const liftsToShow = useMemo(() => {
    if (selectedLifts.length === 0 && selectedSessions.length === 0) {
      return data || [];
    }
    if (!data) {
      return [];
    }
    return data.filter((lift) => {
      let result = true;
      if (selectedLifts.length > 0) {
        result = result && selectedLifts.includes(lift.name);
      }
      if (selectedSessions.length > 0) {
        result = result && lift.sessions.some(session => selectedSessions.includes(session));
      }
      return result;
    });
  }, [selectedSessions, selectedLifts, data]);

  if (isLoading || error || !data) {
    return <NoDataLoaded error={error} isLoading={isLoading}/>
  }


  return (
    <>
      <Select
        mode="multiple"
        allowClear
        style={{width: '100%', marginBottom: 16}}
        placeholder="Filter by lift (show all if none selected)"
        value={selectedLifts}
        onChange={setSelectedLifts}
        options={liftOptions}
      />
      <Select
        mode="multiple"
        allowClear
        style={{width: '100%', marginBottom: 16}}
        placeholder="Filter by Training Session (show all if none selected)"
        value={selectedSessions}
        onChange={setSelectedSessions}
        options={sessionsOptions}
      />
      <Flex style={{width: '100%'}} wrap="wrap" justify="start">
        {liftsToShow.map((exercise, index) => (
          <LiftCard key={`active-${index}`} lift={exercise}/>
        ))}
      </Flex>
    </>
  )
}