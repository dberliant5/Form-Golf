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
  await page.waitForFunction(() => window.FORM_DRIVER_ENGINE_V80 && typeof showResults === 'function', null, { timeout: 15000 });

  const report = await page.evaluate(() => {
    const clone = v => JSON.parse(JSON.stringify(v));
    const originalGolfer = typeof normalizedGolferV69 === 'function' ? normalizedGolferV69 : null;
    const baseGolfer = clone(originalGolfer ? originalGolfer() : golfer());
    baseGolfer.currentClub = baseGolfer.currentClub || {};
    const engine = window.FORM_DRIVER_ENGINE_V80;
    const productName = p => `${p.brand} ${p.model}`;
    const getDecision = () => {
      showResults();
      const box = document.querySelector('.current70');
      const sections = box ? [...box.children] : [];
      const upgrade = sections[1];
      return {
        level: upgrade?.querySelector('b')?.textContent?.trim() || null,
        text: upgrade?.querySelector('em')?.textContent?.trim() || null,
        currentText: sections[0]?.querySelector('em')?.textContent?.trim() || null
      };
    };
    const runWith = currentClub => {
      window.normalizedGolferV69 = () => ({ ...clone(baseGolfer), currentClub: clone(currentClub || {}) });
      const g = window.normalizedGolferV69();
      const best = engine.winners(g)[0];
      const cur = engine.currentScore(g);
      const decision = getDecision();
      return { best: best ? { name: productName(best.p), score: best.s.overall } : null, current: { score: cur.score, label: cur.label }, decision };
    };

    const noCurrent = runWith({});

    window.normalizedGolferV69 = () => ({ ...clone(baseGolfer), currentClub: {} });
    const neutralG = window.normalizedGolferV69();
    const neutralRows = engine.winners(neutralG);
    const bestP = neutralRows[0]?.p;
    const sameBest = bestP ? runWith({ brand: bestP.brand, model: bestP.model, results: 'mixed' }) : null;
    const sameBestGood = bestP ? runWith({ brand: bestP.brand, model: bestP.model, results: 'good' }) : null;

    let exactCandidates = [];
    try {
      if (typeof products !== 'undefined' && Array.isArray(products)) {
        exactCandidates = products
          .filter(p => p && p.brand && p.model && p.generation !== 'previous_limited')
          .map(p => {
            const g = { ...clone(baseGolfer), currentClub: { brand:p.brand, model:p.model, results:'mixed' } };
            const best = engine.winners(g)[0];
            const cur = engine.currentScore(g);
            const diff = best && cur.score != null ? Math.round((best.s.overall-cur.score)*10)/10 : null;
            return { brand:p.brand, model:p.model, gap:diff, currentScore:cur.score, bestScore:best?.s?.overall??null, label:cur.label };
          })
          .filter(x => Number.isFinite(x.gap));
      }
    } catch (e) {}
    exactCandidates.sort((a,b)=>b.gap-a.gap);
    const largestExact = exactCandidates[0] || null;
    const largeExactDecision = largestExact ? runWith({ brand:largestExact.brand, model:largestExact.model, results:'mixed' }) : null;
    const largeExactGood = largestExact ? runWith({ brand:largestExact.brand, model:largestExact.model, results:'good' }) : null;

    if (originalGolfer) window.normalizedGolferV69 = originalGolfer;
    return { noCurrent, sameBest, sameBestGood, largestExact, largeExactDecision, largeExactGood, exactCandidateCount: exactCandidates.length };
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

  if (report.largestExact && report.largeExactDecision) {
    const gap = report.largestExact.gap;
    const level = report.largeExactDecision.decision.level;
    if (gap >= 6 && level !== 'Strong upgrade candidate') fail('large-gap-label', `largest exact gap ${gap}, label ${level}`);
    else if (gap >= 2.5 && gap < 6 && !['Worth a side-by-side test','No clear equipment upgrade'].includes(level)) fail('moderate-gap-label', `gap ${gap}, label ${level}`);
    else pass('largest-exact-observation', `${report.largestExact.brand} ${report.largestExact.model}: gap ${gap}, rendered label ${level}`);

    if (report.largeExactGood && report.largeExactGood.decision.level !== level) fail('large-gap-satisfaction-independent', `${level} vs ${report.largeExactGood.decision.level}`);
    else pass('large-gap-satisfaction-independent', `satisfaction label did not change ${level}`);
  } else {
    pass('largest-exact-observation', `exact product universe not directly enumerable in this browser context (${report.exactCandidateCount} candidates)`);
  }

  console.log(JSON.stringify({ generatedAt:new Date().toISOString(), productionScoringChanged:false, failures, checks, report }, null, 2));
  if (failures.length) process.exitCode = 1;
} catch (err) {
  console.error(err);
  process.exitCode = 1;
} finally {
  await browser.close();
}
