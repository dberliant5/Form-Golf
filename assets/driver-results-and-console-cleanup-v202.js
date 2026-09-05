// FORM 14.13.1 — results hierarchy + fitting-console cleanup.
// Presentation only. No scoring or navigation changes.
(function(){'use strict';if(window.FORM_RESULTS_CONSOLE_CLEANUP_V202)return;window.FORM_RESULTS_CONSOLE_CLEANUP_V202=true;
function ensureStyle(){if(document.getElementById('formCleanup202Style'))return;const s=document.createElement('style');s.id='formCleanup202Style';s.textContent=`
/* Remove confusing category weighting from finalist cards. */
#results.formReport100 .report100Metric em{display:none!important}
/* Hide console chrome once the report is being shown. */
#driverExperience:has(#results.formReport100:not(.hidden)) .formFitHud201,
#driverExperience:has(#results.formReport100:not(.hidden)) .formFitRail201{display:none!important}
#driverExperience:has(#results.formReport100:not(.hidden)) .fitStage{display:block!important;max-width:1180px!important}
#driverExperience:has(#results.formReport100:not(.hidden)) .mainPane{background:transparent!important;border:0!important;box-shadow:none!important;overflow:visible!important}
/* On mobile, the HUD/step pills read like a carousel. Remove them and keep the fitting itself app-like. */
@media(max-width:980px){.formFitHud201{display:none!important}#driverExperience.active .fitStage{margin-top:12px!important}}
.formTopFive202{margin:34px 0 17px;padding-top:25px;border-top:1px solid var(--line)}
.formTopFive202 .kicker{display:block;font-size:8px;letter-spacing:.14em;text-transform:uppercase;font-weight:850;color:#7c8980}
.formTopFive202 h2{font-family:Georgia,serif;font-size:30px;line-height:1.04;margin:6px 0 7px;color:var(--deep);letter-spacing:-.035em}
.formTopFive202 p{font-size:10.5px;line-height:1.62;color:var(--muted);margin:0;max-width:700px}
@media(max-width:600px){.formTopFive202{margin-top:27px;padding-top:20px}.formTopFive202 h2{font-size:26px}}
`;document.head.appendChild(s)}
function removeBlankBlocks(r){[...r.querySelectorAll('.report100Signal,.report100Panel,.report193Story,.report191Story')].forEach(el=>{const text=(el.textContent||'').replace(/\s+/g,'').trim();if(!text)el.remove();});}
function topFive(r){const grid=r.querySelector('.report100Grid'),explorer=r.querySelector('.formCompare197');if(!grid||!explorer)return;let h=r.querySelector('.formTopFive202');if(!h){h=document.createElement('section');h.className='formTopFive202';h.innerHTML='<span class="kicker">FORM’S RECOMMENDATIONS</span><h2>Your top five</h2><p>The five heads FORM would put into your fitting first, ranked by the complete fit for your swing, misses and priorities.</p>';grid.insertAdjacentElement('beforebegin',h);}else if(h.nextElementSibling!==grid){grid.insertAdjacentElement('beforebegin',h);}}
function clean(){const r=document.getElementById('results');if(!r?.classList.contains('formReport100'))return false;ensureStyle();removeBlankBlocks(r);topFive(r);return true}
function hook(n){const p=window[n];if(typeof p!=='function')return;window[n]=function(){const o=p.apply(this,arguments);try{clean()}catch(e){}return o}}
hook('FORM_APPLY_RESULTS_FITTER_NARRATIVE_V196');hook('FORM_APPLY_RESULTS_COMPARE_EXPLORER_V197');hook('FORM_APPLY_RESULTS_SPECIFICITY_POLISH_V198');hook('FORM_RENDER_DRIVER_REPORT_V181');
window.FORM_APPLY_RESULTS_CONSOLE_CLEANUP_V202=clean;try{clean()}catch(e){}
})();