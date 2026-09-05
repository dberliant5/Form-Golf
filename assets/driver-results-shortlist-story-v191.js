// FORM 14.8 — unified shortlist narrative.
// Presentation only: one comparative story, all challengers anchored to #1, no observers/rescoring.
(function(){'use strict';
if(window.FORM_RESULTS_SHORTLIST_STORY_V191)return;window.FORM_RESULTS_SHORTLIST_STORY_V191=true;
const ENG=window.FORM_DRIVER_ENGINE_V80;
const KEYS=['speed','direction','strike','spin','launch','efficiency'];
const LABEL={speed:'distance',direction:'directional fit',strike:'forgiveness',spin:'spin control',launch:'launch',efficiency:'ball-speed retention'};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function rowsNow(){try{return ENG?.winners(golfer()).slice(0,5)||[]}catch(e){return[]}}
function map(row){return Object.fromEntries((row?.s?.components||[]).map(x=>[x.key,x]));}
function name(row){return [row?.p?.brand,row?.p?.model].filter(Boolean).join(' ')||'This model';}
function diffs(row,leader){const a=map(row),b=map(leader);return KEYS.map(k=>Number.isFinite(a[k]?.score)&&Number.isFinite(b[k]?.score)?{k,label:LABEL[k],delta:a[k].score-b[k].score}:null).filter(Boolean);}
function best(d,sign){return d.filter(x=>sign>0?x.delta>=2:x.delta<=-2).sort((a,b)=>sign>0?b.delta-a.delta:a.delta-b.delta)[0]||null;}
function sentence(rows,i){const leader=rows[0],row=rows[i],gap=leader.s.overall-row.s.overall,d=diffs(row,leader),win=best(d,1),loss=best(d,-1),nm=name(row),lead=name(leader);let s='';
 if(i===1)s=gap<1.25?`${nm} is right behind it — only ${Math.abs(gap).toFixed(1)} Fit points separate the two.`:`${nm} is the closest challenger, ${Math.abs(gap).toFixed(1)} Fit points behind.`;
 else s=gap<1.25?`${nm} is also effectively in the lead group, just ${Math.abs(gap).toFixed(1)} Fit points behind ${lead}.`:`${nm} sits ${Math.abs(gap).toFixed(1)} Fit points behind ${lead}.`;
 if(win&&loss)s+=` It actually outperforms ${lead} on ${win.label}, but gives some of that back on ${loss.label}.`;
 else if(win)s+=` Its clearest argument against ${lead} is ${win.label}, where it scores better.`;
 else if(loss)s+=` Its biggest obstacle versus ${lead} is ${loss.label}.`;
 else s+=` There is no single category separating it from ${lead}; the difference comes from the overall combination.`;
 return s;}
function build(rows){const leader=rows[0],second=rows[1],lead=name(leader);let intro='';
 if(second){const gap=leader.s.overall-second.s.overall,d=diffs(leader,second),win=best(d,1),loss=best(d,-1);intro=gap<1.25?`${lead} finished first, but the top two are extremely close — only ${Math.abs(gap).toFixed(1)} Fit points apart.`:`${lead} finished first, leading the next-best option by ${Math.abs(gap).toFixed(1)} Fit points.`;if(win&&loss)intro+=` ${lead} has the edge on ${win.label}, while ${name(second)} is stronger on ${loss.label}.`;else if(win)intro+=` ${lead}'s clearest advantage is ${win.label}.`;else intro+=` Its lead comes from the complete fit rather than one dominant category.`;}
 else intro=`${lead} is the best overall match FORM found for your swing.`;
 const challengers=rows.slice(1,4).map((_,j)=>sentence(rows,j+1)).join(' ');
 const secondGap=second?leader.s.overall-second.s.overall:null;let bottom=second&&secondGap<1.25?`Start by testing ${lead} and ${name(second)} head-to-head. The modeled gap is small enough that a clearly tighter real-world pattern should decide it.`:`Start with ${lead}. The other finalists need to show a clear real-world advantage in their strongest category to move ahead of it.`;
 return {intro,challengers,bottom};}
function ensureStyle(){if(document.getElementById('formShortlist191Styles'))return;const s=document.createElement('style');s.id='formShortlist191Styles';s.textContent='.report191Story{margin:0 0 24px;padding:20px 22px;border:1px solid var(--line);border-left:4px solid var(--deep);background:#fafbf8}.report191Story h3{font-size:20px;margin:6px 0 9px;letter-spacing:-.015em}.report191Story p{margin:0 0 9px;color:var(--muted);font-size:10.5px;line-height:1.65}.report191Story p:last-child{margin-bottom:0}.report191Bottom{padding-top:9px;border-top:1px solid var(--line);color:var(--deep)!important;font-weight:650}.report100Why{display:none!important}';document.head.appendChild(s)}
function apply(){const results=document.getElementById('results');if(!results?.classList.contains('formReport100')||results.dataset.shortlist191==='1')return false;const rows=rowsNow(),grid=results.querySelector('.report100Grid');if(!rows.length||!grid)return false;results.dataset.shortlist191='1';ensureStyle();const story=build(rows);const box=document.createElement('section');box.className='report191Story';box.innerHTML=`<span class="report100Label">How the shortlist shakes out</span><h3>The ranking, in plain English</h3><p>${esc(story.intro)}</p>${story.challengers?`<p>${esc(story.challengers)}</p>`:''}<p class="report191Bottom"><b>Bottom line:</b> ${esc(story.bottom)}</p>`;grid.insertAdjacentElement('beforebegin',box);
 [...results.querySelectorAll('.report100Read')].forEach(read=>{const heads=[...read.querySelectorAll('h4')];heads.forEach(h=>{if(/What I would pressure-test/i.test(h.textContent||''))h.textContent='What to watch';});});return true;}
window.FORM_APPLY_RESULTS_SHORTLIST_STORY_V191=apply;
})();