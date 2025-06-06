import useSWR from "swr";
import {simpleFetcher} from "@/app/components/api/fetcher";
import {LiftActivityStatus, LiftHistory} from "@/types";

const useLiftingHistory = () => {
  return useSWR<LiftHistory[]>(`/parsed-workout-data.json`, simpleFetcher)
}

type ProgressiveOverloadCounts = {
  activeCount: number;
  historyCount: number;
  newCount: number;
}

export const useProgressiveOverloadCounts = () => {
  const {data, isLoading, error} = useLiftingHistory();
  let newData: ProgressiveOverloadCounts | null = null
  if (data) {
    const activeCount = data.filter(lift => lift.activityStatus === 'Active').length;
    const historyCount = data.filter(lift => lift.activityStatus === 'History').length;
    const newCount = data.filter(lift => lift.activityStatus === 'New').length;

    newData = {
      activeCount,
      historyCount,
      newCount
    }
  }

  return {data: newData, isLoading, error}
}

type LiftHistoryProps = {
  activityStatus?: LiftActivityStatus
}

export const useProgressiveOverloadHistory = (
  props: LiftHistoryProps = {},
) => {
  // const params = new URLSearchParams(search)
  // const branchPreview = params.get('previewBranch')
  // const resetCache = params.has('resetCache')
  //
  // const queryParams = new URLSearchParams()
  // if (branchPreview) {
  //     queryParams.set('previewBranch', branchPreview)
  // }
  // if (resetCache) {
  //     queryParams.set('resetCache', 'true')
  // }
  const {data, isLoading, error} = useLiftingHistory();
  let newData = data;
  if (data) {
    if (props.activityStatus) {
      newData = data.filter(lift => lift.activityStatus === props.activityStatus);
    }
  }

  return {data: newData, isLoading, error}
}