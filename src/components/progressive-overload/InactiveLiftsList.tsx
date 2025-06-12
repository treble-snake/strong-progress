import {useProgressByActivity} from "@/components/api/hooks";
import {LiftActivityStatus} from "@/types";
import {Alert, Flex} from "antd";
import {MemoizedLiftCard} from "@/components/progressive-overload/LiftCard";
import React from "react";

type InactiveLiftsListProps = {
  activityStatus: LiftActivityStatus;
  title: string;
}

export default function InactiveLiftsList(
  {activityStatus}: InactiveLiftsListProps
) {
  const data = useProgressByActivity({activityStatus});
  const liftsToShow = data.slice(0, 30)

  return (
    <>
      <Alert
        type="warning"
        message={
          (liftsToShow.length < data.length ?
          `Showing only ${liftsToShow.length} of ${data.length} lifts as an example.` :
          'The page is work in progress.') +
          ' This section will be improved in the future.'
        }
        style={{marginBottom: 16}}
      />
      <Flex style={{width: '100%'}} wrap="wrap" justify="start">
        {liftsToShow.map((exercise) => {
          const key = `${activityStatus}-${exercise.name.replaceAll(' ', '-')}`;
          return <MemoizedLiftCard key={key} lift={exercise}/>
        })}
      </Flex>
    </>
  )
}