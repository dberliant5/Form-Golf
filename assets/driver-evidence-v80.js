// FORM 8.0 — Driver Evidence Model
// Safe-route architecture: FORM owns every normalized attribute. External publications may
// later contribute evidence records, but no third-party grade is copied directly into a FORM score.
(function(){
'use strict';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const round=v=>Math.round(v*10)/10;

const SOURCE_WEIGHTS={
  independent_measured:1.00,
  independent_summary:.86,
  manufacturer_measured:.74,
  manufacturer_documented:.62,
  form_modeled:.52,
  era_prior:.30
};

function record(value,sourceType,confidence,note,sourceId='FORM'){return {value:round(clamp(value,0,100)),sourceType,confidence:round(clamp(confidence,0,1)),note,sourceId};}
function modelKey(p){return `${p?.brand||''}|${p?.model||''}`;}
function yearFromLabel(label){const m=String(label||'').match(/\((20\d{2})\)/);return m?+m[1]:null;}

function baseProfile(p){
  const forg=Number(p?.forgiveness||3.5),launch=Number(p?.launch||3),spin=Number(p?.spin||3),bias=Number(p?.draw_bias||0);
  const lo=Number(p?.speed_fit?.[0]||75),hi=Number(p?.speed_fit?.[1]||115),width=hi-lo;
  const player=p?.player||'broad';
  let stability=52+forg*9.2;
  let toe=48+forg*8.8;
  let heel=48+forg*8.5;
  let speedPotential=80;
  let spinConsistency=70+forg*4;
  let launchConsistency=70+forg*3.5;
  let adjustability=76;
  let aero=78;
  if(player==='max_forgiveness'){stability+=5;toe+=4;heel+=4;spinConsistency+=3;}
  if(player==='controlled'){stability-=4;toe-=5;heel-=5;speedPotential+=5;adjustability+=4;}
  if(player==='lowspin'){stability-=10;toe-=9;heel-=9;speedPotential+=8;spinConsistency-=3;}
  if(player==='moderate_speed'){speedPotential-=5;launchConsistency+=3;}
  if(player==='slice_help'){stability+=2;heel+=2;adjustability+=2;}
  if(width>=30)adjustability+=2;
  const spinSupport=clamp(48+spin*12,45,96);
  const launchSupport=clamp(48+launch*10,45,98);
  const neutralBias=clamp(96-bias*38,45,98);
  const drawHelp=clamp(55+bias*40,45,100);
  return {
    spinSupport:record(spinSupport,'form_modeled',.58,'Normalized from FORM catalog spin profile.'),
    spinReduction:record(145-spinSupport,'form_modeled',.58,'Inverse of FORM catalog spin-support profile.'),
    launchSupport:record(launchSupport,'form_modeled',.58,'Normalized from FORM catalog launch profile.'),
    launchControl:record(145-launchSupport,'form_modeled',.58,'Inverse of FORM catalog launch-support profile.'),
    stability:record(stability,'form_modeled',.60,'Modeled from forgiveness class and head/player architecture.'),
    toeRetention:record(toe,'form_modeled',.50,'Modeled from forgiveness class; no independent strike-map dataset connected yet.'),
    heelRetention:record(heel,'form_modeled',.50,'Modeled from forgiveness class; no independent strike-map dataset connected yet.'),
    spinConsistency:record(spinConsistency,'form_modeled',.46,'Modeled consistency prior pending normalized independent strike-location testing.'),
    launchConsistency:record(launchConsistency,'form_modeled',.44,'Modeled consistency prior pending normalized independent strike-location testing.'),
    speedPotential:record(speedPotential,'form_modeled',.48,'Modeled from intended player segment; not an independent ball-speed test result.'),
    neutralBias:record(neutralBias,'form_modeled',.62,'Normalized from FORM directional-bias profile.'),
    drawHelp:record(drawHelp,'form_modeled',.62,'Normalized from FORM directional-bias profile.'),
    adjustability:record(adjustability,'form_modeled',.38,'Conservative modeled prior until configuration-level data is populated.'),
    aeroEfficiency:record(aero,'form_modeled',.28,'Neutral prior. FORM will not manufacture aerodynamic separation without evidence.'),
    speedWindow:{lo,hi,sourceType:'form_modeled',confidence:.72,note:'FORM catalog intended speed window.'}
  };
}

// Model-specific documented capability records. These are deliberately narrow: they only
// adjust the dimension the documentation actually supports. They are not cross-brand grades.
const DOCUMENTED={
  'TaylorMade|Qi4D Max':{
    spinConsistency:record(91,'manufacturer_documented',.62,'Manufacturer documents vertical-strike spin consistency improvements.','TaylorMade'),
    toeRetention:record(91,'manufacturer_documented',.58,'Manufacturer documents heel/toe dispersion protection from face design.','TaylorMade'),
    heelRetention:record(91,'manufacturer_documented',.58,'Manufacturer documents heel/toe dispersion protection from face design.','TaylorMade'),
    adjustability:record(94,'manufacturer_documented',.66,'Multiple movable-weight configurations documented.','TaylorMade')
  },
  'TaylorMade|Qi4D':{
    spinConsistency:record(92,'manufacturer_documented',.62,'Manufacturer documents vertical-strike spin consistency improvements.','TaylorMade'),
    speedPotential:record(91,'manufacturer_documented',.54,'Aerodynamic/face-speed design is a documented focus; no independent cross-brand gain assigned.','TaylorMade'),
    adjustability:record(96,'manufacturer_documented',.66,'Four-weight adjustability documented.','TaylorMade')
  },
  'PING|G440 K':{
    stability:record(97,'manufacturer_documented',.68,'Manufacturer identifies this as its record combined-MOI head.','PING'),
    toeRetention:record(93,'manufacturer_documented',.56,'High-MOI architecture supports off-center stability; independent strike map still pending.','PING'),
    heelRetention:record(93,'manufacturer_documented',.56,'High-MOI architecture supports off-center stability; independent strike map still pending.','PING')
  },
  'Titleist|GTS2':{
    stability:record(94,'manufacturer_documented',.64,'Manufacturer positions GTS2 as the maximum-stability GTS profile.','Titleist'),
    speedPotential:record(90,'manufacturer_documented',.54,'Speed Sync Face and aerodynamic work are documented; no copied third-party grade.','Titleist'),
    toeRetention:record(90,'manufacturer_documented',.54,'Manufacturer documents speed retention across the face.','Titleist'),
    heelRetention:record(90,'manufacturer_documented',.54,'Manufacturer documents speed retention across the face.','Titleist')
  },
  'Callaway|Quantum Max':{
    stability:record(91,'manufacturer_documented',.54,'Manufacturer positions Quantum Max as a broad total-performance/forgiveness head.','Callaway'),
    speedPotential:record(89,'manufacturer_documented',.48,'Manufacturer documents speed as a design objective; independent cross-brand validation pending.','Callaway')
  },
  'Cobra|OPTM MAX-K':{
    stability:record(98,'manufacturer_documented',.68,'Manufacturer positions MAX-K as its highest-MOI OPTM profile.','Cobra'),
    toeRetention:record(94,'manufacturer_documented',.56,'High-MOI/off-center speed preservation is a documented design objective.','Cobra'),
    heelRetention:record(94,'manufacturer_documented',.56,'High-MOI/off-center speed preservation is a documented design objective.','Cobra')
  }
};

const externalEvidence={};
function addExternalEvidence(key,dimension,evidence){
  if(!externalEvidence[key])externalEvidence[key]={};
  if(!externalEvidence[key][dimension])externalEvidence[key][dimension]=[];
  externalEvidence[key][dimension].push(evidence);
}

function weightedBlend(records){
  const valid=records.filter(Boolean).filter(x=>Number.isFinite(+x.value));
  if(!valid.length)return null;
  let num=0,den=0;
  valid.forEach(r=>{const sourceW=SOURCE_WEIGHTS[r.sourceType]||.35;const w=sourceW*(r.confidence??.5);num+=r.value*w;den+=w;});
  const value=den?num/den:valid[0].value;
  const confidence=clamp(valid.reduce((a,r)=>a+(SOURCE_WEIGHTS[r.sourceType]||.35)*(r.confidence??.5),0)/Math.max(1,valid.length),0,1);
  return {value:round(value),confidence:round(confidence),evidence:valid};
}

function evidenceFor(p){
  const key=modelKey(p),base=baseProfile(p),doc=DOCUMENTED[key]||{},ext=externalEvidence[key]||{};
  const dimensions={};
  Object.keys(base).forEach(dim=>{
    if(dim==='speedWindow'){dimensions[dim]=base[dim];return;}
    dimensions[dim]=weightedBlend([base[dim],doc[dim],...(ext[dim]||[])]);
  });
  Object.keys(doc).forEach(dim=>{if(!dimensions[dim])dimensions[dim]=weightedBlend([doc[dim],...(ext[dim]||[])]);});
  return {key,dimensions,sourceCount:Object.values(dimensions).reduce((n,d)=>n+(d?.evidence?.length||0),0)};
}

function eraEvidence(year){
  let stability=70,retention=68,consistency=67,speed=72;
  if(year>=2025){stability=90;retention=89;consistency=88;speed=90;}
  else if(year>=2023){stability=86;retention=85;consistency=83;speed=86;}
  else if(year>=2020){stability=80;retention=79;consistency=77;speed=82;}
  else if(year>=2017){stability=74;retention=72;consistency=70;speed=76;}
  return {
    stability:weightedBlend([record(stability,'era_prior',.45,`Conservative ${year||'unknown'}-era stability prior.`)]),
    toeRetention:weightedBlend([record(retention,'era_prior',.42,'Conservative era-level off-center retention prior.')]),
    heelRetention:weightedBlend([record(retention,'era_prior',.42,'Conservative era-level off-center retention prior.')]),
    spinConsistency:weightedBlend([record(consistency,'era_prior',.40,'Conservative era-level spin-consistency prior.')]),
    launchConsistency:weightedBlend([record(consistency,'era_prior',.38,'Conservative era-level launch-consistency prior.')]),
    speedPotential:weightedBlend([record(speed,'era_prior',.38,'Conservative era-level speed-retention prior.')])
  };
}

window.FORM_DRIVER_EVIDENCE_V80={SOURCE_WEIGHTS,evidenceFor,eraEvidence,addExternalEvidence,weightedBlend,yearFromLabel,modelKey};
})();
