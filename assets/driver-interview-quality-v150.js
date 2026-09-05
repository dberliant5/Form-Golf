// FORM 14.5 — interview quality calibration.
// Captures strike-source quality, uses transition/tempo for shaft guidance,
// and asks the golfer only for the subjective tradeoff FORM cannot infer: distance vs accuracy/forgiveness.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_INTERVIEW_QUALITY_V153)return true;
  if(typeof state==='undefined')return false;
  const step4=document.getElementById('step4'),step6=document.getElementById('step6'),step7=document.getElementById('step7');
  if(!step4||!step6||!step7)return false;

  state.strikeSource=state.strikeSource||'';
  if(state.transition==='unknown')state.transition='';
  state.transition=state.transition||'';
  state.driverPrioritySplit=state.driverPrioritySplit||{accuracy:50,distance:50,touched:false};

  // Keep legacy ranks valid for older UI/review code, but do not use them as the actual weighting model.
  function syncLegacyRanks(){
    const a=Number(state.driverPrioritySplit.accuracy)||50,d=100-a;
    if(a>d){state.ranks.accuracy=1;state.ranks.distance=2;}
    else if(d>a){state.ranks.distance=1;state.ranks.accuracy=2;}
    else {state.ranks.accuracy=1;state.ranks.distance=2;}
    state.ranks.flight=3;state.ranks.feel=4;state.ranks.looks=5;state.ranks.value=6;
  }
  syncLegacyRanks();

  // Calibrated preference curve: the UI can express 0/100, but FORM never turns a core
  // fitting dimension off. Preference changes the lean; physics still set the floor.
  const priorRankedWeight=typeof window.rankedWeight==='function'?window.rankedWeight:null;
  window.rankedWeight=function(g,id){
    if(id==='accuracy'||id==='distance'){
      const split=state.driverPrioritySplit||{accuracy:50,distance:50};
      const share=id==='accuracy'?Number(split.accuracy):Number(split.distance);
      const safe=Math.max(0,Math.min(100,Number.isFinite(share)?share:50));
      return Math.round((3+4*(safe/100))*100)/100; // 3.0–7.0, 5.0 at balanced
    }
    if(id==='flight')return 0; // launch/spin/trajectory stay in FORM's technical fit layer
    return priorRankedWeight?priorRankedWeight(g,id):0;
  };

  const brand=document.getElementById('brandQuestion');
  if(brand){const all=brand.querySelector('[data-brand-mode="all"] b');if(all)all.textContent='All brands — recommended';brand.querySelectorAll('.brandMode').forEach(x=>x.classList.remove('active'));}

  let sourceBox=document.getElementById('strikeSourceV150');
  if(!sourceBox){sourceBox=document.createElement('div');sourceBox.id='strikeSourceV150';sourceBox.className='strikeSourceV150 hidden';sourceBox.innerHTML=`<div class="miniTitle" style="margin-top:22px">How do you know the strike location?</div><p class="lead" style="margin-top:8px;margin-bottom:12px;font-size:13px">FORM trusts confirmed impact evidence more than a best guess. This changes how much heel-vs-toe specificity is used; it does not erase the fact that contact is off-center.</p><div class="options three" data-strike-source-v150><button class="opt" type="button" data-v="confirmed">Confirmed with spray / tape / impact data</button><button class="opt" type="button" data-v="repeated">I think that’s what I’m feeling</button><button class="opt" type="button" data-v="guess">Mostly a guess</button></div>`;const strikeGroup=step4.querySelector('[data-group="strike"]');strikeGroup?.insertAdjacentElement('afterend',sourceBox);}
  function syncSource(){const precise=['heel','toe'].includes(state.strike);sourceBox.classList.toggle('hidden',!precise);sourceBox.querySelectorAll('.opt').forEach(b=>b.classList.toggle('on',b.dataset.v===state.strikeSource));if(!precise)state.strikeSource='';}
  sourceBox.querySelectorAll('[data-strike-source-v150] .opt').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();state.strikeSource=b.dataset.v;syncSource();},true));
  const strikeGroup=step4.querySelector('[data-group="strike"]');strikeGroup?.addEventListener('click',()=>setTimeout(syncSource,0),true);syncSource();

  if(!document.getElementById('formPrioritySplitStyles')){
    const css=document.createElement('style');css.id='formPrioritySplitStyles';css.textContent=`
      .formPrioritySplit{margin-top:28px;border:1px solid var(--line);background:#fff;padding:22px}
      .formPrioritySplitTop{display:flex;justify-content:space-between;gap:18px;align-items:flex-start}
      .formPrioritySide{max-width:46%}.formPrioritySide:last-child{text-align:right}
      .formPrioritySide b{display:block;font-family:Georgia,serif;font-size:19px;line-height:1.1;color:var(--deep)}
      .formPrioritySide span{display:block;margin-top:6px;font-size:11px;line-height:1.45;color:var(--muted)}
      .formPriorityRange{width:100%;margin:26px 0 10px;accent-color:var(--deep)}
      .formPriorityReadout{text-align:center;margin-top:10px}.formPriorityReadout b{display:block;font-size:18px;color:var(--deep)}
      .formPriorityReadout span{display:block;margin-top:4px;font-size:10px;color:var(--muted)}
      .formPriorityBar{display:flex;height:7px;overflow:hidden;background:var(--line);margin-top:18px;border-radius:999px}
      .formPriorityDistance,.formPriorityAccuracy{height:100%;transition:width .12s ease}.formPriorityDistance{background:#9aa69f}.formPriorityAccuracy{background:var(--deep)}
      .formPriorityPhysics{margin-top:18px;padding-top:16px;border-top:1px solid var(--line);font-size:11px;line-height:1.55;color:var(--muted)}
      @media(max-width:700px){.formPrioritySplit{padding:18px}.formPrioritySide b{font-size:17px}.formPrioritySide span{font-size:10px}}
    `;document.head.appendChild(css);
  }

  step6.querySelector('h1').textContent='What matters most from your next driver?';
  step6.querySelector('.lead').textContent='Tell FORM where you want us to lean when distance and accuracy / forgiveness compete.';
  const note=step6.querySelector('.note');if(note)note.textContent='FORM still evaluates launch, spin, trajectory, strike pattern and directional fit automatically.';

  function splitLabel(a){
    const d=100-a;
    if(a===50)return 'Balanced';
    if(a>=80)return 'Strongly accuracy & forgiveness focused';
    if(a>=60)return 'Accuracy & forgiveness focused';
    if(d>=80)return 'Strongly distance focused';
    if(d>=60)return 'Distance focused';
    return a>50?'Slight accuracy & forgiveness lean':'Slight distance lean';
  }
  function renderPerformancePriorities(){
    syncLegacyRanks();
    const box=document.getElementById('priorityRank');if(!box)return;
    const a=Math.max(0,Math.min(100,Number(state.driverPrioritySplit.accuracy)||50)),d=100-a;
    box.innerHTML=`<div class="formPrioritySplit">
      <div class="formPrioritySplitTop">
        <div class="formPrioritySide"><b>Distance</b><span>Maximize useful distance when the tradeoff is real.</span></div>
        <div class="formPrioritySide"><b>Accuracy & forgiveness</b><span>Keep misses tighter and protect performance away from center.</span></div>
      </div>
      <input class="formPriorityRange" type="range" min="0" max="100" step="5" value="${a}" aria-label="Accuracy and forgiveness preference" data-form-priority-range>
      <div class="formPriorityReadout"><b>${splitLabel(a)} · ${d} / ${a}</b><span>Distance / Accuracy & forgiveness</span></div>
      <div class="formPriorityBar" aria-hidden="true"><div class="formPriorityDistance" style="width:${d}%"></div><div class="formPriorityAccuracy" style="width:${a}%"></div></div>
      <div class="formPriorityPhysics">This is a preference—not a physics override. Even at either end of the scale, FORM still requires a technically sound fit.</div>
    </div>`;
    const range=box.querySelector('[data-form-priority-range]');
    if(range){range.oninput=()=>{const accuracy=Number(range.value);state.driverPrioritySplit={accuracy,distance:100-accuracy,touched:true};renderPerformancePriorities();};}
  }
  window.initPriorityRank=renderPerformancePriorities;renderPerformancePriorities();

  step7.innerHTML=`<div class="eyebrow">Shaft starting point</div><h1>How would you describe your transition from the top?</h1><p class="lead">This does not change which driver head fits you best. It helps FORM make the shaft starting point less generic.</p><div class="options" data-transition-v150><button class="opt" type="button" data-v="smooth">Smooth / gradual</button><button class="opt" type="button" data-v="neutral">Moderate / neutral</button><button class="opt" type="button" data-v="aggressive">Quick / aggressive</button><button class="opt" type="button" data-v="unknown">Varies / not sure</button></div><div class="note">Transition is used only for the recommended shaft profile and weight window—not the absolute FORM Fit Score.</div>`;
  function syncTransition(){step7.querySelectorAll('.opt').forEach(b=>b.classList.toggle('on',!!state.transition&&b.dataset.v===state.transition));}
  step7.querySelectorAll('[data-transition-v150] .opt').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();state.transition=b.dataset.v;state.style=b.dataset.v;syncTransition();document.getElementById('formInputWarning')?.remove();},true));syncTransition();

  const priorReview=typeof window.renderReview==='function'?window.renderReview:null;
  if(priorReview){window.renderReview=function(){const out=priorReview.apply(this,arguments);setTimeout(()=>{const prefs=document.getElementById('reviewPrefs');if(prefs){[...prefs.querySelectorAll('.reviewRow')].forEach(row=>{const label=row.querySelector('span')?.textContent?.trim(),b=row.querySelector('b');if(label==='Style'){row.querySelector('span').textContent='Shaft transition';if(b){const q=b.querySelector('.quality');b.textContent=({smooth:'Smooth / gradual',neutral:'Moderate / neutral',aggressive:'Quick / aggressive',unknown:'Varies / not sure'})[state.transition]||'—';if(q)b.appendChild(q);}}if(label==='Priorities'&&b){const q=b.querySelector('.quality'),a=Number(state.driverPrioritySplit?.accuracy)||50,d=100-a;row.querySelector('span').textContent='Performance preference';b.textContent=`${d}% Distance · ${a}% Accuracy & forgiveness`;if(q)b.appendChild(q);}});}const strike=document.getElementById('reviewStrike');if(strike&&['heel','toe'].includes(state.strike)&&!strike.querySelector('[data-form-strike-source]')){const label=({confirmed:'Confirmed impact evidence',repeated:'Felt pattern',guess:'Mostly a guess','':'Unverified'})[state.strikeSource]||'Unverified';strike.insertAdjacentHTML('beforeend',`<div class="reviewRow" data-form-strike-source><span>Strike evidence</span><b>${label}<span class="quality">Source</span></b></div>`);}},0);return out;};}

  window.FORM_DRIVER_INTERVIEW_QUALITY_V153={version:'14.5',performancePriorities:['distance','accuracy'],prioritySplit:()=>({...state.driverPrioritySplit})};window.FORM_DRIVER_INTERVIEW_QUALITY_V150=window.FORM_DRIVER_INTERVIEW_QUALITY_V153;return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>240)clearInterval(t)},50);
})();