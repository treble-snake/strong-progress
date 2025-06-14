'use client';
import React, {useState} from 'react';
import {
  ProgressAnalysisPage
} from "@/components/progressive-overload/ProgressAnalysisPage";
import {
  lastUploadedDateAtom,
  rawLiftHistoryAtom,
  rawLiftHistoryLoadingAtom
} from "@/components/data/atoms";
import {useAtomValue} from "jotai";
import {
  EmptySourceFileBlock
} from "@/components/source-file/EmptySourceFileBlock";
import {NoDataLoaded} from "@/components/common/Loading";
import {Button, Popover, Space, Tag, Tooltip, Typography} from "antd";
import {QuestionCircleTwoTone, SettingOutlined} from "@ant-design/icons";
import {format} from 'date-fns';
import {
  ParsingSettingsModal
} from "@/components/progressive-overload/ParsingSettingsModal";

const {Text, Title} = Typography;

export default function Home() {
  const lastUploadDate = useAtomValue(lastUploadedDateAtom);
  const liftHistory = useAtomValue(rawLiftHistoryAtom)
  const {isLoading, error} = useAtomValue(rawLiftHistoryLoadingAtom)
  const [isParsingModalOpen, setIsParsingModalOpen] = useState(false);
  const openParsingModal = () => setIsParsingModalOpen(true);
  const closeParsingModal = () => setIsParsingModalOpen(false);

  if (isLoading || error) {
    console.warn('Progressive Overload page loading or error:', isLoading, error);
    return <NoDataLoaded error={error} isLoading={isLoading}/>
  }

  let lastUploadedTag = null;
  if (lastUploadDate) {
    try {
      lastUploadedTag = <Tag>
        Data Uploaded {format(parseInt(lastUploadDate), "PPpp")}
      </Tag>
    } catch (error) {
      console.warn(error);
    }
  }

  console.debug('Progressive Overload page loaded with data:', liftHistory.length, 'lifts');
  return (
    <>
      <ParsingSettingsModal isOpen={isParsingModalOpen}
                            onClose={closeParsingModal}/>
      <Title level={1}>
        <Space>
          <span>Progress Analysis</span>
          <Popover
            style={{maxWidth: 600}}
            title={<>
              This page shows an overview of your lifts and
              how they’re performing - spot any potential issues right
              away
            </>} content={
            <Text>
              Same lifts from different sessions are tracked separately, as
              the exercise order may affect performance.
              <br/>
              The <b>Active</b> tab highlights lifts you’ve done recently,
              helping you
              gauge what’s progressing well and what isn’t,
              <br/>
              spot potential or actual issues in your
              current training, so you can correct the course.
              <br/>
              The <b>New</b> tab is just lifts without enough data yet, and<
              br/>
              the <b>History</b> includes lifts you haven’t done in a while —
              could be useful for
              retrospective review.
            </Text>
          }>
            <QuestionCircleTwoTone/>
          </Popover>
          <Tooltip title={'Parsing & UI settings'}>
            <Button icon={<SettingOutlined/>} onClick={openParsingModal}/>
          </Tooltip>
          {lastUploadedTag}
        </Space>
      </Title>
      {
        liftHistory.length === 0 ?
          <EmptySourceFileBlock/> :
          <ProgressAnalysisPage/>
      }
    </>
  )
}
