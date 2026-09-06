// FORM 14.11.5 — activate fitter-style results story and finalize results structure.
// Presentation only. No observers, rescoring, ordering, or fitting-state changes.
(function(){'use strict';if(window.FORM_RESULTS_FITTER_ACTIVATE_V194)return;window.FORM_RESULTS_FITTER_ACTIVATE_V194=true;
function finalize(){
 const results=document.getElementById('results');if(!results?.classList.contains('formReport100'))return false;
 // Remove the compact thesis card and the blank signal block.
 results.querySelectorAll('.report100Story').forEach(x=>x.remove());
 results.querySelectorAll('.report100Signal').forEach(x=>x.remove());
 // Keep the richer fitter story, label it clearly, and place it directly after the hero.
 const fullStory=results.querySelector('.report193Story'),hero=results.querySelector('.report100Hero');
 if(fullStory){
   const label=fullStory.querySelector('.report100Label');if(label)label.textContent='YOUR FIT STORY';
   const heading=fullStory.querySelector('h3');if(heading)heading.textContent='How FORM reads your fit';
   if(hero&&hero.nextElementSibling!==fullStory)hero.insertAdjacentElement('afterend',fullStory);
 }
 // Put a visible heading inside the ranked column immediately above card #1.
 const rankings=results.querySelector('.report100Rankings');
 if(rankings&&!rankings.querySelector(':scope > .report194ShortlistHeading')){
   const h=document.createElement('section');h.className='report194ShortlistHeading';
   h.innerHTML='<span class="report100Label">YOUR SHORTLIST</span><h2>Top 5 Driver Fits</h2><p>Ranked from the same golfer profile and fitting priorities.</p>';
   rankings.insertBefore(h,rankings.firstChild);
 }
 if(!document.getElementById('formFinal194Style')){const s=document.createElement('style');s.id='formFinal194Style';s.textContent='.report194ShortlistHeading{margin:0 0 14px;padding:0 0 12px;border-bottom:1px solid var(--line)}.report194ShortlistHeading .report100Label{margin-bottom:5px}.report194ShortlistHeading h2{margin:0;font-size:25px;line-height:1.12;letter-spacing:-.02em}.report194ShortlistHeading p{margin:6px 0 0;color:var(--muted);font-size:10px;line-height:1.55}@media(max-width:820px){.report194ShortlistHeading h2{font-size:22px}}';document.head.appendChild(s)}
 return true;
}
function run(){try{if(typeof window.FORM_APPLY_RESULTS_FITTER_STORY_V193==='function')window.FORM_APPLY_RESULTS_FITTER_STORY_V193();return finalize()}catch(e){return false}}
function hook(name){const prior=window[name];if(typeof prior!=='function')return;window[name]=function(){const out=prior.apply(this,arguments);try{run()}catch(e){}return out;};}
hook('FORM_APPLY_RESULTS_SHORTLIST_STORY_V191');hook('FORM_APPLY_RESULTS_CLARITY_V190');hook('FORM_APPLY_RESULTS_STORY_V188');
window.FORM_FINALIZE_RESULTS_STRUCTURE_V194=finalize;
try{run()}catch(e){}
})();