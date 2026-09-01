// FORM 10.49 — strike-location reliability calibration.
// Ball-flight observations are generally more reliable than self-reported horizontal strike location.
// When a precise heel/toe report conflicts with the golfer's reported curvature/costly miss,
// FORM does not infer the opposite strike. It simply removes the unreliable strike-side claim from scoring.
// Absolute FORM Fit Score remains independent of the golfer's current club.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_STRIKE_RELIABILITY_V149)return true;
  const ENG=window.FORM_DRIVER_ENGINE_V80;
  if(!ENG||typeof ENG.scoreOne!=='function'||typeof ENG.currentScore!=='function')return false;
  const priorScore=ENG.scoreOne.bind(ENG),priorCurrent=ENG.currentScore.bind(ENG);

  function curveSide(g){
    const c=String(g?.curve||'').toLowerCase();
    const cls=String(g?.curveClass||'').toLowerCase();
    if(['hook','draw'].includes(c)||cls==='draw_curve')return'draw';
    if(['slice','fade'].includes(c)||cls==='fade_curve')return'fade';
    return null;
  }
  function costlySide(g){
    const c=String(g?.costly||'').toLowerCase();
    if(c==='hook')return'draw';
    if(c==='slice')return'fade';
    // Physical left/right is intentionally not interpreted here. FORM 10.48 normalizes
    // those for handedness later in the scoring chain.
    return null;
  }
  function strikeConflict(g){
    if(!g||!['heel','toe'].includes(g.strike))return null;
    const sides=[curveSide(g),costlySide(g)].filter(Boolean);
    if(!sides.length)return null;
    const drawVotes=sides.filter(x=>x==='draw').length,fadeVotes=sides.filter(x=>x==='fade').length;
    if(drawVotes===fadeVotes)return null; // ball-flight evidence itself is conflicted; do not overrule strike from it.
    const dominant=drawVotes>fadeVotes?'draw':'fade';
    // Horizontal gear-effect expectation: heel tends fade-side curvature; toe tends draw-side curvature.
    const conflicts=(g.strike==='heel'&&dominant==='draw')||(g.strike==='toe'&&dominant==='fade');
    if(!conflicts)return null;
    return {reportedStrike:g.strike,ballFlightSide:dominant,reason:`Reported ${g.strike} contact conflicts with the reported ${dominant==='draw'?'draw/hook':'fade/slice'} ball-flight pattern.`};
  }
  function reliabilityAdjustedGolfer(g){
    const conflict=strikeConflict(g);if(!conflict)return {g,conflict:null};
    // Do not guess the opposite strike and do not convert to "varied" because that would
    // incorrectly signal a two-way pattern. Treat precise strike location as unknown.
    return {g:{...g,strike:'unknown',reportedStrike:g.strike,strikeReliability:'discounted'},conflict};
  }
  function annotate(out,conflict){
    if(!out||!conflict||typeof out!=='object')return out;
    const note='FORM discounted your reported strike location because it conflicts with the ball-flight pattern. Ball flight was given more weight; FORM did not assume the opposite strike.';
    return {...out,strikeReliability:{status:'discounted',...conflict,note}};
  }
  ENG.scoreOne=function(p,g){const a=reliabilityAdjustedGolfer(g);return annotate(priorScore(p,a.g),a.conflict);};
  ENG.currentScore=function(g){const a=reliabilityAdjustedGolfer(g),out=priorCurrent(a.g);if(!a.conflict||!out)return out;const detail=annotate(out.detail,a.conflict);return {...out,detail,strikeReliability:detail?.strikeReliability};};
  if(typeof window.driverScoreV43==='function')window.driverScoreV43=(p,g)=>ENG.scoreOne(p,g);
  if(typeof window.driverRankV43==='function')window.driverRankV43=g=>ENG.winners(g);
  if(typeof window.currentDriverScoreV43==='function')window.currentDriverScoreV43=g=>ENG.currentScore(g).score??75;
  window.FORM_DRIVER_STRIKE_RELIABILITY_V149={version:'10.49',strikeConflict,reliabilityAdjustedGolfer,priorScore,priorCurrent};
  return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>240)clearInterval(t);},50);
})();
