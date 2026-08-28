// FORM 10.29 — explicit handedness Continue without persistent DOM observers.
(function(){
'use strict';
function init(){
 if(typeof state==='undefined')return false;
 const driver=document.getElementById('driverExperience'),handed=document.getElementById('handedQuestion'),brand=document.getElementById('brandQuestion'),flow=document.getElementById('flowNav');
 if(!driver||!handed||!brand)return false;
 let confirmed=false;
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
 function showBrand(){
  if(!state.handed)return;
  confirmed=true;
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
    if(old.dataset.formV129Owned)return;
    const btn=old.cloneNode(true);btn.dataset.formV129Owned='1';old.replaceWith(btn);
    btn.classList.toggle('on',btn.dataset.v===state.handed);
    btn.addEventListener('click',e=>{
      e.preventDefault();e.stopImmediatePropagation();
      confirmed=false;
      group.querySelectorAll('.opt').forEach(x=>x.classList.remove('on'));
      btn.classList.add('on');state.handed=btn.dataset.v;
      if(typeof updateDerived==='function')updateDerived();
      ensureContinue();
      // Legacy handlers may try to advance after selection. Restore only a few times,
      // then stop completely so Brands and later questions are never observed/rewritten.
      queueMicrotask(keepHandedVisible);
      setTimeout(keepHandedVisible,0);
      setTimeout(keepHandedVisible,40);
    },true);
  });
  ensureContinue();
 }
 ownChoices();keepHandedVisible();
 // Re-own only when the handedness question is explicitly shown again (e.g. Back).
 driver.addEventListener('click',e=>{
   if(e.target.closest('.formBrandBottomBack')||e.target.closest('#backBtn'))setTimeout(()=>{if(!handed.classList.contains('hidden')){confirmed=false;ownChoices();keepHandedVisible();}},30);
 },true);
 window.FORM_DRIVER_INTERVIEW_FIXES_V129=true;
 return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>200)clearInterval(t)},50);
})();