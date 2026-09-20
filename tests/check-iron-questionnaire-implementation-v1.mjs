import assert from "node:assert/strict";
import fs from "node:fs";
import {IRON_QUESTIONNAIRE_V1 as Q,DRIVER_PARITY_CONTRACT_V1 as C} from "./iron-questionnaire-contract-v1.mjs";
const src=fs.readFileSync(new URL("../assets/iron-questionnaire-v1.js",import.meta.url),"utf8");
const hooks={
 handedness:['choice("handedness"'],brand_scope:['id="ironBrandScope"','class="brandMode"'],current_irons:['id="ironCurrentIrons"'],
 current_set_makeup:['choice("currentSetMakeup"'],ability_band:['choice("ability"'],seven_iron_distance_or_speed:['id="ironCarry"'],
 strike_location:['data-field="strike"','class="ironFaceWrap"','class="strikeTargets"'],strike_source:['choice("strikeSource"'],
 strike_consistency:['choice("strikeConsistency"'],directional_miss:['choice("direction"'],trajectory:['choice("trajectory"'],
 carry_consistency:['choice("carryConsistency"'],turf_divot:['choice("turf"'],priorities:['data-field="priorities"','class="choiceRow priorityRank"'],
 launch_monitor_detail:['choice("launchMonitorDetail"'],review:['id="ironReview"','id="ironReviewPanel"','Model-level research shortlist']
};
const implemented=[],missing=[];
for(const stage of Q){const required=hooks[stage.id];assert.ok(required,`No implementation hook definition for ${stage.id}`);const ok=required.every(token=>src.includes(token));(ok?implemented:missing).push(stage.id);}
assert.deepEqual(missing,[],"Every contracted Iron questionnaire stage must have a real preview control before questionnaire-complete status");
assert.deepEqual(implemented,Q.map(x=>x.id));
for(const v of ["range","general","none"])assert.ok(src.includes(`["${v}"`),`launch-monitor option ${v} missing`);assert.ok(!src.includes('data-v="exact"'));
for(const v of ["confirmed","repeated","guess","unknown"])assert.ok(src.includes(`["${v}"`),`strike-source option ${v} missing`);
assert.equal(C.strikeMap.interactiveGraphicRequired,true);assert.equal(C.strikeMap.sourceConfidenceRequired,true);
assert.equal(C.priorities.singleChoiceForbidden,true);assert.ok(src.includes("S.priorities.push(v)"),"priority order must be retained");
assert.equal(C.results.specificModelsRequired,true);assert.ok(src.includes("${x.model}"),"result cards must render the specific model identity");
assert.ok(src.includes("Where do you struggle with your irons, if anywhere?"));
console.log("PASS iron questionnaire implementation coverage",implemented.length,"contracted stages implemented; FORM UX parity gates locked");
