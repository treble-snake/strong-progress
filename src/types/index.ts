export enum LiftActivityStatus {
  Active = 'Active',
  History = 'History',
  New = 'New',
}

export enum LiftProgressStatus {
  Progressing = 'Progressing',
  Struggling = 'Struggling',
  AtRisk = 'At Risk',
  Plateaued = 'Plateaued',
  Regressing = 'Regressing',
  NotSure = 'Not Sure',
}

export interface LiftHistory {
  name: string;
  /** Names of the sessions this lift was a part of */
  sessionNames: string[];
  activityStatus?: LiftActivityStatus;
  progressStatus?: LiftProgressStatus;
  workouts: LiftDayData[];
}

export interface LiftDayData {
  date: string;
  note?: string;
  sessionNotes?: string;
  liftNotes?: string;
  performanceChange?: PerformanceChange;
  sets: LiftSetData[];
}

// Define the type for workout data with lowerCamelCase field names
export interface LiftSetData {
  setMark: string;
  weight: number; // float
  reps: number; // integer
  rpe?: number;
  // distance: number; // float
  // seconds: number; // float
}

// Define the type for workout data with lowerCamelCase field names
export interface RawSetData {
  date: string;
  workoutName: string;
  exerciseName: string;
  setMark: string;
  weight: number; // float
  reps: number; // integer
  distance: number; // float
  seconds: number; // float
  notes: string;
  workoutNotes: string;
  rpe: number | null;
}

export enum PerformanceChange {
  Increase = 'Increase',
  Decrease = 'Decrease',
  NoChange = 'No Change',
  NotSure = 'Not Sure'
}