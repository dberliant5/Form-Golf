// FORM strike-face selector v231 — UX-only capture, no scoring changes
(function(){
  'use strict';

  const STYLE_ID='form-strike-face-v231-style';

  function injectStyles(){
    if(document.getElementById(STYLE_ID)) return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
#step4 .formStrikeFaceWrap{margin-top:30px}
#step4 .formStrikeHeader{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;margin-bottom:14px}
#step4 .formStrikeHeader h3{margin:0;font-size:18px;line-height:1.2}
#step4 .formStrikeHeader p{margin:4px 0 0;font-size:11px;line-height:1.5;color:var(--muted);max-width:620px}
#step4 .formStrikeStatus{font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);white-space:nowrap}
#step4 .formStrikeStatus b{display:block;margin-top:4px;font-size:13px;letter-spacing:0;text-transform:none;color:var(--deep)}
#step4 .formStrikeSurface{position:relative;max-width:760px;aspect-ratio:2.28/1;margin:0 auto 18px;cursor:crosshair;touch-action:manipulation;user-select:none;-webkit-user-select:none;filter:drop-shadow(0 16px 24px rgba(29,45,38,.14))}
#step4 .formStrikeSurface svg{width:100%;height:100%;display:block}
#step4 .formStrikeGrid line{stroke:rgba(255,255,255,.30);stroke-width:1.15;stroke-dasharray:4 5}
#step4 .formStrikeTexture line{stroke:rgba(255,255,255,.22);stroke-width:1}
#step4 .formStrikeMarker{position:absolute;width:52px;height:52px;margin:-26px 0 0 -26px;border-radius:50%;pointer-events:none;transform:scale(.78);opacity:0;transition:left .18s ease,top .18s ease,transform .18s ease,opacity .18s ease;background:radial-gradient(circle at center,#fff 0 6%,#2f80ed 8% 22%,rgba(47,128,237,.72) 23% 43%,rgba(47,128,237,.30) 44% 70%,rgba(47,128,237,0) 71%);box-shadow:0 0 0 1px rgba(255,255,255,.28)}
#step4 .formStrikeMarker.on{opacity:1;transform:scale(1)}
#step4 .formStrikeAxis{position:absolute;font-size:9px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.88);pointer-events:none;text-shadow:0 1px 2px rgba(0,0,0,.35)}
#step4 .formStrikeAxis.high{left:50%;top:7%;transform:translateX(-50%)}
#step4 .formStrikeAxis.low{left:50%;bottom:7%;transform:translateX(-50%)}
#step4 .formStrikeAxis.heel{left:4%;top:50%;transform:translateY(-50%)}
#step4 .formStrikeAxis.toe{right:4%;top:50%;transform:translateY(-50%)}
#step4 .formStrikeConsistency{margin-top:14px}
#step4 .formStrikeConsistencyLabel{font-size:11px;font-weight:700;margin-bottom:10px}
#step4 .formStrikeConsistencyGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
#step4 .formStrikeChoice{min-height:92px;border:1px solid var(--line);background:#fff;padding:14px 12px;text-align:left;color:var(--deep);transition:border-color .15s ease,background .15s ease,box-shadow .15s ease}
#step4 .formStrikeChoice:hover{border-color:#9daaa0;background:#fafbf9}
#step4 .formStrikeChoice.on{border-color:var(--form-green,#315d48);background:var(--form-sage,#eef3ee);box-shadow:inset 0 0 0 1px var(--form-green,#315d48)}
#step4 .formStrikeChoice b{display:block;font-size:12px;margin-bottom:5px}
#step4 .formStrikeChoice span{display:block;font-size:10px;line-height:1.45;color:var(--muted)}
#step4 .formStrikeHint{margin-top:12px;padding:12px 14px;background:#f7f8f5;border:1px solid var(--line);font-size:10px;line-height:1.55;color:var(--muted)}
#step4 .formStrikeHint b{color:var(--deep)}
@media(max-width:700px){
  #step4 .formStrikeHeader{display:block}
  #step4 .formStrikeStatus{margin-top:10px}
  #step4 .formStrikeSurface{max-width:none;aspect-ratio:2.05/1}
  #step4 .formStrikeConsistencyGrid{grid-template-columns:1fr 1fr}
  #step4 .formStrikeChoice{min-height:84px}
  #step4 .formStrikeMarker{width:46px;height:46px;margin:-23px 0 0 -23px}
}
`;
    document.head.appendChild(s);
  }

  function cap(v){return v.charAt(0).toUpperCase()+v.slice(1)}
  function zoneLabel(vertical,horizontal){
    if(horizontal==='center' && vertical==='middle') return 'Center';
    return cap(vertical==='middle'?'mid':vertical)+' '+horizontal;
  }
  function defaultPointForStrike(strike){
    return strike==='toe'?{x:.79,y:.5}:strike==='heel'?{x:.21,y:.5}:strike==='center'?{x:.5,y:.5}:{x:.5,y:.5};
  }
  function zoneFromPoint(x,y){
    const horizontal=x<1/3?'heel':x>2/3?'toe':'center';
    const vertical=y<1/3?'high':y>2/3?'low':'middle';
    return {horizontal,vertical};
  }
  function ensureState(){
    if(typeof state==='undefined') return false;
    const p=defaultPointForStrike(state.strike);
    if(!Number.isFinite(state.strikeX)) state.strikeX=p.x;
    if(!Number.isFinite(state.strikeY)) state.strikeY=p.y;
    if(!state.strikeVertical) state.strikeVertical='middle';
    if(!state.strikeConsistency) state.strikeConsistency=state.strike==='varied'?'all_over':state.strike==='unknown'?'unknown':'tends';
    return true;
  }
  function persistProfile(){
    try{
      localStorage.setItem('formStrikeProfile_v1',JSON.stringify({
        horizontal:state.strike,
        vertical:state.strikeVertical,
        consistency:state.strikeConsistency,
        x:state.strikeX,
        y:state.strikeY,
        savedAt:new Date().toISOString()
      }));
    }catch(e){}
  }
  function setChoiceUI(host){
    host.querySelectorAll('[data-strike-consistency]').forEach(btn=>btn.classList.toggle('on',btn.dataset.strikeConsistency===state.strikeConsistency));
  }
  function setMarkerUI(host){
    const marker=host.querySelector('.formStrikeMarker');
    const label=host.querySelector('[data-strike-label]');
    if(!marker||!label) return;
    const specific=!['varied','unknown'].includes(state.strike);
    marker.classList.toggle('on',specific);
    if(specific){
      marker.style.left=(state.strikeX*100)+'%';
      marker.style.top=(state.strikeY*100)+'%';
      label.textContent=zoneLabel(state.strikeVertical,state.strike);
    }else{
      label.textContent=state.strike==='varied'?'All over the face':'Not sure';
    }
  }
  function canonicalStrike(value){
    const btn=document.querySelector('#step4 [data-group="strike"] .opt[data-v="'+value+'"]');
    if(btn){btn.click();return true;}
    state.strike=value;
    return false;
  }
  function syncLegacyButtons(){
    const old=document.querySelector('#step4 [data-group="strike"]');
    if(!old) return;
    old.querySelectorAll('.opt').forEach(x=>x.classList.toggle('on',x.dataset.v===state.strike));
  }
  function choosePoint(host,x,y){
    x=Math.max(.04,Math.min(.96,x));
    y=Math.max(.08,Math.min(.92,y));
    const z=zoneFromPoint(x,y);
    canonicalStrike(z.horizontal);
    state.strikeVertical=z.vertical;
    state.strikeX=x;
    state.strikeY=y;
    if(['all_over','unknown'].includes(state.strikeConsistency)) state.strikeConsistency='tends';
    syncLegacyButtons();
    setChoiceUI(host);
    setMarkerUI(host);
    persistProfile();
  }
  function mount(){
    if(!ensureState()) return;
    const step4=document.getElementById('step4');
    if(!step4 || step4.querySelector('.formStrikeFaceWrap')) return;
    const legacy=step4.querySelector('[data-group="strike"]');
    if(!legacy) return;
    const intro=legacy.previousElementSibling;
    if(intro && intro.tagName==='P') intro.style.display='none';
    legacy.style.display='none';

    const host=document.createElement('div');
    host.className='formStrikeFaceWrap';
    host.innerHTML=`
      <div class="formStrikeHeader">
        <div>
          <h3>Where do you tend to strike the face?</h3>
          <p>Tap the area that best represents your typical contact. FORM records the full location while today's scoring still uses only heel / center / toe.</p>
        </div>
        <div class="formStrikeStatus">Selected strike<b data-strike-label>—</b></div>
      </div>
      <div class="formStrikeSurface" role="application" aria-label="Driver face. Tap your typical strike location." tabindex="0">
        <svg viewBox="0 0 820 360" aria-hidden="true">
          <defs>
            <linearGradient id="faceGrad231" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#4b5053"/>
              <stop offset=".45" stop-color="#20272a"/>
              <stop offset="1" stop-color="#111719"/>
            </linearGradient>
            <linearGradient id="rimGrad231" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#31393c"/>
              <stop offset=".55" stop-color="#101517"/>
              <stop offset="1" stop-color="#050708"/>
            </linearGradient>
            <clipPath id="faceClip231"><path d="M82 70 Q120 33 218 26 L545 22 Q662 25 742 78 Q787 108 772 196 Q760 275 688 309 Q626 337 493 341 L225 337 Q118 331 74 275 Q38 228 42 157 Q47 104 82 70Z"/></clipPath>
          </defs>
          <path d="M74 60 Q117 18 219 13 L548 10 Q672 13 754 69 Q807 105 790 202 Q777 289 699 326 Q632 358 493 360 L219 355 Q105 348 57 287 Q18 237 23 154 Q28 94 74 60Z" fill="url(#rimGrad231)"/>
          <path d="M82 70 Q120 33 218 26 L545 22 Q662 25 742 78 Q787 108 772 196 Q760 275 688 309 Q626 337 493 341 L225 337 Q118 331 74 275 Q38 228 42 157 Q47 104 82 70Z" fill="url(#faceGrad231)" stroke="#5b6265" stroke-width="2"/>
          <g clip-path="url(#faceClip231)" class="formStrikeTexture">
            <line x1="110" y1="105" x2="705" y2="105"/><line x1="92" y1="130" x2="728" y2="130"/>
            <line x1="83" y1="155" x2="742" y2="155"/><line x1="78" y1="180" x2="747" y2="180"/>
            <line x1="80" y1="205" x2="739" y2="205"/><line x1="89" y1="230" x2="721" y2="230"/>
            <line x1="105" y1="255" x2="694" y2="255"/><line x1="132" y1="280" x2="653" y2="280"/>
            <g class="formStrikeGrid">
              <line x1="303" y1="34" x2="303" y2="333"/><line x1="538" y1="29" x2="538" y2="335"/>
              <line x1="58" y1="128" x2="768" y2="128"/><line x1="51" y1="238" x2="744" y2="238"/>
            </g>
            <circle cx="420" cy="183" r="28" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="2"/>
            <line x1="420" y1="148" x2="420" y2="218" stroke="rgba(255,255,255,.22)"/><line x1="385" y1="183" x2="455" y2="183" stroke="rgba(255,255,255,.22)"/>
          </g>
        </svg>
        <span class="formStrikeAxis high">High</span><span class="formStrikeAxis low">Low</span>
        <span class="formStrikeAxis heel">Heel</span><span class="formStrikeAxis toe">Toe</span>
        <span class="formStrikeMarker"></span>
      </div>
      <div class="formStrikeConsistency">
        <div class="formStrikeConsistencyLabel">How consistent is this strike pattern?</div>
        <div class="formStrikeConsistencyGrid">
          <button type="button" class="formStrikeChoice" data-strike-consistency="mostly"><b>Mostly here</b><span>I usually find this part of the face.</span></button>
          <button type="button" class="formStrikeChoice" data-strike-consistency="tends"><b>Tends toward here</b><span>It varies, but this is my common pattern.</span></button>
          <button type="button" class="formStrikeChoice" data-strike-consistency="all_over"><b>All over the face</b><span>My contact is fairly scattered.</span></button>
          <button type="button" class="formStrikeChoice" data-strike-consistency="unknown"><b>Not sure</b><span>I don't know where I usually strike it.</span></button>
        </div>
      </div>
      <div class="formStrikeHint"><b>Why this matters:</b> strike height can change launch, spin and retention. FORM is capturing it now, but vertical strike will not affect rankings until comparable evidence supports it across the driver field.</div>
    `;
    legacy.insertAdjacentElement('afterend',host);

    const surface=host.querySelector('.formStrikeSurface');
    surface.addEventListener('pointerup',e=>{
      const r=surface.getBoundingClientRect();
      choosePoint(host,(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height);
    });
    surface.addEventListener('keydown',e=>{
      if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',' '].includes(e.key)) return;
      e.preventDefault();
      let x=state.strikeX,y=state.strikeY;
      if(e.key==='ArrowLeft')x-=.08;if(e.key==='ArrowRight')x+=.08;if(e.key==='ArrowUp')y-=.08;if(e.key==='ArrowDown')y+=.08;
      choosePoint(host,x,y);
    });
    host.querySelectorAll('[data-strike-consistency]').forEach(btn=>btn.onclick=()=>{
      state.strikeConsistency=btn.dataset.strikeConsistency;
      if(state.strikeConsistency==='all_over'){
        canonicalStrike('varied');state.strikeVertical='varied';
      }else if(state.strikeConsistency==='unknown'){
        canonicalStrike('unknown');state.strikeVertical='unknown';
      }else if(['varied','unknown'].includes(state.strike)){
        const p=defaultPointForStrike('center');canonicalStrike('center');state.strikeVertical='middle';state.strikeX=p.x;state.strikeY=p.y;
      }
      syncLegacyButtons();setChoiceUI(host);setMarkerUI(host);persistProfile();
    });
    setChoiceUI(host);setMarkerUI(host);
  }

  injectStyles();

  if(typeof golfer==='function'){
    const priorGolfer=golfer;
    golfer=function(){
      const g=priorGolfer();
      g.strikeVertical=state.strikeVertical||'middle';
      g.strikeConsistency=state.strikeConsistency||'tends';
      g.strikePoint={x:state.strikeX,y:state.strikeY};
      return g;
    };
  }

  if(typeof renderReview==='function'){
    const priorReview=renderReview;
    renderReview=function(){
      const out=priorReview();
      const box=document.getElementById('reviewStrike');
      if(box){
        const rows=box.querySelectorAll('.reviewRow');
        rows.forEach(row=>{
          const label=row.querySelector('span');
          if(label&&label.textContent.trim()==='Strike'){
            const value=row.querySelector('b');
            if(value){
              const quality=value.querySelector('.quality');
              const specific=!['varied','unknown'].includes(state.strike);
              value.childNodes[0].nodeValue=(specific?zoneLabel(state.strikeVertical,state.strike):state.strike==='varied'?'All over the face':'Unknown')+' ';
              if(quality) quality.textContent=state.strikeConsistency==='mostly'?'Typical':state.strikeConsistency==='tends'?'Tendency':'Observed';
            }
          }
        });
      }
      return out;
    };
  }

  if(typeof renderStep==='function'){
    const priorRenderStep=renderStep;
    renderStep=function(){
      const out=priorRenderStep();
      if(typeof step!=='undefined'&&step===4) requestAnimationFrame(mount);
      return out;
    };
  }

  if(document.getElementById('step4')&&!document.getElementById('step4').classList.contains('hidden')) mount();
})();
