// FORM 10.33 — driver-scoped handedness; selection and Continue are fully isolated from legacy global handlers.
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

 // Remove any Continue control owned by the old global opening-question logic.
 handed.querySelectorAll('.formOpeningContinue,.driverHandedContinueV133').forEach(x=>x.remove());

 let pendingHandedness=null;
 const style=document.createElement('style');
 style.id='driverHandedV133Styles';
 style.textContent=`
   #handedQuestion .driverHandedContinueV133{display:flex;justify-content:flex-end;margin-top:20px}
   #handedQuestion .driverHandedContinueBtnV133{min-width:150px;border:0;background:#244d3c;color:#fff;padding:16px 22px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;cursor:pointer}
   #handedQuestion .driverHandedContinueBtnV133[aria-disabled="true"]{background:#b9c1bc;color:#fff;cursor:default}
   @media(max-width:760px){#handedQuestion .driverHandedContinueV133{margin-top:16px}#handedQuestion .driverHandedContinueBtnV133{width:100%}}
 `;
 document.getElementById(style.id)?.remove();document.head.appendChild(style);

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
   let wrap=handed.querySelector('.driverHandedContinueV133');
   if(!wrap){
     wrap=document.createElement('div');wrap.className='driverHandedContinueV133';
     const b=document.createElement('button');b.type='button';b.className='driverHandedContinueBtnV133';b.textContent='Continue →';
     wrap.appendChild(b);handed.appendChild(wrap);
   }
   const b=wrap.querySelector('button');
   const ready=!!pendingHandedness;
   // Do not use the native disabled property: legacy scripts key off disabled opening controls.
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

 window.FORM_DRIVER_INTERVIEW_FIXES_V133={version:'10.33',scope:'driver'};
 return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>200)clearInterval(t)},50);
})();