import { chromium } from 'playwright';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true});const page=await browser.newPage();
try{
  await page.goto('http://127.0.0.1:8080/tests/driver-continuous-flight-matrix-v224.html',{waitUntil:'networkidle'});
  await page.click('#run');
  await page.waitForFunction(()=>window.FORM_CONTINUOUS_MATRIX_V224,null,{timeout:60000});
  const report=await page.evaluate(()=>window.FORM_CONTINUOUS_MATRIX_V224);
  fs.mkdirSync('tests/baselines',{recursive:true});
  fs.writeFileSync('tests/baselines/driver-continuous-v224-comparison.json',JSON.stringify(report,null,2));
  const compact={experiment:report.experiment,summary:report.summary,stableThresholds:report.thresholds.stable.map(x=>({pair:`${x.a}->${x.b}`,topChanged:x.topChanged,topScoreDelta:x.topScoreDelta,moves:x.moves?.length||0})),alternateThresholds:report.thresholds.alternate.map(x=>({pair:`${x.a}->${x.b}`,topChanged:x.topChanged,topScoreDelta:x.topScoreDelta,moves:x.moves?.length||0})),topChanged:report.caseComparisons.filter(x=>x.topChanged).map(x=>({id:x.id,stable:x.stableTop,alternate:x.altTop,scoreDelta:x.topScoreDelta,moves:x.moves})),selected:Object.fromEntries(report.caseComparisons.filter(x=>['M03','M10','Q01','Q02','D01','D02','D03','C01','C02','P01','P02','P03','P04'].includes(x.id)).map(x=>[x.id,{stableTop:x.stableTop,altTop:x.altTop,stableScore:x.stableScore,altScore:x.altScore,delta:x.topScoreDelta,moves:x.moves}]))};
  fs.writeFileSync('tests/baselines/driver-continuous-v224-summary.json',JSON.stringify(compact,null,2));
  console.log(JSON.stringify(compact,null,2));
} finally { await browser.close(); }
