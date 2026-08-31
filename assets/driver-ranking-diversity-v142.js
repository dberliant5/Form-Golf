// FORM 10.42 — balanced multi-model ranking for multi-brand fits.
// FORM Fit Score remains absolute and independent of the golfer's current driver.
// Multi-brand reports may show up to two models per brand before lower-priority overflow,
// so a strong sibling model is not hidden while a single manufacturer cannot flood the top five.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_RANKING_DIVERSITY_V142)return true;
  const ENG=window.FORM_DRIVER_ENGINE_V80;
  if(!ENG||typeof products==='undefined'||!Array.isArray(products))return false;
  const prior=ENG.winners;
  if(typeof prior!=='function')return false;
  function singleBrandScope(){
    try{return typeof formBrandScope!=='undefined'&&formBrandScope.mode==='single'&&Array.isArray(formBrandScope.brands)&&formBrandScope.brands.length===1;}catch(e){return false;}
  }
  function allEligible(g){
    const rows=[];
    products.forEach(p=>{
      if(p.generation==='previous_limited')return;
      if(typeof productAllowedByBrandScope==='function'&&!productAllowedByBrandScope(p))return;
      let s;try{s=ENG.scoreOne(p,g);}catch(e){return;}
      if(!s?.hardConstraints?.length)rows.push({p,s});
    });
    rows.sort((a,b)=>b.s.overall-a.s.overall);
    return rows;
  }
  ENG.winners=function(g){
    const rows=allEligible(g);
    if(singleBrandScope()||rows.length<2)return rows;
    const counts=new Map(),primary=[],overflow=[];
    rows.forEach(r=>{
      const brand=r.p?.brand||'';
      const n=counts.get(brand)||0;
      if(n<2){primary.push(r);counts.set(brand,n+1);}else overflow.push(r);
    });
    return primary.concat(overflow);
  };
  if(typeof window.driverRankV43==='function')window.driverRankV43=g=>ENG.winners(g);
  window.FORM_DRIVER_RANKING_DIVERSITY_V142={version:'10.42',allEligible,previousWinners:prior};
  return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>240)clearInterval(t);},50);
})();
