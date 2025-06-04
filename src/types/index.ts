export enum ProgressStatus {
  Progressing = 'Progressing',
  NeedsAttention = 'NeedsAttention',
  Plateaued = 'Plateaued',
  Regressing = 'Regressing'
}

export enum LiftStatus {
  Active = 'Active',
  History = 'History',
  New = 'New',
}

export interface LiftData {
  name: string;
  workouts: Record<string, LiftDayData>
}

export interface LiftDayData {
  date: string;
  note: string
  exercises: LiftSetData[];
}

// Define the type for workout data with lowerCamelCase field names
export interface LiftSetData {
  setMark: string;
  weight: number; // float
  reps: number; // integer
  notes: string;
  rpe: number | null;
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