// FORM 9.8 — pre-render the report, then use analysis as presentation only.
(function(){
  'use strict';

  function init(){
    if(window.FORM_DRIVER_RESULTS_CONTROLLER_V98) return true;
    if(typeof window.__FORM_BASE_SHOW_RESULTS!=='function') return false;
    if(!window.FORM_DRIVER_RESULTS_V87) return false;

    const baseResults=window.__FORM_BASE_SHOW_RESULTS;
    const buildStages=window.FORM_DRIVER_RESULTS_V87.buildStages;
    const enhance=window.FORM_DRIVER_RESULTS_V87.enhance;

    function revealPreparedReport(){
      document.getElementById('formAnalysis87')?.remove();
      const results=document.getElementById('results');
      if(results) results.classList.remove('hidden');
      const nav=document.getElementById('flowNav');
      if(nav) nav.style.display='none';
      const bar=document.getElementById('progressBar');
      if(bar) bar.style.width='100%';
      const count=document.getElementById('stepCount');
      if(count) count.textContent='FIT COMPLETE';
      window.__form87Building=false;
      window.__form96Building=false;
      window.__form97Building=false;
      window.__form98Building=false;
      try{enhance?.();}catch(e){console.warn('FORM results enhancement skipped',e);}
      window.scrollTo({top:0,left:0,behavior:'auto'});
    }

    function prepareReport(){
      // Build the actual report first. The analysis screen is never responsible for computation/rendering.
      try{
        document.getElementById('formAnalysis87')?.remove();
        baseResults.call(window);
        const results=document.getElementById('results');
        if(results) results.classList.remove('hidden');
        return !!(results && (results.textContent||'').trim().length);
      }catch(err){
        console.error('FORM report preparation failed',err);
        const main=document.querySelector('#driverExperience .mainPane')||document.getElementById('driverExperience');
        if(main){
          let box=document.getElementById('formResultRecovery98');
          if(!box){
            box=document.createElement('section');
            box.id='formResultRecovery98';box.className='resultRecovery';
            box.innerHTML='<div class="eyebrow">Fit complete</div><h2>Your fit finished, but the report view hit an error.</h2><p class="lead">FORM stopped before the loading experience so you are not trapped. Refresh once to retry the report view.</p>';
            main.appendChild(box);
          }
        }
        return false;
      }
    }

    function runOverlay(){
      const main=document.querySelector('#driverExperience .mainPane')||document.getElementById('driverExperience');
      if(!main){revealPreparedReport();return;}
      document.getElementById('formAnalysis87')?.remove();
      const stages=(typeof buildStages==='function'&&buildStages())||[{title:'Building your FORM report',detail:'Organizing your recommendations and tradeoffs.',ms:800}];
      const el=document.createElement('section');
      el.id='formAnalysis87';el.className='formAnalysis87';el.dataset.controller='9.8';
      el.innerHTML='<div class="analysisMark87">FORM</div><div class="analysisKicker87">PERSONALIZED FIT ANALYSIS</div><h2 id="analysisTitle87"></h2><p id="analysisDetail87"></p><div class="analysisTrack87"><div id="analysisFill87"></div></div><div class="analysisLedger87"></div><button type="button" id="analysisReveal98" class="formPrimaryBtn" style="display:none;margin-top:24px">View my FORM report →</button>';
      main.appendChild(el);
      document.querySelectorAll('#driverExperience .step').forEach(x=>x.classList.add('hidden'));
      const nav=document.getElementById('flowNav');if(nav)nav.style.display='none';
      window.scrollTo({top:0,left:0,behavior:'smooth'});

      const title=el.querySelector('#analysisTitle87'),detail=el.querySelector('#analysisDetail87'),fill=el.querySelector('#analysisFill87'),ledger=el.querySelector('.analysisLedger87'),reveal=el.querySelector('#analysisReveal98');
      reveal.onclick=revealPreparedReport;
      let i=0,done=false;
      const complete=()=>{if(done)return;done=true;revealPreparedReport();};
      const hardStop=setTimeout(complete,16000);

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
          reveal.style.display='inline-flex';
          // Automatic path plus explicit user-controlled escape hatch.
          requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(()=>{clearTimeout(hardStop);complete();},650)));
        },Number(s.ms)||800);
      }
      render();
    }

    window.showResults=function(){
      if(window.__form98Building)return;
      window.__form98Building=true;
      const prepared=prepareReport();
      if(!prepared){window.__form98Building=false;return;}
      // Hide the already-built report only while the analysis presentation is visible.
      document.getElementById('results')?.classList.add('hidden');
      runOverlay();
    };

    window.FORM_DRIVER_RESULTS_CONTROLLER_V96=true;
    window.FORM_DRIVER_RESULTS_CONTROLLER_V97=true;
    window.FORM_DRIVER_RESULTS_CONTROLLER_V98=true;
    return true;
  }

  let tries=0;
  const timer=setInterval(()=>{tries++;if(init()||tries>240)clearInterval(timer);},50);
})();