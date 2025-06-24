'use client';
import {Divider, Menu, Space, Tooltip} from "antd";
import React from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {ExportOutlined, RedditOutlined} from "@ant-design/icons";
import {SourceFileUpload} from "@/components/source-file/SourceFileUpload";
import {GlobalSettings} from "@/components/navigation/GlobalSettings";
import {RedditUrl} from "@/constants";

const {Compact} = Space;

export function MainMenu() {
  const pathname = usePathname()
  // might be useful for future development
  // const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';

  const selectedKeys = pathname === '/' ? ['progress-analysis'] : [pathname.replace('/', '')];
  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={selectedKeys}
      defaultSelectedKeys={['1']}
      style={{flex: 1, minWidth: 0}}
      items={[
        {
          key: 'upload', label: (
            <Compact>
              <SourceFileUpload text={'New File'}/>
              <GlobalSettings/>
            </Compact>
          )
        },
        {
          key: 'progress-analysis', label:
            <Link href={'/'}>
              Progress Analysis
            </Link>
        },
        {
          key: 'weekly-volume', label: (
            <Link href={'/weekly-volume'}>
              Weekly Volume
            </Link>
          )
        },
        {
          key: 'top-set', label: (
            <Tooltip title={'Coming soon... Hopefully :D'}>Top Set
              Performance</Tooltip>
          ),
          disabled: true
        },
        {
          key: 'about', label:
            <Link href={'/about'}>About</Link>
        },
        {
          key: 'divider',
          label: <Divider type={'vertical'}
                          style={{backgroundColor: '#f6f2eb'}}/>,
        },
        {
          key: 'workout-builder', icon: <ExportOutlined/>, label: (
            <Tooltip
              title={'Another half-done/half-dead pet project of mine 😅️️️️️ Will probably try to combine these if I ever have time.'}>
              <Link href={'https://icebreaker-bicep.srms.club/'}
                    target={'_blank'} rel={'noopener noreferrer'}>
                Workout Builder
              </Link>
            </Tooltip>
          )
        },
        {
          key: 'reddit', icon: <RedditOutlined/>, label: (
            <Tooltip title={'Get in touch and let me know what you think ^_^'}>
              <Link href={RedditUrl} target={'_blank'}
                    rel={'noopener noreferrer'}>
                Reddit
              </Link>
            </Tooltip>
          )
        }
      ]}
    />
  )
}