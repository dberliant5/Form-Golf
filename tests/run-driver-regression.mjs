import { chromium } from 'playwright';
import fs from 'node:fs';

const browser = await chromium.launch({headless:true});
const page = await browser.newPage();
try {
  await page.goto('http://127.0.0.1:8080/tests/driver-regression-runner-v220.html', {waitUntil:'networkidle'});
  await page.click('#run');
  await page.waitForFunction(() => window.FORM_STABLE_BASELINE_V220, null, {timeout:30000});
  const report = await page.evaluate(() => window.FORM_STABLE_BASELINE_V220);
  fs.mkdirSync('tests/baselines', {recursive:true});
  fs.writeFileSync('tests/baselines/driver-stable-v220.json', JSON.stringify(report, null, 2));
  const summary = {
    matrixCases: report.matrix?.caseCount,
    aoaInvariant: report.aoa?.checks?.minus4VsPlus4Identical,
    thresholdPairs: (report.matrix?.pairChecks||[]).filter(x => ['R01','R02','R04','R06'].includes(x.a)).map(x => ({pair:`${x.a}->${x.b}`,topChanged:x.topChanged,topScoreDelta:x.topScoreDelta,moves:x.moves?.length||0})),
    currentSatisfactionInvariant: (report.matrix?.pairChecks||[]).find(x=>x.a==='C01'&&x.b==='C02') || null,
    doubleCountStress: (report.matrix?.pairChecks||[]).filter(x=>x.a==='X01')
  };
  fs.writeFileSync('tests/baselines/driver-stable-v220-summary.json', JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
} finally {
  await browser.close();
}
