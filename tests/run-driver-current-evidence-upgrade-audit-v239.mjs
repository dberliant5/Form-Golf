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

  const states = ['great', 'good', 'mixed', 'poor'];
  const report = await page.evaluate(async ({ states }) => {
    const clone = v => JSON.parse(JSON.stringify(v));
    const baseGolfer = clone(typeof normalizedGolferV69 === 'function' ? normalizedGolferV69() : golfer());
    baseGolfer.currentClub = {};

    const source = await fetch('assets/driver-engine-v227.js').then(r => r.text());
    const needle = 'window.FORM_DRIVER_ENGINE_V80={scoreOne,winners,currentScore,compare};';
    if (!source.includes(needle)) throw new Error('v227 recommendation export hook not found');
    (0, eval)(source.replace(needle, 'window.FORM_DRIVER_ENGINE_V80={scoreOne,winners,currentScore,compare,recommendation};'));

    const engine = window.FORM_DRIVER_ENGINE_V80;
    const productName = p => `${p.brand} ${p.model}`;
    const runWith = (currentClub, currentState = 'good') => {
      const g = { ...clone(baseGolfer), current: currentState, currentClub: clone(currentClub || {}) };
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

    const missing = runWith({}, 'good');
    const activeProducts = (typeof products !== 'undefined' && Array.isArray(products) ? products : [])
      .filter(p => p && p.brand && p.model && p.generation !== 'previous_limited');

    const exactMatrix = activeProducts.flatMap(p => states.map(currentState => ({
      club: { brand:p.brand, model:p.model, currentState },
      result: runWith({ brand:p.brand, model:p.model }, currentState)
    }))).filter(x => x.result.current.label === 'Exact model profile' && Number.isFinite(x.result.current.score));

    const historicalClubs = [
      {brand:'Titleist',model:'TS2 (2018)'},
      {brand:'PING',model:'G400 Max (2018)'},
      {brand:'TaylorMade',model:'M4 (2018)'},
      {brand:'Callaway',model:'Rogue (2018)'}
    ];
    const historicalMatrix = historicalClubs.flatMap(club => states.map(currentState => ({
      club: { ...club, currentState },
      result: runWith(club, currentState)
    }))).filter(x => x.result.current.label === 'Historical modeled profile' && Number.isFinite(x.result.current.score));

    const summarizeStateSensitivity = rows => {
      const groups = new Map();
      for (const row of rows) {
        const key = `${row.club.brand}|${row.club.model}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(row);
      }
      const summaries = [];
      for (const [key, group] of groups) {
        const signatures = [...new Set(group.map(x => `${x.result.current.score}|${x.result.decision.level}`))];
        summaries.push({ key, states:group.length, signatures, sensitive:signatures.length > 1 });
      }
      return summaries;
    };

    return {
      missing,
      exactMatrix,
      historicalMatrix,
      exactStateSensitivity: summarizeStateSensitivity(exactMatrix),
      historicalStateSensitivity: summarizeStateSensitivity(historicalMatrix),
      activeProductCount: activeProducts.length,
      historicalRequestedCount: historicalClubs.length
    };
  }, { states });

  const baseline = report.missing.best;
  if (!baseline) fail('best-fit-available', 'no eligible best fit');
  else pass('best-fit-available', `${baseline.name} ${baseline.score}`);

  if (report.missing.decision.level !== 'Test before replacing') {
    fail('missing-current-conservative', JSON.stringify(report.missing));
  } else pass('missing-current-conservative', report.missing.decision.text);

  const allSamples = [...report.exactMatrix, ...report.historicalMatrix];
  const rankingChanges = allSamples.filter(sample => !baseline || sample.result.best?.name !== baseline.name || sample.result.best?.score !== baseline.score);
  if (rankingChanges.length) {
    fail('ranking-independent-current-gamer-matrix', JSON.stringify(rankingChanges.slice(0, 5)));
  } else {
    pass('ranking-independent-current-gamer-matrix', `${allSamples.length} current-gamer variants left the best new-driver ranking unchanged`);
  }

  const expectedExactRows = report.activeProductCount * states.length;
  if (report.exactMatrix.length !== expectedExactRows) {
    fail('exact-current-matrix-complete', `${report.exactMatrix.length}/${expectedExactRows} exact model/state combinations resolved`);
  } else {
    pass('exact-current-matrix-complete', `${report.exactMatrix.length} exact model/state combinations resolved`);
  }

  const exactBadEvidence = report.exactMatrix.filter(x => !x.result.current.hardConstraints.length && !Number.isFinite(x.result.current.evidenceQuality));
  if (exactBadEvidence.length) fail('exact-current-evidence-quality', JSON.stringify(exactBadEvidence.slice(0, 5)));
  else pass('exact-current-evidence-quality', 'all unconstrained exact current-model rows expose finite evidence quality');

  const exactBadConstraints = report.exactMatrix.filter(x => x.result.current.hardConstraints.length && x.result.decision.level !== 'Worth a side-by-side test');
  if (exactBadConstraints.length) fail('exact-hard-constraint-conservative', JSON.stringify(exactBadConstraints.slice(0, 5)));
  else pass('exact-hard-constraint-conservative', 'all exact hard-constraint rows avoid precise upgrade claims');

  const expectedHistoricalRows = report.historicalRequestedCount * states.length;
  if (report.historicalMatrix.length !== expectedHistoricalRows) {
    fail('historical-current-matrix-complete', `${report.historicalMatrix.length}/${expectedHistoricalRows} historical model/state combinations resolved`);
  } else {
    pass('historical-current-matrix-complete', `${report.historicalMatrix.length} historical model/state combinations resolved across four manufacturers`);
  }

  const historicalBadEvidence = report.historicalMatrix.filter(x => !Number.isFinite(x.result.current.evidenceQuality));
  if (historicalBadEvidence.length) fail('historical-current-evidence-quality', JSON.stringify(historicalBadEvidence.slice(0, 5)));
  else pass('historical-current-evidence-quality', 'all historical modeled rows expose finite evidence quality');

  const historicalStrong = report.historicalMatrix.filter(x => x.result.decision.level === 'Strong upgrade candidate');
  if (historicalStrong.length) {
    fail('modeled-current-upgrade-ceiling', JSON.stringify(historicalStrong.slice(0, 5)));
  } else {
    pass('modeled-current-upgrade-ceiling', 'no historical modeled current club produced FORM’s strongest replacement claim');
  }

  const exactSensitive = report.exactStateSensitivity.filter(x => x.sensitive);
  const historicalSensitive = report.historicalStateSensitivity.filter(x => x.sensitive);
  const completeStateGroups = [...report.exactStateSensitivity, ...report.historicalStateSensitivity].filter(x => x.states === states.length);
  if (!completeStateGroups.length) {
    fail('current-self-report-matrix-available', 'no make/model resolved all four self-report states');
  } else if (!exactSensitive.length && !historicalSensitive.length) {
    fail('current-self-report-used-in-upgrade-comparison', `great/good/mixed/poor produced identical current scores and upgrade decisions across ${completeStateGroups.length} current-gamer make/model groups`);
  } else {
    pass('current-self-report-used-in-upgrade-comparison', `${exactSensitive.length + historicalSensitive.length}/${completeStateGroups.length} current-gamer groups changed score or upgrade decision across self-report states`);
  }

  console.log(JSON.stringify({
    generatedAt:new Date().toISOString(),
    productionScoringChanged:false,
    purpose:'Audit active v227 current-gamer comparison quality across manufacturers, historical models, and every UI self-report state while requiring ranking independence.',
    failures,
    checks,
    summary:{
      exactRows:report.exactMatrix.length,
      historicalRows:report.historicalMatrix.length,
      exactSensitiveGroups:exactSensitive.length,
      historicalSensitiveGroups:historicalSensitive.length,
      exactGroups:report.exactStateSensitivity.length,
      historicalGroups:report.historicalStateSensitivity.length
    },
    report
  }, null, 2));
  if (failures.length) process.exitCode = 1;
} catch (err) {
  console.error(err);
  process.exitCode = 1;
} finally {
  await browser.close();
}