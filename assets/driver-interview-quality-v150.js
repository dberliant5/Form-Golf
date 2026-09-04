// FORM 10.89 — interview quality calibration.
// Captures strike-source quality, uses transition/tempo for shaft guidance,
// and keeps performance priorities separate from preference logic.
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
  const brand=document.getElementById('brandQuestion');
  if(brand){const all=brand.querySelector('[data-brand-mode="all"] b');if(all)all.textContent='All brands — recommended';brand.querySelectorAll('.brandMode').forEach(x=>x.classList.remove('active'));}
  let sourceBox=document.getElementById('strikeSourceV150');
  if(!sourceBox){sourceBox=document.createElement('div');sourceBox.id='strikeSourceV150';sourceBox.className='strikeSourceV150 hidden';sourceBox.innerHTML=`<div class="miniTitle" style="margin-top:22px">How do you know the strike location?</div><p class="lead" style="margin-top:8px;margin-bottom:12px;font-size:13px">FORM trusts confirmed impact evidence more than a best guess. This changes how much heel-vs-toe specificity is used; it does not erase the fact that contact is off-center.</p><div class="options three" data-strike-source-v150><button class="opt" type="button" data-v="confirmed">Confirmed with spray / tape / impact data</button><button class="opt" type="button" data-v="repeated">I think that’s what I’m feeling</button><button class="opt" type="button" data-v="guess">Mostly a guess</button></div>`;const strikeGroup=step4.querySelector('[data-group="strike"]');strikeGroup?.insertAdjacentElement('afterend',sourceBox);}
  function syncSource(){const precise=['heel','toe'].includes(state.strike);sourceBox.classList.toggle('hidden',!precise);sourceBox.querySelectorAll('.opt').forEach(b=>b.classList.toggle('on',b.dataset.v===state.strikeSource));if(!precise)state.strikeSource='';}
  sourceBox.querySelectorAll('[data-strike-source-v150] .opt').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();state.strikeSource=b.dataset.v;syncSource();},true));
  const strikeGroup=step4.querySelector('[data-group="strike"]');strikeGroup?.addEventListener('click',()=>setTimeout(syncSource,0),true);syncSource();
  const PERF=[['accuracy','Accuracy / forgiveness','Keep misses tighter and protect off-center strikes'],['distance','Distance','Maximize useful distance'],['flight','Ball flight','Get launch and spin into the right window']];
  step6.querySelector('h1').textContent='What matters most in driver performance?';
  step6.querySelector('.lead').textContent='Rank the three performance outcomes in the order that matters most to you.';
  const note=step6.querySelector('.note');if(note)note.textContent='#1 carries the most emphasis. FORM still evaluates all three.';
  function perfOrder(){return PERF.map(x=>x[0]).sort((a,b)=>(Number(state.ranks?.[a])||99)-(Number(state.ranks?.[b])||99));}
  function normalizePerfRanks(){const o=perfOrder();o.forEach((k,i)=>state.ranks[k]=i+1);state.ranks.feel=4;state.ranks.looks=5;state.ranks.value=6;}
  function renderPerformancePriorities(){normalizePerfRanks();const box=document.getElementById('priorityRank');if(!box)return;box.innerHTML=PERF.map(([id,label,sub])=>`<div class="priorityItem"><div><b>${label}</b><small>${sub}</small></div><div class="rankSelectWrap"><select data-perf-rank="${id}">${[1,2,3].map(n=>`<option value="${n}" ${state.ranks[id]===n?'selected':''}>${n}</option>`).join('')}</select></div></div>`).join('');box.querySelectorAll('[data-perf-rank]').forEach(sel=>sel.onchange=()=>{const id=sel.dataset.perfRank,next=Number(sel.value),old=state.ranks[id];const swap=PERF.map(x=>x[0]).find(k=>k!==id&&state.ranks[k]===next);state.ranks[id]=next;if(swap)state.ranks[swap]=old;renderPerformancePriorities();});}
  window.initPriorityRank=renderPerformancePriorities;renderPerformancePriorities();
  step7.innerHTML=`<div class="eyebrow">Shaft starting point</div><h1>How would you describe your transition from the top?</h1><p class="lead">This does not change which driver head fits you best. It helps FORM make the shaft starting point less generic.</p><div class="options" data-transition-v150><button class="opt" type="button" data-v="smooth">Smooth / gradual</button><button class="opt" type="button" data-v="neutral">Moderate / neutral</button><button class="opt" type="button" data-v="aggressive">Quick / aggressive</button><button class="opt" type="button" data-v="unknown">Varies / not sure</button></div><div class="note">Transition is used only for the recommended shaft profile and weight window—not the absolute FORM Fit Score.</div>`;
  function syncTransition(){step7.querySelectorAll('.opt').forEach(b=>b.classList.toggle('on',!!state.transition&&b.dataset.v===state.transition));}
  step7.querySelectorAll('[data-transition-v150] .opt').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();state.transition=b.dataset.v;state.style=b.dataset.v;syncTransition();document.getElementById('formInputWarning')?.remove();},true));syncTransition();
  const priorReview=typeof window.renderReview==='function'?window.renderReview:null;
  if(priorReview){window.renderReview=function(){const out=priorReview.apply(this,arguments);setTimeout(()=>{const prefs=document.getElementById('reviewPrefs');if(prefs){[...prefs.querySelectorAll('.reviewRow')].forEach(row=>{const label=row.querySelector('span')?.textContent?.trim(),b=row.querySelector('b');if(label==='Style'){row.querySelector('span').textContent='Shaft transition';if(b){const q=b.querySelector('.quality');b.textContent=({smooth:'Smooth / gradual',neutral:'Moderate / neutral',aggressive:'Quick / aggressive',unknown:'Varies / not sure'})[state.transition]||'—';if(q)b.appendChild(q);}}if(label==='Priorities'&&b){const q=b.querySelector('.quality');const labels={accuracy:'Accuracy / forgiveness',distance:'Distance',flight:'Ball flight'};b.textContent=perfOrder().map((k,i)=>`#${i+1} ${labels[k]}`).join(', ');if(q)b.appendChild(q);}});}const strike=document.getElementById('reviewStrike');if(strike&&['heel','toe'].includes(state.strike)&&!strike.querySelector('[data-form-strike-source]')){const label=({confirmed:'Confirmed impact evidence',repeated:'Felt pattern',guess:'Mostly a guess','':'Unverified'})[state.strikeSource]||'Unverified';strike.insertAdjacentHTML('beforeend',`<div class="reviewRow" data-form-strike-source><span>Strike evidence</span><b>${label}<span class="quality">Source</span></b></div>`);}},0);return out;};}
  window.FORM_DRIVER_INTERVIEW_QUALITY_V153={version:'10.89',performancePriorities:PERF.map(x=>x[0])};window.FORM_DRIVER_INTERVIEW_QUALITY_V150=window.FORM_DRIVER_INTERVIEW_QUALITY_V153;return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>240)clearInterval(t)},50);
})();