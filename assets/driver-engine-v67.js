// FORM 6.9 — explainable driver compatibility + objective upgrade logic
// New-product Fit Scores depend only on golfer needs + product characteristics.
// Current-club experience is supporting context, never a shortcut to an upgrade recommendation.
(function(){
'use strict';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const r1=v=>Math.round(v*10)/10;
const pretty=v=>String(v??'').replace(/_/g,' ').replace(/\b\w/g,m=>m.toUpperCase()).replace('Two Way','Two-way');
function metricQuality(mode){return ({exact:1,range:.78,general:.55,unknown:0})[mode]||0}
function metricValue(id){return state?.metrics?.[id]||{mode:'unknown',value:null}}

function normalizedGolferV69(){
  const g=golfer(),sm=metricValue('speed'),sp=metricValue('spin'),lm=metricValue('launch');
  if(sm.mode==='range')g.speed=({'under75':72,'75-84':80,'85-89':87,'90-94':92,'95-99':97,'100-104':102,'105-109':107,'110-114':112,'115plus':118}[sm.value]||g.speed||null);
  if(sm.mode==='general')g.speed=({'belowavg':82,'typical':92,'aboveavg':101,'fast':108,'veryfast':116}[sm.value]||g.speed||null);
  if(sp.mode==='range')g.spin=({'under1500':'low','1500-1749':'low','1750-1999':'low','2000-2249':'low','2250-2499':'mid','2500-2749':'mid','2750-2999':'mid','3000-3499':'high','3500plus':'high'}[sp.value]||g.spin);
  if(sp.mode==='general')g.spin=({'verylow':'low','low':'low','mid':'mid','high':'high','veryhigh':'high'}[sp.value]||g.spin);
  if(lm.mode==='range')g.traj=({'under8':'low','8-10':'low','10-12':'low','12-14':'mid','14-16':'mid','16-18':'high','18-20':'high','20plus':'high'}[lm.value]||g.traj);
  return g;
}

function driverNeeds(g){
  const speedQ=metricQuality(metricValue('speed').mode),spinQ=metricQuality(metricValue('spin').mode),launchQ=metricQuality(metricValue('launch').mode),aoaQ=metricQuality(metricValue('aoa').mode);
  return {
    speed:g.speed||null,speedQ,spinQ,launchQ,aoaQ,
    twoWay:g.costly==='two_way'||g.strike==='varied',
    offCenter:['heel','toe','varied'].includes(g.strike),
    fade:g.curveClass==='fade_curve'||g.costly==='slice',
    draw:g.curveClass==='draw_curve'||g.costly==='hook',
    lowSpin:g.spin==='low',highSpin:g.spin==='high',lowLaunch:g.traj==='low',highLaunch:g.traj==='high',
    strike:g.strike,accuracyW:rankedWeight(g,'accuracy'),distanceW:rankedWeight(g,'distance'),flightW:rankedWeight(g,'flight'),style:g.style||'balanced'
  };
}
function component(key,label,weight,score,why){return {key,label,weight,score:clamp(score,0,100),why}}
function speedCompatibility(p,n){
  if(!n.speed)return component('speed','Speed / design window',8,82,'No measured speed supplied.');
  const [lo,hi]=p.speed_fit||[75,115],mid=(lo+hi)/2,s=n.speed;let score=100;
  if(s<lo)score-=Math.min(65,(lo-s)*4.5);else if(s>hi)score-=Math.min(65,(s-hi)*4.5);else score-=Math.abs(s-mid)*.75;
  if(p.player==='moderate_speed'&&s>=95)score-=Math.min(38,14+(s-95)*1.7);
  if(p.player==='lowspin'&&s<92)score-=14;
  return component('speed','Speed / design window',12+8*n.speedQ,score,`${s} mph versus modeled ${lo}–${hi} mph design window.`);
}
function spinCompatibility(p,n){
  if(!n.lowSpin&&!n.highSpin)return component('spin','Spin compatibility',10,84,'No clear spin problem reported.');
  let score=88;
  if(n.lowSpin){score=102-Math.max(0,3.25-(p.spin||3))*24;if((p.spin||3)<=2.2)score-=14;}
  if(n.highSpin){score=102-Math.max(0,(p.spin||3)-2.45)*22;if((p.spin||3)<=2.35)score+=4;}
  return component('spin','Spin compatibility',20+16*n.spinQ,score,n.lowSpin?'Very low reported spin makes spin preservation a primary requirement.':'High reported spin makes spin reduction a primary requirement.');
}
function launchCompatibility(p,n){
  if(!n.lowLaunch&&!n.highLaunch)return component('launch','Launch compatibility',9,84,'No clear launch problem reported.');
  let score=n.lowLaunch?66+(p.launch||3)*8:110-(p.launch||3)*8;
  return component('launch','Launch compatibility',15+10*n.launchQ,score,n.lowLaunch?'Low launch materially increases the value of launch support.':'High launch materially increases the value of flight control.');
}
function stabilityCompatibility(p,n){
  const f=p.forgiveness||3.5;let score=68+(f-3)*13;
  if(n.twoWay)score+=4;if(n.offCenter)score+=5;if(n.strike==='heel'||n.strike==='toe')score+=(f-3.5)*4;
  return component('stability','Stability / strike protection',n.offCenter||n.twoWay?28:13,score,n.offCenter?`${pretty(n.strike)} strike pattern makes off-center stability a major requirement.`:'Strike pattern does not demand unusually high stability.');
}
function directionCompatibility(p,n){
  const bias=p.draw_bias||0;let score=88;
  if(n.fade)score+=bias*11;
  if(n.draw){score-=bias*19;if(bias>=.8)score-=18;}
  return component('direction','Directional bias',n.fade||n.draw?20:8,score,n.fade?'Right-miss tendency can benefit from appropriate draw help.':n.draw?'Left-miss tendency favors neutral or fade-biased heads.':'No strong directional-bias need identified.');
}
function prioritiesCompatibility(p,n){
  let score=82,weight=9;
  if(n.accuracyW){score+=(p.forgiveness-3.5)*3.8;weight+=Math.min(8,n.accuracyW)}
  if(n.flightW){if(n.lowSpin)score+=(p.spin-2.7)*3.5;if(n.highSpin)score+=(2.8-p.spin)*3.5;if(n.lowLaunch)score+=(p.launch-3)*2.5;if(n.highLaunch)score+=(3-p.launch)*2.5;weight+=Math.min(6,n.flightW*.7)}
  if(n.distanceW&&p.player==='lowspin'&&n.highSpin)score+=5;
  return component('priorities','Stated priorities',weight,score,'Priority ranking changes secondary weighting after core fit needs.');
}
function preferenceCompatibility(p,n){return component('preference','Style preference',3,!n.style||n.style==='balanced'?85:(p.style===n.style?96:76),'Style is a tie-breaker only.');}
function interactionAdjustments(p,n){
  const out=[];
  if(n.lowSpin&&n.lowLaunch){const good=(p.spin>=2.8?1:0)+(p.launch>=4?1:0);out.push({name:'Low-spin + low-launch interaction',points:good===2?4:good===1?-2:-10,why:'Low spin and low launch compound each other.'});}
  if(n.lowSpin&&p.player==='lowspin')out.push({name:'Low-spin head conflict',points:-9,why:'A low-spin head can compound an already low-spin delivery.'});
  if((n.twoWay||n.offCenter)&&p.forgiveness>=4.7)out.push({name:'Stability interaction',points:3,why:'High stability becomes more valuable with a two-way or off-center pattern.'});
  if(n.draw&&p.draw_bias>=.8)out.push({name:'Bias conflict',points:-11,why:'Strong draw bias conflicts with a left-miss pattern.'});
  if(p.player==='moderate_speed'&&n.speed>=95)out.push({name:'Lite/Fast design mismatch',points:-9,why:'Moderate-speed lightweight design is penalized above its intended speed window.'});
  return out;
}
function evidenceAdjustment(){return {points:0,quality:'Modeled product profile',why:'Independent normalized performance testing is not yet connected, so newer clubs receive no automatic technology bonus.'};}

function scoreDriverProductV69(p,g){
  const n=driverNeeds(g),parts=[speedCompatibility(p,n),spinCompatibility(p,n),launchCompatibility(p,n),stabilityCompatibility(p,n),directionCompatibility(p,n),prioritiesCompatibility(p,n),preferenceCompatibility(p,n)];
  const hard=driverHardConstraints(p,g)||[];if(hard.length)return {overall:50,rawOverall:50,components:parts,interactions:[],hardConstraints:hard,reasons:hard,explainable:true};
  const totalW=parts.reduce((s,x)=>s+x.weight,0),weightedBase=parts.reduce((s,x)=>s+x.score*x.weight,0)/totalW;
  const mismatch=100-weightedBase,interactions=interactionAdjustments(p,n),interactionPoints=interactions.reduce((s,x)=>s+x.points,0),ev=evidenceAdjustment(p);
  // Expand meaningful differences rather than compressing every good head into 96–99.
  const calibrated=100-mismatch*1.32+interactionPoints+ev.points;
  const overall=r1(clamp(calibrated,50,99.2));
  const contributions=parts.map(x=>({...x,weightedPenalty:r1((100-x.score)*x.weight/totalW)})).sort((a,b)=>b.weightedPenalty-a.weightedPenalty);
  const strongest=parts.slice().sort((a,b)=>b.score-a.score)[0];
  const reasons=[strongest?.why,...contributions.slice(0,2).map(x=>x.why)].filter(Boolean);
  return {overall,rawOverall:r1(weightedBase),components:parts,interactions,evidence:ev,hardConstraints:[],reasons:[...new Set(reasons)],contributions,explainable:true};
}
function driverEvidenceStrengthV69(g){
  let q=0,w=0;[['speed',18],['spin',24],['launch',18],['aoa',8]].forEach(([id,wt])=>{w+=wt;q+=metricQuality(metricValue(id).mode)*wt});
  w+=32;q+=(g.start!=='varies'?5:2)+(g.curve!=='varies'?5:2)+(g.strike!=='unknown'?8:2)+(g.costly!=='other'?6:2)+(g.currentClub?.model?8:2);
  return Math.round(clamp(q/w*100,45,96));
}
function manufacturerWinners(g){
  const all=[];products.forEach(p=>{if(p.generation==='previous_limited'||!productAllowedByBrandScope(p))return;const s=scoreDriverProductV69(p,g);if(!s.hardConstraints.length)all.push({p,s})});
  const byBrand=new Map();all.sort((a,b)=>b.s.overall-a.s.overall).forEach(row=>{if(!byBrand.has(row.p.brand))byBrand.set(row.p.brand,row)});return [...byBrand.values()].sort((a,b)=>b.s.overall-a.s.overall);
}
window.FORM_DRIVER_ENGINE_V69={scoreProduct:scoreDriverProductV69,manufacturerWinners,evidenceStrength:driverEvidenceStrengthV69};
driverScoreV43=scoreDriverProductV69;driverRankV43=manufacturerWinners;driverConfidenceV43=driverEvidenceStrengthV69;confidenceAdjustedDriverScore=function(rawScore){return r1(Number(rawScore)||0)};

function virtualCurrentProduct(g){
  const exact=products.find(p=>p.brand===g.currentClub?.brand&&(p.model===g.currentClub?.model||g.currentClub?.model?.includes(p.model)));
  if(exact)return {product:{...exact},evidence:'Good',exact:true};
  const old=currentVirtualProduct(g);return old?{product:{...old,generation:'current_gamer'},evidence:'Limited — modeled historical profile',exact:false}:null;
}
function currentExperienceSignal(g){
  const signals=[];
  if(g.current==='great')signals.push('You report that the club works very well on course.');
  if(g.current==='good')signals.push('You report that the club generally works well.');
  if(g.current==='mixed')signals.push('You report mixed real-world results.');
  if(g.current==='poor')signals.push('You report poor real-world results.');
  (g.currentClub?.problems||[]).forEach(x=>signals.push(`Reported issue: ${pretty(x)}.`));
  return signals;
}
function currentDriverDiagnosticV69(g){
  const found=virtualCurrentProduct(g);
  if(!found)return {score:null,evidence:'Insufficient',reasons:['Current driver model is not identified well enough for a defensible objective fit grade.'],components:[],experience:currentExperienceSignal(g),product:null};
  const fit=scoreDriverProductV69(found.product,g);
  // Objective score only. Reported satisfaction/problems do NOT alter this number.
  const reasons=[];
  fit.contributions?.slice(0,3).forEach(x=>reasons.push(`${x.label}: ${Math.round(x.score)}/100 modeled compatibility.`));
  return {score:fit.overall,evidence:found.evidence,reasons,components:fit.components,experience:currentExperienceSignal(g),product:found.product,exact:found.exact};
}
window.currentDriverDiagnosticV69=currentDriverDiagnosticV69;currentDriverScoreV43=function(g){return currentDriverDiagnosticV69(g).score??75};

function componentMap(score){return Object.fromEntries((score?.components||[]).map(x=>[x.key,x]));}
function modeledAdvantages(newScore,currentDiag){
  if(!currentDiag?.components?.length)return [];
  const cur=componentMap({components:currentDiag.components}),next=componentMap(newScore),out=[];
  [['spin','Spin fit'],['launch','Launch fit'],['stability','Stability'],['speed','Speed/design fit'],['direction','Directional fit']].forEach(([k,label])=>{
    if(next[k]&&cur[k]){const d=r1(next[k].score-cur[k].score);if(Math.abs(d)>=4)out.push({label,delta:d});}
  });
  return out.sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta));
}
function upgradeDecision(bestScore,currentDiag,g){
  if(currentDiag.score==null)return {level:'Test before replacing',text:'FORM cannot justify replacing your current driver from product-fit data alone because its product profile is incomplete. Your reported issues are a reason to investigate, not proof that a newer club is better.'};
  const gap=r1(bestScore-currentDiag.score),experience=currentExperienceSignal(g).length>0;
  if(gap<2.5)return {level:'Keep / no clear modeled upgrade',text:`The best new fit is only ${gap.toFixed(1)} points better. FORM does not see enough objective fit improvement to recommend replacing your current head${experience?', even though you reported issues with it':''}.`};
  if(gap<5.5)return {level:'Worth a side-by-side test',text:`The best new fit has a ${gap.toFixed(1)}-point modeled fit advantage. That is enough to test, but not enough to assume newer equipment will perform better without measured validation.`};
  return {level:'Strong fit-based upgrade opportunity',text:`The best new fit has a ${gap.toFixed(1)}-point objective compatibility advantage. FORM still recommends validating performance, but the product-fit case for change is meaningful.`};
}
upgradeMagnitudeV43=function(delta,currentScore,conf){
  if(delta<2.5)return {level:'Keep / no clear modeled upgrade',text:'The modeled fit gap is too small to justify replacing a well-matched current driver simply because a newer model exists.'};
  if(delta<5.5)return {level:'Worth a side-by-side test',text:'There is a modeled fit advantage, but FORM would want measured performance confirmation before recommending a purchase.'};
  return {level:'Strong fit-based upgrade opportunity',text:'The new head is materially better aligned with the golfer profile. Newness alone does not create this recommendation.'};
};

