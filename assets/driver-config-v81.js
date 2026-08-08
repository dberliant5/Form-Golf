// FORM 8.1 — recommendation evidence strength + loft/configuration + shaft starting fit
(function(){
'use strict';
const ENG=window.FORM_DRIVER_ENGINE_V80, E=window.FORM_DRIVER_EVIDENCE_V80;
if(!ENG||!E){console.error('FORM 8.1 requires Driver Engine/Evidence 8.0');return;}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const r1=v=>Math.round(v*10)/10;
function metric(id){return state?.metrics?.[id]||{mode:'unknown',value:null};}
function quality(mode){return ({exact:1,range:.84,general:.62,unknown:0}[mode]||0);}
function answered(v){return v!==null&&v!==undefined&&v!==''&&v!=='unknown';}
function profileStrength(){
  const required=[state?.start,state?.curve,state?.costly,state?.strike,state?.style,state?.current];
  let base=required.filter(answered).length/required.length;
  if(state?.lm==='none'||!state?.lm)return clamp(.62+.25*base,0,1);
  const core=['speed','spin','aoa','launch'];
  const mq=core.map(id=>{const m=metric(id);return m.mode==='unknown'?.18:quality(m.mode)*(answered(m.value)?1:.35)});
  const technical=mq.reduce((a,b)=>a+b,0)/mq.length;
  return clamp(.58*base+.42*technical,0,1);
}
function recommendationEvidence(s){
  const golfer=profileStrength();
  const product=clamp(Number(s?.evidenceQuality)||0,0,1);
  // Recommendation support requires both sides, but complete golfer data should not be confused
  // with sparse product evidence. Product evidence has a floor because FORM's catalog/model itself
  // is usable evidence even before independent testing is connected.
  const productSupport=.45+.55*product;
  const combined=clamp(.58*golfer+.42*productSupport,0,1);
  return {golfer:r1(golfer*100),product:r1(productSupport*100),combined:r1(combined*100),label:combined>=.85?'Strong':combined>=.72?'Good':combined>=.60?'Developing':'Limited'};
}
function numeric(id){const m=metric(id);return m.mode==='exact'&&answered(m.value)?Number(m.value):null;}
function classify(id){
 const m=metric(id);if(!m||m.mode==='unknown'||!answered(m.value))return null;
 if(id==='spin'){if(m.mode==='exact')return +m.value<2100?'low':+m.value>3000?'high':'mid';if(m.mode==='range')return ['under1500','1500-1749','1750-1999','2000-2249'].includes(m.value)?'low':['3000-3499','3500plus'].includes(m.value)?'high':'mid';return ['verylow','low'].includes(m.value)?'low':['high','veryhigh'].includes(m.value)?'high':m.value==='varies'?'varies':'mid';}
 if(id==='launch'){if(m.mode==='exact')return +m.value<11?'low':+m.value>17?'high':'mid';if(m.mode==='range')return ['under8','8-10','10-12'].includes(m.value)?'low':['16-18','18-20','20plus'].includes(m.value)?'high':'mid';return ['verylow','low'].includes(m.value)?'low':['high','veryhigh'].includes(m.value)?'high':m.value==='varies'?'varies':'mid';}
 return null;
}
function loftFit(p){
 const launch=classify('launch'),spin=classify('spin'),aoa=numeric('aoa');let loft=10.5,reasons=[];
 if(launch==='low'){loft+=1;reasons.push('lower reported launch');}else if(launch==='high'){loft-=1;reasons.push('higher reported launch');}
 if(spin==='low'){loft+=.5;reasons.push('low reported spin');}else if(spin==='high'){loft-=.5;reasons.push('high reported spin');}
 if(aoa!=null&&aoa<=-2){loft+=.5;reasons.push('downward attack angle');}else if(aoa!=null&&aoa>=4){loft-=.5;reasons.push('upward attack angle');}
 if(p?.player==='lowspin')loft+=.5;
 loft=Math.round(clamp(loft,8,12)*2)/2;
 // We do not yet have configuration inventory for every head, so present this as starting loft.
 const lo=clamp(loft-.5,8,12),hi=clamp(loft+.5,8,12);
 return {loft,range:`${lo.toFixed(1)}°–${hi.toFixed(1)}°`,reason:reasons.length?`Driven by ${reasons.slice(0,3).join(', ')}.`:'A neutral starting loft based on the information provided.'};
}
function shaftFit(){
 const m=metric('speed');let speed=numeric('speed');if(speed==null&&m.mode==='range')speed=({'under75':72,'75-84':80,'85-89':87,'90-94':92,'95-99':97,'100-104':102,'105-109':107,'110-114':112,'115plus':118})[m.value]||null;
 let flex='Regular',weight='55–65g',note='Starting recommendation; shaft flex is not standardized across manufacturers.';
 if(speed!=null){if(speed<80){flex='Senior / A';weight='45–55g';}else if(speed<92){flex='Regular';weight='50–60g';}else if(speed<105){flex='Stiff';weight='55–65g';}else{flex='X-Stiff';weight='60–70g';}}
 return {flex,weight,note};
}
function decorate(){
 document.querySelectorAll('#resultList .driverVerdict').forEach((card,i)=>{
   const rows=ENG.winners(typeof normalizedGolferV69==='function'?normalizedGolferV69():golfer());const row=rows[i];if(!row)return;
   const evidence=recommendationEvidence(row.s),loft=loftFit(row.p),shaft=shaftFit();
   card.querySelector('.fitConfig81')?.remove();
   const block=document.createElement('div');block.className='fitConfig81';block.innerHTML=`<div><span>Recommended starting loft</span><b>${loft.loft.toFixed(1)}°</b><small>Test window ${loft.range}. ${loft.reason}</small></div><div><span>Shaft starting point</span><b>${shaft.flex} · ${shaft.weight}</b><small>${shaft.note}</small></div><div><span>Evidence strength</span><b>${evidence.label} · ${Math.round(evidence.combined)}%</b><small>Golfer profile ${Math.round(evidence.golfer)}% · Product evidence ${Math.round(evidence.product)}%. This measures support for the recommendation, not fit quality.</small></div>`;
   const top=card.querySelector('.verdictTop');top?.insertAdjacentElement('afterend',block);
   const badge=card.querySelector('.evidenceBadge');if(badge)badge.textContent=`${evidence.label} evidence · ${Math.round(evidence.combined)}%`;
 });
}
function styles(){if(document.getElementById('form81styles'))return;const s=document.createElement('style');s.id='form81styles';s.textContent=`.fitConfig81{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line);margin:14px 0}.fitConfig81>div{background:#fff;padding:14px}.fitConfig81 span{display:block;font-size:8px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:800}.fitConfig81 b{display:block;margin-top:5px;font-size:14px}.fitConfig81 small{display:block;margin-top:5px;font-size:9px;line-height:1.45;color:var(--muted)}@media(max-width:700px){.fitConfig81{grid-template-columns:1fr}}`;document.head.appendChild(s);}
styles();
const prior=window.showResults;
if(typeof prior==='function')window.showResults=function(){const out=prior.apply(this,arguments);setTimeout(decorate,0);return out;};
window.FORM_DRIVER_CONFIG_V81={recommendationEvidence,loftFit,shaftFit,decorate};
})();