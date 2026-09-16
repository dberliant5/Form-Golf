import {IRON_2026_MATRIX_V1 as D} from "./iron-2026-matrix-v1.mjs";
import {ironFitScoreV1} from "./iron-fit-scorer-v1.mjs";

const profiles=[
 {id:"control150",consistencyNeed:"high",carryNeed:"met",targetCarryYd:150,flight:"adequate"},
 {id:"control145",consistencyNeed:"high",carryNeed:"met",targetCarryYd:145,flight:"adequate"},
 {id:"distance158",consistencyNeed:"normal",carryNeed:"high",targetCarryYd:158,flight:"adequate"},
 {id:"distance150",consistencyNeed:"normal",carryNeed:"high",targetCarryYd:150,flight:"adequate"}
];
const rows=profiles.map(p=>{
 const ranked=D.map(c=>({model:c.model,...ironFitScoreV1(p,c)}))
  .filter(x=>x.confidence>0).sort((a,b)=>b.score-a.score);
 return {profile:p.id,top:ranked.slice(0,5)};
});
const wins={};
for(const r of rows){const m=r.top[0]?.model;if(m)wins[m]=(wins[m]||0)+1;}
console.log(JSON.stringify({rows,wins},null,2));
