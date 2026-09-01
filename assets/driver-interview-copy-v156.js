// FORM 10.72 — canonical range-first technical-profile wording.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_INTERVIEW_COPY_V156)return true;
  const step=document.getElementById('step5');
  if(!step||typeof state==='undefined')return false;
  function apply(){
    const h=step.querySelector('h1'),lead=step.querySelector('.lead'),group=step.querySelector('[data-group="lm"]'),note=step.querySelector('.note');
    if(h)h.textContent='What driver numbers do you know?';
    if(lead)lead.textContent='Enter only the information you genuinely know. Numbers from a launch monitor, simulator or prior fitting can all help. FORM uses ranges because driver numbers vary from swing to swing; you do not need every metric for the fit to work.';
    if(group){
      const exact=group.querySelector('[data-v="exact"]');if(exact)exact.remove();
      const range=group.querySelector('[data-v="range"]');if(range)range.textContent='Yes — I know my typical ranges';
      const general=group.querySelector('[data-v="general"]');if(general)general.textContent='I know my typical tendencies';
      const none=group.querySelector('[data-v="none"]');if(none)none.textContent='No — I don’t know my launch-monitor data';
    }
    if(note)note.textContent='Typical ranges provide the strongest launch-monitor signal. Typical tendencies are still useful when you know the pattern but not the numbers.';
    if(state.lm==='exact')state.lm='range';
    Object.keys(state.metrics||{}).forEach(function(id){if(state.metrics[id]?.mode==='exact'){state.metrics[id].mode='range';state.metrics[id].value=null;}});
  }
  apply();
  let queued=false;
  new MutationObserver(function(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;apply();});}).observe(step,{childList:true,subtree:true});
  window.FORM_DRIVER_INTERVIEW_COPY_V156={version:'10.72',apply:apply};
  return true;
}
let n=0,t=setInterval(function(){n++;if(init()||n>240)clearInterval(t);},50);
})();
