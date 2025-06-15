import {MuscleGroups} from "@/components/data/constants";

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
  HammerCurl = 'Hammer Curl',
  LowerBack = 'Lower Back',
}

type WeightedKeyword = {
  weight: number;
  keyword: string | RegExp;
}

type MuscleGroupKeywordRule = {
  label: KeywordRuleLabels;
  keywords: WeightedKeyword[];
  primary: MuscleGroups[];
  secondary: MuscleGroups[];
}

export const MUSCLE_GROUP_KEYWORD_RULES: MuscleGroupKeywordRule[] = [
  {
    label: KeywordRuleLabels.NeckIsolation,
    keywords: [
      {keyword: 'neck', weight: 3}
    ],
    primary: [MuscleGroups.Neck],
    secondary: []
  },
  {
    label: KeywordRuleLabels.ShrugsAndTraps,
    keywords: [
      {keyword: 'shrug', weight: 3},
      {keyword: 'rack pull', weight: 2},
      {keyword: 'high pull', weight: 2},
      {keyword: 'carry', weight: 2},
      {keyword: 'carries', weight: 2}
    ],
    primary: [MuscleGroups.UpperTraps],
    secondary: [MuscleGroups.UpperBack, MuscleGroups.Forearms]
  },
  {
    label: KeywordRuleLabels.UpperBack,
    keywords: [
      {keyword: 'wide', weight: 1},
      {keyword: /rows?/, weight: 2.5},
      {keyword: /face[\s-]?pull/, weight: 3}
    ],
    primary: [MuscleGroups.UpperBack],
    secondary: [MuscleGroups.Lats, MuscleGroups.RearDelts, MuscleGroups.Biceps]
  },
  {
    label: KeywordRuleLabels.Lats,
    keywords: [
      {keyword: /lats?[\s-]/, weight: 3},
      {keyword: /rows?/, weight: 2},
      {keyword: 'narrow', weight: 1},
      {keyword: /pull[\s-]?overs?/, weight: 3},
      {keyword: /pull[\s-]?ups?/, weight: 3},
      {keyword: /chin[\s-]?ups?/, weight: 3},
      {keyword: /pull[\s-]?downs?/, weight: 3}
    ],
    primary: [MuscleGroups.Lats],
    secondary: [MuscleGroups.UpperBack, MuscleGroups.Biceps, MuscleGroups.RearDelts]
  },
  {
    label: KeywordRuleLabels.ChestCompounds,
    keywords: [
      {keyword: 'bench', weight: 2},
      {keyword: 'chest', weight: 2},
      {keyword: 'dips', weight: 2},
      {keyword: 'press', weight: 1},
      {keyword: /push[\s-]?up/, weight: 3}
    ],
    primary: [MuscleGroups.Chest],
    secondary: [MuscleGroups.FrontDelts, MuscleGroups.Triceps]
  },
  {
    label: KeywordRuleLabels.ChestIsolation,
    keywords: [
      {keyword: 'chest', weight: 2},
      {keyword: /cross-?over/, weight: 3},
      {keyword: /fly[es]?/, weight: 3},
      {keyword: /pec\s?deck?/, weight: 3}
    ],
    primary: [MuscleGroups.Chest],
    secondary: []
  },
  {
    label: KeywordRuleLabels.OverheadPresses,
    keywords: [
      {keyword: 'press', weight: 1},
      {keyword: 'ohp', weight: 3},
      {keyword: 'shoulder', weight: 2},
      {keyword: 'overhead', weight: 3},
      {keyword: 'arnold', weight: 3},
      {keyword: 'military', weight: 3},
      {keyword: 'landmine', weight: 3},
      {keyword: 'viking', weight: 3},
      {keyword: 'log', weight: 2}
    ],
    primary: [MuscleGroups.FrontDelts],
    secondary: [MuscleGroups.Triceps, MuscleGroups.SideDelts]
  },
  {
    label: KeywordRuleLabels.FrontDeltsIsolation,
    keywords: [
      {keyword: 'raise', weight: 1},
      {keyword: 'front', weight: 2}
    ],
    primary: [MuscleGroups.FrontDelts],
    secondary: []
  },
  {
    label: KeywordRuleLabels.SideDeltsIsolation,
    keywords: [
      {keyword: 'lateral', weight: 2},
      {keyword: /lu[\s-]/, weight: 2},
      {keyword: 'raise', weight: 1}
    ],
    primary: [MuscleGroups.SideDelts],
    secondary: [MuscleGroups.FrontDelts, MuscleGroups.RearDelts]
  },
  {
    label: KeywordRuleLabels.SideDeltsCompounds,
    keywords: [
      {keyword: /upright.*row/, weight: 3}
    ],
    primary: [MuscleGroups.SideDelts],
    secondary: [MuscleGroups.UpperTraps, MuscleGroups.Biceps]
  },
  {
    label: KeywordRuleLabels.RearDeltsIsolation,
    keywords: [
      {keyword: /rear.*delt/, weight: 3},
      {keyword: 'reverse', weight: 2},
      {keyword: 'fly', weight: 1},
      {keyword: /pec\s?dec/, weight: 1},
    ],
    primary: [MuscleGroups.RearDelts],
    secondary: [MuscleGroups.UpperBack]
  },
  {
    label: KeywordRuleLabels.Biceps,
    keywords: [
      {keyword: 'curl', weight: 2},
      {keyword: 'bicep', weight: 3},
      {keyword: 'preacher', weight: 2},
      {keyword: 'concentration', weight: 2},
      {keyword: 'spider', weight: 2},
      {keyword: 'drag', weight: 2},
      {keyword: 'incline', weight: 2},
      {keyword: 'bayesian', weight: 3}
    ],
    primary: [MuscleGroups.Biceps],
    secondary: []
  },
  {
    label: KeywordRuleLabels.HammerCurl,
    keywords: [
      {keyword: 'hammer', weight: 4},
      {keyword: 'pinwheel', weight: 4},
      {keyword: 'reverse', weight: 1},
      {keyword: 'curl', weight: 2}
    ],
    primary: [MuscleGroups.Forearms],
    secondary: [MuscleGroups.Biceps]
  },
  {
    label: KeywordRuleLabels.Triceps,
    keywords: [
      {keyword: 'tricep', weight: 3},
      {keyword: 'pushdown', weight: 3},
      {keyword: 'extension', weight: 2},
      {keyword: 'kickback', weight: 2},
      {keyword: /skull\s?crusher/, weight: 3},
      {keyword: 'jm', weight: 3}
    ],
    primary: [MuscleGroups.Triceps],
    secondary: []
  },
  {
    label: KeywordRuleLabels.ForearmIsolation,
    keywords: [
      {keyword: 'wrist', weight: 3},
      {keyword: 'forearm', weight: 3}
    ],
    primary: [MuscleGroups.Forearms],
    secondary: []
  },
  {
    label: KeywordRuleLabels.Abs,
    keywords: [
      {keyword: 'dragon', weight: 3},
      {keyword: 'crunch', weight: 3},
      {keyword: 'plank', weight: 3},
      {keyword: /(knee|leg)s?[\s-]?raise/, weight: 3},
      {keyword: 'rollout', weight: 2},
      {keyword: 'wheel', weight: 2},
      {keyword: 'roller', weight: 2},
      {keyword: /sit[\s-]?ups?/, weight: 3},
      {keyword: /abs?[\s-]/, weight: 2}
    ],
    primary: [MuscleGroups.Abs],
    secondary: []
  },
  {
    label: KeywordRuleLabels.Obliques,
    keywords: [
      {keyword: 'oblique', weight: 3},
      {keyword: 'twist', weight: 3},
      {keyword: 'chopper', weight: 3},
      {keyword: 'bend', weight: 2},
      {keyword: 'side', weight: 2},
      {keyword: 'windshield', weight: 3},
      {keyword: 'lateral', weight: 1}
    ],
    primary: [MuscleGroups.Obliques],
    secondary: [MuscleGroups.Abs]
  },
  {
    label: KeywordRuleLabels.QuadCompounds,
    keywords: [
      {keyword: 'squat', weight: 3},
      {keyword: 'lunge', weight: 3},
      {keyword: /legs? press/, weight: 3},
      {keyword: /step[\s-]?ups?/, weight: 3}
    ],
    primary: [MuscleGroups.Quads],
    secondary: [MuscleGroups.Glutes]
  },
  {
    label: KeywordRuleLabels.QuadsIsolation,
    keywords: [
      {keyword: 'leg', weight: 1},
      {keyword: 'extension', weight: 2},
      {keyword: 'sissy', weight: 3}
    ],
    primary: [MuscleGroups.Quads],
    secondary: []
  },
  {
    label: KeywordRuleLabels.Glutes,
    keywords: [
      {keyword: 'glute', weight: 2},
      {keyword: 'thrust', weight: 3},
      {keyword: 'kickback', weight: 1},
      {keyword: 'frog', weight: 3},
      {keyword: 'sumo', weight: 2}
    ],
    primary: [MuscleGroups.Glutes],
    secondary: [MuscleGroups.Hamstrings]
  },
  {
    label: KeywordRuleLabels.HamstringsCompounds,
    keywords: [
      {keyword: 'hamstring', weight: 2},
      {keyword: 'rdl', weight: 4},
      {keyword: 'romanian', weight: 4},
      {keyword: 'ghr', weight: 4},
      {keyword: 'ham raise', weight: 4},
      {keyword: 'morning', weight: 3},
    ],
    primary: [MuscleGroups.Hamstrings],
    secondary: [MuscleGroups.Glutes, MuscleGroups.LowerBack]
  },
  {
    label: KeywordRuleLabels.HamstringsIsolation,
    keywords: [
      {keyword: 'leg', weight: 2},
      {keyword: 'hamstring', weight: 2},
      {keyword: 'curl', weight: 2},
      {keyword: 'nordic', weight: 3}
    ],
    primary: [MuscleGroups.Hamstrings],
    secondary: []
  },
  {
    label: KeywordRuleLabels.CalvesIsolation,
    keywords: [
      {keyword: 'calf', weight: 5},
      {keyword: 'calves', weight: 5}
    ],
    primary: [MuscleGroups.Calves],
    secondary: []
  },
  {
    label: KeywordRuleLabels.OddLiftsDeadlift,
    keywords: [
      {keyword: 'conventional', weight: 2},
      {keyword: 'deadlift', weight: 3}
    ],
    primary: [],
    secondary: [
      MuscleGroups.LowerBack, MuscleGroups.Glutes,
      MuscleGroups.Hamstrings, MuscleGroups.Quads, MuscleGroups.UpperTraps
    ]
  },
  {
    label: KeywordRuleLabels.OddLiftsCloseGripBench,
    keywords: [
      {keyword: 'press', weight: 1},
      {keyword: 'close', weight: 2},
      {keyword: 'grip', weight: 2}
    ],
    primary: [MuscleGroups.Chest, MuscleGroups.Triceps],
    secondary: [MuscleGroups.FrontDelts]
  },
  {
    label: KeywordRuleLabels.OddLiftsHyperextension,
    keywords: [
      {keyword: 'back', weight: 2},
      {keyword: 'extension', weight: 2},
      {keyword: 'hyper', weight: 2},
      {keyword: /hyper[\s-]?extension/, weight: 3}
    ],
    primary: [MuscleGroups.LowerBack],
    secondary: [MuscleGroups.Glutes, MuscleGroups.Hamstrings]
  },
  {
    label: KeywordRuleLabels.LowerBack,
    keywords: [
      {keyword: 'jefferson', weight: 3},
      {keyword: 'flexion', weight: 3},
      {keyword: 'row', weight: 1},
      {keyword: 'curl', weight: 1},
    ],
    primary: [MuscleGroups.LowerBack],
    secondary: [MuscleGroups.UpperBack],
  }
];
