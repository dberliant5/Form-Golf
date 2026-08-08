// FORM 7.1 — driver input integrity and conflict guardrails
(function(){
'use strict';

const criticalGroups=['start','curve','costly','strike','lm','style','current'];
const pretty=v=>String(v??'').replace(/_/g,' ').replace(/\b\w/g,m=>m.toUpperCase()).replace('Two Way','Two-way');

function clearValidation(){document.getElementById('formInputWarning')?.remove();}
function warn(message,anchor){
  clearValidation();
  const el=document.createElement('div');el.id='formInputWarning';el.className='formInputWarning';el.innerHTML=`<b>Check this answer</b><span>${message}</span>`;
  (anchor||document.getElementById('flowNav')||document.querySelector('#driverExperience .mainPane'))?.insertAdjacentElement('beforebegin',el);
  el.scrollIntoView({block:'nearest',behavior:'smooth'});
}
function removePreset(group){
  document.querySelectorAll(`[data-group="${group}"] .opt`).forEach(x=>x.classList.remove('on'));
}
function resetCriticalAnswers(){
  state.start=null;state.curve=null;state.costly=null;state.strike=null;state.lm=null;state.style=null;state.current=null;
  criticalGroups.forEach(removePreset);
  clearValidation();
}

// A fresh fit should never inherit diagnostic answers that the golfer did not actively choose.
if(typeof openFit==='function'){
  const priorOpen=openFit;
  openFit=function(id){
    if(id==='driver')resetCriticalAnswers();
    const out=priorOpen(id);
    if(id==='driver')setTimeout(()=>criticalGroups.forEach(removePreset),20);
    return out;
  };
}

function metricAnswered(id){
  const m=state.metrics?.[id];
  if(!m||m.mode==='unknown')return true;
  return m.value!==null&&m.value!==''&&m.value!=='unknown';
}
function validateStep(){
  if(step===2&&!state.start)return 'Choose where your normal drive starts.';
  if(step===3&&!state.curve)return 'Choose the normal curvature of your drive.';
  if(step===4&&!state.costly)return 'Choose the miss that costs you the most.';
  if(step===4&&!state.strike)return 'Choose your typical strike location, or “I don’t know.”';
  if(step===5&&!state.lm)return 'Tell FORM how much launch-monitor information you know.';
  if(step===5&&state.lm!=='none'){
    const missing=['speed','spin','aoa','launch'].filter(id=>!metricAnswered(id));
    if(missing.length)return `Complete ${missing.map(id=>({speed:'club speed',spin:'driver spin',aoa:'attack angle',launch:'launch angle'})[id]).join(', ')} or change its Answer type to “Don’t know.”`;
  }
  if(step===7&&!state.style)return 'Choose a preference, including “No strong preference.”';
  if(step===8&&!state.current)return 'Tell FORM how well your current driver is working overall.';
  return null;
}
if(typeof next==='function'){
  const priorNext=next;
  next=function(){const msg=validateStep();if(msg){warn(msg);return;}clearValidation();return priorNext();};
}

function classifySpin(){
  const m=state.metrics?.spin;if(!m||m.mode==='unknown'||m.value==null)return null;
  if(m.mode==='exact'){const v=Number(m.value);return v<2100?'low':v>3000?'high':'mid';}
  if(m.mode==='range'){
    if(['under1500','1500-1749','1750-1999','2000-2249'].includes(m.value))return 'low';
    if(['3000-3499','3500plus'].includes(m.value))return 'high';
    return 'mid';
  }
  if(m.mode==='general')return ['verylow','low'].includes(m.value)?'low':['high','veryhigh'].includes(m.value)?'high':m.value==='varies'?'varies':'mid';
  return null;
}
function classifyLaunch(){
  const m=state.metrics?.launch;if(!m||m.mode==='unknown'||m.value==null)return null;
  if(m.mode==='exact'){const v=Number(m.value);return v<11?'low':v>17?'high':'mid';}
  if(m.mode==='range'){
    if(['under8','8-10','10-12'].includes(m.value))return 'low';
    if(['16-18','18-20','20plus'].includes(m.value))return 'high';
    return 'mid';
  }
  if(m.mode==='general')return ['verylow','low'].includes(m.value)?'low':['high','veryhigh'].includes(m.value)?'high':m.value==='varies'?'varies':'mid';
  return null;
}

function ensureConsistencyChoices(){
  const host=document.getElementById('problems');if(!host)return;
  if(!host.querySelector('[data-v="spin_varied"]'))host.insertAdjacentHTML('beforeend','<button data-v="spin_varied">Spin varies / inconsistent</button>');
  if(!host.querySelector('[data-v="launch_varied"]'))host.insertAdjacentHTML('beforeend','<button data-v="launch_varied">Launch varies / inconsistent</button>');
}
function normalizeExclusiveProblem(chosen){
  const groups={spin_low:['spin_high','spin_varied'],spin_high:['spin_low','spin_varied'],spin_varied:['spin_low','spin_high'],launch_low:['launch_high','launch_varied'],launch_high:['launch_low','launch_varied'],launch_varied:['launch_low','launch_high']};
  (groups[chosen]||[]).forEach(v=>{
    state.currentClub.problems=state.currentClub.problems.filter(x=>x!==v);
    document.querySelector(`#problems [data-v="${v}"]`)?.classList.remove('on');
  });
}
function conflictMessage(chosen){
  const s=classifySpin(),l=classifyLaunch();
  if(chosen==='spin_high'&&s==='low')return 'You reported low measured spin earlier. If spin sometimes jumps high and sometimes falls very low, choose “Spin varies / inconsistent” instead.';
  if(chosen==='spin_low'&&s==='high')return 'You reported high measured spin earlier. If spin varies substantially from strike to strike, choose “Spin varies / inconsistent” instead.';
  if(chosen==='launch_high'&&l==='low')return 'You reported a low launch window earlier. If launch varies substantially, choose “Launch varies / inconsistent” instead.';
  if(chosen==='launch_low'&&l==='high')return 'You reported a high launch window earlier. If launch varies substantially, choose “Launch varies / inconsistent” instead.';
  return null;
}

document.addEventListener('click',e=>{
  const b=e.target.closest('#problems [data-v]');if(!b)return;
  const v=b.dataset.v;
  setTimeout(()=>{
    const conflict=conflictMessage(v);
    if(conflict){
      state.currentClub.problems=state.currentClub.problems.filter(x=>x!==v);
      b.classList.remove('on');
      warn(conflict,document.getElementById('problems'));
      return;
    }
    normalizeExclusiveProblem(v);clearValidation();
  },0);
});

// Total distance is too condition-dependent to justify questionnaire space. Ball speed and
// carry remain optional supporting diagnostics on the existing technical page.
function pruneExtraMetrics(){
  if(state.metrics?.total)state.metrics.total={mode:'unknown',value:null};
  const totalSelect=document.querySelector('[data-extra70-mode="total"]');
  totalSelect?.closest('.metric70Box')?.remove();
  const intro=document.querySelector('.metric70Intro span');
  if(intro)intro.textContent='Optional. Ball speed can reveal strike efficiency; carry can help check whether launch and spin are translating into usable flight. Neither adds another fitting step.';
}

if(typeof renderLMInputs==='function'){
  const priorLM=renderLMInputs;
  renderLMInputs=function(){const out=priorLM();pruneExtraMetrics();return out;};
}
if(typeof renderStep==='function'){
  const priorStep=renderStep;
  renderStep=function(){const out=priorStep();clearValidation();if(step===8)ensureConsistencyChoices();if(step===5)pruneExtraMetrics();return out;};
}

// Add “varies” as a legitimate general technical description rather than forcing low/high.
if(typeof metricDefs!=='undefined'){
  if(metricDefs.spin?.general&&!metricDefs.spin.general.some(x=>x[0]==='varies'))metricDefs.spin.general.splice(metricDefs.spin.general.length-1,0,['varies','Varies significantly']);
  if(metricDefs.launch?.general&&!metricDefs.launch.general.some(x=>x[0]==='varies'))metricDefs.launch.general.splice(metricDefs.launch.general.length-1,0,['varies','Varies significantly']);
}

window.FORM_INPUT_GUARDS_V71={validateStep,classifySpin,classifyLaunch};
})();