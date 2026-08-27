// FORM 9.6 — authoritative driver analysis -> results controller
(function(){
  'use strict';

  function init(){
    if(window.FORM_DRIVER_RESULTS_CONTROLLER_V96) return true;
    if(typeof window.__FORM_BASE_SHOW_RESULTS!=='function') return false;
    if(!window.FORM_DRIVER_RESULTS_V87 || !window.FORM_DRIVER_RESULTS_WATCHDOG_V95) return false;

    const baseResults=window.__FORM_BASE_SHOW_RESULTS;
    const buildStages=window.FORM_DRIVER_RESULTS_V87.buildStages;
    const enhance=window.FORM_DRIVER_RESULTS_V87.enhance;

    function finish(ctx,args){
      document.getElementById('formAnalysis87')?.remove();
      window.__form87Building=false;
      try{
        baseResults.apply(ctx,args);
        setTimeout(()=>{try{enhance?.();}catch(e){console.warn('FORM results enhancement skipped',e);}},80);
        window.scrollTo({top:0,left:0,behavior:'auto'});
      }catch(err){
        console.error('FORM base results render failed',err);
        const main=document.querySelector('#driverExperience .mainPane')||document.getElementById('driverExperience');
        if(main){
          const box=document.createElement('section');
          box.className='resultRecovery';
          box.innerHTML='<div class="eyebrow">Fit complete</div><h2>Your results are ready, but the report view hit an error.</h2><p class="lead">Refresh this page to reopen the report. Your fitting answers remain in this session.</p>';
          main.appendChild(box);
        }
      }
    }

    function runOverlay(ctx,args){
      const main=document.querySelector('#driverExperience .mainPane')||document.getElementById('driverExperience');
      if(!main){finish(ctx,args);return;}
      document.getElementById('formAnalysis87')?.remove();
      const stages=(typeof buildStages==='function'&&buildStages())||[{title:'Building your FORM report',detail:'Organizing your recommendations and tradeoffs.',ms:900}];
      const el=document.createElement('section');
      el.id='formAnalysis87';el.className='formAnalysis87';
      el.innerHTML=`<div class="analysisMark87">FORM</div><div class="analysisKicker87">PERSONALIZED FIT ANALYSIS</div><h2 id="analysisTitle87"></h2><p id="analysisDetail87"></p><div class="analysisTrack87"><div id="analysisFill87"></div></div><div class="analysisLedger87"></div>`;
      main.appendChild(el);
      document.querySelectorAll('#driverExperience .step').forEach(x=>x.classList.add('hidden'));
      const nav=document.getElementById('flowNav');if(nav)nav.style.display='none';
      window.scrollTo({top:0,left:0,behavior:'smooth'});
      const title=el.querySelector('#analysisTitle87'),detail=el.querySelector('#analysisDetail87'),fill=el.querySelector('#analysisFill87'),ledger=el.querySelector('.analysisLedger87');
      let i=0,done=false;
      const complete=()=>{if(done)return;done=true;finish(ctx,args);};
      const total=stages.reduce((n,s)=>n+(Number(s.ms)||800),0)+1800;
      const absolute=setTimeout(complete,Math.min(Math.max(total,4500),14000));
      function render(){
        if(done)return;
        const s=stages[i];
        title.textContent=s.title;detail.textContent=s.detail;
        fill.style.width=`${Math.round((i+1)/stages.length*100)}%`;
        ledger.innerHTML=stages.slice(0,i).slice(-3).map(x=>`<div><span>✓</span><p>${x.title}</p></div>`).join('');
        setTimeout(()=>{
          if(done)return;
          i++;
          if(i<stages.length) render();
          else setTimeout(()=>{clearTimeout(absolute);complete();},320);
        },Number(s.ms)||800);
      }
      render();
    }

    window.showResults=function(){
      if(window.__form96Building)return;
      window.__form96Building=true;
      const ctx=this,args=Array.from(arguments);
      runOverlay(ctx,args);
      const release=setInterval(()=>{
        if(!document.getElementById('formAnalysis87')){window.__form96Building=false;clearInterval(release);}
      },200);
      setTimeout(()=>{window.__form96Building=false;clearInterval(release);},16000);
    };

    window.FORM_DRIVER_RESULTS_CONTROLLER_V96=true;
    return true;
  }

  let tries=0;
  const timer=setInterval(()=>{tries++;if(init()||tries>200)clearInterval(timer);},50);
})();