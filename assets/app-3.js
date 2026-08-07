// FORM 5.9 confirmed/collapsible brand scope
let formBrandScopeConfirmed=false;

function brandScopeIsValid(){
  if(formBrandScope.mode==='all') return true;
  if(formBrandScope.mode==='single') return formBrandScope.brands.length===1;
  return formBrandScope.brands.length>0;
}

function brandScopeSummaryLabel(){
  const names=formBrandScope.brands||[];
  if(formBrandScope.mode==='all') return 'All brands';
  if(formBrandScope.mode==='single') return names[0] ? `${names[0]} only` : 'Choose one brand';
  if(formBrandScope.mode==='include') return names.length ? `Only ${names.join(', ')}` : 'Choose included brands';
  if(formBrandScope.mode==='exclude') return names.length ? `Excluding ${names.join(', ')}` : 'Choose excluded brands';
  return 'All brands';
}

function confirmBrandScope(){
  if(!brandScopeIsValid()){
    const wrap=document.getElementById('brandPickerWrap');
    wrap?.classList.add('needsAnswer');
    setTimeout(()=>wrap?.classList.remove('needsAnswer'),900);
    return;
  }
  formBrandScopeConfirmed=true;
  saveBrandScope();
  document.getElementById('brandScopePanel')?.classList.add('hidden');
  const summary=document.getElementById('brandScopeSummary');
  summary?.classList.remove('hidden');
  const text=document.getElementById('brandScopeSummaryText');
  if(text) text.textContent=brandScopeSummaryLabel();
}

function editBrandScope(){
  formBrandScopeConfirmed=false;
  document.getElementById('brandScopeSummary')?.classList.add('hidden');
  document.getElementById('brandScopePanel')?.classList.remove('hidden');
  renderBrandScope();
}

const _renderBrandScopeV59=renderBrandScope;
renderBrandScope=function(){
  _renderBrandScopeV59();
  const confirm=document.querySelector('.brandScopeConfirm');
  if(confirm) confirm.disabled=!brandScopeIsValid();
  const text=document.getElementById('brandScopeSummaryText');
  if(text) text.textContent=brandScopeSummaryLabel();
};

const _setBrandModeV59=setBrandMode;
setBrandMode=function(mode){
  formBrandScopeConfirmed=false;
  _setBrandModeV59(mode);
  renderBrandScope();
};

const _toggleFitBrandV59=toggleFitBrand;
toggleFitBrand=function(brand){
  formBrandScopeConfirmed=false;
  _toggleFitBrandV59(brand);
  renderBrandScope();
};


const _saveBrandScopeV59=saveBrandScope;
saveBrandScope=function(){
  _saveBrandScopeV59();
  localStorage.setItem('formBrandScopeConfirmed',String(formBrandScopeConfirmed));
};


// ===========================
// FORM 6.0 FLEXIBLE BAG BUILDER
// ===========================
const FORM_CATALOG_META={
  version:'2026.08-prototype',
  lastVerified:'August 2026',
  sourceMode:'curated snapshot',
  productionPlan:'manufacturer feeds + scheduled verification'
};

const formBagTypeOptions=[
  ['driver','Driver'],
  ['fairway','Fairway Wood'],
  ['hybrid','Hybrid'],
  ['utility','Utility / Driving Iron'],
  ['irons','Iron Set'],
  ['wedge','Wedge'],
  ['putter','Putter'],
  ['ball','Golf Ball']
];

function normalizeBagCategory(type){
  return ({
    driver:'driver',
    fairway:'fairway',
    hybrid:'hybrid',
    utility:'irons',
    irons:'irons',
    wedge:'wedges',
    putter:'putters',
    ball:'balls'
  })[type]||type;
}

function emptyBagItem(type=''){
  return {
    id:'club_'+Date.now()+'_'+Math.random().toString(36).slice(2,8),
    type,
    brand:'',
    model:'',
    customModel:'',
    loft:'',
    notes:''
  };
}

