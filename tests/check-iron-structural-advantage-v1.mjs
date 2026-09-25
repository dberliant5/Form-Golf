import assert from "node:assert/strict";
import {IRON_2026_MATRIX_V1 as D} from "./iron-2026-matrix-v1.mjs";
import {ironFitScoreV1} from "./iron-fit-scorer-v1.mjs";
const q=D.find(x=>x.model==="Callaway Quantum Max OS");
const p=D.find(x=>x.model==="Ping i240");
assert.equal(q.dispersion95SqFt,85.4); assert.equal(p.lateralWidthYd,4.58);
const sparse=ironFitScoreV1({consistencyNeed:"high",targetCarryYd:150},q);
const fuller=ironFitScoreV1({consistencyNeed:"high",targetCarryYd:150},p);
assert.ok(sparse.score>fuller.score,"expected raw dispersion leader to score higher on available fit dimensions");
assert.ok(sparse.confidence<fuller.confidence,"coverage advantage bug: sparse leader must carry lower confidence");
const categoryMeans=Object.groupBy(D,x=>x.category);
for(const [cat,xs] of Object.entries(categoryMeans)){
 const vals=xs.map(x=>x.dispersion95SqFt).filter(Number.isFinite);
 if(vals.length) console.log(cat,"dispersion n",vals.length,"mean",+(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1));
}
console.log("PASS iron structural-advantage gate: fit and confidence remain separate");
