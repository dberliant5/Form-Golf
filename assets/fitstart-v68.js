// FORM 6.8 — simpler fitting entry: one credible fitting depth, direct category navigation
(function(){
  'use strict';
  const style=document.createElement('style');style.textContent=`#page-fitstart .fitDepthPanel{display:none!important}#page-fitstart .fitStartSummaryDepth{display:none!important}#page-fitstart .fitSelectionPanel{scroll-margin-top:86px}#page-fitstart #fitCategoryPicker{scroll-margin-top:94px}#page-fitstart .fitSelectionTop{margin-top:0}`;document.head.appendChild(style);
  function scrollToCategoryChoices(){const picker=document.getElementById('fitCategoryPicker'),panel=document.querySelector('#page-fitstart .fitSelectionPanel'),target=picker||panel;if(!target)return;requestAnimationFrame(()=>target.scrollIntoView({behavior:'smooth',block:'start'}));}
  function markUserFitPath(path){document.querySelectorAll('#page-fitstart .fitPathCard').forEach(card=>card.classList.toggle('formUserSelected',card.dataset.fitPath===path));}
  if(window.formFitStartState)window.formFitStartState.depth='complete';else if(typeof formFitStartState!=='undefined')formFitStartState.depth='complete';
  if(typeof selectFitDepth==='function')selectFitDepth=function(){formFitStartState.depth='complete';if(typeof renderFitStart==='function')renderFitStart();};
  if(typeof selectFitPath==='function'){const originalSelectFitPath=selectFitPath;selectFitPath=function(path){originalSelectFitPath(path);markUserFitPath(path);formFitStartState.depth='complete';if(typeof renderFitStart==='function')renderFitStart();markUserFitPath(path);if(path==='single')setTimeout(scrollToCategoryChoices,40);};}
  if(typeof renderFitStart==='function'){const originalRenderFitStart=renderFitStart;renderFitStart=function(){formFitStartState.depth='complete';originalRenderFitStart();document.querySelector('#page-fitstart .fitDepthPanel')?.remove();const summary=document.getElementById('fitStartSummary');if(summary){const count=(formFitStartState.categories||[]).filter(id=>!formFitCategoryMeta.find(x=>x.id===id)?.future).length,labels=(formFitStartState.categories||[]).filter(id=>!formFitCategoryMeta.find(x=>x.id===id)?.future).map(id=>formFitCategoryMeta.find(x=>x.id===id)?.label).filter(Boolean);summary.textContent=count?labels.join(', '):'Choose at least one fitting to continue.';}};}
  // Clear any legacy visual default on initial render; user action re-adds formUserSelected.
  setTimeout(()=>{if(typeof renderFitStart==='function')renderFitStart();document.querySelectorAll('#page-fitstart .fitPathCard').forEach(card=>card.classList.remove('formUserSelected'));},0);
  const load=(key,src)=>{if(document.querySelector(`script[data-${key}]`))return;const s=document.createElement('script');s.async=false;s.src=src;s.setAttribute(`data-${key}`,'true');document.head.appendChild(s);};
  // Evidence layers must initialize in order: capability model -> proven-performance validation -> dimension calibration.
  load('form-driver-v83','assets/driver-evidence-v83.js?v=8.9.1');
  load('form-driver-v90','assets/driver-evidence-v90.js?v=9.0');
  load('form-driver-results-v87','assets/driver-results-v87.js?v=8.7');
  load('form-driver-proven-v89','assets/driver-proven-v89.js?v=8.9');
  load('form-driver-flow-v85','assets/driver-flow-v85.js?v=8.5.1');
  load('form-driver-polish-v86','assets/driver-polish-v86.js?v=8.6');
})();