driverTradeoffs=function(p,g,currentScore){
  const score=scoreDriverProductV69(p,g).overall,delta=currentScore==null?null:r1(score-currentScore);
  return [['Forgiveness',p.forgiveness>=4.7?'Excellent':p.forgiveness>=4?'Strong':'Moderate'],['Launch',p.launch>=4?'Higher':p.launch<=2.5?'Lower':'Mid'],['Spin',p.spin<=2?'Low':p.spin>=3.4?'Higher':'Mid'],['Fit vs. current',delta==null?'—':`${delta>0?'+':''}${delta.toFixed(1)}`]];
};

// Golfer-facing review: no machine labels or raw enum strings.
if(typeof renderReview==='function'){
  const baseReview=renderReview;
  renderReview=function(){
    baseReview();document.querySelectorAll('#step9 .quality').forEach(x=>x.remove());
    document.querySelectorAll('#step9 .reviewRow b').forEach(el=>{
      const txt=el.textContent.trim();
      if(txt&&!/^[0-9.+°/% -]+$/.test(txt))el.textContent=pretty(txt);
    });
  };
}

function fitBreakdownHTML(score){
  const wanted=['spin','stability','speed','launch','direction'],m=componentMap(score);
  return `<div class="fitBreakdown">${wanted.filter(k=>m[k]).map(k=>`<div><span>${m[k].label}</span><b>${Math.round(m[k].score)}</b></div>`).join('')}</div>`;
}

