/* FORM Driver config regression v229 — expanded exact/range/general/config interaction coverage. */
(function(){
'use strict';
function clone(v){return JSON.parse(JSON.stringify(v));}
function setMetric(id,mode,value){state.metrics=state.metrics||{};state.metrics[id]={mode,value};}
function applyMetrics(metrics){for(const [id,m] of Object.entries(metrics||{}))setMetric(id,m.mode,m.value);}
function snap(id,{metrics={},product={}}={}){
 const saved=clone(state);
 try{
  applyMetrics(metrics);
  const r=window.FORM_DRIVER_CONFIG_V81.loftFit(product);
  return {id,metrics:clone(metrics),product:clone(product),loft:r.loft,range:r.range,reason:r.reason,conflict:r.conflict};
 } finally {Object.keys(state).forEach(k=>delete state[k]);Object.assign(state,saved);}
}
const ex=(speed,launch,spin,aoa=2)=>({speed:{mode:'exact',value:speed},launch:{mode:'exact',value:launch},spin:{mode:'exact',value:spin},aoa:{mode:'exact',value:aoa}});
function run(){
 const cases=[];
 const add=(id,opt)=>cases.push(snap(id,opt));
 // Range representatives around the same boundary neighborhoods.
 add('RG_L_LOW',{metrics:{speed:{mode:'range',value:'95-99'},launch:{mode:'range',value:'10-12'},spin:{mode:'range',value:'2250-2499'},aoa:{mode:'exact',value:3}}});
 add('RG_L_MID',{metrics:{speed:{mode:'range',value:'95-99'},launch:{mode:'range',value:'12-14'},spin:{mode:'range',value:'2250-2499'},aoa:{mode:'exact',value:3}}});
 add('RG_S_LOW',{metrics:{speed:{mode:'range',value:'95-99'},launch:{mode:'range',value:'12-14'},spin:{mode:'range',value:'2000-2249'},aoa:{mode:'exact',value:3}}});
 add('RG_S_MID',{metrics:{speed:{mode:'range',value:'95-99'},launch:{mode:'range',value:'12-14'},spin:{mode:'range',value:'2250-2499'},aoa:{mode:'exact',value:3}}});
 add('RG_S_HIGH',{metrics:{speed:{mode:'range',value:'95-99'},launch:{mode:'range',value:'12-14'},spin:{mode:'range',value:'3000-3499'},aoa:{mode:'exact',value:3}}});
 // General-mode fallbacks must be identical to legacy behavior.
 add('GEN_LOW',{metrics:{speed:{mode:'general',value:'typical'},launch:{mode:'general',value:'low'},spin:{mode:'general',value:'low'},aoa:{mode:'unknown',value:null}}});
 add('GEN_HIGH',{metrics:{speed:{mode:'general',value:'typical'},launch:{mode:'general',value:'high'},spin:{mode:'general',value:'high'},aoa:{mode:'unknown',value:null}}});
 add('GEN_CONFLICT',{metrics:{speed:{mode:'general',value:'typical'},launch:{mode:'general',value:'low'},spin:{mode:'general',value:'high'},aoa:{mode:'unknown',value:null}}});
 add('GEN_VARIES',{metrics:{speed:{mode:'general',value:'typical'},launch:{mode:'general',value:'varies'},spin:{mode:'general',value:'varies'},aoa:{mode:'unknown',value:null}}});
 // Dense speed neighborhood: fixed measured launch/spin, only speed moves.
 for(const s of [68,70,72,75,80,85,90,92,94,95,96,98,100,102,105,108])add(`SPD_${s}`,{metrics:ex(s,12,2600,2)});
 // Launch sweep at 95 mph / neutral-ish spin.
 for(const l of [7,8,9,10,11,12,13,14,15,16,17,18,19])add(`LA_${l}`,{metrics:ex(95,l,2450,2)});
 // Spin sweep at 95 mph / neutral-ish launch.
 for(const sp of [1400,1600,1800,2000,2100,2200,2300,2450,2600,2800,3000,3200,3500])add(`SP_${sp}`,{metrics:ex(95,12.5,sp,2)});
 // Combined interactions with AoA + low-spin head trait.
 add('COMBO_DOWN_LOW',{metrics:ex(95,10,1900,-3),product:{player:'lowspin'}});
 add('COMBO_UP_HIGH',{metrics:ex(95,17.5,3200,5),product:{player:'lowspin'}});
 add('COMBO_DOWN_NEUTRAL',{metrics:ex(95,12.5,2450,-3),product:{player:'lowspin'}});
 add('COMBO_UP_NEUTRAL',{metrics:ex(95,12.5,2450,5),product:{player:'lowspin'}});
 return {generatedAt:new Date().toISOString(),rows:cases};
}
window.FORM_DRIVER_CONFIG_REGRESSION_V229={run};
})();
