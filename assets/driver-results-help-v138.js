// FORM 10.38 — robust direct metric-help controls for driver results.
(function(){
'use strict';
function bind(){
  const results=document.getElementById('results');
  if(!results)return;
  const buttons=[...results.querySelectorAll('.report128Info')];
  buttons.forEach(btn=>{
    if(btn.dataset.formHelp138==='1')return;
    btn.dataset.formHelp138='1';
    btn.setAttribute('aria-expanded','false');
    const handler=function(e){
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const cell=btn.closest('.report128MetricCell');
      if(!cell)return;
      const help=cell.querySelector('.report128Help');
      if(!help)return;
      const wasOpen=cell.classList.contains('open')||help.style.display==='block';
      results.querySelectorAll('.report128MetricCell.open').forEach(other=>{
        if(other===cell)return;
        other.classList.remove('open');
        const otherHelp=other.querySelector('.report128Help');
        if(otherHelp)otherHelp.style.display='none';
        const otherBtn=other.querySelector('.report128Info');
        if(otherBtn)otherBtn.setAttribute('aria-expanded','false');
      });
      if(wasOpen){
        cell.classList.remove('open');
        help.style.display='none';
        btn.setAttribute('aria-expanded','false');
      }else{
        cell.classList.add('open');
        help.style.display='block';
        btn.setAttribute('aria-expanded','true');
      }
    };
    btn.addEventListener('click',handler,true);
  });
}
function boot(){bind();return true;}
boot();
let queued=false;
new MutationObserver(()=>{
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{queued=false;bind();});
}).observe(document.getElementById('driverExperience')||document.body,{childList:true,subtree:true});
window.FORM_DRIVER_RESULTS_HELP_V138=true;
})();