// FORM 8.9 — proven-performance presentation
(function(){'use strict';
function init(){
 const ENG=window.FORM_DRIVER_ENGINE_V80;if(!ENG)return false;
 function label(p){if(p.type==='direct'&&p.confidence>=.82&&p.score>=90)return'Elite validation';if(p.type==='direct'&&p.confidence>=.72)return'Strong validation';if(p.type==='lineage')return'Lineage-supported';return'Limited validation';}
 function scoreText(p){if(p.type==='direct'&&Number.isFinite(+p.score))return `${(+p.score).toFixed(1)} / 100`;if(p.type==='lineage')return 'Current model not directly scored';return 'Not independently scored';}
 function decorate(){
  const grid=document.getElementById('result80Grid');if(!grid)return false;const cards=[...grid.querySelectorAll('.result70Card')];if(!cards.length)return false;
  const g=typeof normalizedGolferV69==='function'?normalizedGolferV69():golfer(),rows=ENG.winners(g);
  document.querySelectorAll('.qualityFloor88,#qualityNote88').forEach(x=>x.remove());
  cards.forEach((card,i)=>{
   const ev=rows[i]?.s?.evidence,p=ev?.provenPerformance;if(!p||card.querySelector('.proven89'))return;
   const el=document.createElement('div');el.className='proven89';
   el.innerHTML=`<div><span>PROVEN PERFORMANCE</span><b>${label(p)}</b></div><div><span>INDEPENDENT SIGNAL</span><b>${scoreText(p)}</b></div><p>${p.note} FORM uses this to validate execution—not to replace your golfer-specific Fit Score.</p>`;
   const target=card.querySelector('.altIdentity87')||card.querySelector('.fitConfig81')||card.querySelector('.result70Top');target?.insertAdjacentElement('afterend',el);
  });
  const head=document.getElementById('fitSummary81')||document.querySelector('.results70Head');
  if(head&&!document.getElementById('provenNote89')){const note=document.createElement('div');note.id='provenNote89';note.className='provenNote89';note.innerHTML='<b>How FORM treats proven quality</b><span>Specs and manufacturer claims tell FORM what a driver is designed to do. Independent testing determines how much FORM trusts execution in speed retention, stability and consistency. Unvalidated advantages are deliberately pulled toward neutral until they are proven. Brand prestige and price are not scoring inputs.</span>';head.insertAdjacentElement('afterend',note);}
  return true;
 }
 const obs=new MutationObserver(()=>decorate());obs.observe(document.getElementById('driverExperience')||document.body,{subtree:true,childList:true});setTimeout(decorate,150);
 const s=document.createElement('style');s.textContent=`.proven89{margin:0 14px;padding:13px 0;border-bottom:1px solid var(--line);display:grid;grid-template-columns:minmax(130px,.7fr) minmax(150px,.8fr) minmax(240px,1.6fr);gap:16px;align-items:center}.proven89 span{display:block;font-size:7px;font-weight:900;letter-spacing:.13em;color:var(--muted)}.proven89 b{display:block;margin-top:4px;font-size:10px}.proven89 p{margin:0;font-size:8px;line-height:1.5;color:var(--muted)}.provenNote89{margin:0 0 20px;padding:15px 18px;border:1px solid var(--line);background:#f7f8f4;display:grid;grid-template-columns:minmax(180px,.55fr) minmax(0,1.6fr);gap:18px}.provenNote89 b{font-size:10px}.provenNote89 span{font-size:9px;line-height:1.55;color:var(--muted)}@media(max-width:700px){.proven89,.provenNote89{grid-template-columns:1fr}.proven89{gap:7px}.proven89 p{font-size:9px}}`;
 document.head.appendChild(s);window.FORM_DRIVER_PROVEN_V89=true;return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>100)clearInterval(t)},50);
})();