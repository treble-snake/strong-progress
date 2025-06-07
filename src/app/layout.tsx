'use client';
import {AntdRegistry} from '@ant-design/nextjs-registry';
import React from 'react';
import {Alert, ConfigProvider, Layout} from 'antd';
import "./globals.css";
import {MainMenu} from "@/components/navigation/MainMenu";

const {Header, Content, Footer} = Layout;

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body style={{margin: 0, padding: 0}}>
    <AntdRegistry>
      <ConfigProvider
        theme={{
          components: {
            Timeline: {
              itemPaddingBottom: 6
            },
          },
        }}
      >
        <Layout style={{minHeight: '100vh'}}>
          <Header style={{display: 'flex', alignItems: 'center'}}>
            <div
              style={{
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                paddingRight: 48
              }}>
              Strong Progress
            </div>
            <MainMenu/>
          </Header>
          <Alert banner showIcon type={'warning'} message={
            'This is an early alpha and work is ongoing'
          }/>
          <Content style={{padding: '0px 48px'}}>
            {children}
          </Content>
          <Footer style={{textAlign: 'center'}}>
            Strong Progress Tracker ©{new Date().getFullYear()} by Cap
          </Footer>
        </Layout>
      </ConfigProvider>
    </AntdRegistry>
    </body>
    </html>
  );
}
