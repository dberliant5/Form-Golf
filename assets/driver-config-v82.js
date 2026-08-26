// FORM 8.2 — premium result explainability, shared-build consolidation, fresh brand scope, and analysis transition
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_CONFIG_V82)return true;
  const ENG=window.FORM_DRIVER_ENGINE_V80,V81=window.FORM_DRIVER_CONFIG_V81;
  if(!ENG||!V81||typeof window.showResults!=='function')return false;
  const r1=v=>Math.round(v*10)/10;
  const glossary={
    spin:'How well this head matches your spin needs. Higher is better for your profile. The weight rises when spin is known precisely or is a major fitting constraint.',
    strike:'How well the head protects your typical impact location through stability and off-center speed retention. The weight rises when your strike is off-center or variable.',
    speed:'How well the head architecture and intended speed window match your club speed. It is not a claim that one driver is universally faster.',
    direction:'How well the head’s directional bias matches your normal curve and costly miss. For a two-way or conflicting pattern, FORM rewards neutrality rather than aggressive correction.',
    launch:'How well the head supports your needed launch window. The weight rises when launch is known precisely or is clearly too high/low.',
    efficiency:'How well the head is expected to retain ball speed on imperfect contact. This matters more when strike is off-center or measured efficiency is low.',
    carry:'A supporting check on whether launch, spin and speed characteristics are likely to translate into usable carry. It is deliberately lower-weight than core fitting needs.'
  };
  const keyFromLabel=label=>{label=String(label||'').toLowerCase();if(label.includes('spin'))return'spin';if(label.includes('toe')||label.includes('heel')||label.includes('stability')||label.includes('face'))return'strike';if(label.includes('speed / design'))return'speed';if(label.includes('direction'))return'direction';if(label.includes('launch'))return'launch';if(label.includes('ball-speed'))return'efficiency';if(label.includes('carry'))return'carry';return null;};
  function tipText(comp){const base=glossary[comp.key]||'A component of the absolute FORM Fit Score.';return `${base} In this fit it carries ${Number(comp.normalizedWeight||0).toFixed(1)}% of the total score. A category score compares this model with your needs; it is not a universal product grade.`;}
  function addTooltips(rows,cards){
    cards.forEach((card,i)=>{
      const row=rows[i];if(!row)return;
      const comps=row.s.components||[];
      [...card.querySelectorAll('.result70Breakdown>div')].forEach((cell,j)=>{const comp=comps[j];if(!comp)return;const label=cell.querySelector('span');if(!label)return;label.classList.add('fitInfo82');label.setAttribute('tabindex','0');label.dataset.tip=tipText(comp);});
      const current=card.querySelector('.result70Current');if(current){
        current.querySelectorAll('p').forEach(p=>{let html=p.innerHTML;Object.values(comps).forEach(comp=>{const safe=comp.label.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');html=html.replace(new RegExp(safe,'g'),`<span class="fitDelta82" tabindex="0" data-tip="This comparison is the category-score difference between this recommended head and your current-driver benchmark. Positive favors the recommendation; negative favors the current driver. ${tipText(comp)}">${comp.label}</span>`);});p.innerHTML=html;});
      }
    });
  }
  function buildKey(build){return `${build.loft.toFixed(1)}|${build.shaft.flex}|${build.shaft.weight}`;}
  function consolidateBuild(rows,cards){
    if(!rows.length)return;
    const builds=rows.map(r=>({loft:V81.loftFit(r.p),shaft:V81.shaftFit()}));
    const same=builds.every(b=>buildKey(b)===buildKey(builds[0]));
    if(!same)return;
    cards.forEach(card=>card.querySelector('.fitConfig81')?.remove());
    const head=document.getElementById('fitSummary81')||document.querySelector('.results70Head');if(!head||document.getElementById('sharedBuild82'))return;
    const b=builds[0],el=document.createElement('section');el.id='sharedBuild82';el.className='sharedBuild82';el.innerHTML=`<div><span>YOUR STARTING BUILD</span><b>${b.loft.loft.toFixed(1)}° loft · ${b.shaft.flex}${b.shaft.weight.startsWith('No ')?'':` · ${b.shaft.weight}`}</b></div><p>All finalists point to the same starting build, so FORM shows it once instead of repeating it on every card. Test loft window ${b.loft.range}. ${b.loft.reason} ${b.shaft.note}</p>`;head.insertAdjacentElement('afterend',el);
  }
  function differentiate(rows,cards){
    cards.forEach((card,i)=>{const row=rows[i];if(!row)return;card.classList.add(`resultTier82-${i+1}`);if(i===0)return;const strongest=(row.s.strengths||[])[0],labels=['Closest alternative','Performance alternative','Tradeoff alternative','Secondary contender'];const line=document.createElement('div');line.className='altIdentity82';line.innerHTML=`<span>${labels[Math.min(i-1,labels.length-1)]}</span><b>${strongest?`Best case: ${strongest.label}`:'A different balance of the same core needs'}</b>`;card.querySelector('.result70Top')?.insertAdjacentElement('afterend',line);});
  }
  function enhance(){const g=typeof normalizedGolferV69==='function'?normalizedGolferV69():golfer(),rows=ENG.winners(g),cards=[...document.querySelectorAll('#result80Grid .result70Card')];if(!cards.length)return;addTooltips(rows,cards);consolidateBuild(rows,cards);differentiate(rows,cards);}
  function analysisOverlay(done){
    const main=document.querySelector('#driverExperience .mainPane')||document.getElementById('driverExperience');if(!main){done();return;}
    document.getElementById('formAnalysis82')?.remove();const el=document.createElement('section');el.id='formAnalysis82';el.className='formAnalysis82';el.innerHTML=`<div class="analysisMark82">FORM</div><h2>Building your driver fit.</h2><div class="analysisSteps82"><span class="on">Analyzing your delivery</span><span>Matching product characteristics</span><span>Stress-testing tradeoffs</span><span>Building your report</span></div>`;main.appendChild(el);document.querySelectorAll('#driverExperience .step').forEach(x=>x.classList.add('hidden'));document.getElementById('flowNav')?.setAttribute('style','display:none');window.scrollTo({top:0,left:0,behavior:'smooth'});
    const steps=[...el.querySelectorAll('.analysisSteps82 span')];let n=0;const timer=setInterval(()=>{steps[n]?.classList.remove('on');n++;steps[n]?.classList.add('on');if(n>=steps.length-1){clearInterval(timer);setTimeout(()=>{el.remove();done();},420);}},420);
  }
  const priorResults=window.showResults;
  window.showResults=function(){if(window.__form82Building)return;window.__form82Building=true;analysisOverlay(()=>{try{priorResults.apply(this,arguments);setTimeout(enhance,80);}finally{window.__form82Building=false;}});};
  const priorOpen=window.openFit;
  if(typeof priorOpen==='function')window.openFit=function(id){if(id==='driver'){try{window.formBrandScopeConfirmed=false;}catch(e){}try{formBrandScopeConfirmed=false;}catch(e){}try{localStorage.setItem('formBrandScopeConfirmed','false');}catch(e){}}return priorOpen.apply(this,arguments);};
  const s=document.createElement('style');s.id='form82styles';s.textContent=`
    .fitInfo82,.fitDelta82{position:relative;text-decoration:underline;text-decoration-style:dotted;text-underline-offset:3px;cursor:help}.fitInfo82:after,.fitDelta82:after{content:attr(data-tip);display:none;position:absolute;z-index:40;left:0;bottom:calc(100% + 9px);width:min(330px,75vw);padding:12px 13px;border:1px solid var(--line);background:#fff;box-shadow:0 14px 36px rgba(0,0,0,.12);font-size:10px;line-height:1.55;color:var(--deep);font-weight:400;text-transform:none;letter-spacing:0}.fitInfo82:hover:after,.fitInfo82:focus:after,.fitDelta82:hover:after,.fitDelta82:focus:after{display:block}
    .sharedBuild82{margin:0 0 24px;padding:20px 22px;border:1px solid var(--line);display:grid;grid-template-columns:minmax(260px,.8fr) minmax(0,1.5fr);gap:26px;background:#fff}.sharedBuild82 span,.altIdentity82 span{display:block;font-size:8px;letter-spacing:.14em;font-weight:900;color:var(--muted)}.sharedBuild82 b{display:block;margin-top:6px;font-size:18px}.sharedBuild82 p{margin:0;font-size:11px;line-height:1.6;color:var(--muted)}
    .altIdentity82{padding:12px 14px 0;border-top:1px solid var(--line)}.altIdentity82 b{display:block;margin-top:4px;font-size:10px}.resultTier82-2{box-shadow:inset 0 3px 0 var(--deep)}.resultTier82-3{background:linear-gradient(180deg,#fff,#fcfcfa)}.resultTier82-4,.resultTier82-5{opacity:.94}.resultTier82-4:hover,.resultTier82-5:hover{opacity:1}
    .formAnalysis82{min-height:58vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:60px 20px}.analysisMark82{font-size:11px;letter-spacing:.28em;font-weight:900}.formAnalysis82 h2{margin:15px 0 24px;font-size:30px}.analysisSteps82{display:grid;gap:9px;min-width:min(420px,90vw);text-align:left}.analysisSteps82 span{padding:10px 14px;border-left:2px solid var(--line);font-size:11px;color:var(--muted);transition:.25s ease}.analysisSteps82 span.on{border-left-color:var(--deep);color:var(--deep);font-weight:800;transform:translateX(4px)}
    @media(max-width:700px){.sharedBuild82{grid-template-columns:1fr}.fitInfo82:after,.fitDelta82:after{left:auto;right:0}}
  `;document.head.appendChild(s);
  window.FORM_DRIVER_CONFIG_V82={enhance};return true;
}
let tries=0,t=setInterval(()=>{tries++;if(init()||tries>80)clearInterval(t);},50);
})();