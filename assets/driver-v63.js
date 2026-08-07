// FORM 6.6 — driver UX, scoring separation, brand-scope guardrails
(function(){
  'use strict';

  function ensureResultsScaffold(){
    const main=document.querySelector('#driverExperience .mainPane');
    const nav=document.getElementById('flowNav');
    if(!main) return null;
    let section=document.getElementById('results');
    if(!section){
      section=document.createElement('section'); section.id='results'; section.className='step hidden';
      if(nav) main.insertBefore(section,nav); else main.appendChild(section);
    }
    section.innerHTML=`<div class="resultsTop"><div><div class="eyebrow">Your fit</div><h2>Current-generation matches</h2></div><div class="resultsScoreKey"><b>Recommendation strength</b><span>Fit and available evidence combined</span></div></div><div id="dataStrengthNote" class="dataStrengthNote"></div><div class="driverResultsLayout"><div class="driverResultsMain"><div id="keep" class="keep"></div><div id="resultList"></div></div><aside class="oracle driverResultsOracle"><div class="oracleLabel">FORM analysis</div><h3 id="oracleTitle">Fit synthesized.</h3><div id="signalList" class="signalList"></div><div class="candidateCount"><span>Eligible candidates</span><b id="candidateCount">—</b></div></aside></div>`;
    return section;
  }
  ensureResultsScaffold();

  if(typeof showPage==='function'){
    const prior=showPage;
    showPage=function(name){const out=prior(name);if(name==='driver')requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'auto'}));return out;};
  }

  const ids=['speed','spin','aoa','launch'];
  let lastGlobalLmMode=null;
  function defaultMetricMode(globalMode){return globalMode==='exact'?'exact':globalMode==='range'?'range':globalMode==='general'?'general':'unknown'}
  function modeLabel(mode){return ({exact:'Exact number',range:'Approx. range',general:'General idea',unknown:'Don’t know'})[mode]||'Choose precision'}
  function metricModeSelector(id,mode){
    return `<label class="metricModeSelectWrap"><span>Answer type</span><select class="metricModeSelect" data-metric-mode="${id}" aria-label="${metricDefs[id].label} answer type"><option value="exact" ${mode==='exact'?'selected':''}>Exact number</option><option value="range" ${mode==='range'?'selected':''}>Approx. range</option><option value="general" ${mode==='general'?'selected':''}>General idea</option><option value="unknown" ${mode==='unknown'?'selected':''}>Don’t know</option></select></label>`;
  }
  function bindMetricEvents(){
    document.querySelectorAll('[data-metric-mode]').forEach(sel=>sel.onchange=()=>{const id=sel.dataset.metricMode;state.metrics[id]={mode:sel.value,value:null};renderLMInputs()});
    document.querySelectorAll('[data-metric-input]').forEach(inp=>{inp.oninput=()=>{const id=inp.dataset.metricInput,def=metricDefs[id];if(inp.value===''){state.metrics[id].value=null;return}let v=Number(inp.value);if(!Number.isFinite(v))return;v=Math.max(def.min,Math.min(def.max,v));v=def.decimals===0?Math.round(v):Math.round(v*10)/10;if(id==='aoa'){const sign=inp.closest('.signedMetric')?.querySelector('.signPicker .on')?.dataset.sign||'+';v=(sign==='-'?-1:1)*Math.abs(v)}state.metrics[id].value=v;};});
    document.querySelectorAll('.signPicker button').forEach(btn=>btn.onclick=()=>{const wrap=btn.closest('.signedMetric'),inp=wrap?.querySelector('[data-metric-input="aoa"]');wrap?.querySelectorAll('.signPicker button').forEach(x=>x.classList.remove('on'));btn.classList.add('on');if(inp&&inp.value!=='')state.metrics.aoa.value=(btn.dataset.sign==='-'?-1:1)*Math.abs(Number(inp.value));});
    document.querySelectorAll('[data-metric-unknown]').forEach(btn=>btn.onclick=()=>{const id=btn.dataset.metricUnknown;state.metrics[id]={mode:'unknown',value:null};renderLMInputs()});
    document.querySelectorAll('[data-metric-pick]').forEach(btn=>btn.onclick=()=>{const id=btn.dataset.metricPick;state.metrics[id].value=btn.dataset.value;btn.parentElement?.querySelectorAll('.metricChoice').forEach(x=>x.classList.remove('on'));btn.classList.add('on')});
  }
  if(typeof renderLMInputs==='function'){
    renderLMInputs=function(){
      const box=document.getElementById('lmInputs');if(!box)return;const globalMode=state.lm;
      if(globalMode==='none'){ids.forEach(id=>state.metrics[id]={mode:'unknown',value:null});lastGlobalLmMode='none';box.innerHTML=`<div class="derived"><b>No launch-monitor data needed.</b><br>FORM will keep learning from start direction, curvature, strike, trajectory and current equipment.</div>`;return}
      if(globalMode!==lastGlobalLmMode){const seed=defaultMetricMode(globalMode);ids.forEach(id=>state.metrics[id]={mode:seed,value:null});lastGlobalLmMode=globalMode}
      box.innerHTML=`<div class="metricPrecisionHelp"><b>Enter what you know.</b> Start with the answer itself; use the Answer type menu only when you need to switch between an exact number, a range, a general description, or unknown.</div>`+ids.map(id=>{const def=metricDefs[id],mode=state.metrics[id]?.mode||'unknown',core=renderMetric(def,id,mode);return core.replace(/(<div class="metricTop">[\s\S]*?<\/div>)/,`$1<div class="metricAnswerRow">`).replace(/(<div class="signalStrength">)/,`${metricModeSelector(id,mode)}</div>$1`)}).join('');
      bindMetricEvents();
    };
  }

  function normalizedGolfer(){
    const g=golfer(),sm=state.metrics.speed,sp=state.metrics.spin,lm=state.metrics.launch;
    if(sm.mode==='range')g.speed=({'under75':72,'75-84':80,'85-89':87,'90-94':92,'95-99':97,'100-104':102,'105-109':107,'110-114':112,'115plus':118}[sm.value]||g.speed||null);
    if(sm.mode==='general')g.speed=({'belowavg':82,'typical':92,'aboveavg':101,'fast':108,'veryfast':116}[sm.value]||g.speed||null);
    if(sp.mode==='range')g.spin=({'under1500':'low','1500-1749':'low','1750-1999':'low','2000-2249':'low','2250-2499':'mid','2500-2749':'mid','2750-2999':'mid','3000-3499':'high','3500plus':'high'}[sp.value]||g.spin);
    if(sp.mode==='general')g.spin=({'verylow':'low','low':'low','mid':'mid','high':'high','veryhigh':'high'}[sp.value]||g.spin);
    if(lm.mode==='range')g.traj=({'under8':'low','8-10':'low','10-12':'low','12-14':'mid','14-16':'mid','16-18':'high','18-20':'high','20plus':'high'}[lm.value]||g.traj);
    return g;
  }

  // Strong raw fits previously saturated at 99.5 before confidence was applied. This
  // scorer keeps the same fit logic but preserves meaningful product-to-product spacing.
  function driverScoreSeparated(p,g){
    let perf=82,reasons=[];
    if(g.speed){const mid=(p.speed_fit[0]+p.speed_fit[1])/2,miss=Math.abs(g.speed-mid);perf-=Math.min(16,miss*.55);if(miss<8)reasons.push('speed window fits');if(g.speed>p.speed_fit[1])perf-=Math.min(8,(g.speed-p.speed_fit[1])*.9);if(g.speed<p.speed_fit[0])perf-=Math.min(8,(p.speed_fit[0]-g.speed)*.9)}
    const d=driverMissDiagnosis(g);
    if(g.costly==='two_way'||g.strike==='varied'){perf+=(p.forgiveness-3.5)*4.2;if(p.forgiveness>=4.5)reasons.push('high stability for inconsistent strike')}
    if(['heel','toe'].includes(g.strike)){perf+=(p.forgiveness-3.5)*3.8;if(p.forgiveness>=4.5)reasons.push(`${g.strike}-strike protection`)}
    if(g.curveClass==='fade_curve'){const w=d.severity>=3?7:4;perf+=p.draw_bias*w;if(p.draw_bias>=.8)reasons.push('right-miss correction')}
    if(g.curveClass==='draw_curve'){perf-=p.draw_bias*(d.severity>=3?9:6);if(p.draw_bias<.4)reasons.push('neutral bias protects left miss')}
    if(g.spin==='high'){perf+=(3.1-p.spin)*3.4;if(p.spin<=2.2)reasons.push('spin reduction')}else if(g.spin==='low'){perf+=(p.spin-2.6)*3.2;if(p.spin>=2.8)reasons.push('spin protection')}
    if(g.traj==='low'){perf+=(p.launch-3)*2.7;if(p.launch>=4)reasons.push('launch support')}else if(g.traj==='high'){perf+=(3-p.launch)*2.4;if(p.launch<=2.7)reasons.push('flight control')}
    const aw=rankedWeight(g,'accuracy'),dw=rankedWeight(g,'distance'),fw=rankedWeight(g,'flight');perf+=(p.forgiveness-3.5)*aw*.65;if(dw)perf+=(p.player==='lowspin'&&g.spin==='high'?2.2:.55)*dw;if(fw&&g.spin==='high'&&p.spin<=2.3)perf+=fw*.65;if(fw&&g.traj==='low'&&p.launch>=4)perf+=fw*.65;
    // Moderate-speed / Lite heads should not rank as interchangeable with standard heads at 95+ mph.
    if(p.player==='moderate_speed'&&g.speed){if(g.speed>=95)perf-=8+(g.speed-95)*.65;else if(g.speed>=91)perf-=3+(g.speed-91)*1.1;else if(g.speed<=88)reasons.push('moderate-speed design fit')}
    let pref=80;if(g.style!=='balanced')pref+=p.style===g.style?10:-2;
    const raw=perf*.90+pref*.10;
    // Soft compression avoids ceiling pile-ups while still allowing exceptional fits into high 90s.
    const overall=raw>96?96+(raw-96)*.28:raw;
    return {perf:Math.round(perf*10)/10,pref:Math.round(pref*10)/10,overall:Math.max(50,Math.min(99.3,Math.round(overall*10)/10)),reasons:[...new Set(reasons)].slice(0,4),penalties:[]};
  }
  driverScoreV43=driverScoreSeparated;
  driverRankV43=function(g){const rows=[];products.forEach(p=>{if(p.generation==='previous_limited'||!productAllowedByBrandScope(p))return;const constraints=driverHardConstraints(p,g);if(!constraints.length)rows.push({p,s:driverScoreSeparated(p,g),constraints})});return rows.sort((a,b)=>b.s.overall-a.s.overall)};

  confidenceAdjustedDriverScore=function(rawScore,confidence){const conf=Math.max(0,Math.min(100,Number(confidence)||0)),penalty=(100-conf)*.28;return Math.max(50,Math.min(99.3,Math.round((Number(rawScore)-penalty)*10)/10))};
  driverTradeoffs=function(p,g,currentScore){const conf=driverConfidenceV43(g),productScore=confidenceAdjustedDriverScore(driverScoreSeparated(p,g).overall,conf),delta=currentScore==null?null:Math.round((productScore-currentScore)*10)/10;return [['Forgiveness',p.forgiveness>=4.7?'Excellent':p.forgiveness>=4?'Strong':'Moderate'],['Launch',p.launch>=4?'Higher':p.launch<=2.5?'Lower':'Mid'],['Spin',p.spin<=2?'Low':p.spin>=3.4?'Higher':'Mid'],['Vs. current',delta==null?'—':`${delta>0?'+':''}${delta.toFixed(1)}`]]};

  function brandScopeReviewRow(){return `<div class="reviewRow"><span>Brands considered</span><b>${brandScopeSummaryLabel()}<span class="quality">Scope</span></b></div>`}
  if(typeof renderReview==='function'){
    const priorReview=renderReview;
    renderReview=function(){priorReview();const prefs=document.getElementById('reviewPrefs');if(prefs)prefs.insertAdjacentHTML('afterbegin',brandScopeReviewRow())};
  }

  // Make a fresh Driver Fit always show handedness, then brand scope. Do not silently
  // reuse the prior fitting's confirmation state.
  if(typeof openFit==='function'){
    const priorOpen=openFit;
    openFit=function(id){if(id==='driver'){step=1;state.handed=null;formBrandScopeConfirmed=false;localStorage.setItem('formBrandScopeConfirmed','false');const out=priorOpen(id);setTimeout(()=>{showOpeningHandedness();renderStep()},0);return out}return priorOpen(id)};
  }

  showResults=function(){
    const results=ensureResultsScaffold();
    try{
      const raw=normalizedGolfer(),g=driverProfile(raw),rawRows=driverRankV43(g),conf=driverConfidenceV43(g),rows=rawRows.map(x=>({...x,s:{...x.s,rawOverall:x.s.overall,overall:confidenceAdjustedDriverScore(x.s.overall,conf)}}));
      rows.sort((a,b)=>b.s.overall-a.s.overall||b.s.rawOverall-a.s.rawOverall);
      const rawCurrent=currentDriverScoreV43(g),currentScore=confidenceAdjustedDriverScore(rawCurrent,conf),currentName=[g.currentClub.brand,g.currentClub.model].filter(Boolean).join(' ')||'Your current driver',tie=driverTieState(rawRows,conf),best=rows[0],delta=best?Math.round((best.s.overall-currentScore)*10)/10:0,up=upgradeMagnitudeV43(delta,currentScore,conf),adjust=adjustmentAdviceV43(g,currentScore),diag=driverMissDiagnosis(g),strength=driverDataStrengthCopy(conf);
      step=10;document.querySelectorAll('#driverExperience .step').forEach(x=>x.classList.add('hidden'));results.classList.remove('hidden');const nav=document.getElementById('flowNav');if(nav)nav.style.display='none';document.getElementById('progressBar').style.width='100%';document.getElementById('stepCount').textContent='FIT COMPLETE';document.getElementById('dataStrengthNote').innerHTML=`<b>${strength.label}</b><span>${strength.text}</span>`;
      const tiedRaw=tie.group||[],groupNames=tiedRaw.map(x=>`${x.p.brand} ${x.p.model}`).join(' · ');
      document.getElementById('keep').innerHTML=`<div class="currentFitCard"><div class="currentFitTop"><div><div class="eyebrow">Your current driver</div><div class="currentFitName">${currentName}${g.currentClub.loft?` · ${g.currentClub.loft}`:''}</div></div><div class="gradeWrap"><div class="letterGrade">${fitLetter(currentScore)}</div><div><div class="headerMeta">Recommendation strength</div><div class="numericGrade">${currentScore.toFixed(1)}/100</div></div></div></div><div class="fitExplanation">FORM diagnoses your pattern as <b>${diag.label}</b>. This score combines modeled equipment fit with the amount and precision of information you provided.</div></div>${adjust?`<div class="adjustFirst"><div class="eyebrow">Before replacing it</div><h3>${adjust.title}</h3><p>${adjust.text}</p></div>`:''}<div class="upgradeSummary"><div class="upgradeSummaryTop"><div><div class="eyebrow">Upgrade recommendation</div><h3>${up.level}</h3></div><div class="deltaScore">${delta>0?'+':''}${delta.toFixed(1)} strength points</div></div><div class="fitExplanation">${up.text}</div></div>${tie.tie?`<div class="tieBanner"><b>Top fit group:</b> ${groupNames}. These are genuinely close modeled fits; FORM still preserves their numerical differences below.</div>`:''}`;
      document.getElementById('resultList').innerHTML=rows.slice(0,5).map((x,i)=>{const tr=driverTradeoffs(x.p,g,currentScore),why=x.s.reasons.length?x.s.reasons.join('; '):'balanced match across the inputs provided',isTie=tie.tie&&tiedRaw.some(z=>z.p.brand===x.p.brand&&z.p.model===x.p.model);return `<div class="driverVerdict"><div class="verdictTop"><div><div class="recRank">${isTie?'Top fit group':'#'+(i+1)+' recommendation'}</div><h2>${x.p.brand} ${x.p.model}</h2><div class="fitGroup">${x.s.reasons.slice(0,3).map(r=>`<span>${r}</span>`).join('')}</div></div><div class="verdictScore">${x.s.overall.toFixed(1)}<small>Strength / 100</small></div></div><div class="tradeoffs">${tr.map(z=>`<div class="trade"><span>${z[0]}</span><b>${z[1]}</b></div>`).join('')}</div><div class="engineReason"><b>Why it ranks here:</b> ${why}.</div></div>`}).join('')||'<div class="resultRecovery">No eligible driver candidates remained after the fit constraints. Return to your answers and broaden the brand scope.</div>';
      document.getElementById('oracleTitle').textContent='Fit synthesized.';document.getElementById('signalList').innerHTML=`<div class="signal"><span class="dot on"></span><span>Miss pattern diagnosed from start + curve + strike</span></div><div class="signal"><span class="dot on"></span><span>Brand scope applied before ranking</span></div><div class="signal"><span class="dot on"></span><span>Each launch-monitor input weighted by its own precision</span></div><div class="signal"><span class="dot on"></span><span>Model spacing preserved instead of capped at one score</span></div>`;document.getElementById('candidateCount').textContent=rows.length;
      try{saveFit('driver',{title:'Driver Fit',topMatch:best?`${best.p.brand} ${best.p.model}`:'',topScore:best?.s.overall||null,currentClub:currentName,currentScore,upgrade:up.level,dataStrength:strength.label,diagnosis:diag.label,brandScope:brandScopeSummaryLabel()})}catch(e){}
      window.scrollTo({top:0,left:0,behavior:'auto'});
    }catch(err){console.error('FORM result rendering error',err);document.querySelectorAll('#driverExperience .step').forEach(x=>x.classList.add('hidden'));results?.classList.remove('hidden');const nav=document.getElementById('flowNav');if(nav)nav.style.display='none';const note=document.getElementById('dataStrengthNote');if(note)note.innerHTML=`<b>Recommendation display error</b><span>${String(err?.message||err)}. Your answers are still saved in this browser.</span>`;}
  };

  if(typeof renderStep==='function'){
    const priorStep=renderStep;
    renderStep=function(){const out=priorStep();if(document.getElementById('driverExperience')?.classList.contains('active'))requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'auto'}));return out;};
  }
})();