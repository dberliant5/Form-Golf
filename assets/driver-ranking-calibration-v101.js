// FORM 10.3 — cohort-aware, evidence-depth driver ranking calibration.
// Independent execution is matched to the golfer's relevant swing-speed cohort where available.
// Evidence depth affects confidence/weight, never brand prestige. Current-club context is excluded.
(function(){
'use strict';
function init(){
  const ENG=window.FORM_DRIVER_ENGINE_V80,E90=window.FORM_DRIVER_EVIDENCE_V90;
  if(!ENG||!E90||window.FORM_DRIVER_RANKING_CALIBRATION_V103)return false;
  const baseScore=ENG.scoreOne.bind(ENG),baseCompare=ENG.compare.bind(ENG);
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),r1=v=>Math.round(v*10)/10;
  const strength=(g,key)=>{const rank=Number(g?.ranks?.[key]);return Number.isFinite(rank)?clamp(7-rank,1,6):3;};
  // 2026 MyGolfSpy 90–105 mph cohort. These are normalized independent test categories,
  // not FORM scores. Only models represented in that cohort are overridden here.
  const MID={
    'TaylorMade|Qi4D':{overall:93,accuracy:97,distance:92,forgiveness:90},
    'Tour Edge|Exotics Max':{overall:93,accuracy:98,distance:87,forgiveness:98},
    'Tour Edge|Exotics Max (2026)':{overall:93,accuracy:98,distance:87,forgiveness:98},
    'Callaway|Quantum Triple Diamond':{overall:93,accuracy:94,distance:94,forgiveness:88},
    'Callaway|Quantum Max':{overall:92,accuracy:95,distance:98,forgiveness:81},
    'PING|G440 K':{overall:92,accuracy:92,distance:96,forgiveness:84},
    'PING|G440 MAX':{overall:92,accuracy:95,distance:89,forgiveness:91},
    'Callaway|Quantum Max D':{overall:91,accuracy:92,distance:94,forgiveness:86},
    'Callaway|Quantum Triple Diamond Max':{overall:90,accuracy:86,distance:97,forgiveness:86},
    'Titleist|GT2':{overall:89,accuracy:83,distance:93,forgiveness:93},
    'Mizuno|JPX ONE':{overall:89,accuracy:91,distance:86,forgiveness:91},
    'Mizuno|JPX One':{overall:89,accuracy:91,distance:86,forgiveness:91},
    'TaylorMade|Qi4D LS':{overall:89,accuracy:84,distance:90,forgiveness:93},
    'Wilson|DYNAPWR Max':{overall:88,accuracy:91,distance:89,forgiveness:84},
    'Cobra|OPTM LS':{overall:88,accuracy:84,distance:94,forgiveness:83},
    'Cobra|OPTM X':{overall:86,accuracy:83,distance:91,forgiveness:83}
  };
  const key=p=>`${p?.brand||''}|${p?.model||''}`;
  function speed(g){const m=typeof state!=='undefined'?state?.metrics?.speed:null;if(m?.mode==='exact')return Number(m.value);if(m?.mode==='range')return ({under75:72,'75-84':80,'85-89':87,'90-94':92,'95-99':97,'100-104':102,'105-109':107,'110-114':112,'115plus':118})[m.value]||null;return Number(g?.speed)||null;}
  function proofFor(s,p,g){const base=s?.evidence?.provenPerformance;if(!base)return null;const sp=speed(g),mid=sp>=90&&sp<=105?MID[key(p)]:null;if(!mid)return {...base,cohort:'all-speed'};return {...base,...mid,type:'direct',cohort:'90–105 mph',confidence:Math.max(Number(base.confidence)||0,.86),note:'Relevant 90–105 mph independent cohort used for execution calibration.'};}
  function measuredPart(s,p,g){
    const proof=proofFor(s,p,g);if(!proof||proof.type!=='direct'||![proof.accuracy,proof.distance,proof.forgiveness].every(Number.isFinite))return null;
    const offCenter=['toe','heel','varied'].includes(g?.strike),twoWay=g?.costly==='two_way'||g?.strike==='varied';
    const aw=1+strength(g,'accuracy')*.48,dw=1+strength(g,'distance')*.43,fw=1+(offCenter?2.2:.7)+(twoWay?.7:0)+strength(g,'accuracy')*.14;
    const score=(proof.accuracy*aw+proof.distance*dw+proof.forgiveness*fw)/(aw+dw+fw);
    // Corroboration increases how much we trust execution evidence; it never directly adds score.
    const depth=clamp((Number(proof.normalizedSources)||1)+(Number(proof.corroboratingSources)||0)*.55,1,2);
    const weight=(14+Math.max(strength(g,'accuracy'),strength(g,'distance'))*.7+(offCenter?2:0))*(.90+.10*depth);
    return {key:'execution',label:'Proven execution',weight:r1(weight),score:r1(score),explanation:`Independent ${proof.cohort||'all-speed'} accuracy, distance and forgiveness results blended to your priorities. Corroboration changes evidence weight, not brand score.`,evidenceConfidence:r1(clamp(Number(proof.confidence)||0,0,1)),cohort:proof.cohort};
  }
  function recalibrate(p,g){
    const s=baseScore(p,g);if(s?.hardConstraints?.length)return s;
    const m=measuredPart(s,p,g);if(!m)return s;
    const parts=[...(s.components||[]).map(x=>({key:x.key,label:x.label,weight:Number(x.weight)||0,score:Number(x.score)||80,explanation:x.explanation,evidenceConfidence:Number(x.evidenceConfidence)||0})),m];
    const totalW=parts.reduce((a,x)=>a+x.weight,0)||1,raw=parts.reduce((a,x)=>a+x.score*x.weight,0)/totalW,evidenceQ=parts.reduce((a,x)=>a+x.evidenceConfidence*x.weight,0)/totalW;
    const adjusted=raw>82?raw-(1-evidenceQ)*3.5:raw,overall=r1(clamp(100-(100-adjusted)*1.22,45,99.2));
    const components=parts.map(x=>({...x,normalizedWeight:r1(x.weight/totalW*100),impact:r1((x.score-80)*x.weight/totalW)}));
    return {...s,overall,raw:r1(raw),evidenceQuality:r1(evidenceQ),components,strengths:components.slice().sort((a,b)=>b.impact-a.impact),weaknesses:components.slice().sort((a,b)=>a.impact-b.impact),calibration:'10.3 cohort-aware evidence-depth execution'};
  }
  function winners(g){const rows=[];products.forEach(p=>{if(p.generation==='previous_limited')return;if(typeof productAllowedByBrandScope==='function'&&!productAllowedByBrandScope(p))return;const s=recalibrate(p,g);if(!s.hardConstraints?.length)rows.push({p,s});});rows.sort((a,b)=>b.s.overall-a.s.overall);const by=new Map();rows.forEach(r=>{if(!by.has(r.p.brand))by.set(r.p.brand,r)});return [...by.values()].sort((a,b)=>b.s.overall-a.s.overall);}
  function currentProduct(g){const brand=g?.currentClub?.brand,modelLabel=g?.currentClub?.model||'';if(!brand||!modelLabel)return null;const clean=modelLabel.replace(/\s*\(20\d{2}\)\s*/,'').trim(),exact=products.find(p=>p.brand===brand&&(p.model===clean||p.model===modelLabel));if(exact)return {p:exact,label:modelLabel,exact:true};if(typeof currentVirtualProduct==='function'){const vp=currentVirtualProduct(g);if(vp)return {p:vp,label:modelLabel,exact:false};}return null;}
  function currentScore(g){const found=currentProduct(g);if(!found)return {score:null,detail:null,label:'Insufficient product data'};const detail=recalibrate(found.p,g);return {score:detail.overall,detail,label:found.exact?'Exact model profile':'Historical modeled profile'};}
  function compare(a,b){if(!a?.components||!b?.components)return baseCompare(a,b);const B=Object.fromEntries(b.components.map(x=>[x.key,x]));return a.components.map(x=>({key:x.key,label:x.label,delta:r1(x.score-(B[x.key]?.score??x.score))})).filter(x=>Math.abs(x.delta)>=2).sort((x,y)=>Math.abs(y.delta)-Math.abs(x.delta));}
  ENG.scoreOne=recalibrate;ENG.winners=winners;ENG.currentScore=currentScore;ENG.compare=compare;
  window.FORM_DRIVER_RANKING_CALIBRATION_V101={version:'10.3',measuredPart};window.FORM_DRIVER_RANKING_CALIBRATION_V103=true;return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>160)clearInterval(t);},50);
})();