import {
  LiftData,
  LiftDayData,
  LiftSetData,
  LiftStatus,
  PerformanceChange,
  RawSetData
} from "@/types";
import {addDays, isBefore, parseISO} from "date-fns";

// If a lift was performed less than this many days, we won't assess progression
const TOTAL_DAYS_THRESHOLD = 4;

// Define the active period threshold (14 days)
const ACTIVE_DAYS_THRESHOLD = 15;

const makeLiftName = (set: RawSetData) => `${set.exerciseName} | ${set.workoutName}`;

const ensureLiftEntry = (liftsByName: Record<string, LiftData>, set: RawSetData): LiftData => {
  const key = makeLiftName(set);
  if (!liftsByName[key]) {
    liftsByName[key] = {
      name: key,
      workouts: {}
    };
  }

  return liftsByName[key];
}

const ensureDayEntry = (lift: LiftData, set: RawSetData): LiftDayData => {
  if (!lift.workouts[set.date]) {
    lift.workouts[set.date] = {
      date: set.date,
      note: set.workoutNotes,
      exercises: []
    };
  }
  return lift.workouts[set.date];
}

export const compareSetPerformance = (previous: LiftSetData, current: LiftSetData): PerformanceChange => {
  const previousPerf = previous.reps
  const currentPerf = current.reps;

  // TODO: this might be too strict, or different for duration- or distance-based lifts
  const diff = Math.abs(previousPerf - currentPerf);
  if (diff > previousPerf * 0.5) {
    return PerformanceChange.NotSure;
  }

  if (previous.weight === current.weight && previousPerf === currentPerf) {
    return PerformanceChange.NoChange;
  }

  if ((current.weight > previous.weight) ||
    (previous.weight === current.weight && currentPerf > previousPerf)) {
    return PerformanceChange.Increase;
  }

  if ((current.weight < previous.weight) ||
    (previous.weight === current.weight && currentPerf < previousPerf)) {
    return PerformanceChange.Decrease;
  }

  return PerformanceChange.NotSure;
}

export const computePerformanceChange = (previous: LiftDayData, current: LiftDayData): PerformanceChange => {
  if (previous.exercises.length === 0 || current.exercises.length === 0) {
    return PerformanceChange.NotSure;
  }

  const length = Math.max(previous.exercises.length, current.exercises.length);
  for (let i = 0; i < length; i++) {
    const previousSet = previous.exercises[i];
    const currentSet = current.exercises[i];

    // If we don't have a previous set - means we did an extra set today, it's an increase
    if (!previousSet) {
      return PerformanceChange.Increase
    }
    // If we don't have a current set - means we did less today, it's a decrease
    if (!currentSet) {
      return PerformanceChange.Decrease
    }
    const change = compareSetPerformance(previousSet, currentSet);
    if (change !== PerformanceChange.NoChange) {
      return change;
    }
  }

  return PerformanceChange.NoChange
}

export const analyzeProgressiveOverload = (sets: RawSetData[]): LiftData[] => {
  const liftsByName: Record<string, LiftData> = {};

  sets.forEach((set) => {
    const liftEntry = ensureLiftEntry(liftsByName, set);
    const dayEntry = ensureDayEntry(liftEntry, set);
    dayEntry.exercises.push({
      setMark: set.setMark,
      weight: set.weight,
      reps: set.reps,
      notes: set.notes,
      rpe: set.rpe
    } as LiftSetData);
  })

  const liftsByStatus: Record<LiftStatus, LiftData[]> = {
    [LiftStatus.Active]: [],
    [LiftStatus.History]: [],
    [LiftStatus.New]: []
  }
  Object.values(liftsByName).forEach((lift) => {


    // check if it's History
    const activityThreshold = addDays(new Date(), -ACTIVE_DAYS_THRESHOLD);
    const sortedDates = Object.keys(lift.workouts).sort()
    const lastPerformedDate = sortedDates.length > 0 ? sortedDates[sortedDates.length - 1] : null;
    if (lastPerformedDate && isBefore(parseISO(lastPerformedDate), activityThreshold)) {
      liftsByStatus[LiftStatus.History].push(lift);
      return;
    }

    // check if it's New
    if (Object.values(lift.workouts).length < TOTAL_DAYS_THRESHOLD) {
      liftsByStatus[LiftStatus.New].push(lift);
      return;
    }

    liftsByStatus[LiftStatus.Active].push(lift);
  })

  return Object.values(liftsByName);
}
