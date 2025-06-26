import React from "react";
import {
  CombinedFrequencyColor,
  DirectColor,
  DirectFrequencyColor,
  FractionalColor,
  MuscleCardProps,
  MuscleGroupLifts
} from "@/components/volume/constants";
import {Col, Popover, Row, Statistic, Typography} from "antd";
import {InfoCircleOutlined} from "@ant-design/icons";

const {Text, Paragraph} = Typography;


export type MuscleCardTabContentProps = MuscleCardProps & {
  lifts: MuscleGroupLifts
}

function MoversList({lifts}: { lifts: string[] }) {
  if (!lifts || lifts.length === 0) {
    return <Text type="secondary">No lifts found</Text>;
  }

  return (
    <ul style={{paddingLeft: 20, margin: '5px 0'}}>
      {lifts.map(ex => <li key={ex}>{ex}</li>)}
    </ul>
  );
}

const MemoizedMoversList = React.memo(MoversList);

function InfoSign({iconColor, content, lifts}: {
  iconColor?: string;
  content: React.ReactNode,
  lifts: string[]
}) {
  return (
    <Popover
      content={
        <div style={{maxWidth: 400}}>
          {content}
          <Text strong>Related performed lifts:</Text>
          <MemoizedMoversList lifts={lifts}/>
        </div>
      }
    >
      <InfoCircleOutlined style={{
        color: iconColor,
        cursor: 'pointer',
        marginLeft: 5
      }}/>
    </Popover>
  )
}

const directVolumeInfo = (
  <Paragraph>Only the lifts where this muscle group was a primary mover are
    counted towards direct volume.</Paragraph>
)
const directFrequencyInfo = (
  <Paragraph>
    Direct frequency is calculated as the number of days per week this muscle
    group was trained as a primary mover.
  </Paragraph>
)
const combinedFrequencyInfo = (
  <Paragraph>
    Combined frequency is calculated as the number of days per week this muscle
    group was trained, either as a primary or secondary mover.
  </Paragraph>
)
const MemoizedInfoSign = React.memo(InfoSign);

export function AverageVolumeContent({
                                       muscle,
                                       volume,
                                       lifts
                                     }: MuscleCardTabContentProps) {
  const {
    primary,
    secondary,
    fractional,
    combinedFrequency,
    directFrequency
  } = volume.weeklyAverageByMuscleGroup[muscle];


  const fractionalVolumeInfo = (<>
    <Paragraph>
      Fractional volume is calculated as:<br/>
      <Text strong>{primary} Direct + {secondary} Indirect / 2
        = {fractional}</Text>
    </Paragraph>
    <Paragraph>When a muscle group is a secondary mover in a lift, it is
      counted towards indirect volume.</Paragraph>
  </>)

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Statistic
            title="Direct volume"
            value={primary}
            valueStyle={{color: DirectColor}}
            suffix={
              <MemoizedInfoSign content={directVolumeInfo} lifts={lifts.primary}
                                iconColor={DirectColor}/>

            }
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Fractional volume"
            value={fractional}
            valueStyle={{color: FractionalColor}}
            suffix={
              <MemoizedInfoSign content={fractionalVolumeInfo}
                                lifts={lifts.secondary}
                                iconColor={FractionalColor}/>
            }
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Statistic
            title="Direct Frequency"
            value={directFrequency}
            valueStyle={{color: DirectFrequencyColor}}
            suffix={
              <MemoizedInfoSign content={directFrequencyInfo}
                                lifts={lifts.primary}
                                iconColor={DirectFrequencyColor}/>
            }
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Combined"
            value={combinedFrequency}
            valueStyle={{color: CombinedFrequencyColor}}
            suffix={
              <MemoizedInfoSign content={combinedFrequencyInfo}
                                lifts={lifts.secondary}
                                iconColor={FractionalColor}/>
            }
          />
        </Col>
      </Row>
    </>
  )
}