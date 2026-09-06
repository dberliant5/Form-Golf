// FORM 14.11.4 — surgical results structure cleanup on 14.11.3.
// Presentation only: no scoring, ordering, fitting state, observers, or result recomputation.
(function(){'use strict';
if(window.FORM_RESULTS_STRUCTURE_FIX_V199)return;window.FORM_RESULTS_STRUCTURE_FIX_V199=true;
function style(){if(document.getElementById('formStructure199Style'))return;const s=document.createElement('style');s.id='formStructure199Style';s.textContent=`
#results.formReport100 .report100Story{display:none!important}
#results.formReport100 .report100Signal{display:none!important}
#results.formReport100 .report199Heading{margin:26px 0 14px;padding-top:2px}
#results.formReport100 .report199Heading .report100Label{margin-bottom:5px}
#results.formReport100 .report199Heading h2{margin:0;font-size:25px;line-height:1.12;letter-spacing:-.02em}
#results.formReport100 .report199Heading p{margin:6px 0 0;color:var(--muted);font-size:10px;line-height:1.55}
@media(max-width:820px){#results.formReport100 .report199Heading{margin:23px 0 12px}#results.formReport100 .report199Heading h2{font-size:22px}}
`;document.head.appendChild(s)}
function apply(){style();const results=document.getElementById('results');if(!results?.classList.contains('formReport100'))return false;
 results.querySelectorAll('.report100Story').forEach(x=>x.remove());
 results.querySelectorAll('.report100Signal').forEach(x=>x.remove());
 const grid=results.querySelector('.report100Grid');if(grid&&!results.querySelector('.report199Heading')){const h=document.createElement('section');h.className='report199Heading';h.innerHTML='<span class="report100Label">YOUR SHORTLIST</span><h2>Your Top 5 Driver Fits</h2><p>Ranked from the same golfer profile and fitting priorities.</p>';grid.insertAdjacentElement('beforebegin',h)}
 return true}
function hook(n){const prior=window[n];if(typeof prior!=='function')return;window[n]=function(){const out=prior.apply(this,arguments);try{apply()}catch(e){}return out}}
window.FORM_APPLY_RESULTS_STRUCTURE_FIX_V199=apply;
hook('FORM_APPLY_RESULTS_SPECIFICITY_POLISH_V198');hook('FORM_APPLY_RESULTS_COMPARE_EXPLORER_V197');hook('FORM_APPLY_RESULTS_FITTER_NARRATIVE_V196');
try{apply()}catch(e){}
})();