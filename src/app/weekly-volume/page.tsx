'use client';

import React from 'react';
import {
  Alert,
  Card,
  Collapse,
  Popover,
  Space,
  Statistic,
  Tag,
  Typography
} from 'antd';
import {
  InfoCircleOutlined,
  RedditOutlined,
  RightOutlined,
  WarningOutlined
} from '@ant-design/icons';
import {useAtomValue} from "jotai";
import {setsForWeeklyVolumeAtom} from "@/components/data/atoms";
import {AffectedMuscleGroups} from "@/engine/volume/muscle-groups";
import {PeriodPicker} from "@/components/volume/PeriodPicker";
import Link from "next/link";

const {Title, Text} = Typography;

// Helper function to find exercises contributing to each muscle group
const getExercisesForMuscleGroup = (
  muscleGroup: string,
  liftMuscleGroups: Record<string, AffectedMuscleGroups>
): { primary: string[], secondary: string[] } => {
  const result = {primary: [] as string[], secondary: [] as string[]};

  Object.entries(liftMuscleGroups).forEach(([liftName, stats]) => {
    if (stats.primary.includes(muscleGroup)) {
      result.primary.push(liftName);
    } else if (stats.secondary.includes(muscleGroup)) {
      result.secondary.push(liftName);
    }
  });

  return result;
};

