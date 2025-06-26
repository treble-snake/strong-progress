import {
  MuscleCardTabContentProps
} from "@/components/volume/card-components/AverageVolumeContent";
import {Empty, Flex, List, Typography} from "antd";
import {
  DirectColor,
  FractionalColor,
  IndirectColor
} from "@/components/volume/constants";
import React from "react";

const {Text} = Typography;

export function WeeklyVolumeChangeContent({
                                            muscle,
                                            volume,
                                          }: MuscleCardTabContentProps) {
  // Get weekly volume data for this muscle group
  const weeklyVolume = Object.entries(volume.weeks).reverse().map(([weekLabel, weekData]) => ({
    weekLabel,
    volume: weekData.muscleGroups[muscle] || {
      primary: 0,
      secondary: 0,
      fractional: 0
    }
  }));

  if (weeklyVolume.length === 0) {
    return <Empty description="No weekly data found"/>;
  }

  return (
    <>
      <Text>Volume Change Week-by-Week</Text>
      <List size={'small'}
            dataSource={[weeklyVolume[0], ...weeklyVolume]}
            renderItem={({weekLabel, volume}, i) => {
              if (i === 0) {
                return (
                  <List.Item>
                    <Text type="secondary">Direct</Text>
                    <Text type="secondary">Indirect </Text>
                    <Text type="secondary">Fractional</Text>
                  </List.Item>
                )
              }
              return <List.Item>
                <div style={{width: '100%'}}>
                  <Text strong>{weekLabel.replace('Week ', '')}</Text>
                  <Flex justify={'space-between'}>
                    <Text style={{color: DirectColor}}>
                      {volume.primary}
                    </Text>
                    <Text style={{color: IndirectColor}}>
                      {volume.secondary}
                    </Text>
                    <Text style={{color: FractionalColor}}>
                      {volume.fractional}
                    </Text>
                  </Flex>
                </div>
              </List.Item>
            }}
      />
    </>);
}