import {ApiError} from "@/utils/fetcher";
import {LiftActivityStatus, LiftHistory} from "@/types";
import {useAtomValue, useSetAtom} from "jotai";
import {
  liftHistoryStatsAtom,
  liftsProgressAtom,
  UiSettings,
  uiSettingsAtom
} from "@/components/data/atoms";
import {useMemo} from "react";

// TODO: let's mimic swr's data response structure for the future?
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type DataResponse<Data> = {
  data: Data | undefined;
  error: ApiError | undefined;
  isLoading: boolean;
}

const useLiftingHistory = () => {
  return useAtomValue<LiftHistory[]>(liftsProgressAtom)
}

export const useProgressiveOverloadCounts = () => {
  return useAtomValue(liftHistoryStatsAtom)
}

type LiftHistoryProps = {
  activityStatus: LiftActivityStatus
}

export const useProgressByActivity = (
  props: LiftHistoryProps,
) => {
  const liftingHistory = useLiftingHistory();
  return useMemo(() => {
    return liftingHistory.filter(
      lift => lift.activityStatus === props.activityStatus
    )
  }, [props.activityStatus, liftingHistory])
}

export const useUiSettings = () => {
  return useAtomValue(uiSettingsAtom);
}

export const useUpdateUiSettings = () => {
  const setUiSettings = useSetAtom(uiSettingsAtom);
  return (newSettings: Partial<UiSettings>) => {
    setUiSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings
    }));
  };
}