// CI trigger: validate generated v225 before production promotion.
import { chromium } from 'playwright';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true});const page=await browser.newPage();
try{
  await page.goto('http://127.0.0.1:8080/tests/driver-v225-production-candidate.html',{waitUntil:'networkidle'});
  await page.click('#run');
  await page.waitForFunction(()=>window.FORM_V225_CANDIDATE_REPORT,null,{timeout:90000});
  const report=await page.evaluate(()=>window.FORM_V225_CANDIDATE_REPORT);
  fs.mkdirSync('tests/baselines',{recursive:true});
  fs.writeFileSync('tests/baselines/driver-v225-production-candidate.json',JSON.stringify(report,null,2));
  const compact={candidate:report.candidate,passed:report.passed,checks:report.checks,summary:report.summary,thresholds:{stable:report.thresholds.stable.map(x=>({pair:`${x.a}->${x.b}`,topChanged:x.topChanged,topScoreDelta:x.topScoreDelta,moves:x.moves?.length||0})),candidate:report.thresholds.candidate.map(x=>({pair:`${x.a}->${x.b}`,topChanged:x.topChanged,topScoreDelta:x.topScoreDelta,moves:x.moves?.length||0}))},carryPairs:report.carryPairs,topChanged:report.topChanged.map(x=>({id:x.id,stable:x.stableTop,candidate:x.candidateTop,delta:x.topScoreDelta,moves:x.moves}))};
  fs.writeFileSync('tests/baselines/driver-v225-production-candidate-summary.json',JSON.stringify(compact,null,2));
  console.log(JSON.stringify(compact,null,2));
  if(!report.passed)process.exit(1);
} finally { await browser.close(); }
