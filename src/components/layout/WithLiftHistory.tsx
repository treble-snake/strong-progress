import React from "react";
import {useAtomValue} from "jotai/index";
import {
  rawLiftHistoryAtom,
  rawLiftHistoryLoadingAtom
} from "@/components/data/atoms/root";
import {NoDataLoaded} from "@/components/common/Loading";
import {
  EmptySourceFileBlock
} from "@/components/source-file/EmptySourceFileBlock";

export function WithLiftHistory({
                                  children,
                                }: Readonly<{ children: React.ReactNode }>) {

  const liftHistory = useAtomValue(rawLiftHistoryAtom)
  const {isLoading, error} = useAtomValue(rawLiftHistoryLoadingAtom)
  if (isLoading || error) {

    console.warn('Progressive Overload page loading or error:', isLoading, error);
    return <NoDataLoaded error={error} isLoading={isLoading}/>
  }

  return liftHistory.length === 0 ?
    <EmptySourceFileBlock/> :
    children
}