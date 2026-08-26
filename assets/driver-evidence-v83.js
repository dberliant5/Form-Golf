// FORM 8.3 — independent evidence calibration + current-model hygiene
(function(){
'use strict';
function init(){
 const E=window.FORM_DRIVER_EVIDENCE_V80;if(!E||!Array.isArray(window.products))return false;
 // Current-fit recommendations should not quietly include superseded heads.
 products.forEach(p=>{
   if((p.brand==='PXG'&&/Black Ops/i.test(p.model||''))||(p.brand==='Titleist'&&/^GT[234]$/i.test(p.model||'')))p.generation='previous_limited';
 });
 const add=(brand,model,dimension,value,confidence,note,sourceId='MyGolfSpy 2026')=>E.addExternalEvidence(`${brand}|${model}`,dimension,{value,sourceType:'independent_summary',confidence,note,sourceId});
 // Independent 2026 testing is translated into FORM dimensions, never copied as a third-party overall score.
 // Mid-speed testing is especially relevant to the 90–105 mph cohort; values below are deliberately conservative normalized signals.
 add('Tour Edge','Exotics Max','stability',96,.84,'Independent mid-speed testing showed exceptional forgiveness/consistency.');
 add('Tour Edge','Exotics Max','toeRetention',94,.78,'Independent forgiveness/dispersion results support strong off-center protection.');
 add('Tour Edge','Exotics Max','heelRetention',94,.78,'Independent forgiveness/dispersion results support strong off-center protection.');
 add('Tour Edge','Exotics Max','speedPotential',76,.80,'Independent mid-speed testing found ball speed/distance closer to average than category leaders.');
 add('Tour Edge','Exotics Max','spinSupport',90,.74,'Independent testing reported a comparatively higher-spin profile, useful when spin preservation is needed.');

 add('TaylorMade','Qi4D','speedPotential',93,.82,'Independent mid-speed testing showed strong distance and ball-speed performance.');
 add('TaylorMade','Qi4D','toeRetention',91,.76,'Independent accuracy/forgiveness results plus documented Twist Face support off-center playability.');
 add('TaylorMade','Qi4D','heelRetention',91,.76,'Independent accuracy/forgiveness results plus documented Twist Face support off-center playability.');
 add('TaylorMade','Qi4D','spinConsistency',92,.76,'Independent performance plus documented roll-radius design support consistent spin across vertical strike.');
 add('TaylorMade','Qi4D','stability',90,.76,'Independent mid-speed testing showed a strong all-around accuracy/forgiveness profile.');

 add('TaylorMade','Qi4D Max','speedPotential',80,.78,'Independent mid-speed testing showed less distance than the standard Qi4D.');
 add('TaylorMade','Qi4D Max','stability',85,.76,'Independent mid-speed testing did not support assuming Max branding equals class-leading overall forgiveness.');

 add('Callaway','Quantum Max','speedPotential',97,.86,'Independent mid-speed testing identified Quantum Max as a distance leader.');
 add('Callaway','Quantum Max','toeRetention',86,.74,'Independent forgiveness was good but not category-leading at mid speed; avoid generic max-head assumptions.');
 add('Callaway','Quantum Max','heelRetention',86,.74,'Independent forgiveness was good but not category-leading at mid speed; avoid generic max-head assumptions.');
 add('Callaway','Quantum Max','stability',86,.76,'Independent mid-speed testing showed strong overall performance with forgiveness trailing its distance/accuracy strengths.');

 add('PING','G440 K','speedPotential',94,.80,'Independent mid-speed testing showed strong distance, including good performance on mishits.');
 add('PING','G440 K','stability',91,.78,'Independent results support high stability, while avoiding an automatic perfect score from MOI claims alone.');
 add('PING','G440 K','toeRetention',92,.78,'Independent mishit-distance results and high-MOI architecture support strong toe-side retention.');
 add('PING','G440 K','heelRetention',92,.78,'Independent mishit-distance results and high-MOI architecture support strong heel-side retention.');

 const prior=E.evidenceFor.bind(E);
 E.evidenceFor=function(p){
   const out=prior(p),dims=Object.values(out.dimensions||{}).filter(x=>x&&Array.isArray(x.evidence));
   const records=dims.flatMap(x=>x.evidence||[]),specific=records.filter(r=>['independent_measured','independent_summary','manufacturer_measured','manufacturer_documented'].includes(r.sourceType));
   const independent=specific.filter(r=>String(r.sourceType).startsWith('independent_'));
   const coverage=Math.min(1,specific.length/7),independentCoverage=Math.min(1,independent.length/5);
   out.modelSpecificRecords=specific.length;out.independentRecords=independent.length;out.supportLevel=independent.length>=3?'Independent evidence':specific.length>=3?'Model-specific evidence':'Mostly modeled evidence';out.coverageScore=Math.round((coverage*.65+independentCoverage*.35)*100);
   return out;
 };
 window.FORM_DRIVER_EVIDENCE_V83={version:'8.3',source:'2026 independent + manufacturer evidence',notes:'External results are normalized into FORM dimensions; third-party overall scores are not copied into FORM Fit.'};
 return true;
}
let tries=0,t=setInterval(()=>{tries++;if(init()||tries>100)clearInterval(t);},50);
})();