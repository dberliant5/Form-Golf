import { chromium } from 'playwright';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage();
try{
  await page.goto('http://127.0.0.1:8080/tests/driver-flight-neighborhoods-v222.html',{waitUntil:'networkidle'});
  await page.click('#run');
  await page.waitForFunction(()=>window.FORM_FLIGHT_NEIGHBORHOODS_V222,null,{timeout:45000});
  const report=await page.evaluate(()=>window.FORM_FLIGHT_NEIGHBORHOODS_V222);
  fs.mkdirSync('tests/baselines',{recursive:true});
  fs.writeFileSync('tests/baselines/driver-flight-neighborhoods-v222.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
} finally { await browser.close(); }
