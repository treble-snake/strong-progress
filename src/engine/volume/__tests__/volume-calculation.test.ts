import { limitSets } from '../volume-calculation';
import dayjs from 'dayjs';
import { RawSetData } from '@/types';

describe('limitSets', () => {
  // Helper function to create test sets with different dates
  const createTestSet = (date: string, exerciseName: string = 'Test Exercise'): RawSetData => ({
    date,
    workoutName: 'Test Workout',
    exerciseName,
    setMark: '1',
    weight: 100,
    reps: 10,
    distance: 0,
    seconds: 0,
    notes: '',
    workoutNotes: '',
    rpe: 8
  });

  // Helper function to create an array of test sets with sequential dates
  const createTestSets = (startDate: string, count: number): RawSetData[] => {
    const result: RawSetData[] = [];
    let currentDate = dayjs(startDate);
    
    for (let i = 0; i < count; i++) {
      result.push(createTestSet(currentDate.format('YYYY-MM-DD')));
      currentDate = currentDate.add(1, 'day');
    }
    
    return result;
  };

  it('should return an empty array when given an empty array', () => {
    const fromDate = dayjs('2023-01-01');
    const toDate = dayjs('2023-01-31');
    
    const result = limitSets([], fromDate, toDate);
    
    expect(result).toEqual([]);
  });

  it('should return all sets when all are within the date range', () => {
    const sets = createTestSets('2023-01-10', 5); // Creates sets for Jan 10-14
    const fromDate = dayjs('2023-01-01');
    const toDate = dayjs('2023-01-31');
    
    const result = limitSets(sets, fromDate, toDate);
    
    expect(result).toHaveLength(5);
    expect(result).toEqual(sets);
  });

  it('should return an empty array when all sets are outside the date range', () => {
    const sets = createTestSets('2023-02-01', 5); // Creates sets for Feb 1-5
    const fromDate = dayjs('2023-01-01');
    const toDate = dayjs('2023-01-31');
    
    const result = limitSets(sets, fromDate, toDate);
    
    expect(result).toEqual([]);
  });

  it('should filter sets correctly in forward mode', () => {
    // Create sets where the first date is closer to fromDate than the last date is to toDate
    const sets = createTestSets('2023-01-25', 10); // Creates sets for Jan 25 - Feb 3
    const fromDate = dayjs('2023-01-20'); // 5 days before first set
    const toDate = dayjs('2023-01-29'); // 5 days before last set
    
    const result = limitSets(sets, fromDate, toDate);
    
    // Should include sets from Jan 25-29 (5 sets)
    expect(result).toHaveLength(5);
    expect(result[0].date).toBe('2023-01-25');
    expect(result[4].date).toBe('2023-01-29');
  });

  it('should filter sets correctly in backward mode', () => {
    // Create sets where the last date is closer to toDate than the first date is to fromDate
    const sets = createTestSets('2023-01-01', 10); // Creates sets for Jan 1-10
    const fromDate = dayjs('2023-01-05'); // 4 days after first set
    const toDate = dayjs('2023-01-15'); // 5 days after last set
    
    const result = limitSets(sets, fromDate, toDate);
    
    // Should include sets from Jan 5-10 (6 sets)
    expect(result).toHaveLength(6);
    expect(result[0].date).toBe('2023-01-05');
    expect(result[5].date).toBe('2023-01-10');
  });

  it('should include sets exactly on the boundary dates', () => {
    const sets = [
      createTestSet('2023-01-01'),
      createTestSet('2023-01-15'),
      createTestSet('2023-01-31')
    ];
    const fromDate = dayjs('2023-01-01');
    const toDate = dayjs('2023-01-31');
    
    const result = limitSets(sets, fromDate, toDate);
    
    expect(result).toHaveLength(3);
    expect(result[0].date).toBe('2023-01-01');
    expect(result[2].date).toBe('2023-01-31');
  });

  it('should reverse the result when in backward mode', () => {
    // Create a scenario where backward mode is triggered but the dates are out of order
    const sets = [
      createTestSet('2023-01-20'),
      createTestSet('2023-01-25'),
      createTestSet('2023-01-30')
    ];
    // Make the last date closer to toDate than the first date is to fromDate
    const fromDate = dayjs('2023-01-15'); // 5 days before first set
    const toDate = dayjs('2023-01-31'); // 1 day after last set
    
    // This should trigger backward mode, but the result should still be in ascending order
    const result = limitSets(sets, fromDate, toDate);
    
    expect(result).toHaveLength(3);
    expect(result[0].date).toBe('2023-01-20');
    expect(result[1].date).toBe('2023-01-25');
    expect(result[2].date).toBe('2023-01-30');
  });

  it('should handle the case when fromDate is after toDate', () => {
    const sets = createTestSets('2023-01-10', 5);
    const fromDate = dayjs('2023-01-31');
    const toDate = dayjs('2023-01-01');
    
    const result = limitSets(sets, fromDate, toDate);
    
    // Should return an empty array since no sets can be in an invalid range
    expect(result).toEqual([]);
  });
});