function migrateFlexibleBag(){
  const d=profileData();
  if(Array.isArray(d.bagItems))return d;
  const old=d.bag||{};
  const items=[];
  const oldMap=[
    ['driver','driver'],['fairway','fairway'],['hybrid','hybrid'],
    ['irons','irons'],['wedges','wedge'],['putters','putter'],['balls','ball']
  ];
  oldMap.forEach(([oldKey,type])=>{
    const x=old[oldKey];
    if(x?.brand||x?.model){
      items.push({...emptyBagItem(type),brand:x.brand||'',model:x.model||''});
    }
  });
  d.bagItems=items;
  formSave(d);
  return d;
}

function flexibleBagData(){
  return migrateFlexibleBag();
}

function flexibleBagBrands(type){
  const cat=normalizeBagCategory(type);
  if(cat==='driver')return Object.keys(driverDB||{}).sort();
  return Object.keys(historicalEquipmentDB?.[cat]||{}).sort();
}

function flexibleBagModels(type,brand){
  const cat=normalizeBagCategory(type);
  if(!brand)return[];
  if(cat==='driver')return Object.keys(driverDB?.[brand]||{}).sort((a,b)=>b.localeCompare(a,undefined,{numeric:true}));
  return [...(historicalEquipmentDB?.[cat]?.[brand]||[])].sort((a,b)=>b.localeCompare(a,undefined,{numeric:true}));
}

function addBagClub(type=''){
  const d=flexibleBagData();
  d.bagItems.push(emptyBagItem(type));
  formSave(d);
  renderProfilePage();
  setTimeout(()=>{
    document.querySelector('.bagFlexRow:last-child')?.scrollIntoView({behavior:'smooth',block:'center'});
  },0);
}

function removeBagClub(id){
  const d=flexibleBagData();
  d.bagItems=d.bagItems.filter(x=>x.id!==id);
  formSave(d);
  renderProfilePage();
}

function updateBagClub(id,key,value){
  const d=flexibleBagData();
  const item=d.bagItems.find(x=>x.id===id);
  if(!item)return;
  item[key]=value;
  if(key==='type'){item.brand='';item.model='';item.customModel='';}
  if(key==='brand'){item.model='';item.customModel='';}
  if(key==='model'&&value!=='__custom__')item.customModel='';
  formSave(d);
  renderProfilePage();
}

function bagDisplayModel(item){
  if(item.model==='__custom__')return item.customModel||'Custom / not listed';
  return item.model||'';
}

function bagTypeLabel(type){
  return Object.fromEntries(formBagTypeOptions)[type]||'Club';
}

function catalogCoverageMessage(){
  return `Catalog snapshot ${FORM_CATALOG_META.version} · last verified ${FORM_CATALOG_META.lastVerified}. Production will use ${FORM_CATALOG_META.productionPlan}.`;
}

