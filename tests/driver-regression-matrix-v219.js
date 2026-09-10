// FORM driver regression matrix — stable-scorer baseline harness.
// TEST ONLY. Not loaded by production. No scoring/UI changes.
// Run in DevTools after the driver fitting app is loaded:
//   FORM_DRIVER_REGRESSION_V219.run()
// Optional: save the returned JSON as the pre-change baseline before changing the scorer.
(function(){
'use strict';
const ENGINE=()=>window.FORM_DRIVER_ENGINE_V80;
const clone=v=>JSON.parse(JSON.stringify(v));
const r1=v=>Math.round(Number(v||0)*10)/10;
const golferNow=()=>typeof normalizedGolferV69==='function'?normalizedGolferV69():(typeof golfer==='function'?golfer():{});
const productName=r=>r?`${r.p.brand} ${r.p.model}`:null;
function setMetric(id,mode,value){state.metrics=state.metrics||{};state.metrics[id]={mode,value};}
function unknownMetric(id){setMetric(id,'unknown',null);}
function components(s){return Object.fromEntries((s?.components||[]).map(x=>[x.key,{score:x.score,weight:x.normalizedWeight,evidenceConfidence:x.evidenceConfidence}]));}
function snapshot(id,g,notes){
  const rows=ENGINE().winners(g).slice(0,10);const cur=ENGINE().currentScore(g);const top=rows[0],second=rows[1];
  return {id,notes,top10:rows.map((r,i)=>({rank:i+1,product:productName(r),score:r.s.overall,raw:r.s.raw,evidenceQuality:r.s.evidenceQuality,components:components(r.s)})),top:productName(top),topScore:top?.s?.overall??null,second:productName(second),gap12:top&&second?r1(top.s.overall-second.s.overall):null,currentDriver:cur?.score==null?null:{score:cur.score,label:cur.label,components:components(cur.detail)},gapVsCurrent:top&&cur?.score!=null?r1(top.s.overall-cur.score):null};
}
function baseGolfer(){const g=clone(golferNow());g.currentClub=g.currentClub||{};return g;}
function exactCore(speed,aoa,launch,spin){setMetric('speed','exact',speed);setMetric('aoa','exact',aoa);setMetric('launch','exact',launch);setMetric('spin','exact',spin);}
function clearSupport(){unknownMetric('ballSpeed');unknownMetric('carry');}
function direction(g,curveClass,costly){g.curveClass=curveClass;g.costly=costly;return g;}
function strike(g,v){g.strike=v;return g;}
function priority(name){
 state.ranks=state.ranks||{};
 if(name==='accuracy')Object.assign(state.ranks,{accuracy:1,distance:3,flight:2});
 else if(name==='distance')Object.assign(state.ranks,{distance:1,accuracy:3,flight:2});
 else if(name==='flight')Object.assign(state.ranks,{flight:1,accuracy:2,distance:3});
 else Object.assign(state.ranks,{accuracy:2,distance:2,flight:2});
}
function runCase(def){
 const saved=clone(state),g=baseGolfer();
 try{def.apply(g);return snapshot(def.id,g,def.notes);}catch(error){return {id:def.id,notes:def.notes,error:String(error?.message||error)};}finally{Object.keys(state).forEach(k=>delete state[k]);Object.assign(state,saved);}
}
const CASES=[
 {id:'M01',notes:'70 mph; 12°/2300; slow-speed launch/spin interpretation',apply:g=>{exactCore(70,1,12,2300);clearSupport();strike(g,'center');direction(g,null,'right');priority('distance');}},
 {id:'M02',notes:'70 mph; 15°/2800; slow-speed healthy control',apply:g=>{exactCore(70,3,15,2800);clearSupport();strike(g,'center');direction(g,null,null);priority('distance');}},
 {id:'M03',notes:'70 mph; negative AoA; low heel/right miss',apply:g=>{exactCore(70,-2,10,3100);clearSupport();strike(g,'heel');direction(g,'fade_curve','right');priority('accuracy');}},
 {id:'M04',notes:'82 mph mid-speed baseline',apply:g=>{exactCore(82,2,12,2300);clearSupport();strike(g,'center');direction(g,null,null);priority('balanced');}},
 {id:'M05',notes:'82 mph; high launch/low spin; high toe/left',apply:g=>{exactCore(82,4,14,1850);clearSupport();strike(g,'toe');direction(g,'draw_curve','left');priority('accuracy');}},
 {id:'M06',notes:'82 mph; negative AoA/low launch/high spin',apply:g=>{exactCore(82,-3,9,3000);clearSupport();strike(g,'heel');direction(g,'fade_curve','right');priority('distance');}},
 {id:'M07',notes:'95 mph; 11.5°/2200 higher-speed baseline',apply:g=>{exactCore(95,3,11.5,2200);clearSupport();strike(g,'center');direction(g,null,null);priority('balanced');}},
 {id:'M08',notes:'95 mph; +5; 13°/1800; toe/left',apply:g=>{exactCore(95,5,13,1800);clearSupport();strike(g,'toe');direction(g,'draw_curve','left');priority('accuracy');}},
 {id:'M09',notes:'95 mph; negative AoA; 9.5°/2900; heel/right',apply:g=>{exactCore(95,-2,9.5,2900);clearSupport();strike(g,'heel');direction(g,'fade_curve','right');priority('distance');}},
 {id:'M10',notes:'105 mph; +4; 11°/2000; fast-speed efficient-window test',apply:g=>{exactCore(105,4,11,2000);clearSupport();strike(g,'center');direction(g,null,null);priority('distance');}},
 {id:'M11',notes:'105 mph; +6; 14°/1650; high toe/left',apply:g=>{exactCore(105,6,14,1650);clearSupport();strike(g,'toe');direction(g,'draw_curve','left');priority('accuracy');}},
 {id:'M12',notes:'105 mph; -1; 9°/2700; low heel/right',apply:g=>{exactCore(105,-1,9,2700);clearSupport();strike(g,'heel');direction(g,'fade_curve','right');priority('balanced');}},

 {id:'S01',notes:'Self-reported-like toe case; no ball-speed support',apply:g=>{exactCore(95,3,11,2300);clearSupport();strike(g,'toe');direction(g,'fade_curve','right');priority('balanced');}},
 {id:'S02',notes:'Toe with measured club/ball speed support',apply:g=>{exactCore(95,3,11,2300);setMetric('ballSpeed','exact',141);unknownMetric('carry');strike(g,'toe');direction(g,'fade_curve','right');priority('balanced');}},
 {id:'S03',notes:'Heel claim conflicting with left ball flight',apply:g=>{exactCore(95,3,11,2300);clearSupport();strike(g,'heel');direction(g,'draw_curve','left');priority('accuracy');}},
 {id:'S04',notes:'Varied strike + two-way miss',apply:g=>{exactCore(95,3,11,2300);clearSupport();strike(g,'varied');direction(g,null,'two_way');priority('accuracy');}},

 {id:'D01',notes:'Right miss directional isolation',apply:g=>{exactCore(95,3,11,2300);clearSupport();strike(g,'center');direction(g,'fade_curve','right');priority('accuracy');}},
 {id:'D02',notes:'Left miss directional isolation',apply:g=>{exactCore(95,3,11,2300);clearSupport();strike(g,'center');direction(g,'draw_curve','left');priority('accuracy');}},
 {id:'D03',notes:'Two-way miss directional isolation',apply:g=>{exactCore(95,3,11,2300);clearSupport();strike(g,'center');direction(g,null,'two_way');priority('accuracy');}},
 {id:'D04',notes:'No directional issue control',apply:g=>{exactCore(95,3,11,2300);clearSupport();strike(g,'center');direction(g,null,null);priority('accuracy');}},

 {id:'Q01',notes:'Exact launch/spin/speed evidence',apply:g=>{exactCore(95,3,11,2300);clearSupport();strike(g,'center');direction(g,'fade_curve','right');priority('balanced');}},
 {id:'Q02',notes:'Range/approximate launch/spin/speed evidence',apply:g=>{setMetric('speed','range','95-99');setMetric('aoa','general','up');setMetric('launch','range','10-12');setMetric('spin','range','2250-2499');clearSupport();strike(g,'center');direction(g,'fade_curve','right');priority('balanced');}},
 {id:'Q03',notes:'Sparse technical inputs; toe/right self-report profile',apply:g=>{unknownMetric('speed');unknownMetric('aoa');unknownMetric('launch');unknownMetric('spin');clearSupport();g.speed=null;g.spin=null;g.traj=null;strike(g,'toe');direction(g,'fade_curve','right');priority('balanced');}},
 {id:'Q04',notes:'Very sparse profile',apply:g=>{unknownMetric('speed');unknownMetric('aoa');unknownMetric('launch');unknownMetric('spin');clearSupport();g.speed=null;g.spin=null;g.traj=null;strike(g,null);direction(g,null,'right');priority('accuracy');}},

 {id:'P01',notes:'Distance priority',apply:g=>{exactCore(95,3,11,2300);clearSupport();strike(g,'center');direction(g,'fade_curve','right');priority('distance');}},
 {id:'P02',notes:'Accuracy/forgiveness proxy priority',apply:g=>{exactCore(95,3,11,2300);clearSupport();strike(g,'varied');direction(g,null,'two_way');priority('accuracy');}},
 {id:'P03',notes:'Accuracy priority with right miss',apply:g=>{exactCore(95,3,11,2300);clearSupport();strike(g,'center');direction(g,'fade_curve','right');priority('accuracy');}},
 {id:'P04',notes:'Balanced priority control',apply:g=>{exactCore(95,3,11,2300);clearSupport();strike(g,'center');direction(g,'fade_curve','right');priority('balanced');}},

 {id:'X01',notes:'Toe + measured low smash; double-counting stress',apply:g=>{exactCore(95,3,11,2300);setMetric('ballSpeed','exact',132);unknownMetric('carry');strike(g,'toe');direction(g,'fade_curve','right');priority('accuracy');}},
 {id:'X02',notes:'Center + measured low smash control',apply:g=>{exactCore(95,3,11,2300);setMetric('ballSpeed','exact',132);unknownMetric('carry');strike(g,'center');direction(g,'fade_curve','right');priority('accuracy');}},
 {id:'X03',notes:'Toe without ball-speed data',apply:g=>{exactCore(95,3,11,2300);clearSupport();strike(g,'toe');direction(g,'fade_curve','right');priority('accuracy');}},

 {id:'R01',notes:'94 mph boundary stability',apply:g=>{exactCore(94,3,11,2300);clearSupport();strike(g,'center');direction(g,'fade_curve','right');priority('balanced');}},
 {id:'R02',notes:'95 mph boundary stability',apply:g=>{exactCore(95,3,11,2300);clearSupport();strike(g,'center');direction(g,'fade_curve','right');priority('balanced');}},
 {id:'R03',notes:'96 mph boundary stability',apply:g=>{exactCore(96,3,11,2300);clearSupport();strike(g,'center');direction(g,'fade_curve','right');priority('balanced');}},
 {id:'R04',notes:'10.9° launch threshold edge',apply:g=>{exactCore(95,3,10.9,2300);clearSupport();strike(g,'center');direction(g,'fade_curve','right');priority('balanced');}},
 {id:'R05',notes:'11.1° launch threshold edge',apply:g=>{exactCore(95,3,11.1,2300);clearSupport();strike(g,'center');direction(g,'fade_curve','right');priority('balanced');}},
 {id:'R06',notes:'2090 rpm spin threshold edge',apply:g=>{exactCore(95,3,11,2090);clearSupport();strike(g,'center');direction(g,'fade_curve','right');priority('balanced');}},
 {id:'R07',notes:'2110 rpm spin threshold edge',apply:g=>{exactCore(95,3,11,2110);clearSupport();strike(g,'center');direction(g,'fade_curve','right');priority('balanced');}},

 {id:'C01',notes:'Current-driver satisfaction must not alter absolute ranking',apply:g=>{exactCore(95,3,11,2300);clearSupport();g.currentClub=g.currentClub||{};g.currentClub.results='mixed';strike(g,'center');direction(g,'fade_curve','right');priority('balanced');}},
 {id:'C02',notes:'Current-driver positive result label control',apply:g=>{exactCore(95,3,11,2300);clearSupport();g.currentClub=g.currentClub||{};g.currentClub.results='good';strike(g,'center');direction(g,'fade_curve','right');priority('balanced');}},
];
function rankMap(result){return Object.fromEntries((result.top10||[]).map(x=>[x.product,x.rank]));}
function comparePair(a,b){
 const A=rankMap(a),B=rankMap(b),names=[...new Set([...Object.keys(A),...Object.keys(B)])];
 const moves=names.map(name=>({product:name,from:A[name]??null,to:B[name]??null,delta:A[name]!=null&&B[name]!=null?B[name]-A[name]:null})).filter(x=>x.from!==x.to);
 return {a:a.id,b:b.id,topChanged:a.top!==b.top,topScoreDelta:a.topScore!=null&&b.topScore!=null?r1(b.topScore-a.topScore):null,moves};
}
function checks(results){const by=Object.fromEntries(results.map(x=>[x.id,x]));const pairs=[['R01','R02'],['R02','R03'],['R04','R05'],['R06','R07'],['S01','S02'],['X01','X02'],['X01','X03'],['D01','D02'],['D01','D03'],['Q01','Q02'],['C01','C02'],['M01','M10']];return pairs.map(([a,b])=>by[a]&&by[b]?comparePair(by[a],by[b]):{a,b,error:'missing case'});}
function run(){
 if(typeof state==='undefined')throw new Error('FORM state is not loaded.');if(!ENGINE())throw new Error('FORM_DRIVER_ENGINE_V80 is not loaded.');
 const results=CASES.map(runCase);const report={generatedAt:new Date().toISOString(),engine:'FORM_DRIVER_ENGINE_V80 stable scorer',caseCount:results.length,results,pairChecks:checks(results)};
 console.table(results.map(x=>({id:x.id,top:x.top,score:x.topScore,second:x.second,gap:x.gap12,current:x.currentDriver?.score??null,error:x.error||''})));
 console.table(report.pairChecks.map(x=>({pair:`${x.a}→${x.b}`,topChanged:x.topChanged,topScoreDelta:x.topScoreDelta,moves:x.moves?.length??0,error:x.error||''})));
 return report;
}
window.FORM_DRIVER_REGRESSION_V219={run,cases:CASES.map(x=>({id:x.id,notes:x.notes})),comparePair};
})();
