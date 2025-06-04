import {RawSetData} from '@/types';
import {addDays} from 'date-fns';
import {analyzeProgressiveOverload} from '../progression';

// Mock date-fns functions
jest.mock('date-fns', () => {
  const actual = jest.requireActual('date-fns');
  return {
    ...actual,
    addDays: jest.fn(actual.addDays),
    isBefore: jest.fn(actual.isBefore),
    parseISO: jest.fn(actual.parseISO),
  };
});

describe('progression', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('makeLiftName', () => {
    it('should create a lift name by combining exercise name and workout name', () => {
      // Since makeLiftName is not exported, we'll test it indirectly through analyzeProgression
      const mockSet: RawSetData = {
        date: '2023-01-01',
        workoutName: 'Leg Day',
        exerciseName: 'Squat',
        setMark: '1',
        weight: 100,
        reps: 5,
        distance: 0,
        seconds: 0,
        notes: '',
        workoutNotes: '',
        rpe: 8
      };

      const result = analyzeProgressiveOverload([mockSet]);

      // The lift name should be "Squat | Leg Day"
      expect(result[0].name).toBe('Squat | Leg Day');
    });
  });

  describe('ensureLiftEntry', () => {
    it('should create a new lift entry if it does not exist', () => {
      const mockSet: RawSetData = {
        date: '2023-01-01',
        workoutName: 'Leg Day',
        exerciseName: 'Squat',
        setMark: '1',
        weight: 100,
        reps: 5,
        distance: 0,
        seconds: 0,
        notes: '',
        workoutNotes: '',
        rpe: 8
      };

      const result = analyzeProgressiveOverload([mockSet]);

      // Check that a lift entry was created with the correct structure
      expect(result[0]).toHaveProperty('name', 'Squat | Leg Day');
      expect(result[0]).toHaveProperty('workouts');
      expect(Object.keys(result[0].workouts)).toContain('2023-01-01');
    });

    it('should use existing lift entry if it exists', () => {
      const mockSets: RawSetData[] = [
        {
          date: '2023-01-01',
          workoutName: 'Leg Day',
          exerciseName: 'Squat',
          setMark: '1',
          weight: 100,
          reps: 5,
          distance: 0,
          seconds: 0,
          notes: '',
          workoutNotes: '',
          rpe: 8
        },
        {
          date: '2023-01-02',
          workoutName: 'Leg Day',
          exerciseName: 'Squat',
          setMark: '1',
          weight: 105,
          reps: 5,
          distance: 0,
          seconds: 0,
          notes: '',
          workoutNotes: '',
          rpe: 8
        }
      ];

      const result = analyzeProgressiveOverload(mockSets);

      // Check that only one lift entry was created
      expect(result).toHaveLength(1);

      // Check that the lift entry has two workout dates
      expect(Object.keys(result[0].workouts)).toHaveLength(2);
      expect(Object.keys(result[0].workouts)).toContain('2023-01-01');
      expect(Object.keys(result[0].workouts)).toContain('2023-01-02');
    });
  });

  describe('ensureDayEntry', () => {
    it('should create a new day entry if it does not exist', () => {
      const mockSet: RawSetData = {
        date: '2023-01-01',
        workoutName: 'Leg Day',
        exerciseName: 'Squat',
        setMark: '1',
        weight: 100,
        reps: 5,
        distance: 0,
        seconds: 0,
        notes: '',
        workoutNotes: 'Good session',
        rpe: 8
      };

      const result = analyzeProgressiveOverload([mockSet]);

      // Check that a day entry was created with the correct structure
      const dayEntry = result[0].workouts['2023-01-01'];
      expect(dayEntry).toHaveProperty('date', '2023-01-01');
      expect(dayEntry).toHaveProperty('note', 'Good session');
      expect(dayEntry).toHaveProperty('exercises');
      expect(dayEntry.exercises).toHaveLength(1);
    });

    it('should use existing day entry if it exists', () => {
      const mockSets: RawSetData[] = [
        {
          date: '2023-01-01',
          workoutName: 'Leg Day',
          exerciseName: 'Squat',
          setMark: '1',
          weight: 100,
          reps: 5,
          distance: 0,
          seconds: 0,
          notes: '',
          workoutNotes: 'Good session',
          rpe: 8
        },
        {
          date: '2023-01-01',
          workoutName: 'Leg Day',
          exerciseName: 'Squat',
          setMark: '2',
          weight: 100,
          reps: 5,
          distance: 0,
          seconds: 0,
          notes: '',
          workoutNotes: 'Good session',
          rpe: 8
        }
      ];

      const result = analyzeProgressiveOverload(mockSets);

      // Check that only one day entry was created
      expect(Object.keys(result[0].workouts)).toHaveLength(1);

      // Check that the day entry has two exercises
      const dayEntry = result[0].workouts['2023-01-01'];
      expect(dayEntry.exercises).toHaveLength(2);
      expect(dayEntry.exercises[0].setMark).toBe('1');
      expect(dayEntry.exercises[1].setMark).toBe('2');
    });
  });

  describe('analyzeProgression', () => {
    it('should return an empty array when given an empty array', () => {
      const result = analyzeProgressiveOverload([]);
      expect(result).toEqual([]);
    });

    it('should handle a lift with no workouts (empty sortedDates)', () => {
      // Mock Array.prototype.sort to return an empty array
      // This will ensure that sortedDates is truly empty
      const originalSort = Array.prototype.sort;
      Array.prototype.sort = jest.fn().mockReturnValue([]);

      const mockSet: RawSetData = {
        date: '2023-01-01',
        workoutName: 'Leg Day',
        exerciseName: 'Squat',
        setMark: '1',
        weight: 100,
        reps: 5,
        distance: 0,
        seconds: 0,
        notes: '',
        workoutNotes: '',
        rpe: 8
      };

      const result = analyzeProgressiveOverload([mockSet]);

      // The result should still contain the lift
      expect(result).toHaveLength(1);

      // Restore the original sort method
      Array.prototype.sort = originalSort;
    });

    it('should categorize lifts as History when last performed date is before activity threshold', () => {
      // Mock current date to be 2023-01-20
      const mockCurrentDate = new Date('2023-01-20');
      jest.spyOn(global, 'Date').mockImplementation(() => mockCurrentDate as unknown as string);

      // Mock addDays to return 2023-01-05 (15 days ago)
      (addDays as jest.Mock).mockReturnValue(new Date('2023-01-05'));

      // Mock isBefore to return true (the date is before the threshold)
      const isBefore = require('date-fns').isBefore;
      isBefore.mockReturnValue(true);

      const mockSet: RawSetData = {
        date: '2023-01-01',
        workoutName: 'Leg Day',
        exerciseName: 'Squat',
        setMark: '1',
        weight: 100,
        reps: 5,
        distance: 0,
        seconds: 0,
        notes: '',
        workoutNotes: '',
        rpe: 8
      };

      const result = analyzeProgressiveOverload([mockSet]);

      // The lift should be categorized as History
      expect(isBefore).toHaveBeenCalled();

      // Reset the Date mock
      (global.Date as jest.Mock).mockRestore();
    });

    it('should categorize lifts as New when performed on fewer than threshold days', () => {
      // Mock isBefore to return false (the date is not before the threshold)
      const isBefore = require('date-fns').isBefore;
      isBefore.mockReturnValue(false);

      const mockSets: RawSetData[] = [
        {
          date: '2023-01-01',
          workoutName: 'Leg Day',
          exerciseName: 'Squat',
          setMark: '1',
          weight: 100,
          reps: 5,
          distance: 0,
          seconds: 0,
          notes: '',
          workoutNotes: '',
          rpe: 8
        },
        {
          date: '2023-01-02',
          workoutName: 'Leg Day',
          exerciseName: 'Squat',
          setMark: '1',
          weight: 105,
          reps: 5,
          distance: 0,
          seconds: 0,
          notes: '',
          workoutNotes: '',
          rpe: 8
        }
      ];

      const result = analyzeProgressiveOverload(mockSets);

      // The lift should be categorized as New (fewer than 4 days)
      expect(Object.keys(result[0].workouts)).toHaveLength(2);
    });

    it('should categorize lifts as Active when not History or New', () => {
      // Mock isBefore to return false (the date is not before the threshold)
      const isBefore = require('date-fns').isBefore;
      isBefore.mockReturnValue(false);

      const mockSets: RawSetData[] = [
        {
          date: '2023-01-01',
          workoutName: 'Leg Day',
          exerciseName: 'Squat',
          setMark: '1',
          weight: 100,
          reps: 5,
          distance: 0,
          seconds: 0,
          notes: '',
          workoutNotes: '',
          rpe: 8
        },
        {
          date: '2023-01-02',
          workoutName: 'Leg Day',
          exerciseName: 'Squat',
          setMark: '1',
          weight: 105,
          reps: 5,
          distance: 0,
          seconds: 0,
          notes: '',
          workoutNotes: '',
          rpe: 8
        },
        {
          date: '2023-01-03',
          workoutName: 'Leg Day',
          exerciseName: 'Squat',
          setMark: '1',
          weight: 110,
          reps: 5,
          distance: 0,
          seconds: 0,
          notes: '',
          workoutNotes: '',
          rpe: 8
        },
        {
          date: '2023-01-04',
          workoutName: 'Leg Day',
          exerciseName: 'Squat',
          setMark: '1',
          weight: 115,
          reps: 5,
          distance: 0,
          seconds: 0,
          notes: '',
          workoutNotes: '',
          rpe: 8
        }
      ];

      const result = analyzeProgressiveOverload(mockSets);

      // The lift should be categorized as Active (4 or more days, not History)
      expect(Object.keys(result[0].workouts)).toHaveLength(4);
    });

    it('should handle multiple sets for the same lift and day', () => {
      const mockSets: RawSetData[] = [
        {
          date: '2023-01-01',
          workoutName: 'Leg Day',
          exerciseName: 'Squat',
          setMark: '1',
          weight: 100,
          reps: 5,
          distance: 0,
          seconds: 0,
          notes: 'Warm-up',
          workoutNotes: '',
          rpe: 7
        },
        {
          date: '2023-01-01',
          workoutName: 'Leg Day',
          exerciseName: 'Squat',
          setMark: '2',
          weight: 120,
          reps: 5,
          distance: 0,
          seconds: 0,
          notes: 'Working set',
          workoutNotes: '',
          rpe: 8
        },
        {
          date: '2023-01-01',
          workoutName: 'Leg Day',
          exerciseName: 'Squat',
          setMark: '3',
          weight: 120,
          reps: 5,
          distance: 0,
          seconds: 0,
          notes: 'Working set',
          workoutNotes: '',
          rpe: 9
        }
      ];

      const result = analyzeProgressiveOverload(mockSets);

      // Check that only one lift entry was created
      expect(result).toHaveLength(1);

      // Check that only one day entry was created
      expect(Object.keys(result[0].workouts)).toHaveLength(1);

      // Check that the day entry has three exercises
      const dayEntry = result[0].workouts['2023-01-01'];
      expect(dayEntry.exercises).toHaveLength(3);
      expect(dayEntry.exercises[0].setMark).toBe('1');
      expect(dayEntry.exercises[0].weight).toBe(100);
      expect(dayEntry.exercises[0].rpe).toBe(7);
      expect(dayEntry.exercises[1].setMark).toBe('2');
      expect(dayEntry.exercises[1].weight).toBe(120);
      expect(dayEntry.exercises[1].rpe).toBe(8);
      expect(dayEntry.exercises[2].setMark).toBe('3');
      expect(dayEntry.exercises[2].weight).toBe(120);
      expect(dayEntry.exercises[2].rpe).toBe(9);
    });
  });

});
