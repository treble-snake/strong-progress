import {getAffectedMuscleGroups} from '../muscle-groups';
import {KeywordRuleLabels} from '@/engine/volume/lift-definitions';

describe('getAffectedMuscleGroups', () => {
  type TestCase = {
    liftName: string;
    expectedRuleName: KeywordRuleLabels | 'None';
  };

  const testCases: TestCase[] = [
    {
      liftName: 'Neck Harness Extension',
      expectedRuleName: KeywordRuleLabels.NeckIsolation,
    },
    {
      liftName: 'Barbell Bench Press',
      expectedRuleName: KeywordRuleLabels.ChestCompounds,
    },
    {
      liftName: 'Cable Face-pull',
      expectedRuleName: KeywordRuleLabels.UpperBack,
    },
    {
      liftName: 'Dumbbell Shrugs',
      expectedRuleName: KeywordRuleLabels.ShrugsAndTraps,
    },
    {
      liftName: 'Leg Press',
      expectedRuleName: KeywordRuleLabels.QuadCompounds,
    },
    {
      liftName: 'NonExistentExercise123',
      expectedRuleName: 'None',
    },
    {
      liftName: 'Hip Adductor (Machine)',
      expectedRuleName: 'None',
    },
    {
      liftName: 'Flexion Row (Cable)',
      expectedRuleName: 'None',
    },
    {
      liftName: 'JM Press In Smith',
      expectedRuleName: KeywordRuleLabels.Triceps,
    },
    {
      liftName: 'Standing Calf Raise (Machine)',
      expectedRuleName: KeywordRuleLabels.CalvesIsolation,
    },
    {
      liftName: 'Pullover (Dumbbell)',
      expectedRuleName: KeywordRuleLabels.Lats,
    },
    {
      liftName: 'Seated Face Pull (Cable)',
      expectedRuleName: KeywordRuleLabels.UpperBack,
    },
    {
      liftName: 'Pull Up',
      expectedRuleName: KeywordRuleLabels.Lats,
    },
    {
      liftName: 'Fly Press (Dumbbell)',
      expectedRuleName: KeywordRuleLabels.ChestIsolation,
    },
    {
      liftName: 'Kneeling Pullover (Cable, V bar)',
      expectedRuleName: KeywordRuleLabels.Lats,
    },
    {
      liftName: 'Dragon Flag',
      expectedRuleName: KeywordRuleLabels.Abs,
    },
    {
      liftName: 'Preacher Hammer Curl (Dumbbell)',
      expectedRuleName: KeywordRuleLabels.HammerCurl,
    },
    {
      liftName: 'Lu Raises',
      expectedRuleName: KeywordRuleLabels.SideDeltsIsolation,
    },
  ];

  test.each(testCases)(
    'given lift name "$liftName", it should identify "$expectedRuleName" as the source rule',
    ({ liftName, expectedRuleName }) => {
      const result = getAffectedMuscleGroups(liftName);
      if (expectedRuleName === 'None') {
        expect(result.sourceRule).toBeNull();
      } else {
        expect(result.sourceRule).toBe(expectedRuleName);
      }
    }
  );
});
