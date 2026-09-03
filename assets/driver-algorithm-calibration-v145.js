// FORM 10.84 — pure configuration calibration.
// Observer-free. This layer calibrates loft and shaft starting points only.
// Absolute FORM Fit Scores remain independent of the golfer's current club; upgrade advice lives in the stable report renderer.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_ALGORITHM_CALIBRATION_V152)return true;
  const ENG=window.FORM_DRIVER_ENGINE_V80,V81=window.FORM_DRIVER_CONFIG_V81;
  if(!ENG||!V81||typeof state==='undefined'||typeof golfer!=='function')return false;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const answered=v=>v!==null&&v!==undefined&&v!==''&&v!=='unknown';
  const metric=id=>state?.metrics?.[id]||{mode:'unknown',value:null};

  function classify(id){
    const m=metric(id);if(!m||m.mode==='unknown'||!answered(m.value))return null;
    if(id==='spin'){
      if(m.mode==='exact'){const x=Number(m.value);if(!Number.isFinite(x))return null;return x<2100?'low':x>3000?'high':'mid';}
      if(m.mode==='range')return ['under1500','1500-1749','1750-1999'].includes(m.value)?'low':['3000-3499','3500plus'].includes(m.value)?'high':'mid';
      if(m.value==='varies')return'varies';return ['verylow','low'].includes(m.value)?'low':['high','veryhigh'].includes(m.value)?'high':'mid';
    }
    if(id==='launch'){
      if(m.mode==='exact'){const x=Number(m.value);if(!Number.isFinite(x))return null;return x<11?'low':x>17?'high':'mid';}
      if(m.mode==='range')return ['under8','8-10'].includes(m.value)?'low':['18-20','20plus'].includes(m.value)?'high':'mid';
      if(m.value==='varies')return'varies';return ['verylow','low'].includes(m.value)?'low':['high','veryhigh'].includes(m.value)?'high':'mid';
    }
    return null;
  }
  function ambiguousRange(id){
    const m=metric(id);if(m.mode!=='range')return false;
    return id==='launch'?['10-12','16-18'].includes(m.value):id==='spin'&&m.value==='2000-2249';
  }
  function numericExact(id){const m=metric(id);if(m.mode!=='exact'||!answered(m.value))return null;const n=Number(m.value);return Number.isFinite(n)?n:null;}

  function loftFit(p){
    const launch=classify('launch'),spin=classify('spin'),aoa=numericExact('aoa');let loft=10.5,reasons=[],conflict=false;
    if(launch==='low'){loft+=1;reasons.push('lower launch');}else if(launch==='high'){loft-=1;reasons.push('higher launch');}
    if(spin==='low'){loft+=.5;reasons.push('lower spin');}else if(spin==='high'){loft-=.5;reasons.push('higher spin');}
    conflict=(launch==='low'&&spin==='high')||(launch==='high'&&spin==='low');
    if(aoa!=null&&aoa<=-2){loft+=.5;reasons.push('downward attack angle');}else if(aoa!=null&&aoa>=4){loft-=.5;reasons.push('upward attack angle');}
    if(p?.player==='lowspin')loft+=.5;
    loft=Math.round(clamp(loft,8,12)*2)/2;
    const lo=clamp(loft-.5,8,12),hi=clamp(loft+.5,8,12);
    let reason=reasons.length?`Driven by ${reasons.slice(0,3).join(', ')}.`:'Neutral starting loft from the information provided.';
    if(ambiguousRange('launch')||ambiguousRange('spin'))reason+=' A reported range crosses a FORM fitting boundary, so that metric is not being used to force loft up or down.';
    if(conflict)reason+=' Launch and spin point in competing loft directions, so launch-monitor validation matters more than nominal loft.';
    return {loft,range:`${lo.toFixed(1)}°–${hi.toFixed(1)}°`,reason,conflict};
  }

  const rangeBounds={under75:[65,74],'75-84':[75,84],'85-89':[85,89],'90-94':[90,94],'95-99':[95,99],'100-104':[100,104],'105-109':[105,109],'110-114':[110,114],115plus:[115,125]};
  function flexAt(x){return x<80?'Senior / A':x<92?'Regular':x<105?'Stiff':'X-Stiff';}
  function baseWeightFor(labels){
    if(labels.includes('X-Stiff'))return[60,70];
    if(labels.includes('Stiff'))return labels.includes('Regular')?[50,65]:[55,65];
    if(labels.includes('Regular'))return labels.includes('Senior / A')?[45,60]:[50,60];
    return[45,55];
  }
  function transitionProfile(){
    const t=String(state?.transition||'unknown');
    if(t==='smooth')return{key:t,label:'smoother-loading / mid profile',shift:-4,note:'Your smoother transition supports testing the lighter end of the window and a profile that loads without needing an aggressively stiff tip section.'};
    if(t==='aggressive')return{key:t,label:'more stable / firmer-tip profile',shift:4,note:'Your quicker transition supports testing the heavier end of the window and a more stable profile before assuming a different flex family.'};
    if(t==='neutral')return{key:t,label:'neutral mid-profile',shift:0,note:'Your moderate transition supports a neutral profile as the starting point.'};
    return{key:'unknown',label:'profile to be tested',shift:0,note:'Transition is unknown or variable, so FORM is keeping shaft profile intentionally broad.'};
  }
  function shaftFit(){
    const m=metric('speed');let labels=[],source='club speed',note='';
    if(m.mode==='exact'&&answered(m.value)){
      const s=Number(m.value);if(!Number.isFinite(s))return {flex:'Speed needed',weight:'No defensible range yet',profile:'Profile to be tested',note:'FORM will not guess shaft flex or weight without usable club-speed information.'};
      labels=[flexAt(s)];
      if(Math.abs(s-80)<=2)labels=[flexAt(79),flexAt(81)];
      else if(Math.abs(s-92)<=2)labels=[flexAt(91),flexAt(93)];
      else if(Math.abs(s-105)<=2)labels=[flexAt(104),flexAt(106)];
      source='measured club speed';
      note=labels.length>1?' Your speed sits close to a flex boundary, so FORM recommends testing both adjacent flex families rather than treating 1–2 mph as decisive.':'';
    }else if(m.mode==='range'&&rangeBounds[m.value]){
      const [lo,hi]=rangeBounds[m.value];labels=[flexAt(lo),flexAt(hi)];source='reported speed range';
      note=labels[0]!==labels[1]?' The reported range crosses a flex boundary, so both adjacent flex families belong in the starting test window.':' This is intentionally broad because the input is a range rather than an exact measured average.';
    }else{
      const g=typeof normalizedGolferV69==='function'?normalizedGolferV69():golfer();
      const general={belowavg:82,typical:92,aboveavg:101,fast:108,veryfast:116};const s=m.mode==='general'?(general[m.value]||Number(g?.speed)):Number(g?.speed);
      if(!Number.isFinite(s))return {flex:'Speed needed',weight:'No defensible range yet',profile:'Profile to be tested',note:'FORM will not guess shaft flex or weight without usable club-speed information.'};
      labels=[flexAt(s)];source=m.mode==='general'?'general speed profile':'golfer speed profile';note=' This is a broad starting family because speed alone does not identify a final shaft.';
    }
    labels=[...new Set(labels)];
    const transition=transitionProfile(),base=baseWeightFor(labels);
    const lo=Math.max(40,Math.round(base[0]+transition.shift)),hi=Math.max(lo+5,Math.round(base[1]+transition.shift));
    const flex=labels.join(' / '),weight=`${lo}–${hi}g`;
    return {flex,weight,profile:transition.label,note:`Starting point from ${source}.${note} ${transition.note} Final shaft model, torque and exact weight still require testing.`};
  }

  window.FORM_DRIVER_ALGORITHM_CALIBRATION_V152={version:'10.84',classify,loftFit,shaftFit,transitionProfile};
  window.FORM_DRIVER_ALGORITHM_CALIBRATION_V145=window.FORM_DRIVER_ALGORITHM_CALIBRATION_V152;
  return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>240)clearInterval(t);},50);
})();