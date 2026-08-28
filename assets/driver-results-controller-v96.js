// FORM 10.0 — direct, non-recursive driver report renderer.
// Uses the evidence-driven V80 engine and V81 configuration helpers directly.
(function(){
'use strict';

function init(){
  if(window.FORM_DRIVER_RESULTS_CONTROLLER_V100)return true;
  const ENG=window.FORM_DRIVER_ENGINE_V80,V81=window.FORM_DRIVER_CONFIG_V81;
  if(!ENG||!V81||typeof golfer!=='function')return false;

  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const r1=v=>Math.round(v*10)/10;
  const stateRef=()=>typeof state!=='undefined'?state:null;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function styles(){
    if(document.getElementById('formReport100Styles'))return;
    const s=document.createElement('style');s.id='formReport100Styles';s.textContent=`
    #results.formReport100{padding:30px 0 70px}.report100Hero{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(260px,.7fr);gap:28px;align-items:end;padding:34px 0 26px;border-bottom:1px solid var(--line)}.report100Hero h1{font-size:42px;line-height:1.02;margin:8px 0 10px}.report100Hero p{margin:0;max-width:760px;color:var(--muted);font-size:12px;line-height:1.65}.report100Lead{border-left:1px solid var(--line);padding-left:24px}.report100Lead span,.report100Kicker,.report100Label{display:block;font-size:8px;letter-spacing:.16em;text-transform:uppercase;font-weight:900;color:var(--muted)}.report100Lead b{display:block;margin-top:6px;font-size:30px}.report100Lead small{display:block;margin-top:5px;color:var(--muted);font-size:9px;line-height:1.5}
    .report100Signal{margin:18px 0;padding:14px 16px;border:1px solid var(--line);background:#fafbf8;display:flex;gap:22px;flex-wrap:wrap}.report100Signal div{min-width:150px}.report100Signal b{display:block;margin-top:4px;font-size:11px}.report100Signal small{display:block;margin-top:3px;color:var(--muted);font-size:9px}
    .report100Grid{display:grid;grid-template-columns:minmax(0,1.65fr) minmax(260px,.75fr);gap:28px;margin-top:26px}.report100Rankings{display:grid;gap:16px}.report100Card{border:1px solid var(--line);background:#fff;padding:22px}.report100Card:first-child{border-top:4px solid var(--deep);padding-top:19px}.report100Top{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:20px;align-items:start}.report100Rank{font-size:8px;letter-spacing:.15em;text-transform:uppercase;font-weight:900;color:var(--muted)}.report100Card h2{font-size:25px;margin:6px 0 0}.report100Score{text-align:right;font-size:31px;font-weight:800;line-height:1}.report100Score small{display:block;margin-top:5px;font-size:8px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:700}.report100Why{margin-top:14px;padding-top:13px;border-top:1px solid var(--line);font-size:10px;line-height:1.55;color:var(--muted)}.report100Why b{color:var(--deep)}
    .report100Config{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line);margin-top:16px}.report100Config>div{background:#fff;padding:13px}.report100Config b{display:block;margin-top:4px;font-size:12px}.report100Config small{display:block;margin-top:4px;font-size:8.5px;line-height:1.45;color:var(--muted)}
    .report100Break{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:14px}.report100Break div{border-top:1px solid var(--line);padding-top:9px}.report100Break span{display:block;font-size:8px;color:var(--muted);line-height:1.3}.report100Break b{display:block;margin-top:4px;font-size:12px}.report100Break em{display:block;margin-top:2px;font-style:normal;font-size:8px;color:var(--muted)}
    .report100Aside{display:grid;gap:16px;align-content:start}.report100Panel{border:1px solid var(--line);padding:19px;background:#fff}.report100Panel h3{font-size:17px;margin:6px 0 10px}.report100Panel p{font-size:10px;line-height:1.6;color:var(--muted);margin:0}.report100Panel ul{padding-left:17px;margin:10px 0 0}.report100Panel li{font-size:9.5px;line-height:1.5;margin:5px 0;color:var(--muted)}.report100CurrentScore{font-size:29px;font-weight:800}.report100CurrentScore small{font-size:9px;color:var(--muted);font-weight:600}.report100Upgrade{margin-top:14px;padding-top:13px;border-top:1px solid var(--line)}.report100Upgrade b{display:block;font-size:13px}.report100Upgrade p{margin-top:5px}.report100Guard{margin-top:10px;padding-top:10px;border-top:1px dashed var(--line);font-size:9px;line-height:1.5;color:var(--muted)}
    @media(max-width:820px){.report100Hero,.report100Grid{grid-template-columns:1fr}.report100Lead{border-left:0;border-top:1px solid var(--line);padding:16px 0 0}.report100Config{grid-template-columns:1fr}.report100Break{grid-template-columns:repeat(2,minmax(0,1fr))}.report100Hero h1{font-size:34px}}
    `;document.head.appendChild(s);
  }
  styles();

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
  function evidenceCopy(s){const e=V81.recommendationEvidence(s);return `${e.label} · ${Math.round(e.combined)}%`;}
  function configFor(row){return {loft:V81.loftFit(row.p),shaft:V81.shaftFit(),evidence:V81.recommendationEvidence(row.s)};}
  function strengthText(row){const a=(row.s.strengths||[]).filter(x=>Number.isFinite(x.impact)).slice(0,2);return a.length?a.map(x=>`${x.label} ${Math.round(x.score)}/100`).join(' · '):'Balanced fit across the weighted profile.';}
  function rankWhy(rows,i){
    const row=rows[i],other=i===0?rows[1]:rows[i-1];if(!other)return strengthText(row);
    const lead=i===0?row:other,trail=i===0?other:row,gap=r1(lead.s.overall-trail.s.overall),diff=V81.weightedDifferences(lead.s,trail.s).filter(x=>x.delta>0).slice(0,2);
    if(gap<1.25)return `Only ${gap.toFixed(1)} Fit points separate these models; treat them as the same testing tier. ${diff.length?'Largest weighted separation: '+diff.map(x=>`${x.label} +${x.delta.toFixed(1)}`).join(' · ')+'.':''}`;
    if(i===0)return `${gap.toFixed(1)} Fit points clear of #2${diff.length?', led by '+diff.map(x=>`${x.label} +${x.delta.toFixed(1)} weighted impact`).join(' and '):''}.`;
    return `${gap.toFixed(1)} Fit points behind the model above${diff.length?', mainly in '+diff.map(x=>x.label.toLowerCase()).join(' and '):''}.`;
  }
  function breakdown(row){return (row.s.components||[]).slice().sort((a,b)=>(b.normalizedWeight||0)-(a.normalizedWeight||0)).slice(0,4).map(x=>`<div><span>${esc(x.label)}</span><b>${Math.round(x.score)}/100</b><em>${Math.round(x.normalizedWeight||0)}% weight</em></div>`).join('');}
  function recommendation(best,current){
    if(!best)return {level:'No recommendation',text:'No eligible current-generation driver remained after the fitting constraints.'};
    if(current.score==null)return {level:'Test before replacing',text:'FORM can rank new drivers, but the current driver does not have enough product evidence for a defensible upgrade claim.'};
    const gap=r1(best.s.overall-current.score),diff=current.detail?ENG.compare(best.s,current.detail):[],wins=diff.filter(x=>x.delta>=4);
    if(gap<2.5||!wins.length)return {level:'No clear equipment upgrade',text:`The best new fit is ${gap.toFixed(1)} points ahead, but FORM does not see enough meaningful category improvement to justify replacement.`};
    if(gap<6)return {level:'Worth a side-by-side test',text:`The modeled fit advantage is ${gap.toFixed(1)} points, led by ${wins.slice(0,2).map(x=>x.label.toLowerCase()).join(' and ')||'several smaller gains'}.`};
    return {level:'Strong upgrade candidate',text:`FORM sees a ${gap.toFixed(1)}-point fit advantage, led by ${wins.slice(0,3).map(x=>x.label.toLowerCase()).join(', ')||'multiple weighted categories'}.`};
  }
  function currentContext(g){const labels={great:'Very well',good:'Pretty well',mixed:'Mixed',poor:'Not well'};const bits=[];if(labels[g?.current])bits.push(`On-course report: ${labels[g.current]}`);(g?.currentClub?.problems||[]).slice(0,3).forEach(x=>bits.push(String(x).replace(/_/g,' ')));return bits;}

  function buildSnapshot(){
    const guard=sanitizeTemporarily();
    try{
      const g=golferNow(),rows=ENG.winners(g).slice(0,5),current=V81.currentReliability(g),configs=rows.map(configFor),sep=V81.separation(rows),insights=V81.profileInsight(g),upgrade=recommendation(rows[0],current);
      return {g,rows,current,configs,sep,insights,upgrade,guardNotes:guard.notes.slice()};
    }finally{guard.restore();}
  }
  function ensureResults(){let r=document.getElementById('results');if(!r){const main=document.querySelector('#driverExperience .mainPane');r=document.createElement('section');r.id='results';r.className='step hidden';main?.appendChild(r);}return r;}
  function renderReport(){
    const snap=buildSnapshot(),{g,rows,current,configs,sep,insights,upgrade,guardNotes}=snap,results=ensureResults();
    const best=rows[0],currentName=[g.currentClub?.brand,g.currentClub?.model].filter(Boolean).join(' ')||'Current driver';
    results.className='step formReport100';
    const cards=rows.map((row,i)=>{const c=configs[i],loft=c.loft,shaft=c.shaft;return `<article class="report100Card"><div class="report100Top"><div><div class="report100Rank">${i===0?'#1 FORM FIT':'#'+(i+1)+' ALTERNATIVE'}</div><h2>${esc(row.p.brand)} ${esc(row.p.model)}</h2></div><div class="report100Score">${row.s.overall.toFixed(1)}<small>FORM Fit Score</small></div></div><div class="report100Why"><b>${i===0?'Why it leads':'Why it ranks here'}:</b> ${esc(rankWhy(rows,i))}</div><div class="report100Config"><div><span class="report100Label">Starting loft</span><b>${loft.loft.toFixed(1)}°</b><small>Test ${esc(loft.range)}. ${esc(loft.reason)}</small></div><div><span class="report100Label">Shaft starting point</span><b>${esc(shaft.flex)}${shaft.weight.startsWith('No ')?'':` · ${esc(shaft.weight)}`}</b><small>${esc(shaft.note)}</small></div><div><span class="report100Label">Recommendation evidence</span><b>${esc(evidenceCopy(row.s))}</b><small>Evidence strength supports confidence in this recommendation; it does not change the Fit Score.</small></div></div><div class="report100Break">${breakdown(row)}</div></article>`;}).join('');
    const curScore=current.score==null?'—':`${current.exact?current.score.toFixed(1):'≈'+Math.round(current.score)}`;
    const context=currentContext(g);
    results.innerHTML=`<div class="report100Hero"><div><span class="report100Kicker">PERSONALIZED DRIVER FIT</span><h1>Your FORM report.</h1><p>New-driver Fit Scores are calculated from your golfer profile and product evidence only. Your current driver is benchmarked separately below to determine whether changing equipment is actually justified.</p></div><div class="report100Lead"><span>Top modeled fit</span><b>${best?esc(best.p.brand+' '+best.p.model):'No eligible fit'}</b><small>${best?best.s.overall.toFixed(1)+' / 100 · '+esc(sep.label):'Review your constraints'}</small></div></div><div class="report100Signal"><div><span class="report100Label">Ranking separation</span><b>${esc(sep.label)}</b><small>${esc(sep.text)}</small></div><div><span class="report100Label">Eligible finalists</span><b>${rows.length}</b><small>One top model per manufacturer.</small></div><div><span class="report100Label">Input consistency</span><b>${guardNotes.length?'Adjusted':'Passed'}</b><small>${guardNotes.length?esc(guardNotes.join(' ')):'No implausible speed/ball-speed/carry conflict detected.'}</small></div></div><div class="report100Grid"><main class="report100Rankings">${cards||'<div class="report100Panel"><h3>No eligible models</h3><p>Broaden brand scope or revisit hard constraints.</p></div>'}</main><aside class="report100Aside"><section class="report100Panel"><span class="report100Label">Your fitting read</span><h3>What FORM sees</h3>${insights.length?`<ul>${insights.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'<p>No unusually strong interaction signal was identified; the ranking is being driven by the weighted component scores.</p>'}</section><section class="report100Panel"><span class="report100Label">Current driver — separate benchmark</span><h3>${esc(currentName)}</h3><div class="report100CurrentScore">${curScore} <small>/ 100</small></div><p>${esc(current.note||current.label||'Current-driver benchmark.')}</p>${context.length?`<div class="report100Guard">Reported experience · context only: ${esc(context.join(' · '))}. This does not alter any new-driver FORM Fit Score.</div>`:''}<div class="report100Upgrade"><span class="report100Label">Upgrade advice</span><b>${esc(upgrade.level)}</b><p>${esc(upgrade.text)}</p></div></section><section class="report100Panel"><span class="report100Label">Method</span><h3>Fit first. Upgrade second.</h3><p>FORM ranks current-generation heads against the same golfer need profile, preserves small score differences, and treats near-ties as the same testing tier. Purchase advice is a separate comparison against the current-driver benchmark.</p></section></aside></div>`;
    document.querySelectorAll('#driverExperience .step').forEach(x=>{if(x!==results)x.classList.add('hidden');});results.classList.remove('hidden');const nav=document.getElementById('flowNav');if(nav)nav.style.display='none';const bar=document.getElementById('progressBar');if(bar)bar.style.width='100%';const count=document.getElementById('stepCount');if(count)count.textContent='FIT COMPLETE';if(typeof step!=='undefined')step=10;try{if(typeof saveFit==='function')saveFit('driver',{title:'Driver Fit',topMatch:best?`${best.p.brand} ${best.p.model}`:'',topScore:best?.s.overall||null,currentClub:currentName,currentScore:current.score,upgrade:upgrade.level,evidence:best?evidenceCopy(best.s):null});}catch(e){}window.scrollTo({top:0,left:0,behavior:'auto'});
  }

  let building=false;
  function startResults(){
    if(building)return;building=true;const cta=document.querySelector('#step9 .readyBox button');if(cta){cta.disabled=true;cta.textContent='Preparing your fit…';}
    requestAnimationFrame(()=>{try{renderReport();}catch(err){console.error('FORM 10.0 report failed',err);if(cta){cta.disabled=false;cta.textContent='Generate My Fit →';}const box=document.querySelector('#step9 .readyBox');if(box&&!document.getElementById('formReport100Error')){const p=document.createElement('p');p.id='formReport100Error';p.style.cssText='margin:12px 0 0;color:#8b1e1e;font-weight:700';p.textContent='FORM received the request but could not build the report. Your fitting answers remain available.';box.appendChild(p);}}finally{building=false;}});
  }
  window.FORM_START_DRIVER_RESULTS=startResults;
  window.FORM_RENDER_DRIVER_REPORT_V100=renderReport;
  window.showResults=startResults;
  document.addEventListener('click',function(e){const b=e.target?.closest?.('#step9 .readyBox button');if(!b)return;e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();startResults();},true);
  document.addEventListener('touchend',function(e){const b=e.target?.closest?.('#step9 .readyBox button');if(!b)return;e.preventDefault();e.stopPropagation();startResults();},{capture:true,passive:false});
  window.FORM_DRIVER_RESULTS_CONTROLLER_V96=true;window.FORM_DRIVER_RESULTS_CONTROLLER_V97=true;window.FORM_DRIVER_RESULTS_CONTROLLER_V98=true;window.FORM_DRIVER_RESULTS_CONTROLLER_V99=true;window.FORM_DRIVER_RESULTS_CONTROLLER_V100=true;
  return true;
}
let tries=0;const t=setInterval(()=>{tries++;if(init()||tries>300)clearInterval(t);},50);
})();