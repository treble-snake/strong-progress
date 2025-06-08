import csv from "csvtojson";

export const parseStrongCsv = async (filePath: string) => {
  return csv({})
    .fromFile(filePath)
}