import {MUSCLE_GROUP_KEYWORD_RULES} from "@/engine/volume/lift-definitions";

const UnknownMuscleGroup = 'Unknown';

export type AffectedMuscleGroups = {
  primary: string[]
  secondary: string[]
  matchedKeywords: string[]
  sourceRule: string
  resultScore: number
  comments: string[]
  certainty: number // 0-1, where 1 is 100% certain
}

const MIN_SCORE = 2

export type AffectedMuscleOverrides = {
  byLift?: Record<string, Pick<AffectedMuscleGroups, 'primary' | 'secondary' | 'comments'>>,
}

export const getAffectedMuscleGroups = (liftName: string): AffectedMuscleGroups => {
  // TODO: look at https://www.fusejs.io/

  // then go through all keywords and return the one with most matches
  let currentBest: AffectedMuscleGroups = {
    primary: [UnknownMuscleGroup],
    secondary: [],
    matchedKeywords: [],
    sourceRule: 'None',
    resultScore: 0,
    certainty: 0,
    comments: [],
  }
  let maxScore = 0;
  // normalize the lift name
  liftName = liftName.toLowerCase().trim();

  for (const rule of MUSCLE_GROUP_KEYWORD_RULES) {
    let groupScore = 0;
    const groupMatchedKeywords: string[] = [];

    // check all the keywords in the item
    for (const {keyword, weight} of rule.keywords) {
      const matches = typeof keyword === 'string' ?
        liftName.includes(keyword.toLowerCase()) :
        keyword.test(liftName);
      if (matches) {
        groupScore += weight;
        groupMatchedKeywords.push(keyword.toString());
      }
    }

    if (groupScore > 0 && groupScore === maxScore) {
      currentBest.certainty = Math.min(currentBest.certainty - 0.1, 0.8)
      currentBest.comments.push(` Also matched rule "${rule.label}" with score ${groupScore}.`)
    }

    if (groupScore > maxScore) {
      maxScore = groupScore;
      const enoughScore = groupScore >= MIN_SCORE;
      currentBest = {
        primary: enoughScore ? rule.primary : [UnknownMuscleGroup],
        secondary: enoughScore ? rule.secondary : [],
        matchedKeywords: groupMatchedKeywords,
        sourceRule: rule.label,
        resultScore: groupScore,
        certainty: enoughScore ? (
          groupScore === MIN_SCORE ? 0.8 :
            (
              groupScore > 3 ? 1 : 0.9
            )
        ) : 0,
        comments: enoughScore ? [] : [`Not enough score (${groupScore} < ${MIN_SCORE}) to apply any rule (best match was "${rule.label}")`],
      };
    }
  }

  return currentBest
}