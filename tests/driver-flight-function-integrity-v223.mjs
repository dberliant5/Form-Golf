// Direct integrity test for the actual test-only continuous flight helpers.
import fs from 'node:fs';
import vm from 'node:vm';

globalThis.state={metrics:{}};
globalThis.window={FORM_DRIVER_ENGINE_V80:{},FORM_DRIVER_EVIDENCE_V80:{}};
const source=fs.readFileSync('tests/driver-continuous-flight-v221.js','utf8');
vm.runInThisContext(source,{filename:'driver-continuous-flight-v221.js'});
const F=window.FORM_DRIVER_CONTINUOUS_FLIGHT_V221;
if(!F?.flightNeeds||!F?.targets) throw new Error('Continuous flight helpers did not load');

function setExact(speed,launch,spin){
  state.metrics={
    speed:{mode:'exact',value:speed},
    launch:{mode:'exact',value:launch},
    spin:{mode:'exact',value:spin}
  };
}
function point(speed,launch,spin){setExact(speed,launch,spin);const n=F.flightNeeds({});return {speed,launch,spin,targetLaunch:n.targets.launch,targetSpin:n.targets.spin,launchLow:n.launch.low||0,launchHigh:n.launch.high||0,spinLow:n.spin.low||0,spinHigh:n.spin.high||0};}
function monotonic(arr,key,dir){for(let i=1;i<arr.length;i++){const d=arr[i][key]-arr[i-1][key];if(dir==='down'&&d>1e-12)return false;if(dir==='up'&&d<-1e-12)return false;}return true;}
function maxJump(arr,key){let m=0;for(let i=1;i<arr.length;i++)m=Math.max(m,Math.abs(arr[i][key]-arr[i-1][key]));return m;}
const launch95=[10.8,10.9,11,11.1,11.2].map(v=>point(95,v,2300));
const spinLow95=[2050,2090,2100,2110,2150].map(v=>point(95,11,v));
const spinHigh95=[2950,2990,3000,3010,3050].map(v=>point(95,12.5,v));
const spin70=[2950,3000,3050,3100,3150].map(v=>point(70,10,v));
const spin105=[1900,1950,2000,2050,2100,2150].map(v=>point(105,11,v));
const targetRows=[70,85,95,105,115].map(s=>{const t=F.targets(s);return {speed:s,...t};});
const checks={
  launchLowSeverityFallsSmoothly:monotonic(launch95,'launchLow','down'),
  spinLowSeverityFallsSmoothly:monotonic(spinLow95,'spinLow','down'),
  spinHighSeverityRisesSmoothly:monotonic(spinHigh95,'spinHigh','up'),
  slowSpeed3100IsNotCategoricallyHigh:spin70.find(x=>x.spin===3100)?.spinHigh===0,
  fastSpeed2000IsMildNotBinaryLow:(spin105.find(x=>x.spin===2000)?.spinLow||0)>0&&(spin105.find(x=>x.spin===2000)?.spinLow||0)<0.25,
  targetsMoveWithSpeed:monotonic(targetRows,'launch','down')&&monotonic(targetRows,'spin','down'),
  noLaunchNeedDiscontinuity:maxJump(launch95,'launchLow')<0.06,
  noSpin2100NeedDiscontinuity:maxJump(spinLow95,'spinLow')<0.08,
  noSpin3000NeedDiscontinuity:maxJump(spinHigh95,'spinHigh')<0.06
};
const report={generatedAt:new Date().toISOString(),source:'tests/driver-continuous-flight-v221.js',productionScoringChanged:false,targetRows,series:{launch95,spinLow95,spinHigh95,spin70,spin105},checks,passed:Object.values(checks).every(Boolean)};
fs.mkdirSync('tests/baselines',{recursive:true});
fs.writeFileSync('tests/baselines/driver-flight-function-integrity-v223.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
if(!report.passed)process.exit(1);
