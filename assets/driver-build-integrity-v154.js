// FORM 10.54 — canonical live-build integrity guard.
// Prevents silent fallback to stale interview/results layers.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_BUILD_INTEGRITY_V154)return true;
  const driver=document.getElementById('driverExperience');
  if(!driver||typeof state==='undefined')return false;

  const expected={
    rangeFirst:true,
    styleQuestion:false,
    transitionQuestion:true,
    performancePriorities:['accuracy','distance','flight'],
    sharedSetup:true,
    golferFacingLabels:['Distance','Dispersion','Forgiveness','Spin Control','Launch','Ball Speed Retention'],
    narrativeProsCons:true
  };

  function enforceInterview(){
    // Exact launch-monitor mode is intentionally not a user-facing option. Driver numbers vary swing to swing.
    driver.querySelectorAll('[data-group="lm"] .opt[data-v="exact"]').forEach(function(el){
      el.style.setProperty('display','none','important');el.setAttribute('aria-hidden','true');
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

    // Step 7 must be transition/tempo, never the retired Classic/Engineered/Modern/Edgy style question.
    const step7=document.getElementById('step7');
    if(step7&&!step7.querySelector('[data-transition-v150]')&&window.FORM_DRIVER_INTERVIEW_QUALITY_V153){
      console.error('FORM integrity: transition question missing after interview-quality layer initialized.');
    }
    if(step7&&/Classic|Engineered|Modern|Edgy/i.test(step7.textContent||'')){
      console.error('FORM integrity: retired style question is visible.');
    }

    // Only the three performance outcomes may occupy priority slots.
    const priority=document.getElementById('priorityRank');
    if(priority){
      [...priority.querySelectorAll('[data-perf-rank]')].forEach(function(sel){
        if(!expected.performancePriorities.includes(sel.dataset.perfRank))console.error('FORM integrity: non-performance priority in scoring rank.',sel.dataset.perfRank);
      });
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
    if(!results.querySelector('.report121Setup'))console.error('FORM integrity: shared Test setup block missing.');
  }

  function verifyLayers(){
    const missing=[];
    if(!window.FORM_DRIVER_RESULTS_CONTROLLER_V100)missing.push('results controller');
    if(!window.FORM_DRIVER_RESULTS_LAYOUT_V128)missing.push('results layout');
    if(!window.FORM_DRIVER_INTERVIEW_UX_V120)missing.push('range-first interview UX');
    if(!window.FORM_DRIVER_INTERVIEW_QUALITY_V153)missing.push('interview quality');
    if(missing.length)console.error('FORM integrity: required canonical layers missing: '+missing.join(', '));
  }

  enforceInterview();
  let queued=false;
  new MutationObserver(function(){
    if(queued)return;queued=true;
    requestAnimationFrame(function(){queued=false;enforceInterview();verifyResults();});
  }).observe(driver,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  setTimeout(function(){verifyLayers();enforceInterview();verifyResults();},1200);
  setTimeout(function(){verifyLayers();enforceInterview();verifyResults();},3500);
  window.FORM_DRIVER_BUILD_INTEGRITY_V154={version:'10.54',expected:expected,verifyLayers:verifyLayers,verifyResults:verifyResults};
  return true;
}
let n=0,t=setInterval(function(){n++;if(init()||n>240)clearInterval(t);},50);
})();