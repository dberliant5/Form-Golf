import { chromium } from 'playwright';

const base = process.env.FORM_BASE_URL || 'http://127.0.0.1:8080';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const failures = [];
const checks = [];
const observations = [];
const fail = (name, detail) => failures.push({ name, detail });
const pass = (name, detail) => checks.push({ name, detail });

try {
  await page.goto(`${base}/index.html`, { waitUntil:'networkidle', timeout:30000 });
  await page.waitForFunction(() => window.FORM_DRIVER_ENGINE_V80, null, { timeout:15000 });

  const report = await page.evaluate(async () => {
    const clone = v => JSON.parse(JSON.stringify(v));
    const baseGolfer = clone(typeof normalizedGolferV69 === 'function' ? normalizedGolferV69() : golfer());
    const source = await fetch('assets/driver-engine-v227.js').then(r => r.text());
    const hook = 'window.FORM_DRIVER_ENGINE_V80={scoreOne,winners,currentScore,compare};';
    if (!source.includes(hook)) throw new Error('v227 recommendation export hook not found');
    (0, eval)(source.replace(hook, 'window.FORM_DRIVER_ENGINE_V80={scoreOne,winners,currentScore,compare,recommendation};'));
    const engine = window.FORM_DRIVER_ENGINE_V80;
    const productName = p => `${p.brand} ${p.model}`;

    const run = p => {
      const g = { ...clone(baseGolfer), currentClub:{ brand:p.brand, model:p.model } };
      const best = engine.winners(g)[0] || null;
      const current = engine.currentScore(g);
      const decision = engine.recommendation(best,current);
      const gap = best && Number.isFinite(current.score) ? Math.round((best.s.overall-current.score)*10)/10 : null;
      return {
        currentName:productName(p),
        currentScore:current.score,
        currentLabel:current.label,
        evidenceQuality:current.detail?.evidenceQuality ?? null,
        hardConstraints:current.detail?.hardConstraints ?? [],
        bestName:best ? productName(best.p) : null,
        bestScore:best?.s?.overall ?? null,
        gap,
        decision
      };
    };

    const active = (typeof products !== 'undefined' && Array.isArray(products) ? products : [])
      .filter(p => p && p.brand && p.model && p.generation !== 'previous_limited');
    const rows = active.map(run);
    const unconstrained = rows.filter(x => !x.hardConstraints.length && Number.isFinite(x.currentScore));
    const limited = unconstrained.filter(x => Number.isFinite(x.evidenceQuality) && x.evidenceQuality < .45);
    const developing = unconstrained.filter(x => x.evidenceQuality >= .45 && x.evidenceQuality < .62);
    const good = unconstrained.filter(x => x.evidenceQuality >= .62);
    const strong = unconstrained.filter(x => x.decision.level === 'Strong upgrade candidate');
    const limitedStrong = strong.filter(x => x.evidenceQuality < .45);
    const developingStrong = strong.filter(x => x.evidenceQuality >= .45 && x.evidenceQuality < .62);
    const goodStrong = strong.filter(x => x.evidenceQuality >= .62);

    return { activeCount:active.length, rows, unconstrained, limited, developing, good, strong, limitedStrong, developingStrong, goodStrong };
  });

  if (report.rows.length !== report.activeCount) fail('active-current-enumeration', `${report.rows.length}/${report.activeCount}`);
  else pass('active-current-enumeration', `${report.activeCount} active current-generation models audited`);

  const unresolved = report.rows.filter(x => x.currentLabel !== 'Exact model profile' || !Number.isFinite(x.currentScore));
  if (unresolved.length) fail('exact-current-resolution', JSON.stringify(unresolved.slice(0,5)));
  else pass('exact-current-resolution', 'all active current-generation models resolved as exact current profiles');

  const badEvidence = report.unconstrained.filter(x => !Number.isFinite(x.evidenceQuality));
  if (badEvidence.length) fail('current-evidence-numeric', JSON.stringify(badEvidence.slice(0,5)));
  else pass('current-evidence-numeric', 'all unconstrained exact current models expose finite evidence quality');

  const hardConstraintOverclaim = report.rows.filter(x => x.hardConstraints.length && x.decision.level === 'Strong upgrade candidate');
  if (hardConstraintOverclaim.length) fail('hard-constraint-claim-ceiling', JSON.stringify(hardConstraintOverclaim.slice(0,5)));
  else pass('hard-constraint-claim-ceiling', 'no hard-constrained current model produces the strongest replacement claim');

  observations.push({
    name:'claim-confidence-distribution',
    detail:{
      unconstrained:report.unconstrained.length,
      evidenceBands:{limited:report.limited.length,developing:report.developing.length,good:report.good.length},
      strongUpgradeCandidates:report.strong.length,
      strongByEvidence:{limited:report.limitedStrong.length,developing:report.developingStrong.length,good:report.goodStrong.length}
    }
  });
  if (report.limitedStrong.length) observations.push({
    name:'limited-evidence-strong-upgrade-candidates',
    detail:report.limitedStrong.map(x=>({currentName:x.currentName,currentScore:x.currentScore,evidenceQuality:x.evidenceQuality,bestName:x.bestName,bestScore:x.bestScore,gap:x.gap,decision:x.decision.level}))
  });

  console.log(JSON.stringify({
    generatedAt:new Date().toISOString(),
    productionScoringChanged:false,
    purpose:'Diagnostic-only audit of whether current-club evidence confidence and replacement-claim strength are calibrated consistently. No confidence threshold is imposed by this test; it records the distribution before any policy change is considered.',
    failures,checks,observations,report
  },null,2));
  if (failures.length) process.exitCode=1;
} catch(err){
  console.error(err); process.exitCode=1;
} finally { await browser.close(); }
