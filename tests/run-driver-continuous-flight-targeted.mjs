import { chromium } from 'playwright';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage();
try{
  await page.goto('http://127.0.0.1:8080/tests/driver-continuous-flight-runner-v221.html',{waitUntil:'networkidle'});
  await page.click('#run');
  await page.waitForFunction(()=>window.FORM_CONTINUOUS_COMPARISON_V221,null,{timeout:60000});
  const report=await page.evaluate(()=>window.FORM_CONTINUOUS_COMPARISON_V221);
  fs.mkdirSync('tests/baselines',{recursive:true});
  fs.writeFileSync('tests/baselines/driver-continuous-v221-comparison.json',JSON.stringify(report,null,2));
  const compact={
    experiment:report.experiment,
    summary:report.summary,
    stableThresholds:report.thresholds.stable.map(x=>({pair:`${x.a}->${x.b}`,topChanged:x.topChanged,topScoreDelta:x.topScoreDelta,moves:x.moves?.length||0})),
    alternateThresholds:report.thresholds.alternate.map(x=>({pair:`${x.a}->${x.b}`,topChanged:x.topChanged,topScoreDelta:x.topScoreDelta,moves:x.moves?.length||0})),
    targeted:{stable:report.targeted.stable,alternate:report.targeted.alternate},
    topChanged:report.caseComparisons.filter(x=>x.topChanged).map(x=>({id:x.id,stable:x.stableTop,alternate:x.altTop,scoreDelta:x.topScoreDelta,moves:x.moves})),
    largestScoreDeltas:report.caseComparisons.slice().sort((a,b)=>Math.abs(b.topScoreDelta)-Math.abs(a.topScoreDelta)).slice(0,10).map(x=>({id:x.id,delta:x.topScoreDelta,stableTop:x.stableTop,altTop:x.altTop,moves:x.moves}))
  };
  fs.writeFileSync('tests/baselines/driver-continuous-v221-summary.json',JSON.stringify(compact,null,2));
  console.log(JSON.stringify(compact,null,2));
} finally {
  await browser.close();
}
