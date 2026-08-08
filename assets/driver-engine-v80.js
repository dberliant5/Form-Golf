// FORM 8.0 — evidence-driven driver scorer
(function(){
'use strict';

const E=window.FORM_DRIVER_EVIDENCE_V80;
if(!E){console.error('FORM 8.0 evidence model missing');return;}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const r1=v=>Math.round(v*10)/10;
const val=(ev,dim,fallback=80)=>ev?.dimensions?.[dim]?.value??fallback;
const conf=(ev,dim)=>ev?.dimensions?.[dim]?.confidence??0;
const metric=id=>state?.metrics?.[id]||{mode:'unknown',value:null};
const q=mode=>({exact:1,range:.82,general:.58,unknown:0}[mode]||0);

function golfer80(){return typeof normalizedGolferV69==='function'?normalizedGolferV69():golfer();}
function exactOrMid(id){
  const m=metric(id);if(!m||m.mode==='unknown'||m.value==null)return null;if(m.mode==='exact')return Number(m.value)||null;
  const maps={speed:{'under75':72,'75-84':80,'85-89':87,'90-94':92,'95-99':97,'100-104':102,'105-109':107,'110-114':112,'115plus':118},ballSpeed:{'under120':115,'120-129':125,'130-139':135,'140-149':145,'150-159':155,'160-169':165,'170plus':175},carry:{'under180':170,'180-199':190,'200-219':210,'220-239':230,'240-259':250,'260-279':270,'280plus':290}};
  return maps[id]?.[m.value]||null;
}
function classifyMetric(id){
  const m=metric(id);if(!m||m.mode==='unknown'||m.value==null)return null;
  if(id==='spin'){
    if(m.mode==='exact'){const x=+m.value;return x<2100?'low':x>3000?'high':'mid';}
    if(m.mode==='range'){if(['under1500','1500-1749','1750-1999','2000-2249'].includes(m.value))return'low';if(['3000-3499','3500plus'].includes(m.value))return'high';return'mid';}
    if(m.value==='varies')return'varies';return ['verylow','low'].includes(m.value)?'low':['high','veryhigh'].includes(m.value)?'high':'mid';
  }
  if(id==='launch'){
    if(m.mode==='exact'){const x=+m.value;return x<11?'low':x>17?'high':'mid';}
    if(m.mode==='range'){if(['under8','8-10','10-12'].includes(m.value))return'low';if(['16-18','18-20','20plus'].includes(m.value))return'high';return'mid';}
    if(m.value==='varies')return'varies';return ['verylow','low'].includes(m.value)?'low':['high','veryhigh'].includes(m.value)?'high':'mid';
  }
  return null;
}
function needProfile(g){
  const speed=g.speed||exactOrMid('speed');const bs=exactOrMid('ballSpeed');const carry=exactOrMid('carry');const smash=speed&&bs?bs/speed:null;
  const spin=classifyMetric('spin')||g.spin||null,launch=classifyMetric('launch')||g.traj||null;
  const problems=g.currentClub?.problems||[];
  return {speed,bs,carry,smash,spin,launch,spinVar:spin==='varies'||problems.includes('spin_varied'),launchVar:launch==='varies'||problems.includes('launch_varied'),strike:g.strike,offCenter:['toe','heel','varied'].includes(g.strike),twoWay:g.costly==='two_way'||g.strike==='varied',fade:g.curveClass==='fade_curve'||g.costly==='slice'||g.costly==='right',draw:g.curveClass==='draw_curve'||g.costly==='hook'||g.costly==='left',speedQ:q(metric('speed').mode),spinQ:q(metric('spin').mode),launchQ:q(metric('launch').mode),ballQ:q(metric('ballSpeed').mode),carryQ:q(metric('carry').mode)};
}
function part(key,label,weight,score,explanation,evidenceConfidence){return {key,label,weight:Math.max(0,weight),score:r1(clamp(score,0,100)),explanation,evidenceConfidence:r1(clamp(evidenceConfidence||0,0,1))};}

function spinPart(p,n,ev){
  if(n.spinVar){const s=val(ev,'spinConsistency');return part('spin','Spin consistency',26+12*n.spinQ,s,'Your spin varies, so FORM values a head that keeps spin more stable across strike locations.',conf(ev,'spinConsistency'));}
  if(n.spin==='low'){const support=val(ev,'spinSupport'),cons=val(ev,'spinConsistency');return part('spin','Spin fit',24+16*n.spinQ,support*.75+cons*.25,'Your low-spin profile puts a premium on preserving enough spin and avoiding large strike-to-strike drops.',conf(ev,'spinSupport')*.7+conf(ev,'spinConsistency')*.3);}
  if(n.spin==='high'){const red=val(ev,'spinReduction'),cons=val(ev,'spinConsistency');return part('spin','Spin fit',24+16*n.spinQ,red*.78+cons*.22,'Your high-spin profile rewards heads that reduce excess spin without becoming unstable across the face.',conf(ev,'spinReduction')*.75+conf(ev,'spinConsistency')*.25);}
  return part('spin','Spin fit',10,78+(val(ev,'spinConsistency')-75)*.18,'No major spin problem was identified, so FORM keeps this category lower-weight.',conf(ev,'spinConsistency'));
}
function launchPart(p,n,ev){
  if(n.launchVar){const s=val(ev,'launchConsistency');return part('launch','Launch consistency',17+8*n.launchQ,s,'Your launch varies, so consistency matters more than targeting a single launch window.',conf(ev,'launchConsistency'));}
  if(n.launch==='low'){return part('launch','Launch fit',18+10*n.launchQ,val(ev,'launchSupport'),'Your lower launch increases the value of a head that adds launch without creating other conflicts.',conf(ev,'launchSupport'));}
  if(n.launch==='high'){return part('launch','Launch fit',18+10*n.launchQ,val(ev,'launchControl'),'Your higher launch increases the value of a head that controls flight.',conf(ev,'launchControl'));}
  return part('launch','Launch fit',9,80+(val(ev,'launchConsistency')-75)*.15,'No major launch problem was identified.',conf(ev,'launchConsistency'));
}
function strikePart(p,n,ev){
  let s=val(ev,'stability'),label='Stability';let c=conf(ev,'stability');
  if(n.strike==='toe'){s=s*.42+val(ev,'toeRetention')*.58;label='Toe-strike protection';c=c*.4+conf(ev,'toeRetention')*.6;}
  else if(n.strike==='heel'){s=s*.42+val(ev,'heelRetention')*.58;label='Heel-strike protection';c=c*.4+conf(ev,'heelRetention')*.6;}
  else if(n.strike==='varied'){s=s*.5+(val(ev,'toeRetention')+val(ev,'heelRetention'))*.25;label='Across-face stability';c=(c+conf(ev,'toeRetention')+conf(ev,'heelRetention'))/3;}
  const w=n.offCenter||n.twoWay?30:14;
  return part('strike',label,w,s,n.offCenter?`Your ${n.strike} strike pattern makes off-center stability and speed retention a major requirement.`:'Your strike pattern does not require maximum off-center help.',c);
}
function speedPart(p,n,ev){
  const sw=ev?.dimensions?.speedWindow||{lo:p.speed_fit?.[0]||75,hi:p.speed_fit?.[1]||115,confidence:.6};
  let s=88;if(n.speed){if(n.speed<sw.lo)s-=Math.min(35,(sw.lo-n.speed)*4.2);else if(n.speed>sw.hi)s-=Math.min(35,(n.speed-sw.hi)*4.2);else {const center=(sw.lo+sw.hi)/2;s=96-Math.abs(n.speed-center)*.65;}s=s*.78+val(ev,'speedPotential')*.22;}else s=80+(val(ev,'speedPotential')-75)*.2;
  return part('speed','Speed / design fit',n.speed?18+8*n.speedQ:8,s,n.speed?`${n.speed} mph is evaluated against this model's intended speed window and speed-potential evidence.`:'Club speed is unknown, so this category carries less weight.',Math.max(sw.confidence||0,conf(ev,'speedPotential')));
}
function directionPart(p,n,ev){
  if(n.fade)return part('direction','Directional fit',20,val(ev,'drawHelp'),'Your right-miss pattern gives value to appropriate draw help, but FORM still penalizes excessive correction elsewhere.',conf(ev,'drawHelp'));
  if(n.draw)return part('direction','Directional fit',20,val(ev,'neutralBias'),'Your left-miss pattern rewards a neutral head rather than added draw bias.',conf(ev,'neutralBias'));
  return part('direction','Directional fit',8,(val(ev,'neutralBias')+82)/2,'No dominant directional miss was identified.',conf(ev,'neutralBias'));
}
function efficiencyPart(p,n,ev){
  if(!n.smash&&!n.offCenter)return part('efficiency','Ball-speed retention',5,val(ev,'speedPotential'),'Ball speed was not supplied and strike is relatively neutral, so this remains secondary.',conf(ev,'speedPotential'));
  let relevant=n.strike==='toe'?val(ev,'toeRetention'):n.strike==='heel'?val(ev,'heelRetention'):(val(ev,'toeRetention')+val(ev,'heelRetention'))/2;
  relevant=relevant*.65+val(ev,'speedPotential')*.35;
  let w=n.offCenter?16:8;if(n.smash&&n.smash<1.43)w+=7;
  return part('efficiency','Ball-speed retention',w,relevant,n.smash?`Your reported club/ball-speed relationship (${n.smash.toFixed(2)}) increases the value of retaining speed on imperfect contact.`:'Your off-center strike pattern makes ball-speed retention relevant even without a measured ball-speed average.',(conf(ev,'toeRetention')+conf(ev,'heelRetention')+conf(ev,'speedPotential'))/3);
}
function carryPart(p,n,ev){
  if(!n.carry||!n.speed)return null;
  const ypm=n.carry/n.speed;let s=82;const launchNeed=n.launch==='low'?val(ev,'launchSupport'):n.launch==='high'?val(ev,'launchControl'):80;const spinNeed=n.spin==='low'?val(ev,'spinSupport'):n.spin==='high'?val(ev,'spinReduction'):80;s=launchNeed*.45+spinNeed*.4+val(ev,'speedPotential')*.15;if(ypm>=2.4&&ypm<=2.75)s=(s+90)/2;
  return part('carry','Carry efficiency',6+5*n.carryQ,s,`Carry (${n.carry} yd) is used only as a supporting output check, not as a stand-alone distance target.`,(conf(ev,'launchSupport')+conf(ev,'spinSupport')+conf(ev,'speedPotential'))/3);
}

function scoreOne(p,g){
  const n=needProfile(g),ev=E.evidenceFor(p),hard=typeof driverHardConstraints==='function'?driverHardConstraints(p,g):[];
  if(hard?.length)return {overall:50,components:[],hardConstraints:hard,evidence:ev};
  const parts=[spinPart(p,n,ev),strikePart(p,n,ev),speedPart(p,n,ev),directionPart(p,n,ev),launchPart(p,n,ev),efficiencyPart(p,n,ev),carryPart(p,n,ev)].filter(Boolean);
  const totalW=parts.reduce((a,x)=>a+x.weight,0);const base=parts.reduce((a,x)=>a+x.score*x.weight,0)/totalW;
  // Evidence confidence limits false precision without flattening model differences.
  const evidenceQ=parts.reduce((a,x)=>a+x.evidenceConfidence*x.weight,0)/totalW;
  const neutralPull=(1-evidenceQ)*3.5;const adjusted=base>82?base-neutralPull:base;
  const overall=r1(clamp(100-(100-adjusted)*1.22,45,99.2));
  const contributions=parts.map(x=>({...x,impact:r1((x.score-80)*x.weight/totalW)}));
  const strengths=contributions.slice().sort((a,b)=>b.impact-a.impact);const weaknesses=contributions.slice().sort((a,b)=>a.impact-b.impact);
  return {overall,raw:r1(base),evidenceQuality:r1(evidenceQ),components:parts,strengths,weaknesses,hardConstraints:[],evidence:ev};
}
function winners(g){
  const rows=[];products.forEach(p=>{if(p.generation==='previous_limited')return;if(typeof productAllowedByBrandScope==='function'&&!productAllowedByBrandScope(p))return;const s=scoreOne(p,g);if(!s.hardConstraints.length)rows.push({p,s});});
  rows.sort((a,b)=>b.s.overall-a.s.overall);const by=new Map();rows.forEach(r=>{if(!by.has(r.p.brand))by.set(r.p.brand,r)});return [...by.values()].sort((a,b)=>b.s.overall-a.s.overall);
}
function currentProduct(g){
  const brand=g.currentClub?.brand,modelLabel=g.currentClub?.model||'';if(!brand||!modelLabel)return null;const clean=modelLabel.replace(/\s*\(20\d{2}\)\s*/,'').trim();const exact=products.find(p=>p.brand===brand&&(p.model===clean||p.model===modelLabel));if(exact)return {p:exact,label:modelLabel,exact:true};
  if(typeof currentVirtualProduct==='function'){const vp=currentVirtualProduct(g);if(vp)return {p:vp,label:modelLabel,exact:false};}
  return null;
}
function currentScore(g){
  const found=currentProduct(g);if(!found)return {score:null,detail:null,label:'Insufficient product data'};let detail=scoreOne(found.p,g);
  if(!found.exact){const year=E.yearFromLabel(found.label);const era=E.eraEvidence(year||2018);detail={...detail,evidence:{...detail.evidence,era}};}
  return {score:detail.overall,detail,label:found.exact?'Exact model profile':'Historical modeled profile'};
}
function compare(a,b){
  if(!a?.components||!b?.components)return[];const B=Object.fromEntries(b.components.map(x=>[x.key,x]));return a.components.map(x=>({key:x.key,label:x.label,delta:r1(x.score-(B[x.key]?.score??x.score))})).filter(x=>Math.abs(x.delta)>=2).sort((x,y)=>Math.abs(y.delta)-Math.abs(x.delta));
}
function recommendation(best,current){
  if(!best)return {level:'No recommendation',text:'No eligible current-generation driver remained after your constraints.'};if(current.score==null)return {level:'Test before replacing',text:'FORM can rank new drivers for your profile, but it cannot make a defensible upgrade claim without enough product information about your current driver.'};
  const gap=r1(best.s.overall-current.score),diff=compare(best.s,current.detail),wins=diff.filter(x=>x.delta>=4);if(gap<2.5||wins.length===0)return {level:'No clear equipment upgrade',text:`The best new fit is ${gap.toFixed(1)} points ahead, but FORM does not see enough meaningful category improvement to call the change an upgrade.`};if(gap<6)return {level:'Worth a side-by-side test',text:`The ${gap.toFixed(1)}-point modeled advantage is driven mainly by ${wins.slice(0,2).map(x=>x.label.toLowerCase()).join(' and ')}.`};return {level:'Strong upgrade candidate',text:`FORM sees a ${gap.toFixed(1)}-point fit advantage, led by ${wins.slice(0,3).map(x=>x.label.toLowerCase()).join(', ')}.`};
}
function evidenceLabel(s){return s.evidenceQuality>=.62?'Good evidence':s.evidenceQuality>=.45?'Developing evidence':'Modeled / limited evidence';}

window.FORM_DRIVER_ENGINE_V80={scoreOne,winners,currentScore,compare};
driverScoreV43=(p,g)=>scoreOne(p,g);driverRankV43=g=>winners(g);currentDriverScoreV43=g=>currentScore(g).score??75;

showResults=function(){
  const results=document.getElementById('results');
  try{
    const g=golfer80(),rows=winners(g),cur=currentScore(g),best=rows[0],decision=recommendation(best,cur);
    step=10;document.querySelectorAll('#driverExperience .step').forEach(x=>x.classList.add('hidden'));results.classList.remove('hidden');const nav=document.getElementById('flowNav');if(nav)nav.style.display='none';document.getElementById('progressBar').style.width='100%';document.getElementById('stepCount').textContent='FIT COMPLETE';
    const currentName=[g.currentClub?.brand,g.currentClub?.model].filter(Boolean).join(' ')||'Current driver';
    results.innerHTML=`<div class="results70Head"><div><div class="eyebrow">Your Driver Fit</div><h2>Best-fitting head from each manufacturer.</h2><p>FORM scores each model on the categories that matter to your profile. Model-specific evidence is weighted by source quality; unknown performance is not invented.</p></div></div><div class="current70"><div><span>Current driver</span><b>${currentName}</b><em>${cur.score==null?'Not enough product evidence':cur.score.toFixed(1)+' / 100 · '+cur.label}</em></div><div><span>Upgrade recommendation</span><b>${decision.level}</b><em>${decision.text}</em></div></div><div id="result80Grid" class="result70Grid"></div>`;
    const grid=document.getElementById('result80Grid');
    grid.innerHTML=rows.slice(0,5).map((row,i)=>{
      const prev=i?rows[i-1]:null,rankDiff=prev?compare(row.s,prev.s):[],curDiff=cur.detail?compare(row.s,cur.detail):[];const wins=curDiff.filter(x=>x.delta>0).slice(0,3),losses=curDiff.filter(x=>x.delta<0).slice(0,2);const strongest=row.s.strengths.slice(0,2),weak=row.s.weaknesses[0];
      const distinction=i===0?(rows[1]?compare(row.s,rows[1].s).filter(x=>x.delta>0).slice(0,3):[]):rankDiff.filter(x=>x.delta<0).slice(0,3);
      return `<article class="result70Card ${i===0?'winner':''}"><div class="result70Top"><div><span class="result70Rank">${i===0?'#1 overall':'#'+(i+1)}</span><h3>${row.p.brand} ${row.p.model}</h3><small>${evidenceLabel(row.s)} · evidence ${Math.round(row.s.evidenceQuality*100)}%</small></div><div class="result70Score">${row.s.overall.toFixed(1)}<small>Fit / 100</small></div></div><div class="result70Why"><b>Why it fits you</b>${strongest.map(x=>`<p><span>${x.label}</span>${x.score.toFixed(1)}/100 — ${x.explanation}</p>`).join('')}</div><div class="result70Breakdown">${row.s.components.map(x=>`<div><span>${x.label}</span><b>${x.score.toFixed(1)}</b></div>`).join('')}</div><div class="result70Distinction"><b>${i===0?'Why it leads':'Why the club above leads'}</b><p>${distinction.length?distinction.map(x=>`${x.label} ${x.delta>0?'+':''}${x.delta.toFixed(1)}`).join(' · '):(weak?`${weak.label} is the biggest limiter in this fit.`:'The evidence does not justify a larger distinction.')}</p></div><div class="result70Current"><b>Compared with your current driver</b><p>${wins.length?`Modeled advantages: ${wins.map(x=>`${x.label} +${x.delta.toFixed(1)}`).join(' · ')}`:'FORM does not identify a meaningful modeled category advantage.'}</p>${losses.length?`<p class="tradeoff">Tradeoffs: ${losses.map(x=>`${x.label} ${x.delta.toFixed(1)}`).join(' · ')}</p>`:''}</div></article>`;
    }).join('');
    try{saveFit('driver',{title:'Driver Fit',engine:'8.0',topMatch:best?`${best.p.brand} ${best.p.model}`:'',topScore:best?.s.overall||null,currentClub:currentName,currentScore:cur.score,upgrade:decision.level})}catch(e){}
    window.scrollTo({top:0,left:0,behavior:'auto'});
  }catch(err){console.error('FORM 8.0 results error',err);results.classList.remove('hidden');results.innerHTML=`<div class="dataStrengthNote"><b>Result error</b><span>${String(err?.message||err)}</span></div>`;}
};
})();