const priorShowResults=showResults;
showResults=function(){
  priorShowResults();
  try{
    const g=driverProfile(normalizedGolferV69()),current=currentDriverDiagnosticV69(g),rows=manufacturerWinners(g),best=rows[0];
    const currentCard=document.querySelector('#keep .currentFitCard');
    if(currentCard){
      currentCard.querySelector('.numericGrade')?.replaceChildren(document.createTextNode(current.score==null?'Provisional':`${current.score.toFixed(1)}/100`));
      const oldExpl=currentCard.querySelector('.fitExplanation');if(oldExpl)oldExpl.innerHTML=`Objective fit grade based on the current head’s modeled characteristics versus your golfer profile. <b>Your reported satisfaction does not change this score.</b>`;
      currentCard.querySelector('.currentDiagnostic')?.remove();
      currentCard.insertAdjacentHTML('beforeend',`<div class="currentDiagnostic"><div class="eyebrow">Objective current-club assessment</div>${current.reasons.length?`<ul>${current.reasons.map(x=>`<li>${x}</li>`).join('')}</ul>`:''}<p><b>Product evidence:</b> ${current.evidence}.</p>${current.experience.length?`<div class="experienceSignal"><b>Your experience — context, not score:</b><span>${current.experience.join(' ')}</span></div>`:''}</div>`);
    }
    const upgrade=document.querySelector('#keep .upgradeSummary');
    if(upgrade&&best){const d=upgradeDecision(best.s.overall,current,g);upgrade.querySelector('h3').textContent=d.level;const txt=upgrade.querySelector('.fitExplanation');if(txt)txt.textContent=d.text;}

    const cards=[...document.querySelectorAll('#resultList .driverVerdict')];
    cards.forEach((card,i)=>{
      const row=rows[i];if(!row)return;
      card.querySelector('.recRank').textContent=i===0?'#1 manufacturer winner':`#${i+1} manufacturer winner`;
      card.querySelector('.fitBreakdown')?.remove();card.querySelector('.modeledComparison')?.remove();
      const engineReason=card.querySelector('.engineReason');
      if(engineReason)engineReason.insertAdjacentHTML('beforebegin',fitBreakdownHTML(row.s));
      const adv=modeledAdvantages(row.s,current);
      const positives=adv.filter(x=>x.delta>0),negatives=adv.filter(x=>x.delta<0);
      const comparison=current.score==null
        ? `<b>Versus current:</b> Current-head product data is not strong enough for a defensible attribute-by-attribute claim.`
        : positives.length
          ? `<b>Modeled advantages vs. current:</b> ${positives.slice(0,3).map(x=>`${x.label} +${x.delta.toFixed(1)}`).join(' · ')}${negatives.length?`<br><b>Tradeoff:</b> ${negatives.slice(0,2).map(x=>`${x.label} ${x.delta.toFixed(1)}`).join(' · ')}`:''}`
          : `<b>Versus current:</b> FORM does not identify a meaningful modeled attribute advantage. A newer release alone is not an upgrade case.`;
      card.insertAdjacentHTML('beforeend',`<div class="modeledComparison">${comparison}</div>`);
    });
  }catch(e){console.warn('FORM 6.9 result explanation enhancement',e)}
};
})();