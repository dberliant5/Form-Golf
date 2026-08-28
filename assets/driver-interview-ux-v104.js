// FORM 10.5 — reversible opening/interview navigation + range-first launch-monitor inputs.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_INTERVIEW_UX_V105||typeof state==='undefined')return false;
  const driver=document.getElementById('driverExperience');if(!driver)return false;
  const handed=document.getElementById('handedQuestion'),brand=document.getElementById('brandQuestion'),flowNav=document.getElementById('flowNav');
  if(!handed||!brand)return false;

  const style=document.createElement('style');
  style.textContent=`
    #driverExperience .formInlineBack{display:inline-flex;align-items:center;gap:6px;border:0;background:transparent;padding:4px 0;margin:0 0 18px;color:var(--muted);font:700 11px/1.2 inherit;letter-spacing:.06em;text-transform:uppercase;cursor:pointer}
    #driverExperience .formInlineBack:hover{color:var(--deep)}
    #driverExperience .formOpeningContinue{display:flex;justify-content:flex-end;margin-top:20px}
    #driverExperience .formOpeningContinue button{min-width:150px}
    #driverExperience [data-group="lm"] .opt[data-v="exact"]{display:none!important}
    @media(max-width:760px){#driverExperience .formInlineBack{margin-bottom:14px;font-size:10px}#driverExperience .formOpeningContinue{margin-top:16px}#driverExperience .formOpeningContinue button{width:100%}}
  `;document.head.appendChild(style);

  function revealOpening(which){
    const target=which==='hand'?handed:brand,other=which==='hand'?brand:handed;
    const parent=target.closest('.step');
    document.querySelectorAll('#driverExperience .step').forEach(x=>x.classList.add('hidden'));
    if(parent)parent.classList.remove('hidden');
    other.classList.add('hidden');target.classList.remove('hidden');
    document.getElementById('handedSummary')?.classList.add('hidden');
    document.getElementById('brandOpeningSummary')?.classList.add('hidden');
    if(typeof step!=='undefined')step=1;
    if(flowNav)flowNav.style.display='none';
    const sc=document.getElementById('stepCount');if(sc)sc.textContent='01 / 09';
    setTimeout(()=>window.FORM_CENTER_DRIVER_QUESTION?.('smooth'),20);
  }
  function showBrandFromBack(){
    revealOpening('brand');
    if(typeof renderBrandScope==='function')renderBrandScope();
    ensureBackButtons();
  }
  function showHandFromBack(){revealOpening('hand');}
  function makeBack(handler){const b=document.createElement('button');b.type='button';b.className='formInlineBack';b.textContent='← Back';b.onclick=handler;return b;}

  function ensureHandedContinue(){
    let wrap=handed.querySelector('.formOpeningContinue');
    if(!wrap){
      wrap=document.createElement('div');wrap.className='formOpeningContinue';
      const b=document.createElement('button');b.type='button';b.className='solidBtn';b.textContent='Continue →';b.disabled=!state.handed;
      b.onclick=()=>{if(!state.handed)return;revealOpening('brand');if(typeof renderBrandScope==='function')renderBrandScope();ensureBackButtons();};
      wrap.appendChild(b);handed.appendChild(wrap);
    }
    const b=wrap.querySelector('button');if(b)b.disabled=!state.handed;
  }
  function ownHandedChoiceEvents(){
    const group=handed.querySelector('[data-group="handed"]');if(!group||group.dataset.formV105Owned==='true')return;
    group.dataset.formV105Owned='true';
    [...group.querySelectorAll('.opt')].forEach(old=>{
      const btn=old.cloneNode(true);old.replaceWith(btn);
      btn.classList.toggle('on',btn.dataset.v===state.handed);
      btn.onclick=()=>{
        group.querySelectorAll('.opt').forEach(x=>x.classList.remove('on'));
        btn.classList.add('on');state.handed=btn.dataset.v;
        if(typeof updateDerived==='function')updateDerived();
        ensureHandedContinue();
      };
    });
  }
  function ensureBackButtons(){
    if(!brand.querySelector('.formInlineBack'))brand.insertBefore(makeBack(showHandFromBack),brand.firstChild);
    document.querySelectorAll('#driverExperience .step').forEach(el=>{
      if(el.id==='results'||el.querySelector('.formInlineBack'))return;
      const n=Number((el.id.match(/step(\d+)/)||[])[1]);if(!Number.isFinite(n)||n<2)return;
      el.insertBefore(makeBack(()=>{if(n===2)showBrandFromBack();else if(typeof window.back==='function')window.back();}),el.firstChild);
    });
  }

  function enforceRangeFirst(){
    const group=document.querySelector('#driverExperience [data-group="lm"]');if(!group)return;
    const exact=group.querySelector('.opt[data-v="exact"]');if(exact){exact.style.display='none';exact.setAttribute('aria-hidden','true');}
    const range=group.querySelector('.opt[data-v="range"]');
    if(range){const label=(range.textContent||'').trim();if(/range/i.test(label)&&!/launch monitor/i.test(label))range.textContent='Launch monitor ranges';}
    if(state.lm==='exact'){
      state.lm='range';
      Object.keys(state.metrics||{}).forEach(id=>{if(state.metrics[id]){state.metrics[id].mode='range';state.metrics[id].value=null;}});
      group.querySelectorAll('.opt').forEach(x=>x.classList.toggle('on',x.dataset.v==='range'));
      if(typeof renderLMInputs==='function')renderLMInputs();
    }
  }

  ownHandedChoiceEvents();ensureHandedContinue();ensureBackButtons();enforceRangeFirst();
  const obs=new MutationObserver(()=>{ownHandedChoiceEvents();ensureHandedContinue();ensureBackButtons();enforceRangeFirst();});
  obs.observe(driver,{childList:true,subtree:true});
  window.FORM_DRIVER_INTERVIEW_UX_V104={version:'10.5'};
  window.FORM_DRIVER_INTERVIEW_UX_V105={version:'10.5'};
  return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>160)clearInterval(t);},50);
})();
