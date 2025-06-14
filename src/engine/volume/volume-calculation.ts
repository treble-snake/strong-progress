import {RawSetData} from "@/types";
import dayjs from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isoWeek from 'dayjs/plugin/isoWeek'

type LiftVolume = {
  straightSets: number;
  dropSets: number;
}

type WeekVolume = {
  lifts: Record<string, LiftVolume>;
}

export type WeeklyVolumeResults = {
  totalSets: number
  weeks: Record<string, WeekVolume>
};

const DROP_SET_MARK = 'D';

dayjs.extend(advancedFormat)
dayjs.extend(isoWeek)

export const calculateWeeklyVolume = (sets: RawSetData[], from: string, to: string): WeeklyVolumeResults => {
  if (!sets || sets.length === 0) {
    return {
      totalSets: 0,
      weeks: {}
    };
  }

  // in case if the date is provided with time, we only need the date part
  const fromDate = dayjs(from).startOf('day');
  const toDate = dayjs(to).endOf('day');
  const weeks: Record<string, WeekVolume> = {}

  // we know that sets are sorted by date in ascending order, so
  // we can optimize by finding if our range is closer to the beginning or the end of the sets array
  const firstSetDate = dayjs(sets[0].date).startOf('day');
  const lastSetDate = dayjs(sets[sets.length - 1].date).startOf('day');
  const mode: 'forward' | 'backward' = firstSetDate.diff(fromDate, 'day') < toDate.diff(lastSetDate, 'day') ? 'forward' : 'backward';

  const startIndex = mode === 'forward' ? 0 : sets.length - 1;
  const endIndex = mode === 'forward' ? sets.length : -1;
  const step = mode === 'forward' ? 1 : -1;

  let totalSets = 0;
  for (let i = startIndex; i !== endIndex; i += step) {
    const set = sets[i];
    const setDate = dayjs(set.date).startOf('day');

    // Skip sets that are outside the date range
    if (mode === 'forward') {
      if (setDate.isAfter(toDate)) {
        break; // No need to check further, as sets are sorted by date
      }
    } else if (mode === 'backward') {
      if (setDate.isBefore(fromDate)) {
        break; // No need to check further, as sets are sorted by date
      }
    }

    if (setDate.isAfter(toDate) || setDate.isBefore(fromDate)) {
      continue; // Skip sets outside the date range
    }

    totalSets++;
    const week = `Week ${setDate.isoWeek()}`;
    if (!weeks[week]) {
      weeks[week] = {lifts: {}};
    }
    const lift = set.exerciseName;
    if (!weeks[week].lifts[lift]) {
      weeks[week].lifts[lift] = {straightSets: 0, dropSets: 0};
    }
    if (set.setMark === DROP_SET_MARK) {
      weeks[week].lifts[lift].dropSets += 1;
    } else {
      weeks[week].lifts[lift].straightSets += 1;
    }
  }

  return {
    totalSets,
    weeks
  }
}
