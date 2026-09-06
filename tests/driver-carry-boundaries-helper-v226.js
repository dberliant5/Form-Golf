// FORM driver carry-boundary helper v226 — TEST ONLY.
// Runs inside the FORM page so it can access the app's lexical `state` directly.
(function(){
'use strict';
const clone=v=>JSON.parse(JSON.stringify(v));
const golferNow=()=>typeof normalizedGolferV69==='function'?normalizedGolferV69():(typeof golfer==='function'?golfer():{});
function setMetric(id,mode,value){state.metrics=state.metrics||{};state.metrics[id]={mode,value};}
function snap(id,launch,spin){
  const saved=clone(state),g=clone(golferNow());
  try{
    setMetric('speed','exact',95);setMetric('aoa','exact',3);setMetric('launch','exact',launch);setMetric('spin','exact',spin);setMetric('carry','exact',240);setMetric('ballSpeed','unknown',null);
    g.strike='center';g.curveClass='fade_curve';g.costly='right';
    state.ranks=state.ranks||{};Object.assign(state.ranks,{accuracy:2,distance:2,flight:2});
    const top=window.FORM_DRIVER_ENGINE_V80.winners(g)[0];
    return {id,top:top?`${top.p.brand} ${top.p.model}`:null,score:top?.s?.overall??null,carry:top?.s?.components?.find(x=>x.key==='carry')?.score??null,launch:top?.s?.components?.find(x=>x.key==='launch')?.score??null,spin:top?.s?.components?.find(x=>x.key==='spin')?.score??null,componentKeys:(top?.s?.components||[]).map(x=>x.key)};
  } finally {Object.keys(state).forEach(k=>delete state[k]);Object.assign(state,saved);}
}
function pair(a,b){return {pair:`${a.id}->${b.id}`,topChanged:a.top!==b.top,topScoreDelta:Math.round(((b.score??0)-(a.score??0))*10)/10,carryScoreDelta:Math.round(((b.carry??0)-(a.carry??0))*10)/10};}
function run(){
  if(typeof state==='undefined')throw new Error('FORM state is not loaded.');
  const rows=[snap('CL1',10.9,2300),snap('CL2',11.1,2300),snap('CS1',11,2090),snap('CS2',11,2110),snap('CH1',12.5,2990),snap('CH2',12.5,3010)];
  return {rows,pairs:[pair(rows[0],rows[1]),pair(rows[2],rows[3]),pair(rows[4],rows[5])]};
}
window.FORM_DRIVER_CARRY_BOUNDARIES_V226={run};
})();
