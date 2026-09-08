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
    const unknown = id => setMetric(id, 'unknown', null);
    const golferNow = () => typeof normalizedGolferV69 === 'function' ? normalizedGolferV69() : golfer();
    const productName = p => `${p.brand} ${p.model}`;
    const restore = saved => { Object.keys(state).forEach(k => delete state[k]); Object.assign(state, saved); };
    const setBalanced = () => { state.ranks = state.ranks || {}; Object.assign(state.ranks, { accuracy: 2, distance: 2, flight: 2 }); };
    const supportUnknown = () => { unknown('ballSpeed'); unknown('carry'); };
    const rank = g => window.FORM_DRIVER_ENGINE_V80.winners(g).slice(0, 9).map((r,i)=>({rank:i+1,name:productName(r.p),score:r.s.overall}));

    const cases = [
      { id:'slow-low', exact:{speed:80,launch:9,spin:1875}, range:{speed:'75-84',launch:'8-10',spin:'1750-1999'} },
      { id:'slow-high', exact:{speed:80,launch:19,spin:3250}, range:{speed:'75-84',launch:'18-20',spin:'3000-3499'} },
      { id:'mid-low', exact:{speed:97,launch:9,spin:1875}, range:{speed:'95-99',launch:'8-10',spin:'1750-1999'} },
      { id:'mid-high', exact:{speed:97,launch:19,spin:3250}, range:{speed:'95-99',launch:'18-20',spin:'3000-3499'} },
      { id:'fast-low', exact:{speed:107,launch:9,spin:1875}, range:{speed:'105-109',launch:'8-10',spin:'1750-1999'} },
      { id:'fast-high', exact:{speed:107,launch:19,spin:3250}, range:{speed:'105-109',launch:'18-20',spin:'3000-3499'} }
    ];

    const run = (def, mode) => {
      const saved = clone(state);
      try {
        setBalanced(); supportUnknown();
        if (mode === 'exact') {
          setMetric('speed','exact',def.exact.speed); setMetric('aoa','exact',3); setMetric('launch','exact',def.exact.launch); setMetric('spin','exact',def.exact.spin);
        } else {
          setMetric('speed','range',def.range.speed); setMetric('aoa','general','up'); setMetric('launch','range',def.range.launch); setMetric('spin','range',def.range.spin);
        }
        const g = clone(golferNow()); Object.assign(g,{strike:'center',curveClass:'fade_curve',costly:'right'});
        const ranking = rank(g);
        return { top:ranking[0]?.name||null, topScore:ranking[0]?.score??null, top5:ranking.slice(0,5).map(x=>x.name), ranking };
      } finally { restore(saved); }
    };

    const results = cases.map(def => {
      const exact = run(def,'exact'), range = run(def,'range');
      const overlap = range.top5.filter(x=>new Set(exact.top5).has(x)).length;
      return { id:def.id, exact, range, overlap, topScoreDelta: exact.topScore!=null&&range.topScore!=null ? Math.round((range.topScore-exact.topScore)*10)/10 : null };
    });
    return { results };
  });

  for (const c of report.results) {
    const bounded = [...c.exact.ranking,...c.range.ranking].every(x=>Number.isFinite(x.score)&&x.score>=45&&x.score<=99.2);
    if (!bounded) fail(`${c.id}-bounded`, 'non-finite/out-of-bounds recommendation'); else pass(`${c.id}-bounded`, 'exact and range rankings bounded');
    if (c.overlap < 3) fail(`${c.id}-overlap`, `top-5 overlap ${c.overlap}/5`); else pass(`${c.id}-overlap`, `top-5 overlap ${c.overlap}/5`);
    if (!Number.isFinite(c.topScoreDelta) || Math.abs(c.topScoreDelta) > 2.5) fail(`${c.id}-score-continuity`, `top score delta ${c.topScoreDelta}`); else pass(`${c.id}-score-continuity`, `top score delta ${c.topScoreDelta}`);
  }

  console.log(JSON.stringify({generatedAt:new Date().toISOString(),productionScoringChanged:false,failures,checks,report},null,2));
  if (failures.length) process.exitCode = 1;
} catch (err) {
  console.error(err);
  process.exitCode = 1;
} finally {
  await browser.close();
}
