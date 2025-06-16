'use client';

import React from 'react';
import {
  Alert,
  Card,
  Collapse,
  DatePicker,
  DatePickerProps,
  Popover,
  Space,
  Statistic,
  Tag,
  Typography
} from 'antd';
import {InfoCircleOutlined, RightOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import {useAtom, useAtomValue} from "jotai";
import {
  setsForWeeklyVolumeAtom,
  volumeDateRangeAtom
} from "@/components/data/atoms";
import {AffectedMuscleGroups} from "@/engine/volume/muscle-groups";

const {Title, Text} = Typography;
const {RangePicker} = DatePicker;

const MAX_RANGE_MONTHS = 3;

// Disabled 6 months from the selected date
const isDisabled: DatePickerProps['disabledDate'] = (current, {from}) => {
  const today = dayjs().endOf('day');
  if (from) {
    const minDate = from.subtract(MAX_RANGE_MONTHS, 'months');
    const maxDate = from.add(MAX_RANGE_MONTHS, 'months');
    const reallyMaxDate = maxDate > today ? today : maxDate;
    if (current <= minDate || current >= reallyMaxDate) {
      return true
    }

    const daysDiff = current.diff(from, 'day') + 1; // +1 because we include both start and end dates
    return daysDiff % 7 !== 0;
  }

  return current > today;
};

// Helper function to find exercises contributing to each muscle group
const getExercisesForMuscleGroup = (
  muscleGroup: string, 
  liftMuscleGroups: Record<string, AffectedMuscleGroups>
): { primary: string[], secondary: string[] } => {
  const result = { primary: [] as string[], secondary: [] as string[] };

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
  const [volumeDateRange, setVolumeDateRange] = useAtom(volumeDateRangeAtom)
  const weekVolume = useAtomValue(setsForWeeklyVolumeAtom);
  const [rangeError, setRangeError] = React.useState<string | undefined>(undefined);

  const selectedRange: [dayjs.Dayjs, dayjs.Dayjs] = [
    dayjs(volumeDateRange[0]),
    dayjs(volumeDateRange[1])
  ];

  const allLifts: [name: string, stats: AffectedMuscleGroups][] = Object.entries(weekVolume.liftMuscleGroups)
    .sort((a, b) => b[1].certainty - a[1].certainty); // Sort by certainty in descending order

  const averageVolume = weekVolume.weeklyAverageByMuscleGroup
  const weekCount = Object.keys(weekVolume.weeks).length;

  return (
    <div>
      <Title level={2}>Weekly Volume</Title>
      <RangePicker
        allowClear={false}
        value={selectedRange}
        disabledDate={isDisabled}
        maxDate={dayjs()}
        onChange={(dates, dateStrings) => {
          console.warn('dates selected:', dateStrings);
          if (!dates || dates.length !== 2) {
            return
          }
          const [start, end] = dates;
          const daysCount = end!.diff(start!, 'day') + 1;
          if (daysCount % 7 !== 0) {
            setRangeError('Selected range must be a multiple of 7 days so we can properly calculate weekly volume.');
            return;
          }
          setRangeError(undefined);
          setVolumeDateRange(dateStrings)
        }}
        status={rangeError ? 'error' : undefined}
      />
      {rangeError && (
        <Alert type={'error'} description={rangeError}/>
      )}

      <div style={{marginTop: 32}}>
        Selected period includes {weekCount} weeks.
      </div>

      <div style={{marginTop: 32}}>
        <Title level={3}>Average Weekly Volume</Title>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {
            Object.entries(averageVolume)
              .sort(([, a], [, b]) => b.primary - a.primary) // Sort by direct volume in descending order
              .map(([muscle, {
                primary,
                secondary,
                fractional
              }]) => {
              const exercises = getExercisesForMuscleGroup(muscle, weekVolume.liftMuscleGroups);
              // const tooltipContent = (
              //   <div>
              //     <div><strong>Primary movers:</strong></div>
              //     <ul style={{ paddingLeft: 20, margin: '5px 0' }}>
              //       {exercises.primary.map(ex => <li key={ex}>{ex}</li>)}
              //     </ul>
              //     {exercises.secondary.length > 0 && (
              //       <>
              //         <div><strong>Secondary movers:</strong></div>
              //         <ul style={{ paddingLeft: 20, margin: '5px 0' }}>
              //           {exercises.secondary.map(ex => <li key={ex}>{ex}</li>)}
              //         </ul>
              //       </>
              //     )}
              //   </div>
              // );

              const primaryMoversContent = (
                <div>
                  <div><strong>Primary movers:</strong></div>
                  <ul style={{ paddingLeft: 20, margin: '5px 0' }}>
                    {exercises.primary.map(ex => <li key={ex}>{ex}</li>)}
                  </ul>
                </div>
              );

              const fractionalPopoverContent = (
                <div>
                  <p>Fractional volume is calculated as:</p>
                  <p><strong>{primary} Direct</strong> + <strong>{secondary} Indirect</strong>/2 = <strong>{fractional}</strong></p>
                  {exercises.secondary.length > 0 && (
                    <>
                      <div style={{ marginTop: 10 }}><strong>Secondary movers:</strong></div>
                      <ul style={{ paddingLeft: 20, margin: '5px 0' }}>
                        {exercises.secondary.map(ex => <li key={ex}>{ex}</li>)}
                      </ul>
                    </>
                  )}
                </div>
              );

              return (
                <Card 
                  key={muscle}
                  title={<Text strong>{muscle}</Text>}
                  style={{ width: 300 }}
                  size="small"
                  actions={[
                    <a key="details" href={`/muscle-group/${encodeURIComponent(muscle)}`}>
                      <RightOutlined />
                    </a>
                  ]}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Statistic 
                        title="Direct volume" 
                        value={primary}
                        valueStyle={{ color: '#1890ff' }}
                        style={{ marginBottom: 0 }}
                        suffix={
                          <Popover 
                            content={primaryMoversContent} 
                            title="Primary Mover Exercises"
                            trigger="hover"
                          >
                            <InfoCircleOutlined style={{ color: '#1890ff', cursor: 'pointer', marginLeft: 5 }} />
                          </Popover>
                        }
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Statistic 
                        title="Fractional volume" 
                        value={fractional}
                        valueStyle={{ color: '#722ed1' }}
                        style={{ marginBottom: 0 }}
                        suffix={
                          <Popover 
                            content={fractionalPopoverContent} 
                            title="Fractional Volume"
                            trigger="hover"
                          >
                            <InfoCircleOutlined style={{ color: '#722ed1', cursor: 'pointer', marginLeft: 5 }} />
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
          style={{ marginBottom: 16 }}
          items={[
            {
              key: '1',
              label: 'Performed Lifts - Click to expand',
              children: (
                <Space direction="vertical" style={{ width: '100%' }}>
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Text strong>{lift}</Text>
                              <Tag color={tagColor}>{tagText} ({certainty.toFixed(2)})</Tag>
                            </div>
                          }
                          style={{ width: '100%' }}
                        >
                          <div>
                            <div><strong>Primary muscles:</strong> {primary.join(', ')}</div>
                            {secondary.length > 0 && (
                              <div><strong>Secondary muscles:</strong> {secondary.join(', ')}</div>
                            )}
                            <div><strong>Matched keywords:</strong> {matchedKeywords.join(', ')}</div>
                            <div><strong>Source rule:</strong> {sourceRule} (score: {resultScore})</div>
                            {comments.length > 0 && (
                              <div style={{ color: 'red', marginTop: 8 }}>
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
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
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
                          <ul style={{ paddingLeft: 20, margin: '5px 0' }}>
                            {exercises.primary.map(ex => <li key={ex}>{ex}</li>)}
                          </ul>
                        </div>
                      );

                      const fractionalPopoverContent = (
                        <div>
                          <p>Fractional volume is calculated as:</p>
                          <p><strong>{primary} Direct</strong> + <strong>{secondary} Indirect</strong>/2 = <strong>{fractional}</strong></p>
                          {exercises.secondary.length > 0 && (
                            <>
                              <div style={{ marginTop: 10 }}><strong>Secondary movers:</strong></div>
                              <ul style={{ paddingLeft: 20, margin: '5px 0' }}>
                                {exercises.secondary.map(ex => <li key={ex}>{ex}</li>)}
                              </ul>
                            </>
                          )}
                        </div>
                      );

                      return (
                        <Card 
                          key={muscle}
                          title={<Text strong>{muscle}</Text>}
                          style={{ width: 300 }}
                          size="small"
                          actions={[
                            <a key="details" href={`/muscle-group/${encodeURIComponent(muscle)}`}>
                              <RightOutlined />
                            </a>
                          ]}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <Statistic 
                                title="Direct volume" 
                                value={primary}
                                valueStyle={{ color: '#1890ff' }}
                                style={{ marginBottom: 0 }}
                                suffix={
                                  <Popover 
                                    content={primaryMoversContent} 
                                    title="Primary Mover Exercises"
                                    trigger="hover"
                                  >
                                    <InfoCircleOutlined style={{ color: '#1890ff', cursor: 'pointer', marginLeft: 5 }} />
                                  </Popover>
                                }
                              />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <Statistic 
                                title="Fractional volume" 
                                value={fractional}
                                valueStyle={{ color: '#722ed1' }}
                                style={{ marginBottom: 0 }}
                                suffix={
                                  <Popover 
                                    content={fractionalPopoverContent} 
                                    title="Fractional Volume"
                                    trigger="hover"
                                  >
                                    <InfoCircleOutlined style={{ color: '#722ed1', cursor: 'pointer', marginLeft: 5 }} />
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
                          <Space direction="vertical" style={{ width: '100%' }}>
                            {Object.entries(lifts.lifts).map(([lift, counts]) => (
                              <div key={lift} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Text>{lift}</Text>
                                <Space>
                                  <Tag color="blue">{counts.straightSets} straight sets</Tag>
                                  {counts.dropSets > 0 && <Tag color="purple">{counts.dropSets} drop sets</Tag>}
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

      <div style={{marginTop: 32}}>
        <Collapse
          items={[
            {
              key: '1',
              label: 'Original Text Information',
              children: (
                <>
                  <div style={{marginTop: 16}}>
                    <Title level={4}>Average Weekly Volume (Text)</Title>
                    <ul>
                      {
                        Object.entries(averageVolume).map(([muscle, {
                          primary,
                          secondary,
                          fractional
                        }]) => (
                          <li key={muscle}>
                            {muscle}: <b>{primary} Direct volume</b>,
                            <i>{secondary} Indirect volume</i>,
                            <span style={{ color: '#722ed1' }}>{fractional} Fractional volume</span>
                          </li>
                        ))
                      }
                    </ul>
                  </div>

                  <div style={{marginTop: 16}}>
                    <Title level={4}>Lifts you have performed ({allLifts.length})</Title>
                    <ul>
                      {
                        allLifts.map(([lift, {
                          primary,
                          secondary,
                          matchedKeywords,
                          sourceRule,
                          resultScore,
                          comments,
                          certainty
                        }]) => (
                          <li key={lift}>
                            <b>{lift}</b> - {primary.join(', ')}
                            {secondary.length > 0 && (<i>(+{secondary.join(', ')})</i>)}
                            <br/>
                            <i>Matched keywords: {matchedKeywords.join(', ')}</i>
                            <br/>
                            <i>Source rule: {sourceRule} (score: {resultScore},
                              certainty: {certainty})</i>
                            {comments.length > 0 &&
                              <div style={{color: 'red'}}>{comments.join(' | ')}</div>}
                          </li>
                        ))
                      }
                    </ul>
                  </div>

                  <div style={{marginTop: 16}}>
                    {Object.entries(weekVolume.weeks).map(([week, lifts]) => (
                      <div key={week} style={{marginBottom: 16}}>
                        <Title level={4}>{week}</Title>
                        {
                          Object.entries(lifts.muscleGroups).length > 0 ? (
                            <div>
                              Muscle Groups:
                              <ul>
                                {Object.entries(lifts.muscleGroups).map(([muscle, {
                                  primary,
                                  secondary,
                                  fractional
                                }]) => (
                                  <li key={muscle}>
                                    {muscle}: <b>{primary} Direct volume</b>,
                                    <i>{secondary} Indirect volume</i>,
                                    <span style={{ color: '#722ed1' }}>{fractional} Fractional volume</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <div>No muscle groups data for this week.</div>
                          )
                        }

                        {Object.entries(lifts.lifts).map(([lift, counts]) => (
                          <div key={lift}>
                            {lift}: {counts.straightSets} straight
                            sets, {counts.dropSets} drop sets
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </>
              )
            }
          ]}
        />
      </div>
    </div>
  );
};

export default WeeklyVolumePage;
