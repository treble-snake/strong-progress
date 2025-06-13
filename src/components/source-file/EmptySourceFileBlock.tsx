'use client';
import {Flex, Typography} from "antd";
import React from "react";
import {SourceFileUpload} from "@/components/source-file/SourceFileUpload";
import Image from "next/image";
import Link from "next/link";
import {
  DataParsingSettings
} from "@/components/source-file/DataParsingSettings";

const {Paragraph, Title} = Typography;

export function EmptySourceFileBlock() {
  return (
    <div style={{textAlign: 'center'}}>
      <Paragraph>
        Hi! 👋 <br/>
        This website is designed to help you analyze your workout history
        exported from the Strong app (<Link href={'/about'}>read more</Link>).
        <br/>
        To start using the website, export the data from your Strong app and
        upload the file here.
      </Paragraph>
      <Paragraph>
        <SourceFileUpload/>
      </Paragraph>
      <Paragraph>
        <DataParsingSettings/>
      </Paragraph>
      <Paragraph>
        You can always upload a new version of the file using
        the <b>New File</b> button in the main menu.
      </Paragraph>
      <Paragraph>
        <Title level={3}>Steps to export data from the Strong app</Title>
        <ol style={{maxWidth: 500, margin: '0 auto', textAlign: 'left'}}>
          <li>Select <b>Profile</b> tab in the bottom menu</li>
          <li>Click the <b>Gear</b> icon at the top left corner of the screen
          </li>
          <li>Scroll down to the <b>Data management</b> section and click <b>Export
            Strong Data</b></li>
        </ol>
      </Paragraph>
      <Flex justify={'center'} gap={32}>
        <Image src={'/img/app-export/step-1.png'} width={350} height={723}
               alt={'Step 1-2'}/>
        <Image src={'/img/app-export/step-2.png'} width={350} height={723}
               alt={'Step 3'}/>
      </Flex>
    </div>
  )
    ;
}