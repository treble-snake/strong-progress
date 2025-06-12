import React from 'react';
import {Tag} from 'antd';
import {
  AlertOutlined,
  FallOutlined,
  QuestionCircleOutlined,
  RiseOutlined,
  SearchOutlined,
  WarningOutlined
} from '@ant-design/icons';
import {green, grey, orange, red, volcano} from '@ant-design/colors';
import {LiftProgressStatus} from '@/types';

interface ProgressStatusIconProps {
  status?: LiftProgressStatus;
}

export const ProgressStatusIcon: React.FC<ProgressStatusIconProps> = ({ status }) => {
  switch (status) {
    case LiftProgressStatus.Progressing:
      return <RiseOutlined style={{ color: green[6] }} />;
    case LiftProgressStatus.Struggling:
      return <SearchOutlined style={{ color: orange.primary }} />;
    case LiftProgressStatus.AtRisk:
      return <WarningOutlined style={{ color: orange.primary }} />;
    case LiftProgressStatus.Plateaued:
      return <AlertOutlined style={{ color: volcano.primary }} />;
    case LiftProgressStatus.Regressing:
      return <FallOutlined style={{ color: red.primary }} />;
    case LiftProgressStatus.NotSure:
      return <QuestionCircleOutlined style={{ color: grey.primary }} />;
    default:
      return <Tag>{status}</Tag>; // Fallback for unknown status
  }
};
