// FORM 10.57 — bridge calibrated configuration logic into the canonical report API.
// The modern report reads loft/shaft from FORM_DRIVER_CONFIG_V81; ensure those calls use
// the latest ambiguity, flex-boundary, and transition-aware calibration.
(function(){
'use strict';
function init(){
  if(window.FORM_DRIVER_CONFIG_BRIDGE_V157)return true;
  const V81=window.FORM_DRIVER_CONFIG_V81,CAL=window.FORM_DRIVER_ALGORITHM_CALIBRATION_V152;
  if(!V81||!CAL||typeof CAL.loftFit!=='function'||typeof CAL.shaftFit!=='function')return false;
  const prior={loftFit:V81.loftFit,shaftFit:V81.shaftFit};
  V81.loftFit=function(p){return CAL.loftFit(p);};
  V81.shaftFit=function(){return CAL.shaftFit();};
  window.FORM_DRIVER_CONFIG_BRIDGE_V157={version:'10.57',prior:prior};
  return true;
}
let n=0,t=setInterval(function(){n++;if(init()||n>240)clearInterval(t);},50);
})();
