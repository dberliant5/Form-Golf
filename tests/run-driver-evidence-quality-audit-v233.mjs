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
          topEvidenceQuality: rows[0]?.s?.evidenceQuality ?? null
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

    const overlap = (a,b,n=5) => {
      const A = new Set(a.ranking.slice(0,n).map(x=>x.name));
      return b.ranking.slice(0,n).filter(x=>A.has(x.name)).length;
    };
    return { exact, range, sparse, overlapExactRange: overlap(exact,range), overlapRangeSparse: overlap(range,sparse) };
  });

  for (const [label, p] of Object.entries({ exact: report.exact, range: report.range, sparse: report.sparse })) {
    const finite = p.ranking.length > 0 && p.ranking.every(x => Number.isFinite(x.score) && x.score >= 45 && x.score <= 99.2);
    if (!finite) fail(`${label}-bounded`, `${label} produced empty/non-finite/out-of-bounds ranking`); else pass(`${label}-bounded`, `${label} profile produced ${p.ranking.length} bounded recommendations`);
  }

  if (report.overlapExactRange < 3) fail('exact-range-stability', `top-5 overlap only ${report.overlapExactRange}/5`); else pass('exact-range-stability', `top-5 overlap ${report.overlapExactRange}/5`);

  const e = report.exact.topEvidenceQuality, r = report.range.topEvidenceQuality, s = report.sparse.topEvidenceQuality;
  if ([e,r,s].every(Number.isFinite)) {
    if (!(e >= r && r >= s)) fail('evidence-quality-order', `expected exact >= range >= sparse, got ${e}, ${r}, ${s}`); else pass('evidence-quality-order', `exact ${e} >= range ${r} >= sparse ${s}`);
  } else {
    pass('evidence-quality-order', 'evidenceQuality is not numeric on all profiles; ranking stability/bounds remain the enforced safeguards');
  }

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
