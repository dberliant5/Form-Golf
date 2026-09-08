import { chromium } from 'playwright';

const base = process.env.FORM_BASE_URL || 'http://127.0.0.1:8080';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

try {
  await page.goto(`${base}/index.html`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForFunction(() => window.FORM_DRIVER_ENGINE_V80, null, { timeout: 15000 });

  const report = await page.evaluate(async () => {
    const clone = v => JSON.parse(JSON.stringify(v));
    const baseGolfer = clone(typeof normalizedGolferV69 === 'function' ? normalizedGolferV69() : golfer());
    baseGolfer.currentClub = baseGolfer.currentClub || {};

    const source = await fetch('assets/driver-engine-v225.js').then(r => r.text());
    const needle = 'window.FORM_DRIVER_ENGINE_V80={scoreOne,winners,currentScore,compare};';
    if (!source.includes(needle)) throw new Error('v225 export hook not found');
    (0, eval)(source.replace(needle, 'window.FORM_DRIVER_ENGINE_V80={scoreOne,winners,currentScore,compare,recommendation};'));
    const engine = window.FORM_DRIVER_ENGINE_V80;
    const pname = p => `${p.brand} ${p.model}`;

    const baseline = { ...clone(baseGolfer), currentClub:{} };
    const best = engine.winners(baseline)[0];
    if (!best) throw new Error('No best product available');

    const rows = (typeof products !== 'undefined' && Array.isArray(products) ? products : [])
      .filter(p => p?.brand && p?.model && p.generation !== 'previous_limited')
      .map(p => {
        const g = { ...clone(baseGolfer), currentClub:{brand:p.brand,model:p.model,results:'mixed'} };
        const current = engine.currentScore(g);
        const decision = engine.recommendation(best,current);
        const gap = current.score == null ? null : Math.round((best.s.overall-current.score)*10)/10;
        const diffs = current.detail?.components?.length ? engine.compare(best.s,current.detail) : [];
        return {
          current:pname(p),
          gap,
          currentScore:current.score,
          currentRaw:current.detail?.raw ?? null,
          currentEvidenceQuality:current.detail?.evidenceQuality ?? null,
          hardConstraints:current.detail?.hardConstraints || [],
          componentCount:current.detail?.components?.length || 0,
          wins:diffs.filter(x=>x.delta>=4),
          diffs,
          decision,
          currentComponents:(current.detail?.components||[]).map(x=>({key:x.key,label:x.label,score:x.score,weight:x.normalizedWeight,evidenceConfidence:x.evidenceConfidence,impact:x.impact}))
        };
      })
      .filter(x => Number.isFinite(x.gap))
      .sort((a,b)=>b.gap-a.gap);

    const bands = {
      under2_5: rows.filter(x=>x.gap<2.5).slice(0,5),
      two5to6: rows.filter(x=>x.gap>=2.5&&x.gap<6).slice(0,5),
      sixTo12: rows.filter(x=>x.gap>=6&&x.gap<12).slice(0,5),
      over12: rows.filter(x=>x.gap>=12).slice(0,10)
    };
    const constrained = rows.filter(x=>x.hardConstraints.length);
    const unconstrained = rows.filter(x=>!x.hardConstraints.length);
    return {
      best:{name:pname(best.p),overall:best.s.overall,raw:best.s.raw,evidenceQuality:best.s.evidenceQuality,components:best.s.components.map(x=>({key:x.key,label:x.label,score:x.score,weight:x.normalizedWeight,evidenceConfidence:x.evidenceConfidence,impact:x.impact}))},
      counts:{all:rows.length,constrained:constrained.length,unconstrained:unconstrained.length},
      constrained:constrained.slice(0,20),
      bands
    };
  });

  const failures = [];
  const checks = [];
  const pathological = report.constrained.filter(x => x.gap >= 6 && x.decision?.level === 'No clear equipment upgrade');
  if (!pathological.length) failures.push({name:'hard-constraint-pathology-present',detail:'No constrained >=6-point exact-current cases were observed; original v236 pathology did not reproduce.'});
  else checks.push({name:'hard-constraint-pathology-reproduced',detail:`${pathological.length} constrained exact-current cases with >=6-point gaps returned No clear equipment upgrade`});

  const unconstrainedLarge = [...report.bands.sixTo12,...report.bands.over12].filter(x=>!x.hardConstraints.length);
  const incoherentUnconstrained = unconstrainedLarge.filter(x=>x.gap>=6 && x.decision?.level==='No clear equipment upgrade');
  if (incoherentUnconstrained.length) failures.push({name:'unconstrained-large-gap-incoherence',detail:incoherentUnconstrained.map(x=>({current:x.current,gap:x.gap,wins:x.wins,decision:x.decision})).slice(0,5)});
  else checks.push({name:'unconstrained-large-gap-semantics',detail:`${unconstrainedLarge.length} unconstrained >=6-point observations had no reproduced empty-component hard-constraint pathology`});

  console.log(JSON.stringify({generatedAt:new Date().toISOString(),productionScoringChanged:false,failures,checks,report},null,2));
  if (failures.some(x=>x.name==='unconstrained-large-gap-incoherence')) process.exitCode=1;
} catch (err) {
  console.error(err);
  process.exitCode=1;
} finally {
  await browser.close();
}
