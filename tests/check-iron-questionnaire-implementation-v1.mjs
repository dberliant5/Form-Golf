import assert from "node:assert/strict";
import fs from "node:fs";
import {IRON_QUESTIONNAIRE_V1 as Q} from "./iron-questionnaire-contract-v1.mjs";

const src=fs.readFileSync(new URL("../assets/iron-questionnaire-v1.js",import.meta.url),"utf8");

// Research preview must not silently imply that contracted stages are implemented.
// Require concrete user-facing controls/sections, not incidental words in state or prose.
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

// Keep the preview honest until these stages actually exist. When implementation lands,
// move each stage out of this list in the same commit; CI then proves contract/UI convergence.
const explicitlyDeferred=["current_irons","current_set_makeup","ability_band","strike_consistency","carry_consistency","turf_divot","launch_monitor_detail"];
assert.deepEqual(missing,explicitlyDeferred,"Questionnaire implementation changed; update the explicit deferred-stage contract intentionally");
assert.ok(implemented.includes("handedness")&&implemented.includes("brand_scope")&&implemented.includes("review"));
console.log("PASS iron questionnaire implementation coverage",{implemented,explicitlyDeferred});
