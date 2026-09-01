// FORM 10.77 — stable, one-pass driver results reconciliation.
// No broad MutationObserver. Enhances the proven base report only after it exists.
(function(){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEYS=['speed','direction','strike','spin','launch','efficiency'];
const META={
 speed:{label:'Distance',short:'Distance potential for your speed and delivery.'},
 direction:{label:'Dispersion',short:'How well the head fits your directional pattern.'},
 strike:{label:'Forgiveness',short:'Protection when contact moves off center.'},
 spin:{label:'Spin Control',short:'How well spin behavior fits your delivery.'},
 launch:{label:'Launch',short:'How well the head supports your needed launch window.'},
 efficiency:{label:'Ball Speed Retention',short:'How well useful speed is preserved on imperfect contact.'}
};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function init(){
 if(window.FORM_DRIVER_RESULTS_INTEGRATED_V177)return true;
 const ENG=window.FORM_DRIVER_ENGINE_V80,V81=window.FORM_DRIVER_CONFIG_V81;
 if(!ENG||!V81||typeof golfer!=='function')return false;
 function rowsNow(){try{return ENG.winners(golfer()).slice(0,5)}catch(e){return[]}}
 function compMap(row){return Object.fromEntries((row?.s?.components||[]).map(x=>[x.key,x]));}
 function avg(rows,key,skip){const a=rows.filter((_,i)=>i!==skip).map(r=>compMap(r)[key]?.score).filter(Number.isFinite);return a.length?a.reduce((x,y)=>x+y,0)/a.length:null;}
 function priorityLabels(){
   const labels={accuracy:'Accuracy / forgiveness',distance:'Distance',flight:'Ball flight'};
   try{return ['accuracy','distance','flight'].sort((a,b)=>(state.ranks?.[a]||99)-(state.ranks?.[b]||99)).map(k=>labels[k]);}catch(e){return[]}
 }
 function categoryRows(row){const m=compMap(row);return KEYS.map(k=>({k,x:m[k],meta:META[k]}));}
 function strongestRelative(rows,i){return categoryRows(rows[i]).map(v=>{const a=avg(rows,v.k,i);return v.x&&a!=null?{...v,delta:v.x.score-a}:null;}).filter(Boolean).sort((a,b)=>b.delta-a.delta);}
 function weakestRelative(rows,i){return strongestRelative(rows,i).slice().sort((a,b)=>a.delta-b.delta);}
 function strikeContext(row){
   let g={};try{g=golfer()}catch(e){}
   const sr=row?.s?.strikeReliability,sideWeight=Number(sr?.sideWeight);
   if(['heel','toe'].includes(g.strike)&&Number.isFinite(sideWeight)&&sideWeight<60)return 'FORM is keeping off-center forgiveness important while treating the reported heel/toe side cautiously.';
   if(g.strike==='varied')return 'Your strike moves around the face, so consistency across mishits matters more than one perfect strike.';
   if(g.strike==='heel'||g.strike==='toe')return `Your ${g.strike}-side strike pattern makes mishit stability especially relevant.`;
   return 'Forgiveness is useful insurance when contact moves away from center.';
 }
 function whyText(rows,i){
   const row=rows[i],other=i===0?rows[1]:rows[i-1];if(!row)return'';
   const rel=strongestRelative(rows,i),weak=weakestRelative(rows,i),p=priorityLabels();
   if(!other){return `This is the cleanest overall match FORM found for your profile${p[0]?`, with ${p[0].toLowerCase()} carrying the most emphasis`:''}. Real-world testing should confirm that the modeled strengths show up in your dispersion and ball flight.`;}
   const gap=Math.abs(row.s.overall-other.s.overall),best=rel[0],trade=weak[0];
   if(i===0){
     const lead=best?`${best.meta.label.toLowerCase()} is its clearest relative advantage`: 'the overall profile is the separator';
     const tie=gap<1.25?`The margin over #2 is only ${gap.toFixed(1)} Fit points, so FORM considers them the same testing tier.`:`It leads #2 by ${gap.toFixed(1)} Fit points.`;
     const watch=trade&&trade.delta<0?`Its main pressure-test area is ${trade.meta.label.toLowerCase()}, where another finalist is stronger.`:`There is no single major category penalty driving against it.`;
     return `${tie} ${lead}, and that advantage lines up with the needs FORM is weighting most heavily for you. ${watch}`;
   }
   const above=other,delta=(above.s.overall-row.s.overall).toFixed(1),counter=best&&best.delta>0.5?`${best.meta.label} is where this head gives you the strongest counterargument to the model above.`:`Its case is balance rather than one standout category.`;
   const loss=trade?`${trade.meta.label} is the clearest reason it sits lower.`:'The difference is spread across several small categories.';
   return `It sits ${delta} Fit points behind the model above. ${loss} ${counter} That makes it a useful side-by-side comparison rather than simply a lower-ranked fallback.`;
 }
 function proCon(rows,i){
   const row=rows[i],hi=strongestRelative(rows,i),lo=weakestRelative(rows,i);if(!row||!hi.length)return{pros:[],cons:[]};
   const pros=[],cons=[];
   hi.slice(0,2).forEach(v=>{let t=`${v.meta.label} is a relative strength in this finalist group.`;if(v.k==='strike')t+=` ${strikeContext(row)}`;else if(v.delta>2)t+=` It is meaningfully better here than the average of the other finalists.`;else t+=` The advantage is modest, but it contributes to the overall fit.`;pros.push(t);});
   lo.slice(0,2).forEach(v=>{let t=`${v.meta.label} is the first area to pressure-test against the other finalists.`;if(v.delta<-2)t+=` FORM sees a meaningful relative disadvantage here.`;else t+=` This is a trade-off, not a red flag.`;cons.push(t);});
   return {pros,cons};
 }
 function scoreGrid(row){return categoryRows(row).map(v=>{
   const x=v.x;if(!x)return `<div class="r177Metric"><span>${esc(v.meta.label)}</span><b>—</b><small>${esc(v.meta.short)}</small></div>`;
   return `<div class="r177Metric"><span>${esc(v.meta.label)}</span><b>${Math.round(x.score)}/100</b><em>${Math.round(x.normalizedWeight||0)}% weight</em><small>${esc(v.meta.short)}</small></div>`;
 }).join('');}
 function sharedSetup(rows){
   const first=rows[0];if(!first)return'';
   let loft=null,shaft=null,ev=null;try{loft=V81.loftFit(first.p);shaft=V81.shaftFit();ev=V81.recommendationEvidence(first.s);}catch(e){}
   if(!loft||!shaft)return'';
   const conf=ev?`${esc(ev.label)} · ${Math.round(clamp(Number(ev.combined)||0,0,100))}%`:'Developing';
   return `<section class="r177Setup"><div class="r177SetupHead"><div><span class="report100Label">Shared test setup</span><h3>Start every finalist from the same baseline.</h3></div><p>Loft and shaft are fitting starting points, not reasons one head ranks above another.</p></div><div class="r177SetupGrid"><div><span>Starting loft</span><b>${Number(loft.loft).toFixed(1)}°</b><small>Test ${esc(loft.range)}. ${esc(loft.reason||'Use this as the common baseline before head-specific fine tuning.')}</small></div><div><span>Shaft starting point</span><b>${esc(shaft.flex)}${shaft.weight&&!String(shaft.weight).startsWith('No ')?` · ${esc(shaft.weight)}`:''}</b><small>${esc(shaft.note||'Use this profile and weight window as the common comparison starting point.')}</small></div><div><span>Recommendation confidence</span><b>${conf}</b><small>Confidence in the leading recommendation based on your inputs and available product evidence. It does not change FORM Fit Score.</small></div></div></section>`;
 }
 function styles(){if(document.getElementById('r177Styles'))return;const s=document.createElement('style');s.id='r177Styles';s.textContent=`
 .r177Setup{margin:18px 0 26px;border:1px solid var(--line);background:#fafbf8;padding:18px}.r177SetupHead{display:flex;justify-content:space-between;gap:24px;align-items:end;margin-bottom:14px}.r177SetupHead h3{font-size:19px;margin:5px 0 0}.r177SetupHead p{max-width:470px;margin:0;color:var(--muted);font-size:9px;line-height:1.5;text-align:right}.r177SetupGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line)}.r177SetupGrid>div{background:#fff;padding:14px}.r177SetupGrid span,.r177Metric span{display:block;font-size:8px;letter-spacing:.1em;text-transform:uppercase;font-weight:900;color:var(--muted)}.r177SetupGrid b{display:block;margin-top:5px;font-size:14px}.r177SetupGrid small{display:block;margin-top:5px;font-size:9px;line-height:1.45;color:var(--muted)}
 .report100Card>.report100Config{display:none!important}.report100Break{display:none!important}.r177Metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line);margin-top:15px}.r177Metric{background:#fff;padding:12px}.r177Metric b{display:block;margin-top:5px;font-size:14px}.r177Metric em{display:block;margin-top:2px;font-style:normal;font-size:8px;color:var(--muted)}.r177Metric small{display:block;margin-top:6px;font-size:8.5px;line-height:1.4;color:var(--muted)}
 .r177Read{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:14px;padding:14px;border:1px solid var(--line);background:#fafbf8}.r177Read h4{margin:0 0 7px;font-size:9px;letter-spacing:.12em;text-transform:uppercase}.r177Read ul{margin:0;padding-left:17px}.r177Read li{font-size:9.5px;line-height:1.5;color:var(--muted);margin:5px 0}.report100Why{font-size:10px!important;line-height:1.65!important;color:var(--muted)!important}.report100Why b{color:var(--deep)!important}
 @media(max-width:820px){.r177SetupHead{display:block}.r177SetupHead p{text-align:left;margin-top:7px}.r177SetupGrid{grid-template-columns:1fr}.r177Metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.r177Read{grid-template-columns:1fr}.report100Card{padding:18px}.report100Top{gap:10px}.report100Card h2{font-size:22px}}
 `;document.head.appendChild(s);}
 function enhance(){
   const results=document.getElementById('results');if(!results?.classList.contains('formReport100')||results.dataset.r177==='1')return false;
   const rows=rowsNow(),cards=[...results.querySelectorAll('.report100Card')];if(!rows.length||!cards.length)return false;
   results.dataset.r177='1';styles();
   results.querySelector('.r177Setup')?.remove();const signal=results.querySelector('.report100Signal');if(signal)signal.insertAdjacentHTML('afterend',sharedSetup(rows));
   cards.forEach((card,i)=>{const row=rows[i];if(!row)return;card.querySelector('.r177Metrics')?.remove();card.querySelector('.r177Read')?.remove();const why=card.querySelector('.report100Why');if(why)why.innerHTML=`<b>${i===0?'Why it leads':'Why it ranks here'}:</b> ${esc(whyText(rows,i))}`;const anchor=card.querySelector('.report100Config')||why;anchor?.insertAdjacentHTML('afterend',`<div class="r177Metrics">${scoreGrid(row)}</div>`);const pc=proCon(rows,i);card.insertAdjacentHTML('beforeend',`<div class="r177Read"><section><h4>Pros</h4><ul>${pc.pros.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section><section><h4>Cons</h4><ul>${pc.cons.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section></div>`);});
   return true;
 }
 function arm(){let n=0;const t=setInterval(()=>{n++;if(enhance()||n>80)clearInterval(t);},50);}
 document.addEventListener('click',e=>{if(e.target?.closest?.('#step9 .readyBox button'))arm();},true);
 document.addEventListener('touchend',e=>{if(e.target?.closest?.('#step9 .readyBox button'))arm();},{capture:true,passive:true});
 arm();window.FORM_DRIVER_RESULTS_INTEGRATED_V177={version:'10.77',enhance};return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>300)clearInterval(t);},50);
})();