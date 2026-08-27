// FORM 8.3.2 — evidence hygiene: external coverage may strengthen confidence only after cross-brand normalization
(function(){
'use strict';
function init(){
 const E=window.FORM_DRIVER_EVIDENCE_V80;if(!E||typeof products==='undefined'||!Array.isArray(products))return false;
 // Keep the current recommendation pool clean.
 products.forEach(p=>{
   if((p.brand==='PXG'&&/Black Ops/i.test(p.model||''))||(p.brand==='Titleist'&&/^GT[234]$/i.test(p.model||'')))p.generation='previous_limited';
 });
 // IMPORTANT: the earlier 8.3 prototype blended a handful of independent summaries directly
 // into normalized performance values. Because equivalent coverage did not exist for every
 // current manufacturer, that could change rank order simply because one model had more external
 // coverage. FORM now refuses to use selective external performance values in Fit Score until a
 // normalized apples-to-apples cross-brand dataset is populated. Manufacturer/model-specific
 // evidence already present in the 8.0 evidence model remains available, and uncertainty remains
 // visible through Evidence Strength.
 const prior=E.evidenceFor.bind(E);
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
   return out;
 };
 window.FORM_DRIVER_EVIDENCE_V83={version:'8.3.2',source:'FORM modeled + normalized model-specific documentation',notes:'Selective external summaries are not allowed to move Fit Score until equivalent cross-brand normalization exists.'};
 return true;
}
let tries=0,t=setInterval(()=>{tries++;if(init()||tries>100)clearInterval(t);},50);
})();