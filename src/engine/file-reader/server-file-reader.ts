import csv from "csvtojson";

export const parseCsv = async (filePath: string) => {
  return csv({})
    .fromFile(filePath)
}