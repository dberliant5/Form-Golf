// FORM 9.5 core — fitting-path taxonomy, strict scoping, honest customization, guarded results transition
(function(){
  'use strict';
  const neutral=document.createElement('link');neutral.rel='stylesheet';neutral.href='assets/neutral-options-v91.css?v=9.5';neutral.dataset.formNeutral='true';if(!document.querySelector('link[data-form-neutral]'))document.head.appendChild(neutral);
  const style=document.createElement('style');style.textContent=`#page-fitstart .fitDepthPanel{display:none!important}#page-fitstart .fitStartSummaryDepth{display:none!important}#page-fitstart .fitSelectionPanel{scroll-margin-top:86px}#page-fitstart #fitCategoryPicker{scroll-margin-top:94px}#page-fitstart .fitSelectionTop{margin-top:0}#page-fitstart .fitPathCard.recommended:before,#page-fitstart .fitPathCard.recommended:after{display:none!important;content:none!important}#page-fitstart .fitPathBullets{margin:18px 0 16px;padding:0;list-style:none;display:grid;gap:8px;text-align:left}#page-fitstart .fitPathBullets li{position:relative;padding-left:18px;font-size:13px;line-height:1.45}#page-fitstart .fitPathBullets li:before{content:'•';position:absolute;left:2px;font-weight:800;color:var(--form-choice-mid)}#page-fitstart .fitPathCard.formUserSelected .fitPathBullets li:before{color:#fff}#fitScopeHelp{margin:8px 0 0;font-size:13px;line-height:1.45;color:var(--form-muted)}`;document.head.appendChild(style);

  const EQUIPMENT_IDS=new Set(['driver','fairway','fairways','hybrid','hybrids','irons','wedges','putter','putters','ball','balls']);
  const LIFESTYLE_IDS=new Set(['bags','bag','apparel','shoes','shoe','gloves','glove']);

  function refreshPathCopy(){
    const cards=[...document.querySelectorAll('#page-fitstart .fitPathCard')];
    const copy={
      single:{label:'ONE FITTING',title:'Fit one part of my game.',bullets:['Choose one equipment category','Driver, irons, wedges, putter, ball & more','Focused recommendations for what you need now'],foot:'ONE CATEGORY · START THERE'},
      equipment:{label:'FULL BAG',title:'Fit all my equipment.',bullets:['Driver through putter','Golf ball','Complete club and ball setup'],foot:'CLUBS + BALL'},
      complete:{label:'FULL GOLFER',title:'Fit my entire game.',bullets:['Everything is selected to start','Includes Full Bag, golf bag, shoes, gloves & apparel','Customize the scope before you begin'],foot:'EVERYTHING · CUSTOMIZABLE'}
    };
    cards.forEach(card=>{const c=copy[card.dataset.fitPath];if(!c)return;card.classList.remove('recommended');const label=card.querySelector('.fitPathLabel'),title=card.querySelector('h2');if(label)label.textContent=c.label;if(title)title.textContent=c.title;card.querySelector('p')?.remove();card.querySelector('.fitPathBullets')?.remove();const ul=document.createElement('ul');ul.className='fitPathBullets';ul.innerHTML=c.bullets.map(x=>`<li>${x}</li>`).join('');const foot=card.querySelector(':scope > span');if(foot){card.insertBefore(ul,foot);foot.textContent=c.foot;}else card.appendChild(ul);});
    const intro=document.querySelector('#page-fitstart .fitStartIntro p');if(intro)intro.textContent='Choose one fitting, fit every club and your ball, or start with your entire game and customize the scope.';
  }

  function categoryIdFromNode(node){return (node?.dataset?.fitCategory||node?.dataset?.category||node?.dataset?.fit||node?.dataset?.id||'').toLowerCase();}
  function isLifestyleNode(node){const id=categoryIdFromNode(node);if(LIFESTYLE_IDS.has(id))return true;const text=(node?.textContent||'').toLowerCase();return /golf bag|\bbags?\b|shoes?|apparel|gloves?/.test(text);}
  function activeMeta(){return (typeof formFitCategoryMeta==='undefined'?[]:formFitCategoryMeta).filter(x=>!x.future);}
  function selectedCount(){const ids=new Set(formFitStartState?.categories||[]);return activeMeta().filter(x=>ids.has(x.id)).length;}
  function ensureScopeHelp(){const wrap=document.querySelector('#page-fitstart .fitSelectionTop > div:first-child');if(!wrap)return null;let help=document.getElementById('fitScopeHelp');if(!help){help=document.createElement('p');help.id='fitScopeHelp';wrap.appendChild(help);}return help;}
  function updateScopeUI(){
    if(typeof formFitStartState==='undefined')return;
    const title=document.getElementById('fitSelectionTitle'),help=ensureScopeHelp(),summary=document.getElementById('fitStartSummary');
    const count=selectedCount(),total=activeMeta().length;
    if(formFitStartState.path==='complete'){
      if(title)title.textContent='Customize your fit.';
      if(help)help.textContent='Everything is selected to start. Remove anything you don’t want FORM to include.';
      if(summary)summary.textContent=count===total&&total?`Entire Game · ${count} categories selected`:`Custom fit · ${count} categor${count===1?'y':'ies'} selected`;
    }else if(formFitStartState.path==='equipment'){
      if(title)title.textContent='Your full equipment fit.';
      if(help)help.textContent='Clubs and golf ball only. Lifestyle categories stay out of this fit.';
      if(summary)summary.textContent=count?`Equipment fit · ${count} categories selected`:'Choose at least one equipment category to continue.';
    }else if(formFitStartState.path==='single'){
      if(title)title.textContent='Select one fitting.';
      if(help)help.textContent='Choose the one category you want FORM to fit now.';
    }else if(help)help.textContent='';
  }
  function enforcePathScope(){
    if(typeof formFitStartState==='undefined')return;
    const picker=document.getElementById('fitCategoryPicker');
    if(formFitStartState.path==='equipment'){
      formFitStartState.categories=(formFitStartState.categories||[]).filter(id=>EQUIPMENT_IDS.has(String(id).toLowerCase()));
      if(picker)[...picker.children].forEach(node=>node.style.display=isLifestyleNode(node)?'none':'');
    }else if(picker){[...picker.children].forEach(node=>node.style.display='');}
    updateScopeUI();
  }

  function scrollToCategoryChoices(){const picker=document.getElementById('fitCategoryPicker'),panel=document.querySelector('#page-fitstart .fitSelectionPanel'),target=picker||panel;if(!target)return;requestAnimationFrame(()=>target.scrollIntoView({behavior:'smooth',block:'start'}));}
  function markUserFitPath(path){document.querySelectorAll('#page-fitstart .fitPathCard').forEach(card=>card.classList.toggle('formUserSelected',card.dataset.fitPath===path));}
  function resetFitStart(){if(typeof formFitStartState==='undefined')return;refreshPathCopy();formFitStartState.path='';formFitStartState.categories=[];formFitStartState.depth='complete';document.querySelectorAll('#page-fitstart .fitPathCard').forEach(card=>card.classList.remove('active','formUserSelected','recommended'));const picker=document.getElementById('fitCategoryPicker');if(picker)picker.innerHTML='';const title=document.getElementById('fitSelectionTitle');if(title)title.textContent='Choose a fitting path above.';const help=ensureScopeHelp();if(help)help.textContent='';const count=document.getElementById('fitCategoryCount');if(count)count.textContent='0';const summary=document.getElementById('fitStartSummary');if(summary)summary.textContent='Choose how you want FORM to help first.';const begin=document.getElementById('beginSelectedFits');if(begin)begin.disabled=true;}
  if(typeof formFitStartState!=='undefined')resetFitStart();
  if(typeof selectFitDepth==='function')selectFitDepth=function(){formFitStartState.depth='complete';if(typeof renderFitStart==='function')renderFitStart();enforcePathScope();};
  if(typeof selectFitPath==='function'){const originalSelectFitPath=selectFitPath;selectFitPath=function(path){originalSelectFitPath(path);refreshPathCopy();markUserFitPath(path);formFitStartState.depth='complete';if(typeof renderFitStart==='function')renderFitStart();refreshPathCopy();markUserFitPath(path);enforcePathScope();if(path==='single')setTimeout(scrollToCategoryChoices,40);};}
  if(typeof renderFitStart==='function'){const originalRenderFitStart=renderFitStart;renderFitStart=function(){if(!formFitStartState.path){resetFitStart();return;}formFitStartState.depth='complete';originalRenderFitStart();refreshPathCopy();document.querySelector('#page-fitstart .fitDepthPanel')?.remove();enforcePathScope();const countEl=document.getElementById('fitCategoryCount');if(countEl)countEl.textContent=String(selectedCount());markUserFitPath(formFitStartState.path);updateScopeUI();};}
  const priorShow=window.showPage;if(typeof priorShow==='function')window.showPage=function(name){const out=priorShow.apply(this,arguments);if(name==='fitstart')setTimeout(resetFitStart,0);return out;};
  setTimeout(resetFitStart,0);
  const load=(key,src)=>{if(document.querySelector(`script[data-${key}]`))return;const s=document.createElement('script');s.async=false;s.src=src;s.setAttribute(`data-${key}`,'true');document.head.appendChild(s);};
  load('form-driver-v83','assets/driver-evidence-v83.js?v=8.9.1');
  load('form-driver-v90','assets/driver-evidence-v90.js?v=9.0');
  load('form-driver-results-base-v95','assets/driver-results-base-capture-v95.js?v=9.5');
  load('form-driver-results-v87','assets/driver-results-v87.js?v=8.7.1');
  load('form-driver-results-watchdog-v95','assets/driver-results-watchdog-v95.js?v=9.5');
  load('form-driver-proven-v89','assets/driver-proven-v89.js?v=8.9');
  load('form-driver-flow-v85','assets/driver-flow-v85.js?v=8.5.1');
  load('form-driver-polish-v86','assets/driver-polish-v86.js?v=8.6');
})();