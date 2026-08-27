// FORM 9.9.1 — direct results entrypoint, pre-rendered report, contradiction guards.
(function(){
  'use strict';

  function init(){
    if(window.FORM_DRIVER_RESULTS_CONTROLLER_V99) return true;
    if(typeof window.__FORM_BASE_SHOW_RESULTS!=='function') return false;
    if(!window.FORM_DRIVER_RESULTS_V87) return false;

    const baseResults=window.__FORM_BASE_SHOW_RESULTS;
    const buildStages=window.FORM_DRIVER_RESULTS_V87.buildStages;
    const enhance=window.FORM_DRIVER_RESULTS_V87.enhance;
    let sanitizedNotes=[];
    const stateRef=()=>typeof state!=='undefined'?state:null;

    function metricNumber(id){
      const m=stateRef()?.metrics?.[id];
      if(!m||m.mode==='unknown'||m.value==null)return null;
      if(m.mode==='exact')return Number(m.value);
      const maps={
        speed:{under75:72,'75-84':80,'85-89':87,'90-94':92,'95-99':97,'100-104':102,'105-109':107,'110-114':112,'115plus':118},
        ballSpeed:{under120:115,'120-129':125,'130-139':135,'140-149':145,'150-159':155,'160-169':165,'170plus':175},
        carry:{under180:170,'180-199':190,'200-219':210,'220-239':230,'240-259':250,'260-279':270,'280plus':290}
      };
      return maps[id]?.[m.value]||null;
    }

    function sanitizeContradictoryMetrics(){
      sanitizedNotes=[];
      const metrics=stateRef()?.metrics;
      if(!metrics)return;
      const speed=metricNumber('speed'),ball=metricNumber('ballSpeed'),carry=metricNumber('carry');
      if(speed&&ball){
        const smash=ball/speed;
        if(smash<1.12||smash>1.55){
          metrics.ballSpeed={mode:'unknown',value:null};
          sanitizedNotes.push(`Ball speed was excluded because it implied a ${smash.toFixed(2)} smash factor, outside a credible driver range.`);
        }
      }
      if(speed&&carry){
        const yardsPerMph=carry/speed;
        if(yardsPerMph<1.45||yardsPerMph>3.15){
          metrics.carry={mode:'unknown',value:null};
          sanitizedNotes.push('Carry distance was excluded because it conflicted materially with the supplied club speed.');
        }
      }
      window.FORM_DRIVER_SANITIZED_INPUTS=sanitizedNotes.slice();
    }

    function discloseSanitization(){
      if(!sanitizedNotes.length)return;
      const host=document.getElementById('dataStrengthNote')||document.querySelector('#results .dataStrengthNote');
      if(!host||document.getElementById('formInputGuard99'))return;
      const note=document.createElement('div');
      note.id='formInputGuard99';
      note.className='experienceSignal';
      note.innerHTML='<b>Input consistency check</b><span>'+sanitizedNotes.join(' ')+' FORM treated the excluded value as unknown rather than allowing contradictory data to increase recommendation confidence.</span>';
      host.insertAdjacentElement('afterend',note);
    }

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
      window.__form99Building=false;
      try{enhance?.();}catch(e){console.warn('FORM results enhancement skipped',e);}
      discloseSanitization();
      window.scrollTo({top:0,left:0,behavior:'auto'});
    }

    function showPreparationError(err){
      console.error('FORM report preparation failed',err);
      const step9=document.getElementById('step9');
      if(step9)step9.classList.remove('hidden');
      const main=document.querySelector('#driverExperience .mainPane')||document.getElementById('driverExperience');
      if(main){
        let box=document.getElementById('formResultRecovery99');
        if(!box){
          box=document.createElement('section');
          box.id='formResultRecovery99';box.className='resultRecovery';
          box.innerHTML='<div class="eyebrow">Report could not open</div><h2>FORM kept your review screen available.</h2><p class="lead">The fitting data is still here. Try Generate My Fit again; FORM will not leave you on a loading screen when report preparation fails.</p>';
          (step9||main).appendChild(box);
        }
      }
    }

    function prepareReport(){
      sanitizeContradictoryMetrics();
      try{
        document.getElementById('formAnalysis87')?.remove();
        baseResults.call(window);
        const results=document.getElementById('results');
        if(results) results.classList.remove('hidden');
        const ready=!!(results && (results.textContent||'').trim().length);
        if(!ready)showPreparationError(new Error('Results renderer returned an empty report.'));
        return ready;
      }catch(err){
        showPreparationError(err);
        return false;
      }
    }

    function runOverlay(){
      const main=document.querySelector('#driverExperience .mainPane')||document.getElementById('driverExperience');
      if(!main){revealPreparedReport();return;}
      document.getElementById('formAnalysis87')?.remove();
      const stages=(typeof buildStages==='function'&&buildStages())||[{title:'Building your FORM report',detail:'Organizing your recommendations and tradeoffs.',ms:800}];
      const el=document.createElement('section');
      el.id='formAnalysis87';el.className='formAnalysis87';el.dataset.controller='9.9.1';
      el.innerHTML='<div class="analysisMark87">FORM</div><div class="analysisKicker87">PERSONALIZED FIT ANALYSIS</div><h2 id="analysisTitle87"></h2><p id="analysisDetail87"></p><div class="analysisTrack87"><div id="analysisFill87"></div></div><div class="analysisLedger87"></div><button type="button" id="analysisReveal99" class="formPrimaryBtn" style="display:none;margin-top:24px">View my FORM report →</button>';
      main.appendChild(el);
      document.querySelectorAll('#driverExperience .step').forEach(x=>x.classList.add('hidden'));
      const nav=document.getElementById('flowNav');if(nav)nav.style.display='none';
      window.scrollTo({top:0,left:0,behavior:'smooth'});

      const title=el.querySelector('#analysisTitle87'),detail=el.querySelector('#analysisDetail87'),fill=el.querySelector('#analysisFill87'),ledger=el.querySelector('.analysisLedger87'),reveal=el.querySelector('#analysisReveal99');
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
          requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(()=>{clearTimeout(hardStop);complete();},650)));
        },Number(s.ms)||800);
      }
      render();
    }

    function startResults(){
      if(window.__form99Building)return;
      window.__form99Building=true;
      const cta=document.querySelector('#step9 .readyBox button');
      const oldText=cta?.textContent;
      if(cta){cta.disabled=true;cta.textContent='Preparing your fit…';}
      const prepared=prepareReport();
      if(!prepared){
        window.__form99Building=false;
        if(cta){cta.disabled=false;cta.textContent=oldText||'Generate My Fit →';}
        return;
      }
      document.getElementById('results')?.classList.add('hidden');
      runOverlay();
    }

    window.FORM_START_DRIVER_RESULTS=startResults;
    window.showResults=startResults;
    document.addEventListener('click',function(e){
      const button=e.target?.closest?.('#step9 .readyBox button');
      if(!button)return;
      e.preventDefault();
      e.stopPropagation();
      if(typeof e.stopImmediatePropagation==='function')e.stopImmediatePropagation();
      startResults();
    },true);

    window.FORM_DRIVER_RESULTS_CONTROLLER_V96=true;
    window.FORM_DRIVER_RESULTS_CONTROLLER_V97=true;
    window.FORM_DRIVER_RESULTS_CONTROLLER_V98=true;
    window.FORM_DRIVER_RESULTS_CONTROLLER_V99=true;
    return true;
  }

  let tries=0;
  const timer=setInterval(()=>{tries++;if(init()||tries>240)clearInterval(timer);},50);
})();