import assert from "node:assert/strict";
import fs from "node:fs";
import {IRON_QUESTIONNAIRE_V1 as Q} from "./iron-questionnaire-contract-v1.mjs";

const src=fs.readFileSync(new URL("../assets/iron-questionnaire-v1.js",import.meta.url),"utf8");

// Research preview must implement every contracted stage with a concrete user-facing hook.
const hooks={
 handedness:["data-field=\"handedness\""],
 brand_scope:["id=\"ironBrandScope\"","class=\"brandMode\""],
 current_irons:["id=\"ironCurrentIrons\""],
 current_set_makeup:["data-field=\"currentSetMakeup\""],
 ability_band:["data-field=\"ability\""],
 seven_iron_distance_or_speed:["id=\"ironCarry\""],
 strike_location:["data-field=\"strike\""],
 strike_consistency:["data-field=\"strikeConsistency\""],
 directional_miss:["data-field=\"direction\""],
 trajectory:["data-field=\"trajectory\""],
 carry_consistency:["data-field=\"carryConsistency\""],
 turf_divot:["data-field=\"turf\""],
 priorities:["data-field=\"priorities\""],
 launch_monitor_detail:["data-field=\"launchMonitorDetail\""],
 review:["id=\"ironReview\"","id=\"ironReviewPanel\""]
};
const implemented=[],missing=[];
for(const stage of Q){
 const required=hooks[stage.id];
 assert.ok(required,`No implementation hook definition for ${stage.id}`);
 const ok=required.every(token=>src.includes(token));
 (ok?implemented:missing).push(stage.id);
}
assert.deepEqual(missing,[],"Every contracted Iron questionnaire stage must have a real preview control before questionnaire-complete status");
assert.deepEqual(implemented,Q.map(x=>x.id));

// Launch-monitor quality must retain Driver's current range/general/none semantics and no exact mode.
for(const v of ["range","general","none"])assert.ok(src.includes(`data-v=\"${v}\"`));
assert.ok(!src.includes('data-v="exact"'));
console.log("PASS iron questionnaire implementation coverage",implemented.length,"contracted stages implemented");
