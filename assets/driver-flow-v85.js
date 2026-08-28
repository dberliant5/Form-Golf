// FORM 10.2 — fresh brand choice, mobile question composition + guarded handoff recovery
(function(){'use strict';
function init(){
  if(typeof state==='undefined'||typeof renderBrandScope!=='function'||typeof renderStep!=='function')return false;
  const handed=document.getElementById('handedQuestion'),brand=document.getElementById('brandQuestion'),hs=document.getElementById('handedSummary'),bs=document.getElementById('brandOpeningSummary'),flowNav=document.getElementById('flowNav');
  if(!handed||!brand)return false;
  let brandChoiceMade=false;

  function hideGlobalNav(){if(flowNav)flowNav.style.display='none';}
  function showGlobalNav(){if(flowNav)flowNav.style.display='flex';}
  function hideOpening(){handed.classList.add('hidden');brand.classList.add('hidden');hs?.classList.add('hidden');bs?.classList.add('hidden');}
  function brandNeedsAnswer(){const wrap=document.getElementById('brandPickerWrap')||brand;wrap?.classList.add('needsAnswer');setTimeout(()=>wrap?.classList.remove('needsAnswer'),900);}
  function neutralizeBrandChoice(){
    if(brandChoiceMade)return;
    document.querySelectorAll('#brandQuestion [data-brand-mode]').forEach(x=>x.classList.remove('active','on'));
    const confirm=document.querySelector('#brandQuestion .brandScopeConfirm');if(confirm)confirm.disabled=true;
  }

  function visibleInterviewStep(){
    return [...document.querySelectorAll('#driverExperience .step')].find(x=>!x.classList.contains('hidden')&&x.id!=='results')||null;
  }
  function mobileQuestionBounds(stepEl){
    if(!stepEl)return null;
    const heading=stepEl.querySelector('h1,h2,.questionTitle,.qTitle');
    const interactive=[...stepEl.querySelectorAll('.opt:not(.hidden),.metricBox:not(.hidden),.rankRow:not(.hidden),button:not([disabled]):not(.hidden),select:not(.hidden),input:not(.hidden)')]
      .filter(x=>x.offsetParent!==null&&!x.closest('#flowNav'));
    if(!heading&&!interactive.length)return stepEl.getBoundingClientRect();
    const nodes=[heading,...interactive].filter(Boolean);
    const rects=nodes.map(x=>x.getBoundingClientRect()).filter(r=>r.width>0&&r.height>0);
    if(!rects.length)return stepEl.getBoundingClientRect();
    return {top:Math.min(...rects.map(r=>r.top)),bottom:Math.max(...rects.map(r=>r.bottom)),height:Math.max(...rects.map(r=>r.bottom))-Math.min(...rects.map(r=>r.top))};
  }
  function centerCurrentQuestion(behavior='smooth'){
    if(!window.matchMedia('(max-width: 760px)').matches)return;
    const active=visibleInterviewStep();if(!active)return;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      const r=mobileQuestionBounds(active),vh=window.innerHeight||document.documentElement.clientHeight;
      if(!r||!vh)return;
      const usable=Math.max(320,vh-30);
      let target;
      if(r.height<=usable){
        target=window.scrollY+r.top-Math.max(14,(vh-r.height)/2);
      }else{
        target=window.scrollY+r.top-72;
      }
      window.scrollTo({top:Math.max(0,target),left:0,behavior});
    }));
  }
  window.FORM_CENTER_DRIVER_QUESTION=centerCurrentQuestion;

  function showHand(){step=1;handed.classList.remove('hidden');brand.classList.add('hidden');hs?.classList.add('hidden');bs?.classList.add('hidden');hideGlobalNav();const sc=document.getElementById('stepCount');if(sc)sc.textContent='01 / 09';setTimeout(()=>centerCurrentQuestion('auto'),20);}
  function showBrand(){
    step=1;handed.classList.add('hidden');brand.classList.remove('hidden');hs?.classList.add('hidden');bs?.classList.add('hidden');
    renderBrandScope();neutralizeBrandChoice();hideGlobalNav();
    requestAnimationFrame(()=>window.matchMedia('(max-width: 760px)').matches?centerCurrentQuestion('smooth'):brand.scrollIntoView({behavior:'smooth',block:'start'}));
  }
  function enterInterview(){
    hideOpening();
    if(typeof goTo==='function')goTo(2);else{step=2;renderStep();}
    showGlobalNav();
    requestAnimationFrame(()=>{
      const step2=document.getElementById('step2');
      if(step2?.classList.contains('hidden')){step=2;document.querySelectorAll('#driverExperience .step').forEach(x=>x.classList.add('hidden'));step2.classList.remove('hidden');const bar=document.getElementById('progressBar'),count=document.getElementById('stepCount');if(bar)bar.style.width=(2/9*100)+'%';if(count)count.textContent='02 / 09';showGlobalNav();}
      if(window.matchMedia('(max-width: 760px)').matches)centerCurrentQuestion('smooth');else window.scrollTo({top:0,left:0,behavior:'smooth'});
    });
  }

  const priorSetBrandMode=window.setBrandMode;
  if(typeof priorSetBrandMode==='function')window.setBrandMode=function(){brandChoiceMade=true;return priorSetBrandMode.apply(this,arguments);};
  const priorToggleFitBrand=window.toggleFitBrand;
  if(typeof priorToggleFitBrand==='function')window.toggleFitBrand=function(){brandChoiceMade=true;return priorToggleFitBrand.apply(this,arguments);};

  window.confirmBrandScope=function(){
    if(!brandChoiceMade){brandNeedsAnswer();return;}
    if(typeof brandScopeIsValid==='function'&&!brandScopeIsValid()){brandNeedsAnswer();return;}
    formBrandScopeConfirmed=true;
    if(typeof saveBrandScope==='function')saveBrandScope();
    enterInterview();
  };

  document.querySelectorAll('#handedQuestion [data-group="handed"] .opt').forEach(btn=>{
    const clone=btn.cloneNode(true);btn.replaceWith(clone);
    clone.onclick=()=>{clone.parentElement?.querySelectorAll('.opt').forEach(x=>x.classList.remove('on'));clone.classList.add('on');state.handed=clone.dataset.v;if(typeof updateDerived==='function')updateDerived();setTimeout(showBrand,40);};
  });

  const priorOpen=window.openFit;
  if(typeof priorOpen==='function')window.openFit=function(id){
    const out=priorOpen.apply(this,arguments);
    if(id==='driver'){
      step=1;state.handed=null;formBrandScopeConfirmed=false;brandChoiceMade=false;
      try{
        if(typeof formBrandScope!=='undefined'){formBrandScope.mode='all';formBrandScope.brands=[];}
        localStorage.removeItem('formBrandScope');
        localStorage.setItem('formBrandScopeConfirmed','false');
      }catch(e){}
      setTimeout(showHand,80);
    }
    return out;
  };

  const priorNext=window.next;
  if(typeof priorNext==='function')window.next=function(){
    if(step===1){if(!state.handed){showHand();return;}if(!formBrandScopeConfirmed){showBrand();return;}}
    const out=priorNext.apply(this,arguments);setTimeout(()=>centerCurrentQuestion('smooth'),35);return out;
  };
  const priorBack=window.back;
  if(typeof priorBack==='function')window.back=function(){const out=priorBack.apply(this,arguments);setTimeout(()=>centerCurrentQuestion('smooth'),35);return out;};
  const priorGoTo=window.goTo;
  if(typeof priorGoTo==='function')window.goTo=function(){const out=priorGoTo.apply(this,arguments);setTimeout(()=>centerCurrentQuestion('smooth'),35);return out;};

  document.addEventListener('click',e=>{
    if(!e.target.closest('#fitCategoryPicker button'))return;
    setTimeout(()=>{try{const selected=typeof formFitStartState!=='undefined'&&Array.isArray(formFitStartState.categories)&&formFitStartState.categories.includes('driver'),begin=document.getElementById('beginSelectedFits');if(selected&&begin&&!begin.disabled)begin.scrollIntoView({behavior:'smooth',block:'center'});}catch(err){}},150);
  },true);

  const recoveryObserver=new MutationObserver(()=>{
    const overlay=document.getElementById('formAnalysis87'),title=document.getElementById('analysisTitle87');
    if(!overlay||title?.textContent!=='Building your FORM report'||overlay.dataset.flowRecoveryArmed)return;
    overlay.dataset.flowRecoveryArmed='true';
    setTimeout(()=>{
      const still=document.getElementById('formAnalysis87');
      if(!still||document.querySelector('#result80Grid .result70Card'))return;
      try{still.remove();}catch(e){}
      window.__form87Building=false;
      try{
        if(typeof window.FORM_START_DRIVER_RESULTS==='function'){
          window.FORM_START_DRIVER_RESULTS();
          window.scrollTo({top:0,left:0,behavior:'auto'});
          console.warn('FORM recovered a stalled final report handoff through the direct controller.');
        }
      }catch(err){console.error('FORM final-stage recovery failed',err);}
    },2500);
  });
  const driver=document.getElementById('driverExperience');if(driver)recoveryObserver.observe(driver,{childList:true,subtree:true,characterData:true});

  window.FORM_DRIVER_FLOW_V85=true;window.FORM_DRIVER_FLOW_V951=true;window.FORM_DRIVER_FLOW_V102=true;return true;
}
function boot(){let n=0,t=setInterval(()=>{n++;if(init()||n>100)clearInterval(t)},50);}
if(document.readyState==='complete')setTimeout(boot,30);else window.addEventListener('load',()=>setTimeout(boot,30),{once:true});
})();