const WeeklyVolumePage: React.FC = () => {
  const weekVolume = useAtomValue(setsForWeeklyVolumeAtom);
  const allLifts: [name: string, stats: AffectedMuscleGroups][] = Object.entries(weekVolume.liftMuscleGroups)
    .sort((a, b) => b[1].certainty - a[1].certainty); // Sort by certainty in descending order

  const averageVolume = weekVolume.weeklyAverageByMuscleGroup
  return (
    <div>
      <Title level={2}>Weekly Volume</Title>
      <Alert type={'error'} showIcon icon={<WarningOutlined/>} message={<>
        This page is super early stage and may not work correctly. Stay tuned
        for updates
        on <Link target={'_blank'}
                 href="https://www.reddit.com/r/strongprogress/">
        <RedditOutlined/> Reddit
      </Link>!
      </>}/>

      <div style={{marginTop: 16}}>
        <PeriodPicker/>
      </div>

      <div style={{marginTop: 16}}>
        <Title level={3}>Average Weekly Volume</Title>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 16}}>
          {
            Object.entries(averageVolume)
              .sort(([, a], [, b]) => b.primary - a.primary) // Sort by direct volume in descending order
              .map(([muscle, {
                primary,
                secondary,
                fractional
              }]) => {
                const exercises = getExercisesForMuscleGroup(muscle, weekVolume.liftMuscleGroups);
                const primaryMoversContent = (
                  <div>
                    <div><strong>Primary movers:</strong></div>
                    <ul style={{paddingLeft: 20, margin: '5px 0'}}>
                      {exercises.primary.map(ex => <li key={ex}>{ex}</li>)}
                    </ul>
                  </div>
                );

                const fractionalPopoverContent = (
                  <div>
                    <p>Fractional volume is calculated as:</p>
                    <p>
                      <strong>{primary} Direct</strong> + <strong>{secondary} Indirect</strong>/2
                      = <strong>{fractional}</strong></p>
                    {exercises.secondary.length > 0 && (
                      <>
                        <div style={{marginTop: 10}}><strong>Secondary
                          movers:</strong></div>
                        <ul style={{paddingLeft: 20, margin: '5px 0'}}>
                          {exercises.secondary.map(ex => <li
                            key={ex}>{ex}</li>)}
                        </ul>
                      </>
                    )}
                  </div>
                );

                return (
                  <Card
                    key={muscle}
                    title={<Text strong>{muscle}</Text>}
                    style={{width: 300}}
                    size="small"
                    actions={[
                      <a key="details"
                         href={`/muscle-group/${encodeURIComponent(muscle)}`}>
                        Details <RightOutlined/>
                      </a>
                    ]}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <Statistic
                          title="Direct volume"
                          value={primary}
                          valueStyle={{color: '#1890ff'}}
                          style={{marginBottom: 0}}
                          suffix={
                            <Popover
                              content={primaryMoversContent}
                              title="Primary Mover Exercises"
                              trigger="hover"
                            >
                              <InfoCircleOutlined style={{
                                color: '#1890ff',
                                cursor: 'pointer',
                                marginLeft: 5
                              }}/>
                            </Popover>
                          }
                        />
                      </div>
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <Statistic
                          title="Fractional volume"
                          value={fractional}
                          valueStyle={{color: '#722ed1'}}
                          style={{marginBottom: 0}}
                          suffix={
                            <Popover
                              content={fractionalPopoverContent}
                              title="Fractional Volume"
                              trigger="hover"
                            >
                              <InfoCircleOutlined style={{
                                color: '#722ed1',
                                cursor: 'pointer',
                                marginLeft: 5
                              }}/>
                            </Popover>
                          }
                        />
                      </div>
                    </div>
                  </Card>
                );
              })
          }
        </div>
      </div>

      <div style={{marginTop: 16}}>
        <Title level={3}>Lifts you have performed ({allLifts.length})</Title>
        <Collapse
          defaultActiveKey={[]}
          style={{marginBottom: 16}}
          items={[
            {
              key: '1',
              label: 'Performed Lifts - Click to expand',
              children: (
                <Space direction="vertical" style={{width: '100%'}}>
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
                          style={{width: '100%'}}
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
                </Space>
              )
            }
          ]}
        />
      </div>

      <div style={{marginTop: 16}}>
        <Title level={3}>Volume Per Week</Title>
        {Object.entries(weekVolume.weeks).map(([week, lifts]) => (
          <div key={week} style={{marginBottom: 24}}>
            <Title level={4}>{week}</Title>
            {
              Object.entries(lifts.muscleGroups).length > 0 ? (
                <>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 16,
                    marginBottom: 16
                  }}>
                    {Object.entries(lifts.muscleGroups)
                      .sort(([, a], [, b]) => b.primary - a.primary) // Sort by direct volume in descending order
                      .map(([muscle, {
                        primary,
                        secondary,
                        fractional
                      }]) => {
                        // Get exercises for this muscle group
                        const exercises = getExercisesForMuscleGroup(muscle, weekVolume.liftMuscleGroups);

                        const primaryMoversContent = (
                          <div>
                            <div><strong>Primary movers:</strong></div>
                            <ul style={{paddingLeft: 20, margin: '5px 0'}}>
                              {exercises.primary.map(ex => <li
                                key={ex}>{ex}</li>)}
                            </ul>
                          </div>
                        );

                        const fractionalPopoverContent = (
                          <div>
                            <p>Fractional volume is calculated as:</p>
                            <p>
                              <strong>{primary} Direct</strong> + <strong>{secondary} Indirect</strong>/2
                              = <strong>{fractional}</strong></p>
                            {exercises.secondary.length > 0 && (
                              <>
                                <div style={{marginTop: 10}}><strong>Secondary
                                  movers:</strong></div>
                                <ul style={{paddingLeft: 20, margin: '5px 0'}}>
                                  {exercises.secondary.map(ex => <li
                                    key={ex}>{ex}</li>)}
                                </ul>
                              </>
                            )}
                          </div>
                        );

                        return (
                          <Card
                            key={muscle}
                            title={<Text strong>{muscle}</Text>}
                            style={{width: 300}}
                            size="small"
                            actions={[
                              <a key="details"
                                 href={`/muscle-group/${encodeURIComponent(muscle)}`}>
                                <RightOutlined/>
                              </a>
                            ]}
                          >
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}>
                              <div
                                style={{display: 'flex', alignItems: 'center'}}>
                                <Statistic
                                  title="Direct volume"
                                  value={primary}
                                  valueStyle={{color: '#1890ff'}}
                                  style={{marginBottom: 0}}
                                  suffix={
                                    <Popover
                                      content={primaryMoversContent}
                                      title="Primary Mover Exercises"
                                      trigger="hover"
                                    >
                                      <InfoCircleOutlined style={{
                                        color: '#1890ff',
                                        cursor: 'pointer',
                                        marginLeft: 5
                                      }}/>
                                    </Popover>
                                  }
                                />
                              </div>
                              <div
                                style={{display: 'flex', alignItems: 'center'}}>
                                <Statistic
                                  title="Fractional volume"
                                  value={fractional}
                                  valueStyle={{color: '#722ed1'}}
                                  style={{marginBottom: 0}}
                                  suffix={
                                    <Popover
                                      content={fractionalPopoverContent}
                                      title="Fractional Volume"
                                      trigger="hover"
                                    >
                                      <InfoCircleOutlined style={{
                                        color: '#722ed1',
                                        cursor: 'pointer',
                                        marginLeft: 5
                                      }}/>
                                    </Popover>
                                  }
                                />
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                  </div>
                  <Collapse
                    ghost
                    items={[
                      {
                        key: '1',
                        label: 'Lifts performed this week',
                        children: (
                          <Space direction="vertical" style={{width: '100%'}}>
                            {Object.entries(lifts.lifts).map(([lift, counts]) => (
                              <div key={lift} style={{
                                display: 'flex',
                                justifyContent: 'space-between'
                              }}>
                                <Text>{lift}</Text>
                                <Space>
                                  <Tag
                                    color="blue">{counts.straightSets} straight
                                    sets</Tag>
                                  {counts.dropSets > 0 &&
                                    <Tag color="purple">{counts.dropSets} drop
                                      sets</Tag>}
                                </Space>
                              </div>
                            ))}
                          </Space>
                        )
                      }
                    ]}
                  />
                </>
              ) : (
                <div>No muscle groups data for this week.</div>
              )
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyVolumePage;
