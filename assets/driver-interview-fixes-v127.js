// FORM 10.31 — handedness selection requires explicit Continue.
(function(){
'use strict';
function init(){
  if(typeof state==='undefined')return false;
  const driver=document.getElementById('driverExperience');
  const handed=document.getElementById('handedQuestion');
  const brand=document.getElementById('brandQuestion');
  if(!driver||!handed||!brand)return false;

  // FORM 6.1 hard-coded handedness to call showOpeningBrandScope() 140ms after
  // selection. Guard that legacy entry point itself rather than fighting the DOM
  // after it advances. Only the Continue button is allowed to open Brands.
  const baseShowBrand=(typeof window.showOpeningBrandScope==='function')
    ? window.showOpeningBrandScope
    : (typeof showOpeningBrandScope==='function'?showOpeningBrandScope:null);
  let allowBrandAdvance=false;
  if(baseShowBrand){
    const guardedShowBrand=function(){
      if(!allowBrandAdvance)return;
      return baseShowBrand.apply(this,arguments);
    };
    window.showOpeningBrandScope=guardedShowBrand;
    try{showOpeningBrandScope=guardedShowBrand;}catch(e){}
  }

  function ensureContinue(){
    let wrap=handed.querySelector('.formOpeningContinue');
    if(!wrap){
      wrap=document.createElement('div');
      wrap.className='formOpeningContinue';
      handed.appendChild(wrap);
    }
    let button=wrap.querySelector('button');
    if(!button){
      button=document.createElement('button');
      button.type='button';
      button.className='solidBtn';
      button.textContent='Continue →';
      wrap.appendChild(button);
    }
    button.disabled=!state.handed;
    button.onclick=function(e){
      e.preventDefault();
      e.stopPropagation();
      if(!state.handed)return;
      allowBrandAdvance=true;
      try{
        if(baseShowBrand)baseShowBrand();
        else {
          handed.classList.add('hidden');
          brand.classList.remove('hidden');
          if(typeof renderBrandScope==='function')renderBrandScope();
        }
      }finally{
        allowBrandAdvance=false;
      }
      setTimeout(()=>window.FORM_CENTER_DRIVER_QUESTION?.('smooth'),20);
    };
  }

  function syncSelection(){
    const group=handed.querySelector('[data-group="handed"]');
    if(!group)return;
    group.querySelectorAll('.opt').forEach(btn=>{
      btn.classList.toggle('on',btn.dataset.v===state.handed);
    });
    ensureContinue();
  }

  // Let the existing choice handler own selection. Its delayed call to
  // showOpeningBrandScope is now harmless because the guarded entry point rejects it.
  driver.addEventListener('click',e=>{
    const choice=e.target.closest('#handedQuestion [data-group="handed"] .opt');
    if(choice){
      setTimeout(()=>{
        state.handed=choice.dataset.v;
        if(typeof updateDerived==='function')updateDerived();
        syncSelection();
        handed.classList.remove('hidden');
        brand.classList.add('hidden');
      },0);
    }
    if(e.target.closest('.formBrandBottomBack')||e.target.closest('#backBtn')){
      setTimeout(()=>{if(!handed.classList.contains('hidden'))syncSelection();},30);
    }
  },true);

  syncSelection();
  window.FORM_DRIVER_INTERVIEW_FIXES_V131=true;
  return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>200)clearInterval(t)},50);
})();