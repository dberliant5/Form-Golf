// FORM 9.7 — authoritative driver analysis -> results controller
(function(){
  'use strict';

  function init(){
    if(window.FORM_DRIVER_RESULTS_CONTROLLER_V97) return true;
    if(typeof window.__FORM_BASE_SHOW_RESULTS!=='function') return false;
    if(!window.FORM_DRIVER_RESULTS_V87) return false;

    const baseResults=window.__FORM_BASE_SHOW_RESULTS;
    const buildStages=window.FORM_DRIVER_RESULTS_V87.buildStages;
    const enhance=window.FORM_DRIVER_RESULTS_V87.enhance;

    function revealResults(){
      const results=document.getElementById('results');
      if(results) results.classList.remove('hidden');
      const nav=document.getElementById('flowNav');
      if(nav) nav.style.display='none';
      const bar=document.getElementById('progressBar');
      if(bar) bar.style.width='100%';
    }

    function finish(){
      const overlay=document.getElementById('formAnalysis87');
      if(overlay) overlay.remove();
      window.__form87Building=false;
      window.__form96Building=false;
      try{
        baseResults.call(window);
        revealResults();
        setTimeout(()=>{try{enhance?.();}catch(e){console.warn('FORM results enhancement skipped',e);}},80);
        window.scrollTo({top:0,left:0,behavior:'auto'});
      }catch(err){
        console.error('FORM base results render failed',err);
        revealResults();
        const main=document.querySelector('#driverExperience .mainPane')||document.getElementById('driverExperience');
        if(main){
          document.getElementById('formAnalysis87')?.remove();
          let box=document.getElementById('formResultRecovery97');
          if(!box){
            box=document.createElement('section');
            box.id='formResultRecovery97';
            box.className='resultRecovery';
            box.innerHTML='<div class="eyebrow">Fit complete</div><h2>Your fit finished, but the report view hit an error.</h2><p class="lead">FORM stopped the loading screen instead of leaving you stuck. Refresh once to reopen the finished report.</p>';
            main.appendChild(box);
          }
        }
      }
    }

    function runOverlay(){
      const main=document.querySelector('#driverExperience .mainPane')||document.getElementById('driverExperience');
      if(!main){finish();return;}
      document.getElementById('formAnalysis87')?.remove();
      const stages=(typeof buildStages==='function'&&buildStages())||[{title:'Building your FORM report',detail:'Organizing your recommendations and tradeoffs.',ms:800}];
      const el=document.createElement('section');
      el.id='formAnalysis87';el.className='formAnalysis87';el.dataset.controller='9.7';
      el.innerHTML='<div class="analysisMark87">FORM</div><div class="analysisKicker87">PERSONALIZED FIT ANALYSIS</div><h2 id="analysisTitle87"></h2><p id="analysisDetail87"></p><div class="analysisTrack87"><div id="analysisFill87"></div></div><div class="analysisLedger87"></div>';
      main.appendChild(el);
      document.querySelectorAll('#driverExperience .step').forEach(x=>x.classList.add('hidden'));
      const nav=document.getElementById('flowNav');if(nav)nav.style.display='none';
      window.scrollTo({top:0,left:0,behavior:'smooth'});

      const title=el.querySelector('#analysisTitle87'),detail=el.querySelector('#analysisDetail87'),fill=el.querySelector('#analysisFill87'),ledger=el.querySelector('.analysisLedger87');
      let i=0,done=false;
      const complete=()=>{if(done)return;done=true;finish();};
      // Independent fail-open timer: even if a stage callback misbehaves, the golfer leaves analysis.
      const hardStop=setTimeout(complete,15000);

      function render(){
        if(done)return;
        const s=stages[i];
        if(!s){clearTimeout(hardStop);complete();return;}
        title.textContent=s.title;
        detail.textContent=s.detail;
        fill.style.width=Math.round((i+1)/stages.length*100)+'%';
        ledger.innerHTML=stages.slice(0,i).slice(-3).map(x=>'<div><span>✓</span><p>'+x.title+'</p></div>').join('');
        setTimeout(()=>{
          if(done)return;
          i++;
          if(i<stages.length){render();return;}
          title.textContent='Opening your FORM report';
          detail.textContent='Your fitting analysis is complete.';
          fill.style.width='100%';
          setTimeout(()=>{clearTimeout(hardStop);complete();},450);
        },Number(s.ms)||800);
      }
      render();
    }

    window.showResults=function(){
      if(window.__form97Building)return;
      window.__form97Building=true;
      try{runOverlay();}finally{setTimeout(()=>{window.__form97Building=false;},16000);}
    };

    window.FORM_DRIVER_RESULTS_CONTROLLER_V96=true;
    window.FORM_DRIVER_RESULTS_CONTROLLER_V97=true;
    return true;
  }

  let tries=0;
  const timer=setInterval(()=>{tries++;if(init()||tries>240)clearInterval(timer);},50);
})();