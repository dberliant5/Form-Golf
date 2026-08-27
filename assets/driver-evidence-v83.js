// FORM 8.3.3 — evidence hygiene + capped golfer-independent product-quality floor
(function(){
'use strict';
function init(){
 const E=window.FORM_DRIVER_EVIDENCE_V80;if(!E||typeof products==='undefined'||!Array.isArray(products))return false;
 products.forEach(p=>{
   if((p.brand==='PXG'&&/Black Ops/i.test(p.model||''))||(p.brand==='Titleist'&&/^GT[234]$/i.test(p.model||'')))p.generation='previous_limited';
 });
 const prior=E.evidenceFor.bind(E);
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function dimVal(d,fallback=80){return Number.isFinite(+d?.value)?+d.value:fallback;}
 function productQualityFloor(out){
   const d=out.dimensions||{},ret=(dimVal(d.toeRetention)+dimVal(d.heelRetention))/2;
   // Golfer-independent breadth: a premium product should be broadly strong even before we know
   // who is swinging it. This is deliberately NOT brand reputation, price, tour usage or popularity.
   const score=
     dimVal(d.stability)*.20+
     ret*.18+
     dimVal(d.speedPotential)*.18+
     dimVal(d.spinConsistency)*.15+
     dimVal(d.launchConsistency)*.10+
     dimVal(d.adjustability)*.19;
   return Math.round(score*10)/10;
 }
 E.evidenceFor=function(p){
   const out=prior(p),dims=Object.values(out.dimensions||{}).filter(x=>x&&Array.isArray(x.evidence));
   const records=dims.flatMap(x=>x.evidence||[]);
   const modelSpecific=records.filter(r=>['independent_measured','independent_summary','manufacturer_measured','manufacturer_documented'].includes(r.sourceType));
   const independent=modelSpecific.filter(r=>String(r.sourceType).startsWith('independent_'));
   const documented=modelSpecific.filter(r=>String(r.sourceType).startsWith('manufacturer_'));
   out.modelSpecificRecords=modelSpecific.length;
   out.independentRecords=independent.length;
   out.documentedRecords=documented.length;
   out.supportLevel=independent.length>=3?'Independent evidence':documented.length>=3?'Model-specific documented evidence':'Mostly modeled evidence';
   out.coverageScore=Math.min(100,Math.round((documented.length/6)*70+(independent.length/5)*30));
   out.crossBrandNormalized=false;

   // Quality is allowed to move ranking only slightly. The raw score is centered around 85 and
   // converted into a maximum +/-1.25 point correction to the product's modeled dimensions.
   // This lets a broadly excellent, highly configurable head win a near-tie without allowing
   // generic quality to overpower a clearly superior golfer-specific fit.
   const q=productQualityFloor(out),adj=Math.round(clamp((q-85)*.16,-1.0,1.25)*100)/100;
   out.productQualityFloor=q;out.qualityAdjustment=adj;
   Object.entries(out.dimensions||{}).forEach(([key,dim])=>{
     if(key==='speedWindow'||!dim||!Number.isFinite(+dim.value))return;
     dim.value=Math.round(clamp(+dim.value+adj,0,100)*10)/10;
   });
   return out;
 };
 window.FORM_DRIVER_EVIDENCE_V83={version:'8.3.3',source:'FORM modeled + normalized model-specific documentation',notes:'Selective external summaries cannot directly move Fit Score without cross-brand normalization. A capped golfer-independent product-quality floor may break close fits using broad performance and configurability, never brand prestige.'};
 return true;
}
let tries=0,t=setInterval(()=>{tries++;if(init()||tries>100)clearInterval(t);},50);
})();