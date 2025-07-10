import {Checkbox, CheckboxChangeEvent, Divider, Space, Tooltip} from 'antd';
import {LiftProgressStatus} from '@/types';
import React from 'react';
import {
  ProgressStatusIcon
} from '@/components/progressive-overload/ProgressStatusIcon';

type ProgressStatusFilterProps = {
  selectedProgress: LiftProgressStatus[];
  setSelectedProgress: (statuses: LiftProgressStatus[]) => void;
}

const CheckBoxGroup = Checkbox.Group;

const PROGRESS_STATUS_TOOLTIPS: Record<LiftProgressStatus, string> = {
  [LiftProgressStatus.Progressing]: 'Consistently making progress, increasing weight/reps.',
  [LiftProgressStatus.Struggling]: 'Progress has slowed or inconsistent, so might need to pay attention.',
  [LiftProgressStatus.AtRisk]: 'High risk of hitting a plateau or regressing if no changes are made.',
  [LiftProgressStatus.Plateaued]: 'No significant progress in weight/reps over several sessions.',
  [LiftProgressStatus.Regressing]: 'Performance is declining, unable to match previous bests.',
  [LiftProgressStatus.NotSure]: 'Not enough data or unclear trend to determine progress status.',
};

const FILTER_ORDER = {
  [LiftProgressStatus.Regressing]: 1,
  [LiftProgressStatus.Plateaued]: 2,
  [LiftProgressStatus.AtRisk]: 3,
  [LiftProgressStatus.Struggling]: 4,
  [LiftProgressStatus.Progressing]: 5,
  [LiftProgressStatus.NotSure]: 6,
}

export function ProgressStatusFilter({
                                       selectedProgress,
                                       setSelectedProgress
                                     }: ProgressStatusFilterProps) {

  const allProgressStatuses = Object.values(LiftProgressStatus);
  const allChecked = allProgressStatuses.length === selectedProgress.length;
  const someChecked = selectedProgress.length > 0 && !allChecked;

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setSelectedProgress(e.target.checked ? allProgressStatuses : []);
  };

  // Handle individual checkbox changes
  const onChange = (checkedValues: LiftProgressStatus[]) => {
    setSelectedProgress(checkedValues);
  };

  return (
    <div style={{
      marginLeft: 16,
      marginBottom: 16,
      display: 'flex',
      alignItems: 'center'
    }}>
      <span style={{marginRight: 8, fontWeight: 500}}>By Progress:</span>
      <Checkbox indeterminate={someChecked} onChange={onCheckAllChange}
                checked={allChecked}>
        All
      </Checkbox>
      <Divider type="vertical"/>
      <CheckBoxGroup
        value={selectedProgress}
        onChange={onChange}
      >
        <Space wrap>
          {(Object.values(LiftProgressStatus) as LiftProgressStatus[])
            .sort((a, b) => (a in FILTER_ORDER ? FILTER_ORDER[a] : 100) - (b in FILTER_ORDER ? FILTER_ORDER[b] : 100))
            .map((status) => (
              <Tooltip key={status} title={PROGRESS_STATUS_TOOLTIPS[status]}
                       placement='top'>
                <Checkbox value={status}>
                  <ProgressStatusIcon status={status}/>
                  <span style={{marginLeft: 4}}>{status}</span>
                </Checkbox>
              </Tooltip>
            ))}
        </Space>
      </CheckBoxGroup>
    </div>
  );
}