function renderFlexibleBagEditor(){
  const page=document.getElementById('page-profile');
  const card=page?.querySelector('.bagCard');
  if(!card)return;

  card.querySelectorAll('.bagEditor,.bagFlexEditor').forEach(x=>x.remove());

  const d=flexibleBagData(),items=d.bagItems||[];
  const rows=items.map(item=>{
    const brands=flexibleBagBrands(item.type);
    const models=flexibleBagModels(item.type,item.brand);
    const custom=item.model==='__custom__';
    return `<div class="bagFlexRow" data-bag-id="${item.id}">
      <div class="bagFlexType">
        <label>Club type</label>
        <select onchange="updateBagClub('${item.id}','type',this.value)">
          <option value="">Choose type</option>
          ${formBagTypeOptions.map(([v,l])=>`<option value="${v}" ${item.type===v?'selected':''}>${l}</option>`).join('')}
        </select>
      </div>
      <div>
        <label>Brand</label>
        <select ${!item.type?'disabled':''} onchange="updateBagClub('${item.id}','brand',this.value)">
          <option value="">Select / unknown</option>
          ${brands.map(b=>`<option ${item.brand===b?'selected':''}>${b}</option>`).join('')}
          <option value="Other / not listed" ${item.brand==='Other / not listed'?'selected':''}>Other / not listed</option>
        </select>
      </div>
      <div>
        <label>Model</label>
        <select ${!item.brand?'disabled':''} onchange="updateBagClub('${item.id}','model',this.value)">
          <option value="">Select / unknown</option>
          ${models.map(m=>`<option value="${m}" ${item.model===m?'selected':''}>${m}</option>`).join('')}
          <option value="__custom__" ${custom?'selected':''}>Model not listed</option>
        </select>
      </div>
      ${custom?`<div class="bagFlexCustom"><label>Enter model</label><input type="text" maxlength="80" value="${(item.customModel||'').replace(/"/g,'&quot;')}" onblur="updateBagClub('${item.id}','customModel',this.value)" placeholder="Brand and model"></div>`:''}
      <div class="bagFlexOptional">
        <label>Loft / identifier</label>
        <input type="text" maxlength="20" value="${(item.loft||'').replace(/"/g,'&quot;')}" onblur="updateBagClub('${item.id}','loft',this.value)" placeholder="e.g. 18°, 4H, 56.10S">
      </div>
      <button class="bagRemoveBtn" type="button" onclick="removeBagClub('${item.id}')" aria-label="Remove ${bagTypeLabel(item.type)}">Remove</button>
    </div>`;
  }).join('');

  card.insertAdjacentHTML('beforeend',`
    <div class="bagFlexEditor">
      <div class="bagFlexHead">
        <div>
          <div class="eyebrow">My equipment</div>
          <h3>Identify your current bag</h3>
          <p>Add every club you carry. Multiple fairways, hybrids, utility irons, wedges and putters are supported.</p>
        </div>
        <button type="button" class="bagAddBtn" onclick="addBagClub()">+ Add a club</button>
      </div>

      <div class="catalogStatus">
        <b>Equipment catalog</b>
        <span>${catalogCoverageMessage()}</span>
      </div>

      <div class="bagFlexRows">
        ${rows||`<div class="bagEmptyState"><b>Your bag is empty.</b><span>Add your driver first or build the bag in any order.</span><button type="button" onclick="addBagClub('driver')">Add driver</button></div>`}
      </div>

      ${items.length?`<button type="button" class="bagAddAnother" onclick="addBagClub()">+ Add another club</button>`:''}

      <div class="catalogFallback">
        <b>Can’t find a product?</b>
        <span>Choose “Model not listed” and enter it manually. FORM should never block a golfer because the catalog is behind.</span>
      </div>
    </div>
  `);
}

const _renderProfileV60=renderProfilePage;
renderProfilePage=function(){
  _renderProfileV60();
  renderFlexibleBagEditor();
};

// Replace bag-intelligence rendering so multiple entries receive separate cards.
const _renderBagIntelV60=renderBagIntel;
renderBagIntel=function(){
  const page=document.getElementById('page-profile');
  if(!page)return;
  page.querySelector('.bagIntel')?.remove();
  const d=flexibleBagData(),profile=d.profile||{},fits=d.fits||{};
  const items=(d.bagItems||[]).filter(x=>x.type&&(x.model||x.customModel));
  const card=page.querySelector('.bagCard');
  if(!card||!items.length)return;
  const rows=items.map(item=>{
    const cat=normalizeBagCategory(item.type);
    const model=bagDisplayModel(item);
    const verified=item.model!=='__custom__' && item.brand!=='Other / not listed';
    let score=null;
    if(verified){try{score=bagFitScore(cat,{brand:item.brand,model},profile,fits)}catch(e){}}
    const grade=score?fitLetter(score):'—';
    let traits={pills:[],source:verified?'Catalog entry':'Unverified manual entry'};
    try{if(verified)traits=attributePills(cat,{brand:item.brand,model})}catch(e){}
    return `<div class="bagGradeCard">
      <div class="bagGradeTop">
        <small>${bagTypeLabel(item.type)}</small>
        <div><h3>${item.brand?item.brand+' ':''}${model}${item.loft?' · '+item.loft:''}</h3><div class="dataConfidence">${traits.source||'Catalog entry'}</div></div>
        <div class="bagGradeCircle">${grade}</div>
      </div>
      ${traits.pills?.length?`<div class="bagTraitRow">${traits.pills.map(x=>`<span class="bagTrait">${x}</span>`).join('')}</div>`:''}
      ${score?`<div class="bagGradeWhy">Modeled fit score: <b>${score}/100</b>. FORM compares the verified product profile with your saved golfer profile and completed fittings.</div>`:`<div class="bagGradeWhy">Saved to your bag. FORM will not assign a fit grade until this product is verified in the equipment catalog.</div>`}
    </div>`;
  }).join('');
  card.insertAdjacentHTML('afterend',`<div class="bagIntel"><div class="sectionHead"><div><div class="eyebrow">Bag intelligence</div><h2>What deserves attention?</h2></div><p>Each club is evaluated separately, including duplicate club types.</p></div>${rows}</div>`);
};

setTimeout(()=>{if(document.getElementById('page-profile')?.classList.contains('active'))renderProfilePage()},0);


// ===========================
// FORM 6.1 OPENING QUESTIONS + CONFIDENCE-ADJUSTED RESULTS
// ===========================

// Remove radio-style indicators from all existing fitting choice handlers.
// Handedness becomes the first opening question; brand scope becomes the second.
function showOpeningHandedness(){
  document.getElementById('handedQuestion')?.classList.remove('hidden');
  document.getElementById('handedSummary')?.classList.add('hidden');
  document.getElementById('brandQuestion')?.classList.add('hidden');
  document.getElementById('brandOpeningSummary')?.classList.add('hidden');
}
function showOpeningBrandScope(){
  document.getElementById('handedQuestion')?.classList.add('hidden');
  document.getElementById('handedSummary')?.classList.remove('hidden');
  const hs=document.getElementById('handedSummaryText');
  if(hs)hs.textContent=state.handed==='left'?'Left-handed':'Right-handed';
  document.getElementById('brandQuestion')?.classList.remove('hidden');
  document.getElementById('brandOpeningSummary')?.classList.add('hidden');
  document.getElementById('brandScopePanel')?.classList.remove('hidden');
  document.getElementById('brandScopeSummary')?.classList.add('hidden');
  renderBrandScope();
}
function editOpeningHandedness(){
  formBrandScopeConfirmed=false;
  showOpeningHandedness();
}
function editOpeningBrandScope(){
  formBrandScopeConfirmed=false;
  showOpeningBrandScope();
}

// Rebind handedness cards so selection advances to the brand question without
// allowing the generic flow to ask handedness again.
document.querySelectorAll('[data-group="handed"] .opt').forEach(btn=>{
  btn.onclick=()=>{
    const group=btn.closest('[data-group]');
    group.querySelectorAll('.opt').forEach(x=>x.classList.remove('on'));
    btn.classList.add('on');
    state.handed=btn.dataset.v;
    updateDerived();
    setTimeout(showOpeningBrandScope,140);
  };
});

// Override confirmation: collapse brand question and continue into ball flight.
const _confirmBrandScopeV61=confirmBrandScope;
confirmBrandScope=function(){
  if(!brandScopeIsValid()){
    const wrap=document.getElementById('brandPickerWrap');
    wrap?.classList.add('needsAnswer');
    setTimeout(()=>wrap?.classList.remove('needsAnswer'),900);
    return;
  }
  formBrandScopeConfirmed=true;
  saveBrandScope();
  const summaryText=brandScopeSummaryLabel();
  const openingText=document.getElementById('brandOpeningSummaryText');
  if(openingText)openingText.textContent=summaryText;
  document.getElementById('brandQuestion')?.classList.add('hidden');
  document.getElementById('brandOpeningSummary')?.classList.remove('hidden');
  setTimeout(()=>{ if(step===1){ step=2; renderStep(); } },160);
};

// Prevent the old persistent brand summary from rendering as a separate screen element.
const _editBrandScopeV61=editBrandScope;
editBrandScope=function(){
  if(step===1){editOpeningBrandScope();return;}
  _editBrandScopeV61();
};

// When returning to step 1, show the appropriate normal question state.
const _renderStepV61=renderStep;
renderStep=function(){
  _renderStepV61();
  if(step===1){
    if(!state.handed) showOpeningHandedness();
    else if(!formBrandScopeConfirmed) showOpeningBrandScope();
    else{
      document.getElementById('handedQuestion')?.classList.add('hidden');
      document.getElementById('handedSummary')?.classList.remove('hidden');
      document.getElementById('brandQuestion')?.classList.add('hidden');
      document.getElementById('brandOpeningSummary')?.classList.remove('hidden');
      const hs=document.getElementById('handedSummaryText');
      const bs=document.getElementById('brandOpeningSummaryText');
      if(hs)hs.textContent=state.handed==='left'?'Left-handed':'Right-handed';
      if(bs)bs.textContent=brandScopeSummaryLabel();
    }
  }
};

// Next from opening step cannot skip either question.
const _nextV61=next;
next=function(){
  if(step===1){
    if(!state.handed){showOpeningHandedness();return;}
    if(!formBrandScopeConfirmed){showOpeningBrandScope();return;}
  }
  _nextV61();
};

// Confidence now affects the displayed score rather than competing with it.
function confidenceAdjustedDriverScore(rawScore,confidence){
  const conf=Math.max(0,Math.min(100,Number(confidence)||0));
  const evidencePenalty=(100-conf)*0.52;
  const evidenceCeiling=Math.min(99.5,58+conf*0.42);
  const adjusted=Math.min(rawScore-evidencePenalty,evidenceCeiling);
  return Math.max(50,Math.round(adjusted*10)/10);
}
function driverDataStrengthCopy(conf){
  if(conf>=92)return {
    label:'Strong evidence',
    text:'FORM has enough specific information to make a strong recommendation. The score already reflects the small amount of remaining uncertainty.'
  };
  if(conf>=84)return {
    label:'Good evidence',
    text:'This is a credible recommendation, but exact launch-monitor numbers or more complete current-driver details could refine the order of close alternatives.'
  };
  if(conf>=74)return {
    label:'Provisional recommendation',
    text:'FORM sees a likely direction, but the available information is not strong enough to support an elite recommendation score. Add reliable data later and FORM will re-evaluate the fit.'
  };
  return {
    label:'Early recommendation',
    text:'Treat this as a starting point, not a purchase-level conclusion. The best driver may fit better than the score shown, but FORM cannot support a stronger recommendation until more information is added.'
  };
}

// Replace the current Driver result renderer with confidence-adjusted scores.
showResults=function(){
  const raw=golfer(),g=driverProfile(raw),rawRows=driverRankV43(g);
  const conf=driverConfidenceV43(g);
  const rows=rawRows.map(x=>({...x,s:{...x.s,rawOverall:x.s.overall,overall:confidenceAdjustedDriverScore(x.s.overall,conf)}}));
  const rawCurrent=currentDriverScoreV43(g);
  const currentScore=confidenceAdjustedDriverScore(rawCurrent,conf);
  const currentName=[g.currentClub.brand,g.currentClub.model].filter(Boolean).join(' ')||'Your current driver';
  const tie=driverTieState(rawRows,conf);
  const best=rows[0],delta=best?Math.round((best.s.overall-currentScore)*10)/10:0;
  const up=upgradeMagnitudeV43(delta,currentScore,conf),adjust=adjustmentAdviceV43(g,currentScore),diag=driverMissDiagnosis(g);
  const strength=driverDataStrengthCopy(conf);

  step=10;
  document.querySelectorAll('.step').forEach(x=>x.classList.add('hidden'));
  document.getElementById('results').classList.remove('hidden');
  document.getElementById('flowNav').style.display='none';
  document.getElementById('progressBar').style.width='100%';
  document.getElementById('stepCount').textContent='FIT COMPLETE';

  const note=document.getElementById('dataStrengthNote');
  if(note)note.innerHTML=`<b>${strength.label}</b><span>${strength.text}</span>`;

  const tiedRaw=tie.group||[];
  const groupNames=tiedRaw.map(x=>`${x.p.brand} ${x.p.model}`).join(' · ');
  document.getElementById('keep').innerHTML=`
    <div class="currentFitCard"><div class="currentFitTop"><div><div class="eyebrow">Your current driver</div><div class="currentFitName">${currentName}${g.currentClub.loft?` · ${g.currentClub.loft}`:''}</div></div><div class="gradeWrap"><div class="letterGrade">${fitLetter(currentScore)}</div><div><div class="headerMeta">Recommendation strength</div><div class="numericGrade">${currentScore}/100</div></div></div></div><div class="fitExplanation">FORM diagnoses your pattern as <b>${diag.label}</b>. This score combines modeled equipment fit with the amount and precision of information you provided.</div></div>
    ${adjust?`<div class="adjustFirst"><div class="eyebrow">Before replacing it</div><h3>${adjust.title}</h3><p>${adjust.text}</p></div>`:''}
    <div class="upgradeSummary"><div class="upgradeSummaryTop"><div><div class="eyebrow">Upgrade recommendation</div><h3>${up.level}</h3></div><div class="deltaScore">${delta>0?'+':''}${delta} strength points</div></div><div class="fitExplanation">${up.text}</div></div>
    ${tie.tie?`<div class="tieBanner"><b>Top fit group:</b> ${groupNames}. The available evidence does not justify pretending there is a clear single winner. Additional data may separate these models.</div>`:''}
  `;

  document.getElementById('resultList').innerHTML=rows.slice(0,5).map((x,i)=>{
    const rawMatch=rawRows[i];
    const tr=driverTradeoffs(x.p,g,currentScore);
    const why=x.s.reasons.length?x.s.reasons.join('; '):'balanced match across the inputs provided';
    const isTie=tie.tie && tiedRaw.some(z=>z.p.brand===x.p.brand&&z.p.model===x.p.model);
    return `<div class="driverVerdict"><div class="verdictTop"><div><div class="recRank">${isTie?'Top fit group':'#'+(i+1)+' recommendation'}</div><h2>${x.p.brand} ${x.p.model}</h2><div class="fitGroup">${x.s.reasons.slice(0,3).map(r=>`<span>${r}</span>`).join('')}</div></div><div class="verdictScore">${x.s.overall}<small>Strength / 100</small></div></div><div class="tradeoffs">${tr.map(z=>`<div class="trade"><span>${z[0]}</span><b>${z[1]}</b></div>`).join('')}</div><div class="engineReason"><b>Why it ranks here:</b> ${why}. ${i===0?`This is the strongest recommendation FORM can support from the information currently available.`:`Compared with the top option, this model makes a slightly different tradeoff.`}</div><div class="constraintNote">Score includes a data-strength adjustment. Add information later to refine close recommendations.</div></div>`;
  }).join('');

  document.getElementById('oracleTitle').textContent='Fit synthesized.';
  document.getElementById('signalList').innerHTML=`<div class="signal"><span class="dot on"></span><span>Miss pattern diagnosed from start + curve + strike</span></div><div class="signal"><span class="dot on"></span><span>Hard incompatibility constraints applied</span></div><div class="signal"><span class="dot on"></span><span>Current driver scored on the same needs</span></div><div class="signal"><span class="dot on"></span><span>Available data incorporated directly into recommendation strength</span></div>`;
  document.getElementById('candidateCount').textContent=rows.length;

  try{saveFit('driver',{title:'Driver Fit',topMatch:best?`${best.p.brand} ${best.p.model}`:'',topScore:best?.s.overall||null,rawModelScore:best?.s.rawOverall||null,currentClub:currentName,currentScore,upgrade:up.level,dataStrength:strength.label,diagnosis:diag.label})}catch(e){}
  window.scrollTo({top:0,behavior:'smooth'});
};

setTimeout(()=>{ if(step===1)renderStep(); },0);


// FORM 6.2 QA PATCH
// A new Driver Fitting always asks handedness and brand scope once.
const _openFitV62QA=openFit;
openFit=function(id){
  if(id==='driver'){
    step=1;
    state.handed=null;
    formBrandScopeConfirmed=false;
    localStorage.setItem('formBrandScopeConfirmed','false');
    document.getElementById('results')?.classList.add('hidden');
    const nav=document.getElementById('flowNav');
    if(nav)nav.style.display='flex';
  }
  return _openFitV62QA(id);
};
