// FORM 10.12 — compact mobile prompt; fitting choices are visually primary.
(function(){
'use strict';
function init(){
  if(window.FORM_FITSTART_MOBILE_V112)return true;
  const page=document.getElementById('page-fitstart');if(!page)return false;
  const style=document.createElement('style');
  style.textContent=`
  @media(max-width:640px){
    body.formFitStartActiveMobile .shell>div:first-child{display:none!important}
    #page-fitstart .fitStartShell{padding:8px 14px 22px!important;margin:0!important}
    #page-fitstart .fitStartIntro{display:block!important;margin:0 0 8px!important;padding:0!important}
    #page-fitstart .fitStartIntro .formEyebrow{display:none!important}
    #page-fitstart .fitStartIntro h1{font-family:Arial,Helvetica,sans-serif!important;font-size:13px!important;line-height:1.25!important;letter-spacing:.01em!important;font-weight:700!important;margin:0!important;max-width:none!important;color:var(--form-ink)!important}
    #page-fitstart .fitStartIntro p{display:none!important}
    #page-fitstart .fitPathGrid{display:grid!important;grid-template-columns:1fr!important;gap:7px!important;margin:0!important;padding:0!important}
    #page-fitstart .fitPathCard,
    #page-fitstart .fitPathCard.active,
    #page-fitstart .fitPathCard.recommended,
    #page-fitstart .fitPathCard.formUserSelected{
      min-height:0!important;height:auto!important;padding:12px 14px!important;margin:0!important;display:grid!important;
      grid-template-columns:1fr auto!important;grid-template-areas:'label foot' 'title title'!important;gap:3px 10px!important;align-items:center!important;
    }
    #page-fitstart .fitPathCard .fitPathLabel{grid-area:label!important;margin:0!important;font-size:7px!important;line-height:1.2!important;letter-spacing:.14em!important}
    #page-fitstart .fitPathCard h2{grid-area:title!important;margin:1px 0 0!important;font-size:27px!important;line-height:1!important;letter-spacing:-.035em!important}
    #page-fitstart .fitPathCard .fitPathBullets{display:none!important}
    #page-fitstart .fitPathCard>span{grid-area:foot!important;margin:0!important;font-size:7px!important;line-height:1.2!important;letter-spacing:.08em!important;white-space:nowrap!important;align-self:start!important}
    #page-fitstart .fitSelectionPanel{margin-top:10px!important;padding-top:10px!important}
  }`;
  document.head.appendChild(style);
  function syncCopy(){
    const h=page.querySelector('.fitStartIntro h1');
    if(h&&h.textContent!=='How would you like FORM to help?')h.textContent='How would you like FORM to help?';
  }
  function sync(){
    const mobile=window.matchMedia('(max-width:640px)').matches;
    document.body.classList.toggle('formFitStartActiveMobile',mobile&&page.classList.contains('active'));
    if(mobile)syncCopy();
  }
  new MutationObserver(sync).observe(page,{attributes:true,attributeFilter:['class']});
  window.addEventListener('resize',sync,{passive:true});
  sync();
  window.FORM_FITSTART_MOBILE_V108=true;window.FORM_FITSTART_MOBILE_V109=true;window.FORM_FITSTART_MOBILE_V112=true;return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>120)clearInterval(t)},50);
})();
