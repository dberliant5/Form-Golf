// FORM 14.5 — two-axis user preference: Distance vs Accuracy & Forgiveness.
// One continuum captures the only subjective performance tradeoff FORM asks the golfer to make.
// Launch, spin, trajectory, strike and directional fit remain technical fitting inputs.
(function(){'use strict';
if(window.FORM_DRIVER_PRIORITY_WEIGHTS_V189)return;

function init(){
  if(window.FORM_DRIVER_PRIORITY_WEIGHTS_V189)return true;
  if(typeof state==='undefined'||typeof golfer!=='function'||typeof initPriorityRank!=='function'||typeof rankedWeight!=='function')return false;

  if(!state.priorityWeights)state.priorityWeights={distance:50,accuracy:50,touched:false};
  const clamp=v=>Math.max(0,Math.min(100,Math.round((Number(v)||0)/5)*5));
  function normalize(){
    let a=clamp(state.priorityWeights?.accuracy),d=100-a;
    state.priorityWeights={distance:d,accuracy:a,touched:!!state.priorityWeights?.touched};
    state.driverPrioritySplit={distance:d,accuracy:a,touched:!!state.priorityWeights.touched};
    if(state.ranks){
      if(a>d){state.ranks.accuracy=1;state.ranks.distance=2;}
      else if(d>a){state.ranks.distance=1;state.ranks.accuracy=2;}
      else {state.ranks.accuracy=1;state.ranks.distance=2;}
      state.ranks.flight=3;state.ranks.feel=4;state.ranks.looks=5;state.ranks.value=6;
    }
    return state.priorityWeights;
  }
  normalize();

  const priorGolfer=golfer;
  golfer=function(){
    const g=priorGolfer(),w=normalize();
    return {...g,priorityWeights:{distance:w.distance,accuracy:w.accuracy}};
  };

  // Calibrated curve. UI allocation can reach 0/100, but neither preference channel is
  // allowed to overwhelm the underlying physics. The pair always sums to 10 points of influence:
  // balanced = 5/5, an extreme = 7/3.
  rankedWeight=function(g,id){
    const w=g?.priorityWeights||state.priorityWeights||{distance:50,accuracy:50};
    if(id==='distance'||id==='accuracy'){
      const share=Math.max(0,Math.min(100,Number(w[id])||0));
      return Math.round((3+4*(share/100))*100)/100;
    }
    if(id==='flight')return 0;
    return 0;
  };

  function label(w){
    if(w.accuracy===50)return 'Balanced';
    if(w.accuracy>=80)return 'Strongly accuracy & forgiveness focused';
    if(w.accuracy>=60)return 'Accuracy & forgiveness focused';
    if(w.distance>=80)return 'Strongly distance focused';
    if(w.distance>=60)return 'Distance focused';
    return w.accuracy>50?'Slight accuracy & forgiveness lean':'Slight distance lean';
  }
  function syncAccuracy(value){
    const a=clamp(value);state.priorityWeights={accuracy:a,distance:100-a,touched:true};normalize();initPriorityRank();
  }

  initPriorityRank=function(){
    const box=document.getElementById('priorityRank');if(!box)return;
    const w=normalize(),stepEl=document.getElementById('step6');
    const h=stepEl?.querySelector('h1'),lead=stepEl?.querySelector('.lead'),note=stepEl?.querySelector('.note');
    if(h)h.textContent='What matters most from your next driver?';
    if(lead)lead.textContent='Tell FORM where you want us to lean when distance and accuracy / forgiveness compete.';
    if(note)note.textContent='FORM still evaluates launch, spin, trajectory, strike pattern and directional fit automatically.';
    box.innerHTML=`<div class="priorityContinuum189">
      <div class="priorityContinuumEnds"><div><b>Distance</b><span>Maximize useful distance when the tradeoff is real.</span></div><div><b>Accuracy & forgiveness</b><span>Keep misses tighter and protect performance away from center.</span></div></div>
      <input class="priorityContinuumRange" type="range" min="0" max="100" step="5" value="${w.accuracy}" data-priority-continuum aria-label="Balance distance versus accuracy and forgiveness">
      <div class="priorityContinuumReadout"><b>${label(w)} · ${w.distance} / ${w.accuracy}</b><span>Distance / Accuracy & forgiveness</span></div>
      <div class="priorityContinuumBar" aria-hidden="true"><i style="width:${w.distance}%"></i><em style="width:${w.accuracy}%"></em></div>
      <div class="priorityContinuumFoot">This is a preference, not a physics override. FORM keeps both dimensions in the fit even at either end of the scale.</div>
    </div>`;
    const range=box.querySelector('[data-priority-continuum]');if(range)range.oninput=()=>syncAccuracy(range.value);
  };

  const priorReview=typeof renderReview==='function'?renderReview:null;
  if(priorReview)renderReview=function(){
    priorReview();const w=normalize(),prefs=document.getElementById('reviewPrefs');if(!prefs)return;
    let row=[...prefs.querySelectorAll('.reviewRow')].find(x=>/^(Priorities|Performance preference)$/i.test(x.querySelector('span')?.textContent?.trim()||''));
    if(row){const lab=row.querySelector('span'),b=row.querySelector('b');if(lab)lab.textContent='Performance preference';if(b)b.innerHTML=`${w.distance}% Distance · ${w.accuracy}% Accuracy & forgiveness<span class="quality">Weighted</span>`;}
  };

  if(!document.getElementById('formPriorityWeights189Styles')){
    const s=document.createElement('style');s.id='formPriorityWeights189Styles';s.textContent=`
    .priorityContinuum189{margin-top:24px;border:1px solid var(--line);background:#fff;padding:22px}.priorityContinuumEnds{display:flex;justify-content:space-between;gap:20px}.priorityContinuumEnds>div{max-width:46%}.priorityContinuumEnds>div:last-child{text-align:right}.priorityContinuumEnds b{display:block;font-family:Georgia,serif;font-size:19px;line-height:1.1;color:var(--deep)}.priorityContinuumEnds span{display:block;margin-top:6px;font-size:10px;line-height:1.45;color:var(--muted)}.priorityContinuumRange{width:100%;margin:28px 0 12px;accent-color:var(--deep)}.priorityContinuumReadout{text-align:center}.priorityContinuumReadout b{display:block;font-size:17px;color:var(--deep)}.priorityContinuumReadout span{display:block;margin-top:4px;font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}.priorityContinuumBar{display:flex;height:7px;overflow:hidden;border-radius:999px;background:var(--line);margin-top:18px}.priorityContinuumBar i,.priorityContinuumBar em{display:block;height:100%;transition:width .12s ease}.priorityContinuumBar i{background:#9aa69f}.priorityContinuumBar em{background:var(--deep)}.priorityContinuumFoot{margin-top:18px;padding-top:15px;border-top:1px solid var(--line);font-size:10px;line-height:1.55;color:var(--muted)}@media(max-width:700px){.priorityContinuum189{padding:18px}.priorityContinuumEnds{gap:14px}.priorityContinuumEnds b{font-size:17px}.priorityContinuumEnds span{font-size:9px}.priorityContinuumReadout b{font-size:15px}}
    `;document.head.appendChild(s);
  }

  if(typeof step!=='undefined'&&step===6)initPriorityRank();
  window.FORM_DRIVER_PRIORITY_WEIGHTS_V189={version:'14.5',normalize};
  return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>240)clearInterval(t);},50);
})();