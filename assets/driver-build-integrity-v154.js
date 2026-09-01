// FORM 10.66 — canonical live-build integrity guard.
// Prevents silent fallback to stale interview/results/configuration/confidence layers.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_BUILD_INTEGRITY_V166)return true;
  const driver=document.getElementById('driverExperience');
  if(!driver||typeof state==='undefined')return false;

  const expected={
    rangeFirst:true,
    perMetricExact:false,
    aoaRangeConfiguration:true,
    technicalPrompt:'What driver numbers do you know?',
    styleQuestion:false,
    transitionQuestion:true,
    strikeSourceQuality:true,
    performancePriorities:['accuracy','distance','flight'],
    sharedSetup:true,
    golferFacingLabels:['Distance','Dispersion','Forgiveness','Spin Control','Launch','Ball Speed Retention'],
    narrativeProsCons:true,
    calibratedConfiguration:true,
    leadingFitConfidence:true,
    strikeAwareConfidence:true,
    mobileHorizontalOverflow:false
  };

  function enforceInterview(){
    driver.querySelectorAll('[data-group="lm"] .opt[data-v="exact"]').forEach(function(el){
      el.style.setProperty('display','none','important');el.setAttribute('aria-hidden','true');
    });
    driver.querySelectorAll('select[data-metric-mode]').forEach(function(sel){
      const exact=sel.querySelector('option[value="exact"]');if(exact)exact.remove();
      if(sel.value==='exact')sel.value='range';
    });
    driver.querySelectorAll('.metricBox button').forEach(function(btn){
      const t=(btn.textContent||'').trim().toLowerCase();
      if(t==='exact'||t==='approx. range'||t==='approx range'||t==='general'){
        btn.style.setProperty('display','none','important');btn.setAttribute('aria-hidden','true');
      }
    });
    if(state.lm==='exact')state.lm='range';
    Object.keys(state.metrics||{}).forEach(function(id){
      if(state.metrics[id]?.mode==='exact'){state.metrics[id].mode='range';state.metrics[id].value=null;}
    });

    const step5=document.getElementById('step5');
    if(step5&&window.FORM_DRIVER_INTERVIEW_COPY_V156&&step5.querySelector('h1')?.textContent!==expected.technicalPrompt){
      console.error('FORM integrity: technical-profile wording regressed.');
    }
    if(step5&&step5.querySelector('select[data-metric-mode] option[value="exact"]')){
      console.error('FORM integrity: retired per-metric Exact option is still available.');
    }

    const step4=document.getElementById('step4');
    if(step4&&window.FORM_DRIVER_INTERVIEW_QUALITY_V153&&!document.getElementById('strikeSourceV150')){
      console.error('FORM integrity: strike-source quality question missing.');
    }

    const step7=document.getElementById('step7');
    if(step7&&!step7.querySelector('[data-transition-v150]')&&window.FORM_DRIVER_INTERVIEW_QUALITY_V153){
      console.error('FORM integrity: transition question missing after interview-quality layer initialized.');
    }
    if(step7&&/Classic|Engineered|Modern|Edgy/i.test(step7.textContent||'')){
      console.error('FORM integrity: retired style question is visible.');
    }

    const priority=document.getElementById('priorityRank');
    if(priority){
      const sels=[...priority.querySelectorAll('[data-perf-rank]')];
      if(sels.length&&sels.length!==3)console.error('FORM integrity: performance priority count is not three.');
      sels.forEach(function(sel){
        if(!expected.performancePriorities.includes(sel.dataset.perfRank))console.error('FORM integrity: non-performance priority in scoring rank.',sel.dataset.perfRank);
      });
    }

    const review=document.getElementById('reviewPrefs');
    if(review&&review.querySelector('.reviewRow')){
      const text=review.textContent||'';
      if(/Classic|Engineered|Modern|Edgy/i.test(text))console.error('FORM integrity: retired style preference leaked into review screen.');
      if(!/Shaft transition/i.test(text))console.error('FORM integrity: shaft transition missing from review screen.');
      if(!/Accuracy \/ forgiveness/i.test(text)||!/Distance/i.test(text)||!/Ball flight/i.test(text))console.error('FORM integrity: three performance priorities missing from review screen.');
    }
  }

  function verifyResults(){
    const results=document.getElementById('results');
    if(!results?.classList.contains('formReport100'))return;
    if(!window.FORM_DRIVER_RESULTS_CONTROLLER_V100)console.error('FORM integrity: canonical results controller missing.');
    const cards=[...results.querySelectorAll('.report100Card')];
    if(!cards.length)return;
    cards.forEach(function(card){
      if(card.querySelector('.report100Config')&&getComputedStyle(card.querySelector('.report100Config')).display!=='none')console.error('FORM integrity: per-card loft/shaft/evidence block is visible.');
      const read=card.querySelector('.report128ClubRead');
      if(!read||!/Pros/i.test(read.textContent||'')||!/Cons/i.test(read.textContent||''))console.error('FORM integrity: Pros/Cons narrative missing.');
      const labels=[...card.querySelectorAll('.report128MetricLabel')].map(function(x){return (x.textContent||'').replace(/\bi\b$/,'').trim();});
      if(labels.length&&expected.golferFacingLabels.some(function(x){return !labels.includes(x);})){console.error('FORM integrity: golfer-facing result labels incomplete.',labels);}
    });
    const setup=results.querySelector('.report121Setup');
    if(!setup)console.error('FORM integrity: shared Test setup block missing.');
    if(setup&&window.FORM_DRIVER_RESULTS_CONFIDENCE_V158&&!setup.querySelector('.report121SetupGrid')?.dataset.formConfidence158){
      console.error('FORM integrity: leading-fit confidence calibration missing.');
    }
    if(!window.FORM_DRIVER_CONFIDENCE_INPUT_QUALITY_V165){
      console.error('FORM integrity: strike-source quality is not connected to recommendation confidence.');
    }
    if(window.innerWidth<=820&&results.scrollWidth>results.clientWidth+2){
      console.error('FORM integrity: driver results have horizontal overflow at mobile width.',{scrollWidth:results.scrollWidth,clientWidth:results.clientWidth});
    }
  }

  function verifyLayers(){
    const missing=[];
    if(!window.FORM_DRIVER_RESULTS_CONTROLLER_V100)missing.push('results controller');
    if(!window.FORM_DRIVER_RESULTS_LAYOUT_V128)missing.push('results layout');
    if(!window.FORM_DRIVER_INTERVIEW_UX_V120)missing.push('range-first interview UX');
    if(!window.FORM_DRIVER_INTERVIEW_QUALITY_V153)missing.push('interview quality');
    if(!window.FORM_DRIVER_INTERVIEW_COPY_V156)missing.push('technical-profile copy');
    if(!window.FORM_DRIVER_CONFIG_BRIDGE_V157)missing.push('calibrated configuration bridge');
    if(!window.FORM_DRIVER_RANGE_FIRST_V160)missing.push('per-metric range-first/AoA bridge');
    if(!window.FORM_DRIVER_CONFIDENCE_INPUT_QUALITY_V165)missing.push('strike-aware confidence');
    if(!window.FORM_DRIVER_RESULTS_CONFIDENCE_V158)missing.push('leading-fit confidence');
    if(missing.length)console.error('FORM integrity: required canonical layers missing: '+missing.join(', '));
  }

  enforceInterview();
  let queued=false;
  new MutationObserver(function(){
    if(queued)return;queued=true;
    requestAnimationFrame(function(){queued=false;enforceInterview();verifyResults();});
  }).observe(driver,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  window.addEventListener('resize',verifyResults);
  setTimeout(function(){verifyLayers();enforceInterview();verifyResults();},1200);
  setTimeout(function(){verifyLayers();enforceInterview();verifyResults();},3500);
  window.FORM_DRIVER_BUILD_INTEGRITY_V154={version:'10.66',expected:expected,verifyLayers:verifyLayers,verifyResults:verifyResults};
  window.FORM_DRIVER_BUILD_INTEGRITY_V159=window.FORM_DRIVER_BUILD_INTEGRITY_V154;
  window.FORM_DRIVER_BUILD_INTEGRITY_V160=window.FORM_DRIVER_BUILD_INTEGRITY_V154;
  window.FORM_DRIVER_BUILD_INTEGRITY_V161=window.FORM_DRIVER_BUILD_INTEGRITY_V154;
  window.FORM_DRIVER_BUILD_INTEGRITY_V166=window.FORM_DRIVER_BUILD_INTEGRITY_V154;
  return true;
}
let n=0,t=setInterval(function(){n++;if(init()||n>240)clearInterval(t);},50);
})();
