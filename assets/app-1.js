const fitSchemas={
 irons:{
  title:'Iron Fit',
  intro:'Build the right blend of distance, launch, forgiveness and feel.',
  questions:[
   {id:'priority',q:'What matters most in your irons?',type:'single',opts:['Consistency / dispersion','Distance','Forgiveness','Feel / feedback','Workability']},
   {id:'miss',q:'What is your most common iron miss?',type:'single',opts:['Thin','Fat','Toe','Heel','Left','Right','Two-way / inconsistent']},
   {id:'flight',q:'How would you describe your normal iron flight?',type:'single',opts:['Low','Mid','High','Too low','Too high','Not sure']},
   {id:'strike',q:'How consistent is your strike?',type:'single',opts:['Very consistent','Usually centered','Mixed','Quite inconsistent']},
   {id:'setmakeup',q:'Where do you want help in the set?',type:'single',opts:['Long irons','Mid irons','Short irons','Across the whole set','Not sure']}
  ],
  results:[
   ['Players-distance profile','Strong blend of speed, forgiveness and compact shaping.'],
   ['Game-improvement profile','Prioritize launch, stability and off-center performance.'],
   ['Combo-set profile','More help in the long irons with added control in scoring clubs.']
  ]
 },
 wedges:{
  title:'Wedge Fit',
  intro:'Match lofts, bounce and sole shape to your technique and turf.',
  questions:[
   {id:'conditions',q:'What conditions do you play most often?',type:'single',opts:['Firm / tight','Neutral','Soft / lush','Mixed']},
   {id:'delivery',q:'How do you deliver the club around the green?',type:'single',opts:['Shallow / picker','Neutral','Steep / digger','Not sure']},
   {id:'shots',q:'Which shots matter most?',type:'single',opts:['Full swings','Standard pitches','Open-face shots','Bunkers','All-around versatility']},
   {id:'bunker',q:'What is your typical bunker condition?',type:'single',opts:['Firm / shallow sand','Average','Soft / fluffy','Varies']},
   {id:'gapping',q:'How confident are you in your wedge gapping?',type:'single',opts:['Very confident','Pretty good','Needs work','No idea']}
  ],
  results:[
   ['Mid-bounce versatile setup','Balanced sole geometry for mixed conditions and multiple shot types.'],
   ['Higher-bounce protection','More forgiveness against digging and softer turf/sand.'],
   ['Lower-bounce precision','Better access from firm turf and shallow deliveries.']
  ]
 },
 putter:{
  title:'Putter Fit',
  intro:'Fit the way you aim, deliver and control speed—not just head shape.',
  questions:[
   {id:'miss',q:'What costs you the most strokes?',type:'single',opts:['Start line','Speed control','Short putts','Long putts','Everything varies']},
   {id:'stroke',q:'How would you describe your stroke?',type:'single',opts:['Mostly straight','Slight arc','Strong arc','Not sure']},
   {id:'aim',q:'What helps you aim best?',type:'single',opts:['Long alignment line','Small sightline / dot','No alignment aid','High contrast','Not sure']},
   {id:'head',q:'Which look gives you the most confidence?',type:'single',opts:['Blade','Mid-mallet','Large mallet','No preference']},
   {id:'feel',q:'What feel do you prefer?',type:'single',opts:['Soft','Medium','Firm / crisp','No preference']}
  ],
  results:[
   ['Stable mallet profile','Higher stability with strong alignment support.'],
   ['Mid-mallet profile','Balance of stability, feedback and moderate visual framing.'],
   ['Blade profile','Cleaner look with more face awareness and feedback.']
  ]
 },
 ball:{title:'Golf Ball Fit',intro:'Build a ball profile from launch, flight, scoring needs and playing conditions.',questions:[
{id:'currentBall',q:'What ball are you playing now?',type:'single',opts:['Pro V1','Pro V1x','AVX','Chrome Tour','Chrome Tour X','TP5','TP5x','Tour B X','Tour B XS','Z-Star','Z-Star XV','Maxfli Tour','Other / not sure']},
{id:'speed',q:'What is your driver swing speed?',type:'single',opts:['Under 85 mph','85–94 mph','95–104 mph','105–114 mph','115+ mph','Not sure']},
{id:'driverSpin',q:'What is your driver spin?',type:'single',opts:['Under 2,000 rpm','2,000–2,399 rpm','2,400–2,799 rpm','2,800–3,199 rpm','3,200+ rpm','Feels low','Feels normal','Feels high','No idea']},
{id:'driverFlight',q:'How would you describe your driver flight?',type:'single',opts:['Low / falls out of air','Mid penetrating','High but strong','Too high / balloons','Varies','Not sure']},
{id:'ironFlight',q:'What do you want from your iron flight?',type:'single',opts:['More height','Current window is good','Lower / more penetrating','More stopping power','More distance']},
{id:'greenside',q:'How much greenside check do you want?',type:'single',opts:['Maximum possible','High','Balanced','I prefer release','Not sure']},
{id:'feel',q:'What feel do you prefer?',type:'single',opts:['Very soft','Soft','Medium','Firm / fast','No preference']},
{id:'conditions',q:'What conditions matter most?',type:'single',opts:['Wind stability','Firm greens','Soft greens','Cold weather','Hot weather','Mixed conditions']},
{id:'priority',q:'If the ball has to compromise somewhere, what matters most?',type:'single',opts:['Driver distance','Driver dispersion','Iron consistency','Approach stopping power','Greenside control','Feel','Value']}],results:[]},
 apparel:{
  title:'Apparel + Shoe Fit',
  intro:'Performance only works if you actually feel like yourself wearing it.',
  questions:[
   {id:'style',q:'Which style feels most like you?',type:'single',opts:['Classic / traditional','Modern clean','Athletic / technical','Bold / edgy','Relaxed / lifestyle']},
   {id:'fit',q:'How do you like golf clothes to fit?',type:'single',opts:['Trim','Tailored but comfortable','Regular','Relaxed']},
   {id:'climate',q:'What conditions do you play most?',type:'single',opts:['Hot / humid','Mild','Cool','Cold / layered','All conditions']},
   {id:'walk',q:'How do you usually play?',type:'single',opts:['Mostly walk','Mix of walking and riding','Mostly ride']},
   {id:'shoe',q:'What matters most in shoes?',type:'single',opts:['Walking comfort','Traction','Waterproofing','Lightweight feel','Style']}
  ],
  results:[
   ['Modern performance profile','Technical fabrics, clean shaping and athletic footwear.'],
   ['Classic premium profile','Traditional styling, refined fit and understated branding.'],
   ['Lifestyle comfort profile','Versatile off-course style with comfort-first footwear.']
  ]
 },
 gloves:{
  title:'Glove Fit',
  intro:'Dial in fit, feel, durability and weather performance.',
  questions:[
   {id:'fit',q:'How do you like a glove to fit?',type:'single',opts:['Very tight / second skin','Snug','Comfortable','Roomy']},
   {id:'material',q:'What matters most?',type:'single',opts:['Maximum feel','Durability','Wet-weather grip','Value','No preference']},
   {id:'weather',q:'What conditions do you play in most?',type:'single',opts:['Dry','Hot / humid','Wet','Cold','Mixed']},
   {id:'wear',q:'How quickly do you wear through gloves?',type:'single',opts:['Very quickly','Average','They last a long time','Not sure']},
   {id:'hand',q:'Any fit issue you commonly notice?',type:'single',opts:['Palm too loose','Fingers too long','Fingers too short','Too tight across knuckles','No issue']}
  ],
  results:[
   ['Premium cabretta profile','Best for maximum feel and precise fit.'],
   ['Performance synthetic blend','Better durability and moisture management.'],
   ['All-weather profile','Grip-focused materials for humid and wet conditions.']
  ]
 },
 bags:{
  title:'Golf Bag Fit',
  intro:'Fit the way you actually play and carry your gear.',
  questions:[
   {id:'mode',q:'How do you play most rounds?',type:'single',opts:['Carry','Push cart','Riding cart','Mix of all three']},
   {id:'storage',q:'How much storage do you want?',type:'single',opts:['Minimal','Moderate','A lot','Maximum organization']},
   {id:'weight',q:'How important is bag weight?',type:'single',opts:['Critical','Important','Somewhat important','Not important']},
   {id:'divider',q:'What club organization do you prefer?',type:'single',opts:['4–5 way','6–8 way','14 way','No preference']},
   {id:'style',q:'Which bag personality fits you?',type:'single',opts:['Classic','Minimal modern','Tour-inspired','Bold / colorful','No preference']}
  ],
  results:[
   ['Lightweight stand-bag profile','Best for walking with enough storage and easy carry.'],
   ['Hybrid bag profile','Versatile across walking, push cart and riding use.'],
   ['Cart-bag profile','Maximum organization and storage for riding-focused golfers.']
  ]
 }
};

