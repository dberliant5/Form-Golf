// FORM AoA regression audit — TEST ONLY. No production scoring changes.
// Purpose: verify whether angle of attack independently changes driver fit when every other input is held constant.
(function(){
'use strict';
const clone=v=>JSON.parse(JSON.stringify(v));
const engine=()=>window.FORM_DRIVER_ENGINE_V80;
const golferNow=()=>typeof normalizedGolferV69==='function'?normalizedGolferV69():(typeof golfer==='function'?golfer():{});
const name=r=>r?`${r.p.brand} ${r.p.model}`:null;
function metric(id,mode,value){state.metrics=state.metrics||{};state.metrics[id]={mode,value};}
function snapshot(label,aoa){
  metric('speed','exact',95);metric('launch','exact',11.5);metric('spin','exact',2300);metric('aoa','exact',aoa);metric('ballSpeed','unknown',null);metric('carry','unknown',null);
  const g=golferNow();g.strike='center';g.curveClass='fade_curve';g.costly='right';
  const rows=engine().winners(g).slice(0,10);
  return {label,aoa,top10:rows.map((r,i)=>({rank:i+1,product:name(r),score:r.s.overall,raw:r.s.raw,components:Object.fromEntries((r.s.components||[]).map(c=>[c.key,{score:c.score,weight:c.normalizedWeight}]))}))};
}
function same(a,b){return JSON.stringify(a.top10)===JSON.stringify(b.top10);}
function run(){
  if(typeof state==='undefined'||!engine())throw new Error('Load FORM driver fitting before the AoA audit.');
  const saved=clone(state);try{
    const down=snapshot('A01',-4),neutral=snapshot('A02',0),up=snapshot('A03',4);
    const report={generatedAt:new Date().toISOString(),cases:[down,neutral,up],checks:{minus4Vs0Identical:same(down,neutral),zeroVsPlus4Identical:same(neutral,up),minus4VsPlus4Identical:same(down,up)},interpretation:'If all three are identical, AoA is currently collected but has no independent effect on FORM_DRIVER_ENGINE_V80 scoring.'};
    console.table(report.cases.map(x=>({id:x.label,aoa:x.aoa,top:x.top10[0]?.product,score:x.top10[0]?.score})));
    console.log('AoA invariance checks',report.checks);return report;
  }finally{Object.keys(state).forEach(k=>delete state[k]);Object.assign(state,saved);}
}
window.FORM_DRIVER_AOA_REGRESSION_V220={run};
})();
