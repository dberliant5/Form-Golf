import { chromium } from 'playwright';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true});const page=await browser.newPage();
try{
 await page.goto('http://127.0.0.1:8080/tests/driver-config-v229-expanded.html',{waitUntil:'networkidle'});
 await page.click('#run');
 await page.waitForFunction(()=>window.FORM_DRIVER_CONFIG_V229_REPORT||document.getElementById('out')?.textContent?.startsWith('Error:'),null,{timeout:120000});
 const txt=await page.evaluate(()=>document.getElementById('out')?.textContent||'');
 if(!await page.evaluate(()=>Boolean(window.FORM_DRIVER_CONFIG_V229_REPORT)))throw new Error(txt||'No expanded config report');
 const report=await page.evaluate(()=>window.FORM_DRIVER_CONFIG_V229_REPORT);
 fs.mkdirSync('tests/baselines',{recursive:true});fs.writeFileSync('tests/baselines/driver-config-v229-expanded.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify({passed:report.passed,checks:report.checks,sequences:report.sequences,range:report.range,combos:report.combos},null,2));
 if(!report.passed)process.exit(1);
} finally {await browser.close();}
