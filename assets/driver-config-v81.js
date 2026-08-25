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
function golferNow(){return typeof normalizedGolferV69==='function'?normalizedGolferV69():golfer();}
function profileStrength(){
  const required=[state?.start,state?.curve,state?.costly,state?.strike,state?.style,state?.current];
  const base=required.filter(answered).length/required.length;
  if(state?.lm==='none'||!state?.lm)return clamp(.62+.25*base,0,1);
  const core=['speed','spin','aoa','launch'];
  const mq=core.map(id=>{const m=metric(id);return m.mode==='unknown'?.18:quality(m.mode)*(answered(m.value)?1:.35)});
  return clamp(.58*base+.42*(mq.reduce((a,b)=>a+b,0)/mq.length),0,1);
}
function recommendationEvidence(s){
  const golfer=profileStrength(),product=clamp(Number(s?.evidenceQuality)||0,0,1),productSupport=.45+.55*product,combined=clamp(.58*golfer+.42*productSupport,0,1);
  let label=combined>=.85?'Strong':combined>=.72?'Good':combined>=.60?'Developing':'Limited';
  if(productSupport<.75&&label==='Strong')label='Good';
  if(golfer<.70&&['Strong','Good'].includes(label))label='Developing';
  return {golfer:r1(golfer*100),product:r1(productSupport*100),combined:r1(combined*100),label};
}
function numeric(id){const m=metric(id);return m.mode==='exact'&&answered(m.value)?Number(m.value):null;}
function classify(id){
 const m=metric(id);if(!m||m.mode==='unknown'||!answered(m.value))return null;
 if(id==='spin'){if(m.mode==='exact')return +m.value<2100?'low':+m.value>3000?'high':'mid';if(m.mode==='range')return ['under1500','1500-1749','1750-1999','2000-2249'].includes(m.value)?'low':['3000-3499','3500plus'].includes(m.value)?'high':'mid';return ['verylow','low'].includes(m.value)?'low':['high','veryhigh'].includes(m.value)?'high':m.value==='varies'?'varies':'mid';}
 if(id==='launch'){if(m.mode==='exact')return +m.value<11?'low':+m.value>17?'high':'mid';if(m.mode==='range')return ['under8','8-10','10-12'].includes(m.value)?'low':['16-18','18-20','20plus'].includes(m.value)?'high':'mid';return ['verylow','low'].includes(m.value)?'low':['high','veryhigh'].includes(m.value)?'high':m.value==='varies'?'varies':'mid';}
 return null;
}
function loftFit(p){
 const launch=classify('launch'),spin=classify('spin'),aoa=numeric('aoa');let loft=10.5,reasons=[],conflict=false;
 if(launch==='low'){loft+=1;reasons.push('lower launch');}else if(launch==='high'){loft-=1;reasons.push('higher launch');}
 if(spin==='low'){loft+=.5;reasons.push('lower spin');}else if(spin==='high'){loft-=.5;reasons.push('higher spin');}
 conflict=(launch==='low'&&spin==='high')||(launch==='high'&&spin==='low');
 if(aoa!=null&&aoa<=-2){loft+=.5;reasons.push('downward attack angle');}else if(aoa!=null&&aoa>=4){loft-=.5;reasons.push('upward attack angle');}
 if(p?.player==='lowspin')loft+=.5;
 loft=Math.round(clamp(loft,8,12)*2)/2;const lo=clamp(loft-.5,8,12),hi=clamp(loft+.5,8,12);
 let reason=reasons.length?`Driven by ${reasons.slice(0,3).join(', ')}.`:'Neutral starting loft from the information provided.';
 if(conflict)reason+=' Launch and spin point in competing loft directions, so launch-monitor validation matters more than the nominal loft.';
 return {loft,range:`${lo.toFixed(1)}°–${hi.toFixed(1)}°`,reason,conflict};
}
function shaftFit(){
 const m=metric('speed');let speed=numeric('speed');if(speed==null&&m.mode==='range')speed=({'under75':72,'75-84':80,'85-89':87,'90-94':92,'95-99':97,'100-104':102,'105-109':107,'110-114':112,'115plus':118})[m.value]||null;
 if(speed==null)return {flex:'Speed needed',weight:'No defensible range yet',note:'FORM will not guess shaft flex or weight without usable club-speed information.'};
 let flex='Regular',weight='55–65g';if(speed<80){flex='Senior / A';weight='45–55g';}else if(speed<92){flex='Regular';weight='50–60g';}else if(speed<105){flex='Stiff';weight='55–65g';}else{flex='X-Stiff';weight='60–70g';}
 return {flex,weight,note:'Starting point from club speed. Final flex/profile can move with transition, feel and delivery.'};
}
function profileInsight(g){
 const launch=classify('launch'),spin=classify('spin'),strike=g?.strike,costly=g?.costly;
 const bits=[];
 if(launch==='low'&&spin==='low')bits.push('Your delivery is a low-launch / low-spin profile, so FORM is prioritizing launch and spin preservation rather than chasing another low-spin head.');
 else if(launch==='high'&&spin==='high')bits.push('Your delivery is a high-launch / high-spin profile, so flight control and spin reduction carry more weight than raw forgiveness alone.');
 else if(launch==='low'&&spin==='high')bits.push('Your launch and spin are moving in opposite fitting directions, which makes configuration validation especially important.');
 else if(launch==='high'&&spin==='low')bits.push('Your high-launch / low-spin combination is unusual enough that FORM avoids forcing a simplistic loft-only correction.');
 if(strike==='toe')bits.push('Toe contact makes toe-side speed retention and stability more valuable than generic MOI claims.');
 else if(strike==='heel')bits.push('Heel contact makes heel-side retention and directional stability especially relevant.');
 else if(strike==='varied')bits.push('Across-face strike variability increases the value of stability and retention over a single center-strike speed number.');
 if(costly==='two_way')bits.push('A two-way miss reduces the value of strongly draw-biased heads because correcting one side can worsen the other.');
 return bits.slice(0,2);
}
function decorate(){
 const g=golferNow(),rows=ENG.winners(g),cards=[...document.querySelectorAll('#result80Grid .result70Card')];
 if(!cards.length)return;
 cards.forEach((card,i)=>{
   const row=rows[i];if(!row)return;const evidence=recommendationEvidence(row.s),loft=loftFit(row.p),shaft=shaftFit();
   card.querySelector('.fitConfig81')?.remove();
   const block=document.createElement('div');block.className='fitConfig81';block.innerHTML=`<div><span>Starting loft</span><b>${loft.loft.toFixed(1)}°</b><small>Test ${loft.range}. ${loft.reason}</small></div><div><span>Shaft starting point</span><b>${shaft.flex}${shaft.weight.startsWith('No ')?'':` · ${shaft.weight}`}</b><small>${shaft.weight.startsWith('No ')?shaft.weight+'. ':''}${shaft.note}</small></div><div><span>Evidence strength</span><b>${evidence.label} · ${Math.round(evidence.combined)}%</b><small>Golfer profile ${Math.round(evidence.golfer)}% · Product evidence ${Math.round(evidence.product)}%. This is support for the recommendation, not the Fit Score.</small></div>`;
   card.querySelector('.result70Top')?.insertAdjacentElement('afterend',block);
   const old=card.querySelector('.result70Top small');if(old)old.textContent=`${evidence.label} evidence · ${Math.round(evidence.combined)}%`;
 });
 const head=document.querySelector('.results70Head');if(head&&!document.getElementById('fitSummary81')){
   const insights=profileInsight(g),best=rows[0],bestEvidence=best?recommendationEvidence(best.s):null;
   const panel=document.createElement('section');panel.id='fitSummary81';panel.className='fitSummary81';panel.innerHTML=`<div class="fitSummary81Kicker">FORM FIT ANALYSIS</div><div class="fitSummary81Grid"><div><span>Primary recommendation</span><b>${best?`${best.p.brand} ${best.p.model}`:'No eligible model'}</b><small>${best?`${best.s.overall.toFixed(1)} Fit Score · ${bestEvidence.label} evidence`:''}</small></div><div class="fitSummary81Narrative"><span>What FORM sees in your profile</span>${insights.length?insights.map(x=>`<p>${x}</p>`).join(''):'<p>Your answers do not point to one dominant launch, spin or strike constraint, so FORM is balancing speed, stability and directional fit.</p>'}</div></div>`;
   head.insertAdjacentElement('afterend',panel);
 }
 const current=document.querySelector('.current70');if(current){current.classList.add('current81Separated');const first=current.querySelector('span');if(first)first.textContent='Current-driver benchmark — separate from Fit Score';}
}
function styles(){if(document.getElementById('form81styles'))return;const s=document.createElement('style');s.id='form81styles';s.textContent=`
.fitSummary81{margin:20px 0 26px;padding:24px;border:1px solid var(--line);background:linear-gradient(180deg,#fff,#fbfbf8)}.fitSummary81Kicker{font-size:8px;letter-spacing:.18em;font-weight:900;color:var(--muted);margin-bottom:14px}.fitSummary81Grid{display:grid;grid-template-columns:minmax(230px,.8fr) minmax(0,1.7fr);gap:28px}.fitSummary81 span,.fitConfig81 span{display:block;font-size:8px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:800}.fitSummary81 b{display:block;font-size:23px;margin:7px 0 5px}.fitSummary81 small{font-size:10px;color:var(--muted)}.fitSummary81Narrative p{margin:7px 0 0;font-size:12px;line-height:1.55;color:var(--deep)}
.fitConfig81{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line);margin:14px 0}.fitConfig81>div{background:#fff;padding:14px}.fitConfig81 b{display:block;margin-top:5px;font-size:14px}.fitConfig81 small{display:block;margin-top:5px;font-size:9px;line-height:1.45;color:var(--muted)}.current81Separated{margin-top:22px;border-top:1px solid var(--line);padding-top:18px}
@media(max-width:700px){.fitConfig81,.fitSummary81Grid{grid-template-columns:1fr}}
`;document.head.appendChild(s);}
styles();
const prior=window.showResults;
if(typeof prior==='function')window.showResults=function(){const out=prior.apply(this,arguments);setTimeout(decorate,0);return out;};
window.FORM_DRIVER_CONFIG_V81={recommendationEvidence,loftFit,shaftFit,profileInsight,decorate};
})();