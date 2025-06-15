import {MUSCLE_GROUP_KEYWORD_RULES} from "@/engine/volume/lift-definitions";

const UnknownMuscleGroup = 'Unknown';

export type AffectedMuscleGroups = {
  primary: string[]
  secondary: string[]
  matchedKeywords: string[]
  sourceRule: string
}

export const getAffectedMuscleGroups = (liftName: string): AffectedMuscleGroups => {
  // TODO: look at https://www.fusejs.io/

  // then go through all keywords and return the one with most matches
  let currentBest: AffectedMuscleGroups = {
    primary: [UnknownMuscleGroup],
    secondary: [],
    matchedKeywords: [],
    sourceRule: 'None'
  }
  let maxMatches = 0;
  // normalize the lift name
  liftName = liftName.toLowerCase().trim();

  for (const rule of MUSCLE_GROUP_KEYWORD_RULES) {
    let groupMatches = 0;
    const groupMatchedKeywords: string[] = [];

    // check all the keywords in the item
    for (const keyword of rule.keywords) {
      const matches = typeof keyword === 'string' ?
        liftName.includes(keyword.toLowerCase()) :
        keyword.test(liftName);
      if (matches) {
        groupMatches++
        groupMatchedKeywords.push(keyword.toString());
      }
    }

    if (groupMatches > maxMatches) {
      maxMatches = groupMatches;
      currentBest = {
        primary: rule.primary,
        secondary: rule.secondary,
        matchedKeywords: groupMatchedKeywords,
        sourceRule: rule.label
      };
    }
  }

  return currentBest
}