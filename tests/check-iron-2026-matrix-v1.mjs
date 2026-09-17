import assert from "node:assert/strict";
import {IRON_2026_MATRIX_V1 as D,MATRIX_RULES_V1 as R} from "./iron-2026-matrix-v1.mjs";
assert.equal(new Set(D.map(x=>x.model)).size,D.length);
assert.equal(D.filter(x=>x.category==="players").length,10);
assert.equal(D.filter(x=>x.category==="players_distance").length,7);
assert.equal(D.filter(x=>x.category==="super_gi").length,4);
assert.equal(D.filter(x=>x.category==="game_improvement").length,8);
assert.equal(R.expectedFieldSize,30);
assert.equal(R.verifiedIdentityRows,D.length);
assert.equal(D.length,29,"Do not silently claim the 30-head field is complete until the ninth GI identity is directly verified");
assert.ok(R.identityGap.includes("do not guess"));
assert.equal(R.rankingAllowed,false);
assert.equal(R.nullMeans,"not_yet_verified_not_zero");
assert.equal(R.lateralWidthCanonicalUnit,"yards");
assert.ok(D.filter(x=>Number.isFinite(x.lateralWidthYd)).every(x=>x.lateralWidthUnit==="yards"));
const metricFields=["carryYd","dispersion95SqFt","lateralWidthYd","axisDeg","descentDeg"];
for(const row of D){
 assert.ok(row.provenance?.metricSource,"Every row must expose field-level provenance metadata");
 for(const field of metricFields){
  if(Number.isFinite(row[field])) assert.ok(row.provenance.metricSource[field],`${row.model} ${field} lacks field-level provenance`);
  else assert.equal(row.provenance.metricSource[field],undefined,`${row.model} ${field} must not cite evidence for missing data`);
 }
}
const pxg=D.find(x=>x.model==="PXG 0311XP Gen 8"), ping=D.find(x=>x.model==="Ping i240");
assert.ok(pxg.carryYd>ping.carryYd && pxg.dispersion95SqFt>ping.dispersion95SqFt*2);
assert.equal(ping.lateralWidthYd,4.58);
const knownDisp=D.filter(x=>Number.isFinite(x.dispersion95SqFt));
assert.equal(knownDisp.sort((a,b)=>a.dispersion95SqFt-b.dispersion95SqFt)[0].model,"Callaway Quantum Max OS");
console.log("PASS iron matrix integrity",D.length,"verified/partial rows; field-level provenance gated; 30-head identity field remains fail-closed");
