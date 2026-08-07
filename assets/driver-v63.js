// FORM 6.3 — driver experience fixes
(function(){
  'use strict';

  function ensureResultsScaffold(){
    if(document.getElementById('results')) return;
    const main=document.querySelector('#driverExperience .mainPane');
    const nav=document.getElementById('flowNav');
    if(!main) return;

    const section=document.createElement('section');
    section.id='results';
    section.className='step hidden';
    section.innerHTML=`
      <div class="resultsTop">
        <div><div class="eyebrow">Your fit</div><h2>Current-generation matches</h2></div>
        <div class="resultsScoreKey"><b>Recommendation strength</b><span>Fit and available evidence combined</span></div>
      </div>
      <div id="dataStrengthNote" class="dataStrengthNote"></div>
      <div class="driverResultsLayout">
        <div class="driverResultsMain"></div>
        <aside class="oracle driverResultsOracle">
          <div class="oracleLabel">FORM analysis</div>
          <h3 id="oracleTitle">Fit synthesized.</h3>
          <div id="signalList" class="signalList"></div>
          <div class="candidateCount"><span>Eligible candidates</span><b id="candidateCount">—</b></div>
        </aside>
      </div>`;

    const resultMain=section.querySelector('.driverResultsMain');
    const keep=document.getElementById('keep');
    const list=document.getElementById('resultList');
    if(keep) resultMain.appendChild(keep);
    else { const x=document.createElement('div'); x.id='keep'; x.className='keep'; resultMain.appendChild(x); }
    if(list) resultMain.appendChild(list);
    else { const x=document.createElement('div'); x.id='resultList'; resultMain.appendChild(x); }

    if(nav) main.insertBefore(section,nav); else main.appendChild(section);
  }

  ensureResultsScaffold();

  // Remove the page-to-page smooth-scroll effect that made entering a fit feel jumpy.
  if(typeof showPage==='function'){
    const previousShowPage=showPage;
    showPage=function(name){
      const out=previousShowPage(name);
      if(name==='driver'){
        requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'auto'}));
      }
      return out;
    };
  }

  // Each measurement can have its own precision level. A golfer may know exact
  // speed/spin while only knowing a general attack-angle description.
  let lastGlobalLmMode=null;

  function metricModeSelector(id,mode){
    const modes=[
      ['exact','Exact number'],
      ['range','Range'],
      ['general','General description'],
      ['unknown','I don’t know']
    ];
    return `<div class="metricModePicker" aria-label="${metricDefs[id].label} precision">
      ${modes.map(([v,label])=>`<button type="button" class="metricModeBtn ${mode===v?'on':''}" data-metric-mode="${id}" data-mode="${v}">${label}</button>`).join('')}
    </div>`;
  }

  function bindMetricEvents(){
    document.querySelectorAll('[data-metric-mode]').forEach(btn=>btn.onclick=()=>{
      const id=btn.dataset.metricMode;
      const nextMode=btn.dataset.mode;
      state.metrics[id].mode=nextMode;
      state.metrics[id].value=null;
      renderLMInputs();
    });

    document.querySelectorAll('[data-metric-input]').forEach(inp=>{
      inp.oninput=()=>{
        const id=inp.dataset.metricInput,def=metricDefs[id];
        if(inp.value===''){state.metrics[id].value=null;return;}
        let v=Number(inp.value);
        if(!Number.isFinite(v))return;
        v=Math.max(def.min,Math.min(def.max,v));
        v=def.decimals===0?Math.round(v):Math.round(v*10)/10;
        if(id==='aoa'){
          const sign=inp.closest('.signedMetric')?.querySelector('.signPicker .on')?.dataset.sign||'+';
          v=(sign==='-'?-1:1)*Math.abs(v);
        }
        state.metrics[id].value=v;
      };
      inp.onblur=()=>renderLMInputs();
    });

    document.querySelectorAll('.signPicker button').forEach(btn=>btn.onclick=()=>{
      const wrap=btn.closest('.signedMetric');
      const inp=wrap?.querySelector('[data-metric-input="aoa"]');
      wrap?.querySelectorAll('.signPicker button').forEach(x=>x.classList.remove('on'));
      btn.classList.add('on');
      if(inp&&inp.value!=='') state.metrics.aoa.value=(btn.dataset.sign==='-'?-1:1)*Math.abs(Number(inp.value));
    });

    document.querySelectorAll('[data-metric-unknown]').forEach(btn=>btn.onclick=()=>{
      const id=btn.dataset.metricUnknown;
      state.metrics[id].mode='unknown';
      state.metrics[id].value=null;
      renderLMInputs();
    });

    document.querySelectorAll('[data-metric-pick]').forEach(btn=>btn.onclick=()=>{
      const id=btn.dataset.metricPick;
      state.metrics[id].value=btn.dataset.value;
      btn.parentElement?.querySelectorAll('.metricChoice').forEach(x=>x.classList.remove('on'));
      btn.classList.add('on');
    });
  }

  if(typeof renderLMInputs==='function'){
    renderLMInputs=function(){
      const box=document.getElementById('lmInputs');
      if(!box)return;
      const globalMode=state.lm;
      const ids=['speed','spin','aoa','launch'];

      if(globalMode==='none'){
        ids.forEach(id=>state.metrics[id]={mode:'unknown',value:null});
        lastGlobalLmMode='none';
        box.innerHTML=`<div class="derived"><b>No launch-monitor data needed.</b><br>FORM will keep learning from start direction, curvature, strike, trajectory and current equipment.</div>`;
        return;
      }

      if(globalMode!==lastGlobalLmMode){
        ids.forEach(id=>{
          const existing=state.metrics[id]||{mode:'unknown',value:null};
          state.metrics[id]={mode:globalMode,value:existing.value};
        });
        lastGlobalLmMode=globalMode;
      }

      box.innerHTML=ids.map(id=>{
        const def=metricDefs[id];
        const mode=state.metrics[id]?.mode||'unknown';
        const core=renderMetric(def,id,mode);
        return core.replace(/(<div class="metricTop">[\s\S]*?<\/div>)/,`$1${metricModeSelector(id,mode)}`);
      }).join('');
      bindMetricEvents();
    };
  }

  // The results renderer in v6.1 assumes the scaffold exists. Guarantee it and
  // provide a visible recovery message rather than ever leaving a blank page.
  if(typeof showResults==='function'){
    const previousShowResults=showResults;
    showResults=function(){
      ensureResultsScaffold();
      try{
        return previousShowResults();
      }catch(err){
        console.error('FORM result rendering error',err);
        document.querySelectorAll('#driverExperience .step').forEach(x=>x.classList.add('hidden'));
        const results=document.getElementById('results');
        results?.classList.remove('hidden');
        const nav=document.getElementById('flowNav');
        if(nav)nav.style.display='none';
        const note=document.getElementById('dataStrengthNote');
        if(note)note.innerHTML='<b>We hit a display issue</b><span>Your answers are still in this browser. FORM could not display the recommendation correctly, so it has not invented a result. Please return to Review My Answers and try again.</span>';
        const list=document.getElementById('resultList');
        if(list)list.innerHTML='<div class="resultRecovery"><button class="btn primary" type="button" onclick="goTo(9)">Return to review</button></div>';
        window.scrollTo({top:0,left:0,behavior:'auto'});
      }
    };
  }

  // Keep every normal question transition stationary. The content changes in
  // place rather than translating down/up or triggering a smooth page scroll.
  if(typeof renderStep==='function'){
    const previousRenderStep=renderStep;
    renderStep=function(){
      const out=previousRenderStep();
      if(document.getElementById('driverExperience')?.classList.contains('active')){
        requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'auto'}));
      }
      return out;
    };
  }
})();
