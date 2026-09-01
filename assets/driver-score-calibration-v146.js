// FORM 10.46 — score calibration for overlapping signals and weak evidence.
// Absolute FORM Fit Score remains independent of the golfer's current club.
// This layer reduces double-counting of off-center strike retention and compresses
// model separation when the underlying component evidence is weak.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_SCORE_CALIBRATION_V146)return true;
  const ENG=window.FORM_DRIVER_ENGINE_V80;
  if(!ENG||typeof ENG.scoreOne!=='function'||typeof ENG.currentScore!=='function'||typeof state==='undefined')return false;
  const priorScore=ENG.scoreOne.bind(ENG),priorCurrent=ENG.currentScore.bind(ENG);
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const r1=v=>Math.round(v*10)/10;
  const answered=v=>v!==null&&v!==undefined&&v!==''&&v!=='unknown';
  function metric(id){return state?.metrics?.[id]||{mode:'unknown',value:null};}
  function hasUsableSpeedPair(){
    const s=metric('speed'),b=metric('ballSpeed');
    return answered(s.value)&&answered(b.value)&&s.mode!=='unknown'&&b.mode!=='unknown';
  }
  function evidenceFactor(c){
    const conf=clamp(Number(c)||0,0,1);
    // High-confidence components are essentially untouched. Thin evidence is pulled
    // toward neutral so modeled distinctions cannot create laboratory-looking gaps.
    return clamp(.72+.45*conf,.78,1);
  }
  function calibrate(detail,g){
    if(!detail||!Array.isArray(detail.components)||detail.hardConstraints?.length)return detail;
    const offCenter=['toe','heel','varied'].includes(g?.strike);
    const speedPair=hasUsableSpeedPair();
    const parts=detail.components.map(x=>{
      let weight=Number(x.weight)||0;
      let overlapAdjusted=false;
      if(x.key==='efficiency'&&offCenter){
        // Strike protection and efficiency both use toe/heel retention evidence. When no
        // club-speed/ball-speed relationship is supplied, efficiency is supporting evidence,
        // not a second full-strength vote for the same off-center pattern.
        const multiplier=speedPair?.85:.50;
        weight*=multiplier;overlapAdjusted=true;
      }
      const factor=evidenceFactor(x.evidenceConfidence);
      const score=r1(80+(Number(x.score||80)-80)*factor);
      return {...x,weight:r1(weight),score,evidenceCalibration:r1(factor),overlapAdjusted};
    });
    const totalW=parts.reduce((a,x)=>a+x.weight,0)||1;
    const base=parts.reduce((a,x)=>a+x.score*x.weight,0)/totalW;
    const evidenceQ=parts.reduce((a,x)=>a+(Number(x.evidenceConfidence)||0)*x.weight,0)/totalW;
    const neutralPull=(1-evidenceQ)*3.5;
    const adjusted=base>82?base-neutralPull:base;
    const overall=r1(clamp(100-(100-adjusted)*1.22,45,99.2));
    const components=parts.map(x=>({...x,normalizedWeight:r1(x.weight/totalW*100),impact:r1((x.score-80)*x.weight/totalW)}));
    const strengths=components.slice().sort((a,b)=>b.impact-a.impact),weaknesses=components.slice().sort((a,b)=>a.impact-b.impact);
    return {...detail,overall,raw:r1(base),evidenceQuality:r1(evidenceQ),components,strengths,weaknesses,scoreCalibration:{version:'10.46',offCenterOverlapAdjusted:offCenter,measuredEfficiencySupport:speedPair}};
  }
  ENG.scoreOne=function(p,g){return calibrate(priorScore(p,g),g);};
  ENG.currentScore=function(g){
    const cur=priorCurrent(g);if(!cur||cur.score==null||!cur.detail)return cur;
    const detail=calibrate(cur.detail,g);return {...cur,score:detail.overall,detail};
  };
  if(typeof window.driverScoreV43==='function')window.driverScoreV43=(p,g)=>ENG.scoreOne(p,g);
  if(typeof window.driverRankV43==='function')window.driverRankV43=g=>ENG.winners(g);
  if(typeof window.currentDriverScoreV43==='function')window.currentDriverScoreV43=g=>ENG.currentScore(g).score??75;
  window.FORM_DRIVER_SCORE_CALIBRATION_V146={version:'10.46',calibrate,evidenceFactor,priorScore,priorCurrent};
  return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>240)clearInterval(t);},50);
})();
