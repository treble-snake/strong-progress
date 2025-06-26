import {Card, Typography} from "antd";
import React from "react";
import {AffectedMuscleGroups} from "@/engine/volume/muscle-groups";
import {MuscleCardProps, MuscleGroupLifts} from "@/components/volume/constants";
import {
  AverageVolumeContent
} from "@/components/volume/card-components/AverageVolumeContent";
import {
  WeeklyVolumeChangeContent
} from "@/components/volume/card-components/WeeklyVolumeChangeContent";
import {
  PerformedLiftsContent
} from "@/components/volume/card-components/PerformedLiftsContent";


//  TODO:avg Number of Sets per lift

const {Text} = Typography;

// TODO: move to utils in a separate file
const getLiftsForMuscleGroup = (
  muscleGroup: string,
  liftMuscleGroups: Record<string, AffectedMuscleGroups>
): MuscleGroupLifts => {
  const result = {primary: [] as string[], secondary: [] as string[]};

  Object.entries(liftMuscleGroups).forEach(([liftName, stats]) => {
    if (stats.primary.includes(muscleGroup)) {
      result.primary.push(liftName);
    } else if (stats.secondary.includes(muscleGroup)) {
      result.secondary.push(liftName);
    }
  });

  return result;
};

const TAB_LIST = [
  {
    key: 'avgVolume',
    tab: 'Avg',
  },
  {
    key: 'weekly',
    tab: 'Weekly',
  },
  {
    key: 'lifts',
    tab: 'Lifts',
  }
];

export function MuscleVolumeCard({muscle, volume}: MuscleCardProps) {
  const [activeTab, setActiveTab] = React.useState<string>('avgVolume');

  const lifts = getLiftsForMuscleGroup(muscle, volume.liftMuscleGroups);

  const contentList: Record<string, React.ReactNode> = {
    avgVolume: <AverageVolumeContent muscle={muscle} volume={volume}
                                     lifts={lifts}/>,
    weekly: <WeeklyVolumeChangeContent muscle={muscle} volume={volume}
                                       lifts={lifts}/>,
    lifts: <PerformedLiftsContent muscle={muscle} lifts={lifts}
                                  volume={volume}/>,
  };

  return (
    <Card
      styles={{
        header: {padding: '8px 8px 0 8px'},
      }}
      key={muscle}
      title={<Text strong>{muscle}</Text>}
      style={{width: 300}}
      size="small"
      // TODO: uncomment once the page has some meaningful content
      // extra={
      // <Link href={`/weekly-volume/${encodeURIComponent(muscle)}`}>
      //   Details <RightOutlined/>
      // </Link>}
      tabList={TAB_LIST}
      activeTabKey={activeTab}
      onTabChange={(key) => {
        setActiveTab(key);
      }}
    >
      {contentList[activeTab] || <p>No content available</p>}
    </Card>
  );
}
