// FORM 10.71 — live mobile result-transition watchdog + range-first LM route cleanup.
(function(){
'use strict';
function init(){
 if(window.FORM_DRIVER_RESULTS_WATCHDOG_V170)return true;
 const driver=document.getElementById('driverExperience');
 if(!driver||typeof state==='undefined')return false;

 // With exact per-metric entry retired, frame useful launch-monitor knowledge positively:
 // typical ranges -> typical tendencies -> no data.
 function cleanLmRoute(){
   const group=driver.querySelector('#step5 [data-group="lm"]');if(!group)return;
   const exact=group.querySelector('[data-v="exact"]');
   if(exact){exact.remove();}
   const range=group.querySelector('[data-v="range"]');if(range)range.textContent='Yes — I know my typical ranges';
   const general=group.querySelector('[data-v="general"]');if(general)general.textContent='I know my typical tendencies';
   const none=group.querySelector('[data-v="none"]');if(none)none.textContent='No — I don’t know my launch-monitor data';
   const note=document.querySelector('#step5 .note');if(note)note.textContent='Typical ranges provide the strongest launch-monitor signal. Typical tendencies are still useful when you know the pattern but not the numbers.';
   if(state.lm==='exact')state.lm='range';
 }

 // v101 can visibly reach its final stage yet fail to hand off if a later report layer throws.
 // Watch the transition itself and force a direct report render if it remains on screen.
 let watchdog=null;
 function arm(){
   clearTimeout(watchdog);
   watchdog=setTimeout(function(){
     const tr=document.getElementById('formTransition101');
     if(!tr)return;
     try{
       tr.remove();
       const render=window.FORM_RENDER_DRIVER_REPORT_V100;
       if(typeof render!=='function')throw new Error('report renderer unavailable');
       render();
       const results=document.getElementById('results');
       if(results){results.classList.remove('hidden');requestAnimationFrame(function(){try{results.scrollIntoView({behavior:'smooth',block:'start'});}catch(e){}});}
     }catch(err){
       console.error('FORM 10.71 results watchdog',err);
       tr.innerHTML='<div class="transition101Mark">FORM</div><div class="transition101Kicker">RESULTS RECOVERY</div><h2>Your report needs one more try.</h2><p>FORM preserved your fitting answers. Tap below to generate the report again.</p><button type="button" id="formResultsRetry170" style="margin-top:24px;padding:14px 18px;border:0;background:#29493b;color:#fff;font-weight:800">SHOW MY RESULTS →</button>';
       tr.querySelector('#formResultsRetry170')?.addEventListener('click',function(){try{window.FORM_RENDER_DRIVER_REPORT_V100?.();tr.remove();document.getElementById('results')?.scrollIntoView({block:'start'});}catch(e){console.error(e);}});
     }
   },6200);
 }
 document.addEventListener('pointerdown',function(e){if(e.target?.closest?.('#step9 .readyBox button'))arm();},true);
 document.addEventListener('touchstart',function(e){if(e.target?.closest?.('#step9 .readyBox button'))arm();},{capture:true,passive:true});

 cleanLmRoute();
 let queued=false;new MutationObserver(function(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;cleanLmRoute();});}).observe(driver,{childList:true,subtree:true});
 window.FORM_DRIVER_RESULTS_WATCHDOG_V170={version:'10.71',cleanLmRoute:cleanLmRoute,arm:arm};return true;
}
let n=0,t=setInterval(function(){n++;if(init()||n>240)clearInterval(t);},50);
})();