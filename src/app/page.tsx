'use client';
import React from 'react';
import {
  ProgressAnalysisPage
} from "@/components/progressive-overload/ProgressAnalysisPage";
import {WithLiftHistory} from "@/components/layout/WithLiftHistory";

export default function Home() {
  return (
    <WithLiftHistory>
      <ProgressAnalysisPage/>
    </WithLiftHistory>
  )
}
