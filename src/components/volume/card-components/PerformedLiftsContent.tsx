import {
  MuscleCardTabContentProps
} from "@/components/volume/card-components/AverageVolumeContent";
import {DirectColor, FractionalColor} from "@/components/volume/constants";
import React from "react";
import {Typography} from "antd";

const {Text, Paragraph} = Typography;


export function PerformedLiftsContent({
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