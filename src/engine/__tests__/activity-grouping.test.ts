import { groupByLift } from '../parsing';
import { LiftProgressStatus, RawSetData } from '@/types';

describe('groupByLift', () => {
  it('should return an empty array for empty input', () => {
    const result = groupByLift([]);
    expect(result).toEqual([]);
  });

  it('should group sets by lift name (exercise + workout)', () => {
    const sets: RawSetData[] = [
      {
        date: '2023-01-01',
        workoutName: 'Workout A',
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
        date: '2023-01-01',
        workoutName: 'Workout A',
        exerciseName: 'Bench Press',
        setMark: '1',
        weight: 80,
        reps: 5,
        distance: 0,
        seconds: 0,
        notes: '',
        workoutNotes: '',
        rpe: 7
      }
    ];

    const result = groupByLift(sets);
    
    expect(result).toHaveLength(2);
    
    // Check first lift (Squat)
    const squatLift = result.find(lift => lift.name === 'Squat | Workout A');
    expect(squatLift).toBeDefined();
    expect(squatLift?.workouts).toHaveLength(1);
    expect(squatLift?.workouts[0].date).toBe('2023-01-01');
    expect(squatLift?.workouts[0].sets).toHaveLength(1);
    expect(squatLift?.workouts[0].sets[0].weight).toBe(100);
    expect(squatLift?.workouts[0].sets[0].reps).toBe(5);
    expect(squatLift?.workouts[0].sets[0].rpe).toBe(8);
    expect(squatLift?.sessionNames).toEqual(['Workout A']);
    expect(squatLift?.progressStatus).toBe(LiftProgressStatus.NotSure);
    
    // Check second lift (Bench Press)
    const benchLift = result.find(lift => lift.name === 'Bench Press | Workout A');
    expect(benchLift).toBeDefined();
    expect(benchLift?.workouts).toHaveLength(1);
    expect(benchLift?.workouts[0].date).toBe('2023-01-01');
    expect(benchLift?.workouts[0].sets).toHaveLength(1);
    expect(benchLift?.workouts[0].sets[0].weight).toBe(80);
    expect(benchLift?.workouts[0].sets[0].reps).toBe(5);
    expect(benchLift?.workouts[0].sets[0].rpe).toBe(7);
    expect(benchLift?.sessionNames).toEqual(['Workout A']);
    expect(benchLift?.progressStatus).toBe(LiftProgressStatus.NotSure);
  });

  it('should group multiple sets of the same lift on the same day', () => {
    const sets: RawSetData[] = [
      {
        date: '2023-01-01',
        workoutName: 'Workout A',
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
        date: '2023-01-01',
        workoutName: 'Workout A',
        exerciseName: 'Squat',
        setMark: '2',
        weight: 100,
        reps: 5,
        distance: 0,
        seconds: 0,
        notes: '',
        workoutNotes: '',
        rpe: 8
      },
      {
        date: '2023-01-01',
        workoutName: 'Workout A',
        exerciseName: 'Squat',
        setMark: '3',
        weight: 100,
        reps: 5,
        distance: 0,
        seconds: 0,
        notes: '',
        workoutNotes: '',
        rpe: 9
      }
    ];

    const result = groupByLift(sets);
    
    expect(result).toHaveLength(1);
    
    const squatLift = result[0];
    expect(squatLift.name).toBe('Squat | Workout A');
    expect(squatLift.workouts).toHaveLength(1);
    expect(squatLift.workouts[0].date).toBe('2023-01-01');
    expect(squatLift.workouts[0].sets).toHaveLength(3);
    
    // Check all sets
    expect(squatLift.workouts[0].sets[0].setMark).toBe('1');
    expect(squatLift.workouts[0].sets[1].setMark).toBe('2');
    expect(squatLift.workouts[0].sets[2].setMark).toBe('3');
    expect(squatLift.workouts[0].sets[2].rpe).toBe(9);
  });

  it('should group sets of the same lift across different days', () => {
    const sets: RawSetData[] = [
      {
        date: '2023-01-01',
        workoutName: 'Workout A',
        exerciseName: 'Squat',
        setMark: '1',
        weight: 100,
        reps: 5,
        distance: 0,
        seconds: 0,
        notes: 'Day 1',
        workoutNotes: '',
        rpe: 8
      },
      {
        date: '2023-01-08',
        workoutName: 'Workout A',
        exerciseName: 'Squat',
        setMark: '1',
        weight: 105,
        reps: 5,
        distance: 0,
        seconds: 0,
        notes: 'Day 2',
        workoutNotes: '',
        rpe: 8
      }
    ];

    const result = groupByLift(sets);
    
    expect(result).toHaveLength(1);
    
    const squatLift = result[0];
    expect(squatLift.name).toBe('Squat | Workout A');
    expect(squatLift.workouts).toHaveLength(2);
    
    // Check first day
    const day1 = squatLift.workouts.find(w => w.date === '2023-01-01');
    expect(day1).toBeDefined();
    expect(day1?.sets).toHaveLength(1);
    expect(day1?.sets[0].weight).toBe(100);
    expect(day1?.liftNotes).toBe('Day 1');
    
    // Check second day
    const day2 = squatLift.workouts.find(w => w.date === '2023-01-08');
    expect(day2).toBeDefined();
    expect(day2?.sets).toHaveLength(1);
    expect(day2?.sets[0].weight).toBe(105);
    expect(day2?.liftNotes).toBe('Day 2');
  });

  it('should handle the same exercise in different workout types', () => {
    const sets: RawSetData[] = [
      {
        date: '2023-01-01',
        workoutName: 'Workout A',
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
        date: '2023-01-01',
        workoutName: 'Workout B',
        exerciseName: 'Squat',
        setMark: '1',
        weight: 80,
        reps: 8,
        distance: 0,
        seconds: 0,
        notes: '',
        workoutNotes: '',
        rpe: 7
      }
    ];

    const result = groupByLift(sets);
    
    expect(result).toHaveLength(2);
    
    // Check Squat in Workout A
    const squatA = result.find(lift => lift.name === 'Squat | Workout A');
    expect(squatA).toBeDefined();
    expect(squatA?.workouts[0].sets[0].weight).toBe(100);
    expect(squatA?.workouts[0].sets[0].reps).toBe(5);
    
    // Check Squat in Workout B
    const squatB = result.find(lift => lift.name === 'Squat | Workout B');
    expect(squatB).toBeDefined();
    expect(squatB?.workouts[0].sets[0].weight).toBe(80);
    expect(squatB?.workouts[0].sets[0].reps).toBe(8);
  });

  it('should collect all session names for a lift', () => {
    const sets: RawSetData[] = [
      {
        date: '2023-01-01',
        workoutName: 'Legs',
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
        date: '2023-01-08',
        workoutName: 'Full Body',
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

    const result = groupByLift(sets);
    
    expect(result).toHaveLength(2);
    
    // Check Squat in Legs
    const squatLegs = result.find(lift => lift.name === 'Squat | Legs');
    expect(squatLegs).toBeDefined();
    expect(squatLegs?.sessionNames).toEqual(['Legs']);
    
    // Check Squat in Full Body
    const squatFullBody = result.find(lift => lift.name === 'Squat | Full Body');
    expect(squatFullBody).toBeDefined();
    expect(squatFullBody?.sessionNames).toEqual(['Full Body']);
  });
});