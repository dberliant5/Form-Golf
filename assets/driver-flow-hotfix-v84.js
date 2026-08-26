// FORM 8.4.1 — clean opening flow: handedness -> brand scope -> fitting
(function(){'use strict';
function init(){
 if(typeof state==='undefined'||typeof renderBrandScope!=='function')return false;
 const handed=document.getElementById('handedQuestion'),brand=document.getElementById('brandQuestion'),hs=document.getElementById('handedSummary'),bs=document.getElementById('brandOpeningSummary');
 if(!handed||!brand)return false;
 const flowNav=document.getElementById('flowNav');
 // The brand panel has its own confirmation button. Hide the global step nav while either opening question is active.
 function hideGlobalNav(){if(flowNav)flowNav.style.display='none';}
 function showGlobalNav(){if(flowNav)flowNav.style.display='flex';}
 function showHand(){handed.classList.remove('hidden');brand.classList.add('hidden');hs?.classList.add('hidden');bs?.classList.add('hidden');formBrandScopeConfirmed=false;hideGlobalNav();}
 function showBrand(){handed.classList.add('hidden');brand.classList.remove('hidden');hs?.classList.remove('hidden');bs?.classList.add('hidden');const txt=document.getElementById('handedSummaryText');if(txt)txt.textContent=state.handed==='left'?'Left-handed':'Right-handed';renderBrandScope();hideGlobalNav();brand.scrollIntoView({behavior:'smooth',block:'start'});}
 function enterFitting(){handed.classList.add('hidden');brand.classList.add('hidden');hs?.classList.add('hidden');bs?.classList.add('hidden');showGlobalNav();if(typeof step!=='undefined')step=2;if(typeof renderStep==='function')renderStep();window.scrollTo({top:0,left:0,behavior:'smooth'});}
 document.querySelectorAll('#handedQuestion [data-group="handed"] .opt').forEach(btn=>btn.addEventListener('click',()=>setTimeout(showBrand,30)));
 const originalConfirm=window.confirmBrandScope;
 window.confirmBrandScope=function(){originalConfirm();if(formBrandScopeConfirmed)enterFitting();};
 const originalOpen=window.openFit;if(typeof originalOpen==='function')window.openFit=function(id){const out=originalOpen.apply(this,arguments);if(id==='driver'){step=1;state.handed=null;formBrandScopeConfirmed=false;try{localStorage.setItem('formBrandScopeConfirmed','false')}catch(e){}setTimeout(showHand,30);}return out;};
 const originalNext=window.next;if(typeof originalNext==='function')window.next=function(){if(step===1&&!state.handed)return;if(step===1&&!formBrandScopeConfirmed){showBrand();return;}return originalNext.apply(this,arguments);};
 window.FORM_DRIVER_FLOW_V84=true;window.FORM_DRIVER_FLOW_V841=true;return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>160)clearInterval(t)},50);
})();