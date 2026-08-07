from pathlib import Path
import re

p = Path('assets/app-3.js')
s = p.read_text(encoding='utf-8')

# Do not auto-confirm a saved brand scope for a new fitting.
s = re.sub(
    r"\nsetTimeout\(\(\)=>\{\n  const saved=localStorage\.getItem\('formBrandScopeConfirmed'\);\n  if\(saved==='true' && brandScopeIsValid\(\)\)\{\n    formBrandScopeConfirmed=true;\n    confirmBrandScope\(\);\n  \}\n\},0\);\n",
    "\n",
    s,
    count=1,
)

# Sparse data must materially suppress recommendation strength.
s = re.sub(
    r"function confidenceAdjustedDriverScore\(rawScore,confidence\)\{.*?\n\}",
    "function confidenceAdjustedDriverScore(rawScore,confidence){\n  const conf=Math.max(0,Math.min(100,Number(confidence)||0));\n  const evidencePenalty=(100-conf)*0.52;\n  const evidenceCeiling=Math.min(99.5,58+conf*0.42);\n  const adjusted=Math.min(rawScore-evidencePenalty,evidenceCeiling);\n  return Math.max(50,Math.round(adjusted*10)/10);\n}",
    s,
    count=1,
    flags=re.S,
)

s = s.replace("if(conf>=90)return {", "if(conf>=92)return {", 1)
s = s.replace("if(conf>=82)return {", "if(conf>=84)return {", 1)
s = s.replace(
    "text:'FORM sees a likely direction, but the available information is not strong enough to support an elite score. Add launch-monitor data or current-club details later to improve the fit.'",
    "text:'FORM sees a likely direction, but the available information is not strong enough to support an elite recommendation score. Add reliable data later and FORM will re-evaluate the fit.'",
    1,
)
s = s.replace(
    "text:'The available data suggests a starting point rather than a purchase-level conclusion. These drivers may fit better than shown, but FORM cannot make a strong recommendation until more information is added.'",
    "text:'Treat this as a starting point, not a purchase-level conclusion. The best driver may fit better than the score shown, but FORM cannot support a stronger recommendation until more information is added.'",
    1,
)

# Do not grade unverified manual bag entries.
old = "    let score=null;\n    try{score=bagFitScore(cat,{brand:item.brand,model},profile,fits)}catch(e){}\n    const grade=score?fitLetter(score):'—';\n    let traits={pills:[],source:'Custom entry'};\n    try{if(item.model!=='__custom__')traits=attributePills(cat,{brand:item.brand,model})}catch(e){}"
new = "    const verified=item.model!=='__custom__' && item.brand!=='Other / not listed';\n    let score=null;\n    if(verified){try{score=bagFitScore(cat,{brand:item.brand,model},profile,fits)}catch(e){}}\n    const grade=score?fitLetter(score):'—';\n    let traits={pills:[],source:verified?'Catalog entry':'Unverified manual entry'};\n    try{if(verified)traits=attributePills(cat,{brand:item.brand,model})}catch(e){}"
if old in s:
    s = s.replace(old, new, 1)

old_card = "${score?`<div class=\"bagGradeWhy\">Modeled fit score: <b>${score}/100</b>. FORM compares the product profile with your saved golfer profile and completed fittings.</div>`:''}"
new_card = "${score?`<div class=\"bagGradeWhy\">Modeled fit score: <b>${score}/100</b>. FORM compares the verified product profile with your saved golfer profile and completed fittings.</div>`:`<div class=\"bagGradeWhy\">Saved to your bag. FORM will not assign a fit grade until this product is verified in the equipment catalog.</div>`}"
s = s.replace(old_card, new_card, 1)

marker = '// FORM 6.2 QA PATCH'
if marker not in s:
    s += """

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
"""

p.write_text(s, encoding='utf-8')
