import {RawSetData} from "@/types";
import dayjs from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isoWeek from 'dayjs/plugin/isoWeek'
import {
  AffectedMuscleGroups,
  getAffectedMuscleGroups
} from "@/engine/volume/muscle-groups";

type LiftVolume = {
  straightSets: number;
  dropSets: number;
}

type WeekVolume = {
  lifts: Record<string, LiftVolume>;
  muscleGroups: Record<string, {
    primary: number
    secondary: number
  }>
}

export type WeeklyVolumeResults = {
  totalSets: number
  liftMuscleGroups: Record<string, AffectedMuscleGroups>
  weeks: Record<string, WeekVolume>
};

const DROP_SET_MARK = 'D';

dayjs.extend(advancedFormat)
dayjs.extend(isoWeek)

export const calculateWeeklyVolume = (sets: RawSetData[], from: string, to: string): WeeklyVolumeResults => {
  const result: WeeklyVolumeResults = {
    totalSets: 0,
    weeks: {},
    liftMuscleGroups: {}
  };

  if (!sets || sets.length === 0 || !from || !to) {
    return result;
  }

  // in case if the date is provided with time, we only need the date part
  const fromDate = dayjs(from).startOf('day');
  const toDate = dayjs(to).endOf('day');

  // we know that sets are sorted by date in ascending order, so
  // we can optimize by finding if our range is closer to the beginning or the end of the sets array
  const firstSetDate = dayjs(sets[0].date).startOf('day');
  const lastSetDate = dayjs(sets[sets.length - 1].date).startOf('day');
  const mode: 'forward' | 'backward' = firstSetDate.diff(fromDate, 'day') < toDate.diff(lastSetDate, 'day') ? 'forward' : 'backward';

  const startIndex = mode === 'forward' ? 0 : sets.length - 1;
  const endIndex = mode === 'forward' ? sets.length : -1;
  const step = mode === 'forward' ? 1 : -1;

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

    result.totalSets = result.totalSets + 1;
    // TODO: redo this algorithm, clac weeks sunday to sunday, not iso week
    const weekName = `Week ${setDate.isoWeek()}`;
    if (!result.weeks[weekName]) {
      result.weeks[weekName] = {
        lifts: {},
        muscleGroups: {}
      };
    }

    const week = result.weeks[weekName];
    const lift = set.exerciseName;
    if (!week.lifts[lift]) {
      week.lifts[lift] = {straightSets: 0, dropSets: 0};
    }

    let muscleCoefficient = 1
    if (set.setMark === DROP_SET_MARK) {
      week.lifts[lift].dropSets += 1;
      muscleCoefficient = 0.5; // drop sets are considered half as effective for muscle growth
    } else {
      week.lifts[lift].straightSets += 1;
    }

    let muscleGroups = result.liftMuscleGroups[lift];
    if (!muscleGroups) {
      muscleGroups = getAffectedMuscleGroups(lift);
      result.liftMuscleGroups[lift] = muscleGroups;
    }


    const {primary, secondary} = muscleGroups;
    for (const muscle of primary) {
      if (!week.muscleGroups[muscle]) {
        week.muscleGroups[muscle] = {primary: 0, secondary: 0};
      }
      week.muscleGroups[muscle].primary += muscleCoefficient;
    }
    for (const muscle of secondary) {
      if (!week.muscleGroups[muscle]) {
        week.muscleGroups[muscle] = {primary: 0, secondary: 0};
      }
      week.muscleGroups[muscle].secondary += muscleCoefficient;
    }
  }

  return result
}
