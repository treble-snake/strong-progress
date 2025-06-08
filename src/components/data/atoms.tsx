import {atom} from 'jotai';
import {LiftHistory, RawSetData} from "@/types";
import {atomWithStorage} from 'jotai/utils'
import {analyzeProgressiveOverload} from "@/engine/progression";

export const rawLiftHistoryAtom = atomWithStorage<RawSetData[]>('rawStrongData', [])

export const liftsProgressAtom = atom<LiftHistory[]>((get) => {
  const sets = get(rawLiftHistoryAtom);
  console.warn('Processing lifts from raw data:', sets.length, 'sets found');
  const liftHistories = analyzeProgressiveOverload(sets);
  console.warn('Processed lifts:', liftHistories.length, 'lifts found');
  return liftHistories
})

export const liftHistoryStatsAtom = atom((get) => {
  const data = get(liftsProgressAtom);
  const activeCount = data.filter(lift => lift.activityStatus === 'Active').length;
  const historyCount = data.filter(lift => lift.activityStatus === 'History').length;
  const newCount = data.filter(lift => lift.activityStatus === 'New').length;
  return {activeCount, historyCount, newCount}
})