// FORM 10.22 — shared test setup + apples-to-apples finalist scorecards + explainable confidence.
(function(){
'use strict';
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const SCORE_KEYS=['spin','strike','speed','direction','launch','efficiency'];
function boot(){
  const ENG=window.FORM_DRIVER_ENGINE_V80,V81=window.FORM_DRIVER_CONFIG_V81;
  if(!ENG||!V81||typeof golfer!=='function')return false;
  if(!document.getElementById('formReport121Styles')){
    const s=document.createElement('style');s.id='formReport121Styles';s.textContent=`
      .report121Setup{margin:18px 0 0;border:1px solid var(--line);background:#fafbf8;padding:16px}
      .report121SetupHead{display:flex;justify-content:space-between;gap:18px;align-items:end;margin-bottom:12px}
      .report121SetupHead h3{margin:4px 0 0;font-size:18px}.report121SetupHead p{margin:0;max-width:520px;font-size:9px;line-height:1.5;color:var(--muted);text-align:right}
      .report121SetupGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line)}
      .report121SetupGrid>div{background:#fff;padding:12px 13px}.report121SetupGrid b{display:block;margin-top:4px;font-size:12px}.report121SetupGrid small{display:block;margin-top:4px;font-size:8.5px;line-height:1.5;color:var(--muted)}
      .report100Card>.report100Config{display:none!important}
      .report100Break.report121Break{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px 12px;margin-top:16px}
      .report100Break.report121Break>div{min-width:0;position:relative}.report100Break.report121Break b{font-size:13px}
      .report121MetricLabel{display:flex!important;align-items:center;gap:5px;font-size:8.5px!important;color:var(--muted);line-height:1.3}
      .report121Info{display:inline-flex;align-items:center;justify-content:center;width:15px;height:15px;border:1px solid var(--line);border-radius:50%;background:#fff;color:var(--muted);font-size:9px;font-weight:800;line-height:1;padding:0;cursor:help;flex:0 0 auto}
      .report121Info:hover,.report121Info:focus{border-color:var(--deep);color:var(--deep);outline:none}
      .report121Tip{display:none;position:absolute;z-index:20;left:0;top:32px;width:min(260px,75vw);padding:9px 10px;border:1px solid var(--line);background:#fff;box-shadow:0 8px 24px rgba(22,38,29,.12);font-size:9px;line-height:1.45;color:var(--deep)}
      .report121Info:hover+.report121Tip,.report121Info:focus+.report121Tip,.report121Info[aria-expanded="true"]+.report121Tip{display:block}
      .report121EvidenceWhy{display:block;margin-top:7px;padding-top:7px;border-top:1px dashed var(--line);color:var(--deep)!important}
      @media(max-width:820px){.report121SetupHead{display:block}.report121SetupHead p{text-align:left;margin-top:6px}.report121SetupGrid{grid-template-columns:1fr}.report100Break.report121Break{grid-template-columns:repeat(2,minmax(0,1fr))}.report121Tip{position:fixed;left:18px;right:18px;bottom:24px;top:auto;width:auto;font-size:11px;padding:12px 14px}}
    `;document.head.appendChild(s);
  }
  function evidenceWhy(evs){
    const golfer=Math.round(evs.reduce((a,e)=>a+(Number(e.golfer)||0),0)/Math.max(1,evs.length));
    const products=evs.map(e=>Math.round(Number(e.product)||0)).filter(Number.isFinite);
    const pMin=Math.min(...products),pMax=Math.max(...products);
    const reasons=[];
    if(golfer<100)reasons.push(`Golfer-input strength is ${golfer}%. Range-based measurements appropriately describe normal variation, but they still represent bands rather than repeated measured averages; unknown fields reduce certainty further.`);
    if(pMin<100)reasons.push(`Product-evidence support is ${pMin===pMax?pMin:`${pMin}–${pMax}` }%. Not every scored performance dimension has equally deep independent evidence, so FORM does not treat modeled attributes as fully proven.`);
    return reasons.length?`Why not 100%: ${reasons.join(' ')}`:'The underlying golfer inputs and product evidence are fully supported for this prototype score.';
  }
  function scorecard(row){
    const map=Object.fromEntries((row.s.components||[]).map(x=>[x.key,x]));
    return SCORE_KEYS.map(key=>{
      const x=map[key];if(!x)return `<div><span class="report121MetricLabel">${esc(key)}</span><b>—</b><em>Not scored</em></div>`;
      const tip=esc(x.explanation||'This score reflects how this head matches the golfer profile in this fitting dimension.');
      return `<div><span class="report121MetricLabel">${esc(x.label)} <button type="button" class="report121Info" aria-label="Explain ${esc(x.label)}" aria-expanded="false">i</button><span class="report121Tip" role="tooltip">${tip}</span></span><b>${Math.round(x.score)}/100</b><em>${Math.round(x.normalizedWeight||0)}% weight</em></div>`;
    }).join('');
  }
  function apply(){
    const results=document.getElementById('results');
    if(!results?.classList.contains('formReport100'))return;
    let rows=[];try{rows=ENG.winners(golfer()).slice(0,5);}catch(e){return;}
    if(!rows.length)return;
    const cards=[...results.querySelectorAll('.report100Card')];if(!cards.length)return;
    cards.forEach((card,i)=>{
      const row=rows[i],box=card.querySelector('.report100Break');if(!row||!box)return;
      const sig=[row.p.brand,row.p.model,...SCORE_KEYS.map(k=>{const x=(row.s.components||[]).find(c=>c.key===k);return x?`${k}:${Math.round(x.score)}:${Math.round(x.normalizedWeight||0)}`:`${k}:na`;})].join('|');
      box.classList.add('report121Break');
      if(box.dataset.formScorecard!==sig){box.innerHTML=scorecard(row);box.dataset.formScorecard=sig;}
    });
    if(!results.dataset.formInfoOwned){
      results.dataset.formInfoOwned='true';
      results.addEventListener('click',e=>{const b=e.target.closest('.report121Info');results.querySelectorAll('.report121Info').forEach(x=>{if(x!==b)x.setAttribute('aria-expanded','false')});if(b){e.preventDefault();b.setAttribute('aria-expanded',b.getAttribute('aria-expanded')==='true'?'false':'true');}});
    }
    let setup=results.querySelector('.report121Setup');
    const first=rows[0],loft=V81.loftFit(first.p),shaft=V81.shaftFit(),evs=rows.map(r=>V81.recommendationEvidence(r.s));
    const evidenceVals=evs.map(e=>Math.round(e.combined)).filter(Number.isFinite),eMin=Math.min(...evidenceVals),eMax=Math.max(...evidenceVals),sameEvidence=eMin===eMax;
    const evText=sameEvidence?`${eMin}%`:`${eMin}–${eMax}%`,why=evidenceWhy(evs);
    const setupHTML=`<div class="report121SetupHead"><div><span class="report100Label">Shared fitting starting point</span><h3>Test setup</h3></div><p>These are starting parameters for the fitting session, not head-specific ranking reasons.</p></div><div class="report121SetupGrid"><div><span class="report100Label">Starting loft</span><b>${loft.loft.toFixed(1)}°</b><small>Test ${esc(loft.range)}. ${esc(loft.reason)}</small></div><div><span class="report100Label">Shaft starting point</span><b>${esc(shaft.flex)}${shaft.weight.startsWith('No ')?'':` · ${esc(shaft.weight)}`}</b><small>${esc(shaft.note)}</small></div><div><span class="report100Label">Recommendation evidence</span><b>${evText}</b><small>${sameEvidence?'Shared confidence level across these finalists.':'Confidence varies modestly across the finalist set.'} Evidence affects confidence, not FORM Fit Score.<span class="report121EvidenceWhy">${esc(why)}</span></small></div></div>`;
    const setupSig=[loft.loft,loft.range,shaft.flex,shaft.weight,evText,why].join('|');
    if(!setup){setup=document.createElement('section');setup.className='report121Setup';const signal=results.querySelector('.report100Signal');if(signal)signal.insertAdjacentElement('afterend',setup);else results.prepend(setup);}
    if(setup.dataset.formSetup!==setupSig){setup.innerHTML=setupHTML;setup.dataset.formSetup=setupSig;}
  }
  apply();
  let queued=false;const obs=new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply();});});
  const driver=document.getElementById('driverExperience')||document.body;obs.observe(driver,{childList:true,subtree:true});
  window.FORM_DRIVER_RESULTS_LAYOUT_V121=true;window.FORM_DRIVER_RESULTS_LAYOUT_V122=true;return true;
}
let n=0,t=setInterval(()=>{n++;if(boot()||n>160)clearInterval(t)},50);
})();
