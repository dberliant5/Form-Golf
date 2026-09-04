// FORM 10.90 — one-pass results cleanup. No observers and no scoring changes.
// Preserve trust signals: ordering confidence and input-quality adjustments stay visible.
(function(){'use strict';
if(window.FORM_RESULTS_CLEANUP_V187)return;window.FORM_RESULTS_CLEANUP_V187=true;
function apply(){
  const results=document.getElementById('results');if(!results||!results.classList.contains('formReport100'))return false;
  results.querySelector('.report100Lead')?.remove();
  const hero=results.querySelector('.report100Hero');if(hero){hero.style.display='block';hero.style.gridTemplateColumns='1fr';const h=hero.querySelector('h1'),p=hero.querySelector('p');if(h)h.textContent='Your driver fit';if(p)p.textContent='Your personalized short list, fitting starting point and current-driver comparison.';}
  const signal=results.querySelector('.report100Signal');
  if(signal){
    const cells=[...signal.children];
    const separation=cells.find(x=>/Ranking separation/i.test(x.textContent||''));
    const input=cells.find(x=>/Input consistency/i.test(x.textContent||''));
    signal.innerHTML='';
    [separation,input].filter(Boolean).forEach(x=>signal.appendChild(x));
    signal.style.gridTemplateColumns='repeat(2,minmax(0,1fr))';
    signal.style.margin='18px 0 22px';
    if(separation){const label=separation.querySelector('.report100Label');if(label)label.textContent='Ordering confidence';}
    if(input){const label=input.querySelector('.report100Label');if(label)label.textContent='Input quality';}
  }
  return true;
}
window.FORM_APPLY_RESULTS_CLEANUP_V187=apply;
})();