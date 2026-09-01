// FORM 10.50 — interview quality calibration.
// Replaces a low-value abstract style step with transition/tempo for shaft configuration,
// and captures the source quality of heel/toe strike reports without adding a new step.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_INTERVIEW_QUALITY_V150)return true;
  if(typeof state==='undefined')return false;
  const step4=document.getElementById('step4'),step7=document.getElementById('step7');
  if(!step4||!step7)return false;
  state.strikeSource=state.strikeSource||'';
  state.transition=state.transition||'unknown';

  // ----- Strike source: ask how the golfer knows, not how confident they feel. -----
  let sourceBox=document.getElementById('strikeSourceV150');
  if(!sourceBox){
    sourceBox=document.createElement('div');sourceBox.id='strikeSourceV150';sourceBox.className='strikeSourceV150 hidden';
    sourceBox.innerHTML=`<div class="miniTitle" style="margin-top:22px">How do you know the strike location?</div>
      <p class="lead" style="margin-top:8px;margin-bottom:12px;font-size:13px">FORM trusts confirmed impact evidence more than a best guess. This changes how much heel-vs-toe specificity is used; it does not erase the fact that contact is off-center.</p>
      <div class="options three" data-strike-source-v150>
        <button class="opt" type="button" data-v="confirmed">Confirmed with spray / tape / impact data</button>
        <button class="opt" type="button" data-v="repeated">I repeatedly see or feel it there</button>
        <button class="opt" type="button" data-v="guess">Best guess</button>
      </div>`;
    const strikeGroup=step4.querySelector('[data-group="strike"]');strikeGroup?.insertAdjacentElement('afterend',sourceBox);
  }
  function syncSource(){
    const precise=['heel','toe'].includes(state.strike);
    sourceBox.classList.toggle('hidden',!precise);
    sourceBox.querySelectorAll('.opt').forEach(b=>b.classList.toggle('on',b.dataset.v===state.strikeSource));
    if(!precise)state.strikeSource='';
  }
  sourceBox.querySelectorAll('[data-strike-source-v150] .opt').forEach(b=>b.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();state.strikeSource=b.dataset.v;syncSource();
  },true));
  const strikeGroup=step4.querySelector('[data-group="strike"]');
  strikeGroup?.addEventListener('click',()=>setTimeout(syncSource,0),true);
  syncSource();

  // ----- Replace abstract style preference with transition/tempo. -----
  step7.innerHTML=`<div class="eyebrow">Shaft starting point</div>
    <h1>How would you describe your transition from the top?</h1>
    <p class="lead">This does not change which driver head fits you best. It helps FORM make the shaft starting point less generic.</p>
    <div class="options" data-transition-v150>
      <button class="opt" type="button" data-v="smooth">Smooth / gradual</button>
      <button class="opt" type="button" data-v="neutral">Moderate / neutral</button>
      <button class="opt" type="button" data-v="aggressive">Quick / aggressive</button>
      <button class="opt on" type="button" data-v="unknown">Varies / not sure</button>
    </div>
    <div class="note">Transition is used only for the recommended shaft profile and weight window—not the absolute FORM Fit Score.</div>`;
  function syncTransition(){step7.querySelectorAll('.opt').forEach(b=>b.classList.toggle('on',b.dataset.v===state.transition));}
  step7.querySelectorAll('[data-transition-v150] .opt').forEach(b=>b.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();state.transition=b.dataset.v;syncTransition();
  },true));
  syncTransition();

  // Clarify the six-way ranking until the ranking UI itself is simplified.
  const step6=document.getElementById('step6');
  if(step6){
    const lead=step6.querySelector('.lead');if(lead)lead.textContent='Rank what matters to you. Accuracy/forgiveness, distance and ball flight set the performance emphasis. Feel, looks and value are preference context and should not distort the underlying head-fit score.';
    const note=step6.querySelector('.note');if(note)note.textContent='FORM preserves your full preference order, but only performance priorities change absolute head-fit weighting. Preference priorities are used separately when comparing close fits and purchase context.';
  }

  // Keep the review screen honest about what Step 7 now captures.
  const priorReview=typeof window.renderReview==='function'?window.renderReview:null;
  if(priorReview){
    window.renderReview=function(){
      const out=priorReview.apply(this,arguments);
      setTimeout(()=>{
        const prefs=document.getElementById('reviewPrefs');if(!prefs)return;
        [...prefs.querySelectorAll('.reviewRow')].forEach(row=>{
          const label=row.querySelector('span');if(label?.textContent?.trim()==='Style'){
            label.textContent='Shaft transition';const b=row.querySelector('b');if(b)b.childNodes[0].nodeValue=({smooth:'Smooth / gradual',neutral:'Moderate / neutral',aggressive:'Quick / aggressive',unknown:'Varies / not sure'})[state.transition]||'Varies / not sure';
          }
        });
        const strike=document.getElementById('reviewStrike');
        if(strike&&['heel','toe'].includes(state.strike)&&!strike.querySelector('[data-form-strike-source]')){
          const label=({confirmed:'Confirmed impact evidence',repeated:'Repeatedly seen / felt',guess:'Best guess','':'Unverified'})[state.strikeSource]||'Unverified';
          strike.insertAdjacentHTML('beforeend',`<div class="reviewRow" data-form-strike-source><span>Strike evidence</span><b>${label}<span class="quality">Source</span></b></div>`);
        }
      },0);
      return out;
    };
  }
  window.FORM_DRIVER_INTERVIEW_QUALITY_V150={version:'10.50'};
  return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>240)clearInterval(t);},50);
})();
