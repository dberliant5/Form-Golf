// FORM fit-start bootstrap — load current core and critical controllers using the page test-build version.
(function(){
  'use strict';
  const params=new URLSearchParams(window.location.search);
  const build=params.get('v')||'current';

  // Bootstrap-level Generate My Fit recovery. This intentionally lives in the script
  // that already powers the fitting flow, rather than in a later results wrapper.
  let generating=false;
  function resultButton(){return document.querySelector('#step9 .readyBox button');}
  function pointInsideButton(x,y){
    const b=resultButton();if(!b)return false;
    const r=b.getBoundingClientRect();
    return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;
  }
  function restoreButton(b){if(!b)return;b.disabled=false;b.textContent='Generate My Fit →';}
  function startFitNow(b){
    if(generating)return;
    generating=true;
    b=b||resultButton();
    if(b){b.disabled=false;b.textContent='Preparing your fit…';b.setAttribute('data-form-tap-received','true');}
    requestAnimationFrame(function(){
      try{
        if(typeof window.FORM_START_DRIVER_RESULTS==='function'){
          // The current controller normally owns the prepared-report experience.
          generating=false;
          window.FORM_START_DRIVER_RESULTS();
          return;
        }
        if(typeof window.__FORM_BASE_SHOW_RESULTS==='function'){
          window.__FORM_BASE_SHOW_RESULTS.call(window);
          generating=false;
          return;
        }
        if(typeof window.showResults==='function'){
          const fn=window.showResults;
          generating=false;
          fn.call(window);
          return;
        }
        throw new Error('No FORM results renderer is available.');
      }catch(err){
        console.error('FORM bootstrap Generate My Fit failed',err);
        generating=false;restoreButton(b);
        const box=document.querySelector('#step9 .readyBox');
        if(box&&!document.getElementById('formBootstrapResultError')){
          const p=document.createElement('p');p.id='formBootstrapResultError';
          p.style.cssText='margin:12px 0 0;color:#8b1e1e;font-weight:700';
          p.textContent='FORM received the tap but could not open the report.';
          box.appendChild(p);
        }
      }
    });
  }
  function keepButtonLive(){
    const b=resultButton();if(!b)return;
    b.disabled=false;
    b.style.pointerEvents='auto';
    b.style.touchAction='manipulation';
    b.style.position='relative';
    b.style.zIndex='2147483647';
    b.onclick=function(e){if(e){e.preventDefault();e.stopPropagation();}startFitNow(b);return false;};
  }
  // Capture before any downstream click/touch wrappers. The coordinate check also
  // catches taps swallowed by a transparent element positioned over the CTA.
  document.addEventListener('pointerdown',function(e){
    if(pointInsideButton(e.clientX,e.clientY)){e.preventDefault();e.stopPropagation();startFitNow(resultButton());}
  },true);
  document.addEventListener('touchstart',function(e){
    const t=e.touches&&e.touches[0];if(!t)return;
    if(pointInsideButton(t.clientX,t.clientY)){e.preventDefault();e.stopPropagation();startFitNow(resultButton());}
  },{capture:true,passive:false});
  document.addEventListener('click',function(e){
    const b=e.target&&e.target.closest?e.target.closest('#step9 .readyBox button'):null;
    if(!b)return;e.preventDefault();e.stopPropagation();startFitNow(b);
  },true);
  const liveTimer=setInterval(keepButtonLive,250);
  setTimeout(function(){clearInterval(liveTimer);keepButtonLive();},60000);
  window.FORM_BOOTSTRAP_START_RESULTS=startFitNow;

  if(document.querySelector('script[data-form-fitstart-core]'))return;
  const s=document.createElement('script');
  s.async=false;
  s.src='assets/fitstart-core.js?v='+encodeURIComponent(build);
  s.dataset.formFitstartCore='true';
  s.onload=()=>{
    const flow=document.createElement('script');
    flow.async=false;
    flow.src='assets/driver-flow-v85.js?v='+encodeURIComponent(build);
    flow.dataset.formDriverFlowFresh='true';
    document.head.appendChild(flow);

    const results=document.createElement('script');
    results.async=false;
    results.src='assets/driver-results-controller-v96.js?v='+encodeURIComponent(build);
    results.dataset.formResultsController='true';
    document.head.appendChild(results);
  };
  document.head.appendChild(s);
})();