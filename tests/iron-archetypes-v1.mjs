export const IRON_ARCHETYPES_V1 = [
 {id:"control_first", carryNeed:"met", consistencyNeed:"high", strike:"mid_center", flight:"adequate", expected:["dispersion","carry_consistency"], anti:["raw_distance_bonus"]},
 {id:"slow_needs_stop", speed:"low", carryNeed:"high", flight:"too_low", expected:["launch_support","descent_floor","retention"], anti:["low_spin_distance_chase"]},
 {id:"toe_miss", strike:"mid_toe", consistency:"repeatable", expected:["toe_retention","dispersion"], missingStrikeData:"neutral_confidence_down"},
 {id:"low_toe_miss", strike:"low_toe", consistency:"repeatable", expected:["low_toe_retention","dispersion"], missingStrikeData:"neutral_confidence_down"},
 {id:"high_face", strike:"high_center", expected:["vertical_retention"], note:"No high-zone robot cell in common 2026 protocol: do not invent exact high-face model performance."},
 {id:"heel_miss", strike:"mid_heel", consistency:"repeatable", expected:["heel_retention","dispersion"], missingStrikeData:"neutral_confidence_down"},
 {id:"good_striker_mid_hcp", handicap:"mid", strike:"centered", expected:["dispersion","flight_fit","profile_fit"], anti:["handicap_category_lock"]},
 {id:"fast_inconsistent", speed:"high", strikeConsistency:"low", expected:["dispersion","retention"], anti:["speed_players_category_lock"]},
 {id:"needs_distance_not_height", carryNeed:"high", flight:"adequate", expected:["efficient_carry","dispersion_floor","descent_floor"]},
 {id:"current_gamer_strong", currentGamerFit:"strong", expected:["meaningful_upgrade_threshold"], anti:["new_model_recency_bonus"]},
 {id:"older_gamer_sparse", currentGamerEra:"older", evidence:"sparse", expected:["era_parity","confidence_separation"], anti:["missing_data_fit_penalty"]},
 {id:"turf_steep", turf:"steep_deep", expected:["sole_turf_fit"], note:"Do not infer turf performance from robot ball-flight data alone."}
];

export const IRON_SCORING_GUARDRAILS_V1 = {
 distance:"targeted_not_monotonic",
 descent:"floor_or_window_not_monotonic",
 dispersion:"primary_when_protocol_comparable",
 strikeRetention:"exact_zone_only_when_measured",
 category:"context_only",
 handicap:"context_only",
 missingPerformance:"neutral_fit_lower_confidence",
 brand:"zero_weight",
 affiliate:"zero_weight",
 price:"zero_weight",
 recency:"zero_weight",
 currentGamer:"require_meaningful_evidence_backed_delta"
};
