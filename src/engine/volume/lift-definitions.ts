import { MuscleGroups } from "@/components/data/constants";

export enum KeywordRuleLabels {
  NeckIsolation = 'Neck Isolation',
  ShrugsAndTraps = 'Shrugs and Traps',
  UpperBack = 'Upper Back',
  Lats = 'Lats',
  ChestCompounds = 'Chest Compounds',
  ChestIsolation = 'Chest Isolation',
  OverheadPresses = 'Overhead Presses',
  FrontDeltsIsolation = 'Front Delts Isolation',
  SideDeltsIsolation = 'Side Delts Isolation',
  SideDeltsCompounds = 'Side Delts Compounds',
  RearDeltsIsolation = 'Rear Delts Isolation',
  Biceps = 'Biceps',
  HammerCurl = 'Hammer Curl',
  Triceps = 'Triceps',
  ForearmIsolation = 'Forearm Isolation',
  Abs = 'Abs',
  Obliques = 'Obliques',
  QuadCompounds = 'Quad compounds', // Corrected casing to match existing label
  QuadsIsolation = 'Quads Isolation',
  Glutes = 'Glutes',
  HamstringsCompounds = 'Hamstrings Compounds',
  HamstringsIsolation = 'Hamstrings Isolation',
  CalvesIsolation = 'Calves Isolation',
  OddLiftsDeadlift = 'Odd Lifts - Deadlift',
  OddLiftsCloseGripBench = 'Odd Lifts - Close Grip Bench',
  OddLiftsHyperextension = 'Odd Lifts - Hyperextension',
}

type MuscleGroupKeywordRule = {
  label: KeywordRuleLabels;
  keywords: (string | RegExp)[];
  primary: MuscleGroups[];
  secondary: MuscleGroups[];
}