let activeCat=null, catStep=0, catAnswers={};

function startCategoryFit(id){
 if(id==='driver'){showPage('driver');return;}
 activeCat=id; catStep=0; catAnswers={};
 showPage('categoryFit'); renderCategoryFit();
}

function renderCategoryFit(){
 const schema=fitSchemas[activeCat]; if(!schema)return;
 const host=document.getElementById('catQuestionHost');
 const total=schema.questions.length;
 document.getElementById('catStepCount').textContent=String(Math.min(catStep+1,total)).padStart(2,'0')+' / '+String(total).padStart(2,'0');
 document.getElementById('catProgressBar').style.width=((catStep+1)/total*100)+'%';
 document.getElementById('catBack').style.visibility=catStep===0?'hidden':'visible';

 if(catStep>=total){ renderCategoryResults(); return; }

 const q=schema.questions[catStep];
 host.innerHTML=`<div class="catQuestion"><div class="eyebrow">${schema.title}</div><h1>${q.q}</h1><p class="lead">${schema.intro}</p><div class="catOptions">${q.opts.map(o=>`<button class="catOpt ${catAnswers[q.id]===o?'on':''}" data-cat-value="${o}">${o}</button>`).join('')}</div></div>`;
 host.querySelectorAll('[data-cat-value]').forEach(b=>b.onclick=()=>{
   catAnswers[q.id]=b.dataset.catValue;
   host.querySelectorAll('.catOpt').forEach(x=>x.classList.remove('on'));b.classList.add('on');
 });
 document.getElementById('catNext').textContent=catStep===total-1?'Build my fit →':'Continue →';
 document.getElementById('catNav').style.display='flex';
}

function renderCategoryResults(){
 const schema=fitSchemas[activeCat];
 document.getElementById('catStepCount').textContent='FIT COMPLETE';
 document.getElementById('catProgressBar').style.width='100%';
 document.getElementById('catNav').style.display='none';
 const vals=Object.values(catAnswers);
 let completeness=Math.round(vals.length/schema.questions.length*100);
 const ranked=schema.results.map((r,i)=>({name:r[0],reason:r[1],score:Math.max(78,94-i*5 + (completeness===100?1:0))}));
 document.getElementById('catQuestionHost').innerHTML=`
   <div class="eyebrow">${schema.title}</div><h1>Your fit profile.</h1>
   <div class="catSummary"><b>${completeness}% profile completeness</b><div class="catPills">${vals.slice(0,5).map(v=>`<span class="catPill">${v}</span>`).join('')}</div></div>
   <div class="catResultGrid">${ranked.map((r,i)=>`<div class="catResultCard"><div class="fitMeta">Match ${i+1}</div><h3>${r.name}</h3><div class="catScore">${r.score}</div><div class="catReason">${r.reason}</div></div>`).join('')}</div>
   <div style="margin-top:22px"><button class="ghostBtn" onclick="showPage('fittings')">← Fit another category</button> <button class="solidBtn" onclick="showPage('profile')">Save to profile</button></div>`;
}

document.getElementById('catBack').onclick=()=>{if(catStep>0){catStep--;renderCategoryFit()}};
document.getElementById('catNext').onclick=()=>{
 const schema=fitSchemas[activeCat], q=schema.questions[catStep];
 if(!catAnswers[q.id]) return;
 catStep++; renderCategoryFit();
};

const fitCatalog=[
 ['driver','Driver','Ball flight, strike, launch data, current gamer, priorities and upgrade value.','Live prototype'],
 ['irons','Irons','Distance gaps, launch, turf interaction, forgiveness, feel and set composition.','Interactive fit'],
 ['wedges','Wedges','Loft matrix, bounce, grind, turf and sand conditions, technique and gapping.','Interactive fit'],
 ['putter','Putter','Stroke profile, aim system, miss pattern, head shape, alignment and feel.','Interactive fit'],
 ['ball','Golf Ball','Speed, launch, spin, feel, greenside priorities and conditions.','Interactive fit'],
 ['apparel','Apparel + Shoes','Fit, climate, walking habits, style, brand personality and budget.','Interactive fit'],
 ['gloves','Gloves','Hand size, fit preference, weather, durability and feel.','Interactive fit'],
 ['bags','Bags','Walk vs ride, storage, weight, organization, style and course habits.','Interactive fit']
];
function showPage(name){
 document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
 if(name==='driver'){document.getElementById('driverExperience').classList.add('active');window.scrollTo({top:0,behavior:'smooth'});return;}
 const el=document.getElementById('page-'+name); if(el)el.classList.add('active');
 document.querySelectorAll('[data-page-nav]').forEach(b=>b.classList.toggle('active',b.dataset.pageNav===name));
 window.scrollTo({top:0,behavior:'smooth'});
}
function openFit(id){startCategoryFit(id)}
document.querySelectorAll('[data-page-nav]').forEach(b=>b.onclick=()=>showPage(b.dataset.pageNav));
document.querySelectorAll('[data-fit]').forEach(b=>b.onclick=()=>openFit(b.dataset.fit));
const grid=document.getElementById('allFitCards');
if(grid)grid.innerHTML=fitCatalog.map(x=>`<div class="fitCard"><div><div class="fitMeta">${x[3]}</div><h3>${x[1]}</h3><p>${x[2]}</p></div><button data-fit="${x[0]}">Start fit →</button></div>`).join('');
if(grid)grid.querySelectorAll('[data-fit]').forEach(b=>b.onclick=()=>openFit(b.dataset.fit));



