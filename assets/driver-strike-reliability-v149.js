// FORM 10.50 — strike-location reliability calibration.
// Ball flight is usually a more reliable observed outcome than an unverified heel/toe diagnosis,
// but gear effect is not the only determinant of curvature. FORM therefore calibrates strike-side
// confidence rather than assuming a conflicting strike report is impossible.
// Absolute FORM Fit Score remains independent of the golfer's current club.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_STRIKE_RELIABILITY_V150)return true;
  const ENG=window.FORM_DRIVER_ENGINE_V80;
  if(!ENG||typeof ENG.scoreOne!=='function'||typeof ENG.currentScore!=='function')return false;
  const priorScore=ENG.scoreOne.bind(ENG),priorCurrent=ENG.currentScore.bind(ENG);
  const r1=v=>Math.round((Number(v)||0)*10)/10;
  function curveSide(g){
    const c=String(g?.curve||'').toLowerCase(),cls=String(g?.curveClass||'').toLowerCase();
    if(['hook','draw'].includes(c)||cls==='draw_curve')return'draw';
    if(['slice','fade'].includes(c)||cls==='fade_curve')return'fade';
    return null;
  }
  function costlySide(g){
    const c=String(g?.costly||'').toLowerCase();
    if(c==='hook')return'draw';if(c==='slice')return'fade';return null;
  }
  function strikeConflict(g){
    if(!g||!['heel','toe'].includes(g.strike))return null;
    const sides=[curveSide(g),costlySide(g)].filter(Boolean);if(!sides.length)return null;
    const d=sides.filter(x=>x==='draw').length,f=sides.filter(x=>x==='fade').length;
    if(d===f)return null;
    const dominant=d>f?'draw':'fade';
    const conflicts=(g.strike==='heel'&&dominant==='draw')||(g.strike==='toe'&&dominant==='fade');
    return conflicts?{reportedStrike:g.strike,ballFlightSide:dominant,reason:`Reported ${g.strike} contact runs opposite the usual horizontal gear-effect contribution for the reported ${dominant==='draw'?'draw/hook':'fade/slice'} pattern.`}:null;
  }
  function sourceFor(g){
    const raw=String(g?.strikeSource||((typeof state!=='undefined'&&state?.strikeSource)||'')).toLowerCase();
    if(raw==='confirmed')return{key:'confirmed',alpha:1,label:'confirmed with impact evidence'};
    if(raw==='repeated')return{key:'repeated',alpha:.72,label:'repeatedly seen or felt'};
    if(raw==='guess')return{key:'guess',alpha:.42,label:'best guess'};
    return{key:'unspecified',alpha:.5,label:'unverified'};
  }
  function avg(a,b){return Number.isFinite(+a)&&Number.isFinite(+b)?(+a+ +b)/2:Number.isFinite(+a)?+a:+b;}
  function genericDetail(heel,toe){
    if(!heel)return toe;if(!toe)return heel;
    const B=Object.fromEntries((toe.components||[]).map(x=>[x.key,x]));
    const components=(heel.components||[]).map(x=>{
      const y=B[x.key];if(!y)return x;
      return {...x,score:r1(avg(x.score,y.score)),weight:r1(avg(x.weight,y.weight)),normalizedWeight:r1(avg(x.normalizedWeight,y.normalizedWeight)),impact:r1(avg(x.impact,y.impact)),evidenceConfidence:r1(avg(x.evidenceConfidence,y.evidenceConfidence))};
    });
    return {...heel,overall:r1(avg(heel.overall,toe.overall)),raw:r1(avg(heel.raw,toe.raw)),evidenceQuality:r1(avg(heel.evidenceQuality,toe.evidenceQuality)),components,strengths:components.slice().sort((a,b)=>(b.impact||0)-(a.impact||0)),weaknesses:components.slice().sort((a,b)=>(a.impact||0)-(b.impact||0))};
  }
  function mixDetail(primary,generic,alpha){
    if(!primary||!generic||alpha>=.999)return primary;
    const G=Object.fromEntries((generic.components||[]).map(x=>[x.key,x]));
    const components=(primary.components||[]).map(x=>{
      const y=G[x.key];if(!y||!['strike','efficiency'].includes(x.key))return x;
      return {...x,score:r1((+x.score||0)*alpha+(+y.score||0)*(1-alpha)),evidenceConfidence:r1((+x.evidenceConfidence||0)*alpha+(+y.evidenceConfidence||0)*(1-alpha)),strikeSideCalibration:r1(alpha)};
    });
    const strikeKeys=new Set(['strike','efficiency']);
    let overall=+primary.overall||0;
    const deltas=components.reduce((s,x,i)=>{
      const old=primary.components?.[i];if(!old||!strikeKeys.has(x.key))return s;
      return s+((+x.score||0)-(+old.score||0))*((+x.normalizedWeight||0)/100);
    },0);
    overall=r1(Math.max(45,Math.min(99.2,overall+deltas)));
    return {...primary,overall,components,strengths:components.slice().sort((a,b)=>(b.impact||0)-(a.impact||0)),weaknesses:components.slice().sort((a,b)=>(a.impact||0)-(b.impact||0))};
  }
  function calibrateProduct(p,g){
    if(!g||!['heel','toe'].includes(g.strike))return priorScore(p,g);
    const src=sourceFor(g),conflict=strikeConflict(g),primary=priorScore(p,g);
    if(src.key==='confirmed')return annotate(primary,src,conflict,1);
    const heel=priorScore(p,{...g,strike:'heel'}),toe=priorScore(p,{...g,strike:'toe'}),generic=genericDetail(heel,toe);
    const alpha=conflict?0:src.alpha;
    return annotate(mixDetail(primary,generic,alpha),src,conflict,alpha);
  }
  function calibrateCurrent(g){
    if(!g||!['heel','toe'].includes(g.strike))return priorCurrent(g);
    const src=sourceFor(g),conflict=strikeConflict(g),primary=priorCurrent(g);
    if(!primary)return primary;if(src.key==='confirmed')return annotateCurrent(primary,src,conflict,1);
    const heel=priorCurrent({...g,strike:'heel'}),toe=priorCurrent({...g,strike:'toe'});
    if(!heel?.detail||!toe?.detail)return annotateCurrent(primary,src,conflict,src.alpha);
    const generic=genericDetail(heel.detail,toe.detail),alpha=conflict?0:src.alpha,detail=mixDetail(primary.detail,generic,alpha);
    return annotateCurrent({...primary,score:detail?.overall??primary.score,detail},src,conflict,alpha);
  }
  function noteFor(src,conflict,alpha){
    if(src.key==='confirmed'&&conflict)return 'Your strike location was retained because you marked it as confirmed. The conflicting curvature can still occur when face-to-path delivery outweighs horizontal gear effect.';
    if(conflict)return 'FORM retained the fact that contact is off-center but removed the heel-vs-toe advantage because the unconfirmed strike side conflicts with the observed ball-flight pattern.';
    if(alpha<.6)return 'FORM kept off-center contact in the fit but reduced heel-vs-toe specificity because the strike location is unverified.';
    if(alpha<.9)return 'FORM uses the reported strike side with moderate confidence because it is repeatedly observed but not directly confirmed.';
    return 'Strike location is treated as confirmed evidence.';
  }
  function annotate(out,src,conflict,alpha){if(!out||typeof out!=='object')return out;return {...out,strikeReliability:{status:src.key,source:src.label,sideWeight:r1(alpha*100),conflict:!!conflict,...(conflict||{}),note:noteFor(src,conflict,alpha)}};}
  function annotateCurrent(out,src,conflict,alpha){if(!out)return out;const detail=annotate(out.detail,src,conflict,alpha);return {...out,score:detail?.overall??out.score,detail,strikeReliability:detail?.strikeReliability};}
  ENG.scoreOne=(p,g)=>calibrateProduct(p,g);
  ENG.currentScore=g=>calibrateCurrent(g);
  if(typeof window.driverScoreV43==='function')window.driverScoreV43=(p,g)=>ENG.scoreOne(p,g);
  if(typeof window.driverRankV43==='function')window.driverRankV43=g=>ENG.winners(g);
  if(typeof window.currentDriverScoreV43==='function')window.currentDriverScoreV43=g=>ENG.currentScore(g).score??75;
  window.FORM_DRIVER_STRIKE_RELIABILITY_V150={version:'10.50',strikeConflict,sourceFor,priorScore,priorCurrent};
  window.FORM_DRIVER_STRIKE_RELIABILITY_V149=window.FORM_DRIVER_STRIKE_RELIABILITY_V150;
  return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>240)clearInterval(t);},50);
})();
