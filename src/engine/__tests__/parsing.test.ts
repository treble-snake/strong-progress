import {mapStrongAppData} from '../parsing';
import path from "path";

const BASIC_FIXTURES_FILE = path.join(__dirname, 'fixtures', 'strong-data-example.csv');
const COMPREHENSIVE_FIXTURES_FILE = path.join(__dirname, 'fixtures', 'strong-data-comprehensive.csv');
const INVALID_RPE_FIXTURES_FILE = path.join(__dirname, 'fixtures', 'strong-data-invalid-rpe.csv');

describe('parseStrongAppData', () => {
  it('should parse basic Strong app data correctly', () => {
    const result = mapStrongAppData(BASIC_FIXTURES_FILE);

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
      notes: '"',
      workoutNotes: '"',
      rpe: 8
    });

    // Check specific transformations for other records
    expect(result[1].setMark).toBe('2');
    expect(result[1].rpe).toBe(9);

    expect(result[2].weight).toBe(22.5);
    expect(result[2].reps).toBe(8);

    // Check the last record with 'F' as setMark
    expect(result[3].setMark).toBe('F');
    expect(result[3].weight).toBe(20.0);
    expect(result[3].reps).toBe(10);
    expect(result[3].rpe).toBe(10);
  });

  it('should handle comprehensive data with various edge cases', () => {
    const result = mapStrongAppData(COMPREHENSIVE_FIXTURES_FILE);

    // The comprehensive fixture has 13 lines, but after filtering:
    // - 1 "Rest Timer" record should be removed
    // - 1 record with all zeros (no reps, distance, or seconds) should be removed
    // - The "Stretching" record is also filtered out as it has zeros for reps, distance, and seconds
    // So we expect 10 records
    expect(result).toHaveLength(10);

    // Verify that "Rest Timer" records are filtered out
    expect(result.every(item => item.setMark !== "Rest Timer")).toBe(true);

    // Verify that records with all zeros are filtered out
    expect(result.every(item => item.reps + item.distance + item.seconds > 0)).toBe(true);

    // Check empty RPE values are converted to null
    const squat1 = result.find(item => 
      item.exerciseName === 'Squat' && item.setMark === '1');
    expect(squat1?.rpe).toBeNull();

    // Check notes and workout notes are parsed correctly
    expect(squat1?.notes).toBe('Good form');
    expect(squat1?.workoutNotes).toBe('Heavy day');

    // Check distance-based exercise
    const running = result.find(item => item.exerciseName === 'Running');
    expect(running?.distance).toBe(5000);
    expect(running?.reps).toBe(0);
    expect(running?.weight).toBe(0);

    // Check time-based exercise
    const rowing = result.find(item => item.exerciseName === 'Rowing');
    expect(rowing?.seconds).toBe(300);
    expect(rowing?.rpe).toBeNull();
  });

  it('should handle non-existent files gracefully', () => {
    const nonExistentFile = path.join(__dirname, 'fixtures', 'non-existent-file.csv');
    const result = mapStrongAppData(nonExistentFile);

    expect(result).toEqual([]);
  });

  it('should handle non-numeric RPE values correctly', () => {
    const result = mapStrongAppData(INVALID_RPE_FIXTURES_FILE);

    // Check that we get the expected number of records
    expect(result).toHaveLength(1);

    // Check that the non-numeric RPE value is converted to null
    expect(result[0].rpe).toBeUndefined();
  });
});
