import React from 'react';
import {Radio, RadioChangeEvent, Space, Typography} from 'antd';
import {useAtom} from 'jotai';
import {FileType, uiSettingsAtom, UnitSystem} from '@/components/data/atoms';

const {Text} = Typography;

export const DataParsingSettings: React.FC = () => {
  const [settings, setSettings] = useAtom(uiSettingsAtom);

  const handleUnitChange = (e: RadioChangeEvent) => {
    setSettings((prev) => ({...prev, units: e.target.value as UnitSystem}));
  };

  const handleFileTypeChange = (e: RadioChangeEvent) => {
    setSettings((prev) => ({...prev, fileType: e.target.value as FileType}));
  };

  return (
    <>
      <div style={{marginTop: 8}}>
        <Space direction="vertical">
          <Space>
            <Text>Your App:</Text>
            <Radio.Group onChange={handleFileTypeChange}
                         value={settings.fileType}>
              <Radio value="auto">Auto-detect</Radio>
              <Radio value="strong">Strong</Radio>
              <Radio value="hevy">Hevy</Radio>
            </Radio.Group>
          </Space>
        </Space>
      </div>

      {settings.fileType !== 'hevy' && (
        <div style={{marginTop: 16}}>
          <Text strong>Data Display Settings:</Text>
          <div style={{marginTop: 8}}>
            <Space direction="vertical">
              <Space>
                <Text>Unit System (for Strong only):</Text>
                <Radio.Group onChange={handleUnitChange} value={settings.units}>
                  <Radio value={UnitSystem.Metric}>Metric (kg, km)</Radio>
                  <Radio value={UnitSystem.Imperial}>Imperial (lbs, miles)</Radio>
                </Radio.Group>
              </Space>
            </Space>
          </div>
        </div>
      )
      }
    </>
  );
};
