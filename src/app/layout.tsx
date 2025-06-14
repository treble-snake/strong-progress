'use client';
import '@ant-design/v5-patch-for-react-19';
import React from 'react';
import "./globals.css";
import dynamic from "next/dynamic";
import {Loader} from "@/components/common/Loading";
import {Analytics} from "@vercel/analytics/next"

// disable SSR for the app
const MainLayout = dynamic(() => import('../components/layout/MainLayout'), {
  ssr: false,
  loading: () => <Loader fullscreen tip={'Finishing the warm-up set...'}/>
})

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body style={{margin: 0, padding: 0}}>
    <MainLayout>
      {children}
      <Analytics/>
    </MainLayout>
    </body>
    </html>
  );
}
