// FORM 8.5 — final opening-flow authority + fit-start auto-advance
(function(){'use strict';
function init(){
  if(typeof state==='undefined'||typeof renderBrandScope!=='function'||typeof renderStep!=='function')return false;
  const handed=document.getElementById('handedQuestion'),brand=document.getElementById('brandQuestion'),hs=document.getElementById('handedSummary'),bs=document.getElementById('brandOpeningSummary'),flowNav=document.getElementById('flowNav');
  if(!handed||!brand)return false;
  function hideGlobalNav(){if(flowNav)flowNav.style.display='none';}
  function showGlobalNav(){if(flowNav)flowNav.style.display='flex';}
  function showHand(){step=1;handed.classList.remove('hidden');brand.classList.add('hidden');hs?.classList.add('hidden');bs?.classList.add('hidden');hideGlobalNav();}
  function showBrand(){step=1;handed.classList.add('hidden');brand.classList.remove('hidden');hs?.classList.remove('hidden');bs?.classList.add('hidden');const txt=document.getElementById('handedSummaryText');if(txt)txt.textContent=state.handed==='left'?'Left-handed':'Right-handed';renderBrandScope();hideGlobalNav();requestAnimationFrame(()=>brand.scrollIntoView({behavior:'smooth',block:'start'}));}
  function enterInterview(){handed.classList.add('hidden');brand.classList.add('hidden');hs?.classList.add('hidden');bs?.classList.add('hidden');step=2;renderStep();showGlobalNav();window.scrollTo({top:0,left:0,behavior:'smooth'});}

  // Replace, rather than wrap, the old confirmation path. The old implementation intentionally
  // showed a brand summary and then waited for the global Continue button; FORM 8.5 removes that stop.
  window.confirmBrandScope=function(){
    if(typeof brandScopeIsValid==='function'&&!brandScopeIsValid()){
      const wrap=document.getElementById('brandPickerWrap');wrap?.classList.add('needsAnswer');setTimeout(()=>wrap?.classList.remove('needsAnswer'),900);return;
    }
    formBrandScopeConfirmed=true;
    if(typeof saveBrandScope==='function')saveBrandScope();
    enterInterview();
  };

  // Remove previous click listeners by replacing the handedness buttons with clones, then bind once.
  document.querySelectorAll('#handedQuestion [data-group="handed"] .opt').forEach(btn=>{
    const clone=btn.cloneNode(true);btn.replaceWith(clone);
    clone.onclick=()=>{
      const group=clone.closest('[data-group]');group?.querySelectorAll('.opt').forEach(x=>x.classList.remove('on'));clone.classList.add('on');
      state.handed=clone.dataset.v;
      if(typeof updateDerived==='function')updateDerived();
      setTimeout(showBrand,40);
    };
  });

  const priorOpen=window.openFit;
  if(typeof priorOpen==='function')window.openFit=function(id){
    const out=priorOpen.apply(this,arguments);
    if(id==='driver'){
      step=1;state.handed=null;formBrandScopeConfirmed=false;
      try{localStorage.setItem('formBrandScopeConfirmed','false')}catch(e){}
      setTimeout(showHand,60);
    }
    return out;
  };

  const priorNext=window.next;
  if(typeof priorNext==='function')window.next=function(){
    if(step===1){if(!state.handed){showHand();return;}if(!formBrandScopeConfirmed){showBrand();return;}}
    return priorNext.apply(this,arguments);
  };

  // When Driver is selected on Start a Fitting, move the golfer to the actual Begin fitting CTA.
  document.addEventListener('click',e=>{
    if(!e.target.closest('#fitCategoryPicker button'))return;
    setTimeout(()=>{
      try{
        const selected=(typeof formFitStartState!=='undefined'&&Array.isArray(formFitStartState.categories)&&formFitStartState.categories.includes('driver'));
        const begin=document.getElementById('beginSelectedFits');
        if(selected&&begin&&!begin.disabled)begin.scrollIntoView({behavior:'smooth',block:'center'});
      }catch(err){}
    },120);
  },true);

  // If a stale summary is ever exposed by older code, suppress it on step 1.
  const guard=new MutationObserver(()=>{if(step===1){bs?.classList.add('hidden');hideGlobalNav();}});
  guard.observe(document.getElementById('step1'),{subtree:true,attributes:true,attributeFilter:['class']});
  window.FORM_DRIVER_FLOW_V85=true;
  return true;
}
function boot(){let n=0,t=setInterval(()=>{n++;if(init()||n>80)clearInterval(t)},50);}
if(document.readyState==='complete')setTimeout(boot,20);else window.addEventListener('load',()=>setTimeout(boot,20),{once:true});
})();