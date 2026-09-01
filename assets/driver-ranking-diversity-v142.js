// FORM 10.44 — ranking integrity for multi-brand driver fits.
// FORM Fit Score remains absolute and independent of the golfer's current driver.
// The ranked recommendation list must remain in strict descending Fit Score order.
// Brand variety may be useful for an optional comparison shortlist, but it must never
// promote a lower-scoring product above a higher-scoring product in the actual ranking.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_RANKING_DIVERSITY_V142?.version==='10.44')return true;
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
    rows.sort((a,b)=>{
      const d=(b.s?.overall??-Infinity)-(a.s?.overall??-Infinity);
      if(Math.abs(d)>1e-9)return d;
      return String(a.p?.brand||'').localeCompare(String(b.p?.brand||''))||String(a.p?.model||a.p?.name||'').localeCompare(String(b.p?.model||b.p?.name||''));
    });
    return rows;
  }
  function comparisonShortlist(g,limit=5,maxPerBrand=2){
    const rows=allEligible(g);
    if(singleBrandScope())return rows.slice(0,limit);
    const out=[],counts=new Map();
    for(const r of rows){
      const brand=r.p?.brand||'';
      const n=counts.get(brand)||0;
      if(n>=maxPerBrand)continue;
      out.push(r);counts.set(brand,n+1);
      if(out.length>=limit)break;
    }
    // This is deliberately separate from ENG.winners. It is a comparison aid only.
    return out;
  }
  ENG.winners=function(g){return allEligible(g);};
  if(typeof window.driverRankV43==='function')window.driverRankV43=g=>ENG.winners(g);
  window.FORM_DRIVER_RANKING_DIVERSITY_V142={version:'10.44',allEligible,comparisonShortlist,previousWinners:prior};
  return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>240)clearInterval(t);},50);
})();
