import path from 'path';
import {parseCsv} from '../file-reader/server-file-reader';
import {mapStrongAppData} from "@/engine/parsing/strong-app"; // Added import

const BASIC_FIXTURES_FILE = path.join(__dirname, 'fixtures', 'strong-data-example.csv');
const COMPREHENSIVE_FIXTURES_FILE = path.join(__dirname, 'fixtures', 'strong-data-comprehensive.csv');
const INVALID_RPE_FIXTURES_FILE = path.join(__dirname, 'fixtures', 'strong-data-invalid-rpe.csv');

describe('mapStrongAppData', () => { // Changed describe to match function name
  it('should parse basic Strong app data correctly', async () => { // Made test async
    const rawData = await parseCsv(BASIC_FIXTURES_FILE); // Parse CSV
    const result = mapStrongAppData(rawData); // Use parsed data

    // Check that we get the expected number of records
    expect(result).toHaveLength(4);

    // Check the structure and content of the first record
    expect(result[0]).toEqual({
      date: '2022-04-24',
      workoutName: 'Arms',
      exerciseName: 'JM Press - Close Grip DB Bench',
      setMark: '1',
      weight: 25.0,
      reps: 6,
      distance: 0,
      seconds: 0,
      notes: '', // Empty string in the fixture
      workoutNotes: '', // Empty string in the fixture
      rpe: 8, // RPE value is 8 in the fixture
    });

    // Check a record with actual notes and workout notes if available in fixture, or add a new test for it.
    // For now, let's assume the second record might have actual notes.
    // This part depends on the content of 'strong-data-example.csv'
    // Example for result[1] if it had notes:
    // expect(result[1].notes).toBe('Some actual note');
  });

  it('should parse comprehensive Strong app data correctly', async () => {
    const rawData = await parseCsv(COMPREHENSIVE_FIXTURES_FILE);
    const result = mapStrongAppData(rawData);

    // Check the total number of records (should be 10 after filtering out Rest Timer)
    expect(result).toHaveLength(10);

    // Check JM Press exercise (first 4 records)
    const jmPressRecords = result.filter(r => r.exerciseName === 'JM Press - Close Grip DB Bench');
    expect(jmPressRecords).toHaveLength(4);
    expect(jmPressRecords[0].weight).toBe(25.0);
    expect(jmPressRecords[0].reps).toBe(6);
    expect(jmPressRecords[0].rpe).toBe(8);

    // Check Squat exercise
    const squatRecords = result.filter(r => r.exerciseName === 'Squat');
    expect(squatRecords).toHaveLength(4); // Rest Timer should be filtered out

    // First Squat set
    const firstSquatSet = squatRecords.find(r => r.setMark === '1');
    expect(firstSquatSet).toBeDefined();
    expect(firstSquatSet?.weight).toBe(100.0);
    expect(firstSquatSet?.reps).toBe(5);
    expect(firstSquatSet?.notes).toBe('Good form');
    expect(firstSquatSet?.workoutNotes).toBe('Heavy day');

    // Final Squat set
    const finalSquatSet = squatRecords.find(r => r.setMark === 'F');
    expect(finalSquatSet).toBeDefined();
    expect(finalSquatSet?.weight).toBe(100.0);
    expect(finalSquatSet?.reps).toBe(8);
    expect(finalSquatSet?.notes).toBe('Burnout');
    expect(finalSquatSet?.rpe).toBe(9);

    // Check cardio exercises
    const runningRecord = result.find(r => r.exerciseName === 'Running');
    expect(runningRecord).toBeDefined();
    expect(runningRecord?.distance).toBe(5000);
    expect(runningRecord?.notes).toBe('Easy pace');
    expect(runningRecord?.workoutNotes).toBe('Recovery day');

    const rowingRecord = result.find(r => r.exerciseName === 'Rowing');
    expect(rowingRecord).toBeDefined();
    expect(rowingRecord?.seconds).toBe(300);
    expect(rowingRecord?.notes).toBe('Medium intensity');
  });

  it('should handle invalid RPE values correctly', async () => {
    const rawData = await parseCsv(INVALID_RPE_FIXTURES_FILE);
    const result = mapStrongAppData(rawData);

    // Check that we get the expected number of records
    expect(result).toHaveLength(1);

    // Check that the record has the expected values
    expect(result[0]).toEqual({
      date: '2022-04-24',
      workoutName: 'Arms',
      exerciseName: 'JM Press - Close Grip DB Bench',
      setMark: '1',
      weight: 25.0,
      reps: 6,
      distance: 0,
      seconds: 0,
      notes: '',
      workoutNotes: '',
      rpe: undefined, // RPE should be undefined because "N/A" is not a valid number
    });
  });

  it('should filter out rest timers and warmups', async () => { // Made test async
    // Create a mock raw data array that includes rest timers and warmups
    const mockRawData = [
      { Date: '2023-01-01 10:00:00', 'Workout Name': 'Test W', Duration: '10m', 'Exercise Name': 'Exercise 1', 'Set Order': '1', Weight: '10', Reps: '5', Distance: '0', Seconds: '0', Notes: '', 'Workout Notes': '', RPE: '7' },
      { Date: '2023-01-01 10:05:00', 'Workout Name': 'Test W', Duration: '10m', 'Exercise Name': 'Exercise 1', 'Set Order': 'Rest Timer', Weight: '0', Reps: '0', Distance: '0', Seconds: '60', Notes: '', 'Workout Notes': '', RPE: '' },
      { Date: '2023-01-01 10:06:00', 'Workout Name': 'Test W', Duration: '10m', 'Exercise Name': 'Exercise 1', 'Set Order': 'W', Weight: '5', Reps: '10', Distance: '0', Seconds: '0', Notes: 'Warmup', 'Workout Notes': '', RPE: '' },
      { Date: '2023-01-01 10:10:00', 'Workout Name': 'Test W', Duration: '10m', 'Exercise Name': 'Exercise 2', 'Set Order': '1', Weight: '20', Reps: '8', Distance: '0', Seconds: '0', Notes: '', 'Workout Notes': '', RPE: '8' },
      { Date: '2023-01-01 10:10:00', 'Workout Name': 'Test W', Duration: '10m', 'Exercise Name': 'Exercise 3', 'Set Order': '1', Weight: '0', Reps: '0', Distance: '0', Seconds: '0', Notes: '', 'Workout Notes': '', RPE: '' }, // Empty set
    ];
    const result = mapStrongAppData(mockRawData);
    expect(result).toHaveLength(2);
    expect(result.find(r => r.setMark === 'Rest Timer')).toBeUndefined();
    expect(result.find(r => r.setMark === 'W')).toBeUndefined();
    expect(result.find(r => r.exerciseName === 'Exercise 3')).toBeUndefined(); // Filtered out empty set
    expect(result[0].exerciseName).toBe('Exercise 1');
    expect(result[1].exerciseName).toBe('Exercise 2');
  });
});
