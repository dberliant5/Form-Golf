import { chromium } from 'playwright';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true});const page=await browser.newPage();
try{
  await page.goto('http://127.0.0.1:8080/tests/driver-v225-carry-boundaries.html',{waitUntil:'networkidle'});
  await page.click('#run');
  await page.waitForFunction(()=>window.FORM_V225_CARRY_REPORT,null,{timeout:45000});
  const report=await page.evaluate(()=>window.FORM_V225_CARRY_REPORT);
  fs.mkdirSync('tests/baselines',{recursive:true});
  fs.writeFileSync('tests/baselines/driver-v225-carry-boundaries.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify({passed:report.passed,checks:report.checks,stablePairs:report.stablePairs,candidatePairs:report.candidatePairs},null,2));
  if(!report.passed)process.exit(1);
} finally {await browser.close();}
