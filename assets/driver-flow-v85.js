// FORM 8.5.1 — sole opening-flow authority + fit-start auto-advance
(function(){'use strict';
function init(){
  if(typeof state==='undefined'||typeof renderBrandScope!=='function'||typeof renderStep!=='function')return false;
  const handed=document.getElementById('handedQuestion'),brand=document.getElementById('brandQuestion'),hs=document.getElementById('handedSummary'),bs=document.getElementById('brandOpeningSummary'),flowNav=document.getElementById('flowNav');
  if(!handed||!brand)return false;
  function hideGlobalNav(){if(flowNav)flowNav.style.display='none';}
  function showGlobalNav(){if(flowNav)flowNav.style.display='flex';}
  function hideOpening(){handed.classList.add('hidden');brand.classList.add('hidden');hs?.classList.add('hidden');bs?.classList.add('hidden');}
  function showHand(){step=1;handed.classList.remove('hidden');brand.classList.add('hidden');hs?.classList.add('hidden');bs?.classList.add('hidden');hideGlobalNav();const sc=document.getElementById('stepCount');if(sc)sc.textContent='01 / 09';}
  function showBrand(){step=1;handed.classList.add('hidden');brand.classList.remove('hidden');hs?.classList.add('hidden');bs?.classList.add('hidden');renderBrandScope();hideGlobalNav();requestAnimationFrame(()=>brand.scrollIntoView({behavior:'smooth',block:'start'}));}
  function enterInterview(){
    hideOpening();
    // Use the application's own navigation path, then verify Step 2 is visible. This avoids
    // manually mutating DOM state in a way older wrappers can leave inconsistent.
    if(typeof goTo==='function')goTo(2);else{step=2;renderStep();}
    showGlobalNav();
    requestAnimationFrame(()=>{
      const step2=document.getElementById('step2');
      if(step2?.classList.contains('hidden')){step=2;document.querySelectorAll('#driverExperience .step').forEach(x=>x.classList.add('hidden'));step2.classList.remove('hidden');const bar=document.getElementById('progressBar'),count=document.getElementById('stepCount');if(bar)bar.style.width=(2/9*100)+'%';if(count)count.textContent='02 / 09';showGlobalNav();}
      window.scrollTo({top:0,left:0,behavior:'smooth'});
    });
  }

  window.confirmBrandScope=function(){
    if(typeof brandScopeIsValid==='function'&&!brandScopeIsValid()){
      const wrap=document.getElementById('brandPickerWrap');wrap?.classList.add('needsAnswer');setTimeout(()=>wrap?.classList.remove('needsAnswer'),900);return;
    }
    formBrandScopeConfirmed=true;
    if(typeof saveBrandScope==='function')saveBrandScope();
    enterInterview();
  };

  // Replace original handedness buttons so legacy click handlers cannot also advance the flow.
  document.querySelectorAll('#handedQuestion [data-group="handed"] .opt').forEach(btn=>{
    const clone=btn.cloneNode(true);btn.replaceWith(clone);
    clone.onclick=()=>{clone.parentElement?.querySelectorAll('.opt').forEach(x=>x.classList.remove('on'));clone.classList.add('on');state.handed=clone.dataset.v;if(typeof updateDerived==='function')updateDerived();setTimeout(showBrand,40);};
  });

  const priorOpen=window.openFit;
  if(typeof priorOpen==='function')window.openFit=function(id){const out=priorOpen.apply(this,arguments);if(id==='driver'){step=1;state.handed=null;formBrandScopeConfirmed=false;try{localStorage.setItem('formBrandScopeConfirmed','false')}catch(e){}setTimeout(showHand,80);}return out;};

  const priorNext=window.next;
  if(typeof priorNext==='function')window.next=function(){if(step===1){if(!state.handed){showHand();return;}if(!formBrandScopeConfirmed){showBrand();return;}}return priorNext.apply(this,arguments);};

  // Driver category selection should take the golfer to the final Begin fitting CTA.
  document.addEventListener('click',e=>{
    if(!e.target.closest('#fitCategoryPicker button'))return;
    setTimeout(()=>{try{const selected=typeof formFitStartState!=='undefined'&&Array.isArray(formFitStartState.categories)&&formFitStartState.categories.includes('driver'),begin=document.getElementById('beginSelectedFits');if(selected&&begin&&!begin.disabled)begin.scrollIntoView({behavior:'smooth',block:'center'});}catch(err){}},150);
  },true);

  window.FORM_DRIVER_FLOW_V85=true;window.FORM_DRIVER_FLOW_V851=true;return true;
}
function boot(){let n=0,t=setInterval(()=>{n++;if(init()||n>100)clearInterval(t)},50);}
if(document.readyState==='complete')setTimeout(boot,30);else window.addEventListener('load',()=>setTimeout(boot,30),{once:true});
})();