// FORM 14.17 — technical-input consistency guard.
// Prevents a known UX inconsistency where an implausible exact club-speed/ball-speed pair
// could pass Step 5 and then have ball speed silently excluded by the report sanitizer.
// No Fit Score, ranking, current-driver benchmark, or upgrade threshold is changed.
(function(){'use strict';
if(window.FORM_DRIVER_INPUT_CONSISTENCY_V209)return;window.FORM_DRIVER_INPUT_CONSISTENCY_V209=true;
function exact(id){try{const m=state?.metrics?.[id];return m?.mode==='exact'&&m.value!=null&&m.value!==''?Number(m.value):null}catch(e){return null}}
function clear(){document.getElementById('formConsistency209')?.remove()}
function warn(text){clear();const el=document.createElement('div');el.id='formConsistency209';el.className='formInputWarning';el.innerHTML=`<b>Check these numbers</b><span>${text}</span>`;const nav=document.getElementById('flowNav');nav?.insertAdjacentElement('beforebegin',el);try{el.scrollIntoView({block:'center',behavior:'smooth'})}catch(e){}}
function issue(){const speed=exact('speed'),ball=exact('ballSpeed');if(!speed||!ball)return null;const ratio=ball/speed;if(ratio<1.12)return `Club speed (${speed} mph) and ball speed (${ball} mph) imply a ${ratio.toFixed(2)} speed ratio. That is too low for FORM to treat both as reliable driver averages. Recheck one number, use an approximate range, or mark ball speed as unknown.`;if(ratio>1.55)return `Club speed (${speed} mph) and ball speed (${ball} mph) imply a ${ratio.toFixed(2)} speed ratio. That is outside FORM's plausible measurement range. Recheck one number or use an approximate range.`;return null}
document.addEventListener('click',e=>{const b=e.target?.closest?.('#nextBtn');if(!b)return;try{if(typeof step!=='undefined'&&step===5){const msg=issue();if(msg){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();warn(msg);return}clear()}}catch(err){}},true);
document.addEventListener('input',e=>{if(e.target?.matches?.('[data-m73-input="speed"],[data-m73-input="ballSpeed"]'))clear()},true);
window.FORM_DRIVER_INPUT_CONSISTENCY_V209={version:'14.17',issue};
})();