// Catalog declaration loaded from assets/catalog-data.js

const state={handed:null,start:'straight',curve:'straight',costly:'two_way',strike:'heel',priority:'forgiveness',style:'balanced',current:'good',lm:'none',metrics:{speed:{mode:'unknown',value:null},spin:{mode:'unknown',value:null},aoa:{mode:'unknown',value:null},launch:{mode:'unknown',value:null}},currentClub:{brand:'',model:'',loft:'',flex:'',problems:[]},ranks:{accuracy:1,distance:2,flight:3,feel:4,looks:5,value:6}};
let step=1;

document.querySelectorAll('[data-group]').forEach(g=>g.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{
 g.querySelectorAll('.opt').forEach(x=>x.classList.remove('on'));b.classList.add('on');state[g.dataset.group]=b.dataset.v;
 if(['handed','start','curve'].includes(g.dataset.group)) updateDerived();
 if(g.dataset.group==='lm') renderLMInputs();
 
}));

function physicalFinish(handed,curve){
 if(curve==='straight')return 'center'; if(curve==='varies')return 'varies';
 const leftForRH=['draw','hook'].includes(curve);
 return handed==='right'?(leftForRH?'left':'right'):(leftForRH?'right':'left');
}
function curveClass(c){if(['hook','draw'].includes(c))return'draw_curve';if(['fade','slice'].includes(c))return'fade_curve';return c}
function normalizedStart(handed,start){
 if(start==='straight'||start==='varies')return start;
 if(handed==='right')return start==='left'?'pull':'push';
 return start==='left'?'push':'pull';
}
function startDescription(handed,start){
 if(start==='straight')return 'Mostly straight';
 if(start==='varies')return 'Varies / not sure';
 const golfTerm=normalizedStart(handed,start);
 return `${start.charAt(0).toUpperCase()+start.slice(1)} (${golfTerm})`;
}
function updateDerived(){
 const el=document.getElementById('derived'); if(!el)return;
 const startTerm=normalizedStart(state.handed,state.start);
 const startText=state.start==='varies'?'an uncertain start':state.start==='straight'?'a mostly straight start':`a physical start ${state.start} (${startTerm})`;
 el.innerHTML=`FORM reads this as <b>${startText}</b> with <b>${state.curve}</b> curvature for a <b>${state.handed}-handed</b> golfer. That pattern typically finishes physically <b>${physicalFinish(state.handed,state.curve)}</b>.`;
}
function golfer(){
 const speedMetric=state.metrics.speed;
 const speed = speedMetric.mode==='exact' ? (+speedMetric.value||null) :
               speedMetric.mode==='range' ? ({'under80':77,'80-89':85,'90-99':95,'100-109':105,'110plus':113}[speedMetric.value]||null) :
               speedMetric.mode==='general' ? ({'slow':78,'moderate':87,'average':95,'fast':105,'veryfast':115}[speedMetric.value]||null) : null;
 const spinMetric=state.metrics.spin;
 const spin = spinMetric.mode==='exact' ? ((+spinMetric.value||0)<2200?'low':(+spinMetric.value||0)>3000?'high':'mid') :
              spinMetric.mode==='range' ? ({'under2000':'low','2000-2499':'low','2500-2999':'mid','3000-3499':'high','3500plus':'high'}[spinMetric.value]||'unknown') :
              spinMetric.mode==='general' ? ({'verylow':'low','low':'low','average':'mid','high':'high','veryhigh':'high'}[spinMetric.value]||'unknown') : 'unknown';
 const trajMetric=state.metrics.launch;
 const traj = trajMetric.mode==='exact' ? ((+trajMetric.value||0)<11?'low':(+trajMetric.value||0)>16?'high':'mid') :
              trajMetric.mode==='range' ? ({'under10':'low','10-12':'low','13-15':'mid','16-18':'high','19plus':'high'}[trajMetric.value]||'unknown') :
              trajMetric.mode==='general' ? ({'verylow':'low','low':'low','mid':'mid','high':'high','veryhigh':'high'}[trajMetric.value]||'unknown') : 'unknown';
 return {handed:state.handed,start:state.start,startClass:normalizedStart(state.handed,state.start),curve:state.curve,curveClass:curveClass(state.curve),costly:state.costly,strike:state.strike,priority:state.priority,style:state.style,current:state.current,
 hcp:15,speed,spin,traj,lm:state.lm,metrics:state.metrics,currentClub:state.currentClub,ranks:state.ranks};
}

const priorityOptions=[
['accuracy','Accuracy / forgiveness','Keep misses tighter and protect off-center strikes'],
['distance','Distance','Maximize useful distance'],
['flight','Ball flight','Get launch and spin into the right window'],
['feel','Feel / sound','Make the club feel right at impact'],
['looks','Looks / confidence','Like what you see when you set it down'],
['value','Price / value','Balance performance with what it costs']
];


// Catalog declaration loaded from assets/catalog-data.js


driverDB.TaylorMade['M2 (2019)']=["I don't know","9.5°","10.5°"];
driverDB.Mizuno['JPX ONE (2026)']=["I don't know","9.5°","10.5°"];
driverDB.Wilson['DYNAPWR Max+ (2026)']=["I don't know","9°","10.5°","12°"];
driverDB.Wilson['DYNAPWR LS (2025)']=["I don't know","8°","9°","10.5°"];
driverDB.PXG['Lightning (2026)']=["I don't know","8°","9°","10.5°"];
driverDB.PXG['Black Ops Ultra-Lite (2024)']=["I don't know","10.5°","12°"];
driverDB['Tour Edge']={
 'Exotics C725':["I don't know","8°","9°","10.5°"],
 'Exotics E725':["I don't know","9°","10.5°","12°"],
 'Exotics Max (2026)':["I don't know","9°","10.5°","12°"],
 'Hot Launch Max (2026)':["I don't know","9°","10.5°","12°"],
 'Hot Launch Max D (2026)':["I don't know","10.5°","12°"],
 'Other / older Tour Edge':["I don't know","9°","10.5°","12°"]
};

