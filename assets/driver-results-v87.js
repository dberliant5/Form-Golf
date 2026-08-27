// FORM 8.7 — data-driven analysis experience + premium results enhancements
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_RESULTS_V87)return true;
  const ENG=window.FORM_DRIVER_ENGINE_V80,V81=window.FORM_DRIVER_CONFIG_V81;
  if(!ENG||!V81||typeof window.showResults!=='function')return false;

  const metric=id=>state?.metrics?.[id]||{mode:'unknown',value:null};
  const golferNow=()=>typeof normalizedGolferV69==='function'?normalizedGolferV69():golfer();
  function classify(id,g){
    const m=metric(id);
    if(m.mode==='exact'&&m.value!=null){const x=+m.value;if(id==='spin')return x<2100?'low':x>3000?'high':'mid';if(id==='launch')return x<11?'low':x>17?'high':'mid';}
    if(m.mode==='range'){if(id==='spin')return ['under1500','1500-1749','1750-1999','2000-2249'].includes(m.value)?'low':['3000-3499','3500plus'].includes(m.value)?'high':'mid';if(id==='launch')return ['under8','8-10','10-12'].includes(m.value)?'low':['16-18','18-20','20plus'].includes(m.value)?'high':'mid';}
    if(m.mode==='general'){if(['verylow','low'].includes(m.value))return'low';if(['high','veryhigh'].includes(m.value))return'high';if(m.value)return'mid';}
    return id==='spin'?(g?.spin||null):id==='launch'?(g?.traj||null):null;
  }
  function speedValue(g){const m=metric('speed');if(m.mode==='exact'&&m.value!=null)return +m.value;if(Number(g?.speed))return Number(g.speed);return null;}
  function topPriority(g){const labels={accuracy:'Accuracy / forgiveness',distance:'Distance',flight:'Ball flight',feel:'Feel / sound',looks:'Looks / confidence',value:'Price / value'};const rows=Object.entries(g?.ranks||{}).sort((a,b)=>a[1]-b[1]);return rows.length?labels[rows[0][0]]||rows[0][0]:null;}
  function eligibleCount(g){
    try{return products.filter(p=>{if(p.generation==='previous_limited')return false;if(typeof productAllowedByBrandScope==='function'&&!productAllowedByBrandScope(p))return false;const s=ENG.scoreOne(p,g);return !s?.hardConstraints?.length;}).length;}catch(e){return null;}
  }

  function tipText(comp){const glossary={spin:'How well this head matches your spin needs.',strike:'How well the head protects your typical impact location through stability and off-center speed retention.',speed:'How well the head architecture and intended speed window match your club speed.',direction:'How well the head’s directional bias matches your normal curve and costly miss.',launch:'How well the head supports your needed launch window.',efficiency:'How well the head is expected to retain ball speed on imperfect contact.',carry:'A supporting check on whether launch, spin and speed characteristics are likely to translate into usable carry.'};return `${glossary[comp.key]||'A component of the FORM Fit Score.'} In this fit it carries ${Number(comp.normalizedWeight||0).toFixed(1)}% of the total score. Higher means a better match for your needs; this is not a universal product grade.`;}
  function closeTips(){document.querySelectorAll('.fitInfo87.open,.fitDelta87.open').forEach(x=>x.classList.remove('open'));}
  function bindTip(el){el.setAttribute('tabindex','0');el.setAttribute('role','button');el.onclick=e=>{e.stopPropagation();const was=el.classList.contains('open');closeTips();if(!was)el.classList.add('open');};}
  document.addEventListener('click',closeTips);
  function addTooltips(rows,cards){cards.forEach((card,i)=>{const row=rows[i];if(!row)return;const comps=row.s.components||[];[...card.querySelectorAll('.result70Breakdown>div')].forEach((cell,j)=>{const comp=comps[j],label=cell.querySelector('span');if(!comp||!label)return;label.classList.add('fitInfo87');label.dataset.tip=tipText(comp);bindTip(label);});card.querySelectorAll('.result70Current p').forEach(p=>{let html=p.innerHTML;comps.forEach(comp=>{const safe=comp.label.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');html=html.replace(new RegExp(safe,'g'),`<span class="fitDelta87" data-tip="This is the category-score difference between this recommendation and your current-driver benchmark. Positive favors the recommendation; negative favors the current driver. ${tipText(comp)}">${comp.label}</span>`);});p.innerHTML=html;p.querySelectorAll('.fitDelta87').forEach(bindTip);});});}
  function buildKey(build){return `${build.loft.toFixed(1)}|${build.shaft.flex}|${build.shaft.weight}`;}
  function consolidateBuild(rows,cards){if(!rows.length)return;const builds=rows.slice(0,5).map(r=>({loft:V81.loftFit(r.p),shaft:V81.shaftFit()})),same=builds.length>1&&builds.every(b=>buildKey(b)===buildKey(builds[0]));if(!same)return;cards.forEach(card=>card.querySelector('.fitConfig81')?.remove());const head=document.getElementById('fitSummary81')||document.querySelector('.results70Head');if(!head||document.getElementById('sharedBuild87'))return;const b=builds[0],el=document.createElement('section');el.id='sharedBuild87';el.className='sharedBuild87';el.innerHTML=`<div><span>YOUR STARTING BUILD</span><b>${b.loft.loft.toFixed(1)}° loft · ${b.shaft.flex}${b.shaft.weight.startsWith('No ')?'':` · ${b.shaft.weight}`}</b></div><p>All five finalists point to the same starting build, so FORM shows it once. Test loft window ${b.loft.range}. ${b.loft.reason} ${b.shaft.note}</p>`;head.insertAdjacentElement('afterend',el);}
  function differentiate(rows,cards){cards.forEach((card,i)=>{const row=rows[i];if(!row)return;card.classList.add(`resultTier87-${i+1}`);if(i===0)return;const strongest=(row.s.strengths||[])[0],labels=['CLOSEST ALTERNATIVE','PERFORMANCE ALTERNATIVE','TRADEOFF ALTERNATIVE','SECONDARY CONTENDER'];let line=card.querySelector('.altIdentity87');if(!line){line=document.createElement('div');line.className='altIdentity87';card.querySelector('.result70Top')?.insertAdjacentElement('afterend',line);}line.innerHTML=`<span>${labels[Math.min(i-1,labels.length-1)]}</span><b>${strongest?`Where it stands out: ${strongest.label}`:'A different balance of the same core needs'}</b>`;});}
  function enhance(){const g=golferNow(),rows=ENG.winners(g),cards=[...document.querySelectorAll('#result80Grid .result70Card')];if(!cards.length)return;addTooltips(rows,cards);consolidateBuild(rows,cards);differentiate(rows,cards);}

  function buildStages(){
    const g=golferNow(),rows=ENG.winners(g),spin=classify('spin',g),launch=classify('launch',g),speed=speedValue(g),strike=g?.strike,priority=topPriority(g),eligible=eligibleCount(g),gap=rows.length>1?Math.round((rows[0].s.overall-rows[1].s.overall)*10)/10:null,cur=ENG.currentScore(g);
    const stages=[];
    const profileBits=[];if(speed)profileBits.push(`${Math.round(speed)} mph`);if(launch)profileBits.push(`${launch} launch`);if(spin)profileBits.push(`${spin} spin`);
    stages.push({title:'Reading your delivery profile',detail:profileBits.length?`FORM is starting from ${profileBits.join(' · ')}.`:'FORM is building the delivery profile from your directional, strike and trajectory answers.',ms:720});
    if(launch==='low'&&spin==='low')stages.push({title:'Protecting launch without losing more spin',detail:'Low launch and low spin can punish the wrong head. FORM is favoring launch support and spin preservation rather than another low-spin design.',ms:1550});
    else if(launch==='high'&&spin==='high')stages.push({title:'Controlling flight and excess spin',detail:'FORM is testing whether lower-spin heads improve flight without giving away too much stability.',ms:1380});
    else if((launch==='low'&&spin==='high')||(launch==='high'&&spin==='low'))stages.push({title:'Reconciling competing launch and spin signals',detail:'Those two signals point in different fitting directions, so FORM is reducing confidence in any simple loft-only answer.',ms:1700});
    else stages.push({title:'Setting the launch and spin window',detail:'No major launch/spin conflict was detected, so this pass is shorter.',ms:780});
    if(['toe','heel','varied'].includes(strike))stages.push({title:`Testing ${strike==='varied'?'across-face':strike+'-strike'} protection`,detail:`Your ${strike} strike pattern makes off-center retention a primary discriminator, not just a generic forgiveness score.`,ms:1320});
    else stages.push({title:'Checking stability requirements',detail:'Your strike pattern does not require FORM to over-prioritize maximum MOI.',ms:690});
    stages.push({title:'Applying your stated priorities',detail:priority?`${priority} is your highest-ranked preference, but technical fit guardrails still stay in place.`:'Technical fit remains primary because no clear preference hierarchy was available.',ms:860});
    stages.push({title:'Narrowing the eligible market',detail:eligible!=null?`${eligible} current heads remain eligible after brand scope and hard-fit constraints. FORM is keeping the best fit from each manufacturer for comparison.`:'FORM is narrowing the eligible current-generation market to manufacturer finalists.',ms:940});
    if(gap!=null&&gap<1.25)stages.push({title:'The top group is extremely close',detail:`Only ${gap.toFixed(1)} Fit points separate the first two manufacturer finalists. FORM is checking weighted category separation before preserving the rank order.`,ms:1850});
    else if(gap!=null&&gap<2.75)stages.push({title:'Checking a narrow lead',detail:`The top two are ${gap.toFixed(1)} Fit points apart. FORM is verifying that the lead comes from categories that actually matter to your profile.`,ms:1420});
    else if(gap!=null)stages.push({title:'Confirming the leading fit',detail:`The leading manufacturer is ${gap.toFixed(1)} Fit points clear of #2, so less tie-break analysis is needed.`,ms:820});
    if(cur?.score!=null)stages.push({title:'Separating fit from upgrade value',detail:`Your current driver is being benchmarked separately at ${cur.score.toFixed(1)}. That comparison cannot change any new-driver FORM Fit Score.`,ms:1080});
    else stages.push({title:'Keeping upgrade claims conservative',detail:'FORM does not have enough current-driver evidence for a precise upgrade claim, so the new-driver ranking will stand on its own.',ms:900});
    stages.push({title:'Building your FORM report',detail:'Organizing the finalist hierarchy, starting build, evidence strength and model-specific tradeoffs.',ms:720});
    return stages;
  }

  function analysisOverlay(done){
    const main=document.querySelector('#driverExperience .mainPane')||document.getElementById('driverExperience');if(!main){done();return;}
    document.getElementById('formAnalysis87')?.remove();const stages=buildStages();const el=document.createElement('section');el.id='formAnalysis87';el.className='formAnalysis87';
    el.innerHTML=`<div class="analysisMark87">FORM</div><div class="analysisKicker87">PERSONALIZED FIT ANALYSIS</div><h2 id="analysisTitle87">${stages[0].title}</h2><p id="analysisDetail87">${stages[0].detail}</p><div class="analysisTrack87"><div id="analysisFill87"></div></div><div class="analysisLedger87"></div>`;
    main.appendChild(el);document.querySelectorAll('#driverExperience .step').forEach(x=>x.classList.add('hidden'));const nav=document.getElementById('flowNav');if(nav)nav.style.display='none';window.scrollTo({top:0,left:0,behavior:'smooth'});
    const title=el.querySelector('#analysisTitle87'),detail=el.querySelector('#analysisDetail87'),fill=el.querySelector('#analysisFill87'),ledger=el.querySelector('.analysisLedger87');let i=0;
    function render(){const s=stages[i];title.textContent=s.title;detail.textContent=s.detail;fill.style.width=`${Math.round((i+1)/stages.length*100)}%`;ledger.innerHTML=stages.slice(0,i).slice(-3).map((x,j)=>`<div><span>✓</span><p>${x.title}</p></div>`).join('');setTimeout(()=>{i++;if(i<stages.length)render();else setTimeout(()=>{el.remove();done();},360);},s.ms);}
    render();
  }

  const priorResults=window.showResults;
  window.showResults=function(){
    if(window.__form87Building)return;
    window.__form87Building=true;
    const ctx=this,args=arguments;
    analysisOverlay(()=>{
      try{
        priorResults.apply(ctx,args);
        setTimeout(enhance,100);
      }finally{
        window.__form87Building=false;
      }
    });
  };

  const s=document.createElement('style');s.id='form87styles';s.textContent=`
.fitInfo87,.fitDelta87{position:relative;text-decoration:underline;text-decoration-style:dotted;text-underline-offset:3px;cursor:help}.fitInfo87:after,.fitDelta87:after{content:attr(data-tip);display:none;position:absolute;z-index:1000;left:50%;transform:translateX(-50%);bottom:calc(100% + 9px);width:min(330px,calc(100vw - 32px));box-sizing:border-box;padding:12px 13px;border:1px solid var(--line);background:#fff;box-shadow:0 14px 36px rgba(0,0,0,.15);font-size:10px;line-height:1.55;color:var(--deep);font-weight:400;text-transform:none;letter-spacing:0;white-space:normal}.fitInfo87:hover:after,.fitInfo87:focus:after,.fitInfo87.open:after,.fitDelta87:hover:after,.fitDelta87:focus:after,.fitDelta87.open:after{display:block}.sharedBuild87{margin:0 0 24px;padding:20px 22px;border:1px solid var(--line);display:grid;grid-template-columns:minmax(260px,.8fr) minmax(0,1.5fr);gap:26px;background:#fff}.sharedBuild87 span,.altIdentity87 span{display:block;font-size:8px;letter-spacing:.14em;font-weight:900;color:var(--muted)}.sharedBuild87 b{display:block;margin-top:6px;font-size:18px}.sharedBuild87 p{margin:0;font-size:11px;line-height:1.6;color:var(--muted)}.altIdentity87{padding:13px 14px;border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:#f7f8f4}.altIdentity87 b{display:block;margin-top:5px;font-size:11px}.resultTier87-2{box-shadow:inset 0 4px 0 var(--deep)}.resultTier87-3{background:linear-gradient(180deg,#fff,#fafbf8)}.resultTier87-4,.resultTier87-5{background:#fcfcfa}.formAnalysis87{min-height:72vh;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;max-width:820px;margin:0 auto;padding:64px 28px}.analysisMark87{font-family:Georgia,serif;font-size:28px;letter-spacing:.24em}.analysisKicker87{margin-top:22px;font-size:9px;letter-spacing:.18em;font-weight:900;color:var(--muted)}.formAnalysis87 h2{max-width:690px;margin:13px 0 10px;font-size:34px;line-height:1.08}.formAnalysis87>p{max-width:660px;min-height:44px;margin:0;color:var(--muted);font-size:12px;line-height:1.65}.analysisTrack87{width:100%;height:2px;margin:28px 0 20px;background:var(--line);overflow:hidden}.analysisTrack87 div{height:100%;width:0;background:var(--deep);transition:width .5s ease}.analysisLedger87{display:grid;gap:7px;min-height:70px}.analysisLedger87 div{display:flex;gap:9px;align-items:center;color:var(--muted);font-size:10px}.analysisLedger87 span{font-weight:900;color:var(--deep)}.analysisLedger87 p{margin:0}@media(max-width:700px){.sharedBuild87{grid-template-columns:1fr}.fitInfo87:after,.fitDelta87:after{position:fixed;left:16px;right:16px;bottom:22px;top:auto;transform:none;width:auto;max-height:45vh;overflow:auto;font-size:12px;line-height:1.55}.formAnalysis87{min-height:74vh;padding:44px 24px}.formAnalysis87 h2{font-size:29px}.formAnalysis87>p{font-size:13px;min-height:72px}.analysisMark87{font-size:24px}}
`;document.head.appendChild(s);window.FORM_DRIVER_RESULTS_V87={enhance,buildStages};return true;
}
let tries=0,t=setInterval(()=>{tries++;if(init()||tries>100)clearInterval(t);},50);
})();