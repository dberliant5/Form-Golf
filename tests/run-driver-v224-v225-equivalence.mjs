// Trigger equivalence CI after workflow registration.
import { chromium } from 'playwright';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true});const page=await browser.newPage();
try{
 await page.goto('http://127.0.0.1:8080/tests/driver-v224-v225-equivalence.html',{waitUntil:'networkidle'});
 await page.click('#run');
 await page.waitForFunction(()=>window.FORM_V224_V225_EQUIV,null,{timeout:60000});
 const report=await page.evaluate(()=>window.FORM_V224_V225_EQUIV);
 fs.mkdirSync('tests/baselines',{recursive:true});
 fs.writeFileSync('tests/baselines/driver-v224-v225-equivalence.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify({caseCount:report.caseCount,topChangedCases:report.topChangedCases,casesWithAnyDifference:report.casesWithAnyDifference,componentDifferenceCounts:report.componentDifferenceCounts,changed:report.changed.map(x=>({id:x.id,top224:x.top224,top225:x.top225,topDelta:x.topDelta,products:x.productDiffs.slice(0,3)}))},null,2));
} finally {await browser.close();}
