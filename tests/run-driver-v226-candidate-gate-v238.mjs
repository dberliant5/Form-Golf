import { chromium } from 'playwright';

const base = process.env.FORM_BASE_URL || 'http://127.0.0.1:8080';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const failures=[]; const checks=[];
const fail=(name,detail)=>failures.push({name,detail});
const pass=(name,detail)=>checks.push({name,detail});

try{
  await page.goto(`${base}/index.html`,{waitUntil:'networkidle',timeout:30000});
  await page.waitForFunction(()=>window.FORM_DRIVER_ENGINE_V80,null,{timeout:15000});
  const report=await page.evaluate(async()=>{
    const clone=v=>JSON.parse(JSON.stringify(v));
    const setMetric=(id,mode,value)=>{state.metrics=state.metrics||{};state.metrics[id]={mode,value};};
    const unknown=id=>setMetric(id,'unknown',null);
    const golferNow=()=>typeof normalizedGolferV69==='function'?normalizedGolferV69():golfer();
    const pname=p=>`${p.brand} ${p.model}`;
    const restore=s=>{Object.keys(state).forEach(k=>delete state[k]);Object.assign(state,s);};
    const source225=await fetch('assets/driver-engine-v225.js').then(r=>r.text());
    const source226=await fetch('assets/driver-engine-v226.js').then(r=>r.text());
    const exportNeedle='window.FORM_DRIVER_ENGINE_V80={scoreOne,winners,currentScore,compare};';
    const expose=s=>s.replace(exportNeedle,'window.FORM_DRIVER_ENGINE_V80={scoreOne,winners,currentScore,compare,recommendation};');
    (0,eval)(expose(source225)); const e225=window.FORM_DRIVER_ENGINE_V80;
    (0,eval)(expose(source226)); const e226=window.FORM_DRIVER_ENGINE_V80;

    const profiles=[
      {id:'mid-right',apply:()=>{setMetric('speed','exact',95);setMetric('aoa','exact',3);setMetric('launch','exact',11);setMetric('spin','exact',2300);unknown('ballSpeed');unknown('carry');}},
      {id:'slow-low',apply:()=>{setMetric('speed','exact',80);setMetric('aoa','exact',1);setMetric('launch','exact',9);setMetric('spin','exact',1850);unknown('ballSpeed');unknown('carry');}},
      {id:'fast-high',apply:()=>{setMetric('speed','exact',107);setMetric('aoa','exact',4);setMetric('launch','exact',19);setMetric('spin','exact',3250);unknown('ballSpeed');unknown('carry');}},
      {id:'range',apply:()=>{setMetric('speed','range','95-99');setMetric('aoa','general','up');setMetric('launch','range','10-12');setMetric('spin','range','2250-2499');unknown('ballSpeed');unknown('carry');}},
      {id:'sparse',apply:()=>{unknown('speed');unknown('aoa');unknown('launch');unknown('spin');unknown('ballSpeed');unknown('carry');}}
    ];
    const parity=[];
    for(const def of profiles){
      const saved=clone(state); try{
        def.apply(); const g=clone(golferNow()); Object.assign(g,{strike:def.id==='fast-high'?'toe':'center',curveClass:'fade_curve',costly:'right'});
        const a=e225.winners(g).slice(0,9).map(r=>({name:pname(r.p),score:r.s.overall,raw:r.s.raw}));
        const b=e226.winners(g).slice(0,9).map(r=>({name:pname(r.p),score:r.s.overall,raw:r.s.raw}));
        parity.push({id:def.id,a,b,same:JSON.stringify(a)===JSON.stringify(b)});
      } finally {restore(saved);}
    }

    const baseGolfer=clone(golferNow()); baseGolfer.currentClub=baseGolfer.currentClub||{};
    const best=e226.winners({...clone(baseGolfer),currentClub:{}})[0];
    const all=(typeof products!=='undefined'&&Array.isArray(products)?products:[]).filter(p=>p?.brand&&p?.model&&p.generation!=='previous_limited').map(p=>{
      const g={...clone(baseGolfer),currentClub:{brand:p.brand,model:p.model,results:'mixed'}};
      const c225=e225.currentScore(g), c226=e226.currentScore(g);
      return {name:pname(p),hard:c226.detail?.hardConstraints||[],score225:c225.score,score226:c226.score,d225:e225.recommendation(best,c225),d226:e226.recommendation(best,c226)};
    });
    const constrained=all.filter(x=>x.hard.length);
    const ordinary=all.filter(x=>!x.hard.length);
    const changedOrdinary=ordinary.filter(x=>JSON.stringify(x.d225)!==JSON.stringify(x.d226));
    return {parity,constrained,ordinaryCount:ordinary.length,changedOrdinary};
  });

  for(const p of report.parity){if(!p.same)fail(`ranking-parity-${p.id}`,{v225:p.a,v226:p.b});else pass(`ranking-parity-${p.id}`,'v225 and v226 rankings/scores identical');}
  if(report.constrained.length!==4)fail('constrained-count',`expected 4 reproduced cases, got ${report.constrained.length}`);else pass('constrained-count','4 hard-constrained exact current drivers reproduced');
  for(const c of report.constrained){
    if(c.score225!==c.score226)fail(`score-unchanged-${c.name}`,`${c.score225} vs ${c.score226}`);
    else pass(`score-unchanged-${c.name}`,`score unchanged at ${c.score226}`);
    if(c.d226.level!=='Worth a side-by-side test')fail(`hard-message-${c.name}`,c.d226);
    else if(/points ahead|point fit advantage|modeled advantage/i.test(c.d226.text))fail(`hard-gap-suppressed-${c.name}`,c.d226.text);
    else pass(`hard-message-${c.name}`,c.d226.text);
  }
  if(report.changedOrdinary.length)fail('ordinary-recommendation-parity',report.changedOrdinary);
  else pass('ordinary-recommendation-parity',`${report.ordinaryCount} unconstrained exact-current recommendations unchanged`);

  console.log(JSON.stringify({generatedAt:new Date().toISOString(),productionScoringChanged:false,failures,checks,report},null,2));
  if(failures.length)process.exitCode=1;
}catch(err){console.error(err);process.exitCode=1;}finally{await browser.close();}