function initPriorityRank(){
 const box=document.getElementById('priorityRank'); if(!box)return;
 box.innerHTML=priorityOptions.map(([id,label,sub])=>`<div class="priorityItem"><div><b>${label}</b><small>${sub}</small></div><div class="rankSelectWrap"><select data-prank="${id}">${[1,2,3,4,5,6].map(n=>`<option value="${n}" ${state.ranks[id]===n?'selected':''}>${n}</option>`).join('')}</select></div></div>`).join('');
 box.querySelectorAll('[data-prank]').forEach(s=>s.onchange=()=>{
   const id=s.dataset.prank, next=+s.value, old=state.ranks[id];
   const swapId=Object.keys(state.ranks).find(k=>k!==id && state.ranks[k]===next);
   state.ranks[id]=next;
   if(swapId)state.ranks[swapId]=old;
   initPriorityRank();
 });
}
function fillSelect(el,values,placeholder){el.innerHTML=`<option value="">${placeholder}</option>`+values.map(v=>`<option>${v}</option>`).join('')}
function initCurrentClub(){
 const brand=document.getElementById('currentBrand'),model=document.getElementById('currentModel'),loft=document.getElementById('currentLoft'),flex=document.getElementById('currentFlex');if(!brand)return;
 fillSelect(brand,Object.keys(driverDB),"I don't know / select brand");brand.value=state.currentClub.brand;
 function models(){const vals=driverDB[state.currentClub.brand]?Object.keys(driverDB[state.currentClub.brand]):[];fillSelect(model,vals,"I don't know / select model");model.value=state.currentClub.model;lofts()}
 function lofts(){const vals=driverDB[state.currentClub.brand]?.[state.currentClub.model]||[];fillSelect(loft,vals,"I don't know / select loft");loft.value=state.currentClub.loft}
 brand.onchange=()=>{state.currentClub.brand=brand.value;state.currentClub.model='';state.currentClub.loft='';models()};
 model.onchange=()=>{state.currentClub.model=model.value;state.currentClub.loft='';lofts()};
 loft.onchange=()=>state.currentClub.loft=loft.value;flex.value=state.currentClub.flex||'';flex.onchange=()=>state.currentClub.flex=flex.value;models();
 const box=document.getElementById('problems');if(box)box.querySelectorAll('button').forEach(btn=>{btn.classList.toggle('on',state.currentClub.problems.includes(btn.dataset.v));btn.onclick=()=>{const a=state.currentClub.problems,v=btn.dataset.v,k=a.indexOf(v);k>=0?a.splice(k,1):a.push(v);btn.classList.toggle('on')}});
}
function rankedWeight(g,id){const r=g.ranks[id];return r?({1:7,2:5,3:3,4:2,5:1}[r]||0):0}
function currentBenchmark(g){let b=82,c=g.currentClub;if(c.model)b+=3;if(g.current==='great')b+=6;else if(g.current==='good')b+=3;else if(g.current==='mixed')b-=3;else if(g.current==='poor')b-=8;if(c.problems.includes('dispersion'))b-=4;if(c.problems.includes('forgiveness'))b-=3;if(c.problems.includes('distance'))b-=3;if(c.problems.some(x=>x.startsWith('spin_')))b-=2;if(c.problems.some(x=>x.startsWith('launch_')))b-=2;return Math.max(64,Math.min(95,b))}

function fitLetter(score){
 if(score>=94)return'A+';
 if(score>=90)return'A';
 if(score>=87)return'A-';
 if(score>=83)return'B+';
 if(score>=80)return'B';
 if(score>=77)return'B-';
 if(score>=73)return'C+';
 if(score>=70)return'C';
 return'C-';
}
function currentFitConfidence(g){
 let pts=0;
 if(g.currentClub.brand)pts+=2;
 if(g.currentClub.model)pts+=3;
 if(g.currentClub.loft)pts+=1;
 if(g.currentClub.flex)pts+=1;
 if(g.speed)pts+=2;
 if(g.curve!=='varies')pts+=1;
 if(g.start!=='varies')pts+=1;
 if(g.strike!=='unknown')pts+=1;
 const precision=Object.values(g.metrics||{}).filter(m=>m.mode==='exact'||m.mode==='range').length;
 pts+=Math.min(3,precision);
 if(pts>=11)return'High confidence';
 if(pts>=7)return'Good confidence';
 if(pts>=4)return'Moderate confidence';
 return'Limited confidence';
}
function currentFitWhy(g,score){
 let reasons=[];
 if(g.current==='great'||g.current==='good')reasons.push('you report that the current driver already performs reasonably well');
 if(g.current==='mixed'||g.current==='poor')reasons.push('your satisfaction with the current driver leaves meaningful room for improvement');
 if(g.currentClub.problems.includes('dispersion'))reasons.push('dispersion is a known weakness');
 if(g.currentClub.problems.includes('forgiveness'))reasons.push('off-center forgiveness is a known weakness');
 if(g.currentClub.problems.includes('distance'))reasons.push('distance is a known weakness');
 if(g.currentClub.problems.some(x=>x.startsWith('spin_')))reasons.push('spin behavior is a known weakness');
 if(g.currentClub.problems.some(x=>x.startsWith('launch_')))reasons.push('launch window is a known weakness');
 if(!reasons.length)reasons.push('your current setup does not show an obvious mismatch from the information provided');
 return `FORM models this as a ${fitLetter(score)} fit because ${reasons.slice(0,2).join(' and ')}. This is a profile-based fit grade, not measured head-to-head performance.`;
}
function upgradeLevel(d){if(d>=10)return['HIGH','A materially better fit appears to be available.'];if(d>=5)return['MODERATE','There is enough projected improvement to justify a head-to-head test.'];if(d>=2)return['LOW','A new model may improve a few areas, but your current driver remains a strong fit.'];return['NO COMPELLING REASON','FORM would keep your current driver unless testing proves a meaningful gain.']}
const metricDefs={
 speed:{label:'Club speed',unit:'mph',min:45,max:140,step:1,decimals:0,
   exact:'e.g. 97',
   range:[['under75','Under 75'],['75-84','75–84'],['85-89','85–89'],['90-94','90–94'],['95-99','95–99'],['100-104','100–104'],['105-109','105–109'],['110-114','110–114'],['115plus','115+'],['unknown','I don’t know']],
   general:[['belowavg','Below average'],['typical','Typical recreational speed'],['aboveavg','Above average'],['fast','Fast'],['veryfast','Very fast'],['unknown','I don’t know']]},
 spin:{label:'Driver spin',unit:'rpm',min:800,max:6000,step:50,decimals:0,
   exact:'e.g. 2650',
   range:[['under1500','Under 1,500'],['1500-1749','1,500–1,749'],['1750-1999','1,750–1,999'],['2000-2249','2,000–2,249'],['2250-2499','2,250–2,499'],['2500-2749','2,500–2,749'],['2750-2999','2,750–2,999'],['3000-3499','3,000–3,499'],['3500plus','3,500+'],['unknown','I don’t know']],
   general:[['verylow','Very low / falls out'],['low','Low / penetrating'],['mid','Mid-window'],['high','High / climbs'],['veryhigh','Very high / balloons'],['unknown','I don’t know']]},
 aoa:{label:'Attack angle',unit:'degrees',min:0,max:10,step:.1,decimals:1,
   exact:'e.g. 3.2',
   range:[['down6','More than 6° down'],['down4-6','4–6° down'],['down2-4','2–4° down'],['down0-2','0–2° down'],['neutral','Approximately level'],['up0-2','0–2° up'],['up2-4','2–4° up'],['up4-6','4–6° up'],['up6','More than 6° up'],['unknown','I don’t know']],
   general:[['steep','Clearly downward'],['slightdown','Slightly downward'],['neutral','Approximately level'],['slightup','Slightly upward'],['upward','Very upward'],['unknown','I don’t know']]},
 launch:{label:'Launch angle',unit:'degrees',min:0,max:35,step:.1,decimals:1,
   exact:'e.g. 13.8',
   range:[['under8','Under 8°'],['8-10','8–10°'],['10-12','10–12°'],['12-14','12–14°'],['14-16','14–16°'],['16-18','16–18°'],['18-20','18–20°'],['20plus','20°+'],['unknown','I don’t know']],
   general:[['verylow','Very low'],['low','Low'],['mid','Mid-window'],['high','High'],['veryhigh','Very high'],['unknown','I don’t know']]}
};

