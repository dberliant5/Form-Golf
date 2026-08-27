// FORM 8.6 — technical-question progression + transparent near-miss brands
(function(){'use strict';
function init(){
  const ENG=window.FORM_DRIVER_ENGINE_V80;
  if(!ENG||typeof state==='undefined')return false;

  // The legacy guided-scroll handler centers the entire LM input block, which can jump well past
  // the next question on mobile. Intercept the route choice and advance only to the next actual
  // question (club speed) with a stable header offset.
  document.addEventListener('click',e=>{
    const opt=e.target.closest('#step5 [data-group="lm"] .opt');
    if(!opt)return;
    e.stopImmediatePropagation();
    const group=opt.closest('[data-group]');
    group?.querySelectorAll('.opt').forEach(x=>x.classList.remove('on'));
    opt.classList.add('on');
    state.lm=opt.dataset.v;
    if(typeof renderLMInputs==='function')renderLMInputs();
    requestAnimationFrame(()=>setTimeout(()=>{
      const target=state.lm==='none'?document.getElementById('flowNav'):document.querySelector('#lmInputs .metric73')||document.getElementById('lmInputs');
      if(!target)return;
      const top=target.getBoundingClientRect().top+window.scrollY-118;
      window.scrollTo({top:Math.max(0,top),behavior:'smooth'});
    },70));
  },true);

  function golferNow(){return typeof normalizedGolferV69==='function'?normalizedGolferV69():typeof golfer==='function'?golfer():null;}
  function nearMissCopy(row,best){
    const limiter=(row.s.weaknesses||[])[0];
    const gap=best?Math.max(0,best.s.overall-row.s.overall):0;
    if(!limiter)return `${gap.toFixed(1)} points behind the leader; current evidence does not identify one dominant limiter.`;
    return `${gap.toFixed(1)} points behind the leader. Biggest limiter in this fit: ${limiter.label.toLowerCase()} (${limiter.score.toFixed(1)}/100).`;
  }
  function addNearMisses(){
    const grid=document.getElementById('result80Grid');
    if(!grid||document.getElementById('nearMiss86'))return;
    const g=golferNow();if(!g)return;
    const rows=ENG.winners(g);if(rows.length<=5)return;
    const extra=rows.slice(5,8),best=rows[0];
    const section=document.createElement('section');section.id='nearMiss86';section.className='nearMiss86';
    section.innerHTML=`<div class="nearMiss86Head"><span>ALSO CONSIDERED</span><h3>Strong fits that missed the top five.</h3><p>FORM does not hide familiar brands when they rank lower. These are the next-best manufacturer matches using the same Fit Score.</p></div><div class="nearMiss86Grid">${extra.map(r=>`<div><span>${r.p.brand}</span><b>${r.p.model}</b><em>${r.s.overall.toFixed(1)} / 100</em><p>${nearMissCopy(r,best)}</p></div>`).join('')}</div>`;
    grid.insertAdjacentElement('afterend',section);
  }
  const observer=new MutationObserver(()=>{if(document.querySelector('#result80Grid .result70Card'))setTimeout(addNearMisses,120);});
  const results=document.getElementById('results');if(results)observer.observe(results,{childList:true,subtree:true});
  if(document.querySelector('#result80Grid .result70Card'))addNearMisses();

  const style=document.createElement('style');style.textContent=`
  .nearMiss86{margin-top:26px;padding:22px;border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:#fbfbf8}.nearMiss86Head{display:grid;grid-template-columns:minmax(150px,.45fr) minmax(230px,.8fr) minmax(260px,1.2fr);gap:18px;align-items:start}.nearMiss86Head>span{font-size:8px;letter-spacing:.15em;font-weight:900;color:var(--muted)}.nearMiss86Head h3{margin:0;font-size:19px}.nearMiss86Head p{margin:0;color:var(--muted);font-size:10px;line-height:1.55}.nearMiss86Grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin-top:18px;border:1px solid var(--line)}.nearMiss86Grid>div{padding:16px;border-right:1px solid var(--line)}.nearMiss86Grid>div:last-child{border-right:0}.nearMiss86Grid span{display:block;font-size:8px;letter-spacing:.1em;color:var(--muted);font-weight:800}.nearMiss86Grid b{display:block;margin:5px 0;font-size:13px}.nearMiss86Grid em{font-style:normal;font-size:11px;font-weight:800}.nearMiss86Grid p{margin:8px 0 0;font-size:9px;line-height:1.5;color:var(--muted)}@media(max-width:700px){.nearMiss86Head{grid-template-columns:1fr;gap:7px}.nearMiss86Grid{grid-template-columns:1fr}.nearMiss86Grid>div{border-right:0;border-bottom:1px solid var(--line)}.nearMiss86Grid>div:last-child{border-bottom:0}}
  `;document.head.appendChild(style);
  window.FORM_DRIVER_POLISH_V86=true;
  return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>120)clearInterval(t)},50);
})();