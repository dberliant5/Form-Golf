from pathlib import Path

p=Path('assets/app-3.js')
s=p.read_text(encoding='utf-8')
old="""const _openFitV62QA=openFit;
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
};"""
new="""const _openFitV62QA=openFit;
openFit=function(id){
  if(id==='driver'){
    step=1;
    state.handed=null;
    formBrandScopeConfirmed=false;
    localStorage.setItem('formBrandScopeConfirmed','false');
    document.getElementById('results')?.classList.add('hidden');
    const nav=document.getElementById('flowNav');
    if(nav)nav.style.display='flex';
    const result=_openFitV62QA(id);
    setTimeout(()=>renderStep(),0);
    return result;
  }
  return _openFitV62QA(id);
};"""
if old not in s:
    raise SystemExit('Expected v6.2 openFit wrapper not found')
p.write_text(s.replace(old,new,1),encoding='utf-8')
