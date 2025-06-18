import {WeeklyVolumeResults} from "@/engine/volume/volume-calculation";
import {Card, Empty, Flex, List, Popover, Statistic, Typography} from "antd";
import Link from "next/link";
import {InfoCircleOutlined, RightOutlined} from "@ant-design/icons";
import React from "react";
import {AffectedMuscleGroups} from "@/engine/volume/muscle-groups";
import {blue, green, purple} from "@ant-design/colors";

const DirectColor = blue.primary;
const FractionalColor = purple.primary;
const IndirectColor = green.primary;

type MuscleCardProps = {
  muscle: string;
  volume: WeeklyVolumeResults
}

type MuscleCardTabContentProps = MuscleCardProps & {
  lifts: MuscleGroupLifts
}

const {Text, Paragraph} = Typography;

type MuscleGroupLifts = {
  primary: string[];
  secondary: string[];
}
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

export function AverageVolumeContent({
                                       muscle,
                                       volume,
                                       lifts
                                     }: MuscleCardTabContentProps) {
  const v = volume.weeklyAverageByMuscleGroup[muscle];
  const {primary, secondary, fractional} = v;
  const primaryMoversContent = (
    <div>
      <div><strong>Primary movers:</strong></div>
      <ul style={{paddingLeft: 20, margin: '5px 0'}}>
        {lifts.primary.map(ex => <li key={ex}>{ex}</li>)}
      </ul>
    </div>
  );

  const fractionalPopoverContent = (
    <div>
      <p>Fractional volume is calculated as:</p>
      <p>
        <strong>{primary} Direct</strong> + <strong>{secondary} Indirect</strong>/2
        = <strong>{fractional}</strong></p>
      {lifts.secondary.length > 0 && (
        <>
          <div style={{marginTop: 10}}><strong>Secondary
            movers:</strong></div>
          <ul style={{paddingLeft: 20, margin: '5px 0'}}>
            {lifts.secondary.map(ex => <li
              key={ex}>{ex}</li>)}
          </ul>
        </>
      )}
    </div>
  );

  return (
    <Flex justify={'space-between'}>
      <Statistic
        title="Direct volume"
        value={primary}
        valueStyle={{color: DirectColor}}
        suffix={
          <Popover
            content={primaryMoversContent}
            title="Primary Mover Exercises"
          >
            <InfoCircleOutlined style={{
              color: DirectColor,
              cursor: 'pointer',
              marginLeft: 5
            }}/>
          </Popover>
        }
      />
      <Statistic
        title="Fractional volume"
        value={fractional}
        valueStyle={{color: FractionalColor}}
        suffix={
          <Popover
            content={fractionalPopoverContent}
            title="Fractional Volume"
          >
            <InfoCircleOutlined style={{
              color: FractionalColor,
              cursor: 'pointer',
              marginLeft: 5
            }}/>
          </Popover>
        }
      />
    </Flex>
  );
}

function PerformedLiftsContent({
                                 lifts
                               }: MuscleCardTabContentProps) {
  const {primary, secondary} = lifts;

  return (
    <>
      <div style={{marginBottom: 8}}>
        <Text>These muscles were used as...</Text>
      </div>
      <div>
        <Text style={{color: DirectColor}} strong>Primary movers:</Text>
        <Paragraph>
          {primary.length > 0 ? (
            <ul>
              {primary.map(ex => <li key={ex}>{ex}</li>)}
            </ul>
          ) : (
            <Text type="secondary">No primary movers found</Text>
          )}
        </Paragraph>
      </div>
      <div>
        <Text style={{color: FractionalColor}} strong>Secondary movers:</Text>
        <Paragraph>
          {secondary.length > 0 ? (
            <ul>
              {secondary.map(ex => <li key={ex}>{ex}</li>)}
            </ul>
          ) : (
            <Text type="secondary">No secondary movers found</Text>
          )}
        </Paragraph>
      </div>
    </>
  );
}

function WeeklyVolumeChangeContent({
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

const TAB_LIST = [
  {
    key: 'avgVolume',
    tab: 'Avg. Volume',
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
      extra={
        <Link href={`/weekly-volume/${encodeURIComponent(muscle)}`}>
          Details <RightOutlined/>
        </Link>}
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