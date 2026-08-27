// FORM 9.5 — analysis transition watchdog. Keeps the premium staged experience,
// but guarantees the golfer cannot be trapped on it indefinitely.
(function(){
  'use strict';
  function init(){
    if(window.FORM_DRIVER_RESULTS_WATCHDOG_V95)return true;
    if(typeof window.showResults!=='function'||typeof window.__FORM_BASE_SHOW_RESULTS!=='function')return false;
    const wrapped=window.showResults;
    window.showResults=function(){
      const ctx=this,args=arguments,start=Date.now();
      let recovered=false;
      const watchdog=setTimeout(()=>{
        const overlay=document.getElementById('formAnalysis87');
        const hasResults=!!document.querySelector('#result80Grid .result70Card');
        if(!overlay||hasResults)return;
        recovered=true;
        try{overlay.remove();}catch(e){}
        window.__form87Building=false;
        try{
          window.__FORM_BASE_SHOW_RESULTS.apply(ctx,args);
          window.scrollTo({top:0,left:0,behavior:'auto'});
          console.warn('FORM recovered a stalled fitting-analysis transition after',Date.now()-start,'ms');
        }catch(err){
          console.error('FORM results recovery failed',err);
        }
      },12500);
      try{return wrapped.apply(ctx,args);}finally{
        // Do not clear immediately: wrapped showResults is intentionally asynchronous.
        const checker=setInterval(()=>{
          if(recovered){clearInterval(checker);clearTimeout(watchdog);return;}
          const overlay=document.getElementById('formAnalysis87');
          const hasResults=!!document.querySelector('#result80Grid .result70Card');
          if(!overlay&&hasResults){clearInterval(checker);clearTimeout(watchdog);}
        },250);
        setTimeout(()=>clearInterval(checker),15000);
      }
    };
    window.FORM_DRIVER_RESULTS_WATCHDOG_V95=true;
    return true;
  }
  let n=0,t=setInterval(()=>{n++;if(init()||n>120)clearInterval(t)},50);
})();
