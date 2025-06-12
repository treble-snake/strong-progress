import {Alert, ConfigProvider, Layout} from "antd";
import {MainMenu} from "@/components/navigation/MainMenu";
import {Provider as JotaiProvider} from "jotai";
import {AntdRegistry} from "@ant-design/nextjs-registry";
import React from "react";

const {Header, Content, Footer} = Layout;

export default function MainLayout({children}: { children: React.ReactNode }) {
  return (
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
        <Layout style={{minHeight: '100vh'}}>
          <Header style={{display: 'flex', alignItems: 'center'}}>
            <div
              style={{
                color: '#f6f2eb',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                paddingRight: 48,
                paddingLeft: 64,
                background: 'url(/img/logo.png) no-repeat left center',
                width: 200,
                lineHeight: 1
              }}>
              Strong Progress
            </div>
            <MainMenu/>
          </Header>
          <Alert banner showIcon type={'warning'} message={
            'This is an early alpha and work is ongoing - please bear with me as I work on it and don\'t hesitate to get in touch! 😊'
          }/>
          <Content style={{padding: '0px 48px'}}>
            <JotaiProvider>
              {children}
            </JotaiProvider>
          </Content>
          <Footer style={{textAlign: 'center'}}>
            Strong Progress ©{new Date().getFullYear()} by Cap
          </Footer>
        </Layout>
      </ConfigProvider>
    </AntdRegistry>
  )
}