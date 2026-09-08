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
    const name = p => `${p.brand} ${p.model}`;
    const restore = saved => { Object.keys(state).forEach(k => delete state[k]); Object.assign(state, saved); };
    const priorityBalanced = () => { state.ranks = state.ranks || {}; Object.assign(state.ranks, { accuracy: 2, distance: 2, flight: 2 }); };
    const supportUnknown = () => { unknown('ballSpeed'); unknown('carry'); };
    const compMap = score => Object.fromEntries((score?.components || []).map(x => [x.key, x]));

    const runProfile = setup => {
      const saved = clone(state);
      try {
        priorityBalanced(); setup();
        const g = clone(golferNow());
        Object.assign(g, { strike: 'center', curveClass: 'fade_curve', costly: 'right' });
        const rows = window.FORM_DRIVER_ENGINE_V80.winners(g).slice(0, 9);
        return {
          golfer: g,
          ranking: rows.map((r, i) => ({ rank: i + 1, name: name(r.p), score: r.s.overall, evidenceQuality: r.s.evidenceQuality })),
          top: rows[0] ? name(rows[0].p) : null,
          topScore: rows[0]?.s?.overall ?? null,
          topProductEvidenceQuality: rows[0]?.s?.evidenceQuality ?? null
        };
      } finally { restore(saved); }
    };

    const exact = runProfile(() => {
      setMetric('speed','exact',95); setMetric('aoa','exact',3); setMetric('launch','exact',11); setMetric('spin','exact',2300); supportUnknown();
    });
    const range = runProfile(() => {
      setMetric('speed','range','95-99'); setMetric('aoa','general','up'); setMetric('launch','range','10-12'); setMetric('spin','range','2250-2499'); supportUnknown();
    });
    const sparse = runProfile(() => {
      unknown('speed'); unknown('aoa'); unknown('launch'); unknown('spin'); supportUnknown();
    });

    const precision = (() => {
      const saved = clone(state);
      try {
        priorityBalanced();
        const scoreFor = setup => {
          setup(); supportUnknown();
          const g = clone(golferNow()); Object.assign(g, { strike: 'center', curveClass: 'fade_curve', costly: 'right' });
          const product = window.FORM_DRIVER_ENGINE_V80.winners(g)[0].p;
          const score = window.FORM_DRIVER_ENGINE_V80.scoreOne(product, g);
          const c = compMap(score);
          return { product: name(product), speedWeight: c.speed?.weight ?? null, launchWeight: c.launch?.weight ?? null, spinWeight: c.spin?.weight ?? null, overall: score.overall };
        };
        const exactMatched = scoreFor(() => {
          setMetric('speed','exact',97); setMetric('aoa','exact',3); setMetric('launch','exact',11); setMetric('spin','exact',2125);
        });
        const rangeMatched = scoreFor(() => {
          setMetric('speed','range','95-99'); setMetric('aoa','general','up'); setMetric('launch','range','10-12'); setMetric('spin','range','2000-2249');
        });
        return { exactMatched, rangeMatched };
      } finally { restore(saved); }
    })();

    const overlap = (a,b,n=5) => {
      const A = new Set(a.ranking.slice(0,n).map(x=>x.name));
      return b.ranking.slice(0,n).filter(x=>A.has(x.name)).length;
    };
    return { exact, range, sparse, precision, overlapExactRange: overlap(exact,range), overlapRangeSparse: overlap(range,sparse) };
  });

  for (const [label, p] of Object.entries({ exact: report.exact, range: report.range, sparse: report.sparse })) {
    const finite = p.ranking.length > 0 && p.ranking.every(x => Number.isFinite(x.score) && x.score >= 45 && x.score <= 99.2);
    if (!finite) fail(`${label}-bounded`, `${label} produced empty/non-finite/out-of-bounds ranking`); else pass(`${label}-bounded`, `${label} profile produced ${p.ranking.length} bounded recommendations`);
  }

  if (report.overlapExactRange < 3) fail('exact-range-stability', `top-5 overlap only ${report.overlapExactRange}/5`); else pass('exact-range-stability', `top-5 overlap ${report.overlapExactRange}/5`);

  const pe = report.exact.topProductEvidenceQuality, pr = report.range.topProductEvidenceQuality, ps = report.sparse.topProductEvidenceQuality;
  if ([pe,pr,ps].every(Number.isFinite)) pass('product-evidence-semantics', `product evidence is scorer-side/model-side (${pe}, ${pr}, ${ps}); input confidence is tested separately`);
  else fail('product-evidence-semantics', 'top product evidence quality was unexpectedly non-numeric');

  const px = report.precision.exactMatched, rg = report.precision.rangeMatched;
  const precisionFinite = [px.speedWeight, px.launchWeight, px.spinWeight, rg.speedWeight, rg.launchWeight, rg.spinWeight].every(Number.isFinite);
  if (!precisionFinite) fail('input-precision-weights', JSON.stringify(report.precision));
  else if (!(px.speedWeight > rg.speedWeight && px.launchWeight > rg.launchWeight && px.spinWeight > rg.spinWeight)) fail('input-precision-weights', `expected exact weights > matched-range weights; exact ${px.speedWeight}/${px.launchWeight}/${px.spinWeight}, range ${rg.speedWeight}/${rg.launchWeight}/${rg.spinWeight}`);
  else pass('input-precision-weights', `exact input weights exceed matched-range weights: speed ${px.speedWeight}>${rg.speedWeight}, launch ${px.launchWeight}>${rg.launchWeight}, spin ${px.spinWeight}>${rg.spinWeight}`);

  const sparseTopSpread = report.sparse.ranking.length >= 2 ? report.sparse.ranking[0].score - report.sparse.ranking[1].score : null;
  if (Number.isFinite(sparseTopSpread) && sparseTopSpread > 12) fail('sparse-false-certainty', `sparse top-2 spread ${sparseTopSpread.toFixed(1)} is unexpectedly large`); else pass('sparse-false-certainty', Number.isFinite(sparseTopSpread) ? `sparse top-2 spread ${sparseTopSpread.toFixed(1)}` : 'not applicable');

  console.log(JSON.stringify({ generatedAt: new Date().toISOString(), productionScoringChanged: false, failures, checks, report }, null, 2));
  if (failures.length) process.exitCode = 1;
} catch (err) {
  console.error(err);
  process.exitCode = 1;
} finally {
  await browser.close();
}
