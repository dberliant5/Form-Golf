// FORM 14.12 — premium interview presentation. Presentation only; no scoring or navigation ownership.
(function(){'use strict';
if(window.FORM_DRIVER_PREMIUM_INTERVIEW_V199)return;window.FORM_DRIVER_PREMIUM_INTERVIEW_V199=true;
function init(){const d=document.getElementById('driverExperience');if(!d)return false;
const s=document.createElement('style');s.id='formPremiumInterview199';s.textContent=`
#driverExperience.active{--fitShadow:0 18px 55px rgba(38,62,51,.07);--fitSoft:#f7f9f6}
#driverExperience.active .topline{position:relative;padding-top:20px!important;padding-bottom:18px!important}
#driverExperience.active .topline:after{content:"YOUR DRIVER FIT";position:absolute;left:28px;bottom:0;font-size:7.5px;letter-spacing:.16em;font-weight:800;color:#8a948d}
#driverExperience.active .progress{height:4px!important;border-radius:99px;overflow:hidden;background:#e7eae5!important}
#driverExperience.active .progress i{border-radius:99px;box-shadow:0 0 16px rgba(38,62,51,.18)}
#driverExperience.active .mainPane{max-width:940px!important;padding-top:28px!important}
#driverExperience.active .step:not(.hidden){animation:formPremium199In .42s cubic-bezier(.2,.8,.2,1)!important}
@keyframes formPremium199In{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
#driverExperience.active .eyebrow{display:inline-flex;align-items:center;gap:8px;margin-bottom:12px;padding:6px 9px;border:1px solid #dfe4df;border-radius:99px;background:#f8faf7;color:#66766b;font-size:7.5px}
#driverExperience.active h1{font-size:clamp(42px,5.2vw,64px)!important;line-height:.98!important;max-width:820px}
#driverExperience.active .lead{font-size:15px!important;line-height:1.65!important;color:#6a746d!important;max-width:720px!important;margin-top:16px!important;margin-bottom:26px!important}
#driverExperience.active .options{gap:10px 12px!important;max-width:820px!important}
#driverExperience.active .opt{border:1px solid #dfe3de!important;border-radius:10px!important;background:#fff!important;padding:17px 42px 17px 17px!important;min-height:56px;box-shadow:0 1px 0 rgba(38,62,51,.02);transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease,background .2s ease!important}
#driverExperience.active .opt:after{right:17px!important;width:12px!important;height:12px!important}
#driverExperience.active .opt:hover{transform:translateY(-1px);padding-left:17px!important;border-color:#aebbb2!important;box-shadow:0 8px 22px rgba(38,62,51,.07)}
#driverExperience.active .opt.on{background:linear-gradient(180deg,#f4f8f3,#eef4ed)!important;border-color:#6e8475!important;box-shadow:0 9px 25px rgba(38,62,51,.08)!important;color:var(--deep)!important}
#driverExperience.active .multiOptions{gap:9px!important;max-width:820px}
#driverExperience.active .multiOptions button{border:1px solid #dfe3de!important;border-radius:9px!important;background:#fff!important;padding:12px 15px!important;transition:.2s ease}
#driverExperience.active .multiOptions button:hover{border-color:#9eaea2!important;transform:translateY(-1px)}
#driverExperience.active .multiOptions button.on{background:var(--deep)!important;color:#fff!important;box-shadow:0 7px 18px rgba(38,62,51,.13)}
#driverExperience.active .derived{border:1px solid #dfe5df;border-radius:10px;background:linear-gradient(135deg,#f3f7f1,#fafbf9)!important;padding:17px 19px!important;box-shadow:0 8px 24px rgba(38,62,51,.04)}
#driverExperience.active .metricBox{border:1px solid #e0e4df!important;border-radius:11px;background:#fff;padding:18px!important;margin-bottom:10px;box-shadow:0 5px 18px rgba(38,62,51,.035)}
#driverExperience.active .metricChoice{border-radius:7px!important;background:#fafbf9!important;transition:.18s ease}
#driverExperience.active .metricChoice:hover{border-color:#9eaaa0!important}
#driverExperience.active .metricChoice.on{background:var(--deep)!important}
#driverExperience.active .field select,#driverExperience.active .metricInput{background:#fff!important;border:1px solid #d9dfda!important;border-radius:8px!important;padding:12px!important}
#driverExperience.active .flowNav{margin-top:28px!important;padding-top:18px!important}
#driverExperience.active .flowNav .btn.primary,#driverExperience.active .solidBtn{border-radius:8px!important;box-shadow:0 8px 20px rgba(38,62,51,.12);transition:transform .18s ease,box-shadow .18s ease,background .18s ease}
#driverExperience.active .flowNav .btn.primary:hover,#driverExperience.active .solidBtn:hover{transform:translateY(-1px);box-shadow:0 11px 26px rgba(38,62,51,.16)}
#driverExperience.active #step9 .reviewGrid{border-radius:12px;overflow:hidden;box-shadow:var(--fitShadow)}
#driverExperience.active #step9 .readyBox{border-radius:12px;box-shadow:0 16px 40px rgba(38,62,51,.15)}
#driverExperience.active .brandModeGrid>*{border-radius:10px!important;transition:.2s ease}
#driverExperience.active .brandModeGrid>*:hover{transform:translateY(-1px);box-shadow:0 8px 22px rgba(38,62,51,.06)}
@media(max-width:600px){#driverExperience.active .topline:after{left:16px}#driverExperience.active .mainPane{padding-top:22px!important}#driverExperience.active h1{font-size:40px!important}#driverExperience.active .lead{font-size:14px!important;margin-bottom:21px!important}#driverExperience.active .options{grid-template-columns:1fr!important}#driverExperience.active .opt{min-height:54px;padding:15px 40px 15px 15px!important}#driverExperience.active .opt:hover{padding-left:15px!important}#driverExperience.active .metricBox{padding:15px!important}}
`;document.head.appendChild(s);return true}
let n=0,t=setInterval(()=>{n++;if(init()||n>100)clearInterval(t)},50);
})();