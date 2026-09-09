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
  await page.waitForFunction(() => window.FORM_DRIVER_ENGINE_V80, null, { timeout: 15000 });

  const report = await page.evaluate(async () => {
    const clone = v => JSON.parse(JSON.stringify(v));
    const baseGolfer = clone(typeof normalizedGolferV69 === 'function' ? normalizedGolferV69() : golfer());
    baseGolfer.currentClub = {};

    const source = await fetch('assets/driver-engine-v226.js').then(r => r.text());
    const needle = 'window.FORM_DRIVER_ENGINE_V80={scoreOne,winners,currentScore,compare};';
    if (!source.includes(needle)) throw new Error('v226 recommendation export hook not found');
    (0, eval)(source.replace(needle, 'window.FORM_DRIVER_ENGINE_V80={scoreOne,winners,currentScore,compare,recommendation};'));

    const engine = window.FORM_DRIVER_ENGINE_V80;
    const productName = p => `${p.brand} ${p.model}`;
    const runWith = currentClub => {
      const g = { ...clone(baseGolfer), currentClub: clone(currentClub || {}) };
      const best = engine.winners(g)[0] || null;
      const current = engine.currentScore(g);
      const decision = engine.recommendation(best, current);
      return {
        best: best ? { name: productName(best.p), score: best.s.overall, evidenceQuality: best.s.evidenceQuality } : null,
        current: {
          score: current.score,
          label: current.label,
          evidenceQuality: current.detail?.evidenceQuality ?? null,
          hardConstraints: current.detail?.hardConstraints ?? []
        },
        decision
      };
    };

    const missing = runWith({});

    const exactCandidates = (typeof products !== 'undefined' && Array.isArray(products) ? products : [])
      .filter(p => p && p.brand && p.model && p.generation !== 'previous_limited')
      .map(p => ({ club:{brand:p.brand,model:p.model,results:'mixed'}, result:runWith({brand:p.brand,model:p.model,results:'mixed'}) }))
      .filter(x => x.result.current.label === 'Exact model profile' && Number.isFinite(x.result.current.score))
      .sort((a,b) => {
        const ag = (a.result.best?.score ?? 0) - a.result.current.score;
        const bg = (b.result.best?.score ?? 0) - b.result.current.score;
        return bg-ag;
      });
    const exact = exactCandidates[0] || null;

    const historicalTrials = [
      {brand:'Titleist',model:'TS2 (2018)',results:'mixed'},
      {brand:'PING',model:'G400 Max (2018)',results:'mixed'},
      {brand:'TaylorMade',model:'M4 (2018)',results:'mixed'},
      {brand:'Callaway',model:'Rogue (2018)',results:'mixed'}
    ];
    let historical = null;
    for (const club of historicalTrials) {
      const result = runWith(club);
      if (result.current.label === 'Historical modeled profile' && Number.isFinite(result.current.score)) {
        historical = { club, result };
        break;
      }
    }

    return { missing, exact, historical, exactCandidateCount:exactCandidates.length };
  });

  const baseline = report.missing.best;
  if (!baseline) fail('best-fit-available', 'no eligible best fit');
  else pass('best-fit-available', `${baseline.name} ${baseline.score}`);

  if (report.missing.decision.level !== 'Test before replacing') {
    fail('missing-current-conservative', JSON.stringify(report.missing));
  } else pass('missing-current-conservative', report.missing.decision.text);

  for (const [name, sample] of [['exact', report.exact?.result], ['historical', report.historical?.result]]) {
    if (!sample || !baseline) continue;
    const same = sample.best?.name === baseline.name && sample.best?.score === baseline.score;
    if (!same) fail(`ranking-independent-${name}`, JSON.stringify({ baseline, observed:sample.best }));
    else pass(`ranking-independent-${name}`, `${sample.best.name} remained ${sample.best.score}`);
  }

  if (!report.exact) {
    fail('exact-current-available', `no exact current model resolved (${report.exactCandidateCount} candidates)`);
  } else {
    const e = report.exact.result.current.evidenceQuality;
    if (!Number.isFinite(e)) fail('exact-current-evidence-quality', JSON.stringify(report.exact.result.current));
    else pass('exact-current-evidence-quality', `${report.exact.club.brand} ${report.exact.club.model}: ${e}`);
  }

  if (!report.historical) {
    fail('historical-current-available', 'no historical modeled current club resolved');
  } else {
    const h = report.historical.result;
    if (!Number.isFinite(h.current.evidenceQuality)) fail('historical-current-evidence-quality', JSON.stringify(h.current));
    else pass('historical-current-evidence-quality', `${report.historical.club.brand} ${report.historical.club.model}: ${h.current.evidenceQuality}`);

    // A modeled historical current club can support a comparison, but it should not create
    // FORM's strongest spend/upgrade claim without exact current-product evidence.
    if (h.decision.level === 'Strong upgrade candidate') {
      fail('modeled-current-upgrade-ceiling', `${report.historical.club.brand} ${report.historical.club.model}: ${h.current.score} -> ${h.best?.score}; ${h.decision.level}`);
    } else {
      pass('modeled-current-upgrade-ceiling', `${report.historical.club.brand} ${report.historical.club.model}: ${h.decision.level}`);
    }
  }

  console.log(JSON.stringify({
    generatedAt:new Date().toISOString(),
    productionScoringChanged:false,
    purpose:'Audit upgrade certainty as current-club evidence weakens; ranking must remain independent.',
    failures,
    checks,
    report
  }, null, 2));
  if (failures.length) process.exitCode = 1;
} catch (err) {
  console.error(err);
  process.exitCode = 1;
} finally {
  await browser.close();
}
