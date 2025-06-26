import {
  MuscleCardTabContentProps
} from "@/components/volume/card-components/AverageVolumeContent";
import {DirectColor, FractionalColor} from "@/components/volume/constants";
import React from "react";
import {Flex, Popover, Tag, Typography} from "antd";
import {InfoCircleOutlined} from "@ant-design/icons";
import {AffectedMuscleGroups} from "@/engine/volume/muscle-groups";

const {Text, Paragraph} = Typography;


// TODO: reduce code duplication with the lifts list on the volume page
function LiftInfoPopover({liftName, liftInfo}: {
  liftName: string,
  liftInfo: AffectedMuscleGroups
}) {
  const {
    primary,
    secondary,
    matchedKeywords,
    sourceRule,
    resultScore,
    comments,
    certainty
  } = liftInfo;

  // Determine certainty level tag
  let tagColor = 'green';
  let tagText = 'Likely';

  if (certainty < 0.5) {
    tagColor = 'red';
    tagText = 'Unsure';
  } else if (certainty < 0.8) {
    tagColor = 'orange';
    tagText = 'Probably';
  }

  return (
    <Popover
      content={
        <div style={{maxWidth: 500}}>
          <div><strong>Primary muscles:</strong> {primary.join(', ')}</div>
          {secondary.length > 0 && (
            <div><strong>Secondary muscles:</strong> {secondary.join(', ')}
            </div>
          )}
          <div><strong>Matched keywords:</strong> {matchedKeywords.join(', ')}
          </div>
          <div><strong>Source rule:</strong> {sourceRule} (score: {resultScore})
          </div>
          {comments.length > 0 && (
            <div><strong>Comments:</strong> {comments.join(' | ')}</div>
          )}
        </div>
      }
      title={
        <Flex justify={'space-between'} align={'center'} gap={8}>
          <Text strong>{liftName}</Text>
          <Tag color={tagColor}>{tagText} ({certainty.toFixed(2)})</Tag>
        </Flex>
      }
    >
      <InfoCircleOutlined style={{marginLeft: 5, cursor: 'pointer'}}/>
    </Popover>
  );
}

export function PerformedLiftsContent({
                                        lifts,
                                        volume,
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
              {primary.map(ex => (
                <li key={ex}>
                  {ex}
                  {volume.liftMuscleGroups[ex] && (
                    <LiftInfoPopover liftName={ex}
                                     liftInfo={volume.liftMuscleGroups[ex]}/>
                  )}
                </li>
              ))}
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
              {secondary.map(ex => (
                <li key={ex}>
                  {ex}
                  {volume.liftMuscleGroups[ex] && (
                    <LiftInfoPopover liftName={ex}
                                     liftInfo={volume.liftMuscleGroups[ex]}/>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <Text type="secondary">No secondary movers found</Text>
          )}
        </Paragraph>
      </div>
    </>
  );
}
