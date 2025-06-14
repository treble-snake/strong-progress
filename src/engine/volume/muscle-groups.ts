import {StandardMuscleGroups} from "@/components/data/constants";

const UnknownMuscleGroup = 'Unknown';

export type AffectedMuscleGroups = {
  primary: string[]
  secondary: string[]
}

const LIFT_MUSCLE_GROUPS = [
  {
    regexp: /pec\s?deck?/,
    primary: [StandardMuscleGroups.chest],
    secondary: []
  }
]

const MUSCLE_GROUP_KEYWORDS = [
  {
    keywords: ['chest', 'press', 'bench'],
    primary: [StandardMuscleGroups.chest],
    secondary: [StandardMuscleGroups.frontDelts, StandardMuscleGroups.triceps]
  },
  {
    keywords: [/pull\s?down/],
    primary: [StandardMuscleGroups.lats],
    secondary: [StandardMuscleGroups.upperBack, StandardMuscleGroups.biceps, StandardMuscleGroups.rearDelts]
  }
]

export const getAffectedMuscleGroups = (liftName: string): AffectedMuscleGroups => {
  // first check if the lift matches any specific muscle group by regexp
  for (const liftGroup of LIFT_MUSCLE_GROUPS) {
    if (liftGroup.regexp.test(liftName)) {
      return {
        primary: liftGroup.primary,
        secondary: liftGroup.secondary
      };
    }
  }

  // then go through all keywords and return the one with most matches
  let currentBest: AffectedMuscleGroups = {
    primary: [UnknownMuscleGroup],
    secondary: []
  }
  let maxMatches = 0;
  for (const group of MUSCLE_GROUP_KEYWORDS) {
    let currentMatches = 0;
    // check all the keywords in the item
    for (const keyword of group.keywords) {
      const matches = typeof keyword === 'string' ?
        liftName.toLowerCase().includes(keyword.toLowerCase()) :
        keyword.test(liftName);
      if (matches) {
        currentMatches++
      }
    }

    if (currentMatches > maxMatches) {
      maxMatches = currentMatches;
      currentBest = {
        primary: group.primary,
        secondary: group.secondary
      };
    }
  }

  return currentBest
}