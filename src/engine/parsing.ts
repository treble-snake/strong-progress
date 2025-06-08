import {
  LiftDayData,
  LiftHistory,
  LiftProgressStatus,
  LiftSetData,
  RawSetData
} from "@/types";

// Define the type for raw workout data based on the CSV structure
interface StrongAppRawDataPoint {
  Date: string;
  'Workout Name': string;
  Duration: string;
  'Exercise Name': string;
  'Set Order': string;
  Weight: string;
  Reps: string;
  Distance: string;
  Seconds: string;
  Notes: string;
  'Workout Notes': string;
  RPE: string;
}

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

export const mapStrongAppData = (data: StrongAppRawDataPoint[]): RawSetData[] => {
  return data
    .map((it: StrongAppRawDataPoint) => ({
      date: it.Date.split(' ')[0], // Extract YYYY-MM-DD from "YYYY-MM-DD HH:MM:SS",
      workoutName: it['Workout Name'],
      exerciseName: it['Exercise Name'],
      setMark: it['Set Order'],
      weight: parseFloat(it.Weight) || 0,
      reps: parseInt(it.Reps, 10) || 0,
      distance: parseFloat(it.Distance) || 0,
      seconds: parseFloat(it.Seconds) || 0,
      notes: it.Notes === '"' ? undefined : it.Notes,
      workoutNotes: it['Workout Notes'] === '"' ? undefined : it['Workout Notes'],
      rpe: it.RPE === '' ? undefined : parseFloat(it.RPE) || undefined
    } as RawSetData))
    .filter((it: RawSetData) =>
      // filter out rest timers, warmups, and empty sets
      it.setMark !== "Rest Timer" && it.setMark !== "W" && it.reps + it.distance + it.seconds > 0
    )
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