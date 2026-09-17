// FORM Irons v1 — questionnaire candidate (research preview only)
(function(){'use strict';
window.FORM_IRON_V1=window.FORM_IRON_V1||{};
const S=window.FORM_IRON_V1.state=window.FORM_IRON_V1.state||{
 handedness:null,brandMode:null,brands:[],currentIrons:"",ability:null,sevenIron:null,
 strike:null,strikeConsistency:null,direction:null,trajectory:null,carryConsistency:null,turf:null,priorities:[]
};
const brands=["Callaway","Cobra","Mizuno","PING","PXG","TaylorMade","Titleist","Wilson"];
function mount(root){
 if(!root)return;
 root.innerHTML=`<section class="ironFit">
 <div class="eyebrow">FORM · IRON FITTING</div>
 <h1>Which way do you play?</h1><p class="lead">Choose your iron handedness.</p>
 <div class="choiceRow" data-field="handedness"><button data-v="right">Right-handed</button><button data-v="left">Left-handed</button></div>
 <section id="ironBrandScope" hidden><div class="eyebrow">IRON BRAND SCOPE</div><h2>Which brands should FORM consider?</h2>
 <p class="lead">This applies to your iron fitting only.</p>
 <div class="brandModes"><button class="brandMode" data-v="all"><b>All brands</b><span>Find my best fit across the field</span></button><button class="brandMode" data-v="choose"><b>Choose brands</b><span>Only evaluate brands I’m open to</span></button></div>
 <div id="ironBrandPicker" hidden>${brands.map(b=>`<button data-brand="${b}">${b}</button>`).join("")}</div></section>
 <section id="ironSpecific" hidden><div class="eyebrow">YOUR IRON GAME</div><h2>What do you know about your 7-iron?</h2>
 <p class="lead">Enter what you genuinely know. FORM can fit without launch-monitor numbers.</p>
 <label>Typical 7-iron carry <input id="ironCarry" inputmode="numeric" placeholder="e.g. 150"></label>
 <h3>Where do you tend to strike your irons?</h3>
 <div class="faceGrid" data-field="strike">
  <button data-v="high_heel">High heel</button><button data-v="high_center">High center</button><button data-v="high_toe">High toe</button>
  <button data-v="mid_heel">Heel</button><button data-v="mid_center">Center</button><button data-v="mid_toe">Toe</button>
  <button data-v="low_heel">Low heel</button><button data-v="low_center">Low center</button><button data-v="low_toe">Low toe</button>
 </div><p class="note">High-face location is captured for fit context. FORM will not invent model-specific high-face performance where comparable evidence is unavailable.</p>
 <h3>What is your common directional miss?</h3><div class="choiceRow" data-field="direction"><button data-v="left">Left</button><button data-v="both">Both</button><button data-v="right">Right</button><button data-v="none">No consistent miss</button></div>
 <h3>How is your typical iron trajectory?</h3><div class="choiceRow" data-field="trajectory"><button data-v="too_low">Too low</button><button data-v="good">About right</button><button data-v="too_high">Too high</button></div>
 <h3>What matters most?</h3><div class="choiceRow multi" data-field="priorities"><button data-v="dispersion">Tighter dispersion</button><button data-v="forgiveness">Mishit forgiveness</button><button data-v="stopping">Stopping power</button><button data-v="distance">Distance</button></div>
 <button id="ironReview">See research results</button></section>
 <section id="ironReviewPanel" hidden><div class="eyebrow">IRON PROFILE</div><h2>Your fitting inputs</h2><pre id="ironSummary"></pre>
 <div id="ironResearchResults"><h2>Research shortlist</h2><p class="note">Test-only ranking. Evidence confidence is shown separately from fit; this is not yet a production recommendation.</p><div id="ironResultCards"></div></div></section>
 </section>`;
 bind(root);
}
function select(group,v,multi=false){if(multi){const i=S.priorities.indexOf(v);i>=0?S.priorities.splice(i,1):S.priorities.push(v)}else S[group]=v;}
function sync(root){
 root.querySelectorAll("[data-field]").forEach(g=>g.querySelectorAll("button").forEach(b=>b.classList.toggle("selected",g.classList.contains("multi")?S.priorities.includes(b.dataset.v):S[g.dataset.field]===b.dataset.v)));
 root.querySelectorAll("#ironBrandScope .brandMode").forEach(b=>b.classList.toggle("selected",S.brandMode===b.dataset.v));
 root.querySelectorAll("#ironBrandPicker [data-brand]").forEach(b=>b.classList.toggle("selected",S.brands.includes(b.dataset.brand)));
 root.querySelector("#ironBrandScope").hidden=!S.handedness;
 root.querySelector("#ironBrandPicker").hidden=S.brandMode!=="choose";
 root.querySelector("#ironSpecific").hidden=!S.brandMode||(S.brandMode==="choose"&&!S.brands.length);
}
function bind(root){
 root.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
  const field=b.closest("[data-field]"); if(field){select(field.dataset.field,b.dataset.v,field.classList.contains("multi"));sync(root);return;}
  if(b.classList.contains("brandMode")){S.brandMode=b.dataset.v;if(S.brandMode==="all")S.brands=[];sync(root);return;}
  if(b.dataset.brand){const i=S.brands.indexOf(b.dataset.brand);i>=0?S.brands.splice(i,1):S.brands.push(b.dataset.brand);sync(root);return;}
  if(b.id==="ironReview"){S.sevenIron=Number(root.querySelector("#ironCarry").value)||null;root.querySelector("#ironSummary").textContent=JSON.stringify(S,null,2);root.querySelector("#ironReviewPanel").hidden=false;renderResearchResults(root);}
 });
 sync(root);
}
async function renderResearchResults(root){
 const box=root.querySelector("#ironResultCards"); box.innerHTML="<p>Calculating…</p>";
 try{
  const {rankIronsV1}=await import("./iron-engine-v1.mjs");
  const ranked=rankIronsV1(S).filter(x=>x.confidence>0).slice(0,5);
  box.innerHTML=ranked.map((x,i)=>`<article class="resultCard"><div><span class="rank">#${i+1}</span><b>${x.model}</b></div><div class="resultMeta"><span>Fit ${x.score.toFixed(1)}</span><span>Evidence ${Math.round(x.confidence*100)}%</span></div></article>`).join("")||"<p>No eligible models in the current research matrix.</p>";
 }catch(e){box.innerHTML="<p>Research results unavailable. No production recommendation was made.</p>";}
}
window.FORM_IRON_V1.mount=mount;
})();