function metricStrength(mode){
 return mode==='exact'?'High precision':mode==='range'?'Strong signal':mode==='general'?'Useful signal':'Unknown';
}
function renderMetric(def,id,mode){
 const m=state.metrics[id];
 let body='';
 if(mode==='exact'){
   if(id==='aoa'){
     const raw=m.value==null?'':String(m.value);
     const neg=raw.startsWith('-'), abs=raw===''?'':Math.abs(+raw);
     body=`<div class="signedMetric">
       <div class="signPicker"><button type="button" class="${neg?'on':''}" data-sign="-">−</button><button type="button" class="${!neg&&raw!==''?'on':''}" data-sign="+">+</button></div>
       <input class="metricInput" data-metric-input="${id}" type="number" inputmode="decimal" min="${def.min}" max="${def.max}" step="${def.step}" placeholder="${def.exact}" value="${abs}">
       <button type="button" class="metricUnknown ${m.value==='unknown'?'on':''}" data-metric-unknown="${id}">I don’t know</button>
     </div>`;
   }else{
     body=`<div class="numericMetric">
       <input class="metricInput" data-metric-input="${id}" type="number" inputmode="${def.decimals?'decimal':'numeric'}" min="${def.min}" max="${def.max}" step="${def.step}" placeholder="${def.exact}" value="${m.value==='unknown'?'':(m.value||'')}">
       <button type="button" class="metricUnknown ${m.value==='unknown'?'on':''}" data-metric-unknown="${id}">I don’t know</button>
     </div>`;
   }
 }else if(mode==='range'){
   body=`<div class="metricChoices">${def.range.map(x=>`<button class="metricChoice ${m.value===x[0]?'on':''}" data-metric-pick="${id}" data-value="${x[0]}">${x[1]}</button>`).join('')}</div>`;
 }else if(mode==='general'){
   body=`<div class="metricChoices">${def.general.map(x=>`<button class="metricChoice ${m.value===x[0]?'on':''}" data-metric-pick="${id}" data-value="${x[0]}">${x[1]}</button>`).join('')}</div>`;
 }else{
   body=`<div class="note" style="margin-top:0">No problem. FORM will use other signals and may ask an easier follow-up if this becomes important.</div>`;
 }
 return `<div class="metricBox"><div class="metricTop"><b>${def.label}</b><span>${def.unit}</span></div>${body}<div class="signalStrength">${metricStrength(mode)}</div></div>`;
}

function renderLMInputs(){
 const box=document.getElementById('lmInputs'); if(!box)return;
 let mode=state.lm;
 if(mode==='none'){
   ['speed','spin','aoa','launch'].forEach(id=>state.metrics[id]={mode:'unknown',value:null});
   box.innerHTML=`<div class="derived"><b>No launch-monitor data needed.</b><br>FORM will keep learning from start direction, curvature, strike, trajectory and current equipment.</div>`;
    return;
 }
 ['speed','spin','aoa','launch'].forEach(id=>{state.metrics[id].mode=mode;if(state.metrics[id].value===null)state.metrics[id].value=null;});
 box.innerHTML=Object.entries(metricDefs).map(([id,def])=>renderMetric(def,id,mode)).join('');
 document.querySelectorAll('[data-metric-input]').forEach(inp=>{
   inp.oninput=()=>{
     const id=inp.dataset.metricInput,def=metricDefs[id];
     if(inp.value===''){state.metrics[id].value=null;return;}
     let v=Number(inp.value);
     if(!Number.isFinite(v))return;
     v=Math.max(def.min,Math.min(def.max,v));
     v=def.decimals===0?Math.round(v):Math.round(v*10)/10;
     if(id==='aoa'){
       const sign=inp.closest('.signedMetric').querySelector('.signPicker .on')?.dataset.sign||'+';
       v=(sign==='-'?-1:1)*Math.abs(v);
     }
     state.metrics[id].value=v;
   };
   inp.onblur=()=>renderLMInputs();
 });
 document.querySelectorAll('.signPicker button').forEach(btn=>btn.onclick=()=>{
   const wrap=btn.closest('.signedMetric'),inp=wrap.querySelector('[data-metric-input="aoa"]');
   wrap.querySelectorAll('.signPicker button').forEach(x=>x.classList.remove('on'));btn.classList.add('on');
   if(inp.value!=='')state.metrics.aoa.value=(btn.dataset.sign==='-'?-1:1)*Math.abs(Number(inp.value));
 });
 document.querySelectorAll('[data-metric-unknown]').forEach(btn=>btn.onclick=()=>{
   state.metrics[btn.dataset.metricUnknown].value='unknown';renderLMInputs();
 });
 document.querySelectorAll('[data-metric-pick]').forEach(btn=>btn.onclick=()=>{
   const id=btn.dataset.metricPick;state.metrics[id].value=btn.dataset.value;
   btn.parentElement.querySelectorAll('.metricChoice').forEach(x=>x.classList.remove('on'));btn.classList.add('on');
 });
 
}

