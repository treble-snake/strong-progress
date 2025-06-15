'use client';

import React from 'react';
import {Alert, DatePicker, DatePickerProps, Typography} from 'antd';
import dayjs from 'dayjs';
import {useAtom, useAtomValue} from "jotai";
import {
  setsForWeeklyVolumeAtom,
  volumeDateRangeAtom
} from "@/components/data/atoms";
import {AffectedMuscleGroups} from "@/engine/volume/muscle-groups";

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
    if (current <= minDate || current >= reallyMaxDate) {
      return true
    }

    const daysDiff = current.diff(from, 'day') + 1; // +1 because we include both start and end dates
    return daysDiff % 7 !== 0;
  }

  return current > today;
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
        <ul>
          {
            Object.entries(averageVolume).map(([muscle, {
              primary,
              secondary
            }]) => (
              <li key={muscle}>
                {muscle}: <b>{primary} primary sets</b>,
                <i>{secondary} secondary sets</i>
              </li>
            ))
          }
        </ul>
      </div>

      <div style={{marginTop: 16}}>
        <Title level={3}>Lifts you have performed ({allLifts.length})
        </Title>
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
                      secondary
                    }]) => (
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
