import {WeeklyVolumeResults} from "@/engine/volume/volume-calculation";
import {blue, green, purple} from "@ant-design/colors";

export type MuscleCardProps = {
  muscle: string;
  volume: WeeklyVolumeResults
}
export type MuscleGroupLifts = {
  primary: string[];
  secondary: string[];
}
export const DirectColor = blue.primary;
export const FractionalColor = purple.primary;
export const IndirectColor = green.primary;
export const DirectFrequencyColor = DirectColor;
export const CombinedFrequencyColor = FractionalColor;