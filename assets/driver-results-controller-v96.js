// FORM 10.83 — stable integrated driver report renderer.
// Direct, non-recursive, observer-free. New-driver Fit Scores stay independent of the current club.
(function(){
'use strict';

function init(){
  if(window.FORM_DRIVER_RESULTS_CONTROLLER_V181)return true;
  const ENG=window.FORM_DRIVER_ENGINE_V80,V81=window.FORM_DRIVER_CONFIG_V81;
  if(!ENG||!V81||typeof golfer!=='function')return false;

  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const r1=v=>Math.round(v*10)/10;
  const stateRef=()=>typeof state!=='undefined'?state:null;
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

  function styles(){
    const old=document.getElementById('formReport100Styles');if(old)old.remove();
    const s=document.createElement('style');s.id='formReport100Styles';s.textContent=`
    #results.formReport100{padding:34px 0 76px}
    .report100Hero{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(260px,.65fr);gap:34px;align-items:end;padding:36px 0 28px;border-bottom:1px solid var(--line)}
    .report100Hero h1{font-size:44px;line-height:1.01;margin:8px 0 11px;letter-spacing:-.035em}.report100Hero p{margin:0;max-width:760px;color:var(--muted);font-size:12px;line-height:1.68}
    .report100Lead{border-left:1px solid var(--line);padding-left:26px}.report100Lead span,.report100Kicker,.report100Label,.report100SetupGrid span,.report100Metric span{display:block;font-size:8px;letter-spacing:.14em;text-transform:uppercase;font-weight:900;color:var(--muted)}
    .report100Lead b{display:block;margin-top:7px;font-size:31px;line-height:1.04}.report100Lead small{display:block;margin-top:6px;color:var(--muted);font-size:9px;line-height:1.5}
    .report100Signal{margin:18px 0;padding:14px 16px;border:1px solid var(--line);background:#fafbf8;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px}
    .report100Signal div{padding:2px 14px 2px 0}.report100Signal b{display:block;margin-top:4px;font-size:11px}.report100Signal small{display:block;margin-top:3px;color:var(--muted);font-size:9px;line-height:1.45}
    .report100Setup{margin:0 0 28px;border:1px solid var(--line);background:#fafbf8;padding:18px}.report100SetupHead{display:flex;justify-content:space-between;gap:28px;align-items:end;margin-bottom:14px}
    .report100SetupHead h3{font-size:19px;margin:5px 0 0}.report100SetupHead p{max-width:470px;margin:0;color:var(--muted);font-size:9px;line-height:1.5;text-align:right}
    .report100SetupGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line)}.report100SetupGrid>div{background:#fff;padding:14px}
    .report100SetupGrid b{display:block;margin-top:5px;font-size:14px}.report100SetupGrid small{display:block;margin-top:5px;font-size:9px;line-height:1.45;color:var(--muted)}
    .report100Grid{display:grid;grid-template-columns:minmax(0,1.72fr) minmax(255px,.7fr);gap:30px;margin-top:0}.report100Rankings{display:grid;gap:17px}
    .report100Card{border:1px solid var(--line);background:#fff;padding:23px}.report100Card:first-child{border-top:4px solid var(--deep);padding-top:20px}
    .report100Top{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:20px;align-items:start}.report100Rank{font-size:8px;letter-spacing:.15em;text-transform:uppercase;font-weight:900;color:var(--muted)}
    .report100Card h2{font-size:25px;margin:6px 0 0;letter-spacing:-.02em}.report100Score{text-align:right;font-size:31px;font-weight:800;line-height:1}.report100Score small{display:block;margin-top:5px;font-size:8px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:700}
    .report100Why{margin-top:14px;padding-top:13px;border-top:1px solid var(--line);font-size:10px;line-height:1.58;color:var(--muted)}.report100Why b{color:var(--deep)}
    .report100Metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line);margin-top:15px}
    .report100Metric{background:#fff;padding:12px}.report100Metric b{display:block;margin-top:5px;font-size:14px}.report100Metric em{display:block;margin-top:2px;font-style:normal;font-size:8px;color:var(--muted)}.report100Metric small{display:block;margin-top:6px;font-size:8.5px;line-height:1.4;color:var(--muted)}
    .report100Read{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:14px;padding:14px;border:1px solid var(--line);background:#fafbf8}.report100Read h4{margin:0 0 7px;font-size:9px;letter-spacing:.12em;text-transform:uppercase}.report100Read ul{margin:0;padding-left:17px}.report100Read li{font-size:9.5px;line-height:1.5;color:var(--muted);margin:5px 0}
    .report100Aside{display:grid;gap:16px;align-content:start}.report100Panel{border:1px solid var(--line);padding:19px;background:#fff}.report100Panel h3{font-size:17px;margin:6px 0 10px}.report100Panel p{font-size:10px;line-height:1.6;color:var(--muted);margin:0}.report100Panel ul{padding-left:17px;margin:10px 0 0}.report100Panel li{font-size:9.5px;line-height:1.5;margin:5px 0;color:var(--muted)}
    .report100CurrentScore{font-size:29px;font-weight:800}.report100CurrentScore small{font-size:9px;color:var(--muted);font-weight:600}.report100Upgrade{margin-top:14px;padding-top:13px;border-top:1px solid var(--line)}.report100Upgrade b{display:block;font-size:13px}.report100Upgrade p{margin-top:5px}.report100Guard{margin-top:10px;padding-top:10px;border-top:1px dashed var(--line);font-size:9px;line-height:1.5;color:var(--muted)}
    @media(max-width:820px){.report100Hero,.report100Grid{grid-template-columns:1fr}.report100Lead{border-left:0;border-top:1px solid var(--line);padding:16px 0 0}.report100Signal{grid-template-columns:1fr}.report100SetupHead{display:block}.report100SetupHead p{text-align:left;margin-top:7px}.report100SetupGrid{grid-template-columns:1fr}.report100Metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.report100Read{grid-template-columns:1fr}.report100Hero h1{font-size:34px}.report100Card{padding:18px}.report100Top{gap:10px}.report100Card h2{font-size:22px}}
    `;document.head.appendChild(s);
  }

  function metricNumber(id){
    const m=stateRef()?.metrics?.[id];if(!m||m.mode==='unknown'||m.value==null)return null;if(m.mode==='exact')return Number(m.value);
    const maps={speed:{under75:72,'75-84':80,'85-89':87,'90-94':92,'95-99':97,'100-104':102,'105-109':107,'110-114':112,'115plus':118},ballSpeed:{under120:115,'120-129':125,'130-139':135,'140-149':145,'150-159':155,'160-169':165,'170plus':175},carry:{under180:170,'180-199':190,'200-219':210,'220-239':230,'240-259':250,'260-279':270,'280plus':290}};
    return maps[id]?.[m.value]||null;
  }
  function sanitizeTemporarily(){
    const metrics=stateRef()?.metrics;if(!metrics)return {notes:[],restore:()=>{}};
    const saved={},notes=[];const exclude=(id,text)=>{saved[id]=metrics[id];metrics[id]={mode:'unknown',value:null};notes.push(text);};
    const speed=metricNumber('speed'),ball=metricNumber('ballSpeed'),carry=metricNumber('carry');
    if(speed&&ball){const smash=ball/speed;if(smash<1.12||smash>1.55)exclude('ballSpeed',`Ball speed was excluded because the supplied values implied a ${smash.toFixed(2)} speed ratio.`);}
    if(speed&&carry){const ypm=carry/speed;if(ypm<1.45||ypm>3.15)exclude('carry','Carry was excluded because it conflicted materially with the supplied club speed.');}
    return {notes,restore:()=>Object.keys(saved).forEach(k=>metrics[k]=saved[k])};
  }
  function golferNow(){return golfer();}
  function evidenceCopy(s){const e=V81.recommendationEvidence(s);return `${e.label} · ${Math.round(clamp(Number(e.combined)||0,0,100))}%`;}
  function configFor(row){return {loft:V81.loftFit(row.p),shaft:V81.shaftFit(),evidence:V81.recommendationEvidence(row.s)};}
  function compMap(row){return Object.fromEntries((row?.s?.components||[]).map(x=>[x.key,x]));}
  function categoryRows(row){const m=compMap(row);return KEYS.map(k=>({k,x:m[k],meta:META[k]}));}
  function avg(rows,key,skip){const a=rows.filter((_,i)=>i!==skip).map(r=>compMap(r)[key]?.score).filter(Number.isFinite);return a.length?a.reduce((x,y)=>x+y,0)/a.length:null;}
  function relative(rows,i){return categoryRows(rows[i]).map(v=>{const a=avg(rows,v.k,i);return v.x&&a!=null?{...v,delta:v.x.score-a}:null;}).filter(Boolean).sort((a,b)=>b.delta-a.delta);}
  function priorityLabels(){const labels={accuracy:'Accuracy / forgiveness',distance:'Distance',flight:'Ball flight'};try{return ['accuracy','distance','flight'].sort((a,b)=>(state.ranks?.[a]||99)-(state.ranks?.[b]||99)).map(k=>labels[k]);}catch(e){return[]}}
  function strikeContext(row){let g={};try{g=golfer()}catch(e){}const sr=row?.s?.strikeReliability,sideWeight=Number(sr?.sideWeight);if(['heel','toe'].includes(g.strike)&&Number.isFinite(sideWeight)&&sideWeight<60)return 'FORM keeps off-center forgiveness important while treating the reported heel/toe side cautiously.';if(g.strike==='varied')return 'Your strike moves around the face, so consistency across mishits matters more than one perfect strike.';if(g.strike==='heel'||g.strike==='toe')return `Your ${g.strike}-side strike pattern makes mishit stability especially relevant.`;return 'Forgiveness is useful insurance when contact moves away from center.';}
  function rankWhy(rows,i){
    const row=rows[i],other=i===0?rows[1]:rows[i-1];if(!row)return'';
    const rel=relative(rows,i),weak=rel.slice().sort((a,b)=>a.delta-b.delta),p=priorityLabels();
    if(!other)return `This is the cleanest overall match FORM found for your profile${p[0]?`, with ${p[0].toLowerCase()} carrying the most emphasis`:''}. Real-world testing should confirm that the modeled strengths show up in your dispersion and ball flight.`;
    const gap=Math.abs(row.s.overall-other.s.overall),best=rel[0],trade=weak[0];
    if(i===0){
      const lead=best&&best.delta>0.5?`${best.meta.label.toLowerCase()} is its clearest relative advantage`:'no single category clearly beats the finalist-group average; the lead comes from the combined weighted fit';
      const tie=gap<1.25?`The margin over #2 is only ${gap.toFixed(1)} Fit points, so FORM considers them the same testing tier.`:`It leads #2 by ${gap.toFixed(1)} Fit points.`;
      const watch=trade&&trade.delta<-0.5?`Its main pressure-test area is ${trade.meta.label.toLowerCase()}, where another finalist is stronger.`:`There is no single meaningful category penalty driving against it.`;
      return `${tie} ${lead}. ${watch}`;
    }
    const delta=(other.s.overall-row.s.overall).toFixed(1),counter=best&&best.delta>0.5?`${best.meta.label} is where this head gives you the strongest counterargument to the model above.`:`It does not have a category-level advantage over the finalist-group average; its case is the overall combination.`;
    const loss=trade&&trade.delta<-0.5?`${trade.meta.label} is the clearest reason it sits lower.`:'The difference is spread across several small categories rather than one meaningful weakness.';
    return `It sits ${delta} Fit points behind the model above. ${loss} ${counter} That makes it a useful side-by-side comparison rather than simply a lower-ranked fallback.`;
  }
  function proCon(rows,i){
    const row=rows[i],hi=relative(rows,i),lo=hi.slice().sort((a,b)=>a.delta-b.delta);if(!row||!hi.length)return{pros:[],cons:[]};
    const pros=[],cons=[],positive=hi.filter(v=>v.delta>0.5),negative=lo.filter(v=>v.delta<-0.5);
    if(positive.length){positive.slice(0,2).forEach(v=>{let t=`${v.meta.label} is a genuine relative advantage in this finalist group.`;if(v.k==='strike')t+=` ${strikeContext(row)}`;else if(v.delta>2)t+=' It is meaningfully better here than the average of the other finalists.';else t+=' The edge is modest, so it should be confirmed in side-by-side testing.';pros.push(t);});}
    else{const best=hi[0];pros.push(`This head does not beat the finalist-group average in any single scored category. Its best relative area is ${best.meta.label.toLowerCase()}, so its case is the combined fit rather than a standalone category advantage.`);}
    if(negative.length){negative.slice(0,2).forEach(v=>{let t=`${v.meta.label} is a real relative trade-off versus the other finalists.`;t+=v.delta<-2?' FORM sees enough separation here that it deserves deliberate pressure-testing.':' The difference is small and should not be treated as a disqualifier.';cons.push(t);});}
    else cons.push('FORM does not see a meaningful category-level disadvantage versus the finalist group. The deciding evidence should come from actual dispersion, launch and strike consistency in testing.');
    return {pros,cons};
  }
  function scoreGrid(row){return categoryRows(row).map(v=>{const x=v.x;if(!x)return `<div class="report100Metric"><span>${esc(v.meta.label)}</span><b>—</b><small>${esc(v.meta.short)}</small></div>`;return `<div class="report100Metric"><span>${esc(v.meta.label)}</span><b>${Math.round(x.score)}/100</b><em>${Math.round(x.normalizedWeight||0)}% weight</em><small>${esc(v.meta.short)}</small></div>`;}).join('');}
  function recommendation(best,current){
    if(!best)return {level:'No recommendation',text:'No eligible current-generation driver remained after the fitting constraints.'};
    if(current.score==null)return {level:'Test before replacing',text:'FORM can rank new drivers, but the current driver does not have enough product evidence for a defensible upgrade claim.'};
    const gap=r1(best.s.overall-current.score);
    if(current.exact===false)return {level:'Test before replacing',text:`FORM models the best new fit ${gap.toFixed(1)} points ahead, but your current-driver benchmark is inferred rather than directly evidenced. Use the gap to prioritize a side-by-side test; do not treat it as a purchase claim without measured validation.`};
    const diff=current.detail?ENG.compare(best.s,current.detail):[],wins=diff.filter(x=>x.delta>=4);
    if(gap<2.5||!wins.length)return {level:'No clear equipment upgrade',text:`The best new fit is ${gap.toFixed(1)} points ahead, but FORM does not see enough meaningful category improvement to justify replacement.`};
    let ev=null;try{ev=V81.recommendationEvidence?.(best.s);}catch(e){}
    if(ev&&Number(ev.combined)<72)return {level:'Worth a side-by-side test',text:`The best new fit is ${gap.toFixed(1)} points ahead, but recommendation support is ${Math.round(Number(ev.combined)||0)}%. FORM will use the result to prioritize testing; developing product evidence is not strong enough for a purchase-level upgrade claim on score separation alone.`};
    if(gap<6)return {level:'Worth a side-by-side test',text:`The modeled fit advantage is ${gap.toFixed(1)} points, led by ${wins.slice(0,2).map(x=>x.label.toLowerCase()).join(' and ')||'several smaller gains'}.`};
    return {level:'Strong upgrade candidate',text:`FORM sees a ${gap.toFixed(1)}-point fit advantage, led by ${wins.slice(0,3).map(x=>x.label.toLowerCase()).join(', ')||'multiple weighted categories'}.`};
  }
  function currentContext(g){const labels={great:'Very well',good:'Pretty well',mixed:'Mixed',poor:'Not well'};const bits=[];if(labels[g?.current])bits.push(`On-course report: ${labels[g.current]}`);(g?.currentClub?.problems||[]).slice(0,3).forEach(x=>bits.push(String(x).replace(/_/g,' ')));return bits;}
  function sharedSetup(rows,configs){
    const first=rows[0],c=configs[0];if(!first||!c)return'';
    const loft=c.loft,shaft=c.shaft,ev=c.evidence;const conf=ev?`${esc(ev.label)} · ${Math.round(clamp(Number(ev.combined)||0,0,100))}%`:'Developing';
    return `<section class="report100Setup"><div class="report100SetupHead"><div><span class="report100Label">Shared test setup</span><h3>Start every finalist from the same baseline.</h3></div><p>Loft and shaft are fitting starting points, not reasons one head ranks above another.</p></div><div class="report100SetupGrid"><div><span>Starting loft</span><b>${Number(loft.loft).toFixed(1)}°</b><small>Test ${esc(loft.range)}. ${esc(loft.reason||'Use this as the common baseline before head-specific fine tuning.')}</small></div><div><span>Shaft starting point</span><b>${esc(shaft.flex)}${shaft.weight&&!String(shaft.weight).startsWith('No ')?` · ${esc(shaft.weight)}`:''}</b><small>${esc(shaft.note||'Use this profile and weight window as the common comparison starting point.')}</small></div><div><span>Recommendation confidence</span><b>${conf}</b><small>Confidence in the leading recommendation based on your inputs and available product evidence. It does not change FORM Fit Score.</small></div></div></section>`;
  }
  function buildSnapshot(){
    const guard=sanitizeTemporarily();
    try{
      const g=golferNow(),rows=ENG.winners(g).slice(0,5),current=V81.currentReliability(g),configs=rows.map(configFor),sep=V81.separation(rows),insights=V81.profileInsight(g),upgrade=recommendation(rows[0],current);
      return {g,rows,current,configs,sep,insights,upgrade,guardNotes:guard.notes.slice()};
    }finally{guard.restore();}
  }
  function ensureResults(){let r=document.getElementById('results');if(!r){const main=document.querySelector('#driverExperience .mainPane');r=document.createElement('section');r.id='results';r.className='step hidden';main?.appendChild(r);}return r;}
  function renderReport(){
    styles();
    const snap=buildSnapshot(),{g,rows,current,configs,sep,insights,upgrade,guardNotes}=snap,results=ensureResults();
    const best=rows[0],currentName=[g.currentClub?.brand,g.currentClub?.model].filter(Boolean).join(' ')||'Current driver';
    results.className='step formReport100';
    const cards=rows.map((row,i)=>{const pc=proCon(rows,i);return `<article class="report100Card"><div class="report100Top"><div><div class="report100Rank">${i===0?'#1 FORM FIT':'#'+(i+1)+' ALTERNATIVE'}</div><h2>${esc(row.p.brand)} ${esc(row.p.model)}</h2></div><div class="report100Score">${row.s.overall.toFixed(1)}<small>FORM Fit Score</small></div></div><div class="report100Why"><b>${i===0?'Why it leads':'Why it ranks here'}:</b> ${esc(rankWhy(rows,i))}</div><div class="report100Metrics">${scoreGrid(row)}</div><div class="report100Read"><section><h4>Pros</h4><ul>${pc.pros.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section><section><h4>Cons</h4><ul>${pc.cons.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section></div></article>`;}).join('');
    const curScore=current.score==null?'—':`${current.exact?current.score.toFixed(1):'≈'+Math.round(current.score)}`,context=currentContext(g);
    results.innerHTML=`<div class="report100Hero"><div><span class="report100Kicker">PERSONALIZED DRIVER FIT</span><h1>Your FORM report.</h1><p>New-driver Fit Scores are calculated from your golfer profile and product evidence only. Your current driver is benchmarked separately below to determine whether changing equipment is actually justified.</p></div><div class="report100Lead"><span>Top modeled fit</span><b>${best?esc(best.p.brand+' '+best.p.model):'No eligible fit'}</b><small>${best?best.s.overall.toFixed(1)+' / 100 · '+esc(sep.label):'Review your constraints'}</small></div></div><div class="report100Signal"><div><span class="report100Label">Ranking separation</span><b>${esc(sep.label)}</b><small>${esc(sep.text)}</small></div><div><span class="report100Label">Eligible finalists</span><b>${rows.length}</b><small>One top model per manufacturer.</small></div><div><span class="report100Label">Input consistency</span><b>${guardNotes.length?'Adjusted':'Passed'}</b><small>${guardNotes.length?esc(guardNotes.join(' ')):'No implausible speed/ball-speed/carry conflict detected.'}</small></div></div>${sharedSetup(rows,configs)}<div class="report100Grid"><main class="report100Rankings">${cards||'<div class="report100Panel"><h3>No eligible models</h3><p>Broaden brand scope or revisit hard constraints.</p></div>'}</main><aside class="report100Aside"><section class="report100Panel"><span class="report100Label">Your fitting read</span><h3>What FORM sees</h3>${insights.length?`<ul>${insights.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'<p>No unusually strong interaction signal was identified; the ranking is being driven by the weighted component scores.</p>'}</section><section class="report100Panel"><span class="report100Label">Current driver — separate benchmark</span><h3>${esc(currentName)}</h3><div class="report100CurrentScore">${curScore} <small>/ 100</small></div><p>${esc(current.note||current.label||'Current-driver benchmark.')}</p>${context.length?`<div class="report100Guard">Reported experience · context only: ${esc(context.join(' · '))}. This does not alter any new-driver FORM Fit Score.</div>`:''}<div class="report100Upgrade"><span class="report100Label">Upgrade advice</span><b>${esc(upgrade.level)}</b><p>${esc(upgrade.text)}</p></div></section><section class="report100Panel"><span class="report100Label">Method</span><h3>Fit first. Upgrade second.</h3><p>FORM ranks current-generation heads against the same golfer need profile, preserves small score differences, and treats near-ties as the same testing tier. Purchase advice is a separate comparison against the current-driver benchmark.</p></section></aside></div>`;
    document.querySelectorAll('#driverExperience .step').forEach(x=>{if(x!==results)x.classList.add('hidden');});results.classList.remove('hidden');
    const nav=document.getElementById('flowNav');if(nav)nav.style.display='none';const bar=document.getElementById('progressBar');if(bar)bar.style.width='100%';const count=document.getElementById('stepCount');if(count)count.textContent='FIT COMPLETE';if(typeof step!=='undefined')step=10;
    try{if(typeof saveFit==='function')saveFit('driver',{title:'Driver Fit',topMatch:best?`${best.p.brand} ${best.p.model}`:'',topScore:best?.s.overall||null,currentClub:currentName,currentScore:current.score,upgrade:upgrade.level,evidence:best?evidenceCopy(best.s):null});}catch(e){}
    window.scrollTo({top:0,left:0,behavior:'auto'});
  }

  let building=false;
  function startResults(){
    if(building)return;building=true;const cta=document.querySelector('#step9 .readyBox button');if(cta){cta.disabled=true;cta.textContent='Preparing your fit…';}
    requestAnimationFrame(()=>{try{renderReport();}catch(err){console.error('FORM 10.83 report failed',err);if(cta){cta.disabled=false;cta.textContent='Generate My Fit →';}const box=document.querySelector('#step9 .readyBox');if(box&&!document.getElementById('formReport100Error')){const p=document.createElement('p');p.id='formReport100Error';p.style.cssText='margin:12px 0 0;color:#8b1e1e;font-weight:700';p.textContent='FORM received the request but could not build the report. Your fitting answers remain available.';box.appendChild(p);}}finally{building=false;}});
  }
  window.FORM_START_DRIVER_RESULTS=startResults;
  window.FORM_RENDER_DRIVER_REPORT_V100=renderReport;
  window.FORM_RENDER_DRIVER_REPORT_V181=renderReport;
  window.showResults=startResults;
  document.addEventListener('click',function(e){const b=e.target?.closest?.('#step9 .readyBox button');if(!b)return;e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();startResults();},true);
  document.addEventListener('touchend',function(e){const b=e.target?.closest?.('#step9 .readyBox button');if(!b)return;e.preventDefault();e.stopPropagation();startResults();},{capture:true,passive:false});
  window.FORM_DRIVER_RESULTS_CONTROLLER_V96=true;window.FORM_DRIVER_RESULTS_CONTROLLER_V100=true;window.FORM_DRIVER_RESULTS_CONTROLLER_V181={version:'10.83'};
  return true;
}
let tries=0;const t=setInterval(()=>{tries++;if(init()||tries>300)clearInterval(t);},50);
})();