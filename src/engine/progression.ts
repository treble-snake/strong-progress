import {
  LiftActivityStatus,
  LiftDayData,
  LiftHistory,
  LiftProgressStatus,
  LiftSetData,
  PerformanceChange,
  RawSetData
} from "@/types";
import {addDays, isBefore, parseISO} from "date-fns";
import {groupByLift} from "@/engine/parsing";

// If a lift was performed less than this many days, we won't assess progression
const TOTAL_DAYS_THRESHOLD = 4;

// Define the active period threshold (14 days)
const ACTIVE_DAYS_THRESHOLD = 15;

const WEIRD_REP_DIFF_COEFFICIENT = 0.55; // 50% difference in reps is considered too much

export const compareSetPerformance = (previous: LiftSetData, current: LiftSetData): PerformanceChange => {
  const previousPerf = previous.reps
  const currentPerf = current.reps;

  // TODO: this might be too strict, or different for duration- or distance-based lifts
  const diff = Math.abs(previousPerf - currentPerf);
  if (diff > previousPerf * WEIRD_REP_DIFF_COEFFICIENT) {
    return PerformanceChange.NotSure;
  }

  if (previous.weight === current.weight && previousPerf === currentPerf) {
    return PerformanceChange.NoChange;
  }

  if ((current.weight > previous.weight) ||
    (previous.weight === current.weight && currentPerf > previousPerf)) {
    return PerformanceChange.Increase;
  }

  if ((current.weight < previous.weight) ||
    (previous.weight === current.weight && currentPerf < previousPerf)) {
    return PerformanceChange.Decrease;
  }

  return PerformanceChange.NotSure;
}

export const computePerformanceChange = (previous: LiftDayData, current: LiftDayData): PerformanceChange => {
  if (previous.sets.length === 0 || current.sets.length === 0) {
    return PerformanceChange.NotSure;
  }

  const length = Math.max(previous.sets.length, current.sets.length);
  for (let i = 0; i < length; i++) {
    const previousSet = previous.sets[i];
    const currentSet = current.sets[i];

    // If we don't have a previous set - means we did an extra set today, it's an increase
    if (!previousSet) {
      return PerformanceChange.Increase
    }
    // If we don't have a current set - means we did less today, it's a decrease
    if (!currentSet) {
      return PerformanceChange.Decrease
    }
    const change = compareSetPerformance(previousSet, currentSet);
    if (change !== PerformanceChange.NoChange) {
      return change;
    }
  }

  return PerformanceChange.NoChange
}

const computeProgressStatus = (
  lift: LiftHistory, recentCount: number = 5
): LiftProgressStatus => {
  if (lift.workouts.length < 4) {
    return LiftProgressStatus.NotSure
  }

  const performanceHistory = lift.workouts;

  const is = (change: PerformanceChange) =>
    (it: LiftDayData) => it.performanceChange === change;

  const lastTwo = performanceHistory.slice(-2);
  if (lastTwo.every(is(PerformanceChange.Increase))) {
    return LiftProgressStatus.Progressing;
  }
  if (lastTwo.every(is(PerformanceChange.Decrease))) {
    return LiftProgressStatus.Regressing;
  }
  const lastThree = performanceHistory.slice(-3);
  if (lastThree.every(is(PerformanceChange.NoChange))) {
    return LiftProgressStatus.Plateaued;
  }

  const recent = performanceHistory.slice(-recentCount);
  const inc = recent.filter(is(PerformanceChange.Increase)).length;
  const dec = recent.filter(is(PerformanceChange.Decrease)).length;

  if (inc === 0) {
    return dec > 0 ?
      LiftProgressStatus.Regressing :
      LiftProgressStatus.Plateaued;
  }

  if (dec === 0 || inc > dec || !lastTwo.some(is(PerformanceChange.Decrease))) {
    return LiftProgressStatus.Struggling
  }

  return LiftProgressStatus.AtRisk;
}

const getActivityStatus = (lift: LiftHistory): LiftActivityStatus => {
  const activityThreshold = addDays(new Date(), -ACTIVE_DAYS_THRESHOLD);
  const lastPerformedDate = lift.workouts?.[lift.workouts.length - 1]?.date
  if (lastPerformedDate && isBefore(parseISO(lastPerformedDate), activityThreshold)) {
    return LiftActivityStatus.History;
  }

  if (Object.values(lift.workouts).length < TOTAL_DAYS_THRESHOLD) {
    return LiftActivityStatus.New;
  }

  return LiftActivityStatus.Active;
}

const PROGRESSION_STATUS_ORDER = {
  [LiftProgressStatus.Regressing]: 1,
  [LiftProgressStatus.Plateaued]: 2,
  [LiftProgressStatus.AtRisk]: 3,
  [LiftProgressStatus.Struggling]: 4,
  [LiftProgressStatus.Progressing]: 5,
  [LiftProgressStatus.NotSure]: 6,
};

const compareProgressionStatus = (a: LiftHistory, b: LiftHistory): number => {
  const statusA = a.progressStatus ? PROGRESSION_STATUS_ORDER[a.progressStatus] : 0;
  const statusB = b.progressStatus ? PROGRESSION_STATUS_ORDER[b.progressStatus] : 0;
  return statusA - statusB;
}

export const analyzeProgressiveOverload = (sets: RawSetData[]): LiftHistory[] => {
  return groupByLift(sets).map((lift) => {
    // Compute performance change for each day (days are already in ascending order)
    lift.workouts[0].performanceChange = PerformanceChange.NoChange;
    for (let i = 1; i < Object.keys(lift.workouts).length; i++) {
      const previousDay = Object.values(lift.workouts)[i - 1];
      const currentDay = Object.values(lift.workouts)[i];
      currentDay.performanceChange = computePerformanceChange(previousDay, currentDay);
    }
    lift.progressStatus = computeProgressStatus(lift);
    lift.activityStatus = getActivityStatus(lift);

    return lift
  }).sort(compareProgressionStatus)
}
