// FORM fit-start bootstrap — load current core and critical controllers using the page test-build version.
(function(){
  'use strict';
  const params=new URLSearchParams(window.location.search);
  const build=params.get('v')||'current';

  // Capture the driver renderer immediately when fitstart loads. This runs before
  // the later dynamically-loaded results wrappers, so it gives FORM a stable,
  // non-recursive renderer entrypoint for diagnostics and recovery.
  if(!window.__FORM_EARLY_DRIVER_RENDERER && typeof window.showResults==='function'){
    window.__FORM_EARLY_DRIVER_RENDERER=window.showResults;
  }

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