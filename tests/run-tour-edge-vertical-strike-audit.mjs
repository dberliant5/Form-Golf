import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844}});
await page.goto('http://127.0.0.1:8080/?audit='+Date.now(),{waitUntil:'networkidle',timeout:45000});
await page.waitForFunction(()=>!!window.FORM_DRIVER_ENGINE_V80&&!!window.FORM_DRIVER_EVIDENCE_V80,{timeout:30000});
const report=await page.evaluate(()=>{
  const key=p=>p.brand+'|'+p.model;
  const wanted=new Set(['Tour Edge|Exotics Max','TaylorMade|Qi4D','TaylorMade|Qi4D Max','PING|G440 K','Callaway|Quantum Max','Cobra|OPTM MAX-K','Titleist|GTS2']);
  const ps=products.filter(p=>wanted.has(key(p)));
  const metric=(id,mode,value)=>{state.metrics=state.metrics||{};state.metrics[id]={mode,value};};
  function setBase(o){
    state.start='straight';state.curve='draw';state.costly='hook';state.strike=o.strike||'toe';state.strikeSource='confirmed';state.lm='has';state.transition='neutral';state.current='mixed';
    state.driverPrioritySplit={accuracy:o.acc||65,distance:100-(o.acc||65),touched:true};state.priorityWeights={accuracy:o.acc||65,distance:100-(o.acc||65),touched:true};
    metric('speed','exact',o.speed||97);metric('launch','exact',o.launch||13);metric('spin','exact',o.spin||2600);metric('ballSpeed','unknown',null);metric('carry','unknown',null);metric('aoa','unknown',null);
  }
  function snap(label,o){setBase(o||{});const g=normalizedGolferV69();const rows=FORM_DRIVER_ENGINE_V80.winners(g);return {label,top:rows.slice(0,9).map(r=>({key:key(r.p),score:r.s.overall,raw:r.s.raw,evidenceQuality:r.s.evidenceQuality,components:Object.fromEntries(r.s.components.map(c=>[c.key,{score:c.score,weight:c.normalizedWeight,impact:c.impact,evidenceConfidence:c.evidenceConfidence}]))}))};}
  const scenarios=[];for(const speed of [92,97,102])for(const launch of [11,13,15])for(const spin of [2200,2600,3000])scenarios.push(snap('s'+speed+' l'+launch+' sp'+spin,{speed,launch,spin,strike:'toe',acc:65}));
  const strikeVariants=['center','toe','heel','varied'].map(strike=>snap('strike-'+strike,{strike,speed:97,launch:13,spin:2600,acc:65}));
  const priorityVariants=[50,65,80].map(acc=>snap('accuracy-'+acc,{strike:'toe',speed:97,launch:13,spin:2600,acc}));
  const evidence={};for(const p of ps){const e=FORM_DRIVER_EVIDENCE_V80.evidenceFor(p);evidence[key(p)]={catalog:{launch:p.launch,spin:p.spin,forgiveness:p.forgiveness,draw_bias:p.draw_bias,speed_fit:p.speed_fit,player:p.player},supportLevel:e.supportLevel,coverageScore:e.coverageScore,provenPerformance:e.provenPerformance,dimensions:Object.fromEntries(Object.entries(e.dimensions||{}).map(([k,v])=>[k,{value:v?.value,confidence:v?.confidence,preValidationValue:v?.preValidationValue,validationTarget:v?.validationTarget}]))};}
  const wins={};for(const s of scenarios){const k=s.top[0]?.key||'none';wins[k]=(wins[k]||0)+1;}
  return {targetProducts:ps.map(key),scenarioWinCounts:wins,scenarios,strikeVariants,priorityVariants,evidence,verticalStrikeSupported:['strikeVertical','verticalStrike','strikeHeight'].some(k=>k in state),stateStrikeKeys:Object.keys(state).filter(k=>/strike|impact|face/i.test(k))};
});
console.log(JSON.stringify(report,null,2));
await browser.close();
