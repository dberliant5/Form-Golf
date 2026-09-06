import { chromium } from 'playwright';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true});const page=await browser.newPage();
try{
  await page.goto('http://127.0.0.1:8080/tests/driver-v225-live-stack.html',{waitUntil:'networkidle'});
  await page.click('#run');
  await page.waitForFunction(()=>window.FORM_V225_LIVE_STACK_REPORT||document.getElementById('out')?.textContent?.startsWith('Error:'),null,{timeout:180000});
  const pageError=await page.evaluate(()=>document.getElementById('out')?.textContent||'');
  if(!await page.evaluate(()=>Boolean(window.FORM_V225_LIVE_STACK_REPORT)))throw new Error(pageError||'Live-stack report was not produced');
  const report=await page.evaluate(()=>window.FORM_V225_LIVE_STACK_REPORT);
  fs.mkdirSync('tests/baselines',{recursive:true});
  fs.writeFileSync('tests/baselines/driver-v225-live-stack.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify({passed:report.passed,checks:report.checks,summary:report.summary,thresholds:report.thresholds,topChanged:report.topChanged,stableCarryPairs:report.stableCarryPairs,candidateCarryPairs:report.candidateCarryPairs},null,2));
  if(!report.passed)process.exit(1);
} finally {await browser.close();}