export const MUSCLE_GROUP_KEYWORD_RULES: MuscleGroupKeywordRule[] = [
  // neck isolation
  {
    label: KeywordRuleLabels.NeckIsolation,
    keywords: ['neck'],
    primary: [MuscleGroups.Neck],
    secondary: []
  },
  // shrugs and traps
  {
    label: KeywordRuleLabels.ShrugsAndTraps,
    keywords: [
      'shrug',
      'rack pull',
      'high pull',
      'carry',
      'carries'
    ],
    primary: [MuscleGroups.UpperTraps],
    secondary: [MuscleGroups.UpperBack, MuscleGroups.Forearms]
  },
  // upper back
  {
    label: KeywordRuleLabels.UpperBack,
    keywords: [
      'wide',
      /rows?/,
      /face[\s-]?pull/
    ],
    primary: [MuscleGroups.UpperBack],
    secondary: [MuscleGroups.Lats, MuscleGroups.RearDelts, MuscleGroups.Biceps]
  },
  // lats
  {
    label: KeywordRuleLabels.Lats,
    keywords: [
      'lat',
      'row',
      'narrow',
      /pull[\s-]?overs?/,
      /pull[\s-]?ups?/,
      /chin[\s-]?ups?/,
      /pull[\s-]?downs?/,
    ],
    primary: [MuscleGroups.Lats],
    secondary: [
      MuscleGroups.UpperBack,
      MuscleGroups.Biceps,
      MuscleGroups.RearDelts
    ]
  },
  // chest compounds
  {
    label: KeywordRuleLabels.ChestCompounds,
    keywords: [
      'bench',
      'chest',
      'dips',
      'press',
      /push[\s-]?up/,
    ],
    primary: [MuscleGroups.Chest],
    secondary: [MuscleGroups.FrontDelts, MuscleGroups.Triceps]
  },
  // chest isolation
  {
    label: KeywordRuleLabels.ChestIsolation,
    keywords: [
      'chest',
      /cross-?over/,
      /fly[es]?/,
      /pec\s?deck?/,
    ],
    primary: [MuscleGroups.Chest],
    secondary: []
  },
  // OHPs
  {
    label: KeywordRuleLabels.OverheadPresses,
    keywords: [
      'press',
      'ohp',
      'shoulder',
      'overhead',
      'arnold',
      'military',
      'landmine',
      'viking',
      'log'
    ],
    primary: [MuscleGroups.FrontDelts],
    secondary: [MuscleGroups.Triceps, MuscleGroups.SideDelts]
  },
  // front delts isolation
  {
    label: KeywordRuleLabels.FrontDeltsIsolation,
    keywords: ['raise', 'front'],
    primary: [MuscleGroups.FrontDelts],
    secondary: []
  },
  // side delt isolation
  {
    label: KeywordRuleLabels.SideDeltsIsolation,
    keywords: ['lateral', 'raise'],
    primary: [MuscleGroups.SideDelts],
    secondary: [MuscleGroups.FrontDelts, MuscleGroups.RearDelts],
  },
  // side delt compounds
  {
    label: KeywordRuleLabels.SideDeltsCompounds,
    keywords: [
      'upright', 'upright row',
    ],
    primary: [MuscleGroups.SideDelts],
    secondary: [MuscleGroups.UpperTraps, MuscleGroups.Biceps]
  },
  // rear delts isolation
  {
    label: KeywordRuleLabels.RearDeltsIsolation,
    keywords: [
      'rear', 'reverse', 'fly',
      /pec\s?dec/,
    ],
    primary: [MuscleGroups.RearDelts],
    secondary: [MuscleGroups.UpperBack]
  },
  // biceps
  {
    label: KeywordRuleLabels.Biceps,
    keywords: [
      'curl',
      'bicep',
      'preacher',
      'concentration',
      'spider',
      'drag',
      'zottman',
      'incline',
      'bayesian'
    ],
    primary: [MuscleGroups.Biceps],
    secondary: []
  },
  {
    label: KeywordRuleLabels.HammerCurl,
    keywords: ['hammer', 'curl'],
    primary: [MuscleGroups.Forearms],
    secondary: [MuscleGroups.Biceps]
  },
  // triceps
  {
    label: KeywordRuleLabels.Triceps,
    keywords: [
      'tricep',
      'pushdown',
      'extension',
      'kickback',
      /skull\s?crusher/,
      'jm',
    ],
    primary: [MuscleGroups.Triceps],
    secondary: []
  },
  // forearm isolation
  {
    label: KeywordRuleLabels.ForearmIsolation,
    keywords: [
      'wrist',
      'forearm',
    ],
    primary: [MuscleGroups.Forearms],
    secondary: []
  },
  // abs
  {
    label: KeywordRuleLabels.Abs,
    keywords: [
      'crunch',
      'plank',
      'raise',
      'leg',
      'knee',
      'hanging',
      'rollout',
      'wheel',
      'roller',
      /sit[\s-]?ups?/,
      /abs?\s/
    ],
    primary: [MuscleGroups.Abs],
    secondary: []
  },
  // obliques
  {
    label: KeywordRuleLabels.Obliques,
    keywords: [
      'oblique',
      'twist',
      'chopper',
      'bend',
      'side',
      'windshield',
      'lateral'
    ],
    primary: [MuscleGroups.Obliques],
    secondary: [MuscleGroups.Abs]
  },
  // quads
  {
    label: KeywordRuleLabels.QuadCompounds,
    keywords: [
      'squat',
      'lunge',
      'split',
      'press',
      'leg',
      /step[\s-]?ups?/
    ],
    primary: [MuscleGroups.Quads],
    secondary: [MuscleGroups.Glutes]
  },
  // quads isolation
  {
    label: KeywordRuleLabels.QuadsIsolation,
    keywords: [
      'leg',
      'extension',
      'sissy',
    ],
    primary: [MuscleGroups.Quads],
    secondary: []
  },
  // Glutes
  {
    label: KeywordRuleLabels.Glutes,
    keywords: [
      'glute',
      'hip',
      'thrust',
      'kickback',
      'frog',
      'sumo',
    ],
    primary: [MuscleGroups.Glutes],
    secondary: [MuscleGroups.Hamstrings]
  },
  // hamstrings compounds
  {
    label: KeywordRuleLabels.HamstringsCompounds,
    keywords: [
      'hamstring',
      'rdl',
      'romanian',
      'ghr',
      'ham raise',
      'morning'
    ],
    primary: [MuscleGroups.Hamstrings],
    secondary: [MuscleGroups.Glutes, MuscleGroups.LowerBack]
  },
  // hamstrings isolation
  {
    label: KeywordRuleLabels.HamstringsIsolation,
    keywords: [
      'leg',
      'hamstring',
      'curl',
      'nordic'
    ],
    primary: [MuscleGroups.Hamstrings],
    secondary: []
  },
  // calves isolation
  {
    label: KeywordRuleLabels.CalvesIsolation,
    keywords: [
      'calf',
      'calves',
    ],
    primary: [MuscleGroups.Calves],
    secondary: []
  },
  // odd lifts
  {
    label: KeywordRuleLabels.OddLiftsDeadlift,
    keywords: [
      'conventional',
      'deadlift',
    ],
    primary: [],
    secondary: [
      MuscleGroups.LowerBack, MuscleGroups.Glutes,
      MuscleGroups.Hamstrings, MuscleGroups.Quads, MuscleGroups.UpperTraps]
  },
  {
    label: KeywordRuleLabels.OddLiftsCloseGripBench,
    keywords: [
      'press',
      'close',
      'grip',
    ],
    primary: [MuscleGroups.Chest, MuscleGroups.Triceps],
    secondary: [MuscleGroups.FrontDelts]
  },
  {
    label: KeywordRuleLabels.OddLiftsHyperextension,
    keywords: ['back', 'extension', 'hyper', /hyper[\s-]?extension/],
    primary: [MuscleGroups.LowerBack],
    secondary: [MuscleGroups.Glutes, MuscleGroups.Hamstrings]
  }
]
