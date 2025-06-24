import {LiftActivityStatus} from "@/types";
import {Alert, Popover, Space, Tabs, Tag, Tooltip, Typography} from "antd";
import React, {Suspense} from "react";
import {
  ActiveLiftsList
} from "@/components/progressive-overload/ActiveLiftsList";
import {
  useProgressiveOverloadCounts,
  useUiSettings,
  useUpdateUiSettings
} from "@/components/api/hooks";
import dynamic from "next/dynamic";
import {Loader} from "@/components/common/Loading";
import {QuestionCircleTwoTone} from "@ant-design/icons";
import {useAtomValue} from "jotai/index";
import {lastUploadedDateAtom} from "@/components/data/atoms/root";
import {format} from "date-fns";

const {Text, Title} = Typography;

const LazyInactiveLiftsList = dynamic(() => import('@/components/progressive-overload/InactiveLiftsList'),
  {ssr: false, loading: () => <Loader/>});


export function ProgressAnalysisPage() {
  const data = useProgressiveOverloadCounts()
  const {progressAnalysisTipHidden} = useUiSettings()
  const updateUiSettings = useUpdateUiSettings()
  const lastUploadDate = useAtomValue(lastUploadedDateAtom);

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

  return (
    <>
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
          {lastUploadedTag}
        </Space>
      </Title>

      {!progressAnalysisTipHidden &&
        <Alert type={'info'} style={{maxWidth: 900}}
               closable
               onClose={() => updateUiSettings({progressAnalysisTipHidden: true})}
               showIcon description={
          <>
            <Text strong>This page shows an overview of your lifts and
              how they’re performing - spot any potential issues right
              away</Text>
            <br/>
            <Text>
              Same lifts from different sessions are tracked separately, as
              the exercise order may affect performance.
              <br/>
              The <b>Active</b> tab highlights lifts you’ve done recently,
              helping you
              gauge what’s progressing well and what isn’t, spot potential or
              actual issues in your
              current training, so you can correct the course.
              The <b>New</b> tab is just lifts without enough data yet, and
              the <b>History</b> includes lifts you haven’t done in a while —
              could be useful for
              retrospective review.
            </Text>
          </>
        }/>
      }
      <Tabs
        defaultActiveKey={'active'}
        items={[
          {
            key: 'active',
            label: (
              <Tooltip
                title={'Lifts you have done recently, so they are most likely in your current training'}>
                Active Lifts ({data.activeCount})
              </Tooltip>
            ),
            children: <ActiveLiftsList/>,
            disabled: data.activeCount === 0
          },
          {
            key: 'new',
            label: (
              <Tooltip title={'Lifts without enough data yet to analyze them'}>
                New Lifts ({data.newCount})
              </Tooltip>
            ),
            children: <Suspense fallback={<Loader fullscreen/>}>
              <LazyInactiveLiftsList title={'New Lifts'}
                                     activityStatus={LiftActivityStatus.New}/>
            </Suspense>,
            disabled: data.newCount === 0
          },
          {
            key: 'history',
            label: (
              <Tooltip
                title={'Lifts you haven’t done in a while, could be useful for retrospective review'}>
                History Lifts ({data.historyCount})
              </Tooltip>
            ),
            children: <Suspense fallback={<Loader fullscreen/>}>
              <LazyInactiveLiftsList title={'History Lifts'}
                                     activityStatus={LiftActivityStatus.History}/>
            </Suspense>,
            disabled: data.historyCount === 0
          },
        ]}
      />
    </>
  );
}