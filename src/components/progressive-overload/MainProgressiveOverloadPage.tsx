import {LiftActivityStatus} from "@/types";
import {Tabs} from "antd";
import React from "react";
import {
  ActiveLiftsList
} from "@/components/progressive-overload/ActiveLiftsList";
import {
  InactiveLiftsList
} from "@/components/progressive-overload/InactiveLiftsList";
import {useProgressiveOverloadCounts} from "@/components/api/hooks";


export function MainProgressiveOverloadPage() {
  const data = useProgressiveOverloadCounts()
  return (
    <>
      <Tabs
        defaultActiveKey={'active'}
        items={[
          {
            key: 'active',
            label: `Active Lifts (${data.activeCount})`,
            children: <ActiveLiftsList/>,
            disabled: data.activeCount === 0
          },
          {
            key: 'new',
            label: `New Lifts (${data.newCount})`,
            children: <InactiveLiftsList title={'New Lifts'}
                                         activityStatus={LiftActivityStatus.New}/>,
            disabled: data.newCount === 0
          },
          {
            key: 'history',
            label: `History Lifts (${data.historyCount})`,
            children: <InactiveLiftsList title={'History Lifts'}
                                         activityStatus={LiftActivityStatus.History}/>,
            disabled: data.historyCount === 0
          },
        ]}
      />
    </>
  );
}