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
      expectedRuleName: KeywordRuleLabels.LowerBack,
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
      liftName: 'Cable Pull-down',
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
      expectedRuleName: KeywordRuleLabels.OddLiftsPullovers,
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
    {
      liftName: 'Seated Row Machine (Lats) (Plate loaded)',
      expectedRuleName: KeywordRuleLabels.Lats,
    },
    {
      liftName: 'Lean Back Leg Extension',
      expectedRuleName: KeywordRuleLabels.QuadsIsolation,
    },
  ];

  test.each(testCases)(
    'given lift name "$liftName", it should identify "$expectedRuleName" as the source rule',
    ({liftName, expectedRuleName}) => {
      const result = getAffectedMuscleGroups(liftName);
      expect(result.sourceRule).toBe(expectedRuleName);
      if (expectedRuleName !== 'None') {
        expect(result.certainty).toBeGreaterThanOrEqual(0.9);
      }
    }
  );
});
