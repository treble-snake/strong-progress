'use client';
import React from 'react';
import {
  ProgressAnalysisPage
} from "@/components/progressive-overload/ProgressAnalysisPage";
import {
  rawLiftHistoryAtom,
  rawLiftHistoryLoadingAtom
} from "@/components/data/atoms";
import {useAtomValue} from "jotai";
import {
  EmptySourceFileBlock
} from "@/components/source-file/EmptySourceFileBlock";
import {NoDataLoaded} from "@/components/common/Loading";
import {Popover, Typography} from "antd";
import {QuestionCircleTwoTone} from "@ant-design/icons";

const {Text} = Typography;

export default function Home() {
  const liftHistory = useAtomValue(rawLiftHistoryAtom)
  const {isLoading, error} = useAtomValue(rawLiftHistoryLoadingAtom)
  if (isLoading || error) {
    return <NoDataLoaded error={error} isLoading={isLoading}/>
  }
  return (
    <>
      <Typography.Title level={1}>
        Progress Analysis{' '}
        <Popover
          style={{maxWidth: 600}}
          title={<>
            This page shows an overview of your lifts and
            how they’re performing - spot any potential issues right
            away
          </>} content={
          <Text>
            Same lifts from different sessions are tracked separately, as
            the exercise order may affect performance.
            <br/>
            The <b>Active</b> tab highlights lifts you’ve done recently,
            helping you
            gauge what’s progressing well and what isn’t,
            <br/>
            spot potential or actual issues in your
            current training, so you can correct the course.
            <br/>
            The <b>New</b> tab is just lifts without enough data yet, and<
            br/>
            the <b>History</b> includes lifts you haven’t done in a while —
            could be useful for
            retrospective review.
          </Text>
        }>
          <QuestionCircleTwoTone/>
        </Popover>
      </Typography.Title>
      {
        liftHistory.length === 0 ?
          <EmptySourceFileBlock/> :
          <ProgressAnalysisPage/>
      }
    </>
  )
}
