// FORM 10.56 — technical-profile wording aligned with range-first evidence policy.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_INTERVIEW_COPY_V156)return true;
  const step=document.getElementById('step5');
  if(!step||typeof state==='undefined')return false;
  const h=step.querySelector('h1'),lead=step.querySelector('.lead'),group=step.querySelector('[data-group="lm"]'),note=step.querySelector('.note');
  if(h)h.textContent='What driver numbers do you know?';
  if(lead)lead.textContent='Enter only the information you genuinely know. Numbers from a launch monitor, simulator or prior fitting can all help. FORM uses ranges because driver numbers vary from swing to swing; you do not need every metric for the fit to work.';
  if(group){
    const exact=group.querySelector('[data-v="exact"]');if(exact){exact.style.setProperty('display','none','important');exact.setAttribute('aria-hidden','true');}
    const range=group.querySelector('[data-v="range"]');if(range)range.textContent='I know some useful ranges';
    const general=group.querySelector('[data-v="general"]');if(general)general.textContent='I know the general story';
    const none=group.querySelector('[data-v="none"]');if(none)none.textContent='I don’t know any of these';
  }
  if(note)note.innerHTML='<b>Use what you actually know.</b> A range is usually more representative than one “exact” swing. Unknown inputs stay unknown and lower recommendation confidence instead of being guessed.';
  if(state.lm==='exact')state.lm='range';
  Object.keys(state.metrics||{}).forEach(function(id){if(state.metrics[id]?.mode==='exact'){state.metrics[id].mode='range';state.metrics[id].value=null;}});
  window.FORM_DRIVER_INTERVIEW_COPY_V156={version:'10.56'};
  return true;
}
let n=0,t=setInterval(function(){n++;if(init()||n>240)clearInterval(t);},50);
})();
