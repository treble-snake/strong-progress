import {useProgressByActivity} from "@/components/api/hooks";
import {LiftActivityStatus} from "@/types";
import {Alert, Flex} from "antd";
import {LiftCard} from "@/components/progressive-overload/LiftCard";
import React from "react";
import {NoDataLoaded} from "@/components/common/Loading";

type InactiveLiftsListProps = {
  activityStatus: LiftActivityStatus;
  title: string;
}

export function InactiveLiftsList(
  {activityStatus}: InactiveLiftsListProps
) {
  // const {
  //   data,
  //   error,
  //   isLoading
  // } = useProgressByActivity({activityStatus});
  const data = useProgressByActivity({activityStatus});
  // if (isLoading || error || !data) {
  //   return <NoDataLoaded error={error} isLoading={isLoading}/>
  // }

  const liftsToShow = data.slice(0, 50)

  return (
    <>
      {
        liftsToShow.length < data.length && (
          <Alert
            type="warning"
            message={`Showing only the first ${liftsToShow.length} of ${data.length} lifts`}
            style={{marginBottom: 16}}
          />
        )
      }
      <Flex style={{width: '100%'}} wrap="wrap" justify="start">
        {liftsToShow.map((exercise, index) => (
          <LiftCard key={`active-${index}`} lift={exercise}/>
        ))}
      </Flex>
    </>
  )
}