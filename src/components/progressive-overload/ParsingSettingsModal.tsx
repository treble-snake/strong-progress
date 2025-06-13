import React from 'react';
import { Modal } from 'antd';
import { DataParsingSettings } from '@/components/source-file/DataParsingSettings';

interface ParsingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ParsingSettingsModal: React.FC<ParsingSettingsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      title="Settings"
      open={isOpen}
      onOk={onClose} // Or handle save if needed, for now just closes
      onCancel={onClose}
      footer={null} // Hides default Ok/Cancel buttons, DataParsingSettings saves on change
    >
      <DataParsingSettings />
    </Modal>
  );
};
