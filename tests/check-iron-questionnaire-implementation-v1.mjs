import assert from "node:assert/strict";
import fs from "node:fs";
import {IRON_QUESTIONNAIRE_V1 as Q} from "./iron-questionnaire-contract-v1.mjs";

const src=fs.readFileSync(new URL("../assets/iron-questionnaire-v1.js",import.meta.url),"utf8");

// Research preview must not silently imply that contracted stages are implemented.
// A stage is considered implemented only when its state key and a user-facing control/copy hook exist.
const hooks={
 handedness:["handedness","data-field=\"handedness\""],
 brand_scope:["brandMode","ironBrandScope"],
 current_irons:["currentIrons","current irons"],
 current_set_makeup:["currentSetMakeup","set makeup"],
 ability_band:["ability","ability"],
 seven_iron_distance_or_speed:["sevenIron","7-iron"],
 strike_location:["strike","data-field=\"strike\""],
 strike_consistency:["strikeConsistency","strike consistency"],
 directional_miss:["direction","directional miss"],
 trajectory:["trajectory","trajectory"],
 carry_consistency:["carryConsistency","carry consistency"],
 turf_divot:["turf","divot"],
 priorities:["priorities","What matters most?"],
 launch_monitor_detail:["launchMonitorDetail","launch-monitor"],
 review:["ironReview","ironReviewPanel"]
};
const implemented=[],missing=[];
for(const stage of Q){
 const required=hooks[stage.id];
 assert.ok(required,`No implementation hook definition for ${stage.id}`);
 const ok=required.every(token=>src.toLowerCase().includes(token.toLowerCase()));
 (ok?implemented:missing).push(stage.id);
}

// Keep the preview honest until these stages actually exist. When implementation lands,
// move each stage out of this list in the same commit; CI then proves contract/UI convergence.
const explicitlyDeferred=["current_irons","current_set_makeup","ability_band","strike_consistency","carry_consistency","turf_divot","launch_monitor_detail"];
assert.deepEqual(missing,explicitlyDeferred,"Questionnaire implementation changed; update the explicit deferred-stage contract intentionally");
assert.ok(implemented.includes("handedness")&&implemented.includes("brand_scope")&&implemented.includes("review"));
console.log("PASS iron questionnaire implementation coverage",{implemented,explicitlyDeferred});
