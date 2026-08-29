// FORM 10.36 — driver-scoped opening questions with explicit Continue and fresh brand choice.
(function(){
'use strict';
function init(){
  if(typeof state==='undefined')return false;
  const driver=document.getElementById('driverExperience');
  const handed=document.getElementById('handedQuestion');
  const brand=document.getElementById('brandQuestion');
  const flow=document.getElementById('flowNav');
  if(!driver||!handed||!brand)return false;

  // ---------- shared opening-question chrome ----------
  document.getElementById('driverOpeningV136Styles')?.remove();
  const style=document.createElement('style');
  style.id='driverOpeningV136Styles';
  style.textContent=`
    #handedQuestion .formOpeningContinue{display:none!important}
    #handedQuestion .driverHandedContinueV136{display:flex;justify-content:flex-end;align-items:center;margin-top:20px}
    #handedQuestion .driverHandedContinueV136 .btn.primary{width:145px!important;min-width:145px!important;max-width:145px!important}
    #brandQuestion .brandScopeConfirm{font-family:Arial,Helvetica,sans-serif!important;font-size:9px!important;font-weight:900!important;letter-spacing:.13em!important;text-transform:uppercase!important;line-height:1!important;width:145px!important;min-width:145px!important;max-width:145px!important;min-height:45px!important;padding:15px 20px!important}
    @media(max-width:640px){
      #handedQuestion .driverHandedContinueV136{margin-top:16px}
      #handedQuestion .driverHandedContinueV136 .btn.primary{width:145px!important;min-width:145px!important;max-width:145px!important}
      #brandQuestion .brandScopeConfirm{width:145px!important;min-width:145px!important;max-width:145px!important}
    }
  `;
  document.head.appendChild(style);

  // ---------- handedness: driver-specific pending answer ----------
  const group=handed.querySelector('[data-group="handed"]')||handed.querySelector('[data-driver-handed-group]');
  if(!group)return false;
  group.removeAttribute('data-group');
  group.setAttribute('data-driver-handed-group','true');
  handed.querySelectorAll('.driverHandedContinueV133,.driverHandedContinueV134,.driverHandedContinueV135,.driverHandedContinueV136').forEach(x=>x.remove());
  let pendingHandedness=null;

  function keepHandedVisible(){
    const step1=handed.closest('.step')||brand.closest('.step');
    step1?.classList.remove('hidden');
    handed.classList.remove('hidden');
    brand.classList.add('hidden');
    document.getElementById('handedSummary')?.classList.add('hidden');
    document.getElementById('brandOpeningSummary')?.classList.add('hidden');
    if(flow)flow.style.display='none';
    if(typeof step!=='undefined')step=1;
    const sc=document.getElementById('stepCount');if(sc)sc.textContent='01 / 09';
  }

  function ensureHandedContinue(){
    handed.querySelectorAll('.formOpeningContinue').forEach(x=>x.style.setProperty('display','none','important'));
    let wrap=handed.querySelector('.driverHandedContinueV136');
    if(!wrap){
      wrap=document.createElement('div');wrap.className='driverHandedContinueV136';
      const b=document.createElement('button');b.type='button';b.className='btn primary';b.textContent='Continue →';
      wrap.appendChild(b);handed.appendChild(wrap);
    }
    const b=wrap.querySelector('button');
    b.disabled=!pendingHandedness;
    b.onclick=e=>{e.preventDefault();e.stopImmediatePropagation();if(!pendingHandedness)return;showDriverBrands();};
  }

  [...group.querySelectorAll('.opt')].forEach(old=>{
    const btn=old.cloneNode(true);btn.removeAttribute('onclick');btn.dataset.driverHanded=btn.dataset.v||'';btn.classList.remove('on');old.replaceWith(btn);
    btn.addEventListener('click',e=>{
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      pendingHandedness=btn.dataset.driverHanded;
      group.querySelectorAll('.opt').forEach(x=>x.classList.toggle('on',x===btn));
      ensureHandedContinue();keepHandedVisible();
    },true);
  });

  // ---------- brand scope: fresh selection for this driver fitting ----------
  let brandTouched=false;
  function brandValid(){
    try{return !!(brandTouched && typeof brandScopeIsValid==='function' && brandScopeIsValid());}catch(e){return false;}
  }
  function updateBrandContinue(){
    const confirm=brand.querySelector('.brandScopeConfirm');if(!confirm)return;
    confirm.disabled=!brandValid();
    confirm.setAttribute('aria-disabled',confirm.disabled?'true':'false');
  }
  function resetBrandChoice(){
    brandTouched=false;
    try{
      if(typeof formBrandScope!=='undefined'){
        formBrandScope.mode='';
        formBrandScope.brands=[];
      }
      if(typeof formBrandScopeConfirmed!=='undefined')formBrandScopeConfirmed=false;
    }catch(e){}
    try{if(typeof renderBrandScope==='function')renderBrandScope();}catch(e){}
    brand.querySelectorAll('.brandMode').forEach(x=>x.classList.remove('active'));
    document.getElementById('brandPickerWrap')?.classList.add('hidden');
    updateBrandContinue();
  }
  function showDriverBrands(){
    if(!pendingHandedness)return;
    state.handed=pendingHandedness;
    try{localStorage.setItem('formHandedness:driver',pendingHandedness);}catch(e){}
    if(typeof updateDerived==='function')updateDerived();
    const step1=brand.closest('.step');
    document.querySelectorAll('#driverExperience .step').forEach(x=>x.classList.add('hidden'));
    step1?.classList.remove('hidden');
    handed.classList.add('hidden');brand.classList.remove('hidden');
    document.getElementById('handedSummary')?.classList.add('hidden');
    document.getElementById('brandOpeningSummary')?.classList.add('hidden');
    if(typeof step!=='undefined')step=1;
    resetBrandChoice();
    setTimeout(()=>window.FORM_CENTER_DRIVER_QUESTION?.('smooth'),20);
  }
  function commitBrandAndContinue(){
    if(!brandValid())return;
    try{
      if(typeof formBrandScopeConfirmed!=='undefined')formBrandScopeConfirmed=true;
      localStorage.setItem('formBrandScope:driver',JSON.stringify(formBrandScope));
      localStorage.setItem('formBrandScopeConfirmed:driver','true');
    }catch(e){}
    brand.classList.add('hidden');
    if(typeof step!=='undefined')step=2;
    if(typeof renderStep==='function')renderStep();
    else document.getElementById('step2')?.classList.remove('hidden');
    if(flow)flow.style.display='flex';
    setTimeout(()=>window.FORM_CENTER_DRIVER_QUESTION?.('smooth'),20);
  }

  brand.addEventListener('click',e=>{
    const mode=e.target.closest('.brandMode');
    if(mode){brandTouched=true;setTimeout(updateBrandContinue,0);return;}
    if(e.target.closest('#brandPicker')){setTimeout(updateBrandContinue,0);return;}
    const confirm=e.target.closest('.brandScopeConfirm');
    if(confirm){e.preventDefault();e.stopImmediatePropagation();commitBrandAndContinue();return;}
    if(e.target.closest('.formBrandBottomBack')){
      setTimeout(()=>{
        pendingHandedness=state.handed||pendingHandedness;
        state.handed=null;
        group.querySelectorAll('.opt').forEach(x=>x.classList.toggle('on',x.dataset.driverHanded===pendingHandedness));
        ensureHandedContinue();keepHandedVisible();
      },0);
    }
  },true);

  // Fresh driver fit starts with no committed opening-question answers.
  state.handed=null;
  pendingHandedness=null;
  ensureHandedContinue();keepHandedVisible();
  window.FORM_DRIVER_INTERVIEW_FIXES_V136={version:'10.36',scope:'driver',brandScope:'per-fit'};
  return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>200)clearInterval(t)},50);
})();