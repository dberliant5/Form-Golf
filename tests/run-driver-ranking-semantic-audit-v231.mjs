import { chromium } from 'playwright';

const base = process.env.FORM_BASE_URL || 'http://127.0.0.1:8080';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const failures = [];
const notes = [];
const fail = (name, detail) => failures.push({ name, detail });
const pass = (name, detail) => notes.push({ name, detail });

try {
  await page.goto(`${base}/index.html`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForFunction(() => window.FORM_DRIVER_ENGINE_V80 && window.FORM_DRIVER_CONFIG_V81, null, { timeout: 15000 });

  const report = await page.evaluate(() => {
    const clone = v => JSON.parse(JSON.stringify(v));
    const productName = r => r ? `${r.p.brand} ${r.p.model}` : null;
    const exact = (id, value) => { state.metrics = state.metrics || {}; state.metrics[id] = { mode: 'exact', value }; };
    const unknown = id => { state.metrics = state.metrics || {}; state.metrics[id] = { mode: 'unknown', value: null }; };
    const setCore = (speed, launch, spin, aoa = 3) => { exact('speed', speed); exact('launch', launch); exact('spin', spin); exact('aoa', aoa); unknown('ballSpeed'); unknown('carry'); };
    const golferNow = () => typeof normalizedGolferV69 === 'function' ? normalizedGolferV69() : golfer();
    const comp = (s, key) => (s.components || []).find(x => x.key === key);
    const snapshot = g => window.FORM_DRIVER_ENGINE_V80.winners(g).slice(0, 10).map((r, i) => ({ rank: i + 1, name: productName(r), score: r.s.overall }));
    const sameRanking = (a, b) => JSON.stringify(a.map(x => [x.name, x.score])) === JSON.stringify(b.map(x => [x.name, x.score]));
    const overlap = (a, b, n = 5) => { const B = new Set(b.slice(0, n).map(x => x.name)); return a.slice(0, n).filter(x => B.has(x.name)).length; };
    const runCase = fn => { const saved = clone(state); try { const g = clone(golferNow()); fn(g); return { g, rows: snapshot(g) }; } finally { Object.keys(state).forEach(k => delete state[k]); Object.assign(state, saved); } };

    const scripts = [...document.scripts].map(s => s.getAttribute('src')).filter(Boolean);
    const stack = {
      engine225: scripts.some(x => /driver-engine-v225\.js/.test(x)),
      config230: scripts.some(x => /driver-config-v230\.js/.test(x)),
      config81Direct: scripts.some(x => /driver-config-v81\.js/.test(x))
    };

    const baseCase = runCase(g => { setCore(95, 12.5, 2450); g.strike = 'center'; g.curveClass = null; g.costly = null; });
    const speed94 = runCase(g => { setCore(94, 12.5, 2450); g.strike = 'center'; g.curveClass = null; g.costly = null; });
    const speed96 = runCase(g => { setCore(96, 12.5, 2450); g.strike = 'center'; g.curveClass = null; g.costly = null; });
    const launchLowEdge = runCase(g => { setCore(95, 10.9, 2450); g.strike = 'center'; g.curveClass = null; g.costly = null; });
    const launchHighEdge = runCase(g => { setCore(95, 11.1, 2450); g.strike = 'center'; g.curveClass = null; g.costly = null; });
    const spinLowEdge = runCase(g => { setCore(95, 12.5, 2090); g.strike = 'center'; g.curveClass = null; g.costly = null; });
    const spinHighEdge = runCase(g => { setCore(95, 12.5, 2110); g.strike = 'center'; g.curveClass = null; g.costly = null; });

    const direction = (() => {
      const saved = clone(state);
      try {
        setCore(95, 12.5, 2450);
        const neutral = clone(golferNow()); Object.assign(neutral, { strike: 'center', curveClass: null, costly: null });
        const right = clone(neutral); Object.assign(right, { curveClass: 'fade_curve', costly: 'right' });
        const left = clone(neutral); Object.assign(left, { curveClass: 'draw_curve', costly: 'left' });
        const twoWay = clone(neutral); Object.assign(twoWay, { costly: 'two_way' });
        const p = window.FORM_DRIVER_ENGINE_V80.winners(neutral)[0].p;
        const scores = Object.fromEntries([['neutral',neutral],['right',right],['left',left],['twoWay',twoWay]].map(([k,g]) => [k, comp(window.FORM_DRIVER_ENGINE_V80.scoreOne(p,g),'direction')?.score ?? null]));
        const ev = window.FORM_DRIVER_ENGINE_V80.scoreOne(p,neutral).evidence?.dimensions || {};
        return { product: `${p.brand} ${p.model}`, scores, evidence: { drawHelp: ev.drawHelp?.value ?? null, neutralBias: ev.neutralBias?.value ?? null } };
      } finally { Object.keys(state).forEach(k => delete state[k]); Object.assign(state, saved); }
    })();

    const strike = (() => {
      const saved = clone(state);
      try {
        setCore(95, 12.5, 2450);
        const center = clone(golferNow()); Object.assign(center, { strike: 'center', curveClass: null, costly: null });
        const toe = clone(center); toe.strike = 'toe';
        const heel = clone(center); heel.strike = 'heel';
        const p = window.FORM_DRIVER_ENGINE_V80.winners(center)[0].p;
        const scores = Object.fromEntries([['center',center],['toe',toe],['heel',heel]].map(([k,g]) => [k, comp(window.FORM_DRIVER_ENGINE_V80.scoreOne(p,g),'strike')?.score ?? null]));
        const ev = window.FORM_DRIVER_ENGINE_V80.scoreOne(p,center).evidence?.dimensions || {};
        return { product: `${p.brand} ${p.model}`, scores, evidence: { stability: ev.stability?.value ?? null, toeRetention: ev.toeRetention?.value ?? null, heelRetention: ev.heelRetention?.value ?? null } };
      } finally { Object.keys(state).forEach(k => delete state[k]); Object.assign(state, saved); }
    })();

    const satisfactionInvariant = (() => {
      const saved = clone(state);
      try {
        setCore(95, 12.5, 2450);
        const a = clone(golferNow()); Object.assign(a, { strike: 'center', curveClass: 'fade_curve', costly: 'right' }); a.currentClub = a.currentClub || {}; a.currentClub.results = 'mixed';
        const b = clone(a); b.currentClub.results = 'good';
        return { same: sameRanking(snapshot(a), snapshot(b)), mixed: snapshot(a), good: snapshot(b) };
      } finally { Object.keys(state).forEach(k => delete state[k]); Object.assign(state, saved); }
    })();

    const commercialInvariant = (() => {
      const saved = clone(state);
      try {
        setCore(95, 12.5, 2450);
        const g = clone(golferNow()); Object.assign(g, { strike: 'center', curveClass: 'fade_curve', costly: 'right' });
        const before = snapshot(g);
        const touched = window.FORM_DRIVER_ENGINE_V80.winners(g).map(r => r.p);
        const originals = touched.map(p => ({ p, fields: { affiliateUrl: p.affiliateUrl, affiliate: p.affiliate, commission: p.commission, sponsoredRank: p.sponsoredRank, commercialRank: p.commercialRank } }));
        touched.forEach((p, i) => { p.affiliateUrl = `https://example.test/${i}`; p.affiliate = i % 2 === 0; p.commission = 1000 - i; p.sponsoredRank = touched.length - i; p.commercialRank = i + 1; });
        const after = snapshot(g);
        originals.forEach(({p,fields}) => Object.entries(fields).forEach(([k,v]) => { if (v === undefined) delete p[k]; else p[k] = v; }));
        return { same: sameRanking(before, after), before, after };
      } finally { Object.keys(state).forEach(k => delete state[k]); Object.assign(state, saved); }
    })();

    const delta = (a,b) => Math.round(((b.rows[0]?.score ?? 0) - (a.rows[0]?.score ?? 0))*10)/10;
    return {
      stack,
      cases: {
        base: baseCase.rows,
        speed94: speed94.rows,
        speed96: speed96.rows,
        launchLowEdge: launchLowEdge.rows,
        launchHighEdge: launchHighEdge.rows,
        spinLowEdge: spinLowEdge.rows,
        spinHighEdge: spinHighEdge.rows
      },
      continuity: {
        speed94to95: { topScoreDelta: delta(speed94,baseCase), top5Overlap: overlap(speed94.rows,baseCase.rows) },
        speed95to96: { topScoreDelta: delta(baseCase,speed96), top5Overlap: overlap(baseCase.rows,speed96.rows) },
        launch109to111: { topScoreDelta: delta(launchLowEdge,launchHighEdge), top5Overlap: overlap(launchLowEdge.rows,launchHighEdge.rows) },
        spin2090to2110: { topScoreDelta: delta(spinLowEdge,spinHighEdge), top5Overlap: overlap(spinLowEdge.rows,spinHighEdge.rows) }
      },
      direction,
      strike,
      satisfactionInvariant,
      commercialInvariant
    };
  });

  if (!report.stack.engine225) fail('active-engine', 'index.html did not load driver-engine-v225.js'); else pass('active-engine', 'v225 loaded');
  if (!report.stack.config230) fail('active-config', 'index.html did not load driver-config-v230.js'); else pass('active-config', 'v230 loaded');
  if (report.stack.config81Direct) fail('legacy-config', 'index.html directly loads driver-config-v81.js'); else pass('legacy-config', 'v81 not directly loaded');
  if (!report.satisfactionInvariant.same) fail('satisfaction-invariant', 'current-club result label changed absolute ranking'); else pass('satisfaction-invariant', 'absolute ranking independent of current-club result label');
  if (!report.commercialInvariant.same) fail('commercial-invariant', 'commercial/affiliate-only fields changed ranking or score'); else pass('commercial-invariant', 'commercial/affiliate-only fields have no ranking influence');

  for (const [name, c] of Object.entries(report.continuity)) {
    if (Math.abs(c.topScoreDelta) > 2.0) fail(`continuity-${name}`, `top score moved ${c.topScoreDelta} points across a narrow neighborhood`);
    else pass(`continuity-${name}`, `top score delta ${c.topScoreDelta}; top-5 overlap ${c.top5Overlap}/5`);
    if (c.top5Overlap < 3) fail(`rank-overlap-${name}`, `top-5 overlap fell to ${c.top5Overlap}/5 across a narrow neighborhood`);
  }

  const d = report.direction;
  if (d.evidence.drawHelp != null && Math.abs(d.scores.right - d.evidence.drawHelp) > 0.11) fail('direction-right', `right-miss component ${d.scores.right} != drawHelp ${d.evidence.drawHelp}`); else pass('direction-right', `${d.product}: right miss uses draw-help evidence`);
  if (d.evidence.neutralBias != null && (Math.abs(d.scores.left - d.evidence.neutralBias) > 0.11 || Math.abs(d.scores.twoWay - d.evidence.neutralBias) > 0.11)) fail('direction-neutral', `left/two-way directional component does not track neutralBias ${d.evidence.neutralBias}`); else pass('direction-neutral', `${d.product}: left/two-way uses neutral-bias evidence`);

  const s = report.strike;
  const expectedToe = Math.round((s.evidence.stability * .42 + s.evidence.toeRetention * .58) * 10) / 10;
  const expectedHeel = Math.round((s.evidence.stability * .42 + s.evidence.heelRetention * .58) * 10) / 10;
  if (s.evidence.stability != null && Math.abs(s.scores.center - s.evidence.stability) > 0.11) fail('strike-center', `center strike ${s.scores.center} != stability ${s.evidence.stability}`); else pass('strike-center', `${s.product}: center strike uses stability evidence`);
  if (s.evidence.toeRetention != null && Math.abs(s.scores.toe - expectedToe) > 0.11) fail('strike-toe', `toe strike ${s.scores.toe} != expected ${expectedToe}`); else pass('strike-toe', `${s.product}: toe strike uses toe-retention evidence`);
  if (s.evidence.heelRetention != null && Math.abs(s.scores.heel - expectedHeel) > 0.11) fail('strike-heel', `heel strike ${s.scores.heel} != expected ${expectedHeel}`); else pass('strike-heel', `${s.product}: heel strike uses heel-retention evidence`);

  console.log(JSON.stringify({ generatedAt: new Date().toISOString(), productionScoringChanged: false, failures, checks: notes, report }, null, 2));
  if (failures.length) process.exitCode = 1;
} catch (err) {
  console.error(err);
  process.exitCode = 1;
} finally {
  await browser.close();
}
