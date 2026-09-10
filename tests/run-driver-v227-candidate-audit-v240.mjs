import { chromium } from 'playwright';

const base = process.env.FORM_BASE_URL || 'http://127.0.0.1:8080';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const failures = [];
const checks = [];
const fail = (name, detail) => failures.push({ name, detail });
const pass = (name, detail) => checks.push({ name, detail });

try {
  await page.goto(`${base}/index.html`, { waitUntil:'networkidle', timeout:30000 });
  await page.waitForFunction(() => window.FORM_DRIVER_ENGINE_V80, null, { timeout:15000 });

  const report = await page.evaluate(async () => {
    const clone = v => JSON.parse(JSON.stringify(v));
    const golferBase = clone(typeof normalizedGolferV69 === 'function' ? normalizedGolferV69() : golfer());
    const hook = 'window.FORM_DRIVER_ENGINE_V80={scoreOne,winners,currentScore,compare};';

    const load = async (path, key) => {
      const src = await fetch(path).then(r => r.text());
      if (!src.includes(hook)) throw new Error(`${path} export hook not found`);
      (0, eval)(src.replace(hook, `window.${key}={scoreOne,winners,currentScore,compare,recommendation};`));
      return window[key];
    };

    const v226 = await load('assets/driver-engine-v226.js', '__V226');
    const v227 = await load('assets/driver-engine-v227.js', '__V227');
    const productName = p => `${p.brand} ${p.model}`;

    const snapshot = (engine, currentClub={}) => {
      const g = { ...clone(golferBase), currentClub:clone(currentClub) };
      const rows = engine.winners(g).slice(0,9).map(r => ({ name:productName(r.p), overall:r.s.overall, raw:r.s.raw, evidenceQuality:r.s.evidenceQuality }));
      const best = engine.winners(g)[0] || null;
      const current = engine.currentScore(g);
      return {
        rows,
        current:{ score:current.score, label:current.label, hardConstraints:current.detail?.hardConstraints ?? [], evidenceQuality:current.detail?.evidenceQuality ?? null },
        decision:engine.recommendation(best,current)
      };
    };

    const missing226 = snapshot(v226, {}), missing227 = snapshot(v227, {});
    const exactClub = {brand:'Titleist',model:'GTS4',results:'mixed'};
    const exact226 = snapshot(v226, exactClub), exact227 = snapshot(v227, exactClub);
    const historicalClub = {brand:'Titleist',model:'TS2 (2018)',results:'mixed'};
    const historical226 = snapshot(v226, historicalClub), historical227 = snapshot(v227, historicalClub);

    return { missing226,missing227,exact226,exact227,historical226,historical227 };
  });

  const sameRows = (a,b) => JSON.stringify(a.rows) === JSON.stringify(b.rows);
  for (const key of ['missing','exact','historical']) {
    const a=report[`${key}226`], b=report[`${key}227`];
    if (!sameRows(a,b)) fail(`ranking-score-parity-${key}`, JSON.stringify({v226:a.rows,v227:b.rows}));
    else pass(`ranking-score-parity-${key}`, `${a.rows[0]?.name} ${a.rows[0]?.overall}; top 9 identical`);

    const sameCurrent = JSON.stringify(a.current) === JSON.stringify(b.current);
    if (!sameCurrent) fail(`current-score-parity-${key}`, JSON.stringify({v226:a.current,v227:b.current}));
    else pass(`current-score-parity-${key}`, JSON.stringify(a.current));
  }

  if (JSON.stringify(report.missing226.decision)!==JSON.stringify(report.missing227.decision)) fail('missing-semantics-parity', JSON.stringify({v226:report.missing226.decision,v227:report.missing227.decision}));
  else pass('missing-semantics-parity', report.missing227.decision.level);

  if (JSON.stringify(report.exact226.decision)!==JSON.stringify(report.exact227.decision)) fail('exact-hard-constraint-semantics-parity', JSON.stringify({v226:report.exact226.decision,v227:report.exact227.decision}));
  else pass('exact-hard-constraint-semantics-parity', report.exact227.decision.level);

  if (report.historical226.decision.level !== 'Strong upgrade candidate') fail('defect-reproduced-v226', JSON.stringify(report.historical226.decision));
  else pass('defect-reproduced-v226', report.historical226.decision.text);

  if (report.historical227.decision.level !== 'Worth a side-by-side test') fail('historical-ceiling-v227', JSON.stringify(report.historical227.decision));
  else if (!/historical modeled profile/i.test(report.historical227.decision.text)) fail('historical-explanation-v227', report.historical227.decision.text);
  else pass('historical-ceiling-v227', report.historical227.decision.text);

  console.log(JSON.stringify({generatedAt:new Date().toISOString(),productionScoringChanged:false,failures,checks,report},null,2));
  if (failures.length) process.exitCode=1;
} catch(err){
  console.error(err); process.exitCode=1;
} finally { await browser.close(); }
