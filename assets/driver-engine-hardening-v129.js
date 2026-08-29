// FORM 10.32 — scoring-boundary input integrity hardening.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_ENGINE_HARDENING_V132)return true;
  const ENG=window.FORM_DRIVER_ENGINE_V80;
  if(!ENG||typeof state==='undefined')return false;
  const MID={speed:{under75:72,'75-84':80,'85-89':87,'90-94':92,'95-99':97,'100-104':102,'105-109':107,'110-114':112,'115plus':118},ballSpeed:{under120:115,'120-129':125,'130-139':135,'140-149':145,'150-159':155,'160-169':165,'170plus':175},carry:{under180:170,'180-199':190,'200-219':210,'220-239':230,'240-259':250,'260-279':270,'280plus':290}};
  function value(id){
    const m=state?.metrics?.[id];if(!m||m.mode==='unknown'||m.value==null)return null;
    if(m.mode==='exact'){const n=Number(m.value);return Number.isFinite(n)?n:null;}
    return MID[id]?.[m.value]??null;
  }
  function classify(id){
    const m=state?.metrics?.[id];if(!m||m.mode==='unknown'||m.value==null)return null;
    if(id==='launch'){
      if(m.mode==='exact'){const n=Number(m.value);if(!Number.isFinite(n))return null;return n<11?'low':n>17?'high':'mid';}
      if(['under8','8-10','10-12','verylow','low'].includes(m.value))return'low';
      if(['16-18','18-20','20plus','high','veryhigh'].includes(m.value))return'high';
      return m.value==='varies'?'varies':'mid';
    }
    if(id==='spin'){
      if(m.mode==='exact'){const n=Number(m.value);if(!Number.isFinite(n))return null;return n<2100?'low':n>3000?'high':'mid';}
      if(['under1500','1500-1749','1750-1999','2000-2249','verylow','low'].includes(m.value))return'low';
      if(['3000-3499','3500plus','high','veryhigh'].includes(m.value))return'high';
      return m.value==='varies'?'varies':'mid';
    }
    return null;
  }
  function integrity(){
    const speed=value('speed'),ball=value('ballSpeed'),carry=value('carry'),notes=[],exclude=[];
    if(speed&&ball){
      const smash=ball/speed,rangeish=state.metrics?.speed?.mode!=='exact'||state.metrics?.ballSpeed?.mode!=='exact';
      const lo=rangeish?1.10:1.15,hi=rangeish?1.60:1.55;
      if(smash<lo||smash>hi){exclude.push('ballSpeed');notes.push(`Ball speed was ignored because the supplied club-speed/ball-speed relationship (${smash.toFixed(2)}) is not credible enough to use in the fit.`);}
    }
    if(speed&&carry){
      const ypm=carry/speed,rangeish=state.metrics?.speed?.mode!=='exact'||state.metrics?.carry?.mode!=='exact';
      const lo=rangeish?1.35:1.45,hi=rangeish?3.25:3.15;
      if(ypm<lo||ypm>hi){exclude.push('carry');notes.push('Carry was ignored because it conflicts materially with the supplied club speed.');}
    }
    const launch=classify('launch'),spin=classify('spin');
    if((launch==='low'&&spin==='high')||(launch==='high'&&spin==='low'))notes.push('Launch and spin point in competing fitting directions, so configuration should be validated rather than treated as a one-variable loft fix.');
    return {status:exclude.length?'adjusted':notes.length?'review':'passed',exclude:[...new Set(exclude)],notes,launchClass:launch,spinClass:spin};
  }
  function withIntegrity(fn){
    const check=integrity(),saved={};
    try{
      check.exclude.forEach(id=>{if(state.metrics?.[id]){saved[id]=state.metrics[id];state.metrics[id]={mode:'unknown',value:null};}});
      const out=fn();
      if(out&&typeof out==='object')try{Object.defineProperty(out,'inputIntegrity',{value:check,enumerable:true,configurable:true});}catch(e){}
      return out;
    }finally{Object.keys(saved).forEach(id=>state.metrics[id]=saved[id]);}
  }
  const original=window.FORM_DRIVER_ENGINE_HARDENING_V129?.original||{scoreOne:ENG.scoreOne,winners:ENG.winners,currentScore:ENG.currentScore};
  if(typeof original.scoreOne==='function')ENG.scoreOne=(p,g)=>withIntegrity(()=>original.scoreOne(p,g));
  if(typeof original.winners==='function')ENG.winners=g=>withIntegrity(()=>original.winners(g));
  if(typeof original.currentScore==='function')ENG.currentScore=g=>withIntegrity(()=>original.currentScore(g));
  if(typeof window.driverScoreV43==='function')window.driverScoreV43=(p,g)=>ENG.scoreOne(p,g);
  if(typeof window.driverRankV43==='function')window.driverRankV43=g=>ENG.winners(g);
  if(typeof window.currentDriverScoreV43==='function')window.currentDriverScoreV43=g=>ENG.currentScore(g).score??75;
  window.FORM_DRIVER_INPUT_INTEGRITY_V129=integrity;
  window.FORM_DRIVER_INPUT_INTEGRITY_V132=integrity;
  window.FORM_DRIVER_ENGINE_HARDENING_V132={version:'10.32',original};
  return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>200)clearInterval(t)},50);
})();
