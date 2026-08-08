// FORM 7.3 — guided driver interview, input integrity, and precision controls
(function(){
'use strict';

const criticalGroups=['start','curve','costly','strike','lm','style','current'];
const coreMetricIds=['speed','spin','aoa','launch'];
let lastLmRoute73=null;

function injectStyles73(){
  if(document.getElementById('formGuided73Styles'))return;
  const s=document.createElement('style');s.id='formGuided73Styles';s.textContent=`
  .metricPrecisionHelp{max-width:820px!important;margin-bottom:16px!important}
  .metric73{display:grid;grid-template-columns:150px minmax(290px,1fr) minmax(300px,1.2fr);gap:18px;align-items:center;padding:20px 0;border-bottom:1px solid var(--line)}
  .metric73:last-child{border-bottom:0}.metric73Label b{display:block;font-size:13px}.metric73Label span{display:block;margin-top:4px;font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}
  .metric73Modes{display:flex;gap:6px;flex-wrap:wrap}.metric73Mode{border:1px solid var(--line);background:#fff;color:var(--muted);padding:9px 10px;font-size:9px;font-weight:800;letter-spacing:.035em;cursor:pointer}.metric73Mode.on{background:var(--deep);border-color:var(--deep);color:#fff}
  .metric73Answer{min-height:46px;display:flex;align-items:center}.metric73InputWrap{display:flex;align-items:center;width:100%}.metric73Input{height:46px;width:100%;border:1px solid var(--line);padding:0 12px;font-size:14px;color:var(--deep);background:#fff}.metric73Unit{margin-left:8px;font-size:10px;color:var(--muted);min-width:35px}.metric73Choices{display:flex;gap:6px;flex-wrap:wrap}.metric73Choice{border:1px solid var(--line);background:#fff;padding:8px 10px;font-size:10px;color:var(--deep);cursor:pointer}.metric73Choice.on{background:var(--sage,#eef3ee);border-color:var(--deep)}
  .metric73Sign{display:flex;margin-right:7px}.metric73Sign button{height:46px;min-width:38px;border:1px solid var(--line);background:#fff}.metric73Sign button.on{background:var(--deep);color:#fff}.metric73Unknown{font-size:11px;color:var(--muted);font-style:italic}
  .metric73Optional{margin-top:18px;padding-top:8px}.metric73OptionalHead{font-size:11px;color:var(--muted);line-height:1.5;margin:0 0 4px}.metric73OptionalHead b{color:var(--deep)}
  .formInputWarning{margin:16px 0;padding:13px 15px;background:#fff7e7;border:1px solid #ead7a8;display:grid;gap:3px}.formInputWarning b{font-size:10px;text-transform:uppercase;letter-spacing:.07em}.formInputWarning span{font-size:11px;line-height:1.5;color:var(--muted)}
  @media(max-width:800px){.metric73{grid-template-columns:1fr;gap:10px;align-items:start}.metric73Modes{order:2}.metric73Answer{order:3}.metric73Label{order:1}.metric73Choice{flex:1 1 auto}.metric73Mode{flex:1 1 calc(50% - 6px);text-align:center}}
  `;document.head.appendChild(s);
}
injectStyles73();

function clearValidation(){document.getElementById('formInputWarning')?.remove();}
function warn(message,anchor){
  clearValidation();
  const el=document.createElement('div');el.id='formInputWarning';el.className='formInputWarning';el.innerHTML=`<b>Check this answer</b><span>${message}</span>`;
  const target=anchor||document.getElementById('flowNav')||document.querySelector('#driverExperience .mainPane');
  target?.insertAdjacentElement('beforebegin',el);el.scrollIntoView({block:'center',behavior:'smooth'});
}
function removePreset(group){document.querySelectorAll(`[data-group="${group}"] .opt`).forEach(x=>x.classList.remove('on'));}
function resetCriticalAnswers(){
  state.start=null;state.curve=null;state.costly=null;state.strike=null;state.lm=null;state.style=null;state.current=null;
  criticalGroups.forEach(removePreset);clearValidation();lastLmRoute73=null;
}
if(typeof openFit==='function'){
  const priorOpen=openFit;
  openFit=function(id){if(id==='driver')resetCriticalAnswers();const out=priorOpen(id);if(id==='driver')setTimeout(()=>criticalGroups.forEach(removePreset),20);return out;};
}

function guidedScroll(target,delay=80){
  if(!target)return;requestAnimationFrame(()=>setTimeout(()=>target.scrollIntoView({behavior:'smooth',block:'center'}),delay));
}
function continueTarget(){return document.getElementById('flowNav');}
function nextMetricBox(id){
  const order=['speed','spin','aoa','launch','ballSpeed','carry'];
  const i=order.indexOf(id);if(i<0)return continueTarget();
  for(let j=i+1;j<order.length;j++){const el=document.querySelector(`.metric73[data-metric73="${order[j]}"]`);if(el)return el;}
  return continueTarget();
}
function scrollAfterMainAnswer(group){
  if(group==='lm')return;
  if(step===4&&group==='costly')return guidedScroll(document.querySelector('[data-group="strike"]'));
  if(step===4&&group==='strike')return guidedScroll(continueTarget());
  if(step===8&&group==='current')return guidedScroll(document.getElementById('problems'));
  if(['start','curve','style'].includes(group))return guidedScroll(continueTarget());
}
document.addEventListener('click',e=>{
  const opt=e.target.closest('#driverExperience [data-group] .opt');
  if(opt){const group=opt.closest('[data-group]')?.dataset.group;if(group==='lm'){if(opt.dataset.v!=='none')guidedScroll(document.getElementById('lmInputs'),100);else guidedScroll(continueTarget());}else scrollAfterMainAnswer(group);}
});

function modeButtons(id,mode,allowed=['exact','range','general','unknown']){
  const labels={exact:'Exact',range:'Approx. range',general:'General',unknown:'I don’t know'};
  return `<div class="metric73Modes">${allowed.map(v=>`<button type="button" class="metric73Mode ${mode===v?'on':''}" data-m73-mode="${id}" data-mode="${v}">${labels[v]}</button>`).join('')}</div>`;
}
function rangeChoices(id,items,value){return `<div class="metric73Choices">${items.filter(x=>x[0]!=='unknown').map(x=>`<button type="button" class="metric73Choice ${value===x[0]?'on':''}" data-m73-choice="${id}" data-value="${x[0]}">${x[1]}</button>`).join('')}</div>`;}
function exactAnswer(id,def,m){
  if(id==='aoa'){
    const v=m.value==null?'':Number(m.value),neg=v!==''&&v<0,abs=v===''?'':Math.abs(v);
    return `<div class="metric73InputWrap"><div class="metric73Sign"><button type="button" class="${neg?'on':''}" data-m73-sign="-">−</button><button type="button" class="${!neg?'on':''}" data-m73-sign="+">+</button></div><input class="metric73Input" data-m73-input="${id}" type="number" inputmode="decimal" min="0" max="10" step="0.1" placeholder="${def.exact}" value="${abs}"><span class="metric73Unit">${def.unit}</span></div>`;
  }
  return `<div class="metric73InputWrap"><input class="metric73Input" data-m73-input="${id}" type="number" inputmode="${def.decimals?'decimal':'numeric'}" min="${def.min}" max="${def.max}" step="${def.step}" placeholder="${def.exact}" value="${m.value??''}"><span class="metric73Unit">${def.unit}</span></div>`;
}
function coreMetric73(id){
  const def=metricDefs[id],m=state.metrics[id]||{mode:'unknown',value:null},mode=m.mode||'unknown';
  let answer='<div class="metric73Unknown">Not used in the fit.</div>';
  if(mode==='exact')answer=exactAnswer(id,def,m);
  if(mode==='range')answer=rangeChoices(id,def.range,m.value);
  if(mode==='general')answer=rangeChoices(id,def.general,m.value);
  return `<div class="metric73" data-metric73="${id}"><div class="metric73Label"><b>${def.label}</b><span>${def.unit}</span></div>${modeButtons(id,mode)}<div class="metric73Answer">${answer}</div></div>`;
}
const ballSpeedRanges=[['under120','Under 120'],['120-129','120–129'],['130-139','130–139'],['140-149','140–149'],['150-159','150–159'],['160-169','160–169'],['170plus','170+']];
const carryRanges=[['under180','Under 180'],['180-199','180–199'],['200-219','200–219'],['220-239','220–239'],['240-259','240–259'],['260-279','260–279'],['280plus','280+']];
function optionalMetric73(id,label,unit,ranges,allowExact){
  const m=state.metrics[id]||{mode:'unknown',value:null},allowed=allowExact?['exact','range','unknown']:['range','unknown'];
  let answer='<div class="metric73Unknown">Not used in the fit.</div>';
  if(m.mode==='range')answer=rangeChoices(id,ranges,m.value);
  if(m.mode==='exact'&&allowExact)answer=`<div class="metric73InputWrap"><input class="metric73Input" data-m73-input="${id}" type="number" inputmode="numeric" min="70" max="220" step="1" placeholder="e.g. 143" value="${m.value??''}"><span class="metric73Unit">${unit}</span></div>`;
  return `<div class="metric73" data-metric73="${id}"><div class="metric73Label"><b>${label}</b><span>${unit} · optional</span></div>${modeButtons(id,m.mode||'unknown',allowed)}<div class="metric73Answer">${answer}</div></div>`;
}
function seedLmModes(route){
  const seed=route==='exact'?'exact':route==='general'?'general':'range';
  coreMetricIds.forEach(id=>state.metrics[id]={mode:seed,value:null});
  state.metrics.ballSpeed={mode:'range',value:null};
  state.metrics.carry={mode:'range',value:null};
  state.metrics.total={mode:'unknown',value:null};
}
function bindMetric73(){
  document.querySelectorAll('[data-m73-mode]').forEach(btn=>btn.onclick=()=>{
    const id=btn.dataset.m73Mode,mode=btn.dataset.mode;state.metrics[id]={mode,value:null};renderLMInputs();
    if(mode==='unknown')guidedScroll(nextMetricBox(id));else guidedScroll(document.querySelector(`.metric73[data-metric73="${id}"] .metric73Answer`),40);
  });
  document.querySelectorAll('[data-m73-choice]').forEach(btn=>btn.onclick=()=>{
    const id=btn.dataset.m73Choice;state.metrics[id].value=btn.dataset.value;btn.closest('.metric73Choices')?.querySelectorAll('.metric73Choice').forEach(x=>x.classList.remove('on'));btn.classList.add('on');guidedScroll(nextMetricBox(id),100);
  });
  document.querySelectorAll('[data-m73-input]').forEach(inp=>{
    const save=()=>{
      const id=inp.dataset.m73Input;if(inp.value===''){state.metrics[id].value=null;return;}
      let v=Number(inp.value);if(!Number.isFinite(v))return;
      if(id==='aoa'){const sign=inp.closest('.metric73')?.querySelector('[data-m73-sign].on')?.dataset.m73Sign||'+';v=(sign==='-'?-1:1)*Math.abs(v);}state.metrics[id].value=v;
    };
    inp.oninput=save;inp.onkeydown=e=>{if(e.key==='Enter'){save();inp.blur();guidedScroll(nextMetricBox(inp.dataset.m73Input));}};inp.onblur=()=>{save();if(state.metrics[inp.dataset.m73Input].value!=null)guidedScroll(nextMetricBox(inp.dataset.m73Input),80);};
  });
  document.querySelectorAll('[data-m73-sign]').forEach(btn=>btn.onclick=()=>{const wrap=btn.closest('.metric73');wrap.querySelectorAll('[data-m73-sign]').forEach(x=>x.classList.remove('on'));btn.classList.add('on');const inp=wrap.querySelector('[data-m73-input="aoa"]');if(inp&&inp.value!=='')state.metrics.aoa.value=(btn.dataset.m73Sign==='-'?-1:1)*Math.abs(Number(inp.value));});
}

// Final technical-input renderer: precision choice sits next to Don't know, answer appears to the right.
renderLMInputs=function(){
  const box=document.getElementById('lmInputs');if(!box)return;
  if(!state.metrics)state.metrics={};
  if(state.lm==='none'||!state.lm){coreMetricIds.forEach(id=>state.metrics[id]={mode:'unknown',value:null});state.metrics.ballSpeed={mode:'unknown',value:null};state.metrics.carry={mode:'unknown',value:null};box.innerHTML=state.lm==='none'?'<div class="derived"><b>No launch-monitor data needed.</b><br>FORM will fit from ball flight, strike pattern, priorities and current equipment.</div>':'';lastLmRoute73=state.lm;return;}
  if(state.lm!==lastLmRoute73){seedLmModes(state.lm);lastLmRoute73=state.lm;}
  box.innerHTML=`<div class="metricPrecisionHelp"><b>Use the precision you actually know.</b> Exact means a reliable launch-monitor average—not one swing. Range is the default when your numbers vary. General is useful when you know the pattern but not the number.</div>${coreMetricIds.map(coreMetric73).join('')}<div class="metric73Optional"><div class="metric73OptionalHead"><b>Optional performance outputs.</b> Ball speed can help FORM understand strike efficiency. Carry is range-only because real drives naturally vary.</div>${optionalMetric73('ballSpeed','Ball speed','mph',ballSpeedRanges,true)}${optionalMetric73('carry','Carry distance','yds',carryRanges,false)}</div>`;
  bindMetric73();
};

function metricAnswered(id){const m=state.metrics?.[id];if(!m||m.mode==='unknown')return true;return m.value!==null&&m.value!==''&&m.value!=='unknown';}
function numericExtra(id){const m=state.metrics?.[id];return m?.mode==='exact'&&m.value!=null?Number(m.value):null;}
function validatePlausibility(){
  const speed=state.metrics?.speed?.mode==='exact'?Number(state.metrics.speed.value):null,ball=numericExtra('ballSpeed');
  if(ball!=null&&(ball<70||ball>220))return 'Ball speed should be between 70 and 220 mph. Recheck the average or use an approximate range.';
  if(speed&&ball){const ratio=ball/speed;if(ratio<.80||ratio>1.55)return `The club-speed / ball-speed combination implies a ${ratio.toFixed(2)} speed ratio, outside FORM’s plausible range. Recheck one number or use ranges.`;}
  return null;
}
function validateStep(){
  if(step===2&&!state.start)return 'Choose where your normal drive starts.';
  if(step===3&&!state.curve)return 'Choose the normal curvature of your drive.';
  if(step===4&&!state.costly)return 'Choose the miss that costs you the most.';
  if(step===4&&!state.strike)return 'Choose your typical strike location, or “I don’t know.”';
  if(step===5&&!state.lm)return 'Tell FORM how much launch-monitor information you know.';
  if(step===5&&state.lm!=='none'){
    const missing=coreMetricIds.filter(id=>!metricAnswered(id));
    if(missing.length)return `Complete ${missing.map(id=>({speed:'club speed',spin:'driver spin',aoa:'attack angle',launch:'launch angle'})[id]).join(', ')} or choose “I don’t know.”`;
    const plausibility=validatePlausibility();if(plausibility)return plausibility;
  }
  if(step===7&&!state.style)return 'Choose a preference, including “No strong preference.”';
  if(step===8&&!state.current)return 'Tell FORM how well your current driver is working overall.';
  return null;
}
if(typeof next==='function'){
  const priorNext=next;next=function(){const msg=validateStep();if(msg){warn(msg);return;}clearValidation();return priorNext();};
}

function classifySpin(){
  const m=state.metrics?.spin;if(!m||m.mode==='unknown'||m.value==null)return null;
  if(m.mode==='exact'){const v=Number(m.value);return v<2100?'low':v>3000?'high':'mid';}
  if(m.mode==='range'){if(['under1500','1500-1749','1750-1999','2000-2249'].includes(m.value))return 'low';if(['3000-3499','3500plus'].includes(m.value))return 'high';return 'mid';}
  if(m.mode==='general')return ['verylow','low'].includes(m.value)?'low':['high','veryhigh'].includes(m.value)?'high':m.value==='varies'?'varies':'mid';return null;
}
function classifyLaunch(){
  const m=state.metrics?.launch;if(!m||m.mode==='unknown'||m.value==null)return null;
  if(m.mode==='exact'){const v=Number(m.value);return v<11?'low':v>17?'high':'mid';}
  if(m.mode==='range'){if(['under8','8-10','10-12'].includes(m.value))return 'low';if(['16-18','18-20','20plus'].includes(m.value))return 'high';return 'mid';}
  if(m.mode==='general')return ['verylow','low'].includes(m.value)?'low':['high','veryhigh'].includes(m.value)?'high':m.value==='varies'?'varies':'mid';return null;
}
function ensureConsistencyChoices(){
  const host=document.getElementById('problems');if(!host)return;
  if(!host.querySelector('[data-v="spin_varied"]'))host.insertAdjacentHTML('beforeend','<button data-v="spin_varied">Spin varies / inconsistent</button>');
  if(!host.querySelector('[data-v="launch_varied"]'))host.insertAdjacentHTML('beforeend','<button data-v="launch_varied">Launch varies / inconsistent</button>');
}
function normalizeExclusiveProblem(chosen){
  const groups={spin_low:['spin_high','spin_varied'],spin_high:['spin_low','spin_varied'],spin_varied:['spin_low','spin_high'],launch_low:['launch_high','launch_varied'],launch_high:['launch_low','launch_varied'],launch_varied:['launch_low','launch_high']};
  (groups[chosen]||[]).forEach(v=>{state.currentClub.problems=state.currentClub.problems.filter(x=>x!==v);document.querySelector(`#problems [data-v="${v}"]`)?.classList.remove('on');});
}
function conflictMessage(chosen){
  const s=classifySpin(),l=classifyLaunch();
  if(chosen==='spin_high'&&s==='low')return 'You reported low spin earlier. If spin sometimes jumps high and sometimes falls very low, choose “Spin varies / inconsistent” instead.';
  if(chosen==='spin_low'&&s==='high')return 'You reported high spin earlier. If spin varies substantially, choose “Spin varies / inconsistent” instead.';
  if(chosen==='launch_high'&&l==='low')return 'You reported low launch earlier. If launch varies substantially, choose “Launch varies / inconsistent” instead.';
  if(chosen==='launch_low'&&l==='high')return 'You reported high launch earlier. If launch varies substantially, choose “Launch varies / inconsistent” instead.';return null;
}
document.addEventListener('click',e=>{
  const b=e.target.closest('#problems [data-v]');if(!b)return;const v=b.dataset.v;
  if(['spin_varied','launch_varied'].includes(v)){const on=!b.classList.contains('on');b.classList.toggle('on',on);state.currentClub.problems=state.currentClub.problems.filter(x=>x!==v);if(on)state.currentClub.problems.push(v);}
  setTimeout(()=>{const conflict=conflictMessage(v);if(conflict){state.currentClub.problems=state.currentClub.problems.filter(x=>x!==v);b.classList.remove('on');warn(conflict,document.getElementById('problems'));return;}if(b.classList.contains('on'))normalizeExclusiveProblem(v);clearValidation();},0);
});

if(typeof metricDefs!=='undefined'){
  if(metricDefs.spin?.general&&!metricDefs.spin.general.some(x=>x[0]==='varies'))metricDefs.spin.general.splice(metricDefs.spin.general.length-1,0,['varies','Varies significantly']);
  if(metricDefs.launch?.general&&!metricDefs.launch.general.some(x=>x[0]==='varies'))metricDefs.launch.general.splice(metricDefs.launch.general.length-1,0,['varies','Varies significantly']);
}
if(typeof renderStep==='function'){
  const priorStep=renderStep;renderStep=function(){const out=priorStep();clearValidation();if(step===8)ensureConsistencyChoices();if(step===5)renderLMInputs();return out;};
}
window.FORM_INPUT_GUARDS_V73={validateStep,classifySpin,classifyLaunch,validatePlausibility,guidedScroll};
})();