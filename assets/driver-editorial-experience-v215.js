/* FORM Driver Editorial Experience v215
   Presentation-only layer. Preserves native questionnaire/result behavior.
   No MutationObserver, no scorer recomputation, no event interception. */
(function(){'use strict';

const STYLE_ID='formEditorial215Style';
const ROOT_ID='driverExperience';

function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

function injectStyle(){
  if(document.getElementById(STYLE_ID)) return;
  const s=document.createElement('style');
  s.id=STYLE_ID;
  s.textContent=`
  :root{--form-paper:#f4f0e7;--form-ink:#12231b;--form-green:#0b281e;--form-sage:#dfe6da;--form-sage2:#a8b8a7;--form-red:#a94134;--form-blue:#596f78;--form-gold:#b18b54;--form-line:#c9c7bd;--form-white:#fbfaf5}
  #driverExperience{background:var(--form-paper)!important;color:var(--form-ink)!important}
  #driverExperience>.shell{max-width:1180px!important;padding:0 22px 72px!important}
  #driverExperience .topline{margin-top:72px!important;border-bottom:1px solid var(--form-line)!important;padding-bottom:14px!important}
  #driverExperience .progress{height:3px!important;background:#d5d4cc!important;border-radius:0!important;overflow:hidden!important}
  #driverExperience .progress i{background:var(--form-green)!important;border-radius:0!important}
  #driverExperience .stepCount,#driverExperience .headerMeta{font:700 10px/1.2 -apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif!important;letter-spacing:.16em!important;text-transform:uppercase!important;color:#66706a!important}

  #driverExperience .formEditorialMasthead{position:absolute;top:0;left:0;right:0;height:54px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--form-line);z-index:5;background:var(--form-paper)}
  #driverExperience .formEditorialBrand{font-family:Georgia,"Times New Roman",serif;font-size:24px;letter-spacing:-.03em}
  #driverExperience .formEditorialMeta{font:700 9px/1 -apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#687169;display:flex;gap:18px;align-items:center}
  #driverExperience .formEditorialMeta b{color:var(--form-red);font-weight:800}

  #driverExperience .fitStage{margin-top:16px!important}
  #driverExperience .mainPane{background:transparent!important;border:0!important;box-shadow:none!important;padding:0!important}
  #driverExperience .step{padding:28px 0 100px!important}
  #driverExperience .step>.eyebrow,#driverExperience .openingQuestion>.eyebrow,#driverExperience .miniTitle{font:800 10px/1.2 -apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif!important;letter-spacing:.18em!important;text-transform:uppercase!important;color:#6d756f!important}
  #driverExperience .step h1,#driverExperience .openingQuestion h1{font-family:Georgia,"Times New Roman",serif!important;font-size:clamp(42px,7vw,76px)!important;line-height:.95!important;letter-spacing:-.045em!important;font-weight:500!important;color:var(--form-ink)!important;max-width:820px!important;margin:12px 0 16px!important}
  #driverExperience .step>.lead,#driverExperience .openingQuestion>.lead{font:400 17px/1.55 -apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif!important;color:#68716b!important;max-width:720px!important}

  #driverExperience .options,#driverExperience .multiOptions,#driverExperience .brandModeGrid{display:block!important;margin-top:28px!important;max-width:760px!important}
  #driverExperience .opt,#driverExperience .multiOptions button,#driverExperience .brandMode{position:relative!important;width:100%!important;display:grid!important;grid-template-columns:54px 1fr 26px!important;align-items:center!important;min-height:72px!important;padding:14px 8px!important;margin:0!important;border:0!important;border-top:1px solid var(--form-line)!important;border-radius:0!important;background:transparent!important;color:var(--form-ink)!important;text-align:left!important;box-shadow:none!important;transform:none!important;font:600 16px/1.2 -apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif!important}
  #driverExperience .opt:last-child,#driverExperience .multiOptions button:last-child,#driverExperience .brandMode:last-child{border-bottom:1px solid var(--form-line)!important}
  #driverExperience .opt::after,#driverExperience .multiOptions button::after,#driverExperience .brandMode::after{content:"";width:18px;height:18px;border:1px solid #8c938d;border-radius:50%;justify-self:end;box-sizing:border-box}
  #driverExperience .opt.on,#driverExperience .multiOptions button.on,#driverExperience .brandMode.active{background:linear-gradient(90deg,rgba(170,187,164,.38),rgba(170,187,164,.12))!important;color:var(--form-ink)!important;box-shadow:inset 4px 0 0 var(--form-green)!important}
  #driverExperience .opt.on::after,#driverExperience .multiOptions button.on::after,#driverExperience .brandMode.active::after{background:var(--form-green);border-color:var(--form-green);box-shadow:inset 0 0 0 5px var(--form-paper)}
  #driverExperience .brandMode{grid-template-columns:1fr 26px!important;padding-left:14px!important}
  #driverExperience .brandMode b{font-family:Georgia,"Times New Roman",serif!important;font-size:21px!important;font-weight:500!important}.brandMode span{display:block!important;margin-top:4px!important;font:400 13px/1.35 -apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif!important;color:#747b76!important}
  #driverExperience .brandScopePanel{background:var(--form-white)!important;border:1px solid var(--form-line)!important;border-radius:0!important;padding:22px!important;max-width:820px!important}
  #driverExperience #brandPicker{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}
  #driverExperience #brandPicker button{border-radius:0!important;background:#fff!important;border:1px solid var(--form-line)!important}

  #driverExperience .formVisualPanel{margin:28px 0 8px;max-width:760px;border:1px solid var(--form-line);background:var(--form-white);min-height:150px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
  #driverExperience .formVisualPanel.dark{background:var(--form-green);border-color:var(--form-green);color:#fff}
  #driverExperience .flightCanvas{width:100%;height:165px;position:relative;background:linear-gradient(180deg,#eef0e8 0%,#f7f4ec 74%)}
  #driverExperience .flightCanvas::before{content:"";position:absolute;left:8%;right:8%;bottom:23px;border-top:1px solid #aeb4ac}
  #driverExperience .flightCanvas::after{content:"FAIRWAY";position:absolute;right:8%;bottom:30px;font:800 8px/1 -apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;letter-spacing:.18em;color:#879087}
  #driverExperience .flightTrace{position:absolute;left:14%;bottom:24px;width:70%;height:112px;border:3px solid var(--form-green);border-left-color:transparent;border-bottom-color:transparent;border-radius:50% 60% 20% 0;transform:rotate(-9deg)}
  #driverExperience .flightDot{position:absolute;left:13%;bottom:19px;width:11px;height:11px;border-radius:50%;background:var(--form-red)}
  #driverExperience .strikeFace{width:330px;height:126px;border:2px solid rgba(255,255,255,.6);border-radius:55% 55% 40% 40%;position:relative;background:repeating-linear-gradient(0deg,transparent 0 10px,rgba(255,255,255,.12) 10px 11px),repeating-linear-gradient(90deg,transparent 0 24px,rgba(255,255,255,.1) 24px 25px)}
  #driverExperience .strikeFace::after{content:"";position:absolute;width:42px;height:42px;border-radius:50%;background:rgba(211,203,139,.85);box-shadow:0 0 0 10px rgba(211,203,139,.16);left:68%;top:40%;transform:translate(-50%,-50%)}
  #driverExperience .dataArt{width:100%;padding:24px;display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#d6d7cf}
  #driverExperience .dataArt div{background:var(--form-white);padding:18px 12px}.dataArt b{display:block;font-family:Georgia,"Times New Roman",serif;font-size:28px;font-weight:500}.dataArt span{font:800 8px/1.2 -apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#7c837d}

  #driverExperience .flightGlyph{width:34px;height:42px;position:relative;display:block}
  #driverExperience .flightGlyph::before{content:"";position:absolute;left:8px;top:4px;width:18px;height:30px;border:2px solid currentColor;border-bottom-color:transparent;border-left-color:transparent;border-radius:50% 70% 0 0;transform:rotate(var(--glyph-rot,0deg))}
  #driverExperience .opt[data-v="hook"] .flightGlyph,#driverExperience .opt[data-v="draw"] .flightGlyph{--glyph-rot:-32deg;color:var(--form-red)}
  #driverExperience .opt[data-v="fade"] .flightGlyph,#driverExperience .opt[data-v="slice"] .flightGlyph{--glyph-rot:32deg;color:var(--form-blue)}
  #driverExperience .opt[data-v="straight"] .flightGlyph{--glyph-rot:0deg;color:var(--form-green)}
  #driverExperience .opt[data-v="varies"] .flightGlyph::before{border-style:dashed;color:#777}
  #driverExperience .opt:not([data-v="hook"]):not([data-v="draw"]):not([data-v="fade"]):not([data-v="slice"]):not([data-v="straight"]):not([data-v="varies"]) .flightGlyph{display:none}

  #driverExperience .techGrid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:14px!important;max-width:760px!important}.field label{font:800 9px/1.2 -apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif!important;letter-spacing:.14em!important;text-transform:uppercase!important}.field select,.field input{border-radius:0!important;border:1px solid var(--form-line)!important;background:var(--form-white)!important;min-height:48px!important}
  #driverExperience .note,#driverExperience .derived{border-radius:0!important;background:#ebe8df!important;border:1px solid var(--form-line)!important;color:#626b65!important}

  #driverExperience .flowNav{position:sticky!important;bottom:0!important;z-index:8!important;padding:16px 0!important;background:linear-gradient(180deg,rgba(244,240,231,0),var(--form-paper) 30%)!important;border:0!important}.flowNav .btn{border-radius:0!important;min-height:50px!important;text-transform:uppercase!important;letter-spacing:.12em!important;font-weight:800!important}.flowNav .primary{background:var(--form-green)!important;color:#fff!important;border-color:var(--form-green)!important}.flowNav .ghost{background:transparent!important;color:var(--form-ink)!important;border-color:var(--form-ink)!important}

  /* Results */
  #driverExperience #results{padding-top:22px!important}
  #driverExperience #results .report100Hero,#driverExperience #results .report100Card,#driverExperience #results .formCompare197,#driverExperience #results .report100TestSetup,#driverExperience #results .report100Benchmark,#driverExperience #results .readyBox{border-radius:0!important;box-shadow:none!important}
  #driverExperience #results .report100Hero{background:var(--form-green)!important;color:#fff!important;border:0!important;padding:34px!important;position:relative;overflow:hidden}
  #driverExperience #results .report100Hero::after{content:"";position:absolute;right:-90px;bottom:-120px;width:320px;height:320px;border:1px solid rgba(255,255,255,.17);border-radius:50%;box-shadow:0 0 0 42px rgba(255,255,255,.035),0 0 0 84px rgba(255,255,255,.02)}
  #driverExperience #results .report100Hero h1,#driverExperience #results .report100Hero h2,#driverExperience #results .report100Hero h3{font-family:Georgia,"Times New Roman",serif!important;color:#fff!important}
  #driverExperience #results .report100Card{background:var(--form-white)!important;border:1px solid var(--form-line)!important}
  #driverExperience #results .report100Grid{display:grid!important;gap:14px!important}
  #driverExperience #results .report100Grid>.report100Card:first-child{border-left:5px solid var(--form-red)!important}
  #driverExperience #results .formTopFiveHeading{margin:42px 0 18px;padding-top:20px;border-top:2px solid var(--form-ink)}
  #driverExperience #results .formTopFiveHeading .kicker{font:800 9px/1.2 -apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#6c746e}
  #driverExperience #results .formTopFiveHeading h2{font:500 clamp(34px,7vw,54px)/1 Georgia,"Times New Roman",serif;margin:8px 0 6px;letter-spacing:-.035em;color:var(--form-ink)}
  #driverExperience #results .formTopFiveHeading p{margin:0;color:#6b736e;max-width:650px;font-size:15px;line-height:1.5}
  #driverExperience #results .formProfileSummary{margin:26px 0;background:var(--form-white);border:1px solid var(--form-line);display:grid;grid-template-columns:1.1fr 1fr}
  #driverExperience #results .formProfileSummaryIntro{padding:24px;border-right:1px solid var(--form-line)}
  #driverExperience #results .formProfileSummaryIntro .kicker{font:800 9px/1.2 -apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#707872}
  #driverExperience #results .formProfileSummaryIntro h3{font:500 30px/1.05 Georgia,"Times New Roman",serif;margin:8px 0 10px;color:var(--form-ink)}
  #driverExperience #results .formProfileSummaryIntro p{margin:0;color:#69726c;line-height:1.5}
  #driverExperience #results .formProfileRows{padding:10px 22px}.formProfileRow{display:flex;justify-content:space-between;gap:18px;padding:12px 0;border-bottom:1px solid #dfddd4}.formProfileRow:last-child{border-bottom:0}.formProfileRow span{font:800 9px/1.2 -apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#7d847f}.formProfileRow b{font:600 14px/1.25 -apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;text-align:right}
  #driverExperience #results .formProductImageSlot{height:170px;margin:0 0 16px;background:linear-gradient(145deg,#112b21,#25493a);position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center}
  #driverExperience #results .formProductImageSlot svg{width:72%;max-width:330px;opacity:.94;filter:drop-shadow(0 20px 25px rgba(0,0,0,.24))}
  #driverExperience #results .formProductImageSlot small{position:absolute;left:14px;bottom:11px;color:rgba(255,255,255,.65);font:800 8px/1 -apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase}
  #driverExperience #results *:empty.report100Story,#driverExperience #results *:empty.report100Narrative,#driverExperience #results .formEmptyBlock:empty{display:none!important}

  @media(max-width:720px){
    #driverExperience>.shell{padding:0 16px 56px!important}
    #driverExperience .formEditorialMasthead{height:48px}.formEditorialBrand{font-size:21px!important}.formEditorialMeta{gap:9px!important;font-size:8px!important}
    #driverExperience .topline{margin-top:62px!important}
    #driverExperience .step h1,#driverExperience .openingQuestion h1{font-size:46px!important}
    #driverExperience .step>.lead,#driverExperience .openingQuestion>.lead{font-size:15px!important}
    #driverExperience .brandScopePanel{padding:16px!important}
    #driverExperience #brandPicker{grid-template-columns:1fr!important}
    #driverExperience .techGrid{grid-template-columns:1fr!important}
    #driverExperience .dataArt{grid-template-columns:repeat(2,1fr)}
    #driverExperience #results .formProfileSummary{grid-template-columns:1fr}.formProfileSummaryIntro{border-right:0!important;border-bottom:1px solid var(--form-line)}
    #driverExperience #results .report100Hero{padding:24px 20px!important}
    #driverExperience .opt,#driverExperience .multiOptions button{grid-template-columns:46px 1fr 24px!important;min-height:66px!important;font-size:15px!important}
  }
  `;
  document.head.appendChild(s);
}

function addMasthead(root){
  if(root.querySelector('.formEditorialMasthead')) return;
  const m=document.createElement('div');
  m.className='formEditorialMasthead';
  m.innerHTML='<div class="formEditorialBrand">FORM</div><div class="formEditorialMeta"><span>Driver fitting</span><b>Field Notes</b></div>';
  const shell=root.querySelector(':scope > .shell')||root.firstElementChild;
  if(shell) shell.insertBefore(m,shell.firstChild);
}

function addFlightGlyphs(root){
  root.querySelectorAll('.options[data-group="curve"] .opt,.options[data-group="start"] .opt').forEach(b=>{
    if(b.querySelector('.flightGlyph')) return;
    const g=document.createElement('span'); g.className='flightGlyph'; b.insertBefore(g,b.firstChild);
  });
}

function addStepVisuals(root){
  const step2=root.querySelector('#step2');
  if(step2&&!step2.querySelector('.formVisualPanel')){
    const v=document.createElement('div');v.className='formVisualPanel';v.innerHTML='<div class="flightCanvas"><i class="flightTrace"></i><i class="flightDot"></i></div>';
    const opts=step2.querySelector('.options'); if(opts) step2.insertBefore(v,opts);
  }
  const step3=root.querySelector('#step3');
  if(step3&&!step3.querySelector('.formVisualPanel')){
    const v=document.createElement('div');v.className='formVisualPanel';v.innerHTML='<div class="flightCanvas"><i class="flightTrace" style="transform:rotate(-24deg);border-color:var(--form-red);border-left-color:transparent;border-bottom-color:transparent"></i><i class="flightDot"></i></div>';
    const opts=step3.querySelector('.options'); if(opts) step3.insertBefore(v,opts);
  }
  const step4=root.querySelector('#step4');
  if(step4&&!step4.querySelector('.formVisualPanel')){
    const v=document.createElement('div');v.className='formVisualPanel dark';v.innerHTML='<div class="strikeFace"></div>';
    const firstOpts=step4.querySelector('.options'); if(firstOpts) step4.insertBefore(v,firstOpts);
  }
  const step5=root.querySelector('#step5');
  if(step5&&!step5.querySelector('.formVisualPanel')){
    const v=document.createElement('div');v.className='formVisualPanel';v.innerHTML='<div class="dataArt"><div><b>98</b><span>Club speed</span></div><div><b>13.5°</b><span>Launch</span></div><div><b>2,600</b><span>Spin</span></div><div><b>245</b><span>Carry</span></div></div>';
    const opts=step5.querySelector('.options'); if(opts) step5.insertBefore(v,opts);
  }
}

function stateObj(){return window.state||window.driverState||window.FORM_STATE||{};}
function pretty(v){
  const map={left:'Left',right:'Right',straight:'Straight',varies:'Varies / not sure',hook:'Hook',draw:'Draw',fade:'Fade',slice:'Slice',two_way:'Two-way miss',toe:'Toe side',heel:'Heel side',center:'Center-ish',varied:'Varied',unknown:'Unknown',exact:'Exact data',range:'Approximate data',general:'General story',none:'No launch-monitor data',classic:'Classic',technical:'Engineered',modern:'Modern',edgy:'Edgy',balanced:'No strong preference',great:'Very well',good:'Pretty well',mixed:'Mixed',poor:'Not well'};
  return map[v]||String(v||'—').replace(/_/g,' ');
}

function buildProfileSummary(results){
  if(results.querySelector('.formProfileSummary')) return;
  const s=stateObj();
  const values=[['Start line',s.start],['Curvature',s.curve],['Costly miss',s.costly],['Strike',s.strike],['Launch-monitor detail',s.lm],['Style tie-breaker',s.style]];
  if(!values.some(x=>x[1])) return;
  const box=document.createElement('section');box.className='formProfileSummary';
  box.innerHTML='<div class="formProfileSummaryIntro"><div class="kicker">Your fitting profile</div><h3>The pattern FORM is fitting.</h3><p>This is the evidence behind the shortlist — your ball flight, strike pattern and the information quality you supplied.</p></div><div class="formProfileRows">'+values.filter(x=>x[1]).map(x=>'<div class="formProfileRow"><span>'+esc(x[0])+'</span><b>'+esc(pretty(x[1]))+'</b></div>').join('')+'</div>';
  const hero=results.querySelector('.report100Hero');
  const anchor=results.querySelector('.formCompare197')||results.querySelector('.report100Grid');
  if(anchor) results.insertBefore(box,anchor); else if(hero&&hero.nextSibling) results.insertBefore(box,hero.nextSibling); else results.appendChild(box);
}

function addTopFiveHeading(results){
  const grid=results.querySelector('.report100Grid');
  if(!grid||results.querySelector('.formTopFiveHeading')) return;
  const h=document.createElement('div');h.className='formTopFiveHeading';
  h.innerHTML='<div class="kicker">Your Top Five</div><h2>The best fits for you.</h2><p>Ranked from the same golfer profile and test setup. The differences below are the tradeoffs worth validating in person.</p>';
  grid.parentNode.insertBefore(h,grid);
}

function addProductSlots(results){
  const cards=[...results.querySelectorAll('.report100Grid .report100Card')].slice(0,5);
  cards.forEach((card,i)=>{
    if(card.querySelector('.formProductImageSlot')) return;
    const slot=document.createElement('div');slot.className='formProductImageSlot';
    slot.innerHTML='<svg viewBox="0 0 360 150" aria-hidden="true"><defs><linearGradient id="g'+i+'" x1="0" x2="1"><stop offset="0" stop-color="#0b0d0c"/><stop offset="1" stop-color="#6b7470"/></linearGradient></defs><path d="M64 92 C83 47 145 25 224 32 C285 38 316 65 302 91 C288 118 225 132 159 128 C106 125 72 113 64 92Z" fill="url(#g'+i+')" stroke="#b8c1bc" stroke-width="2"/><path d="M112 87 C158 65 222 61 280 75" fill="none" stroke="#d6ddd9" stroke-width="3" opacity=".65"/><path d="M273 46 L330 7" stroke="#bdc7c1" stroke-width="9" stroke-linecap="round"/><circle cx="193" cy="84" r="8" fill="#a94134"/></svg><small>Product image area</small>';
    const head=card.firstElementChild; card.insertBefore(slot,head||null);
  });
}

function cleanResults(results){
  results.querySelectorAll('.report100Story,.report100Narrative,.story188,.story191,.story193,.story196').forEach(el=>{if(!el.textContent.trim()) el.style.display='none';});
  [...results.children].forEach(el=>{if(el!==results.querySelector('.flowNav')&&!el.textContent.trim()&&!el.querySelector('img,svg,button,input,select')) el.style.display='none';});
}

function styleResults(root){
  const results=root.querySelector('#results'); if(!results||results.classList.contains('hidden')) return;
  cleanResults(results); buildProfileSummary(results); addTopFiveHeading(results); addProductSlots(results);
}

function apply(){
  injectStyle();
  const root=document.getElementById(ROOT_ID); if(!root) return;
  addMasthead(root); addFlightGlyphs(root); addStepVisuals(root); styleResults(root);
}

function schedule(){setTimeout(apply,0);setTimeout(apply,80);setTimeout(apply,260);}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',schedule,{once:true}); else schedule();
document.addEventListener('click',function(){setTimeout(apply,40);},false);
document.addEventListener('change',function(){setTimeout(apply,40);},false);
window.FORM_APPLY_EDITORIAL_V215=apply;
})();