function eligible(p,g){
 let reasons=[];
 if(g.speed&&(g.speed<p.speed_fit[0]-8||g.speed>p.speed_fit[1]+8))reasons.push('speed');
 if(g.spin==='low'&&p.spin<=1.5)reasons.push('lowspin');
 if(g.costly==='hook'&&p.draw_bias>=.8)reasons.push('drawbias');
 if(g.hcp>=15&&p.forgiveness<2.9&&g.priority!=='control')reasons.push('demanding');
 return reasons.length===0;
}
function candidateN(){
 const g=golfer(); return products.filter(p=>p.generation!=='previous_limited'&&eligible(p,g)).length;
}

function renderReview(){
 const g=golfer(), clubName=[g.currentClub.brand,g.currentClub.model].filter(Boolean).join(' ')||'Unknown', row=(a,b,q='Profile')=>`<div class="reviewRow"><span>${a}</span><b>${b}<span class="quality">${q}</span></b></div>`;
 document.getElementById('reviewBall').innerHTML=row('Handedness',g.handed,'Saved')+row('Start direction',startDescription(g.handed,g.start),'Observed')+row('Curvature',g.curve,'Observed')+row('Physical finish',physicalFinish(g.handed,g.curve),'Derived');
 document.getElementById('reviewStrike').innerHTML=row('Costly miss',g.costly,'Observed')+row('Strike',g.strike,'Observed');
 const techRow=(label,id)=>{const m=g.metrics[id];return row(label,m.value||'Unknown',m.mode==='unknown'?'Unknown':m.mode.charAt(0).toUpperCase()+m.mode.slice(1));};
 document.getElementById('reviewTech').innerHTML=row('LM route',g.lm==='none'?'No launch-monitor data':g.lm,'Route')+techRow('Club speed','speed')+techRow('Spin','spin')+techRow('Attack angle','aoa')+techRow('Launch','launch');
 const labels=Object.fromEntries(priorityOptions.map(x=>[x[0],x[1]])); const ranked=Object.entries(g.ranks).sort((a,b)=>a[1]-b[1]).map(x=>`#${x[1]} ${labels[x[0]]||x[0]}`).join(', '); document.getElementById('reviewPrefs').innerHTML=row('Current driver',clubName,'Benchmark')+row('Current-club issues',g.currentClub.problems.join(', ')||'None specified','Context')+row('Priorities',ranked,'Ranked')+row('Style',g.style,'Preference');
}
function renderStep(){
 document.querySelectorAll('.step').forEach(x=>x.classList.add('hidden'));
 const id=step<=9?'step'+step:'results';document.getElementById(id).classList.remove('hidden');
 document.getElementById('progressBar').style.width=(Math.min(step,9)/9*100)+'%';
 document.getElementById('stepCount').textContent=String(Math.min(step,9)).padStart(2,'0')+' / 09';
 document.getElementById('backBtn').style.visibility=step===1?'hidden':'visible';
 document.getElementById('nextBtn').style.display=step===9?'none':'inline-block';
 document.getElementById('flowNav').style.display=step>9?'none':'flex';
 if(step===3)updateDerived(); if(step===5)renderLMInputs(); if(step===6)initPriorityRank(); if(step===8)initCurrentClub(); if(step===9)renderReview(); window.scrollTo({top:0,behavior:'smooth'});
}
function next(){if(step<9){step++;renderStep()}}
function back(){if(step>1){step--;renderStep()}}
function goTo(n){step=n;renderStep()}
function score(p,g){
 let perf=80;if(g.speed){const mid=(p.speed_fit[0]+p.speed_fit[1])/2;perf-=Math.min(13,Math.abs(g.speed-mid)*.45)}
 if(g.costly==='slice'||g.curveClass==='fade_curve')perf+=p.draw_bias*7;
 if(g.costly==='hook'||g.curveClass==='draw_curve')perf-=p.draw_bias*7;
 if(g.costly==='two_way')perf+=(p.forgiveness-3.5)*3;
 if(['heel','toe','varied'].includes(g.strike))perf+=(p.forgiveness-3.5)*4;
 perf+=(p.forgiveness-3.5)*rankedWeight(g,'forgiveness');perf+=(p.forgiveness-3.5)*rankedWeight(g,'dispersion')*.8;
 if(g.priority==='control')perf+=['controlled','lowspin'].includes(p.player)?6:-2;
 perf+=(p.forgiveness-3.5)*rankedWeight(g,'accuracy');
 if(g.spin==='high'&&p.spin<=2)perf+=rankedWeight(g,'flight')*.8;
 if(g.spin==='low'&&p.spin>=3)perf+=rankedWeight(g,'flight')*.5;
 if(g.traj==='low'&&p.launch>=4)perf+=rankedWeight(g,'flight')*.6;
 if(g.traj==='high'&&p.launch<=2.5)perf+=rankedWeight(g,'flight')*.6;
 perf+=rankedWeight(g,'distance')*(p.player==='lowspin'&&g.spin==='high'?1:.35);
 if(g.spin==='high'&&p.spin<=2)perf+=7;if(g.spin==='low'&&p.spin>=3)perf+=4;
 if(g.traj==='low'&&p.launch>=4)perf+=5;if(g.traj==='high'&&p.launch<=2.5)perf+=5;
 perf=Math.max(45,Math.min(98,perf));let pref=80;if(g.style!=='balanced')pref+=p.style===g.style?12:-3;
 let overall=perf*.85+pref*.15;if(p.generation==='previous_limited')overall-=7;
 return {perf:Math.round(perf),pref:Math.round(pref),overall:Math.round(Math.min(98,overall))}
}
function confidence(g){
 let c=72;
 if(g.curve!=='varies')c+=5;if(g.start!=='varies')c+=4;if(g.costly!=='other')c+=4;if(g.strike!=='unknown')c+=4;
 const modes=Object.values(g.metrics).map(m=>m.mode);
 c+=modes.filter(x=>x==='exact').length*3;
 c+=modes.filter(x=>x==='range').length*2;
 c+=modes.filter(x=>x==='general').length*1;
 if(g.curve==='straight'&&['hook','slice'].includes(g.costly))c-=6;
 return Math.max(72,Math.min(95,c));
}
function why(p,g){
 let r=[];if(p.forgiveness>=4.6&&(g.priority==='forgiveness'||g.strike!=='center'))r.push('high stability matches your strike and dispersion needs');
 if((g.costly==='slice'||g.curveClass==='fade_curve')&&p.draw_bias>=.8)r.push('draw help fits the slice/fade pattern');
 if((g.costly==='hook'||g.curveClass==='draw_curve')&&p.draw_bias<.5)r.push('neutral bias avoids adding hook tendency');
 if(g.spin==='high'&&p.spin<=2)r.push('lower-spin profile fits reported spin');if(g.spin==='low'&&p.spin>=3)r.push('avoids an overly low-spin head');
 if(g.traj==='low'&&p.launch>=4)r.push('higher-launch profile supports trajectory');if(g.style!=='balanced'&&p.style===g.style)r.push('product personality matches your preference');
 if(!r.length)r.push('balanced fit across speed, launch and forgiveness');return r.slice(0,3).join('; ')
}
function showResults(){
 const g=golfer();const bench=currentBenchmark(g);const gamer=[g.currentClub.brand,g.currentClub.model].filter(Boolean).join(' ')||'Your current driver';const grade=fitLetter(bench);const gradeConfidence=currentFitConfidence(g);let rows=[];products.forEach(p=>{if(eligible(p,g))rows.push({p,s:score(p,g)})});rows.sort((a,b)=>b.s.overall-a.s.overall);
 const current=rows.filter(x=>x.p.generation!=='previous_limited').slice(0,5);const prev=rows.filter(x=>x.p.generation==='previous_limited')[0];const best=current.length?current[0].s.overall:bench;const delta=best-bench;const up=upgradeLevel(delta);
 step=10;document.querySelectorAll('.step').forEach(x=>x.classList.add('hidden'));document.getElementById('results').classList.remove('hidden');document.getElementById('flowNav').style.display='none';
 document.getElementById('progressBar').style.width='100%';document.getElementById('stepCount').textContent='FIT COMPLETE';document.getElementById('conf').textContent=confidence(g)+'%';
 document.getElementById('keep').innerHTML=`
      <div class="currentFitCard">
        <div class="currentFitTop">
          <div>
            <div class="eyebrow">Your current driver</div>
            <div class="currentFitName">${gamer}${g.currentClub.loft?` · ${g.currentClub.loft}`:''}</div>
            <span class="confidenceBadge">${gradeConfidence}</span>
          </div>
          <div class="gradeWrap">
            <div class="letterGrade">${grade}</div>
            <div><div class="headerMeta">Fit score</div><div class="numericGrade">${bench}/100</div></div>
          </div>
        </div>
        <div class="fitExplanation">${currentFitWhy(g,bench)}</div>
      </div>
      <div class="upgradeSummary">
        <div class="upgradeSummaryTop">
          <div>
            <div class="eyebrow">Upgrade value</div>
            <h3>${up[0]}</h3>
          </div>
          <div class="deltaScore">${delta>0?'+':''}${delta} fit points</div>
        </div>
        <div class="fitExplanation">${up[1]} ${current.length?`Your top modeled new fit is ${current[0].p.brand} ${current[0].p.model} at ${best}/100.`:''}</div>
      </div>`;
 document.getElementById('resultList').innerHTML=current.map((x,i)=>`<div class="result"><div class="rank">${String(i+1).padStart(2,'0')}</div><div><h3>${x.p.brand} ${x.p.model}</h3><div class="meta">${x.p.generation.replace('_',' ')} · approx $${x.p.price}</div><div class="reason">${why(x.p,g)}</div><div class="tags"><span class="tag">Performance ${x.s.perf}</span><span class="tag">Preference ${x.s.pref}</span></div></div><div class="score">${x.s.overall}</div></div>`).join('');
 document.getElementById('oracleTitle').textContent='Fit synthesized.';document.getElementById('signalList').innerHTML='<div class="signal"><span class="dot on"></span><span>Eligibility filters applied</span></div><div class="signal"><span class="dot on"></span><span>Performance and preference scores combined</span></div><div class="signal"><span class="dot on"></span><span>Current-generation policy enforced</span></div><div class="signal"><span class="dot on"></span><span>Upgrade threshold checked</span></div>';
 document.getElementById('candidateCount').textContent=current.length;
 window.scrollTo({top:0,behavior:'smooth'});
}
updateDerived();renderStep();


