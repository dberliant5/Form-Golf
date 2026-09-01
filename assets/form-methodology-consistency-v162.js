// FORM 10.62 — keep public methodology aligned with the range-first driver interview.
(function(){
'use strict';
function apply(){
  const page=document.getElementById('page-methodology');if(!page)return false;
  const cards=[...page.querySelectorAll('.methodCard')];
  const identify=cards.find(c=>/Identify the golfer/i.test(c.textContent||''));
  const p=identify?.querySelector('p');
  if(p&&/Exact launch-monitor data improves precision/i.test(p.textContent||'')){
    p.textContent='We collect the minimum useful information about speed, delivery, strike, ball flight, current equipment, preferences and priorities. Launch-monitor ranges can improve precision, but they are not required—and FORM avoids treating one swing as an exact description of your game.';
  }
  return true;
}
let n=0,t=setInterval(()=>{n++;if(apply()||n>160)clearInterval(t);},50);
window.FORM_METHODOLOGY_CONSISTENCY_V162={version:'10.62',apply};
})();
