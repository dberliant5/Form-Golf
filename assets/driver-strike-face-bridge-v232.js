// FORM strike-face integration bridge v232
// Keeps the existing strike-evidence interview wiring intact while the visual selector owns the UX.
(function(){
  'use strict';
  function legacyClick(value){
    const btn=document.querySelector('#step4 [data-group="strike"] .opt[data-v="'+value+'"]');
    if(btn) btn.click();
  }
  document.addEventListener('pointerup',function(e){
    if(!e.target.closest?.('.formStrikeSurface')) return;
    setTimeout(function(){
      if(typeof state==='undefined') return;
      if(['heel','center','toe'].includes(state.strike)) legacyClick(state.strike);
    },0);
  });
  document.addEventListener('click',function(e){
    const choice=e.target.closest?.('[data-strike-consistency]');
    if(!choice) return;
    setTimeout(function(){
      if(typeof state==='undefined') return;
      if(state.strike==='varied') legacyClick('varied');
      else if(state.strike==='unknown') legacyClick('unknown');
      else if(['heel','center','toe'].includes(state.strike)) legacyClick(state.strike);
    },0);
  });
  window.FORM_STRIKE_FACE_V232={version:'14.11.7-strike-face-bridge'};
})();