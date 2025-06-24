// Define the type for raw workout data based on the CSV structure
import {RawSetData} from "@/types";
import dayjs from "dayjs";

interface HevyAppRawDataPoint {
  title: string;
  start_time: string;
  end_time: string;
  description: string;
  exercise_title: string;
  superset_id: string;
  exercise_notes: string;
  set_index: string;
  set_type: string;
  weight_kg?: string;
  weight_lbs?: string;
  reps: string;
  distance_km: string;
  duration_seconds: string;
  rpe: string;
}

/*
 * Example Hevy App data:
 * "title","start_time","end_time","description","exercise_title","superset_id","exercise_notes","set_index","set_type","weight_kg","reps","distance_km","duration_seconds","rpe"
* "Full body","12 Jun 2025, 15:23","12 Jun 2025, 16:00","","Squat (Barbell)",,"",0,"normal",52.5,5,,,
 */

export const mapHevyAppData = (data: HevyAppRawDataPoint[]): RawSetData[] => {
  return data
    .filter((it: HevyAppRawDataPoint) =>
      // filter out warmups and empty sets
      it.set_type !== 'warmup' && 
      (parseInt(it.reps, 10) || 0) + (parseFloat(it.distance_km) || 0) + (parseFloat(it.duration_seconds) || 0) > 0
    )
    .map((it: HevyAppRawDataPoint) => {
      // Handle the case where weight might be in kg or lbs based on app settings
      const weight = it.weight_kg !== undefined ? parseFloat(it.weight_kg) || 0 : parseFloat(it.weight_lbs || '0') || 0;

      return {
        date: dayjs(it.start_time).format('YYYY-MM-DD'),
        workoutName: it.title,
        exerciseName: it.exercise_title,
        setMark: it.set_type === 'warmup' ? 'W' : it.set_index,
        weight: weight,
        reps: parseInt(it.reps, 10) || 0,
        distance: parseFloat(it.distance_km) || 0,
        seconds: parseFloat(it.duration_seconds) || 0,
        notes: it.exercise_notes === '' ? undefined : it.exercise_notes,
        workoutNotes: it.description === '' ? undefined : it.description,
        rpe: it.rpe === '' ? undefined : parseFloat(it.rpe) || undefined
      } as RawSetData;
    })
    .filter((it) => {
      return it.setMark !== "W" && (it.reps + it.distance + it.seconds) > 0
    })
}
