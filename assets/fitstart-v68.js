// FORM 6.8 — simpler fitting entry: one credible fitting depth, direct category navigation
(function(){
  'use strict';

  const style=document.createElement('style');
  style.textContent=`
    #page-fitstart .fitDepthPanel{display:none!important}
    #page-fitstart .fitStartSummaryDepth{display:none!important}
    #page-fitstart .fitSelectionPanel{scroll-margin-top:86px}
    #page-fitstart #fitCategoryPicker{scroll-margin-top:94px}
    #page-fitstart .fitSelectionTop{margin-top:0}
  `;
  document.head.appendChild(style);

  function scrollToCategoryChoices(){
    const picker=document.getElementById('fitCategoryPicker');
    const panel=document.querySelector('#page-fitstart .fitSelectionPanel');
    const target=picker||panel;
    if(!target)return;
    requestAnimationFrame(()=>target.scrollIntoView({behavior:'smooth',block:'start'}));
  }

  // FORM now uses one full credible fitting path. Depth can still adapt internally later,
  // but golfers do not choose a lower-information "quick" mode up front.
  if(window.formFitStartState){
    window.formFitStartState.depth='complete';
  } else if(typeof formFitStartState!=='undefined'){
    formFitStartState.depth='complete';
  }

  if(typeof selectFitDepth==='function'){
    selectFitDepth=function(){
      formFitStartState.depth='complete';
      if(typeof renderFitStart==='function')renderFitStart();
    };
  }

  if(typeof selectFitPath==='function'){
    const originalSelectFitPath=selectFitPath;
    selectFitPath=function(path){
      originalSelectFitPath(path);
      formFitStartState.depth='complete';
      if(typeof renderFitStart==='function')renderFitStart();
      if(path==='single')setTimeout(scrollToCategoryChoices,40);
    };
  }

  if(typeof renderFitStart==='function'){
    const originalRenderFitStart=renderFitStart;
    renderFitStart=function(){
      formFitStartState.depth='complete';
      originalRenderFitStart();
      document.querySelector('#page-fitstart .fitDepthPanel')?.remove();
      const summary=document.getElementById('fitStartSummary');
      if(summary){
        const count=(formFitStartState.categories||[]).filter(id=>!formFitCategoryMeta.find(x=>x.id===id)?.future).length;
        const labels=(formFitStartState.categories||[])
          .filter(id=>!formFitCategoryMeta.find(x=>x.id===id)?.future)
          .map(id=>formFitCategoryMeta.find(x=>x.id===id)?.label)
          .filter(Boolean);
        summary.textContent=count?labels.join(', '):'Choose at least one fitting to continue.';
      }
    };
  }

  // Re-render once so the obsolete depth selector disappears immediately.
  setTimeout(()=>{if(typeof renderFitStart==='function')renderFitStart()},0);

  // Load the post-v8.1 presentation/UX layer directly from the repository. The module waits
  // for the driver engine/config dependencies before initializing, so it is safe to request here.
  if(!document.querySelector('script[data-form-driver-v82]')){
    const s=document.createElement('script');s.src='assets/driver-config-v82.js?v=8.2';s.dataset.formDriverV82='true';document.head.appendChild(s);
  }
})();