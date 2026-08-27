// FORM 9.0 — proven-performance presentation
(function(){'use strict';
function init(){
 const ENG=window.FORM_DRIVER_ENGINE_V80;if(!ENG)return false;
 function label(p){if(p.type==='direct'&&p.confidence>=.82&&p.score>=90)return'Elite validation';if(p.type==='direct'&&p.confidence>=.72)return'Strong validation';if(p.type==='lineage'&&p.confidence>=.58)return'Lineage + current testing';if(p.type==='lineage')return'Lineage-supported';return'Limited validation';}
 function scoreText(p){if(p.type==='direct'&&Number.isFinite(+p.score))return `${(+p.score).toFixed(1)} / 100`;if(p.type==='lineage')return 'No normalized current score';return 'Not independently scored';}
 function categoryLine(p){if(!Number.isFinite(+p.accuracy)||!Number.isFinite(+p.distance)||!Number.isFinite(+p.forgiveness))return'';return `<div class="provenCats90"><span>Accuracy <b>${(+p.accuracy).toFixed(0)}</b></span><span>Distance <b>${(+p.distance).toFixed(0)}</b></span><span>Forgiveness <b>${(+p.forgiveness).toFixed(0)}</b></span></div>`;}
 function decorate(){
  const grid=document.getElementById('result80Grid');if(!grid)return false;const cards=[...grid.querySelectorAll('.result70Card')];if(!cards.length)return false;
  const g=typeof normalizedGolferV69==='function'?normalizedGolferV69():golfer(),rows=ENG.winners(g);
  document.querySelectorAll('.qualityFloor88,#qualityNote88').forEach(x=>x.remove());
  cards.forEach((card,i)=>{
   const ev=rows[i]?.s?.evidence,p=ev?.provenPerformance;if(!p)return;
   card.querySelector('.proven89')?.remove();
   const el=document.createElement('div');el.className='proven89';
   const sourceText=p.type==='direct'?`${p.normalizedSources||1} normalized market test${(p.corroboratingSources||0)?` + ${p.corroboratingSources} corroborating current-model review`:''}`:p.type==='lineage'?`${p.sources||1} lineage/current evidence signal${(p.sources||1)>1?'s':''}`:'No normalized independent record';
   el.innerHTML=`<div><span>PROVEN PERFORMANCE</span><b>${label(p)}</b><small>${sourceText}</small></div><div><span>INDEPENDENT SIGNAL</span><b>${scoreText(p)}</b>${categoryLine(p)}</div><p>${p.note} FORM validates execution by measured category; a strong overall result no longer boosts every performance dimension equally.</p>`;
   const target=card.querySelector('.altIdentity87')||card.querySelector('.fitConfig81')||card.querySelector('.result70Top');target?.insertAdjacentElement('afterend',el);
  });
  const head=document.getElementById('fitSummary81')||document.querySelector('.results70Head');
  document.getElementById('provenNote89')?.remove();
  if(head){const note=document.createElement('div');note.id='provenNote89';note.className='provenNote89';note.innerHTML='<b>How FORM treats proven quality</b><span>Manufacturer specifications establish design intent. Normalized independent testing validates execution by category: distance informs speed potential; forgiveness informs stability and retention; accuracy plus forgiveness informs consistency. Unvalidated advantages are pulled toward neutral. A single overall review score cannot make every aspect of a driver “elite,” and brand prestige or price are not scoring inputs.</span>';head.insertAdjacentElement('afterend',note);}
  return true;
 }
 const obs=new MutationObserver(()=>decorate());obs.observe(document.getElementById('driverExperience')||document.body,{subtree:true,childList:true});setTimeout(decorate,150);
 const s=document.createElement('style');s.textContent=`.proven89{margin:0 14px;padding:13px 0;border-bottom:1px solid var(--line);display:grid;grid-template-columns:minmax(150px,.75fr) minmax(210px,1fr) minmax(240px,1.45fr);gap:16px;align-items:center}.proven89 span{display:block;font-size:7px;font-weight:900;letter-spacing:.13em;color:var(--muted)}.proven89 b{display:block;margin-top:4px;font-size:10px}.proven89 small{display:block;margin-top:5px;font-size:7px;line-height:1.4;color:var(--muted)}.proven89 p{margin:0;font-size:8px;line-height:1.5;color:var(--muted)}.provenCats90{display:flex;gap:10px;margin-top:7px;flex-wrap:wrap}.provenCats90 span{font-size:7px;letter-spacing:.03em;text-transform:none}.provenCats90 span b{display:inline;margin:0 0 0 3px;font-size:8px;color:var(--deep)}.provenNote89{margin:0 0 20px;padding:15px 18px;border:1px solid var(--line);background:#f7f8f4;display:grid;grid-template-columns:minmax(180px,.55fr) minmax(0,1.6fr);gap:18px}.provenNote89 b{font-size:10px}.provenNote89 span{font-size:9px;line-height:1.55;color:var(--muted)}@media(max-width:700px){.proven89,.provenNote89{grid-template-columns:1fr}.proven89{gap:7px}.proven89 p{font-size:9px}.provenCats90{gap:14px}}`;
 document.head.appendChild(s);window.FORM_DRIVER_PROVEN_V89=true;window.FORM_DRIVER_PROVEN_V90=true;return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>100)clearInterval(t)},50);
})();