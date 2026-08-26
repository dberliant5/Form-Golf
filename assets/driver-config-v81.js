// FORM 8.1 — recommendation evidence strength + loft/configuration + shaft starting fit
(function(){
'use strict';
const ENG=window.FORM_DRIVER_ENGINE_V80,E=window.FORM_DRIVER_EVIDENCE_V80;
if(!ENG||!E){console.error('FORM 8.1 requires Driver Engine/Evidence 8.0');return;}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const r1=v=>Math.round(v*10)/10;
function metric(id){return state?.metrics?.[id]||{mode:'unknown',value:null};}
function quality(mode){return ({exact:1,range:.84,general:.62,unknown:0}[mode]||0);}
function answered(v){return v!==null&&v!==undefined&&v!==''&&v!=='unknown';}
function golferNow(){return typeof normalizedGolferV69==='function'?normalizedGolferV69():golfer();}
function profileStrength(){
  // Recommendation evidence must describe information that actually supports the new-head fit.
  // Current-driver satisfaction and style preference are intentionally excluded here.
  const required=[state?.start,state?.curve,state?.costly,state?.strike];
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
 const m=metric('speed'),g=golferNow();let speed=numeric('speed'),source='measured club speed';
 if(speed==null&&m.mode==='range'){speed=({'under75':72,'75-84':80,'85-89':87,'90-94':92,'95-99':97,'100-104':102,'105-109':107,'110-114':112,'115plus':118})[m.value]||null;source='reported speed range';}
 if(speed==null&&m.mode==='general'){speed=({'belowavg':82,'typical':92,'aboveavg':101,'fast':108,'veryfast':116})[m.value]||Number(g?.speed)||null;source='general speed profile';}
 if(speed==null&&Number(g?.speed)){speed=Number(g.speed);source='golfer speed profile';}
 if(speed==null)return {flex:'Speed needed',weight:'No defensible range yet',note:'FORM will not guess shaft flex or weight without usable club-speed information.'};
 let flex='Regular',weight='55–65g';if(speed<80){flex='Senior / A';weight='45–55g';}else if(speed<92){flex='Regular';weight='50–60g';}else if(speed<105){flex='Stiff';weight='55–65g';}else{flex='X-Stiff';weight='60–70g';}
 const precision=m.mode==='exact'?'':' This is intentionally broad because the speed input is not an exact measured average.';
 return {flex,weight,note:`Starting point from ${source}. Final flex/profile can move with transition, feel and delivery.${precision}`};
}
function profileInsight(g){
 const launch=classify('launch'),spin=classify('spin'),strike=g?.strike,costly=g?.costly,bits=[];
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
function componentMap(s){return Object.fromEntries((s?.components||[]).map(x=>[x.key,x]));}
function weightedDifferences(a,b){
 const A=componentMap(a),B=componentMap(b),keys=[...new Set([...Object.keys(A),...Object.keys(B)])];
 return keys.map(key=>{const x=A[key],y=B[key];if(!x||!y)return null;const delta=r1((x.impact||0)-(y.impact||0));return {key,label:x.label||y.label,delta,scoreDelta:r1((x.score||0)-(y.score||0)),weight:x.normalizedWeight||0};}).filter(Boolean).filter(x=>Math.abs(x.delta)>=.15).sort((x,y)=>Math.abs(y.delta)-Math.abs(x.delta));
}
function separation(rows){
 if(!rows?.length)return {label:'No ranking',gap:null,text:'No eligible models were available.'};
 if(rows.length===1)return {label:'Single eligible fit',gap:null,text:'Only one eligible manufacturer result remains after the fitting constraints.'};
 const gap=r1(rows[0].s.overall-rows[1].s.overall),ev=recommendationEvidence(rows[0].s);
 if(gap<1.25)return {label:'Near-tie',gap,text:`Only ${gap.toFixed(1)} Fit points separate #1 and #2. Treat them as the same testing tier unless measured performance creates separation.`};
 if(gap<2.75)return {label:'Narrow lead',gap,text:`The leader is ${gap.toFixed(1)} Fit points ahead. FORM sees a preference, not enough separation to imply a decisive performance advantage.`};
 if(ev.combined<72)return {label:'Modeled lead',gap,text:`The leader is ${gap.toFixed(1)} Fit points ahead, but evidence is still developing. The ranking is useful for test order, not a guarantee.`};
 return {label:'Meaningful lead',gap,text:`The leader is ${gap.toFixed(1)} Fit points ahead with enough recommendation support to justify testing it first.`};
}
function rewriteDistinctions(rows,cards){
 cards.forEach((card,i)=>{
   const box=card.querySelector('.result70Distinction');if(!box||!rows[i])return;
   const other=i===0?rows[1]:rows[i-1];if(!other)return;
   const lead=i===0?rows[i]:other,trail=i===0?other:rows[i],gap=r1(lead.s.overall-trail.s.overall),diff=weightedDifferences(lead.s,trail.s).filter(x=>x.delta>0).slice(0,3);
   if(gap<1.25){box.innerHTML=`<b>${i===0?'Why it is #1 — for now':'Why the club above is essentially tied'}</b><p>The gap is only ${gap.toFixed(1)} Fit points. ${diff.length?`The largest weighted separation is ${diff.map(x=>`${x.label} +${x.delta.toFixed(1)} impact`).join(' · ')}.`:'Current evidence does not support a meaningful category separation.'} Test both before treating the rank order as decisive.</p>`;return;}
   box.innerHTML=`<b>${i===0?'Why it leads':'Why the club above leads'}</b><p>${diff.length?diff.map(x=>`${x.label} +${x.delta.toFixed(1)} weighted impact`).join(' · '):`The ${gap.toFixed(1)}-point overall separation comes from several smaller weighted advantages rather than one dominant category.`}</p>`;
 });
}
function currentReliability(g){
 const cur=ENG.currentScore(g),brand=g?.currentClub?.brand,model=g?.currentClub?.model||'',clean=model.replace(/\s*\(20\d{2}\)\s*/,'').trim();
 const exact=!!(brand&&model&&products.find(p=>p.brand===brand&&(p.model===clean||p.model===model)));
 const year=E.yearFromLabel(model);
 if(cur.score==null)return {...cur,exact:false,year,label:'Insufficient benchmark',note:'FORM does not have enough product information to grade this current driver defensibly.'};
 if(exact)return {...cur,exact:true,year,label:'Direct product profile',note:'This current-driver benchmark uses the same FORM product profile used for current-generation recommendations.'};
 return {...cur,exact:false,year,label:'Limited modeled benchmark',note:`FORM inferred this ${year?year+' ':''}driver's design traits from the available model information. The score is useful for test order, not a purchase claim.`};
}
function currentContext(g){
 const labels={great:'Very well',good:'Pretty well',mixed:'Mixed',poor:'Not well'},problemLabels={distance:'not enough distance',forgiveness:'forgiveness',dispersion:'dispersion',spin_high:'too much spin',spin_low:'too little spin',launch_high:'launch too high',launch_low:'launch too low',feel:'feel / sound',looks:'looks at address'};
 const bits=[];if(labels[g?.current])bits.push(`On-course report: ${labels[g.current]}`);(g?.currentClub?.problems||[]).slice(0,3).forEach(x=>bits.push(problemLabels[x]||String(x).replace(/_/g,' ')));
 return bits;
}
function rewriteCurrentBenchmark(g,rows){
 const box=document.querySelector('.current70');if(!box)return;box.classList.add('current81Separated');const panels=[...box.children],profile=currentReliability(g),first=panels[0],upgrade=panels[1];
 const firstLabel=first?.querySelector('span');if(firstLabel)firstLabel.textContent='Current-driver benchmark — separate from Fit Score';
 const firstMeta=first?.querySelector('em');if(firstMeta){firstMeta.textContent=profile.score==null?'Not enough product evidence':profile.exact?`${profile.score.toFixed(1)} / 100 · ${profile.label}`:`≈${Math.round(profile.score)} / 100 · ${profile.label}`;}
 first?.querySelector('.currentBenchmarkNote81')?.remove();if(first){const note=document.createElement('small');note.className='currentBenchmarkNote81';note.textContent=profile.note;first.appendChild(note);const context=currentContext(g);if(context.length){const c=document.createElement('div');c.className='currentContext81';c.innerHTML=`<span>Reported experience · context only</span><b>${context.join(' · ')}</b><small>This context does not change any new-driver FORM Fit Score.</small>`;first.appendChild(c);}}
 if(!upgrade)return;
 const best=rows?.[0];if(!best||profile.score==null){upgrade.querySelector('b').textContent='Test before replacing';upgrade.querySelector('em').textContent='FORM can rank new drivers, but it cannot make a defensible upgrade claim without a usable current-driver benchmark.';return;}
 if(profile.exact)return;
 const gap=r1(best.s.overall-profile.score),wins=profile.detail?ENG.compare(best.s,profile.detail).filter(x=>x.delta>=4):[];
 const title=gap<2.5||!wins.length?'No clear modeled upgrade':'Worth a side-by-side test';
 const text=gap<2.5||!wins.length?`The modeled gap is ${gap.toFixed(1)} Fit points, and the limited historical benchmark does not support a stronger equipment claim.`:`FORM models a ${gap.toFixed(1)}-point fit advantage, but the current-driver profile is inferred rather than directly evidenced. Use this to prioritize a test—not to justify a purchase without measured validation.`;
 upgrade.querySelector('b').textContent=title;upgrade.querySelector('em').textContent=text;
}
function decorate(){
 const g=golferNow(),rows=ENG.winners(g),cards=[...document.querySelectorAll('#result80Grid .result70Card')];if(!cards.length)return;
 cards.forEach((card,i)=>{const row=rows[i];if(!row)return;const evidence=recommendationEvidence(row.s),loft=loftFit(row.p),shaft=shaftFit();card.querySelector('.fitConfig81')?.remove();const block=document.createElement('div');block.className='fitConfig81';block.innerHTML=`<div><span>Starting loft</span><b>${loft.loft.toFixed(1)}°</b><small>Test ${loft.range}. ${loft.reason}</small></div><div><span>Shaft starting point</span><b>${shaft.flex}${shaft.weight.startsWith('No ')?'':` · ${shaft.weight}`}</b><small>${shaft.weight.startsWith('No ')?shaft.weight+'. ':''}${shaft.note}</small></div><div><span>Evidence strength</span><b>${evidence.label} · ${Math.round(evidence.combined)}%</b><small>Golfer profile ${Math.round(evidence.golfer)}% · Product evidence ${Math.round(evidence.product)}%. This is support for the recommendation, not the Fit Score.</small></div>`;card.querySelector('.result70Top')?.insertAdjacentElement('afterend',block);const old=card.querySelector('.result70Top small');if(old)old.textContent=`${evidence.label} evidence · ${Math.round(evidence.combined)}%`;});
 rewriteDistinctions(rows,cards);
 const head=document.querySelector('.results70Head');if(head&&!document.getElementById('fitSummary81')){const insights=profileInsight(g),best=rows[0],bestEvidence=best?recommendationEvidence(best.s):null,sep=separation(rows);const panel=document.createElement('section');panel.id='fitSummary81';panel.className='fitSummary81';panel.innerHTML=`<div class="fitSummary81Kicker">FORM FIT ANALYSIS</div><div class="fitSummary81Grid"><div><span>Primary recommendation</span><b>${best?`${best.p.brand} ${best.p.model}`:'No eligible model'}</b><small>${best?`${best.s.overall.toFixed(1)} Fit Score · ${bestEvidence.label} evidence`:''}</small><div class="fitSeparation81"><span>Recommendation separation</span><strong>${sep.label}</strong><small>${sep.text}</small></div></div><div class="fitSummary81Narrative"><span>What FORM sees in your profile</span>${insights.length?insights.map(x=>`<p>${x}</p>`).join(''):'<p>Your answers do not point to one dominant launch, spin or strike constraint, so FORM is balancing speed, stability and directional fit.</p>'}</div></div>`;head.insertAdjacentElement('afterend',panel);}
 rewriteCurrentBenchmark(g,rows);
}
function styles(){if(document.getElementById('form81styles'))return;const s=document.createElement('style');s.id='form81styles';s.textContent=`
.fitSummary81{margin:20px 0 26px;padding:26px;border:1px solid var(--line);background:linear-gradient(180deg,#fff,#fbfbf8)}.fitSummary81Kicker{font-size:8px;letter-spacing:.18em;font-weight:900;color:var(--muted);margin-bottom:14px}.fitSummary81Grid{display:grid;grid-template-columns:minmax(250px,.85fr) minmax(0,1.7fr);gap:32px}.fitSummary81 span,.fitConfig81 span,.currentContext81 span{display:block;font-size:8px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:800}.fitSummary81 b{display:block;font-size:23px;margin:7px 0 5px}.fitSummary81 small{font-size:10px;color:var(--muted);line-height:1.5}.fitSummary81Narrative p{margin:7px 0 0;font-size:12px;line-height:1.6;color:var(--deep)}.fitSeparation81{margin-top:18px;padding-top:15px;border-top:1px solid var(--line)}.fitSeparation81 strong{display:block;margin:5px 0;font-size:13px}.fitSeparation81 small{display:block;max-width:310px}
.fitConfig81{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line);margin:14px 0}.fitConfig81>div{background:#fff;padding:14px}.fitConfig81 b{display:block;margin-top:5px;font-size:14px}.fitConfig81 small{display:block;margin-top:5px;font-size:9px;line-height:1.45;color:var(--muted)}.current81Separated{margin-top:22px;border-top:1px solid var(--line);padding-top:18px}.currentBenchmarkNote81{display:block;margin-top:8px;max-width:560px;font-size:9px;line-height:1.5;color:var(--muted)}.currentContext81{margin-top:13px;padding-top:11px;border-top:1px solid var(--line)}.currentContext81 b{display:block;margin-top:4px;font-size:10px}.currentContext81 small{display:block;margin-top:4px;font-size:9px;color:var(--muted)}.result70Breakdown span small{display:block;margin-top:2px;font-size:8px;color:var(--muted);font-weight:500}
@media(max-width:700px){.fitConfig81,.fitSummary81Grid{grid-template-columns:1fr}}
`;document.head.appendChild(s);}
styles();
const prior=window.showResults;if(typeof prior==='function')window.showResults=function(){const out=prior.apply(this,arguments);setTimeout(decorate,0);return out;};
window.FORM_DRIVER_CONFIG_V81={recommendationEvidence,loftFit,shaftFit,profileInsight,weightedDifferences,separation,currentReliability,decorate};
})();