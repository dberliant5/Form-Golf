// FORM 10.89 — one-pass results cleanup. No observers and no scoring changes.
(function(){'use strict';
if(window.FORM_RESULTS_CLEANUP_V187)return;window.FORM_RESULTS_CLEANUP_V187=true;
function apply(){
  const results=document.getElementById('results');if(!results||!results.classList.contains('formReport100'))return false;
  results.querySelector('.report100Lead')?.remove();
  const hero=results.querySelector('.report100Hero');if(hero){hero.style.display='block';hero.style.gridTemplateColumns='1fr';const p=hero.querySelector('p');if(p)p.textContent='Your personalized driver short list, fitting starting point and current-driver comparison.';}
  results.querySelector('.report100Signal')?.remove();
  return true;
}
window.FORM_APPLY_RESULTS_CLEANUP_V187=apply;
})();