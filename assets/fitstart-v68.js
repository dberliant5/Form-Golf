// FORM fit-start bootstrap — load current core and critical controllers using the page test-build version.
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
    const mobileStart=document.createElement('script');
    mobileStart.async=false;
    mobileStart.src='assets/fitstart-mobile-v108.js?v='+encodeURIComponent(build);
    mobileStart.dataset.formFitstartMobile='true';
    document.head.appendChild(mobileStart);

    const calibration=document.createElement('script');
    calibration.async=false;
    calibration.src='assets/driver-ranking-calibration-v101.js?v='+encodeURIComponent(build);
    calibration.dataset.formDriverRankingCalibration='true';
    document.head.appendChild(calibration);

    const flow=document.createElement('script');
    flow.async=false;
    flow.src='assets/driver-flow-v85.js?v='+encodeURIComponent(build);
    flow.dataset.formDriverFlowFresh='true';
    document.head.appendChild(flow);

    const interview=document.createElement('script');
    interview.async=false;
    interview.src='assets/driver-interview-ux-v104.js?v='+encodeURIComponent(build);
    interview.dataset.formDriverInterviewUx='true';
    document.head.appendChild(interview);

    const results=document.createElement('script');
    results.async=false;
    results.src='assets/driver-results-controller-v96.js?v='+encodeURIComponent(build);
    results.dataset.formResultsController='true';
    document.head.appendChild(results);

    const transition=document.createElement('script');
    transition.async=false;
    transition.src='assets/driver-results-transition-v101.js?v='+encodeURIComponent(build);
    transition.dataset.formDriverResultsTransition='true';
    document.head.appendChild(transition);
  };
  document.head.appendChild(s);
})();