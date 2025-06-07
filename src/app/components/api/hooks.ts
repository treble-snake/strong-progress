import useSWR from "swr";
import {ApiError, simpleFetcher} from "@/app/components/api/fetcher";
import {LiftActivityStatus, LiftHistory} from "@/types";
import {isBefore, subMonths} from "date-fns";

type DataResponse<Data> = {
  data: Data | undefined;
  error: ApiError | undefined;
  isLoading: boolean;
}

const mapDataWhenAvailable = <I, O>(
  input: DataResponse<I>,
  mapper: (data: I) => O | undefined
): DataResponse<O> => {
  return {...input, data: input.data ? mapper(input.data) : undefined}
}


const useLiftingHistory = () => {
  return useSWR<LiftHistory[], ApiError>(`/parsed-workout-data.json`, simpleFetcher)
}

const useProgressiveOverloadHistory = (
  monthsToConsider: number = 6
) => {
  return mapDataWhenAvailable(
    useLiftingHistory(),
    (data) => {
      const cutoffDate = subMonths(new Date(), monthsToConsider);
      return data.filter(flit =>
        // sessions are in ascending order, so if there's one session before the cutoff, we can disregard the lift
        flit.workouts.findLastIndex(({date}) => isBefore(date, cutoffDate)) === -1
      )
    }
  )
}

export const useProgressiveOverloadCounts = () => {
  return mapDataWhenAvailable(
    useProgressiveOverloadHistory(),
    (data) => {
      const activeCount = data.filter(lift => lift.activityStatus === 'Active').length;
      const historyCount = data.filter(lift => lift.activityStatus === 'History').length;
      const newCount = data.filter(lift => lift.activityStatus === 'New').length;
      return {activeCount, historyCount, newCount}
    }
  )
}

type LiftHistoryProps = {
  activityStatus: LiftActivityStatus
}

export const useProgressByActivity = (
  props: LiftHistoryProps,
) => {
  return mapDataWhenAvailable(
    useProgressiveOverloadHistory(),
    (data) => {
      return data.filter(lift => lift.activityStatus === props.activityStatus);
    }
  )
}