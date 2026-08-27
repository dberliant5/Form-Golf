// FORM fit-start bootstrap — load the current core using the page's test-build version.
(function(){
  'use strict';
  const params=new URLSearchParams(window.location.search);
  const build=params.get('v')||'current';
  if(document.querySelector('script[data-form-fitstart-core]'))return;
  const s=document.createElement('script');
  s.async=false;
  s.src='assets/fitstart-core.js?v='+encodeURIComponent(build);
  s.dataset.formFitstartCore='true';
  document.head.appendChild(s);
})();