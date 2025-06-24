import csv from "csvtojson";

export const parseCsv = async (data: string) => {
  return csv({})
    .fromString(data)
}