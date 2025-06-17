import dayjs, {Dayjs} from "dayjs";
import {Button, DatePicker, InputNumber, Radio, Space, Typography} from "antd";
import React from "react";
import {
  VolumeDateDirection,
  volumeDateSettingsAtom
} from "@/components/data/atoms";
import {useAtom} from "jotai";

const {Text} = Typography;

export function PeriodPicker() {
  const [volumeDateSettings, setVolumeDateSettings] = useAtom(volumeDateSettingsAtom);
  const [selectedDate, setSelectedDate] = React.useState<Dayjs>(dayjs(volumeDateSettings.selectedDate));
  const [selectedDuration, setSelectedDuration] = React.useState<number>(volumeDateSettings.selectedDuration);
  const [selectedDirection, setSelectedDirection] = React.useState<VolumeDateDirection>(volumeDateSettings.selectedDirection);
  const [isDirty, setIsDirty] = React.useState<boolean>(false);

  return (
    <>
      <Space>
        <Text>Analyze</Text>
        <InputNumber value={selectedDuration} min={1} step={1}
                     size="small" style={{width: 50}}
                     onChange={(value) => {
                       if (value !== selectedDuration && value !== null) {
                         setIsDirty(true);
                         setSelectedDuration(value);
                       }
                     }}
        />
        <Text>weeks</Text>
        <Radio.Group size="small"
                     value={selectedDirection} onChange={(e) => {
          let value = e.target.value;
          if (value !== VolumeDateDirection.After && value !== VolumeDateDirection.Before) {
            value = VolumeDateDirection.Before;
          }
          if (value !== selectedDirection) {
            setIsDirty(true);
            setSelectedDirection(value);
          }
        }}
        >
          <Radio.Button value="before">before</Radio.Button>
          <Radio.Button value="after">after</Radio.Button>
        </Radio.Group>
        <DatePicker
          allowClear={false}
          value={selectedDate}
          maxDate={dayjs()}
          onChange={(date) => {
            if (date && date.isValid() && !date.isSame(selectedDate)) {
              setIsDirty(true);
              setSelectedDate(date);
            }
          }}
        />
        <Button type={'primary'} disabled={!isDirty} onClick={() => {
          setVolumeDateSettings({
            selectedDuration,
            selectedDirection,
            selectedDate: selectedDate.toISOString()
          })
          setIsDirty(false);
        }}
        >
          OK
        </Button>
      </Space>
    </>
  )
}