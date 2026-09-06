import { chromium } from 'playwright';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true});const page=await browser.newPage();
try{
 await page.goto('http://127.0.0.1:8080/tests/driver-config-v228-comparison.html',{waitUntil:'networkidle'});
 await page.click('#run');
 await page.waitForFunction(()=>window.FORM_DRIVER_CONFIG_V228_REPORT||document.getElementById('out')?.textContent?.startsWith('Error:'),null,{timeout:120000});
 const txt=await page.evaluate(()=>document.getElementById('out')?.textContent||'');
 if(!await page.evaluate(()=>Boolean(window.FORM_DRIVER_CONFIG_V228_REPORT)))throw new Error(txt||'No config report');
 const report=await page.evaluate(()=>window.FORM_DRIVER_CONFIG_V228_REPORT);
 fs.mkdirSync('tests/baselines',{recursive:true});fs.writeFileSync('tests/baselines/driver-config-v228-comparison.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify({passed:report.passed,checks:report.checks,boundaryPairs:report.boundaryPairs,aoaPairs:report.aoaPairs,selected:report.selected},null,2));
 if(!report.passed)process.exit(1);
} finally {await browser.close();}
