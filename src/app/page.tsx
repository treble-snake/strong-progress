'use client';
import React from 'react';
import {
  MainProgressiveOverloadPage
} from "@/components/progressive-overload/MainProgressiveOverloadPage";
import {rawLiftHistoryAtom} from "@/components/data/atoms";
import {useAtomValue} from "jotai";
import {SourceFileSelectPage} from "@/components/source-file/SourceFileSelectPage";

export default function Home() {
  const liftHistory = useAtomValue(rawLiftHistoryAtom)
  console.warn('Home page rendered, liftHistory length:', liftHistory.length);
  return (
    <>
      {
        liftHistory.length === 0 ?
          <SourceFileSelectPage/> :
          <MainProgressiveOverloadPage/>
      }
    </>
  )
}
