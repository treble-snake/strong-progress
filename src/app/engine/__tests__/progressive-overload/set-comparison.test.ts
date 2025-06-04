import {LiftDayData, LiftSetData, PerformanceChange} from "@/types";
import {
  compareSetPerformance,
  computePerformanceChange
} from "@/app/engine/progression";

const liftSet = (weight: number, reps: number): LiftSetData =>
  ({setMark: "", weight, reps, rpe: null, notes: ""});

const liftDay = (exercises: LiftSetData[]): LiftDayData =>
  ({date: '2023-01-01', note: '', exercises});


describe('compareSetPerformance', () => {
  it('should find performance increase for same weight but more reps', () => {
    expect(compareSetPerformance(liftSet(100, 5), liftSet(100, 6))).toEqual(PerformanceChange.Increase);
  });

  it('should find performance increase for more weight even with slightly lower reps', () => {
    expect(compareSetPerformance(liftSet(100, 5), liftSet(105, 4))).toEqual(PerformanceChange.Increase);
  });

  it('should find no change if all are the same', () => {
    expect(compareSetPerformance(liftSet(100, 5), liftSet(100, 5))).toEqual(PerformanceChange.NoChange);
  });

  it('should find performance decrease for same weight but fewer reps', () => {
    expect(compareSetPerformance(liftSet(100, 6), liftSet(100, 5))).toEqual(PerformanceChange.Decrease);
  })

  it('should find performance decrease for less weight even with more reps', () => {
    expect(compareSetPerformance(liftSet(100, 6), liftSet(90, 8))).toEqual(PerformanceChange.Decrease);
  });

  it('should be not sure if reps are significantly >50% differ, regardless of weight', () => {
    expect(compareSetPerformance(liftSet(100, 6), liftSet(90, 15))).toEqual(PerformanceChange.NotSure);
    expect(compareSetPerformance(liftSet(100, 8), liftSet(200, 2))).toEqual(PerformanceChange.NotSure);
  });

  it('should return NotSure in other weight cases', () => {
    // @ts-expect-error testing invalid values
    expect(compareSetPerformance(liftSet(-1, 5), liftSet("as", 5))).toEqual(PerformanceChange.NotSure);
  });
});

describe('computePerformanceChane', () => {
  it('should return not sure if there are no sets on any day', () => {
    expect(computePerformanceChange(liftDay([]), liftDay([])))
      .toBe(PerformanceChange.NotSure);
    expect(computePerformanceChange(liftDay([liftSet(100, 5)]), liftDay([])))
      .toBe(PerformanceChange.NotSure);
    expect(computePerformanceChange(liftDay([]), liftDay([liftSet(100, 5)])))
      .toBe(PerformanceChange.NotSure);
  });

  it('should return Increase when fewer previous sets', () => {
    const result = computePerformanceChange(
      liftDay([liftSet(100, 5)]),
      liftDay([liftSet(100, 5), liftSet(100, 5)]));

    expect(result).toBe(PerformanceChange.Increase);
  });

  it('should return Decrease when more previous sets', () => {
    const result = computePerformanceChange(
      liftDay([liftSet(100, 5), liftSet(100, 5)]),
      liftDay([liftSet(100, 5)]));

    expect(result).toBe(PerformanceChange.Decrease);
  });

  it('should return the result of compareSetPerformance when it is not NoChange', () => {
    const result = computePerformanceChange(
      liftDay([liftSet(100, 5)]),
      liftDay([liftSet(110, 5)]));

    expect(result).toBe(PerformanceChange.Increase);
  });

  it('should return the result of compareSetPerformance when it is not NoChange with multiple sets', () => {
    const result = computePerformanceChange(
      liftDay([liftSet(100, 5), liftSet(100, 4)]),
      liftDay([liftSet(100, 5), liftSet(100, 3)]));

    expect(result).toBe(PerformanceChange.Decrease);
  });

  it('should return NoChange when all sets are compared and none have changes', () => {
    const result = computePerformanceChange(
      liftDay([liftSet(100, 5), liftSet(110, 5)]),
      liftDay([liftSet(100, 5), liftSet(110, 5)]));

    expect(result).toBe(PerformanceChange.NoChange);
  });
});
