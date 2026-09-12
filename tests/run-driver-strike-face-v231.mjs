import { chromium } from 'playwright';

const base=process.env.FORM_URL||'http://127.0.0.1:8080';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844}});
const errs=[];
page.on('pageerror',e=>errs.push(e.message));
page.on('console',m=>{if(m.type()==='error'&&!/^FORM integrity:/.test(m.text())&&m.text()!=='renderBagIntel is not defined')errs.push(m.text())});

function equal(a,b,msg){if(JSON.stringify(a)!==JSON.stringify(b))throw new Error(msg+'\n'+JSON.stringify({a,b},null,2));}

try{
  await page.goto(base+'/?strike='+Date.now(),{waitUntil:'networkidle',timeout:45000});
  await page.waitForFunction(()=>!!window.FORM_DRIVER_ENGINE_V80&&!!window.FORM_STRIKE_FACE_V232,null,{timeout:30000});
  await page.getByRole('button',{name:/Start Driver Fitting/i}).first().click();
  await page.evaluate(()=>window.goTo?.(4));
  await page.waitForSelector('#step4:not(.hidden) .formStrikeFaceWrap',{timeout:10000});

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  if(overflow>2) throw new Error('Mobile horizontal overflow detected: '+overflow+'px');

  const surface=page.locator('.formStrikeSurface');

  async function clickFrac(x,y){
    await surface.scrollIntoViewIfNeeded();
    const box=await surface.boundingBox();
    if(!box) throw new Error('Strike face has no visible bounding box');
    await page.mouse.click(box.x+box.width*x,box.y+box.height*y);
    await page.waitForTimeout(80);
  }
  async function rankSnapshot(){
    return page.evaluate(()=>{
      const g=golfer();
      return driverRankV43(g).slice(0,5).map(x=>({name:x.p.brand+' '+x.p.model,score:x.s.overall}));
    });
  }

  await clickFrac(.80,.18);
  const high=await page.evaluate(()=>({g:golfer(),label:document.querySelector('[data-strike-label]')?.textContent,sourceVisible:!document.getElementById('strikeSourceV150')?.classList.contains('hidden')}));
  if(high.g.strike!=='toe'||high.g.strikeVertical!=='high'||high.g.strikeConsistency!=='tends') throw new Error('High-toe capture failed: '+JSON.stringify(high));
  if(!/High toe/i.test(high.label||'')) throw new Error('High-toe label missing');
  if(!high.sourceVisible) throw new Error('Existing strike evidence question did not remain wired');
  const highRank=await rankSnapshot();

  await clickFrac(.80,.82);
  const low=await page.evaluate(()=>golfer());
  if(low.strike!=='toe'||low.strikeVertical!=='low') throw new Error('Low-toe capture failed: '+JSON.stringify(low));
  const lowRank=await rankSnapshot();
  equal(highRank,lowRank,'Vertical strike changed production ranking/scoring');

  await clickFrac(.80,.18);
  await page.getByRole('button',{name:/Mostly here/i}).click();
  const mostly=await page.evaluate(()=>golfer());
  if(mostly.strike!=='toe'||mostly.strikeVertical!=='high'||mostly.strikeConsistency!=='mostly') throw new Error('Mostly-here state failed');

  await page.getByRole('button',{name:/All over the face/i}).click();
  const scattered=await page.evaluate(()=>golfer());
  if(scattered.strike!=='varied'||scattered.strikeVertical!=='varied') throw new Error('All-over mapping failed');

  await page.locator('.formStrikeChoice[data-strike-consistency="unknown"]').click();
  const unknown=await page.evaluate(()=>golfer());
  if(unknown.strike!=='unknown'||unknown.strikeVertical!=='unknown') throw new Error('Unknown mapping failed');

  await clickFrac(.80,.18);
  await page.evaluate(()=>{
    state.handed=state.handed||'right';
    state.start=state.start||'straight';
    state.curve=state.curve||'straight';
    state.costly=state.costly||'two_way';
    state.lm=state.lm||'none';
    state.transition=state.transition||'neutral';
    state.style=state.style||state.transition;
    state.current=state.current||'good';
    state.driverPrioritySplit=state.driverPrioritySplit||{accuracy:50,distance:50,touched:true};
    state.priorityWeights=state.priorityWeights||{accuracy:state.driverPrioritySplit.accuracy,distance:state.driverPrioritySplit.distance,touched:true};
    window.goTo?.(9);
    window.renderReview?.();
  });
  await page.waitForSelector('#step9:not(.hidden)');
  const review=await page.locator('#reviewStrike').innerText();
  if(!/High toe/i.test(review)) throw new Error('Review does not preserve vertical strike: '+review);

  await page.getByRole('button',{name:/Generate My Fit/i}).click();
  await page.waitForSelector('#results:not(.hidden)',{timeout:20000});
  if((await page.locator('#results').innerText()).trim().length<150) throw new Error('Results failed to render');
  if(errs.length) throw new Error('Unexpected browser errors: '+JSON.stringify(errs));

  console.log(JSON.stringify({ok:true,highToe:high.g,verticalScoreParity:true,top5:highRank},null,2));
}finally{
  await browser.close();
}
