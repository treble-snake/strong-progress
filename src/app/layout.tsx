'use client';
import {AntdRegistry} from '@ant-design/nextjs-registry';
import React from 'react';
import {Geist, Geist_Mono} from "next/font/google";
import {Layout, Menu} from 'antd';
import "./globals.css";

const {Header, Content, Footer} = Layout;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={`${geistSans.variable} ${geistMono.variable}`}
          style={{margin: 0, padding: 0}}>
    <AntdRegistry>
      <Layout style={{minHeight: '100vh'}}>
        <Header style={{display: 'flex', alignItems: 'center'}}>
          <div style={{color: 'white', fontSize: '1.5rem', fontWeight: 'bold'}}>
            Strong Progress
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            items={[
              {key: '1', label: 'Dashboard'},
              {key: '2', label: 'Exercises'},
              {key: '3', label: 'Analytics'},
            ]}
            style={{marginLeft: 'auto'}}
          />
        </Header>
        <Content style={{padding: '24px 48px'}}>
          {children}
        </Content>
        <Footer style={{textAlign: 'center'}}>
          Strong Progress Tracker ©{new Date().getFullYear()} Created with Ant
          Design
        </Footer>
      </Layout>
    </AntdRegistry>
    </body>
    </html>
  );
}
