// FORM 10.58 — shared recommendation confidence should describe the leading fit,
// not inherit the weakest evidence level of a lower-ranked finalist.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_RESULTS_CONFIDENCE_V158)return true;
  const ENG=window.FORM_DRIVER_ENGINE_V80,V81=window.FORM_DRIVER_CONFIG_V81;
  if(!ENG||!V81||typeof golfer!=='function')return false;
  function apply(){
    const results=document.getElementById('results');
    const setup=results?.querySelector('.report121SetupGrid');
    if(!setup)return;
    let rows,sep;try{rows=ENG.winners(golfer()).slice(0,5);sep=V81.separation(rows);}catch(e){return;}
    if(!rows.length)return;
    const ev=V81.recommendationEvidence(rows[0].s),cell=setup.children[2];if(!cell)return;
    const label=cell.querySelector('.report100Label'),b=cell.querySelector('b'),small=cell.querySelector('small');
    if(label)label.textContent='Recommendation confidence';
    if(b)b.textContent=`${ev.label} · ${Math.round(ev.combined)}%`;
    if(small){
      let order='';
      if(sep?.label==='Near-tie')order=' The top two are effectively the same testing tier, so confidence in the shortlist is stronger than confidence in the exact #1/#2 order.';
      else if(sep?.label==='Narrow lead')order=' The leader has only a narrow modeled edge, so real-world testing should decide whether that ordering holds.';
      else if(sep?.label==='Modeled lead')order=' The leader separates in the model, but developing evidence limits how strongly FORM should state the advantage.';
      else if(sep?.label==='Meaningful lead')order=' The leader has enough modeled separation and evidence support to justify testing it first.';
      small.textContent=`This reflects support for the leading recommendation, based on golfer-input quality and product evidence.${order} Confidence does not change the FORM Fit Score.`;
    }
    setup.dataset.formConfidence158='1';
  }
  let q=false;new MutationObserver(function(){if(q)return;q=true;requestAnimationFrame(function(){q=false;apply();});}).observe(document.getElementById('driverExperience')||document.body,{childList:true,subtree:true});
  document.addEventListener('click',function(){setTimeout(apply,0);},true);setTimeout(apply,0);
  window.FORM_DRIVER_RESULTS_CONFIDENCE_V158={version:'10.58',apply:apply};
  return true;
}
let n=0,t=setInterval(function(){n++;if(init()||n>240)clearInterval(t);},50);
})();
