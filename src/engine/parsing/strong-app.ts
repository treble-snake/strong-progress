// Define the type for raw workout data based on the CSV structure
import {RawSetData} from "@/types";

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