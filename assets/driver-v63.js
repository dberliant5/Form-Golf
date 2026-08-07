// FORM 6.4 — driver experience fixes
(function(){
  'use strict';

  function ensureResultsScaffold(){
    const main=document.querySelector('#driverExperience .mainPane');
    const nav=document.getElementById('flowNav');
    if(!main) return null;
    let section=document.getElementById('results');
    if(!section){
      section=document.createElement('section');
      section.id='results';
      section.className='step hidden';
      if(nav) main.insertBefore(section,nav); else main.appendChild(section);
    }
    section.innerHTML=`
      <div class="resultsTop">
        <div><div class="eyebrow">Your fit</div><h2>Current-generation matches</h2></div>
        <div class="resultsScoreKey"><b>Recommendation strength</b><span>Fit and available evidence combined</span></div>
      </div>
      <div id="dataStrengthNote" class="dataStrengthNote"></div>
      <div class="driverResultsLayout">
        <div class="driverResultsMain"><div id="keep" class="keep"></div><div id="resultList"></div></div>
        <aside class="oracle driverResultsOracle">
          <div class="oracleLabel">FORM analysis</div>
          <h3 id="oracleTitle">Fit synthesized.</h3>
          <div id="signalList" class="signalList"></div>
          <div class="candidateCount"><span>Eligible candidates</span><b id="candidateCount">—</b></div>
        </aside>
      </div>`;
    return section;
  }

  ensureResultsScaffold();

  // Keep fitting navigation stationary rather than smooth-scrolling between questions.
  if(typeof showPage==='function'){
    const previousShowPage=showPage;
    showPage=function(name){
      const out=previousShowPage(name);
      if(name==='driver') requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'auto'}));
      return out;
    };
  }

  // Each measurement chooses its own precision. The first answer only sets a starting
  // point; it never locks all four measurements to the same precision level.
  let lastGlobalLmMode=null;
  const ids=['speed','spin','aoa','launch'];

  function defaultMetricMode(globalMode){
    return globalMode==='exact'?'exact':globalMode==='range'?'range':globalMode==='general'?'general':'unknown';
  }
  function metricModeSelector(id,mode){
    const modes=[['exact','Exact number'],['range','Approx. range'],['general','General idea'],['unknown','Don’t know']];
    return `<div class="metricModePicker" aria-label="${metricDefs[id].label} precision">${modes.map(([v,label])=>`<button type="button" class="metricModeBtn ${mode===v?'on':''}" data-metric-mode="${id}" data-mode="${v}">${label}</button>`).join('')}</div>`;
  }
  function bindMetricEvents(){
    document.querySelectorAll('[data-metric-mode]').forEach(btn=>btn.onclick=()=>{
      const id=btn.dataset.metricMode;
      state.metrics[id]={mode:btn.dataset.mode,value:null};
      renderLMInputs();
    });
    document.querySelectorAll('[data-metric-input]').forEach(inp=>{
      inp.oninput=()=>{
        const id=inp.dataset.metricInput,def=metricDefs[id];
        if(inp.value===''){state.metrics[id].value=null;return;}
        let v=Number(inp.value); if(!Number.isFinite(v))return;
        v=Math.max(def.min,Math.min(def.max,v));
        v=def.decimals===0?Math.round(v):Math.round(v*10)/10;
        if(id==='aoa'){
          const sign=inp.closest('.signedMetric')?.querySelector('.signPicker .on')?.dataset.sign||'+';
          v=(sign==='-'?-1:1)*Math.abs(v);
        }
        state.metrics[id].value=v;
      };
    });
    document.querySelectorAll('.signPicker button').forEach(btn=>btn.onclick=()=>{
      const wrap=btn.closest('.signedMetric'),inp=wrap?.querySelector('[data-metric-input="aoa"]');
      wrap?.querySelectorAll('.signPicker button').forEach(x=>x.classList.remove('on'));
      btn.classList.add('on');
      if(inp&&inp.value!=='') state.metrics.aoa.value=(btn.dataset.sign==='-'?-1:1)*Math.abs(Number(inp.value));
    });
    document.querySelectorAll('[data-metric-unknown]').forEach(btn=>btn.onclick=()=>{
      const id=btn.dataset.metricUnknown; state.metrics[id]={mode:'unknown',value:null}; renderLMInputs();
    });
    document.querySelectorAll('[data-metric-pick]').forEach(btn=>btn.onclick=()=>{
      const id=btn.dataset.metricPick; state.metrics[id].value=btn.dataset.value;
      btn.parentElement?.querySelectorAll('.metricChoice').forEach(x=>x.classList.remove('on'));
      btn.classList.add('on');
    });
  }

  if(typeof renderLMInputs==='function'){
    renderLMInputs=function(){
      const box=document.getElementById('lmInputs'); if(!box)return;
      const globalMode=state.lm;
      if(globalMode==='none'){
        ids.forEach(id=>state.metrics[id]={mode:'unknown',value:null});
        lastGlobalLmMode='none';
        box.innerHTML=`<div class="derived"><b>No launch-monitor data needed.</b><br>FORM will keep learning from start direction, curvature, strike, trajectory and current equipment.</div>`;
        return;
      }
      if(globalMode!==lastGlobalLmMode){
        const seed=defaultMetricMode(globalMode);
        ids.forEach(id=>state.metrics[id]={mode:seed,value:null});
        lastGlobalLmMode=globalMode;
      }
      box.innerHTML=`<div class="metricPrecisionHelp"><b>Mix and match what you know.</b> For each number below, choose an exact value, an approximate range, a general description, or “Don’t know.”</div>`+ids.map(id=>{
        const def=metricDefs[id],mode=state.metrics[id]?.mode||'unknown';
        const core=renderMetric(def,id,mode);
        return core.replace(/(<div class="metricTop">[\s\S]*?<\/div>)/,`$1${metricModeSelector(id,mode)}`);
      }).join('');
      bindMetricEvents();
    };
  }

  // Normalize the newer range/general keys into the scoring engine's expected signals.
  function normalizedGolfer(){
    const g=golfer();
    const sm=state.metrics.speed,sp=state.metrics.spin,lm=state.metrics.launch;
    if(sm.mode==='range') g.speed=({'under75':72,'75-84':80,'85-89':87,'90-94':92,'95-99':97,'100-104':102,'105-109':107,'110-114':112,'115plus':118}[sm.value]||g.speed||null);
    if(sm.mode==='general') g.speed=({'belowavg':82,'typical':92,'aboveavg':101,'fast':108,'veryfast':116}[sm.value]||g.speed||null);
    if(sp.mode==='range') g.spin=({'under1500':'low','1500-1749':'low','1750-1999':'low','2000-2249':'low','2250-2499':'mid','2500-2749':'mid','2750-2999':'mid','3000-3499':'high','3500plus':'high'}[sp.value]||g.spin);
    if(sp.mode==='general') g.spin=({'verylow':'low','low':'low','mid':'mid','high':'high','veryhigh':'high'}[sp.value]||g.spin);
    if(lm.mode==='range') g.traj=({'under8':'low','8-10':'low','10-12':'low','12-14':'mid','14-16':'mid','16-18':'high','18-20':'high','20plus':'high'}[lm.value]||g.traj);
    return g;
  }

  // Render results directly into a known-good scaffold. This avoids the malformed legacy
  // results markup and removes dependencies on elements that no longer exist (e.g. #conf).
  showResults=function(){
    const results=ensureResultsScaffold();
    try{
      const raw=normalizedGolfer(),g=driverProfile(raw),rawRows=driverRankV43(g),conf=driverConfidenceV43(g);
      const rows=rawRows.map(x=>({...x,s:{...x.s,rawOverall:x.s.overall,overall:confidenceAdjustedDriverScore(x.s.overall,conf)}}));
      const rawCurrent=currentDriverScoreV43(g),currentScore=confidenceAdjustedDriverScore(rawCurrent,conf);
      const currentName=[g.currentClub.brand,g.currentClub.model].filter(Boolean).join(' ')||'Your current driver';
      const tie=driverTieState(rawRows,conf),best=rows[0],delta=best?Math.round((best.s.overall-currentScore)*10)/10:0;
      const up=upgradeMagnitudeV43(delta,currentScore,conf),adjust=adjustmentAdviceV43(g,currentScore),diag=driverMissDiagnosis(g),strength=driverDataStrengthCopy(conf);

      step=10;
      document.querySelectorAll('#driverExperience .step').forEach(x=>x.classList.add('hidden'));
      results.classList.remove('hidden');
      const nav=document.getElementById('flowNav'); if(nav)nav.style.display='none';
      const bar=document.getElementById('progressBar'); if(bar)bar.style.width='100%';
      const count=document.getElementById('stepCount'); if(count)count.textContent='FIT COMPLETE';
      document.getElementById('dataStrengthNote').innerHTML=`<b>${strength.label}</b><span>${strength.text}</span>`;

      const tiedRaw=tie.group||[],groupNames=tiedRaw.map(x=>`${x.p.brand} ${x.p.model}`).join(' · ');
      document.getElementById('keep').innerHTML=`<div class="currentFitCard"><div class="currentFitTop"><div><div class="eyebrow">Your current driver</div><div class="currentFitName">${currentName}${g.currentClub.loft?` · ${g.currentClub.loft}`:''}</div></div><div class="gradeWrap"><div class="letterGrade">${fitLetter(currentScore)}</div><div><div class="headerMeta">Recommendation strength</div><div class="numericGrade">${currentScore}/100</div></div></div></div><div class="fitExplanation">FORM diagnoses your pattern as <b>${diag.label}</b>. This score combines modeled equipment fit with the amount and precision of information you provided.</div></div>${adjust?`<div class="adjustFirst"><div class="eyebrow">Before replacing it</div><h3>${adjust.title}</h3><p>${adjust.text}</p></div>`:''}<div class="upgradeSummary"><div class="upgradeSummaryTop"><div><div class="eyebrow">Upgrade recommendation</div><h3>${up.level}</h3></div><div class="deltaScore">${delta>0?'+':''}${delta} strength points</div></div><div class="fitExplanation">${up.text}</div></div>${tie.tie?`<div class="tieBanner"><b>Top fit group:</b> ${groupNames}. The available evidence does not justify pretending there is a clear single winner.</div>`:''}`;
      document.getElementById('resultList').innerHTML=rows.slice(0,5).map((x,i)=>{
        const tr=driverTradeoffs(x.p,g,currentScore),why=x.s.reasons.length?x.s.reasons.join('; '):'balanced match across the inputs provided';
        const isTie=tie.tie&&tiedRaw.some(z=>z.p.brand===x.p.brand&&z.p.model===x.p.model);
        return `<div class="driverVerdict"><div class="verdictTop"><div><div class="recRank">${isTie?'Top fit group':'#'+(i+1)+' recommendation'}</div><h2>${x.p.brand} ${x.p.model}</h2><div class="fitGroup">${x.s.reasons.slice(0,3).map(r=>`<span>${r}</span>`).join('')}</div></div><div class="verdictScore">${x.s.overall}<small>Strength / 100</small></div></div><div class="tradeoffs">${tr.map(z=>`<div class="trade"><span>${z[0]}</span><b>${z[1]}</b></div>`).join('')}</div><div class="engineReason"><b>Why it ranks here:</b> ${why}.</div></div>`;
      }).join('')||'<div class="resultRecovery">No eligible driver candidates remained after the fit constraints. Return to your answers and broaden the brand scope.</div>';
      document.getElementById('oracleTitle').textContent='Fit synthesized.';
      document.getElementById('signalList').innerHTML=`<div class="signal"><span class="dot on"></span><span>Miss pattern diagnosed from start + curve + strike</span></div><div class="signal"><span class="dot on"></span><span>Hard incompatibility constraints applied</span></div><div class="signal"><span class="dot on"></span><span>Each launch-monitor input weighted by its own precision</span></div>`;
      document.getElementById('candidateCount').textContent=rows.length;
      try{saveFit('driver',{title:'Driver Fit',topMatch:best?`${best.p.brand} ${best.p.model}`:'',topScore:best?.s.overall||null,currentClub:currentName,currentScore,upgrade:up.level,dataStrength:strength.label,diagnosis:diag.label})}catch(e){}
      window.scrollTo({top:0,left:0,behavior:'auto'});
    }catch(err){
      console.error('FORM result rendering error',err);
      document.querySelectorAll('#driverExperience .step').forEach(x=>x.classList.add('hidden'));
      results?.classList.remove('hidden');
      const nav=document.getElementById('flowNav'); if(nav)nav.style.display='none';
      const note=document.getElementById('dataStrengthNote'); if(note)note.innerHTML=`<b>Recommendation display error</b><span>${String(err?.message||err)}. Your answers are still saved in this browser.</span>`;
      const list=document.getElementById('resultList'); if(list)list.innerHTML='<div class="resultRecovery"><button class="btn primary" type="button" onclick="goTo(9)">Return to review</button></div>';
    }
  };

  if(typeof renderStep==='function'){
    const previousRenderStep=renderStep;
    renderStep=function(){
      const out=previousRenderStep();
      if(document.getElementById('driverExperience')?.classList.contains('active')) requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'auto'}));
      return out;
    };
  }
})();
