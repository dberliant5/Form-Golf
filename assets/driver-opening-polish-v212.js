// FORM 14.18.2 — driver-specific opening language + unmistakable brand selection treatment.
// Presentation only. Does not alter fitting state, brand filtering, scoring, or ranking.
(function(){'use strict';
if(window.FORM_DRIVER_OPENING_POLISH_V212)return;window.FORM_DRIVER_OPENING_POLISH_V212=true;
const $=(q,r=document)=>r.querySelector(q),$$=(q,r=document)=>[...r.querySelectorAll(q)];
function styles(){if($('#formOpening212Style'))return;const s=document.createElement('style');s.id='formOpening212Style';s.textContent=`
/* Make selected brand scope visibly dimensional rather than reading as a flat green fill. */
#brandScopePanel .brandMode.formBrandSelected211,
#brandScopePanel .brandMode.active,
#brandPicker button.formBrandSelected211,
#brandPicker button.active,
#brandPicker button.on,
#brandPicker button.selected,
#brandPicker button[aria-pressed="true"]{
  position:relative!important;
  isolation:isolate!important;
  overflow:hidden!important;
  background-color:#1d392d!important;
  background-image:
    radial-gradient(circle at 88% 18%,rgba(191,220,192,.34) 0%,rgba(191,220,192,.13) 22%,transparent 46%),
    linear-gradient(118deg,#183127 0%,#244536 43%,#3d624d 72%,#66816d 100%)!important;
  color:#fff!important;
  border-color:#244536!important;
  box-shadow:0 13px 30px rgba(25,51,40,.20),inset 0 1px 0 rgba(255,255,255,.08)!important;
}
#brandScopePanel .brandMode.formBrandSelected211:after,
#brandScopePanel .brandMode.active:after{
  content:""!important;
  position:absolute!important;
  inset:0!important;
  pointer-events:none!important;
  z-index:-1!important;
  background:linear-gradient(100deg,transparent 0 57%,rgba(255,255,255,.07) 72%,transparent 88%)!important;
}
#brandScopePanel .brandMode.formBrandSelected211 b,
#brandScopePanel .brandMode.formBrandSelected211 span,
#brandScopePanel .brandMode.active b,
#brandScopePanel .brandMode.active span,
#brandPicker button.formBrandSelected211,
#brandPicker button.active,
#brandPicker button.on,
#brandPicker button.selected,
#brandPicker button[aria-pressed="true"]{color:#fff!important}
#brandScopePanel .brandMode.formBrandSelected211 span,#brandScopePanel .brandMode.active span{opacity:.86!important}
`;
document.head.appendChild(s)}
function relabel(){
  const d=$('#driverExperience');if(!d)return false;
  $$('*',d).forEach(el=>{
    if(el.children.length)return;
    const t=(el.textContent||'').trim();
    if(t==='FORM · CALIBRATION')el.textContent='FORM · DRIVER FITTING';
    else if(t==='Profile calibration')el.textContent='Driver baseline';
    else if(t==='Build the baseline before FORM evaluates equipment.')el.textContent='Set the baseline FORM will use to evaluate your driver fit.';
  });
  return true;
}
function syncBrand(){
  const panel=$('#brandScopePanel');if(!panel)return false;
  const modes=$$('.brandMode',panel);let selected=modes.find(b=>b.classList.contains('active')||b.classList.contains('on')||b.getAttribute('aria-pressed')==='true'||b.classList.contains('formBrandSelected211'));
  if(!selected)selected=modes[0]||null;
  modes.forEach(b=>b.classList.toggle('formBrandSelected211',b===selected));
  return true;
}
function apply(){styles();relabel();syncBrand()}
apply();
document.addEventListener('click',e=>{if(e.target.closest('#brandScopePanel .brandMode,#brandPicker button'))setTimeout(apply,0)},false);
let n=0,t=setInterval(()=>{apply();if(++n>80)clearInterval(t)},100);
})();