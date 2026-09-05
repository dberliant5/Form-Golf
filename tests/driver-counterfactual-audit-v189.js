// FORM 10.91 — manual counterfactual audit harness for the live driver engine.
// Not loaded in production. Run locally/devtools after FORM is loaded. No GitHub Actions required.
(function(){'use strict';
function clone(v){return JSON.parse(JSON.stringify(v));}
function golferNow(){return typeof golfer==='function'?golfer():{};}
function rows(){return window.FORM_DRIVER_ENGINE_V80?.winners(golferNow()).slice(0,5)||[];}
function summary(label){const r=rows();return {label,top:r[0]?`${r[0].p.brand} ${r[0].p.model}`:null,topScore:r[0]?.s?.overall??null,second:r[1]?`${r[1].p.brand} ${r[1].p.model}`:null,gap:r[1]?Math.round((r[0].s.overall-r[1].s.overall)*10)/10:null,components:Object.fromEntries((r[0]?.s?.components||[]).map(x=>[x.key,x.score]))};}
function setMetric(id,mode,value){state.metrics[id]={mode,value};}
function run(){if(typeof state==='undefined'||!window.FORM_DRIVER_ENGINE_V80)throw new Error('Load FORM driver fitting first.');const saved=clone(state),out=[];try{
 out.push(summary('baseline'));
 setMetric('aoa','exact',-4);out.push(summary('aoa -4'));
 setMetric('aoa','exact',4);out.push(summary('aoa +4'));
 Object.assign(state,clone(saved));setMetric('launch','exact',9);out.push(summary('launch 9'));
 setMetric('launch','exact',18);out.push(summary('launch 18'));
 Object.assign(state,clone(saved));setMetric('spin','exact',1800);out.push(summary('spin 1800'));
 setMetric('spin','exact',3300);out.push(summary('spin 3300'));
 Object.assign(state,clone(saved));state.strike='heel';out.push(summary('heel strike'));
 state.strike='center';out.push(summary('center strike'));
 Object.assign(state,clone(saved));state.strike='toe';out.push(summary('toe strike'));
 Object.assign(state,clone(saved));if(state.ranks){state.ranks.accuracy=1;state.ranks.distance=3;state.ranks.flight=2;}out.push(summary('accuracy priority'));
 if(state.ranks){state.ranks.distance=1;state.ranks.accuracy=3;state.ranks.flight=2;}out.push(summary('distance priority'));
 return out;
 }finally{Object.keys(state).forEach(k=>delete state[k]);Object.assign(state,saved);}}
function invariants(){const saved=clone(state),base=rows().map(r=>[`${r.p.brand}|${r.p.model}`,r.s.overall]);try{if(!state.currentClub)state.currentClub={};state.currentClub.brand='__counterfactual__';state.currentClub.model='__counterfactual__';const changed=rows().map(r=>[`${r.p.brand}|${r.p.model}`,r.s.overall]);return {currentClubDoesNotChangeAbsoluteFit:JSON.stringify(base)===JSON.stringify(changed),baseline:base,afterCurrentClubChange:changed};}finally{Object.keys(state).forEach(k=>delete state[k]);Object.assign(state,saved);}}
window.FORM_DRIVER_COUNTERFACTUAL_AUDIT_V189={run,invariants};
})();