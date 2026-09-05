// FORM 10.93 — configuration/input hardening after the two-axis priority change.
// 1) Approximate/general AoA now informs loft starting points instead of being ignored.
// 2) A true 50/50 Distance / Accuracy split is described as balanced in results copy.
// No Fit Score or current-vs-new comparison logic is changed here.
(function(){'use strict';
if(window.FORM_DRIVER_CONFIG_PRIORITY_HARDENING_V190)return;

function init(){
  if(window.FORM_DRIVER_CONFIG_PRIORITY_HARDENING_V190)return true;
  const V81=window.FORM_DRIVER_CONFIG_V81;
  if(!V81||typeof V81.loftFit!=='function')return false;
  const priorLoftFit=V81.loftFit.bind(V81);
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

  function selectedAoaLabel(m){
    let label=String(m?.value??'');
    try{
      const def=metricDefs?.aoa, choices=m?.mode==='range'?def?.range:m?.mode==='general'?def?.general:null;
      const hit=choices?.find?.(x=>String(x?.[0])===String(m?.value));
      if(hit?.[1])label=String(hit[1]);
    }catch(e){}
    return label;
  }

  function aoaEstimate(){
    let m=null;try{m=state?.metrics?.aoa}catch(e){}
    if(!m||m.mode==='unknown'||m.mode==='exact'||m.value==null||m.value==='unknown')return null;
    const label=selectedAoaLabel(m).toLowerCase().replace(/[−–—]/g,'-');
    if(/level|neutral|zero/.test(label))return {value:0,mode:m.mode,label:selectedAoaLabel(m)};
    const nums=(label.match(/\d+(?:\.\d+)?/g)||[]).map(Number).filter(Number.isFinite);
    let mag=null;
    if(nums.length>=2)mag=(nums[0]+nums[1])/2;
    else if(nums.length===1)mag=/more|over|greater|plus|\+/.test(label)?nums[0]+1:nums[0];
    else if(/down|negative|descending/.test(label))mag=3;
    else if(/\bup\b|positive|ascending/.test(label))mag=3;
    if(mag==null)return null;
    const down=/down|negative|descending/.test(label),up=/\bup\b|positive|ascending/.test(label);
    if(!down&&!up)return null;
    return {value:(down?-1:1)*mag,mode:m.mode,label:selectedAoaLabel(m)};
  }

  V81.loftFit=function(p){
    const base=priorLoftFit(p),est=aoaEstimate();
    if(!est)return base;
    let delta=0;
    if(est.value<=-2)delta=.5;
    else if(est.value>=4)delta=-.5;
    if(!delta)return {...base,aoaEstimate:est};
    const loft=Math.round(clamp((Number(base.loft)||10.5)+delta,8,12)*2)/2;
    const lo=clamp(loft-.5,8,12),hi=clamp(loft+.5,8,12);
    const direction=delta>0?'adds a little loft':'takes a little loft off';
    const reason=`${base.reason||''} Your ${est.mode==='range'?'approximate':'general'} attack-angle answer (${est.label}) ${direction} to the starting point.`.trim();
    return {...base,loft,range:`${lo.toFixed(1)}°–${hi.toFixed(1)}°`,reason,aoaEstimate:est};
  };

  function fixBalancedPriorityCopy(){
    let w=null;try{w=state?.priorityWeights}catch(e){}
    if(!w||Number(w.distance)!==50||Number(w.accuracy)!==50)return false;
    let changed=false;
    document.querySelectorAll('#results .report100Why').forEach(el=>{
      const html=el.innerHTML;
      const next=html
        .replace(/with accuracy \/ forgiveness carrying the most emphasis/gi,'with distance and accuracy / forgiveness weighted evenly')
        .replace(/with distance carrying the most emphasis/gi,'with distance and accuracy / forgiveness weighted evenly');
      if(next!==html){el.innerHTML=next;changed=true;}
    });
    return changed;
  }

  const priorStory=window.FORM_APPLY_RESULTS_STORY_V188;
  if(typeof priorStory==='function')window.FORM_APPLY_RESULTS_STORY_V188=function(){
    const out=priorStory();
    try{fixBalancedPriorityCopy()}catch(e){}
    return out;
  };

  window.FORM_APPLY_CONFIG_PRIORITY_HARDENING_V190=fixBalancedPriorityCopy;
  window.FORM_DRIVER_CONFIG_PRIORITY_HARDENING_V190={version:'10.93',priorLoftFit,aoaEstimate,fixBalancedPriorityCopy};
  return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>240)clearInterval(t);},50);
})();