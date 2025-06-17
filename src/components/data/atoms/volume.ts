import {atomWithStorage} from "jotai/utils";
import dayjs from "dayjs";
import {atom} from "jotai/index";
import {
  calculateWeeklyVolume,
  WeeklyVolumeResults
} from "@/engine/volume/volume-calculation";
import {rawLiftHistoryAtom} from "@/components/data/atoms/root";

export enum VolumeDateDirection {
  Before = 'before',
  After = 'after'
}

type VolumeDateSettings = {
  selectedDuration: number; // in weeks
  selectedDirection: VolumeDateDirection;
  selectedDate: string; // ISO date string
}

export const volumeDateSettingsAtom = atomWithStorage<VolumeDateSettings>(
  'volumeDateSettings',
  {
    selectedDuration: 4,
    selectedDirection: VolumeDateDirection.Before,
    selectedDate: dayjs().endOf('day').format('YYYY-MM-DD'),
  }, undefined, {getOnInit: true}
);

type VolumeDateRange = {
  from: string; // ISO date string
  to: string; // ISO date string
}

export const volumeDateRangeAtom = atom<VolumeDateRange>((get) => {
  const dateRange = get(volumeDateSettingsAtom);
  let from = dayjs(dateRange.selectedDate);
  let to = dayjs(dateRange.selectedDate);
  if (dateRange.selectedDirection === VolumeDateDirection.Before) {
    from = from.subtract(dateRange.selectedDuration, 'weeks').add(1, 'days').startOf('day');
  } else {
    to = to.add(dateRange.selectedDuration, 'weeks').subtract(1, 'days').endOf('day');
  }

  return {
    from: from.format('YYYY-MM-DD'),
    to: to.format('YYYY-MM-DD')
  }
})

export const setsForWeeklyVolumeAtom = atom<WeeklyVolumeResults>((get) => {
  const dateRange = get(volumeDateRangeAtom);
  const sets = get(rawLiftHistoryAtom);
  return calculateWeeklyVolume(sets, dateRange.from, dateRange.to);
})