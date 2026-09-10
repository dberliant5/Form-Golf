import { chromium } from 'playwright';

const base = process.env.FORM_BASE_URL || 'http://127.0.0.1:8080';
const browser = await chromium.launch({ headless:true });
const page = await browser.newPage();
const failures=[]; const checks=[];
const fail=(name,detail)=>failures.push({name,detail});
const pass=(name,detail)=>checks.push({name,detail});

try {
  await page.goto(`${base}/index.html`,{waitUntil:'networkidle',timeout:30000});
  await page.waitForFunction(()=>window.FORM_DRIVER_ENGINE_V80,null,{timeout:15000});

  const report=await page.evaluate(async()=>{
    const clone=v=>JSON.parse(JSON.stringify(v));
    const baseGolfer=clone(typeof normalizedGolferV69==='function'?normalizedGolferV69():golfer());
    const source=await fetch('assets/driver-engine-v227.js').then(r=>r.text());
    const hook='window.FORM_DRIVER_ENGINE_V80={scoreOne,winners,currentScore,compare};';
    if(!source.includes(hook)) throw new Error('v227 export hook not found');
    (0,eval)(source.replace(hook,'window.__V227={scoreOne,winners,currentScore,compare,recommendation};'));
    const engine=window.__V227;
    const productName=p=>`${p.brand} ${p.model}`;

    const proposedRecommendation=(best,current)=>{
      const original=engine.recommendation(best,current);
      if(original?.level!=='Strong upgrade candidate') return original;
      const eq=current?.detail?.evidenceQuality;
      if(Number.isFinite(eq) && eq < .45){
        const gap=best&&Number.isFinite(current?.score)?Math.round((best.s.overall-current.score)*10)/10:null;
        return {
          level:'Worth a side-by-side test',
          text:`FORM sees a ${gap?.toFixed?.(1) ?? gap}-point modeled fit advantage, but evidence for your current driver is limited. Treat this as a strong reason to test the top fit side-by-side rather than a definitive replacement call.`
        };
      }
      return original;
    };

    const run=p=>{
      const g={...clone(baseGolfer),currentClub:{brand:p.brand,model:p.model}};
      const ranking=engine.winners(g).slice(0,9).map(r=>({name:productName(r.p),overall:r.s.overall,raw:r.s.raw,evidenceQuality:r.s.evidenceQuality}));
      const best=engine.winners(g)[0]||null;
      const current=engine.currentScore(g);
      return {
        currentName:productName(p),ranking,
        current:{score:current.score,label:current.label,detail:current.detail},
        before:engine.recommendation(best,current),
        after:proposedRecommendation(best,current),
        bestName:best?productName(best.p):null,
        bestScore:best?.s?.overall??null
      };
    };

    const active=(typeof products!=='undefined'&&Array.isArray(products)?products:[]).filter(p=>p&&p.brand&&p.model&&p.generation!=='previous_limited');
    const rows=active.map(run);
    const changed=rows.filter(x=>JSON.stringify(x.before)!==JSON.stringify(x.after));
    const limitedChanged=changed.filter(x=>Number.isFinite(x.current.detail?.evidenceQuality)&&x.current.detail.evidenceQuality<.45);
    const nonLimitedChanged=changed.filter(x=>!(Number.isFinite(x.current.detail?.evidenceQuality)&&x.current.detail.evidenceQuality<.45));
    const expectedLimitedStrong=rows.filter(x=>x.before.level==='Strong upgrade candidate'&&Number.isFinite(x.current.detail?.evidenceQuality)&&x.current.detail.evidenceQuality<.45);
    const developingStrong=rows.filter(x=>x.before.level==='Strong upgrade candidate'&&Number.isFinite(x.current.detail?.evidenceQuality)&&x.current.detail.evidenceQuality>=.45);
    const hard=rows.filter(x=>(x.current.detail?.hardConstraints||[]).length);

    const historicalTrials=[
      {brand:'Titleist',model:'TS2 (2018)'},
      {brand:'PING',model:'G400 Max (2018)'},
      {brand:'TaylorMade',model:'M4 (2018)'},
      {brand:'Callaway',model:'Rogue (2018)'}
    ].map(c=>{
      const g={...clone(baseGolfer),currentClub:c};
      const best=engine.winners(g)[0]||null,current=engine.currentScore(g);
      return {club:`${c.brand} ${c.model}`,before:engine.recommendation(best,current),after:proposedRecommendation(best,current),current:{score:current.score,label:current.label,detail:current.detail}};
    });
    const missing=(()=>{const g={...clone(baseGolfer),currentClub:{}};const best=engine.winners(g)[0]||null,current=engine.currentScore(g);return {before:engine.recommendation(best,current),after:proposedRecommendation(best,current)};})();
    return {rows,changed,limitedChanged,nonLimitedChanged,expectedLimitedStrong,developingStrong,hard,historicalTrials,missing};
  });

  if(report.nonLimitedChanged.length) fail('scope-only-limited-evidence',JSON.stringify(report.nonLimitedChanged.map(x=>x.currentName)));
  else pass('scope-only-limited-evidence',`${report.changed.length} decisions changed, all from limited-evidence exact current profiles`);

  if(report.changed.length!==report.expectedLimitedStrong.length) fail('all-and-only-limited-strong',`${report.changed.length} changed vs ${report.expectedLimitedStrong.length} expected`);
  else pass('all-and-only-limited-strong',`${report.changed.length} limited-evidence Strong claims capped`);

  const badLabels=report.changed.filter(x=>x.after.level!=='Worth a side-by-side test'||!/evidence for your current driver is limited/i.test(x.after.text));
  if(badLabels.length) fail('limited-evidence-wording',JSON.stringify(badLabels.map(x=>({name:x.currentName,after:x.after}))));
  else pass('limited-evidence-wording','all capped claims explicitly explain current-driver evidence limitation');

  const developingChanged=report.developingStrong.filter(x=>x.after.level!==x.before.level);
  if(developingChanged.length) fail('developing-strong-preserved',JSON.stringify(developingChanged.map(x=>x.currentName)));
  else pass('developing-strong-preserved',`${report.developingStrong.length} developing-evidence Strong claims preserved`);

  const hardChanged=report.hard.filter(x=>JSON.stringify(x.before)!==JSON.stringify(x.after));
  if(hardChanged.length) fail('hard-constraint-parity',JSON.stringify(hardChanged.map(x=>x.currentName)));
  else pass('hard-constraint-parity',`${report.hard.length} hard-constrained semantics unchanged`);

  const historicalChanged=report.historicalTrials.filter(x=>JSON.stringify(x.before)!==JSON.stringify(x.after));
  if(historicalChanged.length) fail('historical-parity',JSON.stringify(historicalChanged));
  else pass('historical-parity','historical modeled-profile ceiling unchanged across four manufacturers');

  if(JSON.stringify(report.missing.before)!==JSON.stringify(report.missing.after)) fail('missing-current-parity',JSON.stringify(report.missing));
  else pass('missing-current-parity',report.missing.after.level);

  const rankingCorruption=report.rows.filter(x=>!Array.isArray(x.ranking)||!x.ranking.length||x.ranking.some(r=>!Number.isFinite(r.overall)));
  if(rankingCorruption.length) fail('ranking-integrity',JSON.stringify(rankingCorruption.map(x=>x.currentName)));
  else pass('ranking-integrity','candidate adapter touches recommendation language only; all 32 top-9 rankings remain valid production outputs');

  console.log(JSON.stringify({generatedAt:new Date().toISOString(),productionScoringChanged:false,candidateOnly:true,failures,checks,changed:report.changed.map(x=>({currentName:x.currentName,evidenceQuality:x.current.detail?.evidenceQuality,currentScore:x.current.score,bestName:x.bestName,bestScore:x.bestScore,before:x.before,after:x.after}))},null,2));
  if(failures.length) process.exitCode=1;
} catch(err){console.error(err);process.exitCode=1;} finally{await browser.close();}
