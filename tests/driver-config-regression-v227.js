/* FORM Driver config regression v227 — records loft/config behavior without changing production. */
(function(){
'use strict';
function clone(v){return JSON.parse(JSON.stringify(v));}
function setMetric(id,mode,value){state.metrics=state.metrics||{};state.metrics[id]={mode,value};}
function snap(id,{speed=95,launch=null,spin=null,aoa=null,product={}}={}){
 const saved=clone(state);
 try{
  setMetric('speed',speed==null?'unknown':'exact',speed);
  setMetric('launch',launch==null?'unknown':'exact',launch);
  setMetric('spin',spin==null?'unknown':'exact',spin);
  setMetric('aoa',aoa==null?'unknown':'exact',aoa);
  const r=window.FORM_DRIVER_CONFIG_V81.loftFit(product);
  return {id,speed,launch,spin,aoa,product,loft:r.loft,range:r.range,reason:r.reason,conflict:r.conflict};
 } finally {
  Object.keys(state).forEach(k=>delete state[k]);Object.assign(state,saved);
 }
}
function pair(a,b){return {pair:`${a.id}->${b.id}`,loftDelta:Math.round((b.loft-a.loft)*10)/10,changed:a.loft!==b.loft,from:a.loft,to:b.loft};}
function run(){
 const rows=[
  snap('L1',{speed:95,launch:10.9,spin:2300,aoa:3}),
  snap('L2',{speed:95,launch:11.1,spin:2300,aoa:3}),
  snap('SL1',{speed:95,launch:12.5,spin:2090,aoa:3}),
  snap('SL2',{speed:95,launch:12.5,spin:2110,aoa:3}),
  snap('SH1',{speed:95,launch:12.5,spin:2990,aoa:3}),
  snap('SH2',{speed:95,launch:12.5,spin:3010,aoa:3}),
  snap('SPD70',{speed:70,launch:12,spin:2600,aoa:2}),
  snap('SPD95',{speed:95,launch:12,spin:2600,aoa:2}),
  snap('SPD105',{speed:105,launch:12,spin:2600,aoa:2}),
  snap('AOAD1',{speed:95,launch:12.5,spin:2450,aoa:-2.1}),
  snap('AOAD2',{speed:95,launch:12.5,spin:2450,aoa:-1.9}),
  snap('AOAU1',{speed:95,launch:12.5,spin:2450,aoa:3.9}),
  snap('AOAU2',{speed:95,launch:12.5,spin:2450,aoa:4.1}),
  snap('CON1',{speed:95,launch:10,spin:3200,aoa:2}),
  snap('CON2',{speed:95,launch:18,spin:1900,aoa:2}),
  snap('LOWSPIN',{speed:95,launch:12.5,spin:2450,aoa:2,product:{player:'lowspin'}}),
  snap('MISSING',{speed:null,launch:null,spin:null,aoa:null})
 ];
 const by=Object.fromEntries(rows.map(x=>[x.id,x]));
 const pairs=[pair(by.L1,by.L2),pair(by.SL1,by.SL2),pair(by.SH1,by.SH2),pair(by.AOAD1,by.AOAD2),pair(by.AOAU1,by.AOAU2)];
 return {generatedAt:new Date().toISOString(),rows,pairs,checks:{speedCurrentlyInvariant:by.SPD70.loft===by.SPD95.loft&&by.SPD95.loft===by.SPD105.loft,missingNeutral:by.MISSING.loft===10.5,lowspinHeadAddsHalf:by.LOWSPIN.loft===11}};
}
window.FORM_DRIVER_CONFIG_REGRESSION_V227={run};
})();
