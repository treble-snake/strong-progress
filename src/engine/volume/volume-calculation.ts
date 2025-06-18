import {RawSetData} from "@/types";
import dayjs, {Dayjs} from "dayjs";
import localizedFormat from 'dayjs/plugin/localizedFormat'
import {
  AffectedMuscleGroups,
  getAffectedMuscleGroups
} from "@/engine/volume/muscle-groups";
import {getWeeks} from "@/engine/volume/week-intervals";

type LiftVolume = {
  straightSets: number;
  dropSets: number;
}

export type MuscleInvolvement = {
  primary: number;
  secondary: number;
  fractional?: number; // primary + secondary/2
}

type WeekVolume = {
  lifts: Record<string, LiftVolume>;
  muscleGroups: Record<string, MuscleInvolvement>
}

export type WeeklyVolumeResults = {
  // TODO: maybe we don't need it here
  liftMuscleGroups: Record<string, AffectedMuscleGroups>
  weeks: Record<string, WeekVolume>
  weeklyAverageByMuscleGroup: Record<string, MuscleInvolvement>
};


const DROP_SET_MARK = 'D';

dayjs.extend(localizedFormat)

export const limitSets = (sets: RawSetData[], fromDate: Dayjs, toDate: Dayjs): RawSetData[] => {
  const result: RawSetData[] = []

  // Handle empty array case
  if (!sets || sets.length === 0) {
    return result;
  }

  // we know that sets are sorted by date in ascending order, so
  // we can optimize by finding if our range is closer to the beginning or the end of the sets array
  const firstSetDate = dayjs(sets[0].date).startOf('day');
  const lastSetDate = dayjs(sets[sets.length - 1].date).startOf('day');
  const mode: 'forward' | 'backward' = firstSetDate.diff(fromDate, 'day') < toDate.diff(lastSetDate, 'day') ? 'forward' : 'backward';
  const step = mode === 'forward' ? 1 : -1;
  const startIndex = mode === 'forward' ? 0 : sets.length - 1;
  const endIndex = mode === 'forward' ? sets.length : -1;

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

    result.push(set);
  }

  // ensure ascending order by date
  if (mode === 'backward') {
    result.reverse();
  }

  return result;
}

export const calculateWeeklyVolume = (sets: RawSetData[], from: string, to: string): WeeklyVolumeResults => {
  const result: WeeklyVolumeResults = {
    weeks: {},
    liftMuscleGroups: {},
    weeklyAverageByMuscleGroup: {}
  };

  if (!sets || sets.length === 0 || !from || !to) {
    return result;
  }

  const filteredSets = limitSets(sets, dayjs(from).startOf('day'), dayjs(to).endOf('day'));
  if (filteredSets.length === 0) {
    return result;
  }

  const weeks = getWeeks(from, to)
  if (weeks.length === 0) {
    throw new Error('No weeks found for the given date range');
  }

  let currentWeekIndex = 0;
  let currentWeek = weeks[currentWeekIndex];
  const totalVolumeByMuscleGroup: Record<string, MuscleInvolvement> = {}

  for (const set of filteredSets) {
    const setDate = dayjs(set.date).startOf('day');
    if (setDate.isAfter(dayjs(currentWeek.end))) {
      // Move to the next week if the current set date is after the current week end
      currentWeekIndex += 1;
      if (currentWeekIndex >= weeks.length) {
        break; // No more weeks to process
      }
      currentWeek = weeks[currentWeekIndex];
    }

    // TODO: redo this algorithm, clac weeks sunday to sunday, not iso week
    const weekName = currentWeek.label;
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
        week.muscleGroups[muscle] = {primary: 0, secondary: 0, fractional: 0};
      }
      if (!totalVolumeByMuscleGroup[muscle]) {
        totalVolumeByMuscleGroup[muscle] = {primary: 0, secondary: 0, fractional: 0};
      }
      week.muscleGroups[muscle].primary += muscleCoefficient;
      totalVolumeByMuscleGroup[muscle].primary += muscleCoefficient;
    }
    for (const muscle of secondary) {
      if (!week.muscleGroups[muscle]) {
        week.muscleGroups[muscle] = {primary: 0, secondary: 0, fractional: 0};
      }
      if (!totalVolumeByMuscleGroup[muscle]) {
        totalVolumeByMuscleGroup[muscle] = {primary: 0, secondary: 0, fractional: 0};
      }
      week.muscleGroups[muscle].secondary += muscleCoefficient;
      totalVolumeByMuscleGroup[muscle].secondary += muscleCoefficient;
    }
  }

  // Calculate fractional volume for each muscle group in each week
  for (const weekName in result.weeks) {
    const week = result.weeks[weekName];
    for (const muscle in week.muscleGroups) {
      const { primary, secondary } = week.muscleGroups[muscle];
      week.muscleGroups[muscle].fractional = Math.round(10 * (primary + secondary / 2)) / 10;
    }
  }

  const weeksCount = Object.keys(result.weeks).length;
  for (const muscle in totalVolumeByMuscleGroup) {
    const {primary, secondary} = totalVolumeByMuscleGroup[muscle];
    const avgPrimary = Math.round(10 * primary / weeksCount) / 10;
    const avgSecondary = Math.round(10 * secondary / weeksCount) / 10;
    const fractional = Math.round(10 * (avgPrimary + avgSecondary / 2)) / 10;

    result.weeklyAverageByMuscleGroup[muscle] = {
      primary: avgPrimary,
      secondary: avgSecondary,
      fractional: fractional
    };
  }

  return result
}
