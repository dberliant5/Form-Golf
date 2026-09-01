// FORM 10.65 — recommendation confidence must reflect strike-source quality.
// Fit Score calibration already reduces heel/toe specificity when strike location is uncertain.
// This layer makes the displayed recommendation confidence honor the same evidence quality
// without changing any driver Fit Score or ranking.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_CONFIDENCE_INPUT_QUALITY_V165)return true;
  const V81=window.FORM_DRIVER_CONFIG_V81;
  if(!V81||typeof V81.recommendationEvidence!=='function')return false;
  const prior=V81.recommendationEvidence.bind(V81);
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const r1=v=>Math.round((Number(v)||0)*10)/10;

  function labelFor(combined,golfer,product){
    let label=combined>=85?'Strong':combined>=72?'Good':combined>=60?'Developing':'Limited';
    if(product<75&&label==='Strong')label='Good';
    if(golfer<70&&['Strong','Good'].includes(label))label='Developing';
    return label;
  }

  function strikeAdjustment(s){
    const sr=s?.strikeReliability,sideWeight=Number(sr?.sideWeight);
    if(!sr||!Number.isFinite(sideWeight)||sideWeight>=99.9)return null;
    // We still know contact is off-center. Only heel-vs-toe specificity is uncertain.
    // Treat the strike answer as 60% general off-center evidence + 40% side-specific evidence.
    const alpha=clamp(sideWeight/100,0,1),effectiveStrikeQuality=.60+.40*alpha;
    // Match the contribution of one qualitative input inside the existing profile-strength model.
    // With no LM data, the four qualitative inputs collectively contribute 25%; with LM data, 58%.
    let noLm=false;try{noLm=!state?.lm||state.lm==='none';}catch(e){}
    const qualitativeShare=noLm?.25:.58;
    const golferPenalty=100*qualitativeShare*.25*(1-effectiveStrikeQuality);
    return {
      sideWeight:r1(sideWeight),
      effectiveStrikeQuality:r1(effectiveStrikeQuality*100),
      golferPenalty:r1(golferPenalty),
      conflict:!!sr.conflict,
      source:sr.source||sr.status||'unverified',
      note:'Confidence is reduced only for uncertain heel-vs-toe specificity; off-center contact remains fully relevant to Fit Score.'
    };
  }

  V81.recommendationEvidence=function(s){
    const base=prior(s),adj=strikeAdjustment(s);if(!adj)return base;
    const golfer=r1(clamp((Number(base.golfer)||0)-adj.golferPenalty,0,100));
    const product=r1(clamp(Number(base.product)||0,0,100));
    const combined=r1(clamp(.58*golfer+.42*product,0,100));
    return {...base,golfer,product,combined,label:labelFor(combined,golfer,product),strikeInputAdjustment:adj};
  };

  window.FORM_DRIVER_CONFIDENCE_INPUT_QUALITY_V165={version:'10.65',prior:prior,strikeAdjustment:strikeAdjustment};
  return true;
}
let n=0,t=setInterval(function(){n++;if(init()||n>240)clearInterval(t);},50);
})();
