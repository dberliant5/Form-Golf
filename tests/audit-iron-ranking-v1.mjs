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
 {id:"high_face",consistencyNeed:"high",directionNeed:"normal",carryNeed:"met",targetCarryYd:150,flight:"adequate",strike:"high_center"}
];
function rank(p){return D.map(c=>({model:c.model,...ironFitScoreV1(p,c)})).filter(x=>x.confidence>0).sort((a,b)=>b.score-a.score);}
const rows=profiles.map(p=>({profile:p.id,top:rank(p).slice(0,5)}));
const wins={}; for(const r of rows){const m=r.top[0]?.model;if(m)wins[m]=(wins[m]||0)+1;}
const leaderWins=Math.max(0,...Object.values(wins));
assert.ok(Object.keys(wins).length>=2,"Opposed profiles collapsed to one universal winner");
assert.ok(leaderWins<profiles.length,"One model won every opposed profile");

// Directional evidence is currently sparse in the matrix. Do not require the full-field
// top five to reorder merely because most leaders have no measured axis value. Instead,
// require the measured directional subset itself to respond correctly; missing axis stays neutral.
const axis=D.filter(c=>Number.isFinite(c.axisDeg));
assert.ok(axis.length>=2,"Directional audit needs at least two measured-axis heads");
const rightP=profiles.find(x=>x.id==="right_miss"), leftP=profiles.find(x=>x.id==="left_miss");
const axisRank=p=>axis.map(c=>({model:c.model,axisDeg:c.axisDeg,...ironFitScoreV1(p,c)})).sort((a,b)=>b.score-a.score);
const rightAxis=axisRank(rightP), leftAxis=axisRank(leftP);
assert.notEqual(rightAxis[0].model,leftAxis[0].model,"Measured directional subset did not respond to opposite misses");
const drawHead=axis.find(c=>c.axisDeg<0), fadeHead=axis.find(c=>c.axisDeg>0);
assert.ok(drawHead&&fadeHead,"Directional audit needs measured draw- and fade-biased heads");
assert.ok(ironFitScoreV1(rightP,drawHead).score>ironFitScoreV1(rightP,fadeHead).score,"Right-miss profile failed to prefer measured draw bias in controlled comparison");
assert.ok(ironFitScoreV1(leftP,fadeHead).score>ironFitScoreV1(leftP,drawHead).score,"Left-miss profile failed to prefer measured fade bias in controlled comparison");

const high=rows.find(x=>x.profile==="high_face").top;
const control=rows.find(x=>x.profile==="control150").top;
assert.deepEqual(high.map(x=>x.model),control.map(x=>x.model),"High-face profile gained invented model-specific differentiation");
console.log(JSON.stringify({rows,wins,leaderWins,profiles:profiles.length,directionalMeasured:axis.length,rightAxis:rightAxis.slice(0,3),leftAxis:leftAxis.slice(0,3)},null,2));
