/* FORM Driver config v228 experiment — continuous speed-aware launch/spin loft needs. TEST ONLY. */
(function(){
'use strict';
const cfg=window.FORM_DRIVER_CONFIG_V81;
if(!cfg||!cfg.loftFit)return;
const legacy=cfg.loftFit;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const smooth=x=>{x=clamp(x,0,1);return x*x*(3-2*x);};
function metric(id){return state?.metrics?.[id]||{mode:'unknown',value:null};}
function answered(v){return v!==null&&v!==undefined&&v!==''&&v!=='unknown';}
const maps={
 speed:{under75:72,'75-84':80,'85-89':87,'90-94':92,'95-99':97,'100-104':102,'105-109':107,'110-114':112,'115plus':118},
 launch:{under8:7,'8-10':9,'10-12':11,'12-14':13,'14-16':15,'16-18':17,'18-20':19,'20plus':21},
 spin:{under1500:1400,'1500-1749':1625,'1750-1999':1875,'2000-2249':2125,'2250-2499':2375,'2500-2749':2625,'2750-2999':2875,'3000-3499':3250,'3500plus':3650}
};
function value(id){const m=metric(id);if(!m||!answered(m.value)||m.mode==='unknown')return null;if(m.mode==='exact')return Number(m.value);if(m.mode==='range')return maps[id]?.[m.value]??null;return null;}
function target(speed){speed=Number(speed);if(!Number.isFinite(speed))return null;return {launch:clamp(14.5-.08*(speed-70),10.8,14.7),spin:clamp(2850-16*(speed-70),2100,2900)};}
function needs(speed,launch,spin){const t=target(speed);if(!t)return null;return {target:t,launchLow:smooth((t.launch-launch-.25)/3),launchHigh:smooth((launch-t.launch-3.25)/3.5),spinLow:smooth((t.spin-spin-100)/800),spinHigh:smooth((spin-t.spin-350)/900)};}
function continuousLoftFit(p){
 const speed=value('speed'),launch=value('launch'),spin=value('spin');
 if(speed==null||launch==null||spin==null)return legacy(p);
 const n=needs(speed,launch,spin),aoa=value('aoa');
 let loft=10.5,reasons=[],conflict=false;
 const launchAdj=n.launchLow-n.launchHigh,spinAdj=.5*(n.spinLow-n.spinHigh);
 loft+=launchAdj+spinAdj;
 if(n.launchLow>=.08)reasons.push('launch below your speed-based window');else if(n.launchHigh>=.08)reasons.push('launch above your speed-based window');
 if(n.spinLow>=.08)reasons.push('spin below your speed-based window');else if(n.spinHigh>=.08)reasons.push('spin above your speed-based window');
 conflict=(n.launchLow>=.08&&n.spinHigh>=.08)||(n.launchHigh>=.08&&n.spinLow>=.08);
 if(aoa!=null&&aoa<=-2){loft+=.5;reasons.push('downward attack angle');}else if(aoa!=null&&aoa>=4){loft-=.5;reasons.push('upward attack angle');}
 if(p?.player==='lowspin')loft+=.5;
 loft=Math.round(clamp(loft,8,12)*2)/2;
 const lo=clamp(loft-.5,8,12),hi=clamp(loft+.5,8,12);
 let reason=reasons.length?`Driven by ${reasons.slice(0,3).join(', ')}.`:'Neutral starting loft from the information provided.';
 if(conflict)reason+=' Launch and spin point in competing loft directions, so launch-monitor validation matters more than the nominal loft.';
 return {loft,range:`${lo.toFixed(1)}°–${hi.toFixed(1)}°`,reason,conflict,experimental:{target:n.target,needs:n,launchAdj,spinAdj}};
}
cfg.loftFit=continuousLoftFit;
window.FORM_DRIVER_CONFIG_CONTINUOUS_V228={legacy,continuousLoftFit,needs,target};
})();
