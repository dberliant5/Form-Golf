// FORM 10.27 — handedness selection never auto-advances; Continue is explicit.
(function(){
'use strict';
function init(){
 if(window.FORM_DRIVER_INTERVIEW_FIXES_V127||typeof state==='undefined')return false;
 const driver=document.getElementById('driverExperience'),handed=document.getElementById('handedQuestion'),brand=document.getElementById('brandQuestion');
 if(!driver||!handed||!brand)return false;
 function showBrand(){
  if(!state.handed)return;
  const parent=brand.closest('.step');document.querySelectorAll('#driverExperience .step').forEach(x=>x.classList.add('hidden'));if(parent)parent.classList.remove('hidden');handed.classList.add('hidden');brand.classList.remove('hidden');
  document.getElementById('handedSummary')?.classList.add('hidden');document.getElementById('brandOpeningSummary')?.classList.add('hidden');
  if(typeof step!=='undefined')step=1;if(typeof renderBrandScope==='function')renderBrandScope();
  setTimeout(()=>window.FORM_CENTER_DRIVER_QUESTION?.('smooth'),20);
 }
 function ensureContinue(){
  let wrap=handed.querySelector('.formOpeningContinue');
  if(!wrap){wrap=document.createElement('div');wrap.className='formOpeningContinue';handed.appendChild(wrap);}
  let b=wrap.querySelector('button');if(!b){b=document.createElement('button');b.type='button';b.className='solidBtn';b.textContent='Continue →';wrap.appendChild(b);}
  b.disabled=!state.handed;b.onclick=e=>{e.preventDefault();e.stopPropagation();showBrand();};
 }
 function ownChoices(){
  const group=handed.querySelector('[data-group="handed"]');if(!group)return;
  if(group.dataset.formV127Owned==='true'){ensureContinue();return;}
  group.dataset.formV127Owned='true';
  [...group.querySelectorAll('.opt')].forEach(old=>{
   const btn=old.cloneNode(true);old.replaceWith(btn);btn.classList.toggle('on',btn.dataset.v===state.handed);
   btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();group.querySelectorAll('.opt').forEach(x=>x.classList.remove('on'));btn.classList.add('on');state.handed=btn.dataset.v;if(typeof updateDerived==='function')updateDerived();ensureContinue();},true);
  });
  ensureContinue();
 }
 ownChoices();
 let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;ownChoices();});}).observe(handed,{childList:true,subtree:true});
 window.FORM_DRIVER_INTERVIEW_FIXES_V127=true;return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>160)clearInterval(t)},50);
})();