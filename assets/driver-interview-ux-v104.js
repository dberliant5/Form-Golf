// FORM 10.20 — stable interview navigation + clean range-only launch-monitor inputs.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_INTERVIEW_UX_V120||typeof state==='undefined')return false;
  const driver=document.getElementById('driverExperience');if(!driver)return false;
  const handed=document.getElementById('handedQuestion'),brand=document.getElementById('brandQuestion'),flowNav=document.getElementById('flowNav');
  if(!handed||!brand)return false;

  const style=document.createElement('style');
  style.textContent=`
    #driverExperience .formInlineBack{display:none!important}
    #driverExperience .formOpeningContinue{display:flex;justify-content:flex-end;margin-top:20px}
    #driverExperience .formOpeningContinue button{min-width:150px}
    #driverExperience [data-group="lm"] .opt[data-v="exact"]{display:none!important}
    #driverExperience #brandQuestion{width:100%;max-width:none}
    #driverExperience #brandQuestion .brandScopePanel{background:transparent!important;border:0!important;box-shadow:none!important;padding:0!important;margin:0!important;max-width:none!important}
    #driverExperience #brandQuestion .brandScopePanel>h1{font-family:Georgia,serif;font-size:clamp(34px,4.4vw,58px);font-weight:400;line-height:1.03;letter-spacing:-.035em;color:var(--deep);margin:0}
    #driverExperience #brandQuestion .brandScopePanel>.lead{margin:16px 0 24px;max-width:760px}
    #driverExperience #brandQuestion .brandModeGrid{margin-top:0}
    #driverExperience #brandQuestion .brandScopeActions{display:flex;justify-content:space-between;align-items:center;gap:18px;margin-top:20px}
    #driverExperience #brandQuestion .brandScopeActions .brandScopeConfirm{width:auto!important;min-width:145px!important;max-width:145px!important;flex:0 0 145px!important;padding:15px 20px!important;margin-left:auto!important}
    #driverExperience .metricBox .formMetricModeHidden{display:none!important}
    #driverExperience .metricBox .formMetricUnknown{display:block!important;margin:10px 0 0!important;width:auto!important;min-width:0!important;padding:8px 0!important;border:0!important;background:transparent!important;color:#727872!important;font-size:12px!important;font-weight:700!important;text-decoration:underline!important;text-underline-offset:3px!important}
    @media(max-width:760px){
      #driverExperience .formOpeningContinue{margin-top:16px}
      #driverExperience .formOpeningContinue button{width:100%}
      #driverExperience #brandQuestion .brandScopePanel>h1{font-size:clamp(32px,10vw,44px)}
      #driverExperience #brandQuestion .brandScopeActions{margin-top:16px}
      #driverExperience #brandQuestion .brandScopeActions .brandScopeConfirm{width:145px!important;min-width:145px!important;max-width:145px!important;flex-basis:145px!important}
    }
  `;document.head.appendChild(style);

  function normalizeBrandQuestion(){
    const panel=document.getElementById('brandScopePanel');if(!panel)return;
    const oldTitle=panel.querySelector(':scope > h3');
    if(oldTitle){const h=document.createElement('h1');h.textContent=oldTitle.textContent;oldTitle.replaceWith(h);}
    const copy=panel.querySelector(':scope > p');if(copy&&!copy.classList.contains('lead'))copy.classList.add('lead');
    const confirm=panel.querySelector('.brandScopeConfirm');
    if(confirm){
      if(!confirm.classList.contains('solidBtn'))confirm.classList.add('solidBtn');
      if(confirm.textContent!=='Continue →')confirm.textContent='Continue →';
      confirm.style.setProperty('width','145px','important');confirm.style.setProperty('min-width','145px','important');confirm.style.setProperty('max-width','145px','important');confirm.style.setProperty('flex','0 0 145px','important');
    }
  }
  function removeTopBacks(){driver.querySelectorAll('.formInlineBack').forEach(x=>x.remove());}
  function revealOpening(which){
    const target=which==='hand'?handed:brand,other=which==='hand'?brand:handed,parent=target.closest('.step');
    document.querySelectorAll('#driverExperience .step').forEach(x=>x.classList.add('hidden'));
    if(parent)parent.classList.remove('hidden');other.classList.add('hidden');target.classList.remove('hidden');
    document.getElementById('handedSummary')?.classList.add('hidden');document.getElementById('brandOpeningSummary')?.classList.add('hidden');
    if(typeof step!=='undefined')step=1;const sc=document.getElementById('stepCount');if(sc&&sc.textContent!=='01 / 09')sc.textContent='01 / 09';
    syncBottomNav();setTimeout(()=>window.FORM_CENTER_DRIVER_QUESTION?.('smooth'),20);
  }
  function showBrandFromBack(){revealOpening('brand');if(typeof renderBrandScope==='function')renderBrandScope();normalizeBrandQuestion();syncBottomNav();}
  function showHandFromBack(){revealOpening('hand');syncBottomNav();}

  function ensureHandedContinue(){
    let wrap=handed.querySelector('.formOpeningContinue');
    if(!wrap){wrap=document.createElement('div');wrap.className='formOpeningContinue';const b=document.createElement('button');b.type='button';b.className='solidBtn';b.textContent='Continue →';b.disabled=!state.handed;b.onclick=()=>{if(!state.handed)return;revealOpening('brand');if(typeof renderBrandScope==='function')renderBrandScope();normalizeBrandQuestion();syncBottomNav();};wrap.appendChild(b);handed.appendChild(wrap);}
    const b=wrap.querySelector('button');if(b&&b.disabled===!!state.handed)b.disabled=!state.handed;
  }
  function ownHandedChoiceEvents(){
    const group=handed.querySelector('[data-group="handed"]');if(!group||group.dataset.formV120Owned==='true')return;group.dataset.formV120Owned='true';
    [...group.querySelectorAll('.opt')].forEach(old=>{const btn=old.cloneNode(true);old.replaceWith(btn);btn.classList.toggle('on',btn.dataset.v===state.handed);btn.onclick=()=>{group.querySelectorAll('.opt').forEach(x=>x.classList.remove('on'));btn.classList.add('on');state.handed=btn.dataset.v;if(typeof updateDerived==='function')updateDerived();ensureHandedContinue();};});
  }
  function syncBottomNav(){
    removeTopBacks();if(!flowNav)return;const backBtn=document.getElementById('backBtn'),nextBtn=document.getElementById('nextBtn');const handVisible=!handed.classList.contains('hidden'),brandVisible=!brand.classList.contains('hidden');
    if(handVisible){flowNav.style.display='none';return;}flowNav.style.display='flex';
    if(backBtn){backBtn.style.display='inline-block';backBtn.style.visibility='visible';backBtn.onclick=brandVisible?showHandFromBack:(()=>{if(typeof step!=='undefined'&&step===2)showBrandFromBack();else if(typeof window.back==='function')window.back();});}
    if(nextBtn)nextBtn.style.display=brandVisible?'none':(typeof step!=='undefined'&&step===9?'none':'inline-block');
  }

  function simplifyMetricCards(){
    if(state.lm!=='range')return;
    const box=document.getElementById('lmInputs');if(!box)return;
    Object.keys(state.metrics||{}).forEach(id=>{if(state.metrics[id]?.mode==='exact'||state.metrics[id]?.mode==='general')state.metrics[id].mode='range';});
    box.querySelectorAll('.metricBox').forEach(card=>{
      const buttons=[...card.querySelectorAll('button')];
      buttons.forEach(btn=>{
        const t=(btn.textContent||'').trim().toLowerCase();
        if(t==='exact'||t==='approx. range'||t==='approx range'||t==='general'){
          btn.classList.add('formMetricModeHidden');btn.style.setProperty('display','none','important');btn.setAttribute('aria-hidden','true');
        }else if(t==='i don’t know'||t==="i don't know"){
          btn.classList.add('formMetricUnknown');btn.textContent='I don’t know this one';
        }
      });
    });
  }

  function enforceRangeFirst(){
    const group=document.querySelector('#driverExperience [data-group="lm"]');if(!group)return;
    const exact=group.querySelector('.opt[data-v="exact"]');if(exact){exact.style.display='none';exact.setAttribute('aria-hidden','true');}
    const range=group.querySelector('.opt[data-v="range"]');if(range&&range.textContent.trim()!=='I know them')range.textContent='I know them';
    const general=group.querySelector('.opt[data-v="general"]');if(general&&general.textContent.trim()!=='I know the general story')general.textContent='I know the general story';
    if(state.lm==='exact')state.lm='range';
    Object.keys(state.metrics||{}).forEach(id=>{if(state.metrics[id]?.mode==='exact'){state.metrics[id].mode='range';state.metrics[id].value=null;}});
    const note=[...driver.querySelectorAll('p,div')].find(x=>x.children.length===0&&/Use the precision you actually know\./i.test(x.textContent||''));
    if(note)note.innerHTML='<b>Enter the ranges you know.</b> Launch-monitor numbers vary from swing to swing, so FORM uses ranges rather than pretending one exact number represents your game.';
    simplifyMetricCards();
  }

  function stabilize(){ownHandedChoiceEvents();ensureHandedContinue();normalizeBrandQuestion();enforceRangeFirst();removeTopBacks();}
  stabilize();syncBottomNav();
  let scheduled=false;const obs=new MutationObserver(()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;obs.disconnect();stabilize();obs.observe(driver,{childList:true,subtree:true});});});obs.observe(driver,{childList:true,subtree:true});
  document.addEventListener('click',e=>{if(e.target.closest('#driverExperience .brandScopeConfirm'))setTimeout(syncBottomNav,30);},true);
  const priorRender=window.renderStep;if(typeof priorRender==='function')window.renderStep=function(){const out=priorRender.apply(this,arguments);setTimeout(syncBottomNav,0);return out;};
  const priorLM=window.renderLMInputs;if(typeof priorLM==='function')window.renderLMInputs=function(){const out=priorLM.apply(this,arguments);setTimeout(()=>{enforceRangeFirst();simplifyMetricCards();},0);return out;};
  window.FORM_DRIVER_INTERVIEW_UX_V104={version:'10.20'};window.FORM_DRIVER_INTERVIEW_UX_V120={version:'10.20'};return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>160)clearInterval(t);},50);
})();