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
const right=rows.find(x=>x.profile==="right_miss").top.map(x=>x.model).join("|");
const left=rows.find(x=>x.profile==="left_miss").top.map(x=>x.model).join("|");
assert.notEqual(right,left,"Opposite directional misses produced identical top-five ordering");
const high=rows.find(x=>x.profile==="high_face").top;
const control=rows.find(x=>x.profile==="control150").top;
assert.deepEqual(high.map(x=>x.model),control.map(x=>x.model),"High-face profile gained invented model-specific differentiation");
console.log(JSON.stringify({rows,wins,leaderWins,profiles:profiles.length},null,2));
