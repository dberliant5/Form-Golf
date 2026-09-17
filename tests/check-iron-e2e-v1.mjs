import assert from "node:assert/strict";
import {buildIronProfileV1,rankIronsV1} from "../assets/iron-engine-v1.mjs";
const base={brandMode:"all",brands:[],sevenIron:150,priorities:["dispersion"],direction:"none",trajectory:"good",strike:"mid_center"};
const a=rankIronsV1(base); assert.ok(a.length>10); assert.ok(a[0].model);
const pxg=rankIronsV1({...base,priorities:["distance"],sevenIron:163}); assert.ok(pxg[0].model);
const pingOnly=rankIronsV1({...base,brandMode:"choose",brands:["PING"]}); assert.ok(pingOnly.length>0&&pingOnly.every(x=>/^ping /i.test(x.model)));
const right=rankIronsV1({...base,direction:"right"}),left=rankIronsV1({...base,direction:"left"});
assert.ok(right.length&&left.length);

// Every questionnaire answer that is currently presented as fitting-relevant must either
// change the scoring profile or be explicitly documented as context-only until evidence exists.
const profile=buildIronProfileV1(base);
assert.equal(profile.targetCarryYd,150);
assert.equal(profile.consistencyNeed,"high");
assert.equal(profile.directionNeed,"high");
assert.equal(profile.directionMiss,null);
assert.equal(profile.flight,"adequate");
assert.equal(profile.strike,"mid_center");
assert.equal(buildIronProfileV1({...base,sevenIron:160}).targetCarryYd,160);
assert.equal(buildIronProfileV1({...base,priorities:["distance"]}).carryNeed,"high");
assert.equal(buildIronProfileV1({...base,direction:"right"}).directionMiss,"right");
assert.equal(buildIronProfileV1({...base,trajectory:"too_low"}).flight,"too_low");
assert.equal(buildIronProfileV1({...base,strike:"high_toe"}).strike,"high_toe");

// These contracted questionnaire stages are not yet wired into the engine. Keep that gap explicit
// so UI expansion cannot imply false personalization before the engine has a defensible use for them.
const notYetScoring=["currentIrons","currentSetMakeup","ability","strikeConsistency","carryConsistency","turf","launchMonitorDetail"];
for(const field of notYetScoring){
 const changed=buildIronProfileV1({...base,[field]:"sentinel"});
 assert.deepEqual(changed,profile,`${field} unexpectedly changed fit before an evidence-backed rule was added`);
}

console.log("PASS iron profile-to-ranking e2e",{control:a.slice(0,3).map(x=>x.model),distance:pxg.slice(0,3).map(x=>x.model),ping:pingOnly.map(x=>x.model),contextOnly:notYetScoring});
