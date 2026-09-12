import { chromium } from 'playwright';

const base=process.env.FORM_URL||'http://127.0.0.1:8080';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage();

const VERTICAL={
  'TaylorMade Qi4D':{
    source:'Golf Digest / Golf Laboratories, 95 mph, 9-zone, 6 shots per zone',
    center:222.2,
    toe:{high:223.6,middle:225.8,low:211.3},
    direct:true
  },
  'PING G440 K':{
    source:'Golf Digest / Golf Laboratories, 95 mph; toe-zone table',
    center:224.4,
    toe:{high:223.6,middle:228.3,low:213.6},
    direct:true
  },
  'Cobra OPTM MAX-K':{
    source:'Golf Digest / Golf Laboratories, 95 mph, 9-zone, 6 shots per zone',
    center:221.4,
    toe:{high:208.5,middle:203.7,low:199.9},
    direct:true
  },
  'Callaway Quantum Max':{
    source:'Golf Digest / Golf Laboratories family-level 9-zone article; exact standard-head high-toe cell not defensibly extracted',
    direct:false
  },
  'Tour Edge Exotics Max':{
    source:'No comparable public Golf Laboratories 9-zone result found; independent aggregate forgiveness exists but is not vertical-zone evidence',
    direct:false
  }
};

const r1=n=>Math.round(n*10)/10;
function zoneDelta(name,vertical){
  const e=VERTICAL[name];
  if(!e?.direct||!e.toe?.[vertical]||!Number.isFinite(e.center)) return null;
  return r1(e.toe[vertical]-e.center);
}
function sensitivity(rows,vertical,cap){
  return rows.map(r=>{
    const delta=zoneDelta(r.name,vertical);
    // TEST ONLY: monotonic sensitivity envelope, not a proposed production formula.
    // +/-10 yards of zone-vs-center carry maps to +/- cap Fit points; unknown stays neutral.
    const adjustment=delta==null?0:Math.max(-cap,Math.min(cap,delta/10*cap));
    return {...r,verticalDeltaYds:delta,adjustment:r1(adjustment),sensitivityScore:r1(r.score+adjustment),evidenceKnown:delta!=null};
  }).sort((a,b)=>b.sensitivityScore-a.sensitivityScore||b.score-a.score);
}

try{
  await page.goto(base+'/?verticalAudit='+Date.now(),{waitUntil:'networkidle',timeout:45000});
  await page.waitForFunction(()=>!!window.FORM_DRIVER_ENGINE_V80&&typeof state!=='undefined',null,{timeout:30000});
  const baseline=await page.evaluate(()=>{
    const saved=JSON.parse(JSON.stringify(state));
    const setMetric=(id,mode,value)=>{state.metrics=state.metrics||{};state.metrics[id]={mode,value};};
    try{
      setMetric('speed','exact',95);
      setMetric('aoa','exact',5);
      setMetric('launch','exact',13);
      setMetric('spin','exact',1800);
      setMetric('ballSpeed','unknown',null);
      setMetric('carry','unknown',null);
      state.driverPrioritySplit={accuracy:75,distance:25,touched:true};
      state.priorityWeights={accuracy:75,distance:25,touched:true};
      state.strike='toe';
      state.strikeSource='confirmed';
      state.strikeVertical='high';
      state.curve='hook';
      state.curveClass='draw_curve';
      state.costly='left';
      const g=typeof normalizedGolferV69==='function'?normalizedGolferV69():golfer();
      g.strike='toe';g.strikeSource='confirmed';g.strikeVertical='high';g.curve='hook';g.curveClass='draw_curve';g.costly='left';
      return FORM_DRIVER_ENGINE_V80.winners(g).slice(0,5).map(x=>({name:x.p.brand+' '+x.p.model,score:x.s.overall}));
    }finally{
      Object.keys(state).forEach(k=>delete state[k]);
      Object.assign(state,saved);
    }
  });

  const shortlist=['Tour Edge Exotics Max','TaylorMade Qi4D','PING G440 K','Callaway Quantum Max','Cobra OPTM MAX-K'];
  const rows=shortlist.map(name=>{
    const found=baseline.find(x=>x.name===name);
    return {name,score:found?.score??null};
  }).filter(x=>x.score!=null);
  const known=rows.filter(x=>VERTICAL[x.name]?.direct);
  const completeness=rows.length?known.length/rows.length:0;

  const measured=known.map(r=>({
    name:r.name,
    highToeDeltaYds:zoneDelta(r.name,'high'),
    midToeDeltaYds:zoneDelta(r.name,'middle'),
    lowToeDeltaYds:zoneDelta(r.name,'low')
  }));

  const report={
    ok:true,
    productionScoringChanged:false,
    profile:'95 mph, +5 AoA, 13 launch, 1800 spin, confirmed toe, high-toe capture, left/hook tendency, accuracy lean',
    baseline,
    targetShortlist:rows,
    verticalEvidence:VERTICAL,
    evidenceCompleteness:{known:known.length,total:rows.length,ratio:r1(completeness*100)},
    strictActivationGate:{
      rule:'Do not activate vertical scoring for a competitive shortlist unless every materially competitive head has directly comparable zone evidence.',
      passes:known.length===rows.length,
      reason:known.length===rows.length?'All shortlist heads have comparable data.':'Tour Edge Exotics Max and/or Callaway Quantum Max lack an exact comparable high-toe cell.'
    },
    measuredHighToeOrdering:measured.slice().sort((a,b)=>b.highToeDeltaYds-a.highToeDeltaYds),
    sensitivity:{
      note:'Test-only envelopes. Unknown evidence is held neutral; this is intentionally NOT a production formula.',
      capHalfPoint:sensitivity(rows,'high',0.5),
      capOnePoint:sensitivity(rows,'high',1),
      capTwoPoints:sensitivity(rows,'high',2)
    },
    missingDataPolicyFindings:[
      {policy:'unknown=neutral',safe:false,reason:'Known heads can move while untested heads cannot express either upside or downside; ordinal rank can change because of evidence availability.'},
      {policy:'unknown=forgiveness proxy',safe:false,reason:'Aggregate forgiveness does not identify high/middle/low behavior and would invent vertical information.'},
      {policy:'positive-only measured bonus',safe:false,reason:'Rewards brands with published zone data and creates a publication-coverage advantage.'},
      {policy:'strict shortlist completeness gate',safe:true,reason:'Preserves current production ranking until all materially competitive heads can be compared on the same vertical evidence basis.'}
    ]
  };
  if(report.strictActivationGate.passes) throw new Error('Expected evidence-completeness gate to fail for current shortlist.');
  console.log(JSON.stringify(report,null,2));
}finally{
  await browser.close();
}
