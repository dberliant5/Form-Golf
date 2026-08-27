// FORM 8.9 — proven-performance validation layer
// Product claims describe capability. Independent testing earns execution credit.
(function(){
'use strict';
function init(){
 const E=window.FORM_DRIVER_EVIDENCE_V80;if(!E||typeof products==='undefined'||!Array.isArray(products))return false;
 products.forEach(p=>{
   if((p.brand==='PXG'&&/Black Ops/i.test(p.model||''))||(p.brand==='Titleist'&&/^GT[234]$/i.test(p.model||'')))p.generation='previous_limited';
 });
 const prior=E.evidenceFor.bind(E),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),r1=v=>Math.round(v*10)/10;
 const key=p=>`${p?.brand||''}|${p?.model||''}`;

 // Normalized independent 2026 market test. Scores are used as proof-of-execution signals,
 // not copied into FORM Fit Score. One source can validate a current model; multiple independent
 // confirmations increase confidence. Missing evidence never becomes an assumed elite score.
 // Source: MyGolfSpy 2026 overall driver test, with cohort results used only as breadth signals.
 const DIRECT={
  'TaylorMade|Qi4D':{overall:92,cohorts:[93],sources:2,note:'Current model independently validated as an elite all-around performer.'},
  'TaylorMade|Qi4D LS':{overall:89,cohorts:[89,85],sources:1,note:'Strong independent current-model performance with speed-cohort support.'},
  'TaylorMade|Qi4D Max':{overall:82,cohorts:[79,83],sources:2,note:'Current-model testing is more mixed than the standard Qi4D.'},
  'TaylorMade|Qi4D Max Lite':{overall:84,cohorts:[84,85,83],sources:1,note:'Current-model validation is solid but not category-leading.'},
  'Callaway|Quantum Max':{overall:91,cohorts:[92,97,85],sources:2,note:'Deep current-model validation across overall and multiple speed cohorts.'},
  'Callaway|Quantum Max D':{overall:88,cohorts:[91,84,79],sources:1,note:'Strong overall validation with cohort-dependent performance.'},
  'Callaway|Quantum Triple Diamond':{overall:91,cohorts:[93],sources:1,note:'Elite independent validation for distance and overall performance.'},
  'Callaway|Quantum Triple Diamond Max':{overall:89,cohorts:[90,81],sources:2,note:'Strong independent validation with additional performance-lab support.'},
  'PING|G440 MAX':{overall:88,cohorts:[92],sources:1,note:'Strong independent validation, particularly at mid swing speed.'},
  'PING|G440 K':{overall:87,cohorts:[92,84,85],sources:2,note:'Broad current-model validation with strong stability credentials.'},
  'PING|G440 SFT':{overall:86,cohorts:[83,82],sources:1,note:'Validated current model; performance is more specialized than universal.'},
  'PING|G440 LST':{overall:88,cohorts:[82,82],sources:1,note:'Strong overall validation with more variable speed-cohort results.'},
  'Cobra|OPTM MAX-K':{overall:87,cohorts:[83],sources:1,note:'Strong current-model validation.'},
  'Cobra|OPTM MAX-D':{overall:79,cohorts:[70,69,79],sources:1,note:'Current independent testing is materially weaker despite a compelling feature set.'},
  'Cobra|OPTM X':{overall:83,cohorts:[86,79],sources:1,note:'Solid but not elite current-model validation.'},
  'Cobra|OPTM LS':{overall:86,cohorts:[88,84],sources:1,note:'Strong current-model validation.'},
  'Mizuno|JPX ONE':{overall:84,cohorts:[89,84,82],sources:2,note:'Mixed independent validation; accuracy can be strong but speed/distance results vary.'},
  'Mizuno|JPX One':{overall:84,cohorts:[89,84,82],sources:2,note:'Mixed independent validation; accuracy can be strong but speed/distance results vary.'},
  'Tour Edge|Exotics Max':{overall:89,cohorts:[93,84],sources:1,note:'Strong direct independent validation, especially accuracy/forgiveness at mid speed.'},
  'Tour Edge|Exotics Max (2026)':{overall:89,cohorts:[93,84],sources:1,note:'Strong direct independent validation, especially accuracy/forgiveness at mid speed.'},
  'Wilson|DYNAPWR Max':{overall:85,cohorts:[88,85],sources:1,note:'Solid current-model validation.'},
  'Wilson|DYNAPWR LS':{overall:83,cohorts:[85,82],sources:1,note:'Current-model validation is adequate but not elite.'},
  'Wilson|DYNAPWR Max +':{overall:84,cohorts:[84,82,81],sources:1,note:'Current-model validation is adequate but not elite.'}
 };
 // A predecessor can establish manufacturer/lineage execution confidence, but it is deliberately
 // weaker than direct current-model evidence and does not become a current-model performance score.
 const LINEAGE={
  'Titleist|GTS2':{score:88,source:'Titleist GT2',note:'Strong independently tested predecessor; current GTS2 still needs direct normalized testing.'},
  'Titleist|GTS3':{score:88,source:'Titleist GT3',note:'Strong independently tested predecessor; current GTS3 still needs direct normalized testing.'},
  'Titleist|GTS4':{score:86,source:'Titleist GT4',note:'Strong independently tested predecessor; current GTS4 still needs direct normalized testing.'},
  'Titleist|GT1':{score:82,source:'Titleist GT1',note:'Direct family testing exists, but overall performance was not elite.'}
 };
 const EXECUTION_DIMS=new Set(['stability','toeRetention','heelRetention','spinConsistency','launchConsistency','speedPotential']);
 function proofFor(p){
  const d=DIRECT[key(p)];if(d){
   const cohortAvg=d.cohorts?.length?d.cohorts.reduce((a,b)=>a+b,0)/d.cohorts.length:d.overall;
   const breadth=clamp(1-(Math.max(...(d.cohorts||[d.overall]))-Math.min(...(d.cohorts||[d.overall])))/30,.55,1);
   const confidence=clamp(.78+(d.sources-1)*.08+(d.cohorts?.length>=2?.05:0),0,.96);
   return {type:'direct',score:r1(d.overall*.72+cohortAvg*.28),overall:d.overall,confidence:r1(confidence*breadth),sources:d.sources,note:d.note};
  }
  const l=LINEAGE[key(p)];if(l)return {type:'lineage',score:l.score,overall:null,confidence:.48,sources:1,note:l.note,sourceModel:l.source};
  return {type:'limited',score:null,overall:null,confidence:.16,sources:0,note:'No normalized current-model independent performance record is connected yet.'};
 }
 function applyValidation(out,p){
  const proof=proofFor(p),validation=proof.confidence;
  // Specs/modeling are still useful, but they cannot receive full execution credit without proof.
  // Direct independent evidence lets more of a modeled execution advantage survive. Sparse evidence
  // shrinks claimed/modelled speed, stability and consistency toward neutral (80).
  const keep=.48+.52*validation;
  const qualityBias=proof.score==null?-.65:clamp((proof.score-86)*.13*validation,-1.45,1.35);
  Object.entries(out.dimensions||{}).forEach(([dim,d])=>{
   if(!EXECUTION_DIMS.has(dim)||!d||!Number.isFinite(+d.value))return;
   d.preValidationValue=r1(+d.value);
   d.value=r1(clamp(80+(+d.value-80)*keep+qualityBias,0,100));
   // Product evidence confidence should reflect execution validation too. Manufacturer documentation
   // can define intent, but direct independent evidence is what earns high execution confidence.
   d.confidence=r1(clamp((+d.confidence||.35)*.58+validation*.42,0,1));
  });
  out.provenPerformance=proof;
  out.executionValidation=r1(validation*100);
  out.executionKeep=r1(keep*100);
  out.productQualityFloor=undefined;out.qualityAdjustment=undefined;
  return out;
 }
 E.evidenceFor=function(p){
  const out=prior(p),dims=Object.values(out.dimensions||{}).filter(x=>x&&Array.isArray(x.evidence));
  const records=dims.flatMap(x=>x.evidence||[]),modelSpecific=records.filter(r=>['independent_measured','independent_summary','manufacturer_measured','manufacturer_documented'].includes(r.sourceType));
  out.modelSpecificRecords=modelSpecific.length;
  out.documentedRecords=modelSpecific.filter(r=>String(r.sourceType).startsWith('manufacturer_')).length;
  out.crossBrandNormalized=true;
  applyValidation(out,p);
  const proof=out.provenPerformance;
  out.supportLevel=proof.type==='direct'?(proof.confidence>=.8?'Direct independent validation':'Independent validation'):proof.type==='lineage'?'Lineage validation':'Limited independent validation';
  out.coverageScore=Math.round(proof.confidence*100);
  return out;
 };
 window.FORM_DRIVER_EVIDENCE_V83={version:'8.9',DIRECT,LINEAGE,proofFor,notes:'Manufacturer specs establish intended capability. Independent normalized testing earns execution credit. Unvalidated execution advantages are shrunk toward neutral rather than assumed true.'};
 return true;
}
let tries=0,t=setInterval(()=>{tries++;if(init()||tries>100)clearInterval(t)},50);
})();