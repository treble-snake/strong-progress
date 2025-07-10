// Define the type for raw workout data based on the CSV structure
import {RawSetData} from "@/types";
import dayjs from "dayjs";

type HevyDistanceOptions = { distance_km: string; distance_miles?: never } | {
  distance_miles: string;
  distance_km?: never
};
type HevyWeightOptions = { weight_kg: string; weight_lbs?: never } | {
  weight_lbs: string;
  weight_kg?: never
};

type HevyAppRawDataPoint = HevyDistanceOptions & HevyWeightOptions & {
  title: string;
  start_time: string;
  end_time: string;
  description: string;
  exercise_title: string;
  superset_id: string;
  exercise_notes: string;
  set_index: string;
  set_type: string;
  reps: string;
  duration_seconds: string;
  rpe: string;
}

/*
 * Example Hevy App data:
 * "title","start_time","end_time","description","exercise_title","superset_id","exercise_notes","set_index","set_type","weight_kg","reps","distance_km","duration_seconds","rpe"
* "Full body","12 Jun 2025, 15:23","12 Jun 2025, 16:00","","Squat (Barbell)",,"",0,"normal",52.5,5,,,
 */

enum HeavySetType {
  Normal = 'normal',
  Warmup = 'warmup',
  Dropset = 'dropset',
  Failure = 'failure',
}

export const mapHevyAppData = (data: HevyAppRawDataPoint[]): RawSetData[] => {
  const result: RawSetData[] = [];
  let currentDate: string | null = null;
  let currentDateSets: RawSetData[] = [];

  // Process data in a single pass
  data
    .filter(it => it.set_type !== HeavySetType.Warmup)
    .forEach(it => {
      const weight = it.weight_kg !== undefined ? parseFloat(it.weight_kg) || 0 : parseFloat(it.weight_lbs || '0') || 0;
      const distance = it.distance_km !== undefined ? parseFloat(it.distance_km) || 0 : parseFloat(it.distance_miles || '0') || 0;

      let setMark = it.set_index;
      switch (it.set_type) {
        case HeavySetType.Failure:
          setMark = 'F';
          break;
        case HeavySetType.Dropset:
          setMark = 'D';
          break;
      }

      const mappedItem: RawSetData = {
        date: dayjs(it.start_time).format('YYYY-MM-DD'),
        workoutName: it.title,
        exerciseName: it.exercise_title,
        setMark,
        weight,
        reps: parseInt(it.reps, 10) || 0,
        distance,
        seconds: parseFloat(it.duration_seconds) || 0,
        notes: it.exercise_notes === '' ? undefined : it.exercise_notes,
        workoutNotes: it.description === '' ? undefined : it.description,
        rpe: it.rpe === '' ? undefined : parseFloat(it.rpe) || undefined
      };

      // If we encounter a new date, add the current date's sets to the result
      if (currentDate !== null && currentDate !== it.start_time) {
        // Add sets from the previous date to the beginning of the result array
        // This effectively reverses the date order (from descending to ascending)
        result.unshift(...currentDateSets);
        currentDateSets = [];
      }

      currentDate = it.start_time;
      currentDateSets.push(mappedItem);
    });

  // Don't forget to add the last date's sets
  if (currentDateSets.length > 0) {
    result.unshift(...currentDateSets);
  }

  return result;
}