// Iteration 1: navigation and history
document.querySelectorAll('.brand').forEach(b=>b.onclick=()=>showPage('home'));
document.querySelectorAll('.mobileNav [data-page-nav], .siteFooter [data-page-nav]').forEach(b=>b.onclick=()=>showPage(b.dataset.pageNav));

const _showPageBase = showPage;
showPage = function(name){
  _showPageBase(name);
  if(location.hash !== '#'+name) history.replaceState(null,'','#'+name);
};
window.addEventListener('popstate',()=>{const p=(location.hash||'#home').slice(1);_showPageBase(p)});
if(location.hash && document.getElementById('page-'+location.hash.slice(1))) _showPageBase(location.hash.slice(1));



// Iteration 2: fitting UX and local persistence
const FORM_STORAGE_KEY='formGolfPrototype_v1';
function formLoad(){try{return JSON.parse(localStorage.getItem(FORM_STORAGE_KEY)||'{}')}catch(e){return {}}}
function formSave(data){localStorage.setItem(FORM_STORAGE_KEY,JSON.stringify(data))}
function toastSaved(){const e=document.getElementById('savedToast');if(!e)return;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1500)}
function saveFit(category, payload){
 const d=formLoad(); d.fits=d.fits||{}; d.fits[category]={...payload,savedAt:new Date().toISOString()}; formSave(d); toastSaved();
}

const _renderCategoryFitBase=renderCategoryFit;
renderCategoryFit=function(){
 _renderCategoryFitBase();
 const schema=fitSchemas[activeCat]; if(!schema || catStep>=schema.questions.length)return;
 const q=schema.questions[catStep];
 const next=document.getElementById('catNext');
 next.disabled=!catAnswers[q.id];
 const host=document.getElementById('catQuestionHost');
 const question=host.querySelector('.catQuestion');
 if(question){
   const hint=document.createElement('div');hint.className='answerHint';hint.textContent=catAnswers[q.id]?'Selection saved':'Choose one answer to continue';question.appendChild(hint);
 }
 host.querySelectorAll('[data-cat-value]').forEach(b=>{
   const old=b.onclick;
   b.onclick=()=>{old();next.disabled=false;const h=host.querySelector('.answerHint');if(h)h.textContent='Selection saved'};
 });
};

const _renderCategoryResultsBase=renderCategoryResults;
renderCategoryResults=function(){
 _renderCategoryResultsBase();
 const schema=fitSchemas[activeCat];
 const vals=Object.values(catAnswers);
 saveFit(activeCat,{answers:{...catAnswers},title:schema.title,completeness:Math.round(vals.length/schema.questions.length*100)});
};



