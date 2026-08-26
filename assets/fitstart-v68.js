// FORM 6.8 — simpler fitting entry: one credible fitting depth, direct category navigation
(function(){
  'use strict';
  const style=document.createElement('style');style.textContent=`#page-fitstart .fitDepthPanel{display:none!important}#page-fitstart .fitStartSummaryDepth{display:none!important}#page-fitstart .fitSelectionPanel{scroll-margin-top:86px}#page-fitstart #fitCategoryPicker{scroll-margin-top:94px}#page-fitstart .fitSelectionTop{margin-top:0}`;document.head.appendChild(style);
  function scrollToCategoryChoices(){const picker=document.getElementById('fitCategoryPicker'),panel=document.querySelector('#page-fitstart .fitSelectionPanel'),target=picker||panel;if(!target)return;requestAnimationFrame(()=>target.scrollIntoView({behavior:'smooth',block:'start'}));}
  if(window.formFitStartState)window.formFitStartState.depth='complete';else if(typeof formFitStartState!=='undefined')formFitStartState.depth='complete';
  if(typeof selectFitDepth==='function')selectFitDepth=function(){formFitStartState.depth='complete';if(typeof renderFitStart==='function')renderFitStart();};
  if(typeof selectFitPath==='function'){const originalSelectFitPath=selectFitPath;selectFitPath=function(path){originalSelectFitPath(path);formFitStartState.depth='complete';if(typeof renderFitStart==='function')renderFitStart();if(path==='single')setTimeout(scrollToCategoryChoices,40);};}
  if(typeof renderFitStart==='function'){const originalRenderFitStart=renderFitStart;renderFitStart=function(){formFitStartState.depth='complete';originalRenderFitStart();document.querySelector('#page-fitstart .fitDepthPanel')?.remove();const summary=document.getElementById('fitStartSummary');if(summary){const count=(formFitStartState.categories||[]).filter(id=>!formFitCategoryMeta.find(x=>x.id===id)?.future).length,labels=(formFitStartState.categories||[]).filter(id=>!formFitCategoryMeta.find(x=>x.id===id)?.future).map(id=>formFitCategoryMeta.find(x=>x.id===id)?.label).filter(Boolean);summary.textContent=count?labels.join(', '):'Choose at least one fitting to continue.';}};}
  setTimeout(()=>{if(typeof renderFitStart==='function')renderFitStart()},0);
  const load=(key,src)=>{if(document.querySelector(`script[data-${key}]`))return;const s=document.createElement('script');s.src=src;s.setAttribute(`data-${key}`,'true');document.head.appendChild(s);};
  load('form-driver-v83','assets/driver-evidence-v83.js?v=8.3.1');
  load('form-driver-v82','assets/driver-config-v82.js?v=8.2.2');
  load('form-driver-flow-v84','assets/driver-flow-hotfix-v84.js?v=8.4.1');
  load('form-driver-flow-v85','assets/driver-flow-v85.js?v=8.5');
})();