import { chromium } from 'playwright';

const base=process.env.FORM_BASE_URL||'http://127.0.0.1:8080';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844}});
const failures=[];
try{
  await page.goto(base+'/static-test-v995.html?cal='+Date.now(),{waitUntil:'networkidle',timeout:45000});
  await page.waitForFunction(()=>!!window.FORM_DRIVER_ALGORITHM_CALIBRATION_V152&&!!window.FORM_DRIVER_ENGINE_V80,null,{timeout:20000});
  const report=await page.evaluate(()=>{
    const A=window.FORM_DRIVER_ALGORITHM_CALIBRATION_V152,E=window.FORM_DRIVER_ENGINE_V80;
    const clone=v=>JSON.parse(JSON.stringify(v));
    const saved=clone(state);
    const setMetric=(id,mode,value)=>{state.metrics=state.metrics||{};state.metrics[id]={mode,value};};
    const restore=()=>{Object.keys(state).forEach(k=>delete state[k]);Object.assign(state,saved);};
    const rank=()=>E.winners(typeof normalizedGolferV69==='function'?normalizedGolferV69():golfer()).slice(0,5).map(x=>[x.p.brand,x.p.model,x.s.overall]);
    try{
      setMetric('speed','range','115plus'); state.transition='neutral';
      const fast=A.shaftFit();
      setMetric('speed','range','95-99'); state.transition='neutral';
      const mid=A.shaftFit();
      setMetric('launch','general','low'); setMetric('spin','general','low'); setMetric('aoa','general','down');
      const before=rank(), loft=A.loftFit(E.winners(typeof normalizedGolferV69==='function'?normalizedGolferV69():golfer())[0]?.p), after=rank();
      return {version:A.version,fast,mid,loft,before,after};
    } finally { restore(); }
  });
  if(report.version!=='10.84') failures.push(['calibration-version',report.version]);
  if(!/X-Stiff/.test(report.fast?.flex||'')) failures.push(['115plus-flex',report.fast]);
  if(!/^\d+–\d+g$/.test(report.fast?.weight||'')) failures.push(['115plus-weight',report.fast]);
  if(!/(Stiff|Regular)/.test(report.mid?.flex||'')) failures.push(['mid-speed-flex',report.mid]);
  if(!Number.isFinite(report.loft?.loft)||report.loft.loft<8||report.loft.loft>12) failures.push(['loft-bounds',report.loft]);
  if(JSON.stringify(report.before)!==JSON.stringify(report.after)) failures.push(['config-does-not-rerank',{before:report.before,after:report.after}]);
  console.log(JSON.stringify({productionScoringChanged:false,failures,report},null,2));
  if(failures.length) process.exitCode=1;
} finally { await browser.close(); }
