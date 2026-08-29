// FORM 10.40 — keep golfer-facing evidence language consistent with the scoring architecture.
(function(){
'use strict';
function rewrite(root){
  if(!root)return;
  root.querySelectorAll('small').forEach(el=>{
    const t=el.textContent||'';
    if(t.includes('Evidence affects confidence, not FORM Fit Score.')){
      el.textContent=t.replace('Evidence affects confidence, not FORM Fit Score.','Evidence calibrates model-specific performance credit and recommendation confidence. Your current driver never changes FORM Fit Score.');
    }
    if(t.includes('This is support for the recommendation, not the Fit Score.')){
      el.textContent=t.replace('This is support for the recommendation, not the Fit Score.','Evidence strength limits how much unsupported product separation FORM is willing to claim. Your current driver remains a separate upgrade benchmark.');
    }
  });
}
function init(){
  const root=document.getElementById('driverExperience')||document.body;
  if(!root)return false;
  rewrite(root);
  let queued=false;
  new MutationObserver(()=>{
    if(queued)return;queued=true;
    requestAnimationFrame(()=>{queued=false;rewrite(root);});
  }).observe(root,{childList:true,subtree:true});
  window.FORM_DRIVER_RESULTS_EVIDENCE_COPY_V140={version:'10.40'};
  return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>160)clearInterval(t)},50);
})();