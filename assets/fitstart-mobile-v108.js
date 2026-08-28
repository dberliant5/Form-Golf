// FORM 10.8 — mobile-first fitting path chooser: three choices immediately visible.
(function(){
'use strict';
function init(){
  if(window.FORM_FITSTART_MOBILE_V108)return true;
  const page=document.getElementById('page-fitstart');if(!page)return false;
  const style=document.createElement('style');
  style.textContent=`
  @media(max-width:640px){
    body.formFitStartActiveMobile .shell>div:first-child{display:none!important}
    #page-fitstart .fitStartShell{padding:14px 16px 26px!important;margin:0!important}
    #page-fitstart .fitStartIntro{display:none!important}
    #page-fitstart .fitPathGrid{display:grid!important;grid-template-columns:1fr!important;gap:9px!important;margin:0!important;padding:0!important}
    #page-fitstart .fitPathCard,
    #page-fitstart .fitPathCard.active,
    #page-fitstart .fitPathCard.recommended,
    #page-fitstart .fitPathCard.formUserSelected{
      min-height:0!important;height:auto!important;padding:14px 16px!important;margin:0!important;display:grid!important;
      grid-template-columns:1fr auto!important;grid-template-areas:'label foot' 'title title'!important;gap:5px 12px!important;align-items:center!important;
    }
    #page-fitstart .fitPathCard .fitPathLabel{grid-area:label!important;margin:0!important;font-size:7px!important;line-height:1.2!important;letter-spacing:.14em!important}
    #page-fitstart .fitPathCard h2{grid-area:title!important;margin:2px 0 0!important;font-size:27px!important;line-height:1.02!important;letter-spacing:-.035em!important}
    #page-fitstart .fitPathCard .fitPathBullets{display:none!important}
    #page-fitstart .fitPathCard>span{grid-area:foot!important;margin:0!important;font-size:7px!important;line-height:1.2!important;letter-spacing:.08em!important;white-space:nowrap!important;align-self:start!important}
    #page-fitstart .fitSelectionPanel{margin-top:14px!important;padding-top:14px!important}
  }`;
  document.head.appendChild(style);
  function sync(){
    const mobile=window.matchMedia('(max-width:640px)').matches;
    document.body.classList.toggle('formFitStartActiveMobile',mobile&&page.classList.contains('active'));
  }
  new MutationObserver(sync).observe(page,{attributes:true,attributeFilter:['class']});
  window.addEventListener('resize',sync,{passive:true});
  sync();
  window.FORM_FITSTART_MOBILE_V108=true;return true;
}
let n=0,t=setInterval(()=>{n++;if(init()||n>120)clearInterval(t)},50);
})();
