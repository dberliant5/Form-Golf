import { chromium } from 'playwright';

const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900}});
const errs=[];
page.on('pageerror',e=>errs.push(e.message));

try{
  await page.goto('http://127.0.0.1:8080/?verticalCandidate='+Date.now(),{waitUntil:'networkidle',timeout:45000});
  await page.waitForFunction(()=>!!window.FORM_DRIVER_VERTICAL_STRIKE_V235&&!!window.FORM_DRIVER_ENGINE_V80&&typeof state!=='undefined',null,{timeout:30000});

  const report=await page.evaluate(()=>{
    const V=window.FORM_DRIVER_VERTICAL_STRIKE_V235;
    const ENG=window.FORM_DRIVER_ENGINE_V80;
    const clone=v=>JSON.parse(JSON.stringify(v));
    const r1=v=>Math.round(Number(v||0)*10)/10;
    const saved=clone(state);

    function setMetric(id,mode,value){state.metrics=state.metrics||{};state.metrics[id]={mode,value};}
    function golferProfile({vertical='high',consistency='mostly',strike='toe',brand=null,model=null}={}){
      setMetric('speed','exact',95);setMetric('aoa','exact',5);setMetric('launch','exact',13);setMetric('spin','exact',1800);
      setMetric('ballSpeed','unknown',null);setMetric('carry','unknown',null);
      state.strike=strike;state.strikeSource='confirmed';state.strikeVertical=vertical;state.strikeConsistency=consistency;
      state.curve='hook';state.curveClass='draw_curve';state.costly='left';
      const g=typeof normalizedGolferV69==='function'?normalizedGolferV69():golfer();
      Object.assign(g,{strike,strikeSource:'confirmed',strikeVertical:vertical,strikeConsistency:consistency,curve:'hook',curveClass:'draw_curve',costly:'left'});
      if(brand||model)g.currentClub={...(g.currentClub||{}),brand:brand||'',model:model||''};
      return g;
    }
    function mapRows(rows){return rows.slice(0,12).map(r=>({name:r.p.brand+' '+r.p.model,score:r.s.overall,vertical:r.s.verticalStrikeEvidence||null}));}
    function rowBy(rows,name){return rows.find(r=>(r.p.brand+' '+r.p.model)===name);}
    function runCase(opts){
      const g=golferProfile(opts);
      const base=V.priorWinners(g);
      const cand=ENG.winners(g);
      return {g,base:mapRows(base),cand:mapRows(cand)};
    }

    try{
      const highMostly=runCase({vertical:'high',consistency:'mostly'});
      const highTends=runCase({vertical:'high',consistency:'tends'});
      const highUnknown=runCase({vertical:'high',consistency:'unknown'});
      const middleMostly=runCase({vertical:'middle',consistency:'mostly'});
      const lowMostly=runCase({vertical:'low',consistency:'mostly'});
      const centerHigh=runCase({vertical:'high',consistency:'mostly',strike:'center'});

      const exactNames=['TaylorMade Qi4D','PING G440 K','Cobra OPTM MAX-K'];
      const neutralNames=['Tour Edge Exotics Max','Callaway Quantum Max','TaylorMade Qi4D Max','PING G440 MAX','Cobra OPTM LS'];

      const deltas=name=>{
        const b=highMostly.base.find(x=>x.name===name),c=highMostly.cand.find(x=>x.name===name);
        return b&&c?r1(c.score-b.score):null;
      };

      const missingNeutral=neutralNames.map(name=>({name,delta:deltas(name)}));
      const exactDeltas=exactNames.map(name=>({name,delta:deltas(name)}));

      const gCurrent=golferProfile({vertical:'high',consistency:'mostly',brand:'TaylorMade',model:'Qi4D'});
      const currentBase=V.priorCurrent(gCurrent);
      const currentCand=ENG.currentScore(gCurrent);
      const currentDelta=currentBase?.score!=null&&currentCand?.score!=null?r1(currentCand.score-currentBase.score):null;

      return {
        productionCandidateVersion:V.version,
        highMostly,
        highTends,
        highUnknown,
        middleMostly,
        lowMostly,
        centerHigh,
        exactDeltas,
        missingNeutral,
        currentQi4D:{base:currentBase?.score??null,candidate:currentCand?.score??null,delta:currentDelta,vertical:currentCand?.detail?.verticalStrikeEvidence||null}
      };
    }finally{
      Object.keys(state).forEach(k=>delete state[k]);Object.assign(state,saved);
    }
  });

  function byName(rows,name){return rows.find(x=>x.name===name);}
  const hm=report.highMostly;
  const expected={'TaylorMade Qi4D':0.5,'PING G440 K':0.5,'Cobra OPTM MAX-K':-0.6};
  for(const [name,delta] of Object.entries(expected)){
    const b=byName(hm.base,name),c=byName(hm.cand,name);
    if(!b||!c)throw new Error('Missing exact-evidence model '+name);
    const got=Math.round((c.score-b.score)*10)/10;
    if(got!==delta)throw new Error(name+' high-toe adjustment expected '+delta+' got '+got);
  }
  for(const name of ['Tour Edge Exotics Max','Callaway Quantum Max','TaylorMade Qi4D Max','PING G440 MAX','Cobra OPTM LS']){
    const b=byName(hm.base,name),c=byName(hm.cand,name);
    if(b&&c&&b.score!==c.score)throw new Error('Missing/non-exact evidence model changed: '+name);
  }

  const ht=report.highTends;
  for(const [name,delta] of Object.entries({'TaylorMade Qi4D':0.3,'PING G440 K':0.3,'Cobra OPTM MAX-K':-0.4})){
    const b=byName(ht.base,name),c=byName(ht.cand,name);const got=Math.round((c.score-b.score)*10)/10;
    if(got!==delta)throw new Error(name+' tends adjustment expected '+delta+' got '+got);
  }

  for(const pair of report.highUnknown.base){
    const c=byName(report.highUnknown.cand,pair.name);
    if(c&&pair.score!==c.score)throw new Error('Unknown consistency changed '+pair.name);
  }
  for(const pair of report.centerHigh.base){
    const c=byName(report.centerHigh.cand,pair.name);
    if(c&&pair.score!==c.score)throw new Error('Center strike received vertical toe adjustment: '+pair.name);
  }

  if(report.currentQi4D.delta!==0.5)throw new Error('Current-gamer Qi4D parity failed: '+JSON.stringify(report.currentQi4D));

  if(errs.length)throw new Error('Browser errors: '+JSON.stringify(errs));
  console.log(JSON.stringify({ok:true,...report},null,2));
}finally{
  await browser.close();
}
