// FORM 10.32 — driver-scoped handedness with explicit Continue.
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
 let pendingHandedness=null;

 function keepDriverHandednessVisible(){
   const parent=handed.closest('.step')||brand.closest('.step');
   if(parent)parent.classList.remove('hidden');
   handed.classList.remove('hidden');
   brand.classList.add('hidden');
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
   handed.classList.add('hidden');
   brand.classList.remove('hidden');
   if(typeof step!=='undefined')step=1;
   if(typeof renderBrandScope==='function')renderBrandScope();
   setTimeout(()=>window.FORM_CENTER_DRIVER_QUESTION?.('smooth'),20);
 }

 function ensureContinue(){
   let wrap=handed.querySelector('.formOpeningContinue');
   if(!wrap){wrap=document.createElement('div');wrap.className='formOpeningContinue';handed.appendChild(wrap);}
   let b=wrap.querySelector('button');
   if(!b){b=document.createElement('button');b.type='button';b.className='solidBtn';b.textContent='Continue →';wrap.appendChild(b);}
   b.disabled=!pendingHandedness;
   b.onclick=e=>{e.preventDefault();e.stopImmediatePropagation();showDriverBrands();};
 }

 function isolateChoices(){
   [...legacyGroup.querySelectorAll('.opt')].forEach(old=>{
     const btn=old.cloneNode(true);
     btn.removeAttribute('onclick');
     btn.dataset.driverHanded=btn.dataset.v||'';
     btn.classList.remove('on');
     old.replaceWith(btn);
     btn.addEventListener('click',e=>{
       e.preventDefault();
       e.stopPropagation();
       e.stopImmediatePropagation();
       pendingHandedness=btn.dataset.driverHanded;
       legacyGroup.querySelectorAll('.opt').forEach(x=>x.classList.toggle('on',x===btn));
       ensureContinue();
       keepDriverHandednessVisible();
     },true);
   });
   ensureContinue();
 }

 state.handed=null;
 isolateChoices();
 keepDriverHandednessVisible();

 driver.addEventListener('click',e=>{
   if(!e.target.closest('.formBrandBottomBack')&&!e.target.closest('#backBtn'))return;
   setTimeout(()=>{
     if(!handed.classList.contains('hidden')){
       state.handed=null;
       pendingHandedness=null;
       legacyGroup.querySelectorAll('.opt').forEach(x=>x.classList.remove('on'));
       ensureContinue();
       keepDriverHandednessVisible();
     }
   },30);
 },true);

 window.FORM_DRIVER_INTERVIEW_FIXES_V132={version:'10.32',scope:'driver'};
 return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>200)clearInterval(t)},50);
})();