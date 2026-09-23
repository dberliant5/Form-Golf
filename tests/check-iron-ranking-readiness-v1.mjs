import assert from "node:assert/strict";
import {IRON_2026_MATRIX_V1 as D,MATRIX_RULES_V1 as R} from "./iron-2026-matrix-v1.mjs";
import {IRON_EVIDENCE_ANCHORS_V1 as A} from "./iron-evidence-anchors-v1.mjs";
import {IRON_STRIKE_ZONE_EVIDENCE_V1 as Z} from "./iron-strike-zone-evidence-v1.mjs";

// Research rankings may run for diagnostics, but a production recommendation must stay blocked
// until the matrix's declared prerequisites are actually satisfied. The questionnaire now captures
// ordered priorities, but rank-position weighting is intentionally NOT invented: it needs a
// documented calibration/validation step before #1 vs #2 vs #3 can alter production scoring.
// Strike location is also captured, but production personalization must not claim a strike fit until
// comparable per-model zone data is ingested; sparse verified facts remain evidence, not scores.
assert.equal(R.rankingAllowed,false);
assert.deepEqual(R.requiredBeforeRanking,[
 "complete_model_identity",
 "verified_common_fields",
 "field_level_provenance",
 "verified_strike_zone_fields",
 "blind_archetype_tests",
 "calibrated_priority_rank_weights"
]);

const models=new Set(D.map(x=>x.model));
const anchorModels=new Set(A.map(x=>x.model));
const missingAnchorRows=D.filter(x=>!anchorModels.has(x.model)).map(x=>x.model);
const missingDispersion=D.filter(x=>!Number.isFinite(x.dispersion95SqFt)).map(x=>x.model);
const missingCarry=D.filter(x=>!Number.isFinite(x.carryYd)).map(x=>x.model);
const missingDirection=D.filter(x=>!Number.isFinite(x.axisDeg)).map(x=>x.model);
const missingLateral=D.filter(x=>!Number.isFinite(x.lateralWidthYd)).map(x=>x.model);
const strikeZoneRows=D.filter(x=>x.zoneCarry && Object.values(x.zoneCarry).some(Number.isFinite));

assert.ok(models.size===D.length);
assert.ok(missingAnchorRows.length>0,"If every row gains provenance, explicitly review whether ranking readiness can advance");
assert.ok(missingDispersion.length>0,"If common dispersion becomes complete, explicitly review ranking readiness");
assert.ok(missingCarry.length>0,"If common carry becomes complete, explicitly review ranking readiness");
assert.equal(strikeZoneRows.length,0,"If comparable strike-zone rows are ingested, replace this fail-closed sentinel with explicit coverage requirements before enabling strike personalization");

// Preserve recoverable strike evidence without pretending sparse facts form a comparable matrix.
assert.equal(Z.protocol,"GD_GL_2026_82MPH_36SHOT_6ZONE");
assert.equal(Z.scoringReady,false);
assert.equal(Z.rules.unknownZoneMeans,"not_yet_verified_not_zero");
assert.equal(Z.rules.noChartInterpolation,true);
assert.equal(Z.rules.noCategoryImputation,true);
for(const model of Object.keys(Z.models)) assert.ok(models.has(model),`strike evidence model missing from matrix: ${model}`);
assert.equal(Z.models["PXG 0311XP Gen 8"].verifiedValues.mid_center,172.9);
assert.equal(Z.models["Ping G740"].verifiedValues.low_center,169.2);

// Sparse optional dimensions are allowed only as neutral missing evidence; never reinterpret null as zero.
assert.ok(missingDirection.length>0 && missingLateral.length>0);
assert.equal(R.nullMeans,"not_yet_verified_not_zero");

console.log("PASS iron production-ranking readiness remains intentionally blocked",{
 rows:D.length,anchorRows:A.length,missingAnchorRows:missingAnchorRows.length,
 missingDispersion:missingDispersion.length,missingCarry:missingCarry.length,
 missingDirection:missingDirection.length,missingLateral:missingLateral.length,
 strikeZoneRows:strikeZoneRows.length,verifiedSparseStrikeModels:Object.keys(Z.models).length,
 priorityRankWeights:"calibration_required"
});
