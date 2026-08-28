// FORM 10.21 — shared test setup + denser head-specific finalist cards.
(function(){
'use strict';
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function boot(){
  const ENG=window.FORM_DRIVER_ENGINE_V80,V81=window.FORM_DRIVER_CONFIG_V81;
  if(!ENG||!V81||typeof golfer!=='function')return false;
  if(!document.getElementById('formReport121Styles')){
    const s=document.createElement('style');s.id='formReport121Styles';s.textContent=`
      .report121Setup{margin:18px 0 0;border:1px solid var(--line);background:#fafbf8;padding:16px}
      .report121SetupHead{display:flex;justify-content:space-between;gap:18px;align-items:end;margin-bottom:12px}
      .report121SetupHead h3{margin:4px 0 0;font-size:18px}.report121SetupHead p{margin:0;max-width:520px;font-size:9px;line-height:1.5;color:var(--muted);text-align:right}
      .report121SetupGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line)}
      .report121SetupGrid>div{background:#fff;padding:12px 13px}.report121SetupGrid b{display:block;margin-top:4px;font-size:12px}.report121SetupGrid small{display:block;margin-top:4px;font-size:8.5px;line-height:1.45;color:var(--muted)}
      .report100Card>.report100Config{display:none!important}
      .report100Break.report121Break{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px 12px;margin-top:16px}
      .report100Break.report121Break div{min-width:0}.report100Break.report121Break span{font-size:8.5px}.report100Break.report121Break b{font-size:13px}
      @media(max-width:820px){.report121SetupHead{display:block}.report121SetupHead p{text-align:left;margin-top:6px}.report121SetupGrid{grid-template-columns:1fr}.report100Break.report121Break{grid-template-columns:repeat(2,minmax(0,1fr))}}
    `;document.head.appendChild(s);
  }
  function apply(){
    const results=document.getElementById('results');
    if(!results?.classList.contains('formReport100'))return;
    let rows=[];try{rows=ENG.winners(golfer()).slice(0,5);}catch(e){return;}
    if(!rows.length)return;
    const cards=[...results.querySelectorAll('.report100Card')];
    if(!cards.length)return;
    // Replace the four-item teaser with a fuller head-specific scorecard.
    cards.forEach((card,i)=>{
      const row=rows[i];if(!row)return;
      const box=card.querySelector('.report100Break');if(!box)return;
      const comps=(row.s.components||[]).slice().sort((a,b)=>(b.normalizedWeight||0)-(a.normalizedWeight||0)).slice(0,6);
      box.classList.add('report121Break');
      box.innerHTML=comps.map(x=>`<div><span>${esc(x.label)}</span><b>${Math.round(x.score)}/100</b><em>${Math.round(x.normalizedWeight||0)}% weight</em></div>`).join('');
    });
    if(results.querySelector('.report121Setup'))return;
    const first=rows[0],loft=V81.loftFit(first.p),shaft=V81.shaftFit(),evs=rows.map(r=>V81.recommendationEvidence(r.s));
    const evidenceVals=evs.map(e=>Math.round(e.combined)).filter(Number.isFinite),eMin=Math.min(...evidenceVals),eMax=Math.max(...evidenceVals),sameEvidence=eMin===eMax;
    const setup=document.createElement('section');setup.className='report121Setup';
    setup.innerHTML=`<div class="report121SetupHead"><div><span class="report100Label">Shared fitting starting point</span><h3>Test setup</h3></div><p>These are starting parameters for the fitting session, not reasons to repeat the same setup inside every driver recommendation.</p></div><div class="report121SetupGrid"><div><span class="report100Label">Starting loft</span><b>${loft.loft.toFixed(1)}°</b><small>Test ${esc(loft.range)}. ${esc(loft.reason)}</small></div><div><span class="report100Label">Shaft starting point</span><b>${esc(shaft.flex)}${shaft.weight.startsWith('No ')?'':` · ${esc(shaft.weight)}`}</b><small>${esc(shaft.note)}</small></div><div><span class="report100Label">Recommendation evidence</span><b>${sameEvidence?`${eMin}%`:`${eMin}–${eMax}%`}</b><small>${sameEvidence?'Shared evidence-confidence level across these finalists.':'Evidence confidence varies modestly across the finalist set.'} Evidence affects confidence, not FORM Fit Score.</small></div></div>`;
    const signal=results.querySelector('.report100Signal');
    if(signal)signal.insertAdjacentElement('afterend',setup);else results.prepend(setup);
  }
  apply();
  const obs=new MutationObserver(()=>requestAnimationFrame(apply));
  const driver=document.getElementById('driverExperience')||document.body;obs.observe(driver,{childList:true,subtree:true});
  window.FORM_DRIVER_RESULTS_LAYOUT_V121=true;return true;
}
let n=0,t=setInterval(()=>{n++;if(boot()||n>160)clearInterval(t)},50);
})();
