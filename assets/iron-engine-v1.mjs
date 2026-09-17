import {IRON_2026_MATRIX_V1 as DATA} from "../tests/iron-2026-matrix-v1.mjs";
import {ironFitScoreV1} from "../tests/iron-fit-scorer-v1.mjs";

export function buildIronProfileV1(state){
 const carry=Number(state.sevenIron)||null;
 const priority=state.priorities||[];
 return {
  targetCarryYd:carry,
  carryNeed:priority.includes("distance")?"high":"met",
  consistencyNeed:(priority.includes("dispersion")||priority.includes("forgiveness"))?"high":"normal",
  directionNeed:priority.includes("dispersion")?"high":"normal",
  directionMiss:state.direction==="none"||state.direction==="both"?null:state.direction,
  flight:state.trajectory==="too_low"?"too_low":"adequate",
  strike:state.strike||null
 };
}
export function rankIronsV1(state){
 const p=buildIronProfileV1(state);
 const allowed=new Set(state.brands||[]);
 const brandOf=model=>{
  if(/^ping\b/i.test(model))return "PING";
  if(/^taylormade\b/i.test(model))return "TaylorMade";
  return model.split(" ")[0];
 };
 return DATA.filter(c=>state.brandMode!=="choose"||allowed.has(brandOf(c.model)))
  .map(c=>({...c,...ironFitScoreV1(p,c)}))
  .sort((a,b)=>b.score-a.score);
}
