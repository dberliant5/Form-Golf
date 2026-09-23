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
   verifiedValues:{mid_center:172.9},
   verifiedFacts:["highest_single_zone_carry_in_gi_field","only_gi_model_mid_center_longer_than_low_center"]
  },
  "Ping G740":{
   verifiedValues:{low_center:169.2},
   verifiedFacts:["longest_zone_is_low_center"]
  },
  "Callaway Apex Ti Fusion Forged":{
   verifiedValues:{},
   verifiedFacts:["best_to_worst_zone_gap_yd_24.4"]
  },
  "TaylorMade Qi4D Max":{
   verifiedValues:{},
   verifiedFacts:["best_to_worst_zone_gap_yd_22.6"]
  },
  "Wilson Staff Dynapwr":{
   verifiedValues:{},
   verifiedFacts:["best_to_worst_zone_gap_yd_22.6","among_smallest_best_to_worst_zone_gaps_in_gi_field"]
  },
  "Cobra 3DP King":{
   verifiedValues:{},
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
