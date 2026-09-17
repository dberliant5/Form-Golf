import assert from "node:assert/strict";
import {IRON_2026_MATRIX_V1 as D} from "./iron-2026-matrix-v1.mjs";
import {ironFitScoreV1} from "./iron-fit-scorer-v1.mjs";

const profiles=[
 {id:"control150",consistencyNeed:"high",directionNeed:"high",carryNeed:"met",targetCarryYd:150,flight:"adequate"},
 {id:"control145",consistencyNeed:"high",directionNeed:"high",carryNeed:"met",targetCarryYd:145,flight:"adequate"},
 {id:"distance158",consistencyNeed:"normal",directionNeed:"normal",carryNeed:"high",targetCarryYd:158,flight:"adequate"},
 {id:"distance150",consistencyNeed:"normal",directionNeed:"normal",carryNeed:"high",targetCarryYd:150,flight:"adequate"},
 {id:"right_miss",consistencyNeed:"normal",directionNeed:"high",carryNeed:"met",targetCarryYd:150,flight:"adequate",directionMiss:"right"},
 {id:"left_miss",consistencyNeed:"normal",directionNeed:"high",carryNeed:"met",targetCarryYd:150,flight:"adequate",directionMiss:"left"},
 {id:"low_flight",consistencyNeed:"normal",directionNeed:"normal",carryNeed:"met",targetCarryYd:150,flight:"too_low"},
 {id:"toe_miss",consistencyNeed:"high",directionNeed:"normal",carryNeed:"met",targetCarryYd:150,flight:"adequate",strike:"mid_toe"},
 {id:"low_toe_miss",consistencyNeed:"high",directionNeed:"normal",carryNeed:"met",targetCarryYd:150,flight:"adequate",strike:"low_toe"},
 {id:"high_face",consistencyNeed:"high",directionNeed:"high",carryNeed:"met",targetCarryYd:150,flight:"adequate",strike:"high_center"}
];
function rank(p){return D.map(c=>({model:c.model,...ironFitScoreV1(p,c)})).filter(x=>x.confidence>0).sort((a,b)=>b.score-a.score);}
const rows=profiles.map(p=>({profile:p.id,top:rank(p).slice(0,5)}));
const wins={}; for(const r of rows){const m=r.top[0]?.model;if(m)wins[m]=(wins[m]||0)+1;}
const leaderWins=Math.max(0,...Object.values(wins));
assert.ok(Object.keys(wins).length>=2,"Opposed profiles collapsed to one universal winner");
assert.ok(leaderWins<profiles.length,"One model won every opposed profile");

// Directional evidence is sparse. Audit the directional term itself rather than asking
// unequal real heads (with different carry/dispersion coverage) to reverse overall rank.
const axis=D.filter(c=>Number.isFinite(c.axisDeg));
assert.ok(axis.length>=2,"Directional audit needs at least two measured-axis heads");
const rightP=profiles.find(x=>x.id==="right_miss"), leftP=profiles.find(x=>x.id==="left_miss");
const axisRank=p=>axis.map(c=>({model:c.model,axisDeg:c.axisDeg,...ironFitScoreV1(p,c)})).sort((a,b)=>b.score-a.score);
const rightAxis=axisRank(rightP), leftAxis=axisRank(leftP);
const drawHead=axis.find(c=>c.axisDeg<0), fadeHead=axis.find(c=>c.axisDeg>0);
assert.ok(drawHead&&fadeHead,"Directional audit needs measured draw- and fade-biased heads");
const controlled=(axisDeg,p)=>ironFitScoreV1(p,{axisDeg}).score;
assert.ok(controlled(drawHead.axisDeg,rightP)>controlled(fadeHead.axisDeg,rightP),"Right-miss directional term failed to prefer measured draw bias");
assert.ok(controlled(fadeHead.axisDeg,leftP)>controlled(drawHead.axisDeg,leftP),"Left-miss directional term failed to prefer measured fade bias");
assert.equal(controlled(drawHead.axisDeg,{...rightP,directionMiss:null}),controlled(fadeHead.axisDeg,{...rightP,directionMiss:null}),"Measured axis affected fit without a repeatable directional miss");

// High-face is captured as context, but the common robot protocol has no high-face zone.
// Therefore adding only a high-face strike answer must be score-neutral model by model.
// Compare identical profiles except strike so unrelated profile dimensions cannot create false failures.
const highP=profiles.find(x=>x.id==="high_face");
const highControl={...highP,strike:null,id:"high_face_control"};
for(const club of D){
 const a=ironFitScoreV1(highP,club), b=ironFitScoreV1(highControl,club);
 assert.equal(a.score,b.score,`${club.model} gained invented high-face fit differentiation`);
 assert.equal(a.confidence,b.confidence,`${club.model} gained invented high-face evidence confidence`);
}
assert.deepEqual(rank(highP).map(x=>x.model),rank(highControl).map(x=>x.model),"High-face answer changed ranking without measured high-face evidence");
console.log(JSON.stringify({rows,wins,leaderWins,profiles:profiles.length,directionalMeasured:axis.length,rightAxis:rightAxis.slice(0,3),leftAxis:leftAxis.slice(0,3),highFaceNeutral:true},null,2));
