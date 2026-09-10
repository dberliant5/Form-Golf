// FORM 14.11.8 — calibrated display scale for FORM Fit Score.
// Presentation calibration only: ranking, raw scoring, category scores, evidence quality,
// hard constraints, current-driver comparison logic, and configuration logic are untouched.
(function(){'use strict';
if(window.FORM_FIT_SCORE_SCALE_V202)return;window.FORM_FIT_SCORE_SCALE_V202=true;
// Fixed global monotonic calibration. It is deliberately NOT normalized to a golfer's top result.
// Anchors preserve weak/conditional fits while mapping genuinely strong raw fits into a more intuitive 1–100 presentation range.
const A=[[0,0],[45,45],[55,55],[60,62],[65,68],[70,74],[75,81],[80,87],[84,91],[86,93],[90,96],[95,98],[99.2,99.2],[100,100]];
function scale(x){x=Number(x);if(!Number.isFinite(x))return x;if(x<=A[0][0])return A[0][1];for(let i=1;i<A.length;i++){const a=A[i-1],b=A[i];if(x<=b[0]){const t=(x-a[0])/(b[0]-a[0]);return Math.round((a[1]+t*(b[1]-a[1]))*10)/10;}}return 100;}
function label(x){const s=scale(x);return s>=90?'Exceptional fit candidate':s>=85?'Strong fit candidate':s>=78?'Good fit with tradeoffs':s>=70?'Conditional fit':'Weak fit';}
function init(){const ENG=window.FORM_DRIVER_ENGINE_V80;if(!ENG||typeof ENG.scoreOne!=='function'||typeof ENG.currentScore!=='function')return false;if(ENG.__formDisplayScale202)return true;
 const priorScore=ENG.scoreOne.bind(ENG),priorCurrent=ENG.currentScore.bind(ENG);
 ENG.scoreOne=function(p,g){const d=priorScore(p,g);if(!d||d.overall==null)return d;const raw=Number(d.overall),shown=scale(raw);return {...d,rawFormFitScore:raw,overall:shown,displayScoreCalibration:{version:'14.11.8',raw,display:shown,band:label(raw)}};};
 ENG.currentScore=function(g){const c=priorCurrent(g);if(!c||c.score==null)return c;const raw=Number(c.score),shown=scale(raw);return {...c,rawFormFitScore:raw,score:shown,displayScoreCalibration:{version:'14.11.8',raw,display:shown,band:label(raw)}};};
 ENG.__formDisplayScale202={priorScore,priorCurrent};window.FORM_SCALE_FIT_SCORE_V202=scale;window.FORM_FIT_SCORE_BAND_V202=label;return true;}
let n=0,t=setInterval(()=>{n++;if(init()||n>240)clearInterval(t)},50);
})();
