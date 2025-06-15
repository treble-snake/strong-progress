import {getWeeks} from "@/engine/volume/week-intervals";
import dayjs from "dayjs";

import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(localizedFormat)

console.log(
  getWeeks('2025-05-28', '2025-06-08')
)