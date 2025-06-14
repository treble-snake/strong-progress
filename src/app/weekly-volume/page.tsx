'use client';

import React from 'react';
import {DatePicker, DatePickerProps, Typography} from 'antd';
import dayjs from 'dayjs';
import {useAtom, useAtomValue} from "jotai";
import {
  setsForWeeklyVolumeAtom,
  volumeDateRangeAtom
} from "@/components/data/atoms";

const {Title} = Typography;
const {RangePicker} = DatePicker;

const MAX_RANGE_MONTHS = 3;

// Disabled 6 months from the selected date
const isDisabled: DatePickerProps['disabledDate'] = (current, {from}) => {
  const today = dayjs().endOf('day');
  if (from) {
    const minDate = from.subtract(MAX_RANGE_MONTHS, 'months');
    const maxDate = from.add(MAX_RANGE_MONTHS, 'months');
    const reallyMaxDate = maxDate > today ? today : maxDate;
    return current <= minDate || current >= reallyMaxDate;
  }

  return current && current > today;
};

const WeeklyVolumePage: React.FC = () => {
  const [volumeDateRange, setVolumeDateRange] = useAtom(volumeDateRangeAtom)
  const weekVolume = useAtomValue(setsForWeeklyVolumeAtom);

  const selectedRange: [dayjs.Dayjs, dayjs.Dayjs] = [
    dayjs(volumeDateRange[0]),
    dayjs(volumeDateRange[1])
  ];

  const [startDate, endDate] = selectedRange;

  return (
    <div>
      <Title level={2}>Weekly Volume</Title>
      <RangePicker
        allowClear={false}
        value={selectedRange}
        disabledDate={isDisabled}
        maxDate={dayjs()}
        onChange={(_, dateStrings) => {
          setVolumeDateRange(dateStrings)
        }}
      />

      <div style={{marginTop: 32}}>
        You performed {weekVolume.totalSets} sets total during selected {
        endDate.diff(startDate, 'weeks')
      } weeks.
      </div>

      <div style={{marginTop: 32}}>
        <Title level={3}>Total Volume</Title>
      </div>

      <div style={{marginTop: 16}}>
       <Title level={3}>Lifts you have performed ({weekVolume.lifts.size})</Title>
        <ul>
          {Array.from(weekVolume.lifts).map((lift) => (
            <li key={lift}>{lift}</li>
          ))}
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
                    {Object.entries(lifts.muscleGroups).map(([muscle, {primary, secondary}]) => (
                      <li key={muscle}>
                        {muscle}: <b>{primary} primary sets</b>,
                        <i>{secondary} secondary sets</i>
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
    </div>
  );
};

export default WeeklyVolumePage;
