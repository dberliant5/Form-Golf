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
    const exact = (id, value) => { state.metrics = state.metrics || {}; state.metrics[id] = { mode: 'exact', value }; };
    const unknown = id => { state.metrics = state.metrics || {}; state.metrics[id] = { mode: 'unknown', value: null }; };
    const setCore = (speed, launch, spin, aoa = 3) => { exact('speed', speed); exact('launch', launch); exact('spin', spin); exact('aoa', aoa); unknown('ballSpeed'); unknown('carry'); };
    const golferNow = () => typeof normalizedGolferV69 === 'function' ? normalizedGolferV69() : golfer();
    const productName = p => `${p.brand} ${p.model}`;
    const compMap = score => Object.fromEntries((score.components || []).map(x => [x.key, x]));
    const rankNames = g => window.FORM_DRIVER_ENGINE_V80.winners(g).slice(0, 9).map(r => productName(r.p));
    const setPriority = name => {
      state.ranks = state.ranks || {};
      if (name === 'accuracy') Object.assign(state.ranks, { accuracy: 1, distance: 3, flight: 2 });
      else if (name === 'distance') Object.assign(state.ranks, { distance: 1, accuracy: 3, flight: 2 });
      else if (name === 'flight') Object.assign(state.ranks, { flight: 1, accuracy: 2, distance: 3 });
      else Object.assign(state.ranks, { accuracy: 2, distance: 2, flight: 2 });
    };
    const restore = saved => { Object.keys(state).forEach(k => delete state[k]); Object.assign(state, saved); };

    const priority = (() => {
      const saved = clone(state);
      try {
        setCore(95, 12.5, 2450); const baseG = clone(golferNow()); Object.assign(baseG, { strike: 'center', curveClass: 'fade_curve', costly: 'right' });
        setPriority('balanced'); const product = window.FORM_DRIVER_ENGINE_V80.winners(baseG)[0].p;
        const out = {};
        for (const name of ['balanced','accuracy','distance','flight']) {
          setPriority(name);
          const g = clone(golferNow()); Object.assign(g, { strike: 'center', curveClass: 'fade_curve', costly: 'right' });
          const score = window.FORM_DRIVER_ENGINE_V80.scoreOne(product, g); const c = compMap(score);
          out[name] = {
            overall: score.overall,
            ranks: rankNames(g),
            families: {
              accuracy: (c.strike?.normalizedWeight || 0) + (c.direction?.normalizedWeight || 0),
              distance: (c.speed?.normalizedWeight || 0) + (c.efficiency?.normalizedWeight || 0) + (c.carry?.normalizedWeight || 0),
              flight: (c.spin?.normalizedWeight || 0) + (c.launch?.normalizedWeight || 0)
            }
          };
        }
        return { product: productName(product), ...out };
      } finally { restore(saved); }
    })();

    const severity = (() => {
      const saved = clone(state);
      try {
        setPriority('balanced'); setCore(95, 12.5, 2450); const g0 = clone(golferNow()); Object.assign(g0, { strike: 'center', curveClass: null, costly: null });
        const product = window.FORM_DRIVER_ENGINE_V80.winners(g0)[0].p;
        const one = (launch, spin) => {
          setCore(95, launch, spin); const g = clone(golferNow()); Object.assign(g, { strike: 'center', curveClass: null, costly: null });
          const s = window.FORM_DRIVER_ENGINE_V80.scoreOne(product, g); const c = compMap(s);
          return { overall: s.overall, launchWeight: c.launch?.normalizedWeight ?? null, spinWeight: c.spin?.normalizedWeight ?? null, top5: rankNames(g).slice(0,5) };
        };
        return {
          product: productName(product),
          launch: { neutral: one(12.5,2450), low1: one(10,2450), low2: one(8,2450), high1: one(16,2450), high2: one(20,2450) },
          spin: { neutral: one(12.5,2450), low1: one(12.5,1800), low2: one(12.5,1400), high1: one(12.5,3200), high2: one(12.5,3800) }
        };
      } finally { restore(saved); }
    })();

    return { priority, severity };
  });

  const p = report.priority;
  const fam = k => p[k].families;
  if (!(fam('accuracy').accuracy > fam('balanced').accuracy && fam('accuracy').accuracy > fam('distance').accuracy && fam('accuracy').accuracy > fam('flight').accuracy)) fail('priority-accuracy', JSON.stringify(fam('accuracy'))); else pass('priority-accuracy', `accuracy family rises to ${fam('accuracy').accuracy.toFixed(1)}% for ${p.product}`);
  if (!(fam('distance').distance > fam('balanced').distance && fam('distance').distance > fam('accuracy').distance && fam('distance').distance > fam('flight').distance)) fail('priority-distance', JSON.stringify(fam('distance'))); else pass('priority-distance', `distance family rises to ${fam('distance').distance.toFixed(1)}% for ${p.product}`);
  if (!(fam('flight').flight > fam('balanced').flight && fam('flight').flight > fam('accuracy').flight && fam('flight').flight > fam('distance').flight)) fail('priority-flight', JSON.stringify(fam('flight'))); else pass('priority-flight', `flight family rises to ${fam('flight').flight.toFixed(1)}% for ${p.product}`);

  const rankingVariants = new Set(['balanced','accuracy','distance','flight'].map(k => JSON.stringify(p[k].ranks)));
  if (rankingVariants.size < 2) fail('priority-ranking-response', 'all four priority settings produced identical full rankings'); else pass('priority-ranking-response', `${rankingVariants.size} distinct rankings across balanced/accuracy/distance/flight`);

  const L = report.severity.launch, S = report.severity.spin;
  const monoLowLaunch = L.low2.launchWeight > L.low1.launchWeight && L.low1.launchWeight > L.neutral.launchWeight;
  const monoHighLaunch = L.high2.launchWeight > L.high1.launchWeight && L.high1.launchWeight > L.neutral.launchWeight;
  const monoLowSpin = S.low2.spinWeight > S.low1.spinWeight && S.low1.spinWeight > S.neutral.spinWeight;
  const monoHighSpin = S.high2.spinWeight > S.high1.spinWeight && S.high1.spinWeight > S.neutral.spinWeight;
  if (!monoLowLaunch) fail('launch-low-severity', JSON.stringify(L)); else pass('launch-low-severity', `${L.neutral.launchWeight}→${L.low1.launchWeight}→${L.low2.launchWeight}%`);
  if (!monoHighLaunch) fail('launch-high-severity', JSON.stringify(L)); else pass('launch-high-severity', `${L.neutral.launchWeight}→${L.high1.launchWeight}→${L.high2.launchWeight}%`);
  if (!monoLowSpin) fail('spin-low-severity', JSON.stringify(S)); else pass('spin-low-severity', `${S.neutral.spinWeight}→${S.low1.spinWeight}→${S.low2.spinWeight}%`);
  if (!monoHighSpin) fail('spin-high-severity', JSON.stringify(S)); else pass('spin-high-severity', `${S.neutral.spinWeight}→${S.high1.spinWeight}→${S.high2.spinWeight}%`);

  const bounded = [L.low1,L.low2,L.high1,L.high2,S.low1,S.low2,S.high1,S.high2].every(x => Number.isFinite(x.overall) && x.overall >= 45 && x.overall <= 99.2);
  if (!bounded) fail('severity-bounds', 'one or more severe flight cases left scorer bounds'); else pass('severity-bounds', 'all severe flight cases remained within scorer bounds');

  console.log(JSON.stringify({ generatedAt: new Date().toISOString(), productionScoringChanged: false, failures, checks, report }, null, 2));
  if (failures.length) process.exitCode = 1;
} catch (err) {
  console.error(err);
  process.exitCode = 1;
} finally {
  await browser.close();
}
