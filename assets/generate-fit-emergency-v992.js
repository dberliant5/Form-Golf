// FORM 9.9.2 — fail-safe Generate My Fit entrypoint.
(function(){
  'use strict';
  const baseAtLoad = (typeof window.__FORM_BASE_SHOW_RESULTS === 'function')
    ? window.__FORM_BASE_SHOW_RESULTS
    : (typeof window.showResults === 'function' ? window.showResults : null);

  function generate(button){
    if(button){
      button.disabled = true;
      button.textContent = 'Preparing your fit…';
    }
    try{
      if(typeof window.FORM_START_DRIVER_RESULTS === 'function'){
        window.FORM_START_DRIVER_RESULTS();
        return;
      }
      const fallback = (typeof window.__FORM_BASE_SHOW_RESULTS === 'function')
        ? window.__FORM_BASE_SHOW_RESULTS
        : baseAtLoad;
      if(typeof fallback === 'function'){
        fallback.call(window);
        const results=document.getElementById('results');
        if(results) results.classList.remove('hidden');
        const nav=document.getElementById('flowNav');
        if(nav) nav.style.display='none';
        window.scrollTo(0,0);
        return;
      }
      throw new Error('No results renderer is available.');
    }catch(err){
      console.error('FORM Generate My Fit fail-safe failed',err);
      if(button){
        button.disabled=false;
        button.textContent='Generate My Fit →';
      }
      const ready=document.querySelector('#step9 .readyBox');
      if(ready && !document.getElementById('formGenerateFailure992')){
        const p=document.createElement('p');
        p.id='formGenerateFailure992';
        p.style.cssText='margin:12px 0 0;color:#8b1e1e;font-weight:700';
        p.textContent='FORM could not open the report. Please refresh this test build and try once more.';
        ready.appendChild(p);
      }
    }
  }

  document.addEventListener('click',function(e){
    const button=e.target && e.target.closest ? e.target.closest('#step9 .readyBox button') : null;
    if(!button)return;
    e.preventDefault();
    e.stopPropagation();
    if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    generate(button);
  },true);

  document.addEventListener('touchend',function(e){
    const button=e.target && e.target.closest ? e.target.closest('#step9 .readyBox button') : null;
    if(!button)return;
    e.preventDefault();
    e.stopPropagation();
    generate(button);
  },{capture:true,passive:false});

  window.FORM_GENERATE_FIT_FAILSAFE_992=generate;
})();
