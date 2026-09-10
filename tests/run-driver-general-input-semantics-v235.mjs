import { chromium } from 'playwright';

const base = process.env.FORM_BASE_URL || 'http://127.0.0.1:8080';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const failures = [];
const checks = [];
const fail = (name, detail) => failures.push({ name, detail });
const pass = (name, detail) => checks.push({ name, detail });

try {
  await page.goto(`${base}/index.html`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForFunction(() => window.FORM_DRIVER_ENGINE_V80 && window.FORM_DRIVER_CONFIG_V81, null, { timeout: 15000 });

  const report = await page.evaluate(() => {
    const clone = v => JSON.parse(JSON.stringify(v));
    const setMetric = (id, mode, value) => { state.metrics = state.metrics || {}; state.metrics[id] = { mode, value }; };
    const unknown = id => setMetric(id,'unknown',null);
    const golferNow = () => typeof normalizedGolferV69 === 'function' ? normalizedGolferV69() : golfer();
    const restore = saved => { Object.keys(state).forEach(k=>delete state[k]); Object.assign(state,saved); };
    const name = p => `${p.brand} ${p.model}`;
    const comps = s => Object.fromEntries((s.components||[]).map(x=>[x.key,x]));
    const setBalanced = () => { state.ranks = state.ranks || {}; Object.assign(state.ranks,{accuracy:2,distance:2,flight:2}); };
    const setupBase = () => { setBalanced(); setMetric('speed','range','95-99'); setMetric('aoa','general','up'); unknown('ballSpeed'); unknown('carry'); };

    const run = setup => {
      const saved = clone(state);
      try {
        setupBase(); setup();
        const g = clone(golferNow()); Object.assign(g,{strike:'center',curveClass:null,costly:null});
        const rows = window.FORM_DRIVER_ENGINE_V80.winners(g).slice(0,9);
        const top = rows[0]; const c = top ? comps(top.s) : {};
        return { top:top?name(top.p):null, topScore:top?.s?.overall??null, top5:rows.slice(0,5).map(r=>name(r.p)), launchWeight:c.launch?.weight??null, spinWeight:c.spin?.weight??null, launchLabel:c.launch?.label??null, spinLabel:c.spin?.label??null };
      } finally { restore(saved); }
    };

    const profiles = {
      launchLowGeneral: run(()=>{ setMetric('launch','general','low'); setMetric('spin','general','mid'); }),
      launchLowRange: run(()=>{ setMetric('launch','range','8-10'); setMetric('spin','range','2250-2499'); }),
      launchHighGeneral: run(()=>{ setMetric('launch','general','high'); setMetric('spin','general','mid'); }),
      launchHighRange: run(()=>{ setMetric('launch','range','18-20'); setMetric('spin','range','2250-2499'); }),
      spinLowGeneral: run(()=>{ setMetric('launch','general','mid'); setMetric('spin','general','low'); }),
      spinLowRange: run(()=>{ setMetric('launch','range','12-14'); setMetric('spin','range','1750-1999'); }),
      spinHighGeneral: run(()=>{ setMetric('launch','general','mid'); setMetric('spin','general','high'); }),
      spinHighRange: run(()=>{ setMetric('launch','range','12-14'); setMetric('spin','range','3000-3499'); }),
      launchVaries: run(()=>{ setMetric('launch','general','varies'); setMetric('spin','general','mid'); }),
      spinVaries: run(()=>{ setMetric('launch','general','mid'); setMetric('spin','general','varies'); })
    };
    const overlap = (a,b) => b.top5.filter(x=>new Set(a.top5).has(x)).length;
    return {profiles, overlaps:{launchLow:overlap(profiles.launchLowGeneral,profiles.launchLowRange),launchHigh:overlap(profiles.launchHighGeneral,profiles.launchHighRange),spinLow:overlap(profiles.spinLowGeneral,profiles.spinLowRange),spinHigh:overlap(profiles.spinHighGeneral,profiles.spinHighRange)}};
  });

  const P=report.profiles;
  for (const [label,p] of Object.entries(P)) {
    if (!Number.isFinite(p.topScore) || p.topScore < 45 || p.topScore > 99.2) fail(`${label}-bounded`, JSON.stringify(p)); else pass(`${label}-bounded`, `${p.top} ${p.topScore}`);
  }
  for (const [label,n] of Object.entries(report.overlaps)) {
    if (n < 2) fail(`${label}-semantic-overlap`, `top-5 overlap ${n}/5`); else pass(`${label}-semantic-overlap`, `general vs range top-5 overlap ${n}/5`);
  }
  if (!(P.launchLowGeneral.launchWeight > 9 && P.launchHighGeneral.launchWeight > 9)) fail('general-launch-relevance', `${P.launchLowGeneral.launchWeight}/${P.launchHighGeneral.launchWeight}`); else pass('general-launch-relevance', `low/high general launch weights ${P.launchLowGeneral.launchWeight}/${P.launchHighGeneral.launchWeight}`);
  if (!(P.spinLowGeneral.spinWeight > 10 && P.spinHighGeneral.spinWeight > 10)) fail('general-spin-relevance', `${P.spinLowGeneral.spinWeight}/${P.spinHighGeneral.spinWeight}`); else pass('general-spin-relevance', `low/high general spin weights ${P.spinLowGeneral.spinWeight}/${P.spinHighGeneral.spinWeight}`);
  if (!String(P.launchVaries.launchLabel||'').toLowerCase().includes('consistency')) fail('launch-varies-semantics', P.launchVaries.launchLabel); else pass('launch-varies-semantics', P.launchVaries.launchLabel);
  if (!String(P.spinVaries.spinLabel||'').toLowerCase().includes('consistency')) fail('spin-varies-semantics', P.spinVaries.spinLabel); else pass('spin-varies-semantics', P.spinVaries.spinLabel);

  console.log(JSON.stringify({generatedAt:new Date().toISOString(),productionScoringChanged:false,failures,checks,report},null,2));
  if (failures.length) process.exitCode=1;
} catch (err) {
  console.error(err);
  process.exitCode=1;
} finally { await browser.close(); }
