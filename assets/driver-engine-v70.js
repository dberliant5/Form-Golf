// FORM 7.0 — granular, need-weighted driver engine
// Adds technology-capability scoring, ball-speed/carry diagnostics, wider score separation,
// and explicit recommendation distinctions. New-product Fit Scores never depend on current-club satisfaction.
(function(){
'use strict';

const clamp70=(v,a,b)=>Math.max(a,Math.min(b,v));
const r170=v=>Math.round(v*10)/10;
const q70=mode=>({exact:1,range:.78,general:.55,unknown:0}[mode]||0);
const metric70=id=>state?.metrics?.[id]||{mode:'unknown',value:null};
const pretty70=v=>String(v??'').replace(/_/g,' ').replace(/\b\w/g,m=>m.toUpperCase()).replace('Two Way','Two-way');

// Manufacturer-documented current-generation capability signals. Scores are deliberately
// broad ordinal mappings, not claims of measured cross-brand superiority.
const DOCUMENTED_CAPS_70={
  'TaylorMade|Qi4D Max':{faceRetention:4.8,spinConsistency:4.9,stability:4.8,adjustability:4.9,aeroSpeed:4.5,source:'Documented: improved roll radius for vertical-strike spin consistency, Carbon Twist Face heel/toe dispersion protection, adjustable TAS weights.'},
  'TaylorMade|Qi4D':{faceRetention:4.7,spinConsistency:4.9,stability:4.3,adjustability:5.0,aeroSpeed:4.8,source:'Documented: aerodynamic redesign, vertical-strike spin consistency, heel/toe dispersion protection and four TAS weights.'},
  'PING|G440 K':{faceRetention:4.7,spinConsistency:4.4,stability:5.0,adjustability:4.6,aeroSpeed:4.4,source:'Documented: PING record-setting combined MOI, faster ball speed and CG-shifting adjustability.'},
  'Titleist|GTS2':{faceRetention:4.8,spinConsistency:4.5,stability:4.9,adjustability:4.8,aeroSpeed:4.7,source:'Documented: Speed Sync Face, maximum stability, faster aerodynamics and dual weighting.'},
  'Callaway|Quantum Max':{faceRetention:4.6,spinConsistency:4.5,stability:4.7,adjustability:4.6,aeroSpeed:4.5,source:'Documented as total-performance head for speed, consistent tee shots, forgiveness and control; neutral/draw weighting.'}
};

function modelYear70(model){const m=String(model||'').match(/\((20\d{2})\)/);return m?Number(m[1]):null;}
function eraCaps70(year){
  // Conservative fallback prior: progress is applied by technology era, not a linear point-per-year bonus.
  if(!year||year>=2025)return {faceRetention:4.55,spinConsistency:4.5,stability:4.55,adjustability:4.55,aeroSpeed:4.5,era:'2025–26 era'};
  if(year>=2023)return {faceRetention:4.3,spinConsistency:4.25,stability:4.3,adjustability:4.35,aeroSpeed:4.25,era:'2023–24 era'};
  if(year>=2020)return {faceRetention:4.0,spinConsistency:3.95,stability:4.0,adjustability:4.05,aeroSpeed:4.0,era:'2020–22 era'};
  if(year>=2017)return {faceRetention:3.55,spinConsistency:3.45,stability:3.6,adjustability:3.7,aeroSpeed:3.6,era:'2017–19 era'};
  return {faceRetention:3.15,spinConsistency:3.0,stability:3.2,adjustability:3.3,aeroSpeed:3.2,era:'pre-2017 era'};
}
function productCaps70(p,modelLabel){
  const key=`${p?.brand||''}|${p?.model||''}`;
  if(DOCUMENTED_CAPS_70[key])return {...DOCUMENTED_CAPS_70[key],evidence:'Model-specific documented capability'};
  const year=modelYear70(modelLabel)||modelYear70(p?.model)||((p?.generation==='current'||p?.generation==='current_special')?2026:null);
  return {...eraCaps70(year),evidence:'Conservative technology-era prior',source:'No normalized model-specific cross-brand performance dataset is connected yet.'};
}

function initExtraMetrics70(){
  state.metrics=state.metrics||{};
  ['ballSpeed','carry','total'].forEach(id=>{if(!state.metrics[id])state.metrics[id]={mode:'unknown',value:null};});
}
initExtraMetrics70();

function extraValue70(id){
  const m=metric70(id); if(m.mode==='unknown'||m.value==null||m.value==='')return null;
  if(m.mode==='exact')return Number(m.value)||null;
  const maps={
    ballSpeed:{'under120':115,'120-129':125,'130-139':135,'140-149':145,'150-159':155,'160-169':165,'170plus':175},
    carry:{'under180':170,'180-199':190,'200-219':210,'220-239':230,'240-259':250,'260-279':270,'280plus':290},
    total:{'under200':190,'200-219':210,'220-239':230,'240-259':250,'260-279':270,'280-299':290,'300plus':310}
  };
  return maps[id]?.[m.value]||null;
}

function extraMetricCard70(id,label,unit,placeholder,ranges){
  const m=metric70(id),mode=m.mode||'unknown';
  const exact=`<input class="metric70Input" data-extra70-input="${id}" type="number" inputmode="decimal" placeholder="${placeholder}" value="${mode==='exact'&&m.value!=null?m.value:''}"><span class="metric70Unit">${unit}</span>`;
  const range=`<select class="metric70Range" data-extra70-range="${id}"><option value="">Choose range</option>${ranges.map(([v,l])=>`<option value="${v}" ${mode==='range'&&m.value===v?'selected':''}>${l}</option>`).join('')}</select>`;
  return `<div class="metricBox metric70Box"><div class="metricTop"><h3>${label}</h3><span class="metric70Optional">Optional</span></div><div class="metric70Answer">${mode==='exact'?exact:mode==='range'?range:'<div class="metric70Unknown">Not used in the fit</div>'}<select class="metricModeSelect metric70Mode" data-extra70-mode="${id}"><option value="exact" ${mode==='exact'?'selected':''}>Exact number</option><option value="range" ${mode==='range'?'selected':''}>Approx. range</option><option value="unknown" ${mode==='unknown'?'selected':''}>Don’t know</option></select></div></div>`;
}
function bindExtraMetrics70(){
  document.querySelectorAll('[data-extra70-mode]').forEach(el=>el.onchange=()=>{const id=el.dataset.extra70Mode;state.metrics[id]={mode:el.value,value:null};renderLMInputs();});
  document.querySelectorAll('[data-extra70-input]').forEach(el=>el.oninput=()=>{const id=el.dataset.extra70Input,v=Number(el.value);state.metrics[id].value=Number.isFinite(v)?v:null;});
  document.querySelectorAll('[data-extra70-range]').forEach(el=>el.onchange=()=>{state.metrics[el.dataset.extra70Range].value=el.value||null;});
}
if(typeof renderLMInputs==='function'){
  const baseLM70=renderLMInputs;
  renderLMInputs=function(){
    baseLM70(); initExtraMetrics70();
    const box=document.getElementById('lmInputs'); if(!box||state.lm==='none')return;
    const extra=document.createElement('div');extra.className='metric70Extras';
    extra.innerHTML=`<div class="metric70Intro"><b>Useful performance outputs</b><span>These are optional. Ball speed can reveal strike efficiency; carry helps FORM check whether launch/spin are translating into usable distance. Total distance is lower-weight because course conditions affect rollout.</span></div>${extraMetricCard70('ballSpeed','Ball speed','mph','e.g. 143',[['under120','Under 120'],['120-129','120–129'],['130-139','130–139'],['140-149','140–149'],['150-159','150–159'],['160-169','160–169'],['170plus','170+']])}${extraMetricCard70('carry','Carry distance','yds','e.g. 235',[['under180','Under 180'],['180-199','180–199'],['200-219','200–219'],['220-239','220–239'],['240-259','240–259'],['260-279','260–279'],['280plus','280+']])}${extraMetricCard70('total','Total distance','yds','e.g. 255',[['under200','Under 200'],['200-219','200–219'],['220-239','220–239'],['240-259','240–259'],['260-279','260–279'],['280-299','280–299'],['300plus','300+']])}`;
    box.appendChild(extra);bindExtraMetrics70();
  };
}

function golfer70(){return typeof normalizedGolferV69==='function'?normalizedGolferV69():golfer();}
function needs70(g){
  const bs=extraValue70('ballSpeed'),carry=extraValue70('carry'),total=extraValue70('total'),speed=g.speed||null;
  const smash=(bs&&speed)?bs/speed:null;
  return {
    speed,ballSpeed:bs,carry,total,smash,
    speedQ:q70(metric70('speed').mode),spinQ:q70(metric70('spin').mode),launchQ:q70(metric70('launch').mode),aoaQ:q70(metric70('aoa').mode),
    ballSpeedQ:q70(metric70('ballSpeed').mode),carryQ:q70(metric70('carry').mode),totalQ:q70(metric70('total').mode),
    lowSpin:g.spin==='low',highSpin:g.spin==='high',lowLaunch:g.traj==='low',highLaunch:g.traj==='high',
    offCenter:['heel','toe','varied'].includes(g.strike),twoWay:g.costly==='two_way'||g.strike==='varied',strike:g.strike,
    fade:g.curveClass==='fade_curve'||g.costly==='slice',draw:g.curveClass==='draw_curve'||g.costly==='hook',
    accuracyW:rankedWeight(g,'accuracy'),distanceW:rankedWeight(g,'distance'),flightW:rankedWeight(g,'flight'),style:g.style||'balanced'
  };
}
function comp70(key,label,weight,score,why){return {key,label,weight,score:clamp70(score,0,100),why};}
function speed70(p,n){
  if(!n.speed)return comp70('speed','Speed / design fit',8,82,'No club-speed number supplied.');
  const [lo,hi]=p.speed_fit||[75,115],mid=(lo+hi)/2;let s=100;
  if(n.speed<lo)s-=(lo-n.speed)*5;else if(n.speed>hi)s-=(n.speed-hi)*5;else s-=Math.abs(n.speed-mid)*.85;
  if(p.player==='moderate_speed'&&n.speed>=95)s-=16+(n.speed-95)*2;
  if(p.player==='lowspin'&&n.speed<92)s-=14;
  return comp70('speed','Speed / design fit',12+8*n.speedQ,s,`${n.speed} mph compared with this head's modeled speed window.`);
}
function spin70(p,n,caps){
  if(!n.lowSpin&&!n.highSpin)return comp70('spin','Spin compatibility',11,84,'No strong spin problem identified.');
  let s=88;
  if(n.lowSpin){s=104-Math.max(0,3.3-(p.spin||3))*27;s+=(caps.spinConsistency-4)*5;if((p.spin||3)<=2.2)s-=15;}
  if(n.highSpin){s=104-Math.max(0,(p.spin||3)-2.4)*24;s+=(caps.spinConsistency-4)*4;if((p.spin||3)<=2.3)s+=4;}
  return comp70('spin','Spin compatibility',22+17*n.spinQ,s,n.lowSpin?'Low spin makes spin preservation and consistency a primary requirement.':'High spin makes spin reduction and consistency a primary requirement.');
}
function launch70(p,n){
  if(!n.lowLaunch&&!n.highLaunch)return comp70('launch','Launch compatibility',9,84,'No strong launch problem identified.');
  const s=n.lowLaunch?62+(p.launch||3)*9:112-(p.launch||3)*9;
  return comp70('launch','Launch compatibility',15+11*n.launchQ,s,n.lowLaunch?'Low launch increases the value of launch support.':'High launch increases the value of flight control.');
}
function stability70(p,n,caps){
  const f=p.forgiveness||3.5;let s=64+(f-3)*14+(caps.stability-4)*7+(caps.faceRetention-4)*5;
  if(n.offCenter)s+=5;if(n.twoWay)s+=4;
  return comp70('stability','Stability / strike protection',n.offCenter||n.twoWay?30:13,s,n.offCenter?`${pretty70(n.strike)} contact increases the value of MOI and off-center speed retention.`:'Strike pattern does not demand maximum stability.');
}
function direction70(p,n){
  const bias=p.draw_bias||0;let s=88;
  if(n.fade)s+=bias*12;
  if(n.draw){s-=bias*20;if(bias>=.8)s-=18;}
  return comp70('direction','Directional fit',n.fade||n.draw?20:8,s,n.fade?'Right-miss pattern can benefit from appropriate draw help.':n.draw?'Left-miss pattern favors neutral/fade-biased setup.':'No strong directional-bias requirement.');
}
function efficiency70(p,n,caps){
  if(!n.smash)return comp70('efficiency','Ball-speed efficiency',3,84,'Ball speed was not supplied.');
  const low=n.smash<1.43,mid=n.smash<1.47;let s=80+(caps.faceRetention-3.5)*9+(caps.aeroSpeed-3.5)*5+(p.forgiveness-3.5)*4;
  if(!low&&!mid)s=86+(caps.aeroSpeed-4)*5;
  return comp70('efficiency','Ball-speed efficiency',low?15:mid?9:5,s,`Reported ball speed implies a ${n.smash.toFixed(2)} speed ratio; ${low?'retaining speed on imperfect contact matters more':'efficiency appears reasonably healthy'}.`);
}
function carry70(p,n,caps){
  if(!n.carry||!n.speed)return comp70('carry','Carry efficiency',2,84,'Carry was not supplied or cannot be normalized without club speed.');
  // Conservative diagnostic: carry is not used as a launch-monitor replacement.
  const carryPerMph=n.carry/n.speed;let s=84;
  if(carryPerMph<2.25){s=76+(p.launch-3)*3+(p.spin-2.5)*2+(caps.faceRetention-4)*3;}
  else if(carryPerMph>2.65)s=88;
  return comp70('carry','Carry efficiency',5+5*n.carryQ,s,`Carry is ${n.carry} yards at ${n.speed} mph (${carryPerMph.toFixed(2)} yds per mph); this is a supporting diagnostic, not a stand-alone fit target.`);
}
function technology70(p,n,caps){
  let weight=7;
  if(n.offCenter||n.twoWay)weight+=7;
  if(n.lowSpin||n.highSpin)weight+=5;
  if(n.smash&&n.smash<1.45)weight+=5;
  const relevant=(caps.faceRetention*0.28+caps.spinConsistency*0.24+caps.stability*0.24+caps.adjustability*0.12+caps.aeroSpeed*0.12);
  const score=52+relevant*10;
  return comp70('technology','Technology relevant to your needs',weight,score,`${caps.evidence}: ${caps.source}`);
}
function priorities70(p,n){
  let s=82,w=8;if(n.accuracyW){s+=(p.forgiveness-3.5)*4;w+=Math.min(8,n.accuracyW)}if(n.flightW){if(n.lowSpin)s+=(p.spin-2.7)*4;if(n.highSpin)s+=(2.8-p.spin)*4;if(n.lowLaunch)s+=(p.launch-3)*3;if(n.highLaunch)s+=(3-p.launch)*3;w+=Math.min(6,n.flightW*.7)}return comp70('priorities','Your stated priorities',w,s,'Your ranking changes secondary weighting after core fit needs.');
}
function preference70(p,n){return comp70('preference','Style preference',2,n.style==='balanced'?85:(p.style===n.style?96:76),'Style is only a tie-breaker.');}

function interactions70(p,n,caps){
  const out=[];
  if(n.lowSpin&&n.lowLaunch){const good=(p.spin>=2.8?1:0)+(p.launch>=4?1:0);out.push({name:'Low spin + low launch',points:good===2?5:good===1?-3:-12,why:'Both conditions together create a stronger need than either alone.'});}
  if(n.lowSpin&&p.player==='lowspin')out.push({name:'Low-spin head conflict',points:-10,why:'This head can compound an already-low-spin delivery.'});
  if(n.offCenter&&caps.faceRetention>=4.7)out.push({name:'Off-center speed retention',points:3,why:'Face technology is especially relevant to the reported strike pattern.'});
  if(n.twoWay&&caps.stability>=4.8)out.push({name:'High-MOI stability',points:3,why:'High stability is especially relevant to a two-way pattern.'});
  if(n.draw&&p.draw_bias>=.8)out.push({name:'Bias conflict',points:-12,why:'Strong draw bias conflicts with a left-miss tendency.'});
  if(p.player==='moderate_speed'&&n.speed>=95)out.push({name:'Lightweight design mismatch',points:-10,why:'Moderate-speed lightweight design is materially outside the reported speed profile.'});
  return out;
}
function scoreProduct70(p,g,modelLabel){
  const n=needs70(g),caps=productCaps70(p,modelLabel);
  const parts=[speed70(p,n),spin70(p,n,caps),launch70(p,n),stability70(p,n,caps),direction70(p,n),efficiency70(p,n,caps),carry70(p,n,caps),technology70(p,n,caps),priorities70(p,n),preference70(p,n)];
  const hard=driverHardConstraints(p,g)||[];if(hard.length)return {overall:50,components:parts,interactions:[],hardConstraints:hard,reasons:hard,caps};
  const tw=parts.reduce((a,x)=>a+x.weight,0),base=parts.reduce((a,x)=>a+x.score*x.weight,0)/tw;
  const ints=interactions70(p,n,caps),ip=ints.reduce((a,x)=>a+x.points,0);
  // Deliberately expand meaningful mismatches. Similar products can still finish close when their profiles truly are close.
  const overall=r170(clamp70(100-(100-base)*1.48+ip,45,99.4));
  const penalties=parts.map(x=>({...x,impact:r170((100-x.score)*x.weight/tw)})).sort((a,b)=>b.impact-a.impact);
  const strengths=parts.slice().sort((a,b)=>(b.score-80)*b.weight-(a.score-80)*a.weight);
  return {overall,rawOverall:r170(base),components:parts,interactions:ints,hardConstraints:[],caps,penalties,strengths,reasons:[...new Set([strengths[0]?.why,penalties[0]?.why,penalties[1]?.why].filter(Boolean))]};
}

function manufacturerWinners70(g){
  const all=[];products.forEach(p=>{if(p.generation==='previous_limited'||!productAllowedByBrandScope(p))return;const s=scoreProduct70(p,g);if(!s.hardConstraints.length)all.push({p,s});});
  const by=new Map();all.sort((a,b)=>b.s.overall-a.s.overall).forEach(r=>{if(!by.has(r.p.brand))by.set(r.p.brand,r)});return [...by.values()].sort((a,b)=>b.s.overall-a.s.overall);
}

function currentProduct70(g){
  const label=g.currentClub?.model||'';
  const clean=label.replace(/\s*\(20\d{2}\)\s*/,'').trim();
  const exact=products.find(p=>p.brand===g.currentClub?.brand&&(p.model===clean||p.model===label));
  if(exact)return {p:{...exact},label,year:modelYear70(label)||2026,evidence:'Exact current-generation product profile'};
  const old=typeof currentVirtualProduct==='function'?currentVirtualProduct(g):null;
  if(old)return {p:{...old},label,year:modelYear70(label),evidence:'Historical modeled product profile'};
  return null;
}
function currentDiagnostic70(g){
  const found=currentProduct70(g);if(!found)return {score:null,evidence:'Insufficient',product:null,components:[],caps:null,experience:[]};
  const s=scoreProduct70(found.p,g,found.label);
  const experience=[];
  if(g.current==='great')experience.push('You report that it works very well.');if(g.current==='good')experience.push('You report that it generally works well.');if(g.current==='mixed')experience.push('You report mixed results.');if(g.current==='poor')experience.push('You report poor results.');
  (g.currentClub?.problems||[]).forEach(x=>experience.push(`Reported issue: ${pretty70(x)}.`));
  return {score:s.overall,evidence:found.evidence,product:found.p,components:s.components,caps:s.caps,experience,year:found.year,scoreDetail:s};
}

function mapParts70(s){return Object.fromEntries((s?.components||[]).map(x=>[x.key,x]));}
function differences70(a,b){
  const A=mapParts70(a),B=mapParts70(b),out=[];
  [['spin','Spin fit'],['stability','Strike protection'],['launch','Launch fit'],['speed','Speed/design'],['direction','Directional fit'],['efficiency','Speed retention'],['technology','Relevant technology']].forEach(([k,label])=>{if(A[k]&&B[k]){const d=r170(A[k].score-B[k].score);if(Math.abs(d)>=3)out.push({label,delta:d});}});return out.sort((x,y)=>Math.abs(y.delta)-Math.abs(x.delta));
}
function upgrade70(best,current){
  if(current.score==null)return {level:'Test before replacing',text:'FORM does not know enough about the current head to claim that new equipment is objectively better.'};
  const gap=r170(best.s.overall-current.score),diff=differences70(best.s,current.scoreDetail),positive=diff.filter(x=>x.delta>=4);
  if(gap<2.5||positive.length===0)return {level:'Keep / no clear equipment upgrade',text:`The best new fit is only ${gap.toFixed(1)} points better, and FORM does not identify enough meaningful capability gains in the areas that matter to you.`};
  if(gap<6)return {level:'Worth a side-by-side test',text:`The new head has a ${gap.toFixed(1)}-point fit advantage. The strongest modeled gains are ${positive.slice(0,2).map(x=>x.label.toLowerCase()).join(' and ')||'modest overall compatibility'}.`};
  return {level:'Strong upgrade candidate',text:`The new head has a ${gap.toFixed(1)}-point fit advantage, driven by ${positive.slice(0,3).map(x=>x.label.toLowerCase()).join(', ')}.`};
}

window.FORM_DRIVER_ENGINE_V70={scoreProduct:scoreProduct70,manufacturerWinners:manufacturerWinners70,currentDiagnostic:currentDiagnostic70,differences:differences70};
driverScoreV43=scoreProduct70;driverRankV43=manufacturerWinners70;confidenceAdjustedDriverScore=x=>r170(Number(x)||0);currentDriverScoreV43=g=>currentDiagnostic70(g).score??75;

// Replace results with an explanation-first comparison. One winner per manufacturer.
showResults=function(){
  const results=document.getElementById('results');
  try{
    const g=golfer70(),rows=manufacturerWinners70(g),current=currentDiagnostic70(g),best=rows[0],decision=best?upgrade70(best,current):null;
    step=10;document.querySelectorAll('#driverExperience .step').forEach(x=>x.classList.add('hidden'));results.classList.remove('hidden');
    const nav=document.getElementById('flowNav');if(nav)nav.style.display='none';document.getElementById('progressBar').style.width='100%';document.getElementById('stepCount').textContent='FIT COMPLETE';
    const currentName=[g.currentClub?.brand,g.currentClub?.model].filter(Boolean).join(' ')||'Current driver';
    const currentText=current.score==null?'Not enough product data for a defensible grade':`${current.score.toFixed(1)} / 100`;
    results.innerHTML=`<div class="results70Head"><div><div class="eyebrow">Your Driver Fit</div><h2>Five manufacturer winners, ranked for you.</h2><p>Each brand contributes only its best-fitting head. Scores are built from the needs that matter most to your profile—not from model year, popularity or affiliate value.</p></div></div><div class="current70"><div><span>Current driver</span><b>${currentName}</b><em>${currentText}</em></div><div><span>Upgrade recommendation</span><b>${decision?.level||'—'}</b><em>${decision?.text||''}</em></div></div><div id="result70Grid" class="result70Grid"></div>`;
    const grid=document.getElementById('result70Grid');
    grid.innerHTML=rows.slice(0,5).map((row,i)=>{
      const score=row.s,parts=score.components.slice().sort((a,b)=>b.weight-a.weight),curDiff=current.scoreDetail?differences70(score,current.scoreDetail):[],prev=i?rows[i-1].s:null,rankDiff=prev?differences70(score,prev):[];
      const strongest=score.strengths?.slice(0,2)||[],limiter=score.penalties?.[0];
      const versusCurrent=curDiff.filter(x=>x.delta>0).slice(0,3),tradeoffs=curDiff.filter(x=>x.delta<0).slice(0,2);
      const separator=i===0?(rows[1]?differences70(score,rows[1].s).filter(x=>x.delta>0).slice(0,2):[]):rankDiff.filter(x=>x.delta<0).slice(0,2);
      return `<article class="result70Card ${i===0?'winner':''}"><div class="result70Top"><div><span class="result70Rank">${i===0?'#1 overall':'#'+(i+1)}</span><h3>${row.p.brand} ${row.p.model}</h3></div><div class="result70Score">${score.overall.toFixed(1)}<small>Fit / 100</small></div></div><div class="result70Why"><b>Why it fits</b>${strongest.map(x=>`<p><span>${x.label}</span>${Math.round(x.score)}/100 — ${x.why}</p>`).join('')}</div><div class="result70Breakdown">${parts.filter(x=>!['preference','priorities'].includes(x.key)).slice(0,7).map(x=>`<div><span>${x.label}</span><b>${Math.round(x.score)}</b></div>`).join('')}</div><div class="result70Distinction"><b>${i===0?'Why it leads':'Why it trails the club above'}</b><p>${separator.length?separator.map(x=>`${x.label} ${x.delta>0?'+':''}${x.delta.toFixed(1)}`).join(' · '):(limiter?`${limiter.label} is the main limiter for your profile.`:'The modeled profiles are genuinely close.')}</p></div><div class="result70Current"><b>Compared with your current driver</b><p>${versusCurrent.length?`Modeled advantages: ${versusCurrent.map(x=>`${x.label} +${x.delta.toFixed(1)}`).join(' · ')}`:'No meaningful modeled attribute advantage identified.'}</p>${tradeoffs.length?`<p class="tradeoff">Tradeoffs: ${tradeoffs.map(x=>`${x.label} ${x.delta.toFixed(1)}`).join(' · ')}</p>`:''}</div><div class="result70Tech"><span>Technology evidence</span><p>${score.caps.evidence}. ${score.caps.source}</p></div></article>`;
    }).join('');
    try{saveFit('driver',{title:'Driver Fit',topMatch:best?`${best.p.brand} ${best.p.model}`:'',topScore:best?.s.overall||null,currentClub:currentName,currentScore:current.score,upgrade:decision?.level||'',engine:'7.0'})}catch(e){}
    window.scrollTo({top:0,left:0,behavior:'auto'});
  }catch(err){console.error('FORM 7.0 results',err);results.classList.remove('hidden');results.innerHTML=`<div class="dataStrengthNote"><b>Result error</b><span>${String(err?.message||err)}</span></div>`;}
};

// Keep confirmation page human-readable and include the extra useful metrics only when supplied.
if(typeof renderReview==='function'){
  const baseReview70=renderReview;
  renderReview=function(){
    baseReview70();document.querySelectorAll('#step9 .quality').forEach(x=>x.remove());
    document.querySelectorAll('#step9 .reviewRow b').forEach(b=>{const raw=b.childNodes[0]?.textContent||'';if(raw&&/[a-z]+_[a-z]+/.test(raw))b.childNodes[0].textContent=pretty70(raw);});
    const tech=document.getElementById('reviewTech');if(tech){[['ballSpeed','Ball speed','mph'],['carry','Carry','yds'],['total','Total distance','yds']].forEach(([id,label,unit])=>{const v=extraValue70(id);if(v)tech.insertAdjacentHTML('beforeend',`<div class="reviewRow"><span>${label}</span><b>${v} ${unit}</b></div>`);});}
  };
}

})();