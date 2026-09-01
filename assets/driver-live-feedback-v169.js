// FORM 10.69 — fixes from live mobile user test.
// Keeps brand scope genuinely unselected, repairs transition validation, removes Exact
// from the active metric73 renderer, and clarifies strike-source evidence wording.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_LIVE_FEEDBACK_V169)return true;
  const driver=document.getElementById('driverExperience');
  if(!driver||typeof state==='undefined')return false;

  // Brand scope must be an explicit golfer choice. A visually selected default is misleading.
  const brand=document.getElementById('brandQuestion');
  function clearUntouchedBrandDefault(){
    if(!brand||brand.classList.contains('hidden'))return;
    let confirmed=false;try{confirmed=typeof formBrandScopeConfirmed!=='undefined'&&!!formBrandScopeConfirmed;}catch(e){}
    if(confirmed)return;
    brand.querySelectorAll('.brandMode').forEach(function(x){x.classList.remove('active');});
    try{if(typeof formBrandScope!=='undefined'&&!confirmed){formBrandScope.mode='';formBrandScope.brands=[];}}catch(e){}
    const confirm=brand.querySelector('.brandScopeConfirm');if(confirm){confirm.disabled=true;confirm.setAttribute('aria-disabled','true');}
  }
  if(brand){new MutationObserver(function(){setTimeout(clearUntouchedBrandDefault,0);}).observe(brand,{attributes:true,attributeFilter:['class']});setTimeout(clearUntouchedBrandDefault,0);}

  // The legacy step validator still checks state.style. Mirror transition into that compatibility
  // field so selecting any transition answer—including "Varies / not sure"—can advance.
  function syncTransitionCompatibility(){
    const step7=document.getElementById('step7');if(!step7)return;
    step7.querySelectorAll('[data-transition-v150] .opt').forEach(function(btn){
      if(btn.dataset.formTransition169)return;btn.dataset.formTransition169='1';
      btn.addEventListener('click',function(){state.style=state.transition||btn.dataset.v||'unknown';document.getElementById('formInputWarning')?.remove();},true);
    });
    if(state.transition)state.style=state.transition;
  }

  // v71's active renderer builds .metric73Mode buttons, so hiding only old selectors was
  // insufficient. Retire Exact at the renderer's actual DOM surface and convert stale exact state.
  function sanitizeExact(){
    driver.querySelectorAll('.metric73Mode[data-mode="exact"],[data-group="lm"] [data-v="exact"]').forEach(function(el){el.remove();});
    if(state.lm==='exact')state.lm='range';
    Object.keys(state.metrics||{}).forEach(function(id){const m=state.metrics[id];if(m&&m.mode==='exact'){m.mode='range';m.value=null;}});
  }

  // Clarify the middle evidence tier: felt pattern vs unsupported guess.
  function refineStrikeSource(){
    const box=document.getElementById('strikeSourceV150');if(!box)return;
    const repeated=box.querySelector('[data-v="repeated"]'),guess=box.querySelector('[data-v="guess"]');
    if(repeated)repeated.textContent='I think that’s what I’m feeling';
    if(guess)guess.textContent='Mostly a guess';
    const p=box.querySelector('.lead');if(p)p.textContent='FORM trusts confirmed impact evidence most. A consistent feel is useful but less certain; a mostly unsupported guess carries the least heel-vs-toe weight.';
  }

  function reconcile(){syncTransitionCompatibility();sanitizeExact();refineStrikeSource();}
  reconcile();
  let queued=false;new MutationObserver(function(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;reconcile();});}).observe(driver,{childList:true,subtree:true});
  document.addEventListener('click',function(e){if(e.target.closest('#driverExperience'))setTimeout(reconcile,0);},true);

  window.FORM_DRIVER_LIVE_FEEDBACK_V169={version:'10.69',reconcile:reconcile,sanitizeExact:sanitizeExact};
  return true;
}
let n=0,t=setInterval(function(){n++;if(init()||n>240)clearInterval(t);},50);
})();
