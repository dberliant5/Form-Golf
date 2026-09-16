import {IRON_SCORING_GUARDRAILS_V1 as G} from "./iron-archetypes-v1.mjs";

/* Test-only scaffold. No model names, brands, categories or commercial fields enter scoring. */
export function ironFitScoreV1(profile, club){
  let score=50, used=0;
  const add=(v,w=1)=>{ if(Number.isFinite(v)){score+=v*w;used+=w;} };

  // Dispersion: bounded benefit. Smaller is better, but cannot alone create a universal winner.
  if(Number.isFinite(club.dispersion95SqFt)){
    const d=Math.max(85,Math.min(380,club.dispersion95SqFt));
    add((230-d)/145*10, profile.consistencyNeed==="high"?1.35:1);
  }

  // Carry is target-based only. Reward closing a stated deficit, never absolute length.
  if(Number.isFinite(club.carryYd) && Number.isFinite(profile.targetCarryYd)){
    const err=Math.abs(club.carryYd-profile.targetCarryYd);
    add(Math.max(-6,6-err*.75), profile.carryNeed==="high"?1:0.55);
  }

  // Lateral dispersion is distinct from total ellipse area. Reward narrow left/right patterns
  // when direction control matters, without double-counting it as another universal forgiveness score.
  if(Number.isFinite(club.lateralWidthYd)){
    const lw=Math.max(4.5,Math.min(12,club.lateralWidthYd));
    add((8-lw)/3.5*3, profile.directionNeed==="high"?1.25:0.55);
  }

  // Measured head-induced axis can interact with a repeatable directional miss.
  // Positive = fade-biased, negative = draw-biased in the common protocol.
  if(Number.isFinite(club.axisDeg) && profile.directionMiss){
    const wanted=profile.directionMiss==="right" ? -1 : profile.directionMiss==="left" ? 1 : 0;
    if(wanted) add(Math.max(-3,Math.min(3,(-Math.abs(club.axisDeg-wanted*2)+2)*1.2)),0.8);
  }

  // Landing suitability is a floor/window, not monotonic.
  if(Number.isFinite(club.descentDeg)){
    const floor=profile.flight==="too_low"?45:43;
    add(club.descentDeg>=floor?4:-Math.min(7,(floor-club.descentDeg)*2.2),1);
  }

  // Exact strike evidence only. No inferred high-face performance.
  if(profile.strike && club.zoneCarry && Number.isFinite(club.zoneCarry[profile.strike])){
    const vals=Object.values(club.zoneCarry).filter(Number.isFinite);
    const best=Math.max(...vals), selected=club.zoneCarry[profile.strike];
    add(-Math.min(8,(best-selected)*.45),1.2);
  }

  const confidence=Math.min(1,used/4.5);
  return {score:+score.toFixed(2),confidence:+confidence.toFixed(2)};
}
export const guardrails=G;
