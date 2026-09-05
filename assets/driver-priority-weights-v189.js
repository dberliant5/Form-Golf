// FORM 10.92 — two-axis user priorities: Distance vs Accuracy.
// Replaces the old ranked priority UI. Ball flight remains a fitting need derived from delivery data,
// not a user preference. Total priority influence stays fixed so changing the balance does not inflate fit scores.
(function(){'use strict';
if(window.FORM_DRIVER_PRIORITY_WEIGHTS_V189)return;

function init(){
  if(window.FORM_DRIVER_PRIORITY_WEIGHTS_V189)return true;
  if(typeof state==='undefined'||typeof golfer!=='function'||typeof initPriorityRank!=='function'||typeof rankedWeight!=='function')return false;

  if(!state.priorityWeights)state.priorityWeights={distance:50,accuracy:50};
  const clamp=v=>Math.max(0,Math.min(100,Math.round((Number(v)||0)/5)*5));
  function normalize(){
    let d=clamp(state.priorityWeights?.distance),a=clamp(state.priorityWeights?.accuracy);
    if(!Number.isFinite(d)||!Number.isFinite(a)){d=50;a=50;}
    const total=d+a;
    if(total!==100){
      if(total<=0){d=50;a=50;}else{d=Math.round((d/total)*20)*5;a=100-d;}
    }
    state.priorityWeights={distance:d,accuracy:a};
    if(state.ranks){
      state.ranks.distance=d>a?1:d<a?2:1;
      state.ranks.accuracy=a>d?1:a<d?2:1;
      state.ranks.flight=3;
      state.ranks.feel=4;state.ranks.looks=5;state.ranks.value=6;
    }
    return state.priorityWeights;
  }
  normalize();

  const priorGolfer=golfer;
  golfer=function(){
    const g=priorGolfer();const w=normalize();
    return {...g,priorityWeights:{distance:w.distance,accuracy:w.accuracy}};
  };

  // Preserve roughly the same total influence as the previous #1 + #2 priority weights (7 + 5 = 12),
  // but distribute that fixed influence continuously according to the golfer's chosen 100-point balance.
  rankedWeight=function(g,id){
    const w=g?.priorityWeights||state.priorityWeights||{distance:50,accuracy:50};
    if(id==='distance')return (Number(w.distance)||0)/100*12;
    if(id==='accuracy')return (Number(w.accuracy)||0)/100*12;
    return 0;
  };

  function syncFrom(id,value){
    const v=clamp(value);if(id==='distance'){state.priorityWeights.distance=v;state.priorityWeights.accuracy=100-v;}else{state.priorityWeights.accuracy=v;state.priorityWeights.distance=100-v;}
    normalize();initPriorityRank();
  }

  initPriorityRank=function(){
    const box=document.getElementById('priorityRank');if(!box)return;
    const w=normalize(),step=document.getElementById('step6');
    const h=step?.querySelector('h1'),lead=step?.querySelector('.lead'),note=step?.querySelector('.note');
    if(h)h.textContent='How do you want to balance distance and accuracy?';
    if(lead)lead.textContent='Set the importance of each. The two weights always total 100%. Launch, spin and ball flight are fitted from your delivery data rather than treated as a separate preference.';
    if(note)note.textContent='50 / 50 means equal importance. Moving either slider automatically adjusts the other so the total remains 100%.';
    box.innerHTML=`<div class="priorityWeightSummary"><div><span>Distance</span><b>${w.distance}%</b></div><div class="priorityWeightVs">vs</div><div><span>Accuracy</span><b>${w.accuracy}%</b></div></div><div class="priorityWeightRows"><label class="priorityWeightRow"><div><b>Distance</b><small>Useful carry and ball-speed output</small></div><div class="priorityWeightControl"><input type="range" min="0" max="100" step="5" value="${w.distance}" data-pweight="distance" aria-label="Distance priority weight"><span>${w.distance}%</span></div></label><label class="priorityWeightRow"><div><b>Accuracy</b><small>Dispersion, forgiveness and protection of your normal miss</small></div><div class="priorityWeightControl"><input type="range" min="0" max="100" step="5" value="${w.accuracy}" data-pweight="accuracy" aria-label="Accuracy priority weight"><span>${w.accuracy}%</span></div></label></div><div class="priorityWeightPresets"><button type="button" data-preset="30">Distance 30 · Accuracy 70</button><button type="button" data-preset="50">50 / 50</button><button type="button" data-preset="70">Distance 70 · Accuracy 30</button></div>`;
    box.querySelectorAll('[data-pweight]').forEach(inp=>inp.oninput=()=>syncFrom(inp.dataset.pweight,inp.value));
    box.querySelectorAll('[data-preset]').forEach(btn=>btn.onclick=()=>syncFrom('distance',btn.dataset.preset));
  };

  const priorReview=typeof renderReview==='function'?renderReview:null;
  if(priorReview)renderReview=function(){
    priorReview();const w=normalize(),prefs=document.getElementById('reviewPrefs');if(!prefs)return;
    const row=[...prefs.querySelectorAll('.reviewRow')].find(x=>/^Priorities$/i.test(x.querySelector('span')?.textContent?.trim()||''));
    if(row){const b=row.querySelector('b');if(b)b.innerHTML=`Distance ${w.distance}% · Accuracy ${w.accuracy}%<span class="quality">Weighted</span>`;}
  };

  if(!document.getElementById('formPriorityWeights189Styles')){
    const s=document.createElement('style');s.id='formPriorityWeights189Styles';s.textContent=`
    .priorityWeightSummary{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:16px;border:1px solid var(--line);background:#fafbf8;padding:18px;margin:20px 0 14px}.priorityWeightSummary>div:not(.priorityWeightVs){display:flex;justify-content:space-between;align-items:baseline;gap:12px}.priorityWeightSummary span{font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:var(--muted);font-weight:800}.priorityWeightSummary b{font-size:24px}.priorityWeightVs{font-size:9px;text-transform:uppercase;color:var(--muted);letter-spacing:.12em}.priorityWeightRows{border:1px solid var(--line);background:#fff}.priorityWeightRow{display:grid;grid-template-columns:minmax(180px,.8fr) minmax(220px,1.2fr);gap:24px;align-items:center;padding:18px;border-bottom:1px solid var(--line)}.priorityWeightRow:last-child{border-bottom:0}.priorityWeightRow b{display:block;font-size:14px}.priorityWeightRow small{display:block;margin-top:4px;color:var(--muted);font-size:9px;line-height:1.45}.priorityWeightControl{display:grid;grid-template-columns:1fr 46px;gap:12px;align-items:center}.priorityWeightControl input{width:100%;accent-color:var(--deep)}.priorityWeightControl span{text-align:right;font-weight:800;font-size:13px}.priorityWeightPresets{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.priorityWeightPresets button{border:1px solid var(--line);background:#fff;padding:9px 11px;font:inherit;font-size:9px;color:var(--deep);cursor:pointer}.priorityWeightPresets button:hover{background:#fafbf8}@media(max-width:700px){.priorityWeightRow{grid-template-columns:1fr;gap:12px}.priorityWeightSummary{gap:10px;padding:14px}.priorityWeightSummary b{font-size:20px}.priorityWeightPresets{display:grid;grid-template-columns:1fr}}
    `;document.head.appendChild(s);
  }

  if(typeof step!=='undefined'&&step===6)initPriorityRank();
  window.FORM_DRIVER_PRIORITY_WEIGHTS_V189={version:'10.92',normalize};
  return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>240)clearInterval(t);},50);
})();