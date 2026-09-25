// Verified strike-zone evidence inventory for the 2026 Golf Laboratories iron protocol.
// This is intentionally NOT a scoring table. Only facts explicitly recoverable from the source
// are recorded here; unknown cells stay unknown rather than being inferred from prose or charts.
export const IRON_STRIKE_ZONE_EVIDENCE_V1={
 protocol:"GD_GL_2026_82MPH_36SHOT_6ZONE",
 source:"https://www.golfdigest.com/story/game-improvement-irons-2026-robotic-testing-analysis",
 zones:["mid_heel","mid_center","mid_toe","low_heel","low_center","low_toe"],
 scoringReady:false,
 models:{
  "PXG 0311XP Gen 8":{
   verifiedValues:{mid_heel:162,mid_center:172.9,mid_toe:163,low_heel:152,low_center:171,low_toe:165},
   verifiedFacts:["highest_single_zone_carry_in_gi_field","only_gi_model_mid_center_longer_than_low_center"]
  },
  "Ping G740":{
   verifiedValues:{mid_heel:154,mid_center:162,mid_toe:150,low_heel:157,low_center:169.2,low_toe:161},
   verifiedFacts:["longest_zone_is_low_center"]
  },
  "Cobra 3DP X":{
   verifiedValues:{mid_heel:150,mid_center:153,mid_toe:144,low_heel:152,low_center:164,low_toe:156},
   verifiedFacts:[]
  },
  "Callaway Apex Ti Fusion Forged":{
   verifiedValues:{mid_heel:157,mid_center:162,mid_toe:147,low_heel:157,low_center:168,low_toe:155},
   verifiedFacts:["best_to_worst_zone_gap_yd_24.4"]
  },
  "TaylorMade Qi4D Max":{
   verifiedValues:{mid_heel:147,mid_center:155,mid_toe:141,low_heel:151,low_center:164,low_toe:155},
   verifiedFacts:["best_to_worst_zone_gap_yd_22.6"]
  },
  "Wilson Staff Dynapwr":{
   verifiedValues:{mid_heel:154,mid_center:154,mid_toe:139,low_heel:157,low_center:161,low_toe:151},
   verifiedFacts:["best_to_worst_zone_gap_yd_22.6","among_smallest_best_to_worst_zone_gaps_in_gi_field"]
  },
  "Cobra King":{
   verifiedValues:{mid_heel:156,mid_center:158,mid_toe:145,low_heel:160,low_center:164,low_toe:155},
   verifiedFacts:["among_smallest_best_to_worst_zone_gaps_in_gi_field"]
  }
 },
 rules:{
  noChartInterpolation:true,
  noCategoryImputation:true,
  unknownZoneMeans:"not_yet_verified_not_zero",
  activationRequirement:"comparable_per_model_zone_values_with_field_level_provenance"
 }
};
