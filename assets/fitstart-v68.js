// FORM fit-start bootstrap — load current core and critical flow using the page test-build version.
(function(){
  'use strict';
  const params=new URLSearchParams(window.location.search);
  const build=params.get('v')||'current';
  if(document.querySelector('script[data-form-fitstart-core]'))return;
  const s=document.createElement('script');
  s.async=false;
  s.src='assets/fitstart-core.js?v='+encodeURIComponent(build);
  s.dataset.formFitstartCore='true';
  s.onload=()=>{
    // The flow controller is safety-critical: it owns fresh-answer state and the results handoff.
    // Load it again with the page build token so a stale nested asset cannot survive a new test link.
    const flow=document.createElement('script');
    flow.async=false;
    flow.src='assets/driver-flow-v85.js?v='+encodeURIComponent(build);
    flow.dataset.formDriverFlowFresh='true';
    document.head.appendChild(flow);
  };
  document.head.appendChild(s);
})();