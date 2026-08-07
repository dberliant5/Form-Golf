// FORM 6.7 — explainable driver compatibility engine
// Purpose: one golfer-needs model for prospective and current drivers.
// Current club never changes a new product's Fit Score. It is used only for upgrade advice.
(function(){
'use strict';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const r1=v=>Math.round(v*10)/10;

function metricQuality(mode){return ({exact:1,range:.78,general:.55,unknown:0})[mode]||0}
function metricValue(id){return state?.metrics?.[id]||{mode:'unknown',value:null}}

function driverNeeds(g){
  const speedQ=metricQuality(metricValue('speed').mode);
  const spinQ=metricQuality(metricValue('spin').mode);
  const launchQ=metricQuality(metricValue('launch').mode);
  const aoaQ=metricQuality(metricValue('aoa').mode);
  const twoWay=g.costly==='two_way'||g.strike==='varied';
  const offCenter=['heel','toe','varied'].includes(g.strike);
  const fade=g.curveClass==='fade_curve'||g.costly==='slice';
  const draw=g.curveClass==='draw_curve'||g.costly==='hook';
  const lowSpin=g.spin==='low', highSpin=g.spin==='high';
  const lowLaunch=g.traj==='low', highLaunch=g.traj==='high';
  return {
    speed:g.speed||null,speedQ,spinQ,launchQ,aoaQ,twoWay,offCenter,fade,draw,lowSpin,highSpin,lowLaunch,highLaunch,
    strike:g.strike,accuracyW:rankedWeight(g,'accuracy'),distanceW:rankedWeight(g,'distance'),flightW:rankedWeight(g,'flight'),
    style:g.style||'balanced'
  };
}

function component(label,weight,score,why){return {label,weight,score:clamp(score,0,100),why}}
function speedCompatibility(p,n){
  if(!n.speed)return component('Speed / design window',10,82,'No measured speed supplied; speed compatibility is lightly weighted.');
  const [lo,hi]=p.speed_fit||[75,115],mid=(lo+hi)/2,s=n.speed;
  let score=100;
  if(s<lo)score-=Math.min(55,(lo-s)*4.2);
  else if(s>hi)score-=Math.min(55,(s-hi)*4.2);
  else score-=Math.abs(s-mid)*.65;
  if(p.player==='moderate_speed'&&s>=95)score-=Math.min(32,12+(s-95)*1.5);
  if(p.player==='lowspin'&&s<95)score-=12;
  return component('Speed / design window',12+8*n.speedQ,score,`Reported speed ${s} mph versus modeled ${lo}–${hi} mph design window.`);
}
function spinCompatibility(p,n){
  if(!n.lowSpin&&!n.highSpin)return component('Spin compatibility',12,84,'No clear spin problem reported.');
  let score=88;
  if(n.lowSpin){score=100-Math.max(0,3.1-(p.spin||3))*18; if((p.spin||3)<=2)score-=18;}
  if(n.highSpin){score=100-Math.max(0,(p.spin||3)-2.5)*16; if((p.spin||3)<=2.4)score+=5;}
  return component('Spin compatibility',18+15*n.spinQ,score,n.lowSpin?'Low reported spin makes spin preservation a major fit requirement.':'High reported spin increases the value of lower-spin head behavior.');
}
function launchCompatibility(p,n){
  if(!n.lowLaunch&&!n.highLaunch)return component('Launch compatibility',10,84,'No clear launch problem reported.');
  let score=88;
  if(n.lowLaunch)score=72+(p.launch||3)*6;
  if(n.highLaunch)score=106-(p.launch||3)*7;
  return component('Launch compatibility',14+10*n.launchQ,score,n.lowLaunch?'Low launch increases the value of launch support.':'High launch increases the value of flight control.');
}
function stabilityCompatibility(p,n){
  const f=p.forgiveness||3.5;
  let score=76+(f-3)*9;
  if(n.twoWay)score+=6;
  if(n.offCenter)score+=5;
  if(n.strike==='heel'||n.strike==='toe')score+=(f-3.5)*3;
  return component('Stability / strike protection',n.offCenter||n.twoWay?26:14,score,n.offCenter?`${n.strike} strike pattern makes off-center stability a major requirement.`:'Strike pattern does not demand unusually high stability.');
}
function directionCompatibility(p,n){
  const bias=p.draw_bias||0;
  let score=88;
  if(n.fade)score+=bias*10;
  if(n.draw)score-=bias*16;
  if(n.draw&&bias>=.8)score-=18;
  return component('Directional bias',n.fade||n.draw?19:9,score,n.fade?'Right-miss pattern can benefit from measured draw help, but not at the expense of other needs.':n.draw?'Left-miss pattern strongly favors neutral/fade-biased heads.':'No strong directional-bias need identified.');
}
function prioritiesCompatibility(p,n){
  let score=82,weight=10;
  if(n.accuracyW){score+=(p.forgiveness-3.5)*3.2;weight+=Math.min(8,n.accuracyW)}
  if(n.flightW){if(n.lowSpin)score+=(p.spin-2.7)*3;if(n.highSpin)score+=(2.8-p.spin)*3;if(n.lowLaunch)score+=(p.launch-3)*2;if(n.highLaunch)score+=(3-p.launch)*2;weight+=Math.min(6,n.flightW*.7)}
  if(n.distanceW&&p.player==='lowspin'&&n.highSpin)score+=5;
  return component('Stated priorities',weight,score,'Priority ranking changes secondary weighting after core compatibility needs are addressed.');
}
function preferenceCompatibility(p,n){
  if(!n.style||n.style==='balanced')return component('Style preference',3,85,'No strong style preference.');
  return component('Style preference',4,p.style===n.style?96:76,'Style is a tie-breaker only and cannot override performance compatibility.');
}

function interactionAdjustments(p,n){
  const out=[];
  if(n.lowSpin&&n.lowLaunch){
    const good=(p.spin>=2.7?1:0)+(p.launch>=4?1:0);
    out.push({name:'Low-spin + low-launch interaction',points:good===2?5:good===1?0:-8,why:'Compounding low spin and low launch is treated more seriously than either signal alone.'});
  }
  if(n.lowSpin&&p.player==='lowspin')out.push({name:'Low-spin head conflict',points:-8,why:'A low-spin head can compound an already low-spin delivery.'});
  if((n.twoWay||n.offCenter)&&p.forgiveness>=4.7)out.push({name:'Stability interaction',points:3,why:'High stability becomes more valuable with a two-way or off-center pattern.'});
  if(n.draw&&p.draw_bias>=.8)out.push({name:'Bias conflict',points:-10,why:'Strong draw bias conflicts with a left-miss pattern.'});
  if(p.player==='moderate_speed'&&n.speed>=95)out.push({name:'Lite/Fast design mismatch',points:-8,why:'Moderate-speed lightweight design is penalized when reported speed is materially above its intended window.'});
  return out;
}

function evidenceAdjustment(p){
  // Neutral today. This is the future hook for normalized independent testing.
  // Do not assign points until licensed/owned evidence is loaded and normalized.
  return {points:0,quality:'Modeled product profile',why:'Independent performance-test normalization is not yet connected, so no outside-test bonus or penalty is applied.'};
}

function scoreDriverProductV67(p,g){
  const n=driverNeeds(g);
  const parts=[speedCompatibility(p,n),spinCompatibility(p,n),launchCompatibility(p,n),stabilityCompatibility(p,n),directionCompatibility(p,n),prioritiesCompatibility(p,n),preferenceCompatibility(p,n)];
  const hard=driverHardConstraints(p,g)||[];
  if(hard.length)return {overall:50,rawOverall:50,components:parts,interactions:[],hardConstraints:hard,reasons:hard,explainable:true};
  const totalW=parts.reduce((s,x)=>s+x.weight,0),base=parts.reduce((s,x)=>s+x.score*x.weight,0)/totalW;
  const interactions=interactionAdjustments(p,n),interactionPoints=interactions.reduce((s,x)=>s+x.points,0);
  const ev=evidenceAdjustment(p);
  // Keep top-end spacing. No hard 98/99.5 plateau.
  let raw=base+interactionPoints+ev.points;
  if(raw>96)raw=96+(raw-96)*.35;
  const overall=r1(clamp(raw,50,99.4));
  const reasons=parts.slice().sort((a,b)=>b.weight*(b.score-75)-a.weight*(a.score-75)).slice(-3).map(x=>x.why);
  return {overall,rawOverall:r1(base),components:parts,interactions,evidence:ev,hardConstraints:[],reasons,explainable:true};
}

// Confidence affects displayed certainty, not the intrinsic model fit. The product Fit Score
// remains player + product only. Data completeness is exposed separately.
function driverEvidenceStrengthV67(g){
  let q=0,w=0;
  [['speed',18],['spin',24],['launch',18],['aoa',8]].forEach(([id,wt])=>{w+=wt;q+=metricQuality(metricValue(id).mode)*wt});
  w+=32;q+=(g.start!=='varies'?5:2)+(g.curve!=='varies'?5:2)+(g.strike!=='unknown'?8:2)+(g.costly!=='other'?6:2)+(g.currentClub?.model?8:2);
  return Math.round(clamp(q/w*100,45,96));
}

function manufacturerWinners(g){
  const all=[];
  products.forEach(p=>{
    if(p.generation==='previous_limited'||!productAllowedByBrandScope(p))return;
    const s=scoreDriverProductV67(p,g);if(!s.hardConstraints.length)all.push({p,s});
  });
  const byBrand=new Map();
  all.sort((a,b)=>b.s.overall-a.s.overall).forEach(row=>{if(!byBrand.has(row.p.brand))byBrand.set(row.p.brand,row)});
  return [...byBrand.values()].sort((a,b)=>b.s.overall-a.s.overall);
}

window.FORM_DRIVER_ENGINE_V67={scoreProduct:scoreDriverProductV67,manufacturerWinners,evidenceStrength:driverEvidenceStrengthV67};
driverScoreV43=scoreDriverProductV67;
driverRankV43=manufacturerWinners;
driverConfidenceV43=driverEvidenceStrengthV67;
// No confidence penalty to intrinsic Fit Score.
confidenceAdjustedDriverScore=function(rawScore){return r1(Number(rawScore)||0)};

function virtualCurrentProduct(g){
  const exact=products.find(p=>p.brand===g.currentClub?.brand&&(p.model===g.currentClub?.model||g.currentClub?.model?.includes(p.model)));
  if(exact)return {...exact};
  const old=currentVirtualProduct(g);return old?{...old,generation:'current_gamer'}:null;
}
function currentDriverDiagnosticV67(g){
  const p=virtualCurrentProduct(g);
  if(!p)return {score:72,evidence:'Limited',reasons:['Current driver model is not identified well enough for a defensible product-fit grade.'],components:[]};
  const fit=scoreDriverProductV67(p,g);
  let score=fit.overall,reasons=[];
  // Real-world evidence can refine the current-club grade because the golfer actually owns it.
  // It does not affect any new-product Fit Score.
  if(g.current==='great'){score+=2;reasons.push('Your reported on-course experience is strongly positive.')}
  if(g.current==='good'){score+=.8;reasons.push('Your reported on-course experience is generally positive.')}
  if(g.current==='mixed'){score-=2;reasons.push('Mixed on-course results reduce confidence in the current fit.')}
  if(g.current==='poor'){score-=5;reasons.push('Poor on-course results are meaningful evidence against the current fit.')}
  (g.currentClub?.problems||[]).forEach(x=>{if(x==='spin_low'){score-=3;reasons.push('You report too little spin with this club.')}else if(x==='spin_high'){score-=3;reasons.push('You report too much spin with this club.')}else if(x==='dispersion'||x==='forgiveness'){score-=2.5;reasons.push('You report a forgiveness/dispersion problem with this club.')}else score-=1});
  if(g.spin==='low'&&p.spin<=2.4){score-=5;reasons.push('Your low reported spin conflicts with this head’s lower-spin profile.')}
  if(g.spin==='high'&&p.spin>=3.4){score-=4;reasons.push('Your high reported spin conflicts with this head’s higher-spin profile.')}
  if(['heel','toe','varied'].includes(g.strike)&&p.forgiveness<4){score-=4;reasons.push(`${g.strike} strike pattern is not well protected by the modeled forgiveness profile.`)}
  if(g.traj==='low'&&p.launch<=2.7){score-=4;reasons.push('Low reported launch is compounded by a lower-launch head profile.')}
  if(g.traj==='high'&&p.launch>=4.4){score-=3;reasons.push('High reported launch is compounded by a higher-launch head profile.')}
  score=r1(clamp(score,50,99));
  const evidence=g.currentClub?.model?'Good':'Limited';
  return {score,evidence,reasons:[...new Set(reasons)].slice(0,5),components:fit.components,product:p};
}
window.currentDriverDiagnosticV67=currentDriverDiagnosticV67;
currentDriverScoreV43=function(g){return currentDriverDiagnosticV67(g).score};

// Current club comparison is separate from prospective-product Fit Scores.
driverTradeoffs=function(p,g,currentScore){
  const score=scoreDriverProductV67(p,g).overall,delta=currentScore==null?null:r1(score-currentScore);
  return [['Forgiveness',p.forgiveness>=4.7?'Excellent':p.forgiveness>=4?'Strong':'Moderate'],['Launch',p.launch>=4?'Higher':p.launch<=2.5?'Lower':'Mid'],['Spin',p.spin<=2?'Low':p.spin>=3.4?'Higher':'Mid'],['Fit vs. current',delta==null?'—':`${delta>0?'+':''}${delta.toFixed(1)}`]];
};

// Remove debugging provenance chips from the review page; keep only golfer-facing answers.
if(typeof renderReview==='function'){
  const baseReview=renderReview;
  renderReview=function(){baseReview();document.querySelectorAll('#step9 .quality').forEach(x=>x.remove());};
}

// Add current-driver diagnostic explanation after the existing result renderer runs.
const priorShowResults=showResults;
showResults=function(){
  priorShowResults();
  try{
    const g=driverProfile((typeof normalizedGolfer==='function'?normalizedGolfer():golfer()));
    const d=currentDriverDiagnosticV67(g),card=document.querySelector('#keep .currentFitCard');
    if(card&&d.reasons.length){card.insertAdjacentHTML('beforeend',`<div class="currentDiagnostic"><div class="eyebrow">Why your current driver grades this way</div><ul>${d.reasons.map(x=>`<li>${x}</li>`).join('')}</ul><p>Current-driver fit uses the same player/product compatibility engine as new clubs, plus your actual experience with this club. It does not alter any new driver’s Fit Score.</p></div>`)}
    document.querySelectorAll('#resultList .driverVerdict').forEach((card,i)=>{const label=card.querySelector('.recRank');if(label)label.textContent=i===0?'#1 manufacturer winner':`#${i+1} manufacturer winner`});
  }catch(e){console.warn('FORM 6.7 diagnostic enhancement',e)}
};

})();