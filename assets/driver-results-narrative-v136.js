// FORM 10.37 — finalist-relative narrative Pros/Cons for driver recommendations.
(function(){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEYS=['speed','direction','strike','spin','launch','efficiency'];
const LABEL={speed:'distance',direction:'dispersion',strike:'forgiveness',spin:'spin control',launch:'launch',efficiency:'ball-speed retention'};
function boot(){
 const ENG=window.FORM_DRIVER_ENGINE_V80;if(!ENG||typeof golfer!=='function')return false;
 function comps(row){return Object.fromEntries((row.s.components||[]).map(x=>[x.key,x]));}
 function avg(rows,key,skip){const vals=rows.filter((_,i)=>i!==skip).map(r=>comps(r)[key]?.score).filter(Number.isFinite);return vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:null;}
 function profile(){try{return golfer()}catch(e){return {}}}
 function needPhrase(key,g){
   if(key==='strike'){
     if(g.strike==='toe')return 'That matters because your contact tends to drift toward the toe, where keeping the head stable can protect both start line and usable speed.';
     if(g.strike==='heel')return 'That matters because your contact tends to drift toward the heel, so mishit stability is more important than a perfect center-strike number.';
     if(g.strike==='varied')return 'That matters because your strike moves around the face, making consistency across mishits a bigger priority than peak output.';
     return 'That gives you useful insurance when contact moves away from center.';
   }
   if(key==='direction')return 'For your shot pattern, that points to a tighter playable window rather than simply chasing the longest individual drive.';
   if(key==='spin'){
     if(g.spin==='low')return 'Because you tend to live on the low-spin side, preserving enough spin is important so the ball does not fall out of the air.';
     if(g.spin==='high')return 'Because excess spin is part of your profile, this helps keep flight from becoming too soft or inefficient.';
     return 'That should make the launch window easier to repeat rather than forcing loft to solve everything.';
   }
   if(key==='launch'){
     if(g.traj==='low')return 'That is useful for your lower flight because the head is helping create playable height instead of asking the shaft or loft to do all the work.';
     if(g.traj==='high')return 'That helps keep your naturally higher flight from becoming overly floaty.';
     return 'That gives the fitter a workable starting window without needing an extreme loft correction.';
   }
   if(key==='speed')return 'In practice, that means this head is not asking you to trade away your broader fit just to create speed.';
   if(key==='efficiency')return 'That matters over a full round because average distance is driven by what happens on imperfect swings, not only your best strike.';
   return '';
 }
 function archetype(row){const p=row.p||{};const f=Number(p.forgiveness)||0,l=Number(p.launch)||0,s=Number(p.spin)||0,b=Number(p.draw_bias)||0;
   if(f>=4.6&&l>=3.8)return 'high-stability, launch-supporting';
   if(f>=4.6)return 'high-stability';
   if(s<=2.2)return 'lower-spin';
   if(b>=.8)return 'draw-supporting';
   if(l>=4)return 'higher-launching';
   if(p.player==='lowspin')return 'speed-oriented, lower-spin';
   return 'balanced';
 }
 function strongest(rows,i){const A=comps(rows[i]);return KEYS.map(k=>{const x=A[k],m=avg(rows,k,i);return x&&m!=null?{k,score:x.score,delta:x.score-m}:null}).filter(Boolean).sort((a,b)=>b.delta-a.delta);}
 function weakest(rows,i){const A=comps(rows[i]);return KEYS.map(k=>{const x=A[k],m=avg(rows,k,i);return x&&m!=null?{k,score:x.score,delta:x.score-m}:null}).filter(Boolean).sort((a,b)=>a.delta-b.delta);}
 function proText(row,rows,i,item,secondary){const g=profile(),name=`${row.p.brand} ${row.p.model}`,type=archetype(row),label=LABEL[item.k];
   if(item.delta>2.5)return `${name} separates itself from this finalist group most clearly in ${label}. As a ${type} head, that gives it a distinct job in your test rather than making it another interchangeable option. ${needPhrase(item.k,g)}`;
   if(secondary)return `Its second advantage is balance: ${label} holds up without creating an obvious penalty in the categories around it. That makes this a useful comparison head if the leader's more specialized strength does not translate to better shots for you.`;
   return `${name} does not dominate one category, but its ${label} profile is one of the cleaner matches in this group. The appeal is the combination rather than a single headline number. ${needPhrase(item.k,g)}`;
 }
 function conText(row,rows,i,item,secondary){const g=profile(),name=`${row.p.brand} ${row.p.model}`,label=LABEL[item.k];
   if(item.delta<-2.5)return `${label[0].toUpperCase()+label.slice(1)} is the clearest reason ${name} may lose a side-by-side test. It trails the other finalists here, so this is the area to watch rather than assuming its overall Fit Score tells the whole story. ${needPhrase(item.k,g)}`;
   if(secondary)return `There is also less separation in ${label}. That is not a flaw by itself, but it means this head needs to earn its place through the way the full ball flight looks and repeats—not because FORM sees a special advantage in this category.`;
   return `${name} has no major red flag, but ${label} is the least compelling part of its profile relative to the other finalists. Treat that as the first thing to pressure-test during the fitting. ${needPhrase(item.k,g)}`;
 }
 function read(row,rows,i){const hi=strongest(rows,i),lo=weakest(rows,i);if(!hi.length||!lo.length)return '';
   const pros=[proText(row,rows,i,hi[0],false)];if(hi[1]&&hi[1].k!==hi[0].k)pros.push(proText(row,rows,i,hi[1],true));
   const cons=[conText(row,rows,i,lo[0],false)];if(lo[1]&&lo[1].k!==lo[0].k)cons.push(conText(row,rows,i,lo[1],true));
   return `<div class="report128ClubRead report136Narrative"><section><h4>Pros</h4><ul>${pros.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section><section><h4>Cons</h4><ul>${cons.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section></div>`;
 }
 function apply(){const results=document.getElementById('results');if(!results?.classList.contains('formReport100'))return;let rows=[];try{rows=ENG.winners(golfer()).slice(0,5)}catch(e){return}const cards=[...results.querySelectorAll('.report100Card')];if(!rows.length||!cards.length)return;cards.forEach((card,i)=>{if(!rows[i])return;const old=card.querySelector('.report128ClubRead');if(!old)return;const holder=document.createElement('div');holder.innerHTML=read(rows[i],rows,i);const fresh=holder.firstElementChild;if(fresh)old.replaceWith(fresh);});results.dataset.formNarrative136='1';}
 apply();let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})}).observe(document.getElementById('driverExperience')||document.body,{childList:true,subtree:true});
 window.FORM_DRIVER_RESULTS_NARRATIVE_V136=true;return true;
 }
let n=0,t=setInterval(()=>{n++;if(boot()||n>160)clearInterval(t)},50);
})();