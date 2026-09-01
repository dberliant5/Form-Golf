// FORM 10.74 — reliable mobile handoff from review to results.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_RESULTS_TRANSITION_V128)return true;
  if(typeof window.FORM_RENDER_DRIVER_REPORT_V100!=='function')return false;
  let running=false;
  document.getElementById('formTransition101Styles')?.remove();
  const s=document.createElement('style');s.id='formTransition101Styles';s.textContent=`.formTransition101{min-height:60vh;max-width:900px;margin:0 auto;padding:48px 28px;display:flex;flex-direction:column;justify-content:center}.transition101Mark{font-family:Georgia,serif;font-size:30px;letter-spacing:.24em}.transition101Kicker{margin-top:22px;font-size:8px;letter-spacing:.18em;font-weight:900;color:var(--muted)}.formTransition101 h2{max-width:720px;margin:12px 0 9px;font-size:36px;line-height:1.08}.formTransition101>p{max-width:690px;margin:0;color:var(--muted);font-size:12px;line-height:1.65}.transition101Track{width:100%;height:2px;margin:28px 0 0;background:var(--line);overflow:hidden}.transition101Fill{height:100%;width:100%;background:var(--deep)}@media(max-width:700px){.formTransition101{min-height:calc(100svh - 165px);padding:24px 20px 36px}.formTransition101 h2{font-size:30px}.transition101Mark{font-size:27px}}`;document.head.appendChild(s);

  function showResults(replacement,el){
    try{
      window.FORM_RENDER_DRIVER_REPORT_V100();
      const results=document.getElementById('results');
      if(!results)throw new Error('Results container was not created');
      results.classList.remove('hidden');
      el?.remove();
      requestAnimationFrame(()=>{try{results.scrollIntoView({behavior:'smooth',block:'start'});}catch(e){}});
    }catch(err){
      console.error('FORM results handoff failed',err);
      el?.remove();
      document.getElementById('step9')?.classList.remove('hidden');
      const nav=document.getElementById('flowNav');if(nav)nav.style.display='';
      if(replacement){replacement.disabled=false;replacement.textContent='Generate My Fit →';}
      let box=document.getElementById('formResultsError174');
      if(!box){box=document.createElement('div');box.id='formResultsError174';box.className='formInputWarning';box.innerHTML='<b>Results could not load</b><span>Your fitting answers are still here. Tap Generate My Fit again.</span>';document.getElementById('step9')?.appendChild(box);}
    }finally{running=false;}
  }

  function begin(e){
    const b=e.target?.closest?.('#step9 .readyBox button');if(!b||running)return;
    running=true;e.preventDefault();e.stopPropagation();
    const replacement=b.cloneNode(true);replacement.removeAttribute('onclick');replacement.disabled=true;replacement.textContent='Preparing your fit…';b.replaceWith(replacement);
    document.querySelectorAll('#driverExperience .step').forEach(x=>x.classList.add('hidden'));
    const nav=document.getElementById('flowNav');if(nav)nav.style.display='none';
    const main=document.querySelector('#driverExperience .mainPane')||document.getElementById('driverExperience');
    if(!main){showResults(replacement,null);return;}
    document.getElementById('formTransition101')?.remove();
    const el=document.createElement('section');el.id='formTransition101';el.className='formTransition101';el.innerHTML='<div class="transition101Mark">FORM</div><div class="transition101Kicker">PERSONALIZED FIT ANALYSIS</div><h2>Building your FORM report</h2><p>Finalizing your fit hierarchy, current-driver comparison and fitting starting points.</p><div class="transition101Track"><div class="transition101Fill"></div></div>';main.appendChild(el);
    requestAnimationFrame(()=>{try{el.scrollIntoView({behavior:'smooth',block:'center'});}catch(e){}});
    // Keep this screen brief. The report render is the product; the transition is not.
    setTimeout(()=>showResults(replacement,el),650);
  }

  document.addEventListener('click',begin,true);
  window.FORM_DRIVER_RESULTS_TRANSITION_V101=true;window.FORM_DRIVER_RESULTS_TRANSITION_V128=true;return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>300)clearInterval(t)},50);
})();