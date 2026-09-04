// FORM 10.89 — one-pass results cleanup. No observers and no scoring changes.
(function(){'use strict';
if(window.FORM_RESULTS_CLEANUP_V187)return;window.FORM_RESULTS_CLEANUP_V187=true;
function apply(){
  const results=document.getElementById('results');if(!results||!results.classList.contains('formReport100'))return false;
  results.querySelector('.report100Lead')?.remove();
  const hero=results.querySelector('.report100Hero');if(hero){hero.style.display='block';hero.style.gridTemplateColumns='1fr';}
  const signal=results.querySelector('.report100Signal');
  if(signal){const cells=[...signal.children];cells.forEach(cell=>{const label=(cell.querySelector('.report100Label')?.textContent||'').trim().toLowerCase();if(label==='ranking separation'||label==='eligible finalists')cell.remove();});if(!signal.children.length)signal.remove();else{signal.style.gridTemplateColumns='1fr';}}
  return true;
}
window.FORM_APPLY_RESULTS_CLEANUP_V187=apply;
})();