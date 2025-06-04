import {
  LiftData,
  LiftDayData,
  LiftSetData,
  LiftStatus,
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

export const analyzeProgression = (sets: RawSetData[]): LiftData[] => {
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