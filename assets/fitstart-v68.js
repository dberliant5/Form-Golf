// FORM 9.3.2 — simpler fitting entry: one credible fitting depth, direct category navigation
(function(){
  'use strict';
  const neutral=document.createElement('link');neutral.rel='stylesheet';neutral.href='assets/neutral-options-v91.css?v=9.3.2';neutral.dataset.formNeutral='true';if(!document.querySelector('link[data-form-neutral]'))document.head.appendChild(neutral);
  const style=document.createElement('style');style.textContent=`#page-fitstart .fitDepthPanel{display:none!important}#page-fitstart .fitStartSummaryDepth{display:none!important}#page-fitstart .fitSelectionPanel{scroll-margin-top:86px}#page-fitstart #fitCategoryPicker{scroll-margin-top:94px}#page-fitstart .fitSelectionTop{margin-top:0}#page-fitstart .fitPathCard.recommended:before,#page-fitstart .fitPathCard.recommended:after{display:none!important;content:none!important}`;document.head.appendChild(style);
  function refreshPathCopy(){
    const cards=[...document.querySelectorAll('#page-fitstart .fitPathCard')];
    const copy={
      single:{label:'ONE FITTING',title:'Fit one part of my game.',desc:'Choose one category—such as driver, irons, wedges, putter or golf ball.',foot:'ONE CATEGORY · START THERE'},
      equipment:{label:'FULL BAG',title:'Fit all my equipment.',desc:'Fit your driver through golf ball and bag as one connected equipment setup.',foot:'ALL EQUIPMENT CATEGORIES'},
      complete:{label:'FULL GOLFER',title:'Fit my complete golf profile.',desc:'Everything in Full Bag, plus shoes, gloves, apparel and broader golfer preferences.',foot:'EQUIPMENT + THE REST OF YOUR GAME'}
    };
    cards.forEach(card=>{const c=copy[card.dataset.fitPath];if(!c)return;card.classList.remove('recommended');const label=card.querySelector('.fitPathLabel'),title=card.querySelector('h2'),desc=card.querySelector('p'),foot=card.querySelector('span');if(label)label.textContent=c.label;if(title)title.textContent=c.title;if(desc)desc.textContent=c.desc;if(foot)foot.textContent=c.foot;});
    const intro=document.querySelector('#page-fitstart .fitStartIntro p');if(intro)intro.textContent='Choose one category, fit your full bag, or fit your complete golfer profile.';
  }
  function scrollToCategoryChoices(){const picker=document.getElementById('fitCategoryPicker'),panel=document.querySelector('#page-fitstart .fitSelectionPanel'),target=picker||panel;if(!target)return;requestAnimationFrame(()=>target.scrollIntoView({behavior:'smooth',block:'start'}));}
  function markUserFitPath(path){document.querySelectorAll('#page-fitstart .fitPathCard').forEach(card=>card.classList.toggle('formUserSelected',card.dataset.fitPath===path));}
  function resetFitStart(){if(typeof formFitStartState==='undefined')return;refreshPathCopy();formFitStartState.path='';formFitStartState.categories=[];formFitStartState.depth='complete';document.querySelectorAll('#page-fitstart .fitPathCard').forEach(card=>{card.classList.remove('active','formUserSelected','recommended');});const picker=document.getElementById('fitCategoryPicker');if(picker)picker.innerHTML='';const title=document.getElementById('fitSelectionTitle');if(title)title.textContent='Choose a fitting path above.';const count=document.getElementById('fitCategoryCount');if(count)count.textContent='0';const summary=document.getElementById('fitStartSummary');if(summary)summary.textContent='Choose how you want FORM to help first.';const begin=document.getElementById('beginSelectedFits');if(begin)begin.disabled=true;}
  if(typeof formFitStartState!=='undefined')resetFitStart();
  if(typeof selectFitDepth==='function')selectFitDepth=function(){formFitStartState.depth='complete';if(typeof renderFitStart==='function')renderFitStart();};
  if(typeof selectFitPath==='function'){const originalSelectFitPath=selectFitPath;selectFitPath=function(path){originalSelectFitPath(path);refreshPathCopy();markUserFitPath(path);formFitStartState.depth='complete';if(typeof renderFitStart==='function')renderFitStart();refreshPathCopy();markUserFitPath(path);if(path==='single')setTimeout(scrollToCategoryChoices,40);};}
  if(typeof renderFitStart==='function'){const originalRenderFitStart=renderFitStart;renderFitStart=function(){if(!formFitStartState.path){resetFitStart();return;}formFitStartState.depth='complete';originalRenderFitStart();refreshPathCopy();document.querySelector('#page-fitstart .fitDepthPanel')?.remove();const summary=document.getElementById('fitStartSummary');if(summary){const count=(formFitStartState.categories||[]).filter(id=>!formFitCategoryMeta.find(x=>x.id===id)?.future).length,labels=(formFitStartState.categories||[]).filter(id=>!formFitCategoryMeta.find(x=>x.id===id)?.future).map(id=>formFitCategoryMeta.find(x=>x.id===id)?.label).filter(Boolean);summary.textContent=count?labels.join(', '):'Choose at least one fitting to continue.';}markUserFitPath(formFitStartState.path);};}
  const priorShow=window.showPage;if(typeof priorShow==='function')window.showPage=function(name){const out=priorShow.apply(this,arguments);if(name==='fitstart')setTimeout(resetFitStart,0);return out;};
  setTimeout(resetFitStart,0);
  const load=(key,src)=>{if(document.querySelector(`script[data-${key}]`))return;const s=document.createElement('script');s.async=false;s.src=src;s.setAttribute(`data-${key}`,'true');document.head.appendChild(s);};
  load('form-driver-v83','assets/driver-evidence-v83.js?v=8.9.1');
  load('form-driver-v90','assets/driver-evidence-v90.js?v=9.0');
  load('form-driver-results-v87','assets/driver-results-v87.js?v=8.7');
  load('form-driver-proven-v89','assets/driver-proven-v89.js?v=8.9');
  load('form-driver-flow-v85','assets/driver-flow-v85.js?v=8.5.1');
  load('form-driver-polish-v86','assets/driver-polish-v86.js?v=8.6');
})();