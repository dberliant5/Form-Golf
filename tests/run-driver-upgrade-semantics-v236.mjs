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
    baseGolfer.currentClub = baseGolfer.currentClub || {};

    // Re-evaluate the exact production v225 source in this disposable test page, changing
    // only its export line so the private recommendation() helper becomes inspectable.
    // Production source, scorer behavior and deployed exports remain untouched.
    const source = await fetch('assets/driver-engine-v226.js').then(r => r.text());
    const needle = 'window.FORM_DRIVER_ENGINE_V80={scoreOne,winners,currentScore,compare};';
    if (!source.includes(needle)) throw new Error('v225 recommendation export hook not found');
    (0, eval)(source.replace(needle, 'window.FORM_DRIVER_ENGINE_V80={scoreOne,winners,currentScore,compare,recommendation};'));

    const engine = window.FORM_DRIVER_ENGINE_V80;
    if (typeof engine.recommendation !== 'function') throw new Error('recommendation() was not exposed in test page');
    const productName = p => `${p.brand} ${p.model}`;
    const runWith = currentClub => {
      const g = { ...clone(baseGolfer), currentClub: clone(currentClub || {}) };
      const best = engine.winners(g)[0] || null;
      const current = engine.currentScore(g);
      const decision = engine.recommendation(best, current);
      return {
        best: best ? { name: productName(best.p), score: best.s.overall } : null,
        current: { score: current.score, label: current.label },
        decision
      };
    };

    const noCurrent = runWith({});
    const neutralBest = engine.winners({ ...clone(baseGolfer), currentClub:{} })[0]?.p || null;
    const sameBest = neutralBest ? runWith({ brand:neutralBest.brand, model:neutralBest.model, results:'mixed' }) : null;
    const sameBestGood = neutralBest ? runWith({ brand:neutralBest.brand, model:neutralBest.model, results:'good' }) : null;

    let exactCandidates = [];
    if (typeof products !== 'undefined' && Array.isArray(products)) {
      exactCandidates = products
        .filter(p => p && p.brand && p.model && p.generation !== 'previous_limited')
        .map(p => {
          const result = runWith({ brand:p.brand, model:p.model, results:'mixed' });
          const gap = result.best && result.current.score != null ? Math.round((result.best.score-result.current.score)*10)/10 : null;
          return { brand:p.brand, model:p.model, gap, result };
        })
        .filter(x => Number.isFinite(x.gap))
        .sort((a,b)=>b.gap-a.gap);
    }
    const largestExact = exactCandidates[0] || null;
    const largestExactGood = largestExact ? runWith({ brand:largestExact.brand, model:largestExact.model, results:'good' }) : null;

    // Observe one historical-model fallback if the compatibility model can resolve it.
    const historicalTrials = [
      {brand:'Titleist',model:'TS2 (2018)'},
      {brand:'PING',model:'G400 Max (2018)'},
      {brand:'TaylorMade',model:'M4 (2018)'},
      {brand:'Callaway',model:'Rogue (2018)'}
    ];
    let historical = null;
    for (const club of historicalTrials) {
      const r = runWith({...club,results:'mixed'});
      if (r.current.label === 'Historical modeled profile' && r.current.score != null) { historical = { club, ...r }; break; }
    }

    return { noCurrent, sameBest, sameBestGood, largestExact, largestExactGood, exactCandidateCount:exactCandidates.length, historical };
  });

  if (report.noCurrent.decision.level !== 'Test before replacing') fail('missing-current-conservative', JSON.stringify(report.noCurrent));
  else pass('missing-current-conservative', report.noCurrent.decision.text);

  if (!report.sameBest) fail('same-best-available', 'no best product available');
  else if (report.sameBest.decision.level !== 'No clear equipment upgrade') fail('same-best-no-upgrade', JSON.stringify(report.sameBest));
  else pass('same-best-no-upgrade', `${report.sameBest.best.name}: ${report.sameBest.decision.text}`);

  if (report.sameBest && report.sameBestGood) {
    const stable = report.sameBest.decision.level === report.sameBestGood.decision.level && report.sameBest.best.name === report.sameBestGood.best.name && report.sameBest.best.score === report.sameBestGood.best.score;
    if (!stable) fail('satisfaction-independent', JSON.stringify({mixed:report.sameBest,good:report.sameBestGood}));
    else pass('satisfaction-independent', 'current-club satisfaction did not change absolute best fit or upgrade label for the same exact current product');
  }

  if (report.largestExact) {
    const gap = report.largestExact.gap;
    const level = report.largestExact.result.decision.level;
    if (report.largestExact.result.current.score === 50 && level !== 'Worth a side-by-side test') fail('hard-constrained-label', `fallback current score ${report.largestExact.result.current.score}, label ${level}`);
    else if (report.largestExact.result.current.score !== 50 && gap >= 6 && level !== 'Strong upgrade candidate') fail('large-gap-label', `largest exact gap ${gap}, label ${level}`);
    else if (report.largestExact.result.current.score !== 50 && gap >= 2.5 && gap < 6 && !['Worth a side-by-side test','No clear equipment upgrade'].includes(level)) fail('moderate-gap-label', `gap ${gap}, label ${level}`);
    else pass('largest-exact-observation', `${report.largestExact.brand} ${report.largestExact.model}: gap ${gap}, label ${level}`);

    if (report.largestExactGood && report.largestExactGood.decision.level !== level) fail('large-gap-satisfaction-independent', `${level} vs ${report.largestExactGood.decision.level}`);
    else pass('large-gap-satisfaction-independent', `satisfaction did not change ${level}`);
  } else {
    fail('exact-candidate-enumeration', `no exact candidates found (${report.exactCandidateCount})`);
  }

  if (report.historical) pass('historical-modeled-observation', `${report.historical.club.brand} ${report.historical.club.model}: ${report.historical.current.score}, ${report.historical.decision.level} — ${report.historical.decision.text}`);
  else pass('historical-modeled-observation', 'no trial historical model resolved; no assertion made');

  console.log(JSON.stringify({ generatedAt:new Date().toISOString(), productionScoringChanged:false, failures, checks, report }, null, 2));
  if (failures.length) process.exitCode = 1;
} catch (err) {
  console.error(err);
  process.exitCode = 1;
} finally {
  await browser.close();
}
