'use client';
import {Menu, Tooltip} from "antd";
import React from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {ExportOutlined} from "@ant-design/icons";
import {SourceFileUpload} from "@/components/source-file/SourceFileUpload";

export function MainMenu() {
  const pathname = usePathname()
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
            <SourceFileUpload text={'New File'}/>
          )
        },
        {
          key: 'progress-analysis', label:
            <Link href={'/'}>
              Progress Analysis
            </Link>
        },
        {key: 'top-set', label: 'Top Set Performance', disabled: true},
        {key: 'volume', label: 'Weekly Volume', disabled: true},
        {
          key: 'about', label:
            <Link href={'/about'}>About</Link>
        },
        {
          key: 'workout-builder', label: (
            <Tooltip title={'Another half-done/half-dead pet project of mine 😅️️️️️ Will probably try to combine these if I ever have time.'}>
              <Link href={'https://icebreaker-bicep.srms.club/'}
                    target={'_blank'} rel={'noopener noreferrer'}>
                Workout Builder <ExportOutlined/>
              </Link>
            </Tooltip>
          )
        }
      ]}
    />
  )
}