// Iteration 3: answer-driven category scoring
const categoryCandidates={
 irons:[
  {name:'Players-distance profile',base:82,reason:'Speed and forgiveness in a cleaner shape.',hits:['Distance','Feel / feedback','Workability','Very consistent','Usually centered','Mid']},
  {name:'Game-improvement profile',base:82,reason:'Launch and stability for more consistent outcomes.',hits:['Forgiveness','Mixed','Quite inconsistent','Low','Too low','Across the whole set']},
  {name:'Combo-set profile',base:82,reason:'More help where you need it without giving up scoring-club control.',hits:['Long irons','Mid irons','Consistency / dispersion','Usually centered']}
 ],
 wedges:[
  {name:'Mid-bounce versatile setup',base:84,reason:'Balanced sole geometry for mixed conditions and multiple shot types.',hits:['Neutral','Mixed','All-around versatility','Average','Varies']},
  {name:'Higher-bounce protection',base:82,reason:'More protection against digging and softer turf or sand.',hits:['Soft / lush','Steep / digger','Soft / fluffy','Bunkers']},
  {name:'Lower-bounce precision',base:82,reason:'Better access from firm turf and shallower deliveries.',hits:['Firm / tight','Shallow / picker','Firm / shallow sand','Open-face shots']}
 ],
 putter:[
  {name:'Stable mallet profile',base:83,reason:'Stability and alignment support for start-line and speed-control consistency.',hits:['Start line','Speed control','Large mallet','Long alignment line','High contrast']},
  {name:'Mid-mallet profile',base:83,reason:'A blend of stability, feedback and moderate visual framing.',hits:['Slight arc','Mid-mallet','Medium','Short putts']},
  {name:'Blade profile',base:81,reason:'Cleaner visuals and face awareness for golfers who value feedback.',hits:['Strong arc','Blade','Firm / crisp','No alignment aid']}
 ],
 ball:[
  {name:'Tour X profile',base:83,reason:'Firmer, faster construction with a higher-flight performance window.',hits:['Firm / fast','Maximum speed','More carry','More height','Often']},
  {name:'Tour profile',base:85,reason:'Balanced long-game performance with strong scoring control.',hits:['Critical','Very important','Medium','Straighter flight','More stopping power']},
  {name:'Soft performance profile',base:82,reason:'Softer feel with playable launch and greenside performance.',hits:['Very soft','Soft','Moderately important','More carry']}
 ],
 apparel:[
  {name:'Modern performance profile',base:84,reason:'Technical fabrics, athletic shaping and performance-first footwear.',hits:['Modern clean','Athletic / technical','Trim','Hot / humid','Mostly walk','Walking comfort','Lightweight feel']},
  {name:'Classic premium profile',base:84,reason:'Traditional styling, refined fit and understated presentation.',hits:['Classic / traditional','Tailored but comfortable','Mild','Style']},
  {name:'Lifestyle comfort profile',base:82,reason:'Versatile off-course style with comfort as the lead requirement.',hits:['Relaxed / lifestyle','Regular','Relaxed','Mostly ride','Walking comfort']}
 ],
 gloves:[
  {name:'Premium cabretta profile',base:84,reason:'Maximum feel with a precise second-skin fit.',hits:['Very tight / second skin','Snug','Maximum feel','Dry']},
  {name:'Performance synthetic blend',base:83,reason:'Better durability and moisture management for regular play.',hits:['Durability','Hot / humid','Very quickly','Value']},
  {name:'All-weather profile',base:82,reason:'Grip-focused construction for moisture and variable conditions.',hits:['Wet-weather grip','Wet','Cold','Mixed']}
 ],
 bags:[
  {name:'Lightweight stand-bag profile',base:84,reason:'Low carry weight with enough storage for walking rounds.',hits:['Carry','Minimal','Moderate','Critical','Important','4–5 way']},
  {name:'Hybrid bag profile',base:84,reason:'Versatility across walking, push-cart and riding use.',hits:['Push cart','Mix of all three','Moderate','6–8 way','Minimal modern']},
  {name:'Cart-bag profile',base:83,reason:'Maximum storage and organization for riding-focused golf.',hits:['Riding cart','A lot','Maximum organization','14 way','Not important']}
 ]
};
function intelligentCategoryResults(category, answers){
 const vals=Object.values(answers);
 const cs=(categoryCandidates[category]||[]).map(c=>{
   let score=c.base, matched=[];
   vals.forEach(v=>{if(c.hits.includes(v)){score+=3;matched.push(v)}});
   return {...c,score:Math.min(97,score),matched};
 }).sort((a,b)=>b.score-a.score);
 return cs;
}
renderCategoryResults=function(){
 const schema=fitSchemas[activeCat];
 document.getElementById('catStepCount').textContent='FIT COMPLETE';
 document.getElementById('catProgressBar').style.width='100%';
 document.getElementById('catNav').style.display='none';
 const vals=Object.values(catAnswers);
 const completeness=Math.round(vals.length/schema.questions.length*100);
 const ranked=intelligentCategoryResults(activeCat,catAnswers);
 const confidence=completeness===100?'Good confidence':completeness>=80?'Moderate confidence':'Limited confidence';
 document.getElementById('catQuestionHost').innerHTML=`
   <div class="eyebrow">${schema.title}</div><h1>Your fit profile.</h1>
   <div class="catSummary"><b>${confidence}</b><div class="catPills">${vals.map(v=>`<span class="catPill">${v}</span>`).join('')}</div></div>
   <div class="catResultGrid">${ranked.map((r,i)=>`<div class="catResultCard"><div class="fitMeta">Match ${i+1}</div><h3>${r.name}</h3><div class="catScore">${r.score}</div><div class="confidenceLine">Profile fit / 100</div><div class="catReason">${r.reason}</div><div class="resultWhy">${r.matched.length?'Driven by: '+r.matched.slice(0,3).join(' · '):'This is the balanced baseline for the answers you provided.'}</div></div>`).join('')}</div>
   <div style="margin-top:22px"><button class="ghostBtn" onclick="showPage('fittings')">← Fit another category</button> <button class="solidBtn" onclick="showPage('profile')">View my profile</button></div>`;
 saveFit(activeCat,{answers:{...catAnswers},title:schema.title,completeness,topMatch:ranked[0]?.name,topScore:ranked[0]?.score,confidence});
};



// Iteration 4: dynamic profile and saved fit history
function profileData(){
 const d=formLoad(); d.profile=d.profile||{name:'Golfer',handed:'Right',handicap:'',driverSpeed:'',style:'No strong preference',email:''};return d;
}
function saveProfileFromUI(){
 const d=profileData();
 ['name','handed','handicap','driverSpeed','style','email'].forEach(k=>{const e=document.getElementById('prof_'+k);if(e)d.profile[k]=e.value});
 formSave(d);toastSaved();renderProfilePage();
}
