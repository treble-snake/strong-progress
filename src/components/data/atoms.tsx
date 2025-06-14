import {atom} from 'jotai';
import {LiftHistory, RawSetData} from "@/types";
import {atomWithStorage} from 'jotai/utils'
import {analyzeProgressiveOverload} from "@/engine/progression";
import dayjs from "dayjs";
import {
  calculateWeeklyVolume,
  WeeklyVolumeResults
} from "@/engine/volume/volume-calculation";

export const rawLiftHistoryLoadingAtom = atom<{
  isLoading: boolean,
  error?: string
}>({
  isLoading: false,
  error: undefined
});

export const lastUploadedDateAtom = atomWithStorage<string | undefined>(
  'lastUploadedDate', undefined, undefined, {getOnInit: true}
)

export const rawLiftHistoryAtom = atomWithStorage<RawSetData[]>(
  'rawStrongData', [], undefined, {getOnInit: true}
)

export const liftsProgressAtom = atom<LiftHistory[]>((get) => {
  const sets = get(rawLiftHistoryAtom);
  console.debug('Processing lifts from raw data:', sets.length, 'sets found');
  const liftHistories = analyzeProgressiveOverload(sets);
  console.debug('Processed lifts:', liftHistories.length, 'lifts found');
  return liftHistories
})

export const liftHistoryStatsAtom = atom((get) => {
  const data = get(liftsProgressAtom);
  const activeCount = data.filter(lift => lift.activityStatus === 'Active').length;
  const historyCount = data.filter(lift => lift.activityStatus === 'History').length;
  const newCount = data.filter(lift => lift.activityStatus === 'New').length;
  return {activeCount, historyCount, newCount}
})

export enum UnitSystem {
  Metric = 'metric',
  Imperial = 'imperial'
}

export type UiSettings = {
  progressAnalysisTipHidden: boolean;
  units: UnitSystem;
}

export const uiSettingsAtom = atomWithStorage<UiSettings>(
  'uiSettings', {
    progressAnalysisTipHidden: false,
    units: UnitSystem.Metric,
  }, undefined, {getOnInit: true});

export const volumeDateRangeAtom = atomWithStorage<[string, string]>('volumeDateRange',
  [
    dayjs().subtract(4, 'weeks').startOf('day').toISOString(),
    dayjs().endOf('day').toISOString()
  ], undefined, {getOnInit: true});

export const setsForWeeklyVolumeAtom = atom<WeeklyVolumeResults>((get) => {
  const dateRange = get(volumeDateRangeAtom);
  const sets = get(rawLiftHistoryAtom);
  if (!dateRange) {
    return calculateWeeklyVolume([], '', '');
  }

  return calculateWeeklyVolume(sets, dateRange[0], dateRange[1]);
})