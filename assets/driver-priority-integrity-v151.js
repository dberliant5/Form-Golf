// FORM 14.5 — priority integrity.
// The golfer controls one subjective tradeoff: distance vs accuracy/forgiveness.
// Launch, spin, trajectory and strike physics remain part of the technical fitting layer.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_PRIORITY_INTEGRITY_V151)return true;
  const ENG=window.FORM_DRIVER_ENGINE_V80;
  if(!ENG||typeof ENG.scoreOne!=='function'||typeof ENG.currentScore!=='function')return false;
  const priorScore=ENG.scoreOne.bind(ENG),priorCurrent=ENG.currentScore.bind(ENG);
  function split(){
    const a=Math.max(0,Math.min(100,Number(state?.driverPrioritySplit?.accuracy)||50));
    return {accuracy:a,distance:100-a};
  }
  function annotate(out){
    if(!out||typeof out!=='object')return out;
    const s=split();
    return {...out,priorityIntegrity:{version:'14.5',performancePreference:s,note:'Distance vs accuracy/forgiveness changes the golfer-preference lean. Launch, spin, trajectory, strike and directional requirements remain independently evaluated by FORM.'}};
  }
  ENG.scoreOne=function(p,g){return annotate(priorScore(p,g));};
  ENG.currentScore=function(g){const out=priorCurrent(g);if(!out)return out;const detail=annotate(out.detail);return {...out,score:detail?.overall??out.score,detail,priorityIntegrity:detail?.priorityIntegrity};};
  if(typeof window.driverScoreV43==='function')window.driverScoreV43=(p,g)=>ENG.scoreOne(p,g);
  if(typeof window.driverRankV43==='function')window.driverRankV43=g=>ENG.winners(g);
  if(typeof window.currentDriverScoreV43==='function')window.currentDriverScoreV43=g=>ENG.currentScore(g).score??75;
  window.FORM_DRIVER_PRIORITY_INTEGRITY_V151={version:'14.5',split,priorScore,priorCurrent};
  return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>240)clearInterval(t);},50);
})();
