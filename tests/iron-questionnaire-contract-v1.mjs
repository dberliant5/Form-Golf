// FORM Irons v1 questionnaire contract — test/research only.
// Shared golfer questions deliberately mirror Driver semantics/ordering where relevant.
export const DRIVER_PARITY_CONTRACT_V1={
 openingOrder:["handedness","brand_scope"],
 handedness:{
  semantic:"category_specific_answer_shared_component",
  required:true,
  resetOnFreshFit:true,
  inheritFromOtherCategories:false,
  choices:["right","left"],
  rule:"Use the same wording, controls, selected-state behavior, persistence semantics and review treatment as Driver."
 },
 brandScope:{
  semantic:"category_specific_answer_shared_component",
  required:true,
  resetConfirmationOnFreshFit:true,
  inheritFromOtherCategories:false,
  rule:"Reuse Driver brand-scope component and behavior virtually identically; only eligible iron brands/models differ."
 },
 launchMonitor:{
  semantic:"shared_input_quality_pattern",
  canonicalModes:["range","general","none"],
  exactModeAllowed:false,
  categorySpecificAnswer:true,
  inheritFromOtherCategories:false,
  copyPattern:{
   range:"Yes — I know my typical ranges",
   general:"I know my typical tendencies",
   none:"No — I don’t know my launch-monitor data"
  },
  rule:"Reuse Driver's current range-first/general/none input-quality pattern where an iron metric supports it. Do not reintroduce the retired exact mode."
 },
 strikeMap:{
  semantic:"shared_face_location_pattern",
  rule:"Reuse the Driver face-location interaction grammar when practical, but use iron-specific face geometry and only score strike dimensions supported by iron evidence."
 }
};

export const IRON_QUESTIONNAIRE_V1=[
 {id:"handedness",group:"opening",sharedWithDriver:true},
 {id:"brand_scope",group:"opening",sharedWithDriver:true},
 {id:"current_irons",group:"current_gamer"},
 {id:"current_set_makeup",group:"current_gamer"},
 {id:"ability_band",group:"golfer"},
 {id:"seven_iron_distance_or_speed",group:"delivery"},
 {id:"strike_location",group:"strike"},
 {id:"strike_consistency",group:"strike"},
 {id:"directional_miss",group:"flight"},
 {id:"trajectory",group:"flight"},
 {id:"carry_consistency",group:"flight"},
 {id:"turf_divot",group:"delivery"},
 {id:"priorities",group:"preference"},
 {id:"launch_monitor_detail",group:"optional_data",sharedPatternWithDriver:true},
 {id:"review",group:"review"}
];

export const PARITY_RULES_V1={
 sharedQuestionsMustNotDrift:true,
 ironSpecificQuestionsMayDiffer:true,
 driverScoringMustNotBeImported:true,
 brandPreferenceMayFilterEligibilityButNeverAddFitPoints:true
};
