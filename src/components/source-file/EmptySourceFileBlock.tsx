'use client';
import {Flex, Typography, Tabs} from "antd";
import React from "react";
import {SourceFileUpload} from "@/components/source-file/SourceFileUpload";
import Image from "next/image";
import Link from "next/link";
import {
  DataParsingSettings
} from "@/components/source-file/DataParsingSettings";

const {Paragraph, Title} = Typography;

export function EmptySourceFileBlock() {

  const strongInstructions = (
    <>
      <ol style={{maxWidth: 500, margin: '0 auto', textAlign: 'left'}}>
        <li>Select <b>Profile</b> tab in the bottom menu</li>
        <li>Tap the <b>Gear</b> icon at the top left corner of the screen</li>
        <li>Scroll down to the <b>Data management</b> section and click <b>Export Strong Data</b></li>
      </ol>
      <Flex justify={'center'} gap={32} style={{marginTop: 24}}>
        <Image src={'/img/app-export/step-1.png'} width={350} height={723}
               alt={'Step 1-2'}/>
        <Image src={'/img/app-export/step-2.png'} width={350} height={723}
               alt={'Step 3'}/>
      </Flex>
    </>
  );

  const hevyInstructions = (
    <>
      <ol style={{maxWidth: 500, margin: '0 auto', textAlign: 'left'}}>
        <li>Select <b>Profile</b> tab in the bottom menu</li>
        <li>Tap the <b>Gear</b> icon at the top right corner of the screen</li>
        <li>Scroll down and tap <b>Export & Import Data</b></li>
        <li>Tap <b>Export Data</b></li>
        <li>Tap <b>Export Workouts</b> - you might have to wait a bit before it&apos;s complete</li>
      </ol>
      <Flex justify={'center'} gap={32} style={{marginTop: 24}}>
        <Image src={'/img/app-export/hevy/1.png'} width={350} height={723}
               alt={'Step 1-2'}/>
        <Image src={'/img/app-export/hevy/2.png'} width={350} height={723}
               alt={'Step 3'}/>
        <Image src={'/img/app-export/hevy/3.png'} width={350} height={723}
               alt={'Step 4-5'}/>
      </Flex>
    </>
  );

  const tabItems = [
    {
      key: 'strong',
      label: 'Strong App',
      children: strongInstructions
    },
    {
      key: 'hevy',
      label: 'Hevy App',
      children: hevyInstructions
    }
  ];

  return (
    <div style={{textAlign: 'center'}}>
      <Paragraph style={{maxWidth: 800, marginLeft: 'auto', marginRight: 'auto'}}>
        Hi! 👋 <br/>
        This website is designed to help you analyze your workout history
        exported from workout tracking apps (<Link href={'/about'}>read more</Link>) -
        currently Strong and Hevy are supported.
        <br/>
        To start using the website, export the data from your workout app (see instructions below) and
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

      <div style={{marginTop: 16}}>
        <Title level={3}>How to export data from...</Title>
        <Tabs
          defaultActiveKey="strong"
          items={tabItems}
          centered
          style={{maxWidth: 800, margin: '0 auto'}}
        />
      </div>
    </div>
  );
}