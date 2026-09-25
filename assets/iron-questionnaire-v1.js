// FORM Irons v1 — questionnaire candidate (research preview only)
(function(){'use strict';
window.FORM_IRON_V1=window.FORM_IRON_V1||{};
const S=window.FORM_IRON_V1.state=window.FORM_IRON_V1.state||{
 handedness:null,brandMode:null,brands:[],currentIrons:"",currentSetMakeup:null,ability:null,sevenIron:null,
 strike:null,strikeSource:null,strikeConsistency:null,direction:null,trajectory:null,carryConsistency:null,turf:null,priorities:[],launchMonitorDetail:null
};
const brands=["Callaway","Cobra","Mizuno","PING","PXG","TaylorMade","Titleist","Wilson"];
const priorityLabels={dispersion:"Tighter dispersion",forgiveness:"Mishit forgiveness",stopping:"Stopping power",distance:"Distance"};
const strikeZones=[["high_heel","High heel"],["high_center","High center"],["high_toe","High toe"],["mid_heel","Heel"],["mid_center","Center"],["mid_toe","Toe"],["low_heel","Low heel"],["low_center","Low center"],["low_toe","Low toe"]];
function choice(field,items,extra=""){return `<div class="choiceRow ${extra}" data-field="${field}">${items.map(([v,l])=>`<button class="fitChoice" data-v="${v}"><span>${l}</span></button>`).join("")}</div>`;}
function mount(root){
 if(!root)return;
 root.innerHTML=`<section class="ironFit">
 <div class="eyebrow">FORM · IRON FITTING</div>
 <h1>Which way do you play?</h1><p class="lead">Choose your iron handedness.</p>
 ${choice("handedness",[["right","Right-handed"],["left","Left-handed"]])}
 <section id="ironBrandScope" hidden><div class="eyebrow">IRON BRAND SCOPE</div><h2>Which brands should FORM consider?</h2>
 <p class="lead">This applies to your iron fitting only.</p>
 <div class="brandModes"><button class="brandMode" data-v="all"><b>All brands</b><span>Find my best fit across the field</span></button><button class="brandMode" data-v="choose"><b>Choose brands</b><span>Only evaluate brands I’m open to</span></button></div>
 <div id="ironBrandPicker" hidden>${brands.map(b=>`<button data-brand="${b}">${b}</button>`).join("")}</div></section>
 <section id="ironSpecific" hidden><div class="eyebrow">YOUR IRON GAME</div><h2>Tell FORM about the irons you play now</h2>
 <p class="lead">These answers provide fitting context. FORM will not award fit points merely because of your current model, set makeup, or handicap.</p>
 <label>Current irons <input id="ironCurrentIrons" placeholder="e.g. Cobra King Forged Tec"></label>
 <h3>What does your current iron set look like?</h3>${choice("currentSetMakeup",[["traditional","Mostly traditional irons"],["combo","Combo set"],["hybrid_heavy","Hybrids / utility clubs replace longer irons"],["unsure","Not sure"]])}
 <h3>Which best describes your current game?</h3>${choice("ability",[["scratch_5","Scratch–5"],["6_12","6–12"],["13_20","13–20"],["21_plus","21+"],["unknown","I don’t keep a handicap"]])}
 <h2>What do you know about your 7-iron?</h2><p class="lead">Enter what you genuinely know. FORM can fit without launch-monitor numbers.</p>
 <label>Typical 7-iron carry <input id="ironCarry" inputmode="numeric" placeholder="e.g. 150"></label>
 <h3>Where do you tend to strike the face?</h3><p class="lead compact">Tap the area that best represents your typical iron contact.</p>
 <div class="ironFaceWrap" data-field="strike" role="group" aria-label="Iron face strike location">
   <div class="ironFace" aria-hidden="true"><div class="ironGrooves"></div><span class="axis high">HIGH</span><span class="axis low">LOW</span><span class="axis heel">HEEL</span><span class="axis toe">TOE</span></div>
   <div class="strikeTargets">${strikeZones.map(([v,l])=>`<button data-v="${v}" aria-label="${l}" title="${l}"><span>${l}</span></button>`).join("")}</div>
   <div class="strikeMarker" aria-hidden="true"></div>
 </div>
 <p class="strikeReadout" id="ironStrikeReadout">No strike selected</p>
 <h3>How do you know your strike location?</h3>
 ${choice("strikeSource",[["confirmed","Impact tape, spray or visible face marks"],["repeated","I repeatedly see or feel it"],["guess","Mostly feel / ball-flight guess"],["unknown","I’m not sure"]])}
 <p class="note">This tells FORM how much confidence to place in the location you selected. It does not create performance evidence for an iron model.</p>
 <h3>How repeatable is your strike location?</h3>${choice("strikeConsistency",[["consistent","Usually in the same area"],["mixed","Moves around the face"],["unknown","Not sure"]])}
 <h3>Where do you struggle with your irons, if anywhere?</h3><p class="lead compact">Choose the directional pattern that costs you most often.</p>
 ${choice("direction",[["left","Misses left"],["both","Both directions"],["right","Misses right"],["none","No consistent directional miss"]])}
 <h3>How is your typical iron trajectory?</h3>${choice("trajectory",[["too_low","Too low"],["good","About right"],["too_high","Too high"]])}
 <h3>How consistent is your carry distance?</h3>${choice("carryConsistency",[["consistent","Pretty consistent"],["variable","Varies noticeably"],["unknown","Not sure"]])}
 <h3>What kind of divot do you usually take?</h3>${choice("turf",[["shallow","Shallow / little turf"],["medium","Medium"],["deep","Deep"],["mixed","It varies"],["unknown","Not sure"]])}
 <h3>Do you know your iron launch-monitor data?</h3>${choice("launchMonitorDetail",[["range","Yes — I know my typical ranges"],["general","I know my typical tendencies"],["none","No — I don’t know my launch-monitor data"]])}
 <p class="note">Detailed launch-monitor values are not yet used by this research ranking. This uses Driver’s range / tendency / none pattern, but the answer belongs only to this iron fitting.</p>
 <h3>Rank what matters most in your next irons</h3><p class="lead compact">Tap in priority order. Your first choice is #1. Tap a selected item to remove it and re-rank.</p>
 <div class="choiceRow priorityRank" data-field="priorities">${Object.entries(priorityLabels).map(([v,l])=>`<button class="fitChoice" data-v="${v}"><span class="priorityNumber"></span><span>${l}</span></button>`).join("")}</div>
 <button class="primaryAction" id="ironReview">See research results</button></section>
 <section id="ironReviewPanel" hidden><div class="eyebrow">IRON PROFILE</div><h2>Your fitting inputs</h2><pre id="ironSummary"></pre>
 <div id="ironResearchResults"><h2>Model-level research shortlist</h2><p class="note">These are specific iron models, not category recommendations. Ranking remains test-only until FORM’s evidence-readiness gates are satisfied.</p><div id="ironResultCards"></div></div></section>
 </section>`;
 bind(root);
}
function select(group,v,multi=false){if(multi){const i=S.priorities.indexOf(v);i>=0?S.priorities.splice(i,1):S.priorities.push(v)}else S[group]=v;}
function sync(root){
 root.querySelectorAll("[data-field]").forEach(g=>g.querySelectorAll("button[data-v]").forEach(b=>{
  const on=g.classList.contains("priorityRank")?S.priorities.includes(b.dataset.v):S[g.dataset.field]===b.dataset.v;b.classList.toggle("selected",on);
  if(g.classList.contains("priorityRank")){const n=b.querySelector(".priorityNumber"),i=S.priorities.indexOf(b.dataset.v);if(n)n.textContent=i>=0?`#${i+1}`:"";}
 }));
 root.querySelectorAll("#ironBrandScope .brandMode").forEach(b=>b.classList.toggle("selected",S.brandMode===b.dataset.v));
 root.querySelectorAll("#ironBrandPicker [data-brand]").forEach(b=>b.classList.toggle("selected",S.brands.includes(b.dataset.brand)));
 root.querySelector("#ironBrandScope").hidden=!S.handedness;root.querySelector("#ironBrandPicker").hidden=S.brandMode!=="choose";
 root.querySelector("#ironSpecific").hidden=!S.brandMode||(S.brandMode==="choose"&&!S.brands.length);
 const strikeBtn=root.querySelector(`.strikeTargets button[data-v="${S.strike}"]`),marker=root.querySelector(".strikeMarker"),readout=root.querySelector("#ironStrikeReadout");
 if(strikeBtn&&marker){const a=strikeBtn.getBoundingClientRect(),p=strikeBtn.parentElement.getBoundingClientRect();marker.style.left=((a.left-p.left+a.width/2)/p.width*100)+"%";marker.style.top=((a.top-p.top+a.height/2)/p.height*100)+"%";marker.classList.add("on");if(readout)readout.textContent="Selected: "+strikeBtn.getAttribute("aria-label");}
}
function bind(root){
 root.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
  const field=b.closest("[data-field]");if(field){select(field.dataset.field,b.dataset.v,field.classList.contains("priorityRank"));sync(root);return;}
  if(b.classList.contains("brandMode")){S.brandMode=b.dataset.v;if(S.brandMode==="all")S.brands=[];sync(root);return;}
  if(b.dataset.brand){const i=S.brands.indexOf(b.dataset.brand);i>=0?S.brands.splice(i,1):S.brands.push(b.dataset.brand);sync(root);return;}
  if(b.id==="ironReview"){S.currentIrons=root.querySelector("#ironCurrentIrons").value.trim();S.sevenIron=Number(root.querySelector("#ironCarry").value)||null;root.querySelector("#ironSummary").textContent=JSON.stringify(S,null,2);root.querySelector("#ironReviewPanel").hidden=false;renderResearchResults(root);}
 });sync(root);
}
async function renderResearchResults(root){
 const box=root.querySelector("#ironResultCards");box.innerHTML="<p>Calculating…</p>";
 try{const {rankIronsV1}=await import("./iron-engine-v1.mjs");const ranked=rankIronsV1(S).filter(x=>x.confidence>0).slice(0,5);
 box.innerHTML=ranked.map((x,i)=>`<article class="resultCard"><div class="resultHead"><span class="rank">#${i+1}</span><div><b>${x.model}</b><span class="categorySupport">${String(x.category||"").replaceAll("_"," ")} · supporting classification</span></div></div><div class="resultMeta"><span>Research fit ${x.score.toFixed(1)}</span><span>Evidence ${Math.round(x.confidence*100)}%</span></div></article>`).join("")||"<p>No eligible specific models in the current research matrix.</p>";
 }catch(e){box.innerHTML="<p>Research results unavailable. No production recommendation was made.</p>";}
}
window.FORM_IRON_V1.mount=mount;
})();