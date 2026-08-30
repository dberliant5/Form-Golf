// FORM 10.41 — current-driver reliability guard for upgrade advice.
// New-driver FORM Fit Scores remain independent of the golfer's current club.
// Historical/inferred current-driver profiles may guide test order, but cannot support a strong purchase claim.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_RESULTS_UPGRADE_GUARD_V141)return true;
  const V81=window.FORM_DRIVER_CONFIG_V81,ENG=window.FORM_DRIVER_ENGINE_V80;
  if(!V81||!ENG||typeof golfer!=='function')return false;
  const r1=v=>Math.round(v*10)/10;
  function apply(){
    const results=document.getElementById('results');
    const box=results?.querySelector?.('.report100Upgrade');
    if(!box)return;
    let g,current,rows;
    try{g=golfer();current=V81.currentReliability(g);rows=ENG.winners(g);}catch(e){return;}
    if(!current||current.score==null||current.exact!==false||!rows?.length)return;
    const best=rows[0],gap=r1(best.s.overall-current.score);
    const title=box.querySelector('b'),text=box.querySelector('p');
    if(title)title.textContent='Test before replacing';
    if(text)text.textContent=`FORM models the best new fit ${gap.toFixed(1)} points ahead, but your current-driver benchmark is inferred rather than directly evidenced. Use the gap to prioritize a side-by-side test; do not treat it as a purchase claim without measured validation.`;
    box.dataset.formUpgradeReliability='inferred-current-profile';
  }
  const observer=new MutationObserver(()=>apply());
  observer.observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener('click',()=>setTimeout(apply,0),true);
  setTimeout(apply,0);
  window.FORM_DRIVER_RESULTS_UPGRADE_GUARD_V141={version:'10.41',apply};
  return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>240)clearInterval(t);},50);
})();
