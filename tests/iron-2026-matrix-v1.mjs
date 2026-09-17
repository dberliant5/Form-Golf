const SOURCES={
 players:"https://www.golfdigest.com/story/players-irons-2026-robotic-testing-analysis",
 game_improvement:"https://www.golfdigest.com/story/game-improvement-irons-2026-robotic-testing-analysis",
 super_gi:"https://www.golfdigest.com/story/super-game-improvement-irons-2026-robot-testing-analysis",
 players_distance:"https://www.golfdigest.com/story/players-distance-irons-2026-robotic-testing-analysis",
 cross_category:"https://www.golfdigest.com/story/iron-superlatives-categories-robotic-testing-insights"
};

export const IRON_2026_MATRIX_V1 = [
["PXG 0311T GEN8","players",155.8,326],
["Cobra 3DP Tour","players",150.7,227],
["Callaway Apex Ai 150","players",149.5,303],
["Mizuno Pro M-13","players",148.8,165,6.41],
["Cobra 3DP MB","players",147.1,246],
["Ping i240","players",146.8,136.6,4.58],
["Mizuno Pro S-1","players",146.5,223],
["Wilson Staff Model","players",144.5,372],
["Callaway X Forged","players",143.5,279],
["Wilson Staff Model CB","players",136.6,310,null,null,46.76],
["Callaway Quantum Max OS","super_gi",null,85.4,6.57],
["Callaway Quantum Max","super_gi",null,129.2,null],
["Cobra Baffler","super_gi",null,145.1,null],
["Cobra King Max","super_gi",null,172.7,7.25],
["PXG 0311XP Gen 8","game_improvement",164.2,360.6,null,1.17,42.69],
["Ping G740","game_improvement",158.8,null],
["Callaway Apex Ti Fusion Forged","game_improvement",157.4,null,null,2.60],
["Cobra 3DP X","game_improvement",156.5,null],
["Cobra 3DP King","game_improvement",null,166.9,null,-2.33,42.63],
["TaylorMade Qi4D Max","game_improvement",null,null],
["TaylorMade Qi4D Max HL","game_improvement",147.0,null,null,-2.18,45.91],
["Wilson Staff Dynapwr","game_improvement",null,null,7.27,1.26,45.81],
["Ping i540","players_distance",160.0,147.5,5.88,null,42.80],
["PXG 0311P","players_distance",161.5,null],
["TaylorMade P790","players_distance",157.9,null],
["Callaway Apex Ai200","players_distance",null,null],
["Callaway Apex Ti Fusion","players_distance",null,null],
["Mizuno Pro M-15","players_distance",null,null],
["Wilson Staff Model XB","players_distance",149.5,null]
].map(([model,category,carryYd,dispersion95SqFt,lateralWidthYd,axisDeg,descentDeg])=>{
 const metricSource={};
 for(const [field,value] of Object.entries({carryYd,dispersion95SqFt,lateralWidthYd,axisDeg,descentDeg})){
  if(Number.isFinite(value)) metricSource[field]=SOURCES[category];
 }
 return {
  model,category,carryYd,dispersion95SqFt,lateralWidthYd:lateralWidthYd??null,
  lateralWidthUnit:lateralWidthYd==null?null:"yards",axisDeg:axisDeg??null,descentDeg:descentDeg??null,
  protocol:"GD_GL_2026_82MPH_36SHOT_6ZONE",direct:true,
  provenance:{categorySource:SOURCES[category],crossCategorySource:SOURCES.cross_category,metricSource}
 };
});

export const MATRIX_RULES_V1={
 nullMeans:"not_yet_verified_not_zero",
 noCrossProtocolNormalization:true,
 lateralWidthCanonicalUnit:"yards",
 sourceUnitNote:"The cross-category Golf Digest analysis explicitly reports 95% side-to-side width in yards; one category article uses inconsistent prose labeling. Canonical values here follow the cross-category dataset.",
 expectedFieldSize:30,
 verifiedIdentityRows:29,
 identityGap:"One of the nine GI robot-tested model identities remains unverified from accessible source text; do not guess it.",
 rankingAllowed:false,
 requiredBeforeRanking:["complete_model_identity","verified_common_fields","field_level_provenance","blind_archetype_tests"]
};
