// FORM 10.4 — reversible interview navigation + range-first launch-monitor inputs.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_INTERVIEW_UX_V104||typeof state==='undefined')return false;
  const driver=document.getElementById('driverExperience');if(!driver)return false;

  const style=document.createElement('style');
  style.textContent=`
    #driverExperience .formInlineBack{display:inline-flex;align-items:center;gap:6px;border:0;background:transparent;padding:4px 0;margin:0 0 18px;color:var(--muted);font:700 11px/1.2 inherit;letter-spacing:.06em;text-transform:uppercase;cursor:pointer}
    #driverExperience .formInlineBack:hover{color:var(--deep)}
    #driverExperience [data-group="lm"] .opt[data-v="exact"]{display:none!important}
    @media(max-width:760px){#driverExperience .formInlineBack{margin-bottom:14px;font-size:10px}}
  `;document.head.appendChild(style);

  function showBrandFromBack(){
    const handed=document.getElementById('handedQuestion'),brand=document.getElementById('brandQuestion'),flowNav=document.getElementById('flowNav');
    document.querySelectorAll('#driverExperience .step').forEach(x=>x.classList.add('hidden'));
    handed?.classList.add('hidden');brand?.classList.remove('hidden');
    document.getElementById('handedSummary')?.classList.add('hidden');document.getElementById('brandOpeningSummary')?.classList.add('hidden');
    if(typeof step!=='undefined')step=1;
    if(typeof renderBrandScope==='function')renderBrandScope();
    if(flowNav)flowNav.style.display='none';
    setTimeout(()=>window.FORM_CENTER_DRIVER_QUESTION?.('smooth'),20);
  }
  function showHandFromBack(){
    const handed=document.getElementById('handedQuestion'),brand=document.getElementById('brandQuestion'),flowNav=document.getElementById('flowNav');
    brand?.classList.add('hidden');handed?.classList.remove('hidden');
    if(typeof step!=='undefined')step=1;
    if(flowNav)flowNav.style.display='none';
    setTimeout(()=>window.FORM_CENTER_DRIVER_QUESTION?.('smooth'),20);
  }
  function makeBack(handler){const b=document.createElement('button');b.type='button';b.className='formInlineBack';b.textContent='← Back';b.onclick=handler;return b;}
  function ensureBackButtons(){
    const brand=document.getElementById('brandQuestion');
    if(brand&&!brand.querySelector('.formInlineBack'))brand.insertBefore(makeBack(showHandFromBack),brand.firstChild);
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
    if(range){
      const label=(range.textContent||'').trim();
      if(/range/i.test(label)&&!/launch monitor/i.test(label))range.textContent='Launch monitor ranges';
    }
    if(state.lm==='exact'){
      state.lm='range';
      Object.keys(state.metrics||{}).forEach(id=>{if(state.metrics[id]){state.metrics[id].mode='range';state.metrics[id].value=null;}});
      group.querySelectorAll('.opt').forEach(x=>x.classList.toggle('on',x.dataset.v==='range'));
      if(typeof renderLMInputs==='function')renderLMInputs();
    }
  }

  // Exact shot values create false precision: speed, spin, launch and ball speed all vary shot to shot.
  // Keep granular ranges for measured data; retain qualitative/unknown paths for golfers without reliable LM data.
  ensureBackButtons();enforceRangeFirst();
  const obs=new MutationObserver(()=>{ensureBackButtons();enforceRangeFirst();});obs.observe(driver,{childList:true,subtree:true});
  window.FORM_DRIVER_INTERVIEW_UX_V104={version:'10.4'};return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>160)clearInterval(t);},50);
})();