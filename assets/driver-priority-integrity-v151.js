// FORM 10.51 — priority integrity.
// Absolute head fit should not become less accurate simply because the golfer ranks looks,
// feel or value above performance outcomes. Those are preference/purchase context, not substitute
// performance components. Preserve the user's full ordering, but normalize the three performance
// priorities relative to one another for head-fit scoring.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_PRIORITY_INTEGRITY_V151)return true;
  const ENG=window.FORM_DRIVER_ENGINE_V80;
  if(!ENG||typeof ENG.scoreOne!=='function'||typeof ENG.currentScore!=='function')return false;
  const priorScore=ENG.scoreOne.bind(ENG),priorCurrent=ENG.currentScore.bind(ENG);
  const PERF=['accuracy','distance','flight'];
  function normalize(g){
    if(!g?.ranks)return {g,meta:null};
    const original={...g.ranks};
    const ordered=PERF.slice().sort((a,b)=>(Number(original[a])||99)-(Number(original[b])||99)||PERF.indexOf(a)-PERF.indexOf(b));
    const ranks={...original};ordered.forEach((k,i)=>ranks[k]=i+1);
    return {g:{...g,ranks},meta:{originalPerformanceRanks:Object.fromEntries(PERF.map(k=>[k,original[k]])),normalizedPerformanceRanks:Object.fromEntries(PERF.map(k=>[k,ranks[k]])),order:ordered}};
  }
  function annotate(out,meta){if(!out||!meta||typeof out!=='object')return out;return {...out,priorityIntegrity:{version:'10.51',...meta,note:'Performance priorities are weighted relative to each other. Feel, looks and value remain separate preference/purchase context and do not dilute absolute head-fit scoring.'}};}
  ENG.scoreOne=function(p,g){const n=normalize(g);return annotate(priorScore(p,n.g),n.meta);};
  ENG.currentScore=function(g){const n=normalize(g),out=priorCurrent(n.g);if(!out)return out;const detail=annotate(out.detail,n.meta);return {...out,score:detail?.overall??out.score,detail,priorityIntegrity:detail?.priorityIntegrity};};
  if(typeof window.driverScoreV43==='function')window.driverScoreV43=(p,g)=>ENG.scoreOne(p,g);
  if(typeof window.driverRankV43==='function')window.driverRankV43=g=>ENG.winners(g);
  if(typeof window.currentDriverScoreV43==='function')window.currentDriverScoreV43=g=>ENG.currentScore(g).score??75;
  window.FORM_DRIVER_PRIORITY_INTEGRITY_V151={version:'10.51',normalize,priorScore,priorCurrent};
  return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>240)clearInterval(t);},50);
})();
