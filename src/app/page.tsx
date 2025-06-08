'use client';
import React from 'react';
import {
  MainProgressiveOverloadPage
} from "@/components/progressive-overload/MainProgressiveOverloadPage";
import {
  rawLiftHistoryAtom,
  rawLiftHistoryLoadingAtom
} from "@/components/data/atoms";
import {useAtomValue} from "jotai";
import {
  SourceFileSelectPage
} from "@/components/source-file/SourceFileSelectPage";
import {NoDataLoaded} from "@/components/common/Loading";
import {Typography} from "antd";

export default function Home() {
  const liftHistory = useAtomValue(rawLiftHistoryAtom)
  const {isLoading, error} = useAtomValue(rawLiftHistoryLoadingAtom)
  if (isLoading || error) {
    return <NoDataLoaded error={error} isLoading={isLoading}/>
  }
  return (
    <>
      <Typography.Title level={2}>Progressive Overload Analysis</Typography.Title>
      {
        liftHistory.length === 0 ?
          <SourceFileSelectPage/> :
          <MainProgressiveOverloadPage/>
      }
    </>
  )
}
