// FORM 10.60 — close remaining range-first input gaps.
// Removes per-metric Exact options that survived the earlier UI guard and restores
// attack-angle range/general input to the shared loft starting-point logic.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_RANGE_FIRST_V160)return true;
  const driver=document.getElementById('driverExperience'),V81=window.FORM_DRIVER_CONFIG_V81,CAL=window.FORM_DRIVER_ALGORITHM_CALIBRATION_V152;
  if(!driver||typeof state==='undefined'||!V81||!CAL||typeof CAL.loftFit!=='function')return false;

  function sanitizeMetricPrecision(){
    // Exact values are intentionally retired from the golfer-facing driver interview.
    driver.querySelectorAll('[data-group="lm"] [data-v="exact"]').forEach(function(el){
      el.style.setProperty('display','none','important');el.setAttribute('aria-hidden','true');
    });
    driver.querySelectorAll('select[data-metric-mode]').forEach(function(sel){
      const exact=sel.querySelector('option[value="exact"]');if(exact)exact.remove();
      if(sel.value==='exact')sel.value='range';
    });
    if(state.lm==='exact')state.lm='range';
    Object.keys(state.metrics||{}).forEach(function(id){
      const m=state.metrics[id];if(m?.mode==='exact'){m.mode='range';m.value=null;}
    });
  }

  const priorLoft=V81.loftFit.bind(V81);
  function aoaSignal(){
    const m=state?.metrics?.aoa;if(!m||m.mode==='unknown'||m.value==null)return null;
    const v=String(m.value);
    if(m.mode==='range'){
      if(['down6','down4-6','down2-4'].includes(v))return{delta:.5,label:'downward attack-angle range'};
      if(['up4-6','up6'].includes(v))return{delta:-.5,label:'upward attack-angle range'};
      return null;
    }
    if(m.mode==='general'){
      if(v==='steep')return{delta:.5,label:'clearly downward attack angle'};
      if(v==='upward')return{delta:-.5,label:'clearly upward attack angle'};
    }
    return null;
  }
  function rangeAwareLoft(p){
    const base=priorLoft(p),sig=aoaSignal();if(!sig)return base;
    const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
    const loft=Math.round(clamp((Number(base.loft)||10.5)+sig.delta,8,12)*2)/2;
    const lo=clamp(loft-.5,8,12),hi=clamp(loft+.5,8,12);
    const suffix=` Attack angle is being used directionally from your ${sig.label}; FORM is not pretending the range is an exact delivery number.`;
    return {...base,loft,range:`${lo.toFixed(1)}°–${hi.toFixed(1)}°`,reason:String(base.reason||'')+suffix,aoaRangeSignal:sig.label};
  }
  V81.loftFit=rangeAwareLoft;

  sanitizeMetricPrecision();
  let queued=false;new MutationObserver(function(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;sanitizeMetricPrecision();});}).observe(driver,{childList:true,subtree:true});
  document.addEventListener('click',function(){setTimeout(sanitizeMetricPrecision,0);},true);

  window.FORM_DRIVER_RANGE_FIRST_V160={version:'10.60',sanitizeMetricPrecision:sanitizeMetricPrecision,aoaSignal:aoaSignal,priorLoft:priorLoft,loftFit:rangeAwareLoft};
  return true;
}
let n=0,t=setInterval(function(){n++;if(init()||n>240)clearInterval(t);},50);
})();
