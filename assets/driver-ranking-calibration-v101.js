// FORM 10.1 — priority-sensitive independent execution calibration.
// Adds a separate measured-execution component so a technically compatible head cannot
// outrank stronger proven performers solely because modeled launch/spin/bias traits line up.
// No brand, price, prestige or current-club satisfaction input is used in new-driver Fit Score.
(function(){
'use strict';
function init(){
  const ENG=window.FORM_DRIVER_ENGINE_V80,E90=window.FORM_DRIVER_EVIDENCE_V90;
  if(!ENG||!E90||window.FORM_DRIVER_RANKING_CALIBRATION_V101)return false;
  const baseScore=ENG.scoreOne.bind(ENG),baseCompare=ENG.compare.bind(ENG);
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const r1=v=>Math.round(v*10)/10;
  const strength=(g,key)=>{const rank=Number(g?.ranks?.[key]);return Number.isFinite(rank)?clamp(7-rank,1,6):3;};
  function measuredPart(s,g){
    const p=s?.evidence?.provenPerformance;
    if(!p||p.type!=='direct'||![p.accuracy,p.distance,p.forgiveness].every(Number.isFinite))return null;
    const offCenter=['toe','heel','varied'].includes(g?.strike),twoWay=g?.costly==='two_way'||g?.strike==='varied';
    const aw=1+strength(g,'accuracy')*.45;
    const dw=1+strength(g,'distance')*.40;
    const fw=1+(offCenter?2.4:.8)+(twoWay?0.7:0)+strength(g,'accuracy')*.15;
    const score=(p.accuracy*aw+p.distance*dw+p.forgiveness*fw)/(aw+dw+fw);
    const weight=14+Math.max(strength(g,'accuracy'),strength(g,'distance'))*.7+(offCenter?2:0);
    return {key:'execution',label:'Proven execution',weight:r1(weight),score:r1(score),explanation:'Independent accuracy, distance and forgiveness results are blended to your stated priorities and strike needs. This prevents modeled design compatibility from masquerading as proven on-course execution.',evidenceConfidence:r1(clamp(Number(p.confidence)||0,0,1))};
  }
  function recalibrate(p,g){
    const s=baseScore(p,g);if(s?.hardConstraints?.length)return s;
    const m=measuredPart(s,g);if(!m)return s;
    const parts=[...(s.components||[]).map(x=>({key:x.key,label:x.label,weight:Number(x.weight)||0,score:Number(x.score)||80,explanation:x.explanation,evidenceConfidence:Number(x.evidenceConfidence)||0})),m];
    const totalW=parts.reduce((a,x)=>a+x.weight,0)||1;
    const raw=parts.reduce((a,x)=>a+x.score*x.weight,0)/totalW;
    const evidenceQ=parts.reduce((a,x)=>a+x.evidenceConfidence*x.weight,0)/totalW;
    const adjusted=raw>82?raw-(1-evidenceQ)*3.5:raw;
    const overall=r1(clamp(100-(100-adjusted)*1.22,45,99.2));
    const components=parts.map(x=>({...x,normalizedWeight:r1(x.weight/totalW*100),impact:r1((x.score-80)*x.weight/totalW)}));
    return {...s,overall,raw:r1(raw),evidenceQuality:r1(evidenceQ),components,strengths:components.slice().sort((a,b)=>b.impact-a.impact),weaknesses:components.slice().sort((a,b)=>a.impact-b.impact),calibration:'10.1 priority-sensitive measured execution'};
  }
  function winners(g){
    const rows=[];
    products.forEach(p=>{
      if(p.generation==='previous_limited')return;
      if(typeof productAllowedByBrandScope==='function'&&!productAllowedByBrandScope(p))return;
      const s=recalibrate(p,g);if(!s.hardConstraints?.length)rows.push({p,s});
    });
    rows.sort((a,b)=>b.s.overall-a.s.overall);
    const by=new Map();rows.forEach(r=>{if(!by.has(r.p.brand))by.set(r.p.brand,r)});
    return [...by.values()].sort((a,b)=>b.s.overall-a.s.overall);
  }
  function currentProduct(g){
    const brand=g?.currentClub?.brand,modelLabel=g?.currentClub?.model||'';if(!brand||!modelLabel)return null;
    const clean=modelLabel.replace(/\s*\(20\d{2}\)\s*/,'').trim();
    const exact=products.find(p=>p.brand===brand&&(p.model===clean||p.model===modelLabel));
    if(exact)return {p:exact,label:modelLabel,exact:true};
    if(typeof currentVirtualProduct==='function'){const vp=currentVirtualProduct(g);if(vp)return {p:vp,label:modelLabel,exact:false};}
    return null;
  }
  function currentScore(g){
    const found=currentProduct(g);if(!found)return {score:null,detail:null,label:'Insufficient product data'};
    const detail=recalibrate(found.p,g);
    return {score:detail.overall,detail,label:found.exact?'Exact model profile':'Historical modeled profile'};
  }
  function compare(a,b){
    if(!a?.components||!b?.components)return baseCompare(a,b);
    const B=Object.fromEntries(b.components.map(x=>[x.key,x]));
    return a.components.map(x=>({key:x.key,label:x.label,delta:r1(x.score-(B[x.key]?.score??x.score))})).filter(x=>Math.abs(x.delta)>=2).sort((x,y)=>Math.abs(y.delta)-Math.abs(x.delta));
  }
  ENG.scoreOne=recalibrate;ENG.winners=winners;ENG.currentScore=currentScore;ENG.compare=compare;
  window.FORM_DRIVER_RANKING_CALIBRATION_V101={version:'10.1',measuredPart};
  return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>160)clearInterval(t);},50);
})();