import {
  LiftDayData,
  LiftHistory,
  LiftProgressStatus,
  LiftSetData,
  RawSetData
} from "@/types";

type ParsingLiftHistory = Omit<LiftHistory, 'workouts' | 'sessionNames'> & {
  workouts: Record<string, LiftDayData>;
  sessionNames: Set<string>
}

const makeLiftName = (set: RawSetData) => `${set.exerciseName} | ${set.workoutName}`;

const ensureLiftEntry = (liftsByName: Record<string, ParsingLiftHistory>, set: RawSetData): ParsingLiftHistory => {
  const key = makeLiftName(set);
  if (!liftsByName[key]) {
    liftsByName[key] = {
      name: key,
      workouts: {},
      sessionNames: new Set<string>(),
      progressStatus: LiftProgressStatus.NotSure,
    };
  }

  return liftsByName[key];
}

const ensureDayEntry = (lift: ParsingLiftHistory, set: RawSetData): LiftDayData => {
  if (!lift.workouts[set.date]) {
    lift.workouts[set.date] = {
      date: set.date,
      sessionNotes: set.workoutNotes || undefined,
      liftNotes: set.notes || undefined,
      sets: []
    };
  }
  return lift.workouts[set.date];
}

export const groupByLift = (sets: RawSetData[]): LiftHistory[] => {
  const liftsByName: Record<string, ParsingLiftHistory> = {};
  sets.forEach((set) => {
    const liftEntry = ensureLiftEntry(liftsByName, set);
    const dayEntry = ensureDayEntry(liftEntry, set);
    liftEntry.sessionNames.add(set.workoutName);
    dayEntry.sets.push({
      setMark: set.setMark,
      weight: set.weight,
      reps: set.reps,
      rpe: set.rpe
    } as LiftSetData);
  });

  return Object.values(liftsByName)
    .filter((it) => Object.keys(it.workouts).length > 0)
    .map((it) => {
    return {
      ...it,
      workouts: Object.values(it.workouts),
      sessionNames: Array.from(it.sessionNames),
    }
  });
}