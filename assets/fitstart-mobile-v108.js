// FORM 10.9 — compact mobile prompt with all three fitting paths visible immediately.
(function(){
'use strict';
function init(){
  if(window.FORM_FITSTART_MOBILE_V109)return true;
  const page=document.getElementById('page-fitstart');if(!page)return false;
  const style=document.createElement('style');
  style.textContent=`
  @media(max-width:640px){
    body.formFitStartActiveMobile .shell>div:first-child{display:none!important}
    #page-fitstart .fitStartShell{padding:14px 16px 26px!important;margin:0!important}
    #page-fitstart .fitStartIntro{display:block!important;margin:0 0 12px!important;padding:0!important}
    #page-fitstart .fitStartIntro .formEyebrow{display:none!important}
    #page-fitstart .fitStartIntro h1{font-size:25px!important;line-height:1.05!important;letter-spacing:-.025em!important;margin:0 0 5px!important;max-width:none!important}
    #page-fitstart .fitStartIntro p{font-size:11px!important;line-height:1.35!important;margin:0!important;max-width:none!important;color:var(--form-muted)!important}
    #page-fitstart .fitPathGrid{display:grid!important;grid-template-columns:1fr!important;gap:8px!important;margin:0!important;padding:0!important}
    #page-fitstart .fitPathCard,
    #page-fitstart .fitPathCard.active,
    #page-fitstart .fitPathCard.recommended,
    #page-fitstart .fitPathCard.formUserSelected{
      min-height:0!important;height:auto!important;padding:12px 14px!important;margin:0!important;display:grid!important;
      grid-template-columns:1fr auto!important;grid-template-areas:'label foot' 'title title'!important;gap:4px 10px!important;align-items:center!important;
    }
    #page-fitstart .fitPathCard .fitPathLabel{grid-area:label!important;margin:0!important;font-size:7px!important;line-height:1.2!important;letter-spacing:.14em!important}
    #page-fitstart .fitPathCard h2{grid-area:title!important;margin:1px 0 0!important;font-size:25px!important;line-height:1.02!important;letter-spacing:-.035em!important}
    #page-fitstart .fitPathCard .fitPathBullets{display:none!important}
    #page-fitstart .fitPathCard>span{grid-area:foot!important;margin:0!important;font-size:7px!important;line-height:1.2!important;letter-spacing:.08em!important;white-space:nowrap!important;align-self:start!important}
    #page-fitstart .fitSelectionPanel{margin-top:12px!important;padding-top:12px!important}
  }`;
  document.head.appendChild(style);
  function syncCopy(){
    const h=page.querySelector('.fitStartIntro h1'),p=page.querySelector('.fitStartIntro p');
    if(h)h.textContent='How would you like FORM to help?';
    if(p)p.textContent='Choose a fitting path.';
  }
  function sync(){
    const mobile=window.matchMedia('(max-width:640px)').matches;
    document.body.classList.toggle('formFitStartActiveMobile',mobile&&page.classList.contains('active'));
    if(mobile)syncCopy();
  }
  new MutationObserver(sync).observe(page,{attributes:true,attributeFilter:['class']});
  window.addEventListener('resize',sync,{passive:true});
  sync();
  window.FORM_FITSTART_MOBILE_V108=true;window.FORM_FITSTART_MOBILE_V109=true;return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>120)clearInterval(t)},50);
})();
