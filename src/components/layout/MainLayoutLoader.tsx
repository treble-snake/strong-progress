'use client';
import React from 'react';
import dynamic from "next/dynamic";
import {Loader} from "@/components/common/Loading";

// disable SSR for the app
// TODO: enable it for /about page
const MainLayout = dynamic(() => import('../layout/MainLayout'), {
  ssr: false,
  loading: () => <Loader fullscreen tip={'Finishing the warm-up set...'}/>
})

export default function MainLayoutLoader({
                                           children,
                                         }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
}
