// FORM 10.35 — driver-scoped handedness with one standard-sized Continue button.
(function(){
'use strict';
function init(){
 if(typeof state==='undefined')return false;
 const driver=document.getElementById('driverExperience');
 const handed=document.getElementById('handedQuestion');
 const brand=document.getElementById('brandQuestion');
 const flow=document.getElementById('flowNav');
 if(!driver||!handed||!brand)return false;
 const legacyGroup=handed.querySelector('[data-group="handed"]')||handed.querySelector('[data-driver-handed-group]');
 if(!legacyGroup)return false;
 legacyGroup.removeAttribute('data-group');
 legacyGroup.setAttribute('data-driver-handed-group','true');
 document.getElementById('driverHandedV133Styles')?.remove();
 document.getElementById('driverHandedV134Styles')?.remove();
 document.getElementById('driverHandedV135Styles')?.remove();
 const style=document.createElement('style');
 style.id='driverHandedV135Styles';
 style.textContent=`
   #handedQuestion .formOpeningContinue{display:none!important}
   #handedQuestion .driverHandedContinueV135{display:flex;justify-content:flex-end;align-items:center;margin-top:20px}
   #handedQuestion .driverHandedContinueBtnV135{width:145px!important;min-width:145px!important;max-width:145px!important;min-height:52px!important;padding:14px 16px!important;font-size:12px!important;line-height:1!important;font-weight:800!important;letter-spacing:.14em!important;text-transform:uppercase;white-space:nowrap}
   #handedQuestion .driverHandedContinueBtnV135[aria-disabled="true"]{opacity:.42;pointer-events:none}
   @media(max-width:760px){#handedQuestion .driverHandedContinueV135{margin-top:16px}#handedQuestion .driverHandedContinueBtnV135{width:145px!important;min-width:145px!important;max-width:145px!important}}
 `;
 document.head.appendChild(style);
 handed.querySelectorAll('.driverHandedContinueV133,.driverHandedContinueV134,.driverHandedContinueV135').forEach(x=>x.remove());
 let pendingHandedness=null;
 function keepDriverHandednessVisible(){
   const parent=handed.closest('.step')||brand.closest('.step');
   if(parent)parent.classList.remove('hidden');
   handed.classList.remove('hidden');brand.classList.add('hidden');
   document.getElementById('handedSummary')?.classList.add('hidden');
   document.getElementById('brandOpeningSummary')?.classList.add('hidden');
   if(flow)flow.style.display='none';
   if(typeof step!=='undefined')step=1;
   const sc=document.getElementById('stepCount');if(sc)sc.textContent='01 / 09';
 }
 function showDriverBrands(){
   if(!pendingHandedness)return;
   state.handed=pendingHandedness;
   try{localStorage.setItem('formHandedness:driver',pendingHandedness);}catch(e){}
   if(typeof updateDerived==='function')updateDerived();
   const parent=brand.closest('.step');
   document.querySelectorAll('#driverExperience .step').forEach(x=>x.classList.add('hidden'));
   if(parent)parent.classList.remove('hidden');
   handed.classList.add('hidden');brand.classList.remove('hidden');
   if(typeof step!=='undefined')step=1;
   if(typeof renderBrandScope==='function')renderBrandScope();
   setTimeout(()=>window.FORM_CENTER_DRIVER_QUESTION?.('smooth'),20);
 }
 function ensureContinue(){
   handed.querySelectorAll('.formOpeningContinue').forEach(x=>x.style.setProperty('display','none','important'));
   let wrap=handed.querySelector('.driverHandedContinueV135');
   if(!wrap){
     wrap=document.createElement('div');wrap.className='driverHandedContinueV135';
     const b=document.createElement('button');b.type='button';b.className='solidBtn driverHandedContinueBtnV135';b.textContent='Continue →';
     wrap.appendChild(b);handed.appendChild(wrap);
   }
   const b=wrap.querySelector('button');
   const ready=!!pendingHandedness;
   b.setAttribute('aria-disabled',ready?'false':'true');
   b.onclick=e=>{e.preventDefault();e.stopImmediatePropagation();if(!pendingHandedness)return;showDriverBrands();};
 }
 function isolateChoices(){
   [...legacyGroup.querySelectorAll('.opt')].forEach(old=>{
     const btn=old.cloneNode(true);btn.removeAttribute('onclick');btn.dataset.driverHanded=btn.dataset.v||'';btn.classList.remove('on');old.replaceWith(btn);
     btn.addEventListener('click',e=>{
       e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
       pendingHandedness=btn.dataset.driverHanded;
       legacyGroup.querySelectorAll('.opt').forEach(x=>x.classList.toggle('on',x===btn));
       ensureContinue();keepDriverHandednessVisible();
     },true);
   });
   ensureContinue();
 }
 state.handed=null;
 isolateChoices();keepDriverHandednessVisible();
 driver.addEventListener('click',e=>{
   if(!e.target.closest('.formBrandBottomBack')&&!e.target.closest('#backBtn'))return;
   setTimeout(()=>{
     if(!handed.classList.contains('hidden')){
       state.handed=null;pendingHandedness=null;
       legacyGroup.querySelectorAll('.opt').forEach(x=>x.classList.remove('on'));
       ensureContinue();keepDriverHandednessVisible();
     }
   },30);
 },true);
 window.FORM_DRIVER_INTERVIEW_FIXES_V135={version:'10.35',scope:'driver'};
 return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>200)clearInterval(t)},50);
})();