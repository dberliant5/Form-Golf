// FORM 9.0 — dimension-level proven-performance calibration
// A strong overall test result cannot validate every execution dimension equally.
// Normalized independent categories validate only the performance dimensions they actually measure.
(function(){'use strict';
function init(){
 const E=window.FORM_DRIVER_EVIDENCE_V80,V83=window.FORM_DRIVER_EVIDENCE_V83;
 if(!E||!V83||typeof E.evidenceFor!=='function')return false;
 const prior=E.evidenceFor.bind(E),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),r1=v=>Math.round(v*10)/10;
 const key=p=>`${p?.brand||''}|${p?.model||''}`;
 // Same normalized test methodology across brands. Values are 0-100 transformations of
 // independent Accuracy / Distance / Forgiveness results; they are evidence inputs, not FORM scores.
 const DIRECT={
  'TaylorMade|Qi4D':{overall:92,accuracy:92,distance:93,forgiveness:91,normalizedSources:1,corroboratingSources:1,note:'Elite, balanced independent performance with separate current-model lab corroboration.'},
  'TaylorMade|Qi4D LS':{overall:89,accuracy:85,distance:91,forgiveness:90,normalizedSources:1,corroboratingSources:1,note:'Strong current-model validation, led by speed and forgiveness.'},
  'TaylorMade|Qi4D Max':{overall:82,accuracy:83,distance:80,forgiveness:83,normalizedSources:1,corroboratingSources:1,note:'Current independent results are solid but materially below the standard Qi4D.'},
  'TaylorMade|Qi4D Max Lite':{overall:84,accuracy:87,distance:77,forgiveness:92,normalizedSources:1,corroboratingSources:0,note:'Validated as forgiving, with weaker distance execution.'},
  'Callaway|Quantum Max':{overall:91,accuracy:92,distance:95,forgiveness:85,normalizedSources:1,corroboratingSources:1,note:'Elite distance and accuracy validation; forgiveness is good rather than class-leading overall.'},
  'Callaway|Quantum Max D':{overall:88,accuracy:86,distance:94,forgiveness:83,normalizedSources:1,corroboratingSources:0,note:'Strong distance validation with more modest accuracy and consistency.'},
  'Callaway|Quantum Triple Diamond':{overall:91,accuracy:91,distance:94,forgiveness:85,normalizedSources:1,corroboratingSources:0,note:'Elite distance/accuracy execution with a lower forgiveness floor.'},
  'Callaway|Quantum Triple Diamond Max':{overall:89,accuracy:86,distance:92,forgiveness:87,normalizedSources:1,corroboratingSources:1,note:'Strong measured performance with balanced execution.'},
  'Tour Edge|Exotics Max':{overall:89,accuracy:91,distance:87,forgiveness:92,normalizedSources:1,corroboratingSources:1,note:'Legitimately strong current-model validation: excellent forgiveness and accuracy, with less distance strength.'},
  'Tour Edge|Exotics Max (2026)':{overall:89,accuracy:91,distance:87,forgiveness:92,normalizedSources:1,corroboratingSources:1,note:'Legitimately strong current-model validation: excellent forgiveness and accuracy, with less distance strength.'},
  'Wilson|DYNAPWR Max':{overall:85,accuracy:82,distance:86,forgiveness:88,normalizedSources:1,corroboratingSources:1,note:'Solid forgiveness validation, but measured accuracy and overall performance trail the leading 2026 heads.'},
  'Wilson|DYNAPWR Max +':{overall:84,accuracy:85,distance:83,forgiveness:83,normalizedSources:1,corroboratingSources:1,note:'Adequate current validation; not an elite all-around independent performer.'},
  'Wilson|DYNAPWR Max+':{overall:84,accuracy:85,distance:83,forgiveness:83,normalizedSources:1,corroboratingSources:1,note:'Adequate current validation; not an elite all-around independent performer.'},
  'Wilson|DYNAPWR LS':{overall:83,accuracy:77,distance:90,forgiveness:81,normalizedSources:1,corroboratingSources:0,note:'Distance-oriented execution with weaker accuracy validation.'},
  'Mizuno|JPX ONE':{overall:84,accuracy:88,distance:82,forgiveness:84,normalizedSources:1,corroboratingSources:1,note:'Good accuracy, but independent distance and overall execution are not elite.'},
  'Mizuno|JPX One':{overall:84,accuracy:88,distance:82,forgiveness:84,normalizedSources:1,corroboratingSources:1,note:'Good accuracy, but independent distance and overall execution are not elite.'},
  'PING|G440 MAX':{overall:88,accuracy:91,distance:86,forgiveness:86,normalizedSources:1,corroboratingSources:1,note:'Strong accuracy validation with balanced overall performance.'},
  'PING|G440 K':{overall:87,accuracy:89,distance:90,forgiveness:81,normalizedSources:1,corroboratingSources:1,note:'Strong speed/accuracy result; aggregate consistency testing was less dominant than its MOI story suggests.'},
  'PING|G440 SFT':{overall:86,accuracy:92,distance:80,forgiveness:88,normalizedSources:1,corroboratingSources:0,note:'Strong specialized accuracy/forgiveness profile with less distance.'},
  'PING|G440 LST':{overall:88,accuracy:84,distance:90,forgiveness:91,normalizedSources:1,corroboratingSources:0,note:'Strong low-spin execution with good consistency.'},
  'Cobra|OPTM MAX-K':{overall:87,accuracy:89,distance:85,forgiveness:88,normalizedSources:1,corroboratingSources:0,note:'Strong measured accuracy and forgiveness.'},
  'Cobra|OPTM MAX-D':{overall:79,accuracy:80,distance:73,forgiveness:89,normalizedSources:1,corroboratingSources:0,note:'Feature-rich but independently weak overall, especially distance.'},
  'Cobra|OPTM X':{overall:83,accuracy:83,distance:85,forgiveness:81,normalizedSources:1,corroboratingSources:0,note:'Solid but not elite validation.'},
  'Cobra|OPTM LS':{overall:86,accuracy:84,distance:87,forgiveness:86,normalizedSources:1,corroboratingSources:0,note:'Strong balanced low-spin validation.'}
 };
 const LINEAGE={
  'Titleist|GTS2':{overall:88,accuracy:84,distance:94,forgiveness:85,confidence:.60,currentQualitative:true,note:'GT2 provides normalized lineage data and direct GTS2 testing corroborates strong current-model stability/retention; current GTS2 still lacks the same normalized market test.'},
  'Titleist|GTS3':{overall:88,accuracy:85,distance:94,forgiveness:83,confidence:.64,currentQualitative:true,note:'GT3 provides normalized lineage data; direct current GTS3 head-to-head testing confirms excellent speed and heel/toe retention.'},
  'Titleist|GTS4':{overall:86,accuracy:80,distance:92,forgiveness:83,confidence:.50,currentQualitative:false,note:'Strong GT4 lineage, but less normalized current-model evidence is connected for GTS4.'},
  'Titleist|GT1':{overall:82,accuracy:88,distance:76,forgiveness:82,confidence:.72,currentQualitative:true,note:'Direct prior-family normalized performance is useful but not elite.'}
 };
 function proofFor(p){
  const d=DIRECT[key(p)];
  if(d){const confidence=clamp(.78+.05*Math.min(1,d.corroboratingSources||0),0,.90);return {type:'direct',score:d.overall,overall:d.overall,accuracy:d.accuracy,distance:d.distance,forgiveness:d.forgiveness,confidence:r1(confidence),sources:(d.normalizedSources||1)+(d.corroboratingSources||0),normalizedSources:d.normalizedSources||1,corroboratingSources:d.corroboratingSources||0,note:d.note};}
  const l=LINEAGE[key(p)];if(l)return {type:'lineage',score:l.overall,overall:null,accuracy:l.accuracy,distance:l.distance,forgiveness:l.forgiveness,confidence:l.confidence,sources:l.currentQualitative?2:1,normalizedSources:0,corroboratingSources:l.currentQualitative?1:0,note:l.note};
  return {type:'limited',score:null,overall:null,accuracy:null,distance:null,forgiveness:null,confidence:.14,sources:0,normalizedSources:0,corroboratingSources:0,note:'No normalized current-model independent performance record is connected yet.'};
 }
 const EXEC=new Set(['stability','toeRetention','heelRetention','spinConsistency','launchConsistency','speedPotential']);
 function targetFor(dim,proof){
  if(proof.accuracy==null||proof.distance==null||proof.forgiveness==null)return null;
  if(dim==='speedPotential')return proof.distance;
  if(dim==='stability')return proof.forgiveness;
  if(dim==='toeRetention'||dim==='heelRetention')return proof.forgiveness*.72+proof.accuracy*.28;
  if(dim==='spinConsistency'||dim==='launchConsistency')return proof.forgiveness*.58+proof.accuracy*.42;
  return null;
 }
 E.evidenceFor=function(p){
  const out=prior(p),proof=proofFor(p),v=proof.confidence;
  Object.entries(out.dimensions||{}).forEach(([dim,d])=>{
   if(!EXEC.has(dim)||!d||!Number.isFinite(+d.value))return;
   // v8.9 stored the pre-validation model value. Reconstruct from that so v9 does not compound
   // the old single-overall adjustment.
   const modeled=Number.isFinite(+d.preValidationValue)?+d.preValidationValue:+d.value,target=targetFor(dim,proof);
   const modelKeep=.42+.28*v;
   const measuredBlend=target==null?0:.36*v;
   d.preV90Value=r1(+d.value);
   d.value=r1(clamp(80+(modeled-80)*modelKeep+(target==null?0:(target-80)*measuredBlend),0,100));
   d.validationTarget=target==null?null:r1(target);
   d.validationBasis=target==null?'No normalized category evidence':dim==='speedPotential'?'Independent distance performance':dim==='stability'?'Independent forgiveness/consistency performance':`${dim.includes('Consistency')?'Independent accuracy + forgiveness consistency':'Independent forgiveness + accuracy retention'}`;
   d.confidence=r1(clamp((+d.confidence||.35)*.54+v*.46,0,1));
  });
  out.provenPerformance=proof;
  out.executionValidation=r1(v*100);
  out.executionKeep=r1((.42+.28*v)*100);
  out.validationArchitecture='dimension-level';
  out.supportLevel=proof.type==='direct'?(proof.score>=90?'Elite direct validation':'Direct independent validation'):proof.type==='lineage'?'Lineage + current review':'Limited independent validation';
  out.coverageScore=Math.round(v*100);
  return out;
 };
 window.FORM_DRIVER_EVIDENCE_V90={version:'9.0',DIRECT,LINEAGE,proofFor,notes:'Normalized independent accuracy, distance and forgiveness validate only the FORM execution dimensions they actually support. Overall review score no longer boosts every execution dimension equally.'};
 return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>120)clearInterval(t)},50);
})();