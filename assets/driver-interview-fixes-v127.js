// FORM 10.30 — handedness stays on-screen until Continue is explicitly pressed.
(function(){
'use strict';
function init(){
 if(typeof state==='undefined')return false;
 const driver=document.getElementById('driverExperience'),handed=document.getElementById('handedQuestion'),brand=document.getElementById('brandQuestion'),flow=document.getElementById('flowNav');
 if(!driver||!handed||!brand)return false;
 let confirmed=false,guardTimer=null,guardStop=null;
 function keepHandedVisible(){
  if(confirmed)return;
  const parent=handed.closest('.step')||brand.closest('.step');
  if(parent)parent.classList.remove('hidden');
  handed.classList.remove('hidden');brand.classList.add('hidden');
  document.getElementById('handedSummary')?.classList.add('hidden');
  document.getElementById('brandOpeningSummary')?.classList.add('hidden');
  if(flow)flow.style.display='none';
  if(typeof step!=='undefined')step=1;
  const sc=document.getElementById('stepCount');if(sc)sc.textContent='01 / 09';
 }
 function stopGuard(){if(guardTimer){clearInterval(guardTimer);guardTimer=null;}if(guardStop){clearTimeout(guardStop);guardStop=null;}}
 function armGuard(){
  stopGuard();confirmed=false;keepHandedVisible();
  // Some legacy handlers advance on a later touch/click phase. Hold this screen only
  // for a short, finite window; Continue immediately disables the guard.
  guardTimer=setInterval(()=>{if(confirmed){stopGuard();return;}keepHandedVisible();},25);
  guardStop=setTimeout(()=>{stopGuard();if(!confirmed)keepHandedVisible();},700);
 }
 function showBrand(){
  if(!state.handed)return;
  confirmed=true;stopGuard();
  const parent=brand.closest('.step');
  document.querySelectorAll('#driverExperience .step').forEach(x=>x.classList.add('hidden'));
  if(parent)parent.classList.remove('hidden');
  handed.classList.add('hidden');brand.classList.remove('hidden');
  if(typeof step!=='undefined')step=1;
  if(typeof renderBrandScope==='function')renderBrandScope();
  setTimeout(()=>window.FORM_CENTER_DRIVER_QUESTION?.('smooth'),20);
 }
 function ensureContinue(){
  let wrap=handed.querySelector('.formOpeningContinue');
  if(!wrap){wrap=document.createElement('div');wrap.className='formOpeningContinue';handed.appendChild(wrap);}
  let b=wrap.querySelector('button');
  if(!b){b=document.createElement('button');b.type='button';b.className='solidBtn';b.textContent='Continue →';wrap.appendChild(b);}
  b.disabled=!state.handed;
  b.onclick=e=>{e.preventDefault();e.stopImmediatePropagation();showBrand();};
 }
 function ownChoices(){
  const group=handed.querySelector('[data-group="handed"]');if(!group)return;
  [...group.querySelectorAll('.opt')].forEach(old=>{
    if(old.dataset.formV130Owned)return;
    const btn=old.cloneNode(true);btn.dataset.formV130Owned='1';old.replaceWith(btn);
    btn.classList.toggle('on',btn.dataset.v===state.handed);
    btn.addEventListener('click',e=>{
      e.preventDefault();e.stopImmediatePropagation();
      group.querySelectorAll('.opt').forEach(x=>x.classList.remove('on'));
      btn.classList.add('on');state.handed=btn.dataset.v;
      if(typeof updateDerived==='function')updateDerived();
      ensureContinue();armGuard();
    },true);
  });
  ensureContinue();
 }
 ownChoices();keepHandedVisible();
 driver.addEventListener('click',e=>{
   if(e.target.closest('.formBrandBottomBack')||e.target.closest('#backBtn'))setTimeout(()=>{if(!handed.classList.contains('hidden')){confirmed=false;ownChoices();keepHandedVisible();}},30);
 },true);
 window.FORM_DRIVER_INTERVIEW_FIXES_V130=true;
 return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>200)clearInterval(t)},50);
})();