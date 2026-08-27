// FORM 8.8 — transparent product-quality floor presentation
(function(){'use strict';
function init(){
  const ENG=window.FORM_DRIVER_ENGINE_V80;if(!ENG)return false;
  function label(q){return q>=91?'Exceptional':q>=87?'High':q>=83?'Strong':'Developing';}
  function decorate(){
    const grid=document.getElementById('result80Grid');if(!grid)return false;
    const cards=[...grid.querySelectorAll('.result70Card')];if(!cards.length)return false;
    const g=typeof normalizedGolferV69==='function'?normalizedGolferV69():golfer(),rows=ENG.winners(g);
    cards.forEach((card,i)=>{
      const ev=rows[i]?.s?.evidence,q=ev?.productQualityFloor,adj=ev?.qualityAdjustment;if(!Number.isFinite(+q)||card.querySelector('.qualityFloor88'))return;
      const el=document.createElement('div');el.className='qualityFloor88';
      el.innerHTML=`<span>PRODUCT QUALITY FLOOR</span><b>${label(+q)} · ${(+q).toFixed(1)}/100</b><small>Broad, golfer-independent product strength. Its ranking effect is capped at ${Math.abs(+adj).toFixed(2)} Fit points for this head.</small>`;
      const target=card.querySelector('.altIdentity87')||card.querySelector('.fitConfig81')||card.querySelector('.result70Top');target?.insertAdjacentElement('afterend',el);
    });
    const head=document.getElementById('fitSummary81')||document.querySelector('.results70Head');
    if(head&&!document.getElementById('qualityNote88')){const note=document.createElement('div');note.id='qualityNote88';note.className='qualityNote88';note.innerHTML='<b>How FORM handles overall club quality</b><span>Fit remains dominant. FORM also applies a small, capped product-quality tie-break using broad stability, speed potential, face retention/consistency and fitting versatility. Brand prestige, price and popularity are not inputs, and the quality layer cannot rescue a clearly worse golfer-specific fit.</span>';head.insertAdjacentElement('afterend',note);}
    return true;
  }
  const obs=new MutationObserver(()=>decorate());obs.observe(document.getElementById('driverExperience')||document.body,{subtree:true,childList:true});setTimeout(decorate,200);
  const s=document.createElement('style');s.textContent='.qualityFloor88{margin:0 14px;padding:12px 0;border-bottom:1px solid var(--line);display:grid;grid-template-columns:minmax(120px,.6fr) minmax(130px,.7fr) minmax(220px,1.7fr);gap:14px;align-items:center}.qualityFloor88 span{font-size:7px;font-weight:900;letter-spacing:.13em;color:var(--muted)}.qualityFloor88 b{font-size:10px}.qualityFloor88 small{font-size:8px;line-height:1.45;color:var(--muted)}.qualityNote88{margin:0 0 20px;padding:14px 18px;border:1px solid var(--line);background:#f7f8f4;display:grid;grid-template-columns:minmax(180px,.55fr) minmax(0,1.6fr);gap:18px}.qualityNote88 b{font-size:10px}.qualityNote88 span{font-size:9px;line-height:1.55;color:var(--muted)}@media(max-width:700px){.qualityFloor88,.qualityNote88{grid-template-columns:1fr}.qualityFloor88{gap:5px}.qualityFloor88 small{font-size:9px}}';document.head.appendChild(s);
  window.FORM_DRIVER_QUALITY_V88=true;return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>100)clearInterval(t)},50);
})();