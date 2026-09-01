// FORM 10.67 — fitting-summary language must honor strike-side reliability.
// The score may know contact is off-center while remaining uncertain whether heel or toe is the
// repeatable side. "What FORM sees" should never sound more certain than the scoring model.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_PROFILE_INSIGHT_RELIABILITY_V167)return true;
  const V81=window.FORM_DRIVER_CONFIG_V81,ENG=window.FORM_DRIVER_ENGINE_V80;
  if(!V81||!ENG||typeof V81.profileInsight!=='function'||typeof ENG.winners!=='function')return false;
  const prior=V81.profileInsight.bind(V81);
  function reliabilityFor(g){
    try{return ENG.winners(g)?.[0]?.s?.strikeReliability||null}catch(e){return null}
  }
  function strikeSentence(g,sr){
    if(!['heel','toe'].includes(g?.strike))return null;
    const side=g.strike==='heel'?'heel':'toe',w=Number(sr?.sideWeight);
    if(!sr||!Number.isFinite(w))return null;
    if(w>=99.9)return side==='heel'?'Confirmed heel-side contact makes heel-side retention and directional stability especially relevant.':'Confirmed toe-side contact makes toe-side speed retention and stability especially relevant.';
    if(w>=60)return `You repeatedly report ${side}-side contact, so FORM uses it as a directional clue while still treating general off-center stability as the more reliable need.`;
    if(sr.conflict)return `FORM sees reliable evidence that contact is off-center, but your reported ${side}-side strike conflicts with the observed ball-flight pattern. Forgiveness and speed retention remain important; heel-vs-toe specificity is deliberately de-emphasized.`;
    return `FORM sees off-center contact as meaningful, but the reported ${side}-side location is not strongly verified. The fit therefore emphasizes broad mishit stability more than heel-vs-toe specialization.`;
  }
  V81.profileInsight=function(g){
    let bits=prior(g)||[],sr=reliabilityFor(g),replacement=strikeSentence(g,sr);
    if(replacement){
      bits=bits.filter(function(x){return !/Heel contact|Toe contact|heel-side|toe-side/i.test(String(x));});
      bits.push(replacement);
    }
    return bits.slice(0,2);
  };
  window.FORM_DRIVER_PROFILE_INSIGHT_RELIABILITY_V167={version:'10.67',prior:prior,reliabilityFor:reliabilityFor};
  return true;
}
let n=0,t=setInterval(function(){n++;if(init()||n>240)clearInterval(t);},50);
})();
