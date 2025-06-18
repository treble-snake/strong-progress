'use client';

import React from 'react';
import {Alert, Card, Collapse, Flex, Tag, Typography} from 'antd';
import {RedditOutlined, WarningOutlined} from '@ant-design/icons';
import {useAtomValue} from "jotai";
import {setsForWeeklyVolumeAtom} from "@/components/data/atoms";
import {AffectedMuscleGroups} from "@/engine/volume/muscle-groups";
import {PeriodPicker} from "@/components/volume/PeriodPicker";
import Link from "next/link";
import {MuscleVolumeCard} from "@/components/volume/MuscleVolumeCard";

const {Title, Text} = Typography;

const WeeklyVolumePage: React.FC = () => {
  const weekVolume = useAtomValue(setsForWeeklyVolumeAtom);
  const allLifts: [name: string, stats: AffectedMuscleGroups][] = Object.entries(weekVolume.liftMuscleGroups)
    .sort((a, b) => b[1].certainty - a[1].certainty); // Sort by certainty in descending order

  const averageVolume = weekVolume.weeklyAverageByMuscleGroup
  return (
    <>
      <Title level={1}>Weekly Volume</Title>
      <Alert type={'error'} showIcon icon={<WarningOutlined/>} message={<>
        This page is super early stage and may not work correctly. Stay tuned
        for updates and get in touch on <Link target={'_blank'}
                                              href="https://www.reddit.com/r/strongprogress/">
        <RedditOutlined/> Reddit
      </Link>!
      </>}/>

      <div style={{marginTop: 16}}>
        <PeriodPicker/>
      </div>

      <div style={{marginTop: 16}}>
        <Title level={2}>Average Weekly Volume</Title>
        <Flex wrap gap={16}>
          {
            Object.entries(averageVolume)
              .sort(([, a], [, b]) => b.primary - a.primary) // Sort by direct volume in descending order
              .map(([muscle]) => {
                return <MuscleVolumeCard key={muscle} muscle={muscle}
                                         volume={weekVolume}/>
              })
          }
        </Flex>
      </div>

      <div style={{marginTop: 16}}>
        <Title level={2}>Lifts you have performed ({allLifts.length})</Title>
        <Collapse
          defaultActiveKey={[]}
          style={{marginBottom: 16}}
          items={[
            {
              key: '1',
              label: 'Performed Lifts - Click to expand',
              children: (
                <Flex gap={16} wrap>
                  {
                    allLifts.map(([lift, {
                      primary,
                      secondary,
                      matchedKeywords,
                      sourceRule,
                      resultScore,
                      comments,
                      certainty
                    }]) => {
                      // Determine certainty level tag
                      let tagColor = 'green';
                      let tagText = 'High certainty';

                      if (certainty < 0.5) {
                        tagColor = 'red';
                        tagText = 'Low certainty';
                      } else if (certainty < 0.8) {
                        tagColor = 'orange';
                        tagText = 'Medium certainty';
                      }

                      return (
                        <Card
                          key={lift}
                          size="small"
                          style={{width: '24%'}}
                          title={
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}>
                              <Text strong>{lift}</Text>
                              <Tag
                                color={tagColor}>{tagText} ({certainty.toFixed(2)})</Tag>
                            </div>
                          }
                        >
                          <div>
                            <div><strong>Primary
                              muscles:</strong> {primary.join(', ')}</div>
                            {secondary.length > 0 && (
                              <div><strong>Secondary
                                muscles:</strong> {secondary.join(', ')}</div>
                            )}
                            <div><strong>Matched
                              keywords:</strong> {matchedKeywords.join(', ')}
                            </div>
                            <div><strong>Source
                              rule:</strong> {sourceRule} (score: {resultScore})
                            </div>
                            {comments.length > 0 && (
                              <div style={{color: 'red', marginTop: 8}}>
                                <strong>Comments:</strong> {comments.join(' | ')}
                              </div>
                            )}
                          </div>
                        </Card>
                      );
                    })
                  }
                </Flex>
              )
            }
          ]}
        />
      </div>
    </>
  );
};

export default WeeklyVolumePage;
