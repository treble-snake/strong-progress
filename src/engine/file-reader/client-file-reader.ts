import csv from "csvtojson";

export const parseStrongCsv = async (data: string) => {
  return csv({})
    .fromString(data)
}