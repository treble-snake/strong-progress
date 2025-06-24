import {Alert, App as AntdApp, ConfigProvider, Layout, Space} from "antd";
import {MainMenu} from "@/components/navigation/MainMenu";
import {Provider as JotaiProvider} from "jotai";
import {AntdRegistry} from "@ant-design/nextjs-registry";
import React from "react";
import Link from "next/link";
import {GithubOutlined, RedditOutlined} from "@ant-design/icons";
import {GithubUrl, RedditUrl} from "@/constants";

const {Header, Content, Footer} = Layout;

export default function MainLayout({children}: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <AntdRegistry>
        <ConfigProvider
          theme={{
            token: {
              fontSizeHeading1: 24,
              lineHeightHeading1: 1,
              fontSizeHeading2: 20,
              lineHeightHeading2: 1,
              fontSizeHeading3: 16,
              lineHeightHeading3: 1,
            },
            components: {
              Timeline: {
                itemPaddingBottom: 6
              },
            },
          }}
        >
          <AntdApp>
            <Layout style={{minHeight: '100vh'}}>
              <Header style={{display: 'flex', alignItems: 'center'}}>
                <Link href="/">
                  <div
                    style={{
                      color: '#f6f2eb',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      paddingLeft: 64,
                      background: 'url(/img/logo.png) no-repeat left center',
                      width: 180,
                      lineHeight: 1
                    }}>
                    Strong Progress
                  </div>
                </Link>
                <MainMenu/>
              </Header>
              <Alert banner showIcon type={'warning'} message={
                'This is an early alpha and work is ongoing - please bear with me as I work on it and don\'t hesitate to get in touch! 😊'
              }/>
              <Content style={{padding: '8px 48px'}}>
                {children}
              </Content>
              <Footer style={{textAlign: 'center'}}>
                <Space>
                  <span>Strong Progress ©{new Date().getFullYear()} by Cap</span>
                  <span>|</span>
                  <Link href={RedditUrl} target={'_blank'}
                        rel={'noopener noreferrer'}>
                    <RedditOutlined/> Reddit
                  </Link><span>|</span>
                  <Link href={GithubUrl}
                        target={'_blank'}
                        rel={'noopener noreferrer'}>
                    <GithubOutlined/> GitHub
                  </Link>
                </Space>
              </Footer>
            </Layout>
          </AntdApp>
        </ConfigProvider>
      </AntdRegistry>
    </JotaiProvider>
  )
}