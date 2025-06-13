import React from 'react';
import {Radio, RadioChangeEvent, Space, Typography} from 'antd';
import {useAtom} from 'jotai';
import {uiSettingsAtom, UnitSystem} from '@/components/data/atoms';

const {Text} = Typography;

export const DataParsingSettings: React.FC = () => {
  const [settings, setSettings] = useAtom(uiSettingsAtom);

  const handleUnitChange = (e: RadioChangeEvent) => {
    setSettings((prev) => ({...prev, units: e.target.value as UnitSystem}));
  };

  return (
    <>
      <Text strong>Data Display Settings:</Text>
      <div style={{marginTop: 8}}>
        <Space direction="vertical">
          <Space>
            <Text>Unit System:</Text>
            <Radio.Group onChange={handleUnitChange} value={settings.units}>
              <Radio value={UnitSystem.Metric}>Metric (kg)</Radio>
              <Radio value={UnitSystem.Imperial}>Imperial (lbs)</Radio>
            </Radio.Group>
          </Space>
          {/* Add other parsing settings here in the future */}
        </Space>
      </div>
    </>
  );
};
