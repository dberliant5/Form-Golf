// FORM 10.45 — configuration consistency + shaft-boundary calibration + evidence-aware upgrade language.
// This layer does not change absolute FORM Fit Scores. It keeps configuration and purchase guidance
// consistent with the same uncertainty rules used by the scoring engine.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_ALGORITHM_CALIBRATION_V145)return true;
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
    loft=Math.round(clamp(loft,8,12)*2)/2;const lo=clamp(loft-.5,8,12),hi=clamp(loft+.5,8,12);
    let reason=reasons.length?`Driven by ${reasons.slice(0,3).join(', ')}.`:'Neutral starting loft from the information provided.';
    if(ambiguousRange('launch')||ambiguousRange('spin'))reason+=' A reported range crosses a FORM fitting boundary, so that metric is not being used to force loft up or down.';
    if(conflict)reason+=' Launch and spin point in competing loft directions, so launch-monitor validation matters more than nominal loft.';
    return {loft,range:`${lo.toFixed(1)}°–${hi.toFixed(1)}°`,reason,conflict};
  }
  const rangeBounds={under75:[65,74],'75-84':[75,84],'85-89':[85,89],'90-94':[90,94],'95-99':[95,99],'100-104':[100,104],'105-109':[105,109],'110-114':[110,114],115plus:[115,125]};
  function flexAt(x){return x<80?'Senior / A':x<92?'Regular':x<105?'Stiff':'X-Stiff';}
  function weightFor(labels){
    if(labels.includes('X-Stiff'))return labels.length>1?'60–70g':'60–70g';
    if(labels.includes('Stiff'))return labels.includes('Regular')?'50–65g':'55–65g';
    if(labels.includes('Regular'))return labels.includes('Senior / A')?'45–60g':'50–60g';
    return'45–55g';
  }
  function shaftFit(){
    const m=metric('speed');let labels=[],source='club speed',note='';
    if(m.mode==='exact'&&answered(m.value)){
      const s=Number(m.value);if(!Number.isFinite(s))return {flex:'Speed needed',weight:'No defensible range yet',note:'FORM will not guess shaft flex or weight without usable club-speed information.'};
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
      if(!Number.isFinite(s))return {flex:'Speed needed',weight:'No defensible range yet',note:'FORM will not guess shaft flex or weight without usable club-speed information.'};
      labels=[flexAt(s)];source=m.mode==='general'?'general speed profile':'golfer speed profile';note=' This is a broad starting family only; transition, delivery and feel can move the final shaft materially.';
    }
    labels=[...new Set(labels)];const flex=labels.join(' / '),weight=weightFor(labels);
    return {flex,weight,note:`Starting point from ${source}.${note} Final shaft profile still requires testing.`};
  }
  function patchCards(){
    let rows;try{rows=ENG.winners(typeof normalizedGolferV69==='function'?normalizedGolferV69():golfer());}catch(e){return;}
    const cards=[...document.querySelectorAll('#result80Grid .result70Card')];
    cards.forEach((card,i)=>{
      const row=rows?.[i],cfg=card.querySelector('.fitConfig81');if(!row||!cfg)return;
      const boxes=[...cfg.children],loft=loftFit(row.p),shaft=shaftFit();
      if(boxes[0]){const b=boxes[0].querySelector('b'),small=boxes[0].querySelector('small');if(b)b.textContent=`${loft.loft.toFixed(1)}°`;if(small)small.textContent=`Test ${loft.range}. ${loft.reason}`;}
      if(boxes[1]){const b=boxes[1].querySelector('b'),small=boxes[1].querySelector('small');if(b)b.textContent=`${shaft.flex} · ${shaft.weight}`;if(small)small.textContent=shaft.note;}
    });
  }
  function patchUpgrade(){
    const box=document.querySelector('.report100Upgrade');if(!box||box.dataset.formUpgradeReliability==='inferred-current-profile')return;
    let rows;try{rows=ENG.winners(typeof normalizedGolferV69==='function'?normalizedGolferV69():golfer());}catch(e){return;}
    const best=rows?.[0];if(!best)return;
    const ev=V81.recommendationEvidence?.(best.s);if(!ev||ev.combined>=72)return;
    const title=box.querySelector('b'),text=box.querySelector('p,em');
    const existing=(title?.textContent||'').toLowerCase();
    if(existing.includes('test before replacing')||existing.includes('no clear'))return;
    if(title)title.textContent='Worth a side-by-side test';
    if(text)text.textContent=`The best new fit currently has ${Math.round(ev.combined)}% recommendation support. FORM will use it to prioritize testing, but developing evidence is not strong enough for a purchase-level upgrade claim on score separation alone.`;
    box.dataset.formUpgradeReliability='developing-new-product-evidence';
  }
  function apply(){patchCards();patchUpgrade();}
  const observer=new MutationObserver(()=>setTimeout(apply,0));observer.observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener('click',()=>setTimeout(apply,0),true);setTimeout(apply,0);
  window.FORM_DRIVER_ALGORITHM_CALIBRATION_V145={version:'10.45',classify,loftFit,shaftFit,apply};
  return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>240)clearInterval(t);},50);
})();
