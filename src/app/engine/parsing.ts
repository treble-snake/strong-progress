import fs from 'fs';
import csvToJson from 'convert-csv-to-json';
import {RawSetData} from "@/types";

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

export const parseStrongAppData = (filePath: string): RawSetData[] => {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return [];
  }

  return csvToJson
    .fieldDelimiter(',')
    .supportQuotedField(true)
    .getJsonFromCsv(filePath)
    .map((it: StrongAppRawDataPoint) => ({
      date: it.Date.split(' ')[0], // Extract YYYY-MM-DD from "YYYY-MM-DD HH:MM:SS",
      workoutName: it['Workout Name'],
      exerciseName: it['Exercise Name'],
      setMark: it['Set Order'],
      weight: parseFloat(it.Weight) || 0,
      reps: parseInt(it.Reps, 10) || 0,
      distance: parseFloat(it.Distance) || 0,
      seconds: parseFloat(it.Seconds) || 0,
      notes: it.Notes,
      workoutNotes: it['Workout Notes'],
      rpe: it.RPE === '' ? null : parseFloat(it.RPE) || null
    } as RawSetData))
    .filter((it: RawSetData) =>
      it.setMark !== "Rest Timer" && it.reps + it.distance + it.seconds > 0
    )
}

