// FORM 14.18.1 — deterministic brand-selection visual state.
// Presentation only. Does not alter brand filtering logic.
(function(){'use strict';
if(window.FORM_BRAND_SELECTION_V211)return;window.FORM_BRAND_SELECTION_V211=true;
const $=(q,r=document)=>r.querySelector(q),$$=(q,r=document)=>[...r.querySelectorAll(q)];
function style(){if($('#formBrand211Style'))return;const s=document.createElement('style');s.id='formBrand211Style';s.textContent=`
#brandScopePanel .brandMode.formBrandSelected211,
#brandPicker button.formBrandSelected211{
  background:linear-gradient(135deg,#20362c 0%,#2f4b3e 56%,#496958 100%)!important;
  color:#fff!important;
  border-color:#20362c!important;
  box-shadow:0 12px 28px rgba(32,54,44,.18)!important;
}
#brandScopePanel .brandMode.formBrandSelected211 b,
#brandScopePanel .brandMode.formBrandSelected211 span,
#brandPicker button.formBrandSelected211{color:#fff!important}
#brandScopePanel .brandMode.formBrandSelected211 span{opacity:.82!important}
`;
document.head.appendChild(s)}
function sync(){style();const panel=$('#brandScopePanel');if(!panel)return;
  const modes=$$('.brandMode',panel);let selected=modes.find(b=>b.classList.contains('active')||b.classList.contains('on')||b.getAttribute('aria-pressed')==='true');
  if(!selected)selected=modes[0]||null;
  modes.forEach(b=>b.classList.toggle('formBrandSelected211',b===selected));
  $$('#brandPicker button').forEach(b=>{const on=b.classList.contains('active')||b.classList.contains('on')||b.classList.contains('selected')||b.getAttribute('aria-pressed')==='true';b.classList.toggle('formBrandSelected211',on)});
}
style();sync();
document.addEventListener('click',e=>{if(e.target.closest('#brandScopePanel .brandMode,#brandPicker button'))setTimeout(sync,0)},false);
let n=0,t=setInterval(()=>{sync();if(++n>80)clearInterval(t)},100);
})();