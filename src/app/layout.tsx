import '@ant-design/v5-patch-for-react-19';
import React from 'react';
import dynamic from "next/dynamic";
import {Analytics} from "@vercel/analytics/next"
import {Metadata} from "next";
import {AntdRegistry} from "@ant-design/nextjs-registry";

const MainLayoutLoader = dynamic(() => import('../components/layout/MainLayoutLoader'))

export const metadata: Metadata = {
  title: "Strong Progress",
  description: "Analyze your Strong app workout logs to assess your progress, identify areas for improvement and make better gains.",
}

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body style={{margin: 0, padding: 0}}>
    <AntdRegistry>
      <MainLayoutLoader>
        {children}
      </MainLayoutLoader>
      <Analytics/>
    </AntdRegistry>
    </body>
    </html>
  );
}
