// FORM 8.4 — deterministic opening flow: handedness -> brand scope -> fitting
(function(){'use strict';
function init(){
 if(typeof state==='undefined'||typeof renderBrandScope!=='function')return false;
 const handed=document.getElementById('handedQuestion'),brand=document.getElementById('brandQuestion'),hs=document.getElementById('handedSummary'),bs=document.getElementById('brandOpeningSummary');
 if(!handed||!brand)return false;
 function showHand(){handed.classList.remove('hidden');brand.classList.add('hidden');hs?.classList.add('hidden');bs?.classList.add('hidden');formBrandScopeConfirmed=false;}
 function showBrand(){handed.classList.add('hidden');brand.classList.remove('hidden');hs?.classList.remove('hidden');bs?.classList.add('hidden');const txt=document.getElementById('handedSummaryText');if(txt)txt.textContent=state.handed==='left'?'Left-handed':'Right-handed';renderBrandScope();brand.scrollIntoView({behavior:'smooth',block:'start'});}
 document.querySelectorAll('#handedQuestion [data-group="handed"] .opt').forEach(btn=>btn.addEventListener('click',()=>setTimeout(showBrand,30)));
 const originalConfirm=window.confirmBrandScope;
 window.confirmBrandScope=function(){originalConfirm();if(formBrandScopeConfirmed){brand.classList.add('hidden');bs?.classList.remove('hidden');const t=document.getElementById('brandOpeningSummaryText');if(t)t.textContent=brandScopeSummaryLabel();const nav=document.getElementById('flowNav');nav?.scrollIntoView({behavior:'smooth',block:'center'});}};
 const originalOpen=window.openFit;if(typeof originalOpen==='function')window.openFit=function(id){const out=originalOpen.apply(this,arguments);if(id==='driver'){step=1;state.handed=null;formBrandScopeConfirmed=false;try{localStorage.setItem('formBrandScopeConfirmed','false')}catch(e){}setTimeout(showHand,30);}return out;};
 const originalNext=window.next;if(typeof originalNext==='function')window.next=function(){if(step===1&&!state.handed)return;if(step===1&&!formBrandScopeConfirmed){showBrand();return;}return originalNext.apply(this,arguments);};
 window.FORM_DRIVER_FLOW_V84=true;return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>160)clearInterval(t)},50);
})();