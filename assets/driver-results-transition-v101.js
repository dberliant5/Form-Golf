// FORM 10.1 — premium analysis transition for the direct report renderer.
// This never calls showResults or the legacy wrapper chain. It finishes by invoking
// FORM_RENDER_DRIVER_REPORT_V100 directly.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_RESULTS_TRANSITION_V101)return true;
  if(typeof window.FORM_RENDER_DRIVER_REPORT_V100!=='function')return false;
  let running=false;
  function style(){
    if(document.getElementById('formTransition101Styles'))return;
    const s=document.createElement('style');s.id='formTransition101Styles';s.textContent=`
    .formTransition101{min-height:72vh;max-width:900px;margin:0 auto;padding:56px 28px;display:flex;flex-direction:column;justify-content:center}.transition101Mark{font-family:Georgia,serif;font-size:30px;letter-spacing:.24em}.transition101Kicker{margin-top:22px;font-size:8px;letter-spacing:.18em;font-weight:900;color:var(--muted)}.formTransition101 h2{max-width:720px;margin:12px 0 9px;font-size:36px;line-height:1.08}.formTransition101>p{max-width:690px;min-height:42px;margin:0;color:var(--muted);font-size:12px;line-height:1.65}.transition101Track{width:100%;height:2px;margin:28px 0 20px;background:var(--line);overflow:hidden}.transition101Fill{height:100%;width:0;background:var(--deep);transition:width .45s ease}.transition101Ledger{display:grid;gap:7px;min-height:72px}.transition101Ledger div{display:flex;gap:9px;align-items:center;color:var(--muted);font-size:10px}.transition101Ledger span{font-weight:900;color:var(--deep)}.transition101Ledger p{margin:0}@media(max-width:700px){.formTransition101{padding:38px 20px}.formTransition101 h2{font-size:30px}}
    `;document.head.appendChild(s);
  }
  style();
  function profileBits(){
    const bits=[];try{
      const m=state?.metrics||{};
      const speed=m.speed?.value;if(speed)bits.push(m.speed.mode==='range'?`${String(speed).replace('-', '–')} mph speed range`:`${speed} mph club speed`);
      if(m.launch?.value)bits.push(`${String(m.launch.value).replace(/_/g,' ')} launch`);
      if(m.spin?.value)bits.push(`${String(m.spin.value).replace(/_/g,' ')} spin`);
      if(state?.strike)bits.push(`${String(state.strike).replace(/_/g,' ')} strike`);
    }catch(e){}return bits;
  }
  function stages(){
    const b=profileBits();return [
      {title:'Reading your delivery profile',detail:b.length?`FORM is reconciling ${b.join(' · ')}.`:'FORM is reconciling your directional, strike and trajectory inputs.',ms:720},
      {title:'Testing the fit requirements that matter most',detail:'Launch, spin, strike protection and directional fit are being weighted against your stated priorities—not against brand prestige or price.',ms:900},
      {title:'Checking proven execution',detail:'Independent accuracy, distance and forgiveness evidence is being applied only where it supports the recommendation.',ms:980},
      {title:'Separating fit from upgrade value',detail:'New-driver FORM Fit Scores are finalized first. Your current driver is benchmarked separately only after the new-driver ranking is complete.',ms:900},
      {title:'Building your FORM report',detail:'Organizing the finalist hierarchy, meaningful score differences, starting configuration and evidence strength.',ms:720}
    ];
  }
  function begin(e){
    const b=e.target?.closest?.('#step9 .readyBox button');if(!b||running)return;
    running=true;e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    const replacement=b.cloneNode(true);replacement.removeAttribute('onclick');replacement.disabled=true;replacement.textContent='Preparing your fit…';b.replaceWith(replacement);
    const main=document.querySelector('#driverExperience .mainPane')||document.getElementById('driverExperience');
    if(!main){running=false;window.FORM_RENDER_DRIVER_REPORT_V100();return;}
    document.querySelectorAll('#driverExperience .step').forEach(x=>x.classList.add('hidden'));const nav=document.getElementById('flowNav');if(nav)nav.style.display='none';
    document.getElementById('formTransition101')?.remove();const el=document.createElement('section');el.id='formTransition101';el.className='formTransition101';el.innerHTML='<div class="transition101Mark">FORM</div><div class="transition101Kicker">PERSONALIZED FIT ANALYSIS</div><h2></h2><p></p><div class="transition101Track"><div class="transition101Fill"></div></div><div class="transition101Ledger"></div>';main.appendChild(el);window.scrollTo({top:0,left:0,behavior:'smooth'});
    const list=stages(),title=el.querySelector('h2'),detail=el.querySelector(':scope > p'),fill=el.querySelector('.transition101Fill'),ledger=el.querySelector('.transition101Ledger');let i=0,finished=false;
    const finish=()=>{if(finished)return;finished=true;el.remove();try{window.FORM_RENDER_DRIVER_REPORT_V100();}catch(err){console.error('FORM 10.1 direct report transition failed',err);document.getElementById('step9')?.classList.remove('hidden');replacement.disabled=false;replacement.textContent='Generate My Fit →';}finally{running=false;}};
    const hard=setTimeout(finish,8000);
    function render(){const s=list[i];if(!s){clearTimeout(hard);finish();return;}title.textContent=s.title;detail.textContent=s.detail;fill.style.width=Math.round((i+1)/list.length*100)+'%';ledger.innerHTML=list.slice(0,i).slice(-3).map(x=>`<div><span>✓</span><p>${x.title}</p></div>`).join('');setTimeout(()=>{i++;render();},s.ms);}
    render();
  }
  document.addEventListener('pointerdown',begin,true);
  document.addEventListener('touchstart',begin,{capture:true,passive:false});
  window.FORM_DRIVER_RESULTS_TRANSITION_V101=true;
  return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>300)clearInterval(t);},50);
})();