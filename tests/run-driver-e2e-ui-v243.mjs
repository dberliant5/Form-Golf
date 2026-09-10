import { chromium } from 'playwright';

const base = process.env.FORM_URL || 'http://127.0.0.1:8080';
const pageUrl = `${base.replace(/\/$/,'')}/static-test-v995.html?e2e=${Date.now()}`;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const consoleErrors = [];
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push(e.message));

try {
  await page.goto(pageUrl, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForFunction(() => !!window.FORM_DRIVER_ENGINE_V80, null, { timeout: 30000 });
  await page.waitForFunction(() => !!window.FORM_DRIVER_INTERVIEW_QUALITY_V153 || !!document.querySelector('#step6 input[type="range"]'), null, { timeout: 15000 }).catch(async e => {
    const d = await page.evaluate(() => ({href:location.href, engine:window.FORM_DRIVER_ENGINE_V80?.version||null, interview:window.FORM_DRIVER_INTERVIEW_QUALITY_V153?.version||null, hasState:typeof state!=='undefined', step6:!!document.getElementById('step6'), priorityRank:!!document.getElementById('priorityRank'), rangeCount:document.querySelectorAll('#step6 input[type="range"]').length, body:document.body.innerText.slice(0,800)}));
    throw new Error(`Interview layer did not initialize: ${JSON.stringify(d)}`);
  });
  await page.getByRole('button', { name: /Start Driver Fitting/i }).first().click();

  await page.evaluate(() => window.goTo?.(6));
  await page.waitForSelector('#step6:not(.hidden)', { timeout: 10000 });
  await page.waitForSelector('#step6 input[type="range"]', { state: 'attached', timeout: 10000 });
  const rangeCount = await page.locator('#step6 input[type="range"]').count();
  if (rangeCount !== 1) throw new Error(`Expected one priority slider; found ${rangeCount}`);
  const ptxt = await page.locator('#step6').innerText();
  if (!/Distance/i.test(ptxt) || !/Accuracy\s*&?\s*forgiveness/i.test(ptxt)) throw new Error('Distance vs Accuracy/Forgiveness continuum missing');
  if (/Rank these six factors/i.test(ptxt)) throw new Error('Legacy six-factor priority UI is visible');
  if (await page.locator('#step6 select').count()) throw new Error('Legacy priority select controls are present');

  await page.evaluate(() => window.goTo?.(4));
  await page.locator('[data-group="strike"] [data-v="heel"]').click();
  await page.waitForSelector('#strikeSourceV150:not(.hidden)', { timeout: 10000 });
  const stxt = await page.locator('#strikeSourceV150').innerText();
  if (!/How do you know the strike location\?/i.test(stxt)) throw new Error('Strike evidence question missing');
  await page.locator('#strikeSourceV150 [data-v="confirmed"]').click();

  const wiring = await page.evaluate(() => ({
    strike: typeof state!=='undefined' ? state.strike : null,
    strikeSource: typeof state!=='undefined' ? state.strikeSource : null,
    split: typeof state!=='undefined' ? state.driverPrioritySplit : null,
    interviewVersion: window.FORM_DRIVER_INTERVIEW_QUALITY_V153?.version || null,
    explorerLoaded: !!window.FORM_RESULTS_COMPARE_EXPLORER_V197,
    engineVersion: window.FORM_DRIVER_ENGINE_V80?.version || null
  }));
  if (wiring.strike !== 'heel' || wiring.strikeSource !== 'confirmed') throw new Error(`Strike wiring failed: ${JSON.stringify(wiring)}`);
  if (!wiring.split || typeof wiring.split.accuracy !== 'number') throw new Error('Priority slider is not wired to driverPrioritySplit');
  if (!wiring.explorerLoaded) throw new Error('Dynamic comparison explorer module is not loaded');

  await page.evaluate(() => {
    if (typeof state!=='undefined') {
      state.start = state.start || 'straight'; state.curve = state.curve || 'straight';
      state.costly = state.costly || 'two_way'; state.strike = 'heel'; state.strikeSource = 'confirmed';
      state.lm = state.lm || 'none'; state.transition = state.transition || 'neutral';
      state.current = state.current || 'good';
      state.driverPrioritySplit = state.driverPrioritySplit || { accuracy: 50, distance: 50, touched: true };
    }
    window.showResults?.();
  });
  await page.waitForSelector('#results:not(.hidden)', { timeout: 20000 });
  await page.waitForTimeout(1200);
  if ((await page.locator('#results').innerText()).trim().length < 200) throw new Error('Results narrative did not render');
  const explorerCount = await page.locator('.formCompare197').count();
  if (!explorerCount) throw new Error('Dynamic results explorer did not render');
  if (consoleErrors.length) throw new Error(`Console/page errors: ${consoleErrors.join(' | ')}`);

  console.log(JSON.stringify({ ok: true, rangeCount, explorerCount, wiring }, null, 2));
} finally {
  await browser.close();
}
