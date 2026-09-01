// FORM 10.48 — handedness-aware directional calibration.
// Hook/slice are already golfer-relative. Straight-left / straight-right are physical directions,
// so they must be normalized by handedness before directional head-bias scoring.
// This does not use the golfer's current club and does not change the recorded interview answer.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_HANDEDNESS_CALIBRATION_V148)return true;
  const ENG=window.FORM_DRIVER_ENGINE_V80;
  if(!ENG||typeof ENG.scoreOne!=='function'||typeof ENG.currentScore!=='function')return false;
  const priorScore=ENG.scoreOne.bind(ENG),priorCurrent=ENG.currentScore.bind(ENG);
  function normalizedCostly(g){
    if(!g||!['left','right'].includes(g.costly))return g;
    const hand=String(g.handed||'right').toLowerCase();
    const isLeftHanded=hand==='left'||hand==='l';
    // Draw-side miss: RH physical left, LH physical right. Fade-side is the opposite.
    const drawSide=isLeftHanded?g.costly==='right':g.costly==='left';
    return {...g,costly:drawSide?'hook':'slice',physicalCostly:g.costly,costlyNormalizedForHandedness:true};
  }
  ENG.scoreOne=function(p,g){return priorScore(p,normalizedCostly(g));};
  ENG.currentScore=function(g){return priorCurrent(normalizedCostly(g));};
  if(typeof window.driverScoreV43==='function')window.driverScoreV43=(p,g)=>ENG.scoreOne(p,g);
  if(typeof window.driverRankV43==='function')window.driverRankV43=g=>ENG.winners(g);
  if(typeof window.currentDriverScoreV43==='function')window.currentDriverScoreV43=g=>ENG.currentScore(g).score??75;
  window.FORM_DRIVER_HANDEDNESS_CALIBRATION_V148={version:'10.48',normalizedCostly,priorScore,priorCurrent};
  return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>240)clearInterval(t);},50);
})();
