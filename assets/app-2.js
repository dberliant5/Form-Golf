function renderProfilePage(){
 const page=document.getElementById('page-profile');if(!page)return;
 const d=profileData(),p=d.profile,f=d.fits||{};
 const fitCount=Object.keys(f).length;
 const completeness=[p.handed,p.handicap,p.driverSpeed,p.style,p.email].filter(Boolean).length;
 page.innerHTML=`<div class="heroSite"><div class="eyebrow">My Profile</div><h1>Your golfer DNA.</h1><p class="heroSub">Keep this current and every fitting gets smarter without making you repeat the basics.</p></div>
 <div class="profileGrid">
  <div class="profileCard"><div class="avatar">${(p.name||'G').slice(0,2).toUpperCase()}</div><h3>${p.name||'Golfer'}</h3><div class="fitMeta">${fitCount} saved fit${fitCount===1?'':'s'}</div>
   <div class="statGrid"><div class="stat"><b>${p.driverSpeed||'—'}</b><span>Driver mph</span></div><div class="stat"><b>${p.handicap||'—'}</b><span>Handicap</span></div><div class="stat"><b>${(p.handed||'—').slice(0,1)}</b><span>Handed</span></div></div>
  </div>
  <div class="bagCard"><div class="eyebrow">Profile details</div><h2>Keep FORM current.</h2>
   <div class="profileEditor">
    <div><label>Name</label><input id="prof_name" value="${p.name||''}"></div>
    <div><label>Email</label><input id="prof_email" value="${p.email||''}" placeholder="Optional for prototype"></div>
    <div><label>Handedness</label><select id="prof_handed"><option ${p.handed==='Right'?'selected':''}>Right</option><option ${p.handed==='Left'?'selected':''}>Left</option></select></div>
    <div><label>Handicap</label><input id="prof_handicap" value="${p.handicap||''}" placeholder="e.g. 14"></div>
    <div><label>Driver speed</label><input id="prof_driverSpeed" value="${p.driverSpeed||''}" placeholder="e.g. 97"></div>
    <div><label>Style</label><select id="prof_style">${['No strong preference','Classic','Modern clean','Athletic / technical','Bold / edgy','Relaxed / lifestyle'].map(x=>`<option ${p.style===x?'selected':''}>${x}</option>`).join('')}</select></div>
   </div><button class="solidBtn" style="margin-top:20px" onclick="saveProfileFromUI()">Save profile</button>
  </div>
 </div>
 <div class="sectionHead"><div><div class="eyebrow">My fits</div><h2>Fit history</h2></div><p>Your completed fittings live here and become the foundation for future product alerts and bag audits.</p></div>
 <div>${fitCount?Object.entries(f).map(([k,x])=>`<div class="fitHistoryRow"><small>${x.title||k}</small><b>${x.topMatch||'Fit saved'}</b><span class="gradePill">${x.topScore||x.completeness||'✓'}</span></div>`).join(''):`<div class="emptyState">No saved fits yet. Complete a fitting and it will automatically appear here.</div>`}</div>`;
}
function renderFitsHub(){
 const page=document.getElementById('page-resultsHub');if(!page)return;
 const f=formLoad().fits||{},entries=Object.entries(f);
 page.innerHTML=`<div class="heroSite"><div class="eyebrow">My Fits</div><h1>Your recommendations, in one place.</h1><p class="heroSub">Track completed fittings and return to categories as your game or equipment changes.</p></div>
 <div>${entries.length?entries.map(([k,x])=>`<div class="fitHistoryRow"><small>${x.title||k}</small><b>${x.topMatch||'Saved fit'}</b><div><span class="gradePill">${x.topScore||'✓'}</span><button class="ghostBtn" style="margin-left:8px" onclick="openFit('${k}')">Refit</button></div></div>`).join(''):`<div class="emptyState">You haven't completed a fit yet. Start with the category that matters most to you.</div>`}</div>
 <button class="solidBtn" style="margin-top:20px" onclick="showPage('fittings')">Explore fittings</button>`;
}
const _showPageV25=showPage;
showPage=function(name){
 _showPageV25(name);
 if(name==='profile')renderProfilePage();
 if(name==='resultsHub')renderFitsHub();
};
renderProfilePage();renderFitsHub();

// Capture the deeper driver fitting into saved profile data too.
const _driverShowResults=showResults;
showResults=function(){
 _driverShowResults();
 try{
  const g=golfer(),bench=currentBenchmark(g);
  saveFit('driver',{title:'Driver Fit',currentClub:[g.currentClub.brand,g.currentClub.model].filter(Boolean).join(' '),topMatch:'Driver recommendation saved',topScore:bench,confidence:currentFitConfidence(g)});
 }catch(e){}
};



// Iteration 5: trust, monetization clarity and final polish
(function polishHome(){
 const home=document.getElementById('page-home');if(!home)return;
 const hero=home.querySelector('.heroSite');
 if(hero && !home.querySelector('.trustBar')){
   hero.insertAdjacentHTML('afterend',`<div class="trustBar">
    <div class="trustItem"><b>Independent fit logic</b><span>Products are ranked against your profile—not simply by launch date or brand.</span></div>
    <div class="trustItem"><b>Upgrade only when warranted</b><span>Your current equipment is the benchmark a new product has to beat.</span></div>
    <div class="trustItem"><b>Affiliate-supported</b><span>FORM may earn a commission when you buy through eligible links; fit ranking should remain independent of commission.</span></div>
   </div>`);
 }
 const why=home.querySelector('.newsletter');
 if(why && !home.querySelector('.productRoadmap')){
   why.insertAdjacentHTML('beforebegin',`<div class="sectionHead"><div><div class="eyebrow">Product intelligence</div><h2>Built to stay current.</h2></div><p>The production version will maintain current-model eligibility, product attributes and affiliate destinations so recommendations don't quietly go stale.</p></div>
   <div class="productRoadmap">
    <div class="roadmapCard"><b>Current-generation catalog</b><p>Recommend current products by default and retain prior-generation models only when they offer a compelling fit or value case.</p></div>
    <div class="roadmapCard"><b>Fit evidence</b><p>Store product traits—launch, spin, bias, forgiveness, shape, feel and intended player—separately from marketing copy. The prototype now uses this attribute layer to grade My Bag.</p></div>
    <div class="roadmapCard"><b>Purchase routing</b><p>Prefer manufacturer affiliate links, with an all-brand retailer as fallback when a direct program isn't available.</p></div>
   </div>`);
 }
})();
(function clarifyPrototype(){
 const login=document.getElementById('page-login');if(login && !login.querySelector('.prototypeNote')){
   const box=login.querySelector('.accountBox');
   if(box)box.insertAdjacentHTML('afterbegin','<div class="prototypeNote"><b>Prototype:</b> account authentication is not connected to a backend yet. Profile data in this build is stored only in this browser.</div>');
 }
})();


const formBallDB=[
['Titleist Pro V1',3,2.7,3.7,4.5,2.7,4.4,4,2.4],['Titleist Pro V1x',4.2,3.1,4.3,4.6,3.5,4.1,4.3,2.4],['Titleist AVX',2.5,2,2.7,3.4,1.8,4.5,3.8,2.5],
['Callaway Chrome Tour',3.2,2.6,3.8,4.5,2.8,4.3,4.2,2.5],['Callaway Chrome Tour X',4,3.2,4.4,4.7,3.7,4,4.5,2.5],['TaylorMade TP5',3,2.8,4,4.6,2.3,4.1,4,2.5],['TaylorMade TP5x',4.1,2.7,3.7,4.2,3.7,4.2,4.6,2.5],
['Bridgestone Tour B X',3.5,2.4,3.5,4,3.5,4.4,4.6,2.7],['Bridgestone Tour B XS',3.4,3,4.2,4.8,2.4,4,4,2.7],['Srixon Z-Star',3,2.6,3.9,4.5,2.5,4.2,4,3.1],['Srixon Z-Star XV',3.8,2.5,3.6,4.1,3.7,4.4,4.6,3.1],['Maxfli Tour',3.2,2.6,3.7,4.1,2.8,4.1,4.1,4.5]
].map(x=>({name:x[0],launch:x[1],ds:x[2],is:x[3],green:x[4],feel:x[5],wind:x[6],speed:x[7],value:x[8]}));
function formBallTarget(a){let x={launch:3,ds:2.7,is:3.7,green:3.8,feel:3,wind:3,speed:3.8,value:2.5};if(a.driverSpin==='Feels high'||a.driverSpin==='3,200+ rpm')x.ds=1.8;if(a.driverSpin==='Feels low'||a.driverSpin==='Under 2,000 rpm')x.ds=3.6;if(a.driverFlight==='Low / falls out of air')x.launch=4.2;if(a.driverFlight==='Too high / balloons')x.launch=2.1;if(a.ironFlight==='More height')x.launch=4.2;if(a.ironFlight==='Lower / more penetrating')x.launch=2.2;if(a.ironFlight==='More stopping power')x.is=4.6;x.green={'Maximum possible':4.9,'High':4.5,'Balanced':3.8,'I prefer release':2.7}[a.greenside]||3.8;x.feel={'Very soft':1.4,'Soft':2.1,'Medium':3,'Firm / fast':4.3}[a.feel]||3;if(a.conditions==='Wind stability')x.wind=4.8;if(a.conditions==='Firm greens'){x.green=Math.max(x.green,4.5);x.is=Math.max(x.is,4.4)}if(a.priority==='Driver distance')x.speed=4.9;if(a.priority==='Value')x.value=4.8;return x}
function formBallScore(b,a){let x=formBallTarget(a),w={launch:1.4,ds:1.7,is:1.4,green:1.5,feel:.8,wind:.7,speed:1.2,value:.35};if(a.priority==='Driver distance'){w.speed=2.8;w.ds=2.1}if(a.priority==='Driver dispersion'){w.wind=2;w.ds=2}if(a.priority==='Iron consistency'){w.is=2.5;w.launch=2}if(a.priority==='Approach stopping power'){w.is=2.8;w.green=2}if(a.priority==='Greenside control')w.green=3.2;if(a.priority==='Feel')w.feel=3;if(a.priority==='Value')w.value=3;let err=0,max=0;Object.keys(w).forEach(k=>{err+=Math.abs(b[k]-x[k])*w[k];max+=4*w[k]});return Math.round(100-err/max*32)}
const _formBaseResults=renderCategoryResults;
renderCategoryResults=function(){if(activeCat!=='ball'){_formBaseResults();return}let ranked=formBallDB.map(b=>({...b,score:formBallScore(b,catAnswers)})).sort((a,b)=>b.score-a.score),best=ranked[0],map={'Pro V1':'Titleist Pro V1','Pro V1x':'Titleist Pro V1x','AVX':'Titleist AVX','Chrome Tour':'Callaway Chrome Tour','Chrome Tour X':'Callaway Chrome Tour X','TP5':'TaylorMade TP5','TP5x':'TaylorMade TP5x','Tour B X':'Bridgestone Tour B X','Tour B XS':'Bridgestone Tour B XS','Z-Star':'Srixon Z-Star','Z-Star XV':'Srixon Z-Star XV','Maxfli Tour':'Maxfli Tour'},cur=ranked.find(x=>x.name===map[catAnswers.currentBall]),d=cur?best.score-cur.score:null,up=d===null?'Current ball not benchmarked':d>=6?'Strong switch case':d>=3?'Worth testing':d>=1?'Small projected gain':'Current ball remains an excellent fit';document.getElementById('catStepCount').textContent='FIT COMPLETE';document.getElementById('catProgressBar').style.width='100%';document.getElementById('catNav').style.display='none';document.getElementById('catQuestionHost').innerHTML=`<div class="eyebrow">Golf Ball Fit</div><h1>Your ball performance profile.</h1><div class="catSummary"><b>${up}</b><div class="catPills"><span class="catPill">Driver</span><span class="catPill">Irons</span><span class="catPill">Greenside</span><span class="catPill">Feel</span><span class="catPill">Conditions</span></div></div>${cur?`<div class="currentFitCard"><div class="currentFitTop"><div><div class="eyebrow">Current ball</div><div class="currentFitName">${cur.name}</div></div><div class="gradeWrap"><div class="letterGrade">${fitLetter(cur.score)}</div><div><div class="headerMeta">Fit score</div><div class="numericGrade">${cur.score}/100</div></div></div></div><div class="fitExplanation">${d>0?`The top modeled fit scores ${d} point${d===1?'':'s'} higher.`:'Your current ball remains at the top of the modeled fit.'}</div></div>`:''}<div class="catResultGrid">${ranked.slice(0,4).map((r,i)=>`<div class="catResultCard"><div class="fitMeta">${i?'Alternative '+i:'Best modeled fit'}</div><h3>${r.name}</h3><div class="catScore">${r.score}</div><div class="confidenceLine">Profile fit / 100</div><div class="catReason">${i?'Strong alternative with a different performance tradeoff.':'Best overall balance for your launch, scoring and feel needs.'}</div></div>`).join('')}</div><div class="prototypeNote"><b>Model note:</b> FORM uses its own multidimensional scoring framework. Production scores should be calibrated against verified product data and real-player outcomes.</div><div style="margin-top:22px"><button class="ghostBtn" onclick="showPage('fittings')">← Fit another category</button> <button class="solidBtn" onclick="showPage('profile')">View my profile</button></div>`;saveFit('ball',{answers:{...catAnswers},title:'Golf Ball Fit',topMatch:best.name,topScore:best.score,currentBall:cur?.name,currentScore:cur?.score,upgrade:up})};


// Catalog declaration loaded from assets/catalog-data.js



// FORM 6.0 catalog snapshot additions
if(historicalEquipmentDB?.wedges?.Titleist && !historicalEquipmentDB.wedges.Titleist.includes('Vokey SM11')){
  historicalEquipmentDB.wedges.Titleist.unshift('Vokey SM11');
}

const bagCategories=[['driver','Driver'],['fairway','Fairway'],['hybrid','Hybrid'],['irons','Irons'],['wedges','Wedges'],['putters','Putter'],['balls','Ball']];
function defaultBag(){return Object.fromEntries(bagCategories.map(x=>[x[0],{brand:'',model:''}]))}
function bagData(){const d=profileData();d.bag=d.bag||defaultBag();return d}
function bagBrands(cat){return cat==='driver'?Object.keys(driverDB):Object.keys(historicalEquipmentDB[cat]||{})}
function bagModels(cat,brand){return cat==='driver'?Object.keys(driverDB[brand]||{}):(historicalEquipmentDB[cat]?.[brand]||[])}
function saveBagChoice(cat,key,val){const d=bagData();d.bag[cat]=d.bag[cat]||{brand:'',model:''};d.bag[cat][key]=val;if(key==='brand')d.bag[cat].model='';formSave(d);renderProfilePage();toastSaved()}
function bagGrade(cat,item){if(!item?.model)return'—';const f=formLoad().fits||{};if(cat==='driver'&&f.driver?.topScore)return fitLetter(f.driver.topScore);if(cat==='balls'&&f.ball?.currentScore)return fitLetter(f.ball.currentScore);return'Saved'}
const _profileRender28=renderProfilePage;
renderProfilePage=function(){_profileRender28();const page=document.getElementById('page-profile');if(!page)return;const d=bagData(),bag=d.bag,card=page.querySelector('.bagCard');if(!card)return;card.insertAdjacentHTML('beforeend',`<div class="bagEditor"><div class="eyebrow" style="margin-top:28px">Historical equipment library</div><h3 style="font-size:28px">Identify your current bag</h3><div class="libraryNote">This library is intentionally broader than the recommendation catalog. FORM should recognize older equipment even when it would never recommend buying it today.</div>${bagCategories.map(([cat,label])=>{const x=bag[cat]||{brand:'',model:''};return `<div class="bagEditRow"><div><label>${label}</label></div><div><label>Brand</label><select onchange="saveBagChoice('${cat}','brand',this.value)"><option value="">Select / unknown</option>${bagBrands(cat).map(b=>`<option ${x.brand===b?'selected':''}>${b}</option>`).join('')}</select></div><div><label>Model</label><select onchange="saveBagChoice('${cat}','model',this.value)"><option value="">Select / unknown</option>${bagModels(cat,x.brand).map(m=>`<option ${x.model===m?'selected':''}>${m}</option>`).join('')}</select></div><div class="bagStatus">${bagGrade(cat,x)}</div></div>`}).join('')}</div>`) };


// v2.9 modeled product-attribute layer.
// Values are normalized design traits for prototype fitting logic, not laboratory measurements.
const productAttributeOverrides={
 'Callaway|Paradym (2023)':{forgiveness:4.2,launch:3.3,spin:2.8,bias:3.0,player:3.0,feel:4.0},
 'Callaway|Paradym X (2023)':{forgiveness:4.6,launch:4.0,spin:3.1,bias:4.2,player:2.2,feel:3.8},
 'Callaway|Paradym Triple Diamond (2023)':{forgiveness:3.0,launch:2.6,spin:1.9,bias:2.5,player:4.7,feel:4.3},
 'PING|G430 Max (2023)':{forgiveness:4.9,launch:3.7,spin:3.0,bias:3.1,player:2.3,feel:3.8},
 'PING|G430 LST (2023)':{forgiveness:3.8,launch:2.7,spin:1.9,bias:2.8,player:4.2,feel:4.0},
 'PING|G440 Max (2025)':{forgiveness:4.9,launch:3.6,spin:2.8,bias:3.1,player:2.3,feel:4.0},
 'TaylorMade|Qi10 Max (2024)':{forgiveness:5.0,launch:4.0,spin:3.1,bias:3.5,player:2.0,feel:3.8},
 'TaylorMade|Qi10 LS (2024)':{forgiveness:3.4,launch:2.4,spin:1.8,bias:2.7,player:4.5,feel:4.0},
 'Titleist|GT2 (2024)':{forgiveness:4.5,launch:3.5,spin:2.8,bias:3.0,player:3.0,feel:4.4},
 'Titleist|GT3 (2024)':{forgiveness:3.8,launch:3.0,spin:2.4,bias:2.8,player:4.1,feel:4.6},
 'Cobra|King Forged Tec (2022)':{forgiveness:3.8,launch:3.2,spin:2.7,bias:3.0,player:3.6,feel:4.2},
 'PING|PLD Milled':{forgiveness:3.2,launch:3,spin:3,bias:3,player:4.2,feel:4.8}
};

function extractYear(model){
 const m=(model||'').match(/\((20\d{2})\)/); return m?+m[1]:null;
}
function baseAttributes(category,brand,model){
 const key=brand+'|'+model;if(productAttributeOverrides[key])return {...productAttributeOverrides[key],source:'modeled + explicit'};
 let a={forgiveness:3.5,launch:3.2,spin:3.0,bias:3.0,player:3.0,feel:3.6,source:'modeled'};
 const n=(model||'').toLowerCase();

 if(category==='driver'||category==='fairway'||category==='hybrid'){
   if(/max|10k|x\b|sft|hd|d-type|max d/.test(n)){a.forgiveness+=.8;a.launch+=.5;a.player-=.6}
   if(/ls|lst|sub zero|triple diamond|plus|tour/.test(n)){a.forgiveness-=.6;a.launch-=.4;a.spin-=.8;a.player+=1}
   if(/sft|draw|max d|d-type|hd/.test(n))a.bias+=1.2;
   if(/max fast|lite/.test(n)){a.launch+=.6;a.player-=.4}
 }
 if(category==='irons'){
   if(/hot metal|g4|g430|g440|mavrik|rogue st max|paradym x|elyte x|qi hl|zx4|i530|p790/.test(n)){a.forgiveness+=.7;a.launch+=.4;a.player-=.5}
   if(/mb|blade|blueprint t|p7mb|ap2|zx7|t100|tour\b|cb\b/.test(n)){a.forgiveness-=.6;a.launch-=.3;a.spin+=.3;a.player+=1}
   if(/forged tec|t150|p770|apex pro|pro 24|i525|zx5|243|245/.test(n)){a.forgiveness+=.1;a.player+=.4}
 }
 if(category==='wedges'){
   a.forgiveness=3.0;a.launch=3.1;a.spin=4.2;a.player=3.5;a.feel=4.2;
   if(/cbx|full toe/.test(n)){a.forgiveness+=1;a.player-=.5}
 }
 if(category==='putters'){
   a.launch=3;a.spin=3;a.feel=4.2;
   if(/spider|mallet|df3|mezz|oz\.1|inovai|square 2 square/.test(n)){a.forgiveness=4.7;a.player=2.8}
   if(/newport|blade|link\.1|anser|studio style/.test(n)){a.forgiveness=3.0;a.player=4.1}
 }
 if(category==='balls'){
   a={forgiveness:3.5,launch:3.2,spin:3.6,bias:3,player:3.3,feel:3.5,source:'modeled'};
   if(/xv|pro v1x|tp5x|chrome tour x|tour b x|tour x/.test(n)){a.launch+=.5;a.feel+=.5;a.player+=.4}
   if(/avx|soft|supersoft|trufeel|pro soft/.test(n)){a.launch-=.4;a.spin-=.5;a.feel-=1}
 }
 const y=extractYear(model);
 if(y && y<=2019){a.source='modeled historical';}
 Object.keys(a).forEach(k=>{if(typeof a[k]==='number')a[k]=Math.max(1,Math.min(5,a[k]))});
 return a;
}
function bagFitScore(category,item,profile,fits){
 if(!item?.model)return null;
 const a=baseAttributes(category,item.brand,item.model);
 let score=82;
 const h=+profile.handicap||15,spd=+profile.driverSpeed||95;

 if(category==='driver'||category==='fairway'||category==='hybrid'){
   if(h>=16)score+=(a.forgiveness-3.5)*4;
   else if(h<=7)score+=(a.player-3)*2;
   if(spd<90)score+=(a.launch-3)*2;
   if(spd>105)score+=(3.2-a.spin)*1.5;
   if(fits.driver?.answers?.strike==='heel'||fits.driver?.answers?.strike==='toe')score+=(a.forgiveness-3.5)*2;
 }
 if(category==='irons'){
   if(h>=15)score+=(a.forgiveness-3.5)*5;
   else if(h<=8)score+=(a.player-3)*3;
   if(spd<90)score+=(a.launch-3)*1.5;
   if(fits.irons?.answers?.priority==='Forgiveness')score+=(a.forgiveness-3.5)*4;
   if(fits.irons?.answers?.priority==='Feel / feedback')score+=(a.feel-3.5)*2;
 }
 if(category==='wedges'){
   score+=(a.spin-3.5)*2;
   if(fits.wedges?.answers?.delivery==='Steep / digger'&&/cbx|full toe/i.test(item.model))score+=4;
 }
 if(category==='putters'){
   if(fits.putter?.answers?.head==='Large mallet'&&a.forgiveness>4)score+=5;
   if(fits.putter?.answers?.head==='Blade'&&a.player>4)score+=5;
   if(fits.putter?.answers?.miss==='Start line')score+=(a.forgiveness-3.5)*2;
 }
 if(category==='balls'&&fits.ball?.currentScore)return fits.ball.currentScore;

 const y=extractYear(item.model);
 if(y){
   const age=Math.max(0,2026-y);
   if(age>=8)score-=4;
   else if(age>=5)score-=2;
 }
 return Math.max(65,Math.min(97,Math.round(score)));
}
function scoreToUpgrade(score,category,item){
 if(score===null)return'Add model to grade';
 const y=extractYear(item.model),age=y?2026-y:null;
 if(score>=90)return'No compelling reason to upgrade';
 if(score>=85)return'Low upgrade priority';
 if(score>=78)return'Moderate upgrade opportunity';
 return'High upgrade opportunity';
}
function attributePills(category,item){
 const a=baseAttributes(category,item.brand,item.model),p=[];
 const desc=(v,lo,mid,hi)=>v>=4.1?hi:v<=2.4?lo:mid;
 if(['driver','fairway','hybrid','irons'].includes(category)){
   p.push(desc(a.forgiveness,'Lower forgiveness','Balanced forgiveness','High forgiveness'));
   p.push(desc(a.launch,'Lower launch','Mid launch','Higher launch'));
   p.push(desc(a.spin,'Lower spin','Mid spin','Higher spin'));
   p.push(desc(a.player,'Game-improvement','Blended player profile','Player-oriented'));
 }
 if(category==='wedges'){p.push(desc(a.forgiveness,'Traditional sole','Versatile sole','More forgiving sole'));p.push('High spin profile')}
 if(category==='putters'){p.push(desc(a.forgiveness,'Feedback-focused','Balanced stability','High stability'));p.push(desc(a.player,'High assistance','Balanced','Player feedback'))}
 if(category==='balls'){p.push(desc(a.launch,'Lower flight','Mid flight','Higher flight'));p.push(desc(a.spin,'Lower spin','Balanced spin','Higher spin'));p.push(desc(a.feel,'Soft feel','Medium feel','Firm feel'))}
 return {pills:p,source:a.source};
}
function bagCategoryLabel(cat){return ({driver:'Driver',fairway:'Fairway',hybrid:'Hybrid',irons:'Irons',wedges:'Wedges',putters:'Putter',balls:'Ball'})[cat]||cat}
function renderBagIntelligence(){
 const page=document.getElementById('page-profile');if(!page)return;
 const d=bagData(),bag=d.bag||{},profile=d.profile||{},fits=d.fits||{};
 const existing=page.querySelector('.bagIntel');if(existing)existing.remove();
 const card=page.querySelector('.bagCard');if(!card)return;
 const rows=bagCategories.map(([cat])=>{
   const item=bag[cat]||{},score=bagFitScore(cat,item,profile,fits),grade=score?fitLetter(score):'—',traits=item.model?attributePills(cat,item):{pills:[],source:''};
   return `<div class="bagGradeCard"><div class="bagGradeTop"><small>${bagCategoryLabel(cat)}</small><div><h3>${item.model?`${item.brand} ${item.model}`:'Not identified yet'}</h3><div class="dataConfidence">${item.model?traits.source:'Select your current model above'}</div></div><div class="bagGradeCircle">${grade}</div></div>${item.model?`<div class="bagTraitRow">${traits.pills.map(x=>`<span class="bagTrait">${x}</span>`).join('')}</div><div class="bagGradeWhy">Modeled fit score: <b>${score}/100</b>. FORM compares the product's design profile with your saved golfer profile and any completed category fitting.</div><div class="bagUpgrade">${scoreToUpgrade(score,cat,item)}</div>`:''}</div>`;
 }
).join('');
 card.insertAdjacentHTML('afterend',`<div class="bagIntel"><div class="sectionHead"><div><div class="eyebrow">Bag intelligence</div><h2>What deserves attention?</h2></div><p>These are provisional modeled grades. Production grades will use verified product attributes and calibrated outcome data.</p></div>${rows}</div>`);
}
const _profileRender29=renderProfilePage;
renderProfilePage=function(){_profileRender29();renderBagIntelligence()};


// v3.0 data provenance and methodology layer
function provenanceForItem(category,item){
  if(!item?.model)return [];
  const attrs=baseAttributes(category,item.brand,item.model);
  const out=[{label:'Official identification',cls:'prov-official'}];
  if(attrs.source==='modeled + explicit')out.push({label:'FORM modeled + curated',cls:'prov-modeled'});
  else out.push({label:'FORM modeled traits',cls:'prov-modeled'});
  // Placeholder status until a licensed/owned performance dataset is connected.
  out.push({label:'Independent validation pending',cls:'prov-pending'});
  return out;
}
function provenanceHTML(category,item){
  return provenanceForItem(category,item).map(x=>`<span class="provBadge ${x.cls}">${x.label}</span>`).join('');
}
const _renderBagIntelV30 = renderBagIntelligence;
renderBagIntelligence=function(){
  _renderBagIntelV30();
  const page=document.getElementById('page-profile'); if(!page)return;
  const d=bagData(), bag=d.bag||{};
  const cards=page.querySelectorAll('.bagGradeCard');
  cards.forEach((card,i)=>{
    const cat=bagCategories[i]?.[0], item=bag[cat]||{};
    if(!item.model)return;
    const why=card.querySelector('.bagGradeWhy');
    if(why && !card.querySelector('.provBadge')){
      why.insertAdjacentHTML('beforebegin',`<div>${provenanceHTML(cat,item)}</div><div class="evidenceNote">Evidence labels describe the current source quality behind this provisional grade.</div>`);
    }
  });
};


// v3.1 Saved Fit / Watch My Fit prototype
function getWatch(){try{return JSON.parse(localStorage.getItem('formFitWatch')||'{}')}catch(e){return{}}}
function setWatch(x){localStorage.setItem('formFitWatch',JSON.stringify(x))}
function toggleWatchCat(btn){btn.classList.toggle('active')}
function enableFitWatch(){
 const email=(document.getElementById('watchEmail')?.value||'').trim();
 if(!email || !email.includes('@')){alert('Enter a valid email address to test Watch My Fit.');return}
 const cats=[...document.querySelectorAll('[data-watchcat].active')].map(x=>x.dataset.watchcat);
 const w={enabled:true,email,categories:cats,consentText:'Personalized fit-change updates',savedAt:new Date().toISOString()};
 setWatch(w);renderWatchState();toastSaved();
}
function renderWatchState(){
 const w=getWatch(),el=document.getElementById('watchState');if(!el)return;
 if(w.email)document.getElementById('watchEmail').value=w.email;
 document.querySelectorAll('[data-watchcat]').forEach(b=>b.classList.toggle('active',!w.categories||w.categories.includes(b.dataset.watchcat)));
 el.textContent=w.enabled?`Watching ${w.categories?.length||0} fit categories for ${w.email}`:'Not enabled';
}
function addWatchCTA(){
 const host=document.getElementById('catQuestionHost');if(!host||activeCat==='apparel')return;
 if(host.querySelector('.watchFitBox'))return;
 host.insertAdjacentHTML('beforeend',`<div class="watchFitBox"><div class="eyebrow">Keep this fit working</div><h3>We'll tell you when your recommendation actually changes.</h3><p>Save this fit and FORM can re-evaluate it as new products are added. No generic launch alerts. After your initial fit follow-up, we'll only contact you about products when something meaningfully changes for your profile.</p><button class="solidBtn" onclick="showPage('watchfit');renderWatchState()">Watch my fit</button></div>`);
}
const _saveFit31=saveFit;
saveFit=function(cat,data){_saveFit31(cat,data);setTimeout(addWatchCTA,0)}
const _showPage31=showPage;
showPage=function(name){_showPage31(name);if(name==='watchfit')setTimeout(renderWatchState,0)}


// v3.2 lifecycle prototype
function fitWatchThreshold(category){
 return {driver:4,irons:4,ball:3,wedges:4,putter:4}[category]||4;
}
function shouldNotifyFitChange(category,currentScore,oldBest,newBest){
 const threshold=fitWatchThreshold(category);
 return {
   newNumberOne:newBest>oldBest,
   meaningfulUpgrade:(newBest-currentScore)>=threshold,
   materialChange:(newBest-oldBest)>=2,
   notify:newBest>oldBest && ((newBest-currentScore)>=threshold || (newBest-oldBest)>=2)
 };
}
function appendFitSnapshot(category,data){
 try{
  const key='formFitHistory',h=JSON.parse(localStorage.getItem(key)||'[]');
  h.push({category,at:new Date().toISOString(),topMatch:data.topMatch||'',topScore:data.topScore||null,currentScore:data.currentScore||null,upgrade:data.upgrade||''});
  localStorage.setItem(key,JSON.stringify(h.slice(-50)));
 }catch(e){}
}
const _saveFit32=saveFit;
saveFit=function(cat,data){_saveFit32(cat,data);appendFitSnapshot(cat,data)}


// v3.3 recommendation explanation + restrained lifecycle policy
function recConfidence(category,answers,score){
 const n=answers?Object.values(answers).filter(v=>v!==''&&v!=null).length:0;
 const base=Math.min(94,62+n*4);
 return {score:base,label:base>=88?'High':base>=74?'Good':'Moderate'};
}
function recommendationTradeoffs(category,score,rank,currentScore){
 const delta=currentScore?score-currentScore:null;
 if(category==='driver')return [
  ['Dispersion',rank===1?'Excellent':'Strong'],['Forgiveness',score>=90?'High':'Balanced'],['Distance',score>=92?'Strong':'Competitive'],['Vs. current',delta==null?'—':(delta>0?'+'+delta:delta)]
 ];
 if(category==='ball')return [
  ['Driver fit',score>=90?'Excellent':'Strong'],['Approach',score>=91?'Strong':'Balanced'],['Greenside',score>=90?'High':'Good'],['Vs. current',delta==null?'—':(delta>0?'+'+delta:delta)]
 ];
 return [['Overall fit',score>=90?'Excellent':'Strong'],['Confidence',score>=90?'High':'Good'],['Tradeoff','Balanced'],['Vs. current',delta==null?'—':(delta>0?'+'+delta:delta)]];
}
function enhancedRecommendationHTML(category,ranked,currentScore,answers){
 if(!ranked?.length)return'';
 const top=ranked[0],conf=recConfidence(category,answers,top.score);
 const cards=ranked.slice(0,3);
 return `<div class="recHero"><div class="recHeroTop"><div><div class="recRank">#1 FORM recommendation</div><h2>${top.name}</h2><div class="confidenceLine">${conf.label} recommendation confidence</div><div class="confidenceBar"><div class="confidenceFill" style="width:${conf.score}%"></div></div></div><div class="recScore">${top.score}<small>Fit / 100</small></div></div>
 <div class="tradeGrid">${recommendationTradeoffs(category,top.score,1,currentScore).map(x=>`<div class="tradeMetric"><span>${x[0]}</span><b>${x[1]}</b></div>`).join('')}</div>
 <div class="whyWin"><b>Why it wins:</b> FORM's top recommendation is the product with the strongest weighted match to your saved priorities and fitting inputs—not necessarily the newest product or the one with the highest raw performance in one category. ${currentScore?`It currently models ${Math.max(0,top.score-currentScore)} fit points ahead of your existing equipment.`:''}</div></div>
 <table class="compareTable"><thead><tr><th>Option</th><th>Fit</th><th>Role</th><th>Tradeoff</th></tr></thead><tbody>${cards.map((r,i)=>`<tr><td><b>${r.name}</b></td><td>${r.score}</td><td>${i===0?'Best overall match':i===1?'Closest alternative':'Different balance'}</td><td>${i===0?'Fewest meaningful compromises':i===1?'Very close; preference may decide':'Worth considering if its strengths match your priorities'}</td></tr>`).join('')}</tbody></table>`;
}
function emailCadenceDecision(watch,signal){
 const now=Date.now(),created=watch?.savedAt?new Date(watch.savedAt).getTime():now;
 const days=(now-created)/86400000,initial=days<=21;
 const last=watch?.lastProductEmail?new Date(watch.lastProductEmail).getTime():0;
 const daysSinceLast=last?(now-last)/86400000:999;
 if(initial){
   if(signal.type==='fit_followup'&&daysSinceLast>=4)return {send:true,reason:'useful initial-fit follow-up'};
   if(signal.meaningful&&daysSinceLast>=7)return {send:true,reason:'meaningful fit change'};
   return {send:false,reason:'initial follow-up suppressed'};
 }
 if(!signal.meaningful)return {send:false,reason:'no meaningful personalized change'};
 if(signal.scoreGain<3 && !signal.newNumberOne)return {send:false,reason:'change too small'};
 if(daysSinceLast<21 && !signal.major)return {send:false,reason:'frequency guardrail'};
 return {send:true,reason:'meaningful personalized update'};
}


const _addWatchCTA33=addWatchCTA;
addWatchCTA=function(){
 _addWatchCTA33();
 if(activeCat!=='ball')return;
 const host=document.getElementById('catQuestionHost');if(!host||host.querySelector('.recHero'))return;
 try{
  const ranked=formBallDB.map(b=>({...b,score:formBallScore(b,catAnswers)})).sort((a,b)=>b.score-a.score);
  const map={'Pro V1':'Titleist Pro V1','Pro V1x':'Titleist Pro V1x','AVX':'Titleist AVX','Chrome Tour':'Callaway Chrome Tour','Chrome Tour X':'Callaway Chrome Tour X','TP5':'TaylorMade TP5','TP5x':'TaylorMade TP5x','Tour B X':'Bridgestone Tour B X','Tour B XS':'Bridgestone Tour B XS','Z-Star':'Srixon Z-Star','Z-Star XV':'Srixon Z-Star XV','Maxfli Tour':'Maxfli Tour'};
  const cur=ranked.find(x=>x.name===map[catAnswers.currentBall]);
  const cta=host.querySelector('.watchFitBox');
  if(cta)cta.insertAdjacentHTML('beforebegin',enhancedRecommendationHTML('ball',ranked,cur?.score,catAnswers));
 }catch(e){}
};



// ===== FORM DRIVER ENGINE v4.3 =====
// Iteration 1: hard constraints
function driverProfile(g){
  let hcp=15;
  try{const p=profileData()?.profile||{}; if(p.handicap!==''&&p.handicap!=null)hcp=+p.handicap||15}catch(e){}
  return {...g,hcp};
}
function driverHardConstraints(p,g){
  const fails=[];
  if(g.speed && g.speed<90 && (p.player==='lowspin'||(p.spin<=1.7&&p.forgiveness<3.6)))fails.push('too demanding for reported speed');
  if(g.spin==='low' && p.spin<=1.8)fails.push('would compound low spin');
  if(g.traj==='low' && p.launch<=2.1)fails.push('would compound low launch');
  if((g.costly==='hook'||g.curveClass==='draw_curve') && p.draw_bias>=.8)fails.push('draw bias conflicts with left-miss pattern');
  if(g.hcp>=18 && p.forgiveness<3.0)fails.push('too demanding for current consistency');
  if((g.costly==='two_way'||g.strike==='varied') && p.forgiveness<3.2)fails.push('insufficient stability for two-way/varied strike');
  return fails;
}

// Iteration 2: miss diagnosis — separate start line, curve and strike
function driverMissDiagnosis(g){
  const s=g.startClass,c=g.curveClass,strike=g.strike;
  let label='Mixed / neutral pattern',need='balanced stability',severity=1;
  if(c==='fade_curve'){
    if(s==='push'){label='Push-fade / push-slice pattern';need='face closure help plus stability';severity=3}
    else if(s==='pull'){label='Pull-fade / pull-slice pattern';need='stability without excessive draw correction';severity=2}
    else {label='Straight-start fade / slice pattern';need='moderate right-miss protection';severity=2}
  } else if(c==='draw_curve'){
    if(s==='pull'){label='Pull-draw / pull-hook pattern';need='neutral-to-fade bias and stability';severity=3}
    else if(s==='push'){label='Push-draw pattern';need='neutral bias with face stability';severity=1}
    else {label='Straight-start draw / hook pattern';need='neutral bias and left-miss protection';severity=2}
  } else if(s==='push'){label='Push pattern';need='face stability / directional help';severity=1}
  else if(s==='pull'){label='Pull pattern';need='neutral directional bias';severity=1}
  if(strike==='heel'){label+=' + heel strike';need+='; heel-miss forgiveness';severity+=1}
  if(strike==='toe'){label+=' + toe strike';need+='; toe-miss forgiveness';severity+=1}
  return {label,need,severity:Math.min(4,severity)};
}
function driverScoreV43(p,g){
  let perf=82, reasons=[], penalties=[];
  if(g.speed){
    const mid=(p.speed_fit[0]+p.speed_fit[1])/2;
    const miss=Math.abs(g.speed-mid);
    perf-=Math.min(10,miss*.32);
    if(miss<8)reasons.push('speed window fits');
  }
  const d=driverMissDiagnosis(g);
  if(g.costly==='two_way'||g.strike==='varied'){perf+=(p.forgiveness-3.5)*5; if(p.forgiveness>=4.5)reasons.push('high stability for inconsistent strike')}
  if(['heel','toe'].includes(g.strike)){perf+=(p.forgiveness-3.5)*4.5;if(p.forgiveness>=4.5)reasons.push(`${g.strike}-strike protection`)}
  if(g.curveClass==='fade_curve'){
    const weight=d.severity>=3?7:4;
    perf+=p.draw_bias*weight;
    if(p.draw_bias>=.8)reasons.push('right-miss correction');
  }
  if(g.curveClass==='draw_curve'){
    perf-=p.draw_bias*(d.severity>=3?9:6);
    if(p.draw_bias<.4)reasons.push('neutral bias protects left miss');
  }
  if(g.spin==='high'){
    perf+=(3.1-p.spin)*3.4;
    if(p.spin<=2.2)reasons.push('spin reduction');
  } else if(g.spin==='low'){
    perf+=(p.spin-2.6)*3.0;
    if(p.spin>=2.8)reasons.push('spin protection');
  }
  if(g.traj==='low'){
    perf+=(p.launch-3)*2.8;
    if(p.launch>=4)reasons.push('launch support');
  } else if(g.traj==='high'){
    perf+=(3-p.launch)*2.4;
    if(p.launch<=2.7)reasons.push('flight control');
  }
  const accuracyWeight=rankedWeight(g,'accuracy');
  const distanceWeight=rankedWeight(g,'distance');
  const flightWeight=rankedWeight(g,'flight');
  perf+=(p.forgiveness-3.5)*accuracyWeight*.85;
  if(distanceWeight)perf+=(p.player==='lowspin'&&g.spin==='high'?2.5:0.7)*distanceWeight;
  if(flightWeight && g.spin==='high' && p.spin<=2.3)perf+=flightWeight*.7;
  if(flightWeight && g.traj==='low' && p.launch>=4)perf+=flightWeight*.7;

  let pref=80;
  if(g.style!=='balanced'){pref+=p.style===g.style?10:-2}
  const overall=Math.max(50,Math.min(99.5,Math.round((perf*.90+pref*.10)*10)/10));
  return {perf:Math.round(Math.max(45,Math.min(99.5,perf))*10)/10,pref:Math.round(pref*10)/10,overall,reasons:[...new Set(reasons)].slice(0,4),penalties};
}
function driverRankV43(g){
  const rows=[];
  products.forEach(p=>{
    if(p.generation==='previous_limited')return;
    const constraints=driverHardConstraints(p,g);
    if(!constraints.length)rows.push({p,s:driverScoreV43(p,g),constraints});
  });
  return rows.sort((a,b)=>b.s.overall-a.s.overall);
}

// Iteration 3: current-gamer benchmark + adjust-before-buying logic
function currentVirtualProduct(g){
  if(!g.currentClub?.brand||!g.currentClub?.model)return null;
  try{
    const a=baseAttributes('driver',g.currentClub.brand,g.currentClub.model);
    return {
      brand:g.currentClub.brand,model:g.currentClub.model,
      launch:a.launch||3,spin:a.spin||3,forgiveness:a.forgiveness||3.5,
      draw_bias:Math.max(0,Math.min(1.1,((a.bias||3)-3)/1.1)),
      speed_fit:[75,115],player:(a.player||3)>=4.2?'controlled':(a.spin||3)<=2?'lowspin':'broad',
      style:'balanced',generation:'current_gamer'
    };
  }catch(e){return null}
}
function currentDriverScoreV43(g){
  const vp=currentVirtualProduct(g);
  if(!vp)return currentBenchmark(g);
  let score=driverScoreV43(vp,g).overall;
  if(g.current==='great')score+=4;
  if(g.current==='good')score+=2;
  if(g.current==='mixed')score-=3;
  if(g.current==='poor')score-=7;
  (g.currentClub.problems||[]).forEach(x=>{if(['dispersion','forgiveness'].includes(x))score-=3;else score-=1.5});
  return Math.max(62,Math.min(96,Math.round(score*10)/10));
}
function currentDriverAdjustability(g){
  const m=(g.currentClub?.model||'').toLowerCase();
  const modern=/201[9]|202[0-6]|paradym|rogue st|mavrik|epic|qi|stealth|sim|g4|tsr|tsi|gt|gts|darkspeed|aerojet|ltdx|ds-adapt|optm|elyte|quantum/.test(m);
  return modern;
}
function adjustmentAdviceV43(g,currentScore){
  if(!currentDriverAdjustability(g)||currentScore<80)return null;
  const tips=[];
  if(g.traj==='low'||g.spin==='low')tips.push('test more delivered loft before replacing the head');
  if(g.traj==='high'&&g.spin==='high')tips.push('test a lower-loft / lower-spin configuration before replacing the head');
  if(g.curveClass==='fade_curve'&&g.costly!=='hook')tips.push('test the club’s available draw/upright or heel-biased adjustment, if applicable');
  if(g.curveClass==='draw_curve'||g.costly==='hook')tips.push('return adjustable bias toward neutral/fade and avoid adding draw help');
  if(['heel','toe'].includes(g.strike))tips.push('confirm strike location and setup before assuming the head itself is the problem');
  return tips.length?{title:'Try an adjustment before you buy',text:tips.slice(0,2).join('. ')+'.'}:null;
}

// Iteration 4: upgrade magnitude, confidence and ties
function driverConfidenceV43(g){
  let c=64;
  if(g.currentClub?.model)c+=5;
  if(g.start!=='varies')c+=5;
  if(g.curve!=='varies')c+=5;
  if(g.strike!=='unknown')c+=5;
  if(g.costly!=='other')c+=4;
  const modes=Object.values(g.metrics||{}).map(x=>x.mode);
  c+=modes.filter(x=>x==='exact').length*4;
  c+=modes.filter(x=>x==='range').length*2.5;
  c+=modes.filter(x=>x==='general').length*1.5;
  return Math.round(Math.max(68,Math.min(96,c)));
}
function upgradeMagnitudeV43(delta,currentScore,confidence){
  if(delta<=1)return {level:'NO COMPELLING REASON',text:'Your current driver is effectively tied with the best modeled new fit.'};
  if(delta<=3)return {level:'LOW',text:'A new model ranks higher, but the projected fit gap is too small to make replacing your current driver a priority.'};
  if(delta<=6)return {level:'MODERATE',text:'There is enough separation to justify a head-to-head test, but not enough to call the upgrade automatic.'};
  if(delta<=10)return {level:'HIGH',text:'FORM sees a meaningful fit gap that is worth testing seriously.'};
  return {level:'VERY HIGH',text:'Your current driver appears materially mismatched relative to the best available options.'};
}
function driverTieState(rows,confidence){
  if(rows.length<2)return {tie:false};
  const gap=rows[0].s.overall-rows[1].s.overall;
  const tie=gap<=.4 || (gap<=.8&&confidence<86);
  return {tie,gap,group:tie?rows.filter(x=>rows[0].s.overall-x.s.overall<=.8).slice(0,3):[rows[0]]};
}
function driverTradeoffs(p,g,currentScore){
  const vals=[
    ['Forgiveness',p.forgiveness>=4.7?'Excellent':p.forgiveness>=4?'Strong':'Moderate'],
    ['Launch',p.launch>=4?'Higher':p.launch<=2.5?'Lower':'Mid'],
    ['Spin',p.spin<=2?'Low':p.spin>=3.4?'Higher':'Mid'],
    ['Vs. current',currentScore==null?'—':`${driverScoreV43(p,g).overall-currentScore>=0?'+':''}${driverScoreV43(p,g).overall-currentScore}`]
  ];
  return vals;
}

// Iteration 5: results explainability + regression test harness
function showResults(){
  const raw=golfer(),g=driverProfile(raw),rows=driverRankV43(g);
  const currentScore=currentDriverScoreV43(g),currentName=[g.currentClub.brand,g.currentClub.model].filter(Boolean).join(' ')||'Your current driver';
  const conf=driverConfidenceV43(g),tie=driverTieState(rows,conf),best=rows[0],delta=best?best.s.overall-currentScore:0,up=upgradeMagnitudeV43(delta,currentScore,conf),adjust=adjustmentAdviceV43(g,currentScore),diag=driverMissDiagnosis(g);

  step=10;
  document.querySelectorAll('.step').forEach(x=>x.classList.add('hidden'));
  document.getElementById('results').classList.remove('hidden');
  document.getElementById('flowNav').style.display='none';
  document.getElementById('progressBar').style.width='100%';
  document.getElementById('stepCount').textContent='FIT COMPLETE';
  document.getElementById('conf').textContent=conf+'%';

  const groupNames=tie.group.map(x=>`${x.p.brand} ${x.p.model}`).join(' · ');
  document.getElementById('keep').innerHTML=`
    <div class="currentFitCard"><div class="currentFitTop"><div><div class="eyebrow">Your current driver</div><div class="currentFitName">${currentName}${g.currentClub.loft?` · ${g.currentClub.loft}`:''}</div><span class="confidenceBadge">${conf>=90?'High':conf>=80?'Good':'Moderate'} recommendation confidence</span></div><div class="gradeWrap"><div class="letterGrade">${fitLetter(currentScore)}</div><div><div class="headerMeta">Modeled fit</div><div class="numericGrade">${currentScore}/100</div></div></div></div><div class="fitExplanation">FORM diagnoses your pattern as <b>${diag.label}</b>. The current-driver grade uses the same golfer needs as the new-product ranking, plus your stated satisfaction and current-club issues.</div></div>
    ${adjust?`<div class="adjustFirst"><div class="eyebrow">Before replacing it</div><h3>${adjust.title}</h3><p>${adjust.text}</p></div>`:''}
    <div class="upgradeSummary"><div class="upgradeSummaryTop"><div><div class="eyebrow">Upgrade recommendation</div><h3>${up.level}</h3></div><div class="deltaScore">${delta>0?'+':''}${delta} fit points</div></div><div class="fitExplanation">${up.text}</div></div>
    ${tie.tie?`<div class="tieBanner"><b>Top fit group:</b> ${groupNames}. With the information provided, FORM does not think the small numerical differences justify pretending there is a clear single winner.</div>`:''}
  `;

  document.getElementById('resultList').innerHTML=rows.slice(0,5).map((x,i)=>{
    const tr=driverTradeoffs(x.p,g,currentScore);
    const why=x.s.reasons.length?x.s.reasons.join('; '):'balanced match across the inputs provided';
    return `<div class="driverVerdict"><div class="verdictTop"><div><div class="recRank">${tie.tie&&tie.group.includes(x)?'Top fit group':'#'+(i+1)+' recommendation'}</div><h2>${x.p.brand} ${x.p.model}</h2><div class="fitGroup">${x.s.reasons.slice(0,3).map(r=>`<span>${r}</span>`).join('')}</div></div><div class="verdictScore">${x.s.overall}<small>Fit / 100</small></div></div><div class="tradeoffs">${tr.map(z=>`<div class="trade"><span>${z[0]}</span><b>${z[1]}</b></div>`).join('')}</div><div class="engineReason"><b>Why it ranks here:</b> ${why}. ${i===0?`This is the strongest weighted match to your pattern and priorities.`:`Compared with the top option, this model makes a slightly different tradeoff.`}</div><div class="constraintNote">Hard incompatibility filters were applied before ranking.</div></div>`;
  }).join('');

  document.getElementById('oracleTitle').textContent='Fit synthesized.';
  document.getElementById('signalList').innerHTML=`<div class="signal"><span class="dot on"></span><span>Miss pattern diagnosed from start + curve + strike</span></div><div class="signal"><span class="dot on"></span><span>Hard incompatibility constraints applied</span></div><div class="signal"><span class="dot on"></span><span>Current driver scored on the same needs</span></div><div class="signal"><span class="dot on"></span><span>Upgrade magnitude evaluated separately from rank</span></div>`;
  document.getElementById('candidateCount').textContent=rows.length;

  try{saveFit('driver',{title:'Driver Fit',topMatch:best?`${best.p.brand} ${best.p.model}`:'',topScore:best?.s.overall||null,currentClub:currentName,currentScore,upgrade:up.level,confidence:conf,diagnosis:diag.label})}catch(e){}
  window.scrollTo({top:0,behavior:'smooth'});
}

function runDriverRegressionTests(){
  const tests=[
    {name:'slow low-spin golfer avoids LS',g:{handed:'right',start:'straight',startClass:'straight',curve:'straight',curveClass:'straight',costly:'two_way',strike:'varied',priority:'forgiveness',style:'balanced',hcp:20,speed:82,spin:'low',traj:'low',metrics:{},ranks:{accuracy:1,distance:2,flight:3,feel:4,looks:5,value:6}},check:r=>!['lowspin'].includes(r[0]?.p.player)},
    {name:'hook pattern avoids draw head',g:{handed:'right',start:'left',startClass:'pull',curve:'hook',curveClass:'draw_curve',costly:'hook',strike:'toe',priority:'control',style:'balanced',hcp:10,speed:100,spin:'mid',traj:'mid',metrics:{},ranks:{accuracy:1,distance:2,flight:3,feel:4,looks:5,value:6}},check:r=>(r[0]?.p.draw_bias||0)<.8},
    {name:'two-way high handicap gets forgiveness',g:{handed:'right',start:'varies',startClass:'varies',curve:'varies',curveClass:'varies',costly:'two_way',strike:'varied',priority:'forgiveness',style:'balanced',hcp:22,speed:93,spin:'mid',traj:'mid',metrics:{},ranks:{accuracy:1,distance:2,flight:3,feel:4,looks:5,value:6}},check:r=>(r[0]?.p.forgiveness||0)>=4},
    {name:'high-spin fast golfer can reach lower-spin heads',g:{handed:'right',start:'straight',startClass:'straight',curve:'fade',curveClass:'fade_curve',costly:'slice',strike:'center',priority:'distance',style:'balanced',hcp:6,speed:110,spin:'high',traj:'high',metrics:{},ranks:{distance:1,flight:2,accuracy:3,feel:4,looks:5,value:6}},check:r=>(r[0]?.p.spin||5)<=3}
  ];
  return tests.map(t=>{const rows=driverRankV43(t.g);return {name:t.name,pass:!!t.check(rows),top:rows[0]?`${rows[0].p.brand} ${rows[0].p.model}`:'none'}})
}
window.FORM_DRIVER_TESTS=runDriverRegressionTests();
console.table(window.FORM_DRIVER_TESTS);


// FORM 5.0 shell behavior
document.querySelectorAll('[data-page-nav]').forEach(btn=>{
  btn.addEventListener('click',()=>showPage(btn.dataset.pageNav));
});
document.querySelectorAll('.formBrand').forEach(btn=>btn.addEventListener('click',()=>showPage('home')));

document.querySelectorAll('.formMenuBtn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const nav=document.querySelector('.formNav');
    if(!nav)return;
    const open=nav.classList.toggle('formNavOpen');
    if(open){
      nav.style.display='flex';
      nav.style.position='fixed';
      nav.style.top='68px';
      nav.style.left='0';
      nav.style.right='0';
      nav.style.flexDirection='column';
      nav.style.alignItems='stretch';
      nav.style.background='rgba(251,250,247,.99)';
      nav.style.borderBottom='1px solid var(--form-line)';
      nav.style.padding='10px 18px 16px';
      nav.style.zIndex='99';
      nav.querySelectorAll('button').forEach(x=>{
        x.style.padding='14px 0';
        x.style.textAlign='left';
        x.style.borderBottom='1px solid var(--form-line)';
      });
    }else{
      nav.removeAttribute('style');
      nav.querySelectorAll('button').forEach(x=>x.removeAttribute('style'));
    }
  });
});


// FORM 5.2 brand-scope fitting controls

products.push(
 {brand:'Mizuno',model:'JPX ONE',generation:'current',price:599,launch:3.5,spin:2.7,forgiveness:4.4,draw_bias:.1,speed_fit:[82,112],player:'broad',style:'classic'},
 {brand:'Wilson',model:'DYNAPWR Max+',generation:'current',price:549,launch:4.2,spin:3.1,forgiveness:5.0,draw_bias:.2,speed_fit:[75,108],player:'max_forgiveness',style:'technical'},
 {brand:'Wilson',model:'DYNAPWR Max',generation:'current',price:499,launch:4,spin:3,forgiveness:4.7,draw_bias:.2,speed_fit:[78,108],player:'broad',style:'technical'},
 {brand:'Wilson',model:'DYNAPWR Carbon',generation:'current',price:499,launch:3,spin:2.4,forgiveness:4.0,draw_bias:0,speed_fit:[88,116],player:'controlled',style:'technical'},
 {brand:'Wilson',model:'DYNAPWR LS',generation:'current',price:499,launch:2.2,spin:1.6,forgiveness:3.2,draw_bias:-.1,speed_fit:[98,125],player:'lowspin',style:'technical'},
 {brand:'PXG',model:'Lightning',generation:'current',price:649,launch:3.2,spin:2.5,forgiveness:4.3,draw_bias:.1,speed_fit:[85,118],player:'broad',style:'modern'},
 {brand:'PXG',model:'Black Ops',generation:'current',price:399,launch:4,spin:2.8,forgiveness:4.8,draw_bias:.2,speed_fit:[78,110],player:'max_forgiveness',style:'modern'},
 {brand:'PXG',model:'Black Ops Tour-1',generation:'current',price:399,launch:2.4,spin:1.6,forgiveness:3.3,draw_bias:-.1,speed_fit:[98,125],player:'lowspin',style:'modern'},
 {brand:'PXG',model:'Black Ops Ultra-Lite',generation:'current',price:399,launch:5,spin:3.2,forgiveness:4.5,draw_bias:.3,speed_fit:[62,90],player:'moderate_speed',style:'modern'},
 {brand:'Tour Edge',model:'Exotics Max',generation:'current',price:499,launch:4.2,spin:3,forgiveness:5.0,draw_bias:.2,speed_fit:[72,105],player:'max_forgiveness',style:'balanced'},
 {brand:'Tour Edge',model:'Exotics E725',generation:'current',price:399,launch:4,spin:3,forgiveness:4.9,draw_bias:.2,speed_fit:[75,108],player:'max_forgiveness',style:'balanced'},
 {brand:'Tour Edge',model:'Exotics C725',generation:'current',price:399,launch:2.5,spin:1.8,forgiveness:3.5,draw_bias:0,speed_fit:[95,122],player:'lowspin',style:'balanced'},
 {brand:'Tour Edge',model:'Hot Launch Max',generation:'current',price:299,launch:4.8,spin:3.4,forgiveness:4.7,draw_bias:.3,speed_fit:[62,94],player:'moderate_speed',style:'balanced'},
 {brand:'Tour Edge',model:'Hot Launch Max D',generation:'current',price:299,launch:5,spin:3.5,forgiveness:4.7,draw_bias:1.0,speed_fit:[62,94],player:'slice_help',style:'balanced'}
);
const FORM_DRIVER_BRANDS = [...new Set(products.map(p=>p.brand))].sort();
let formBrandScope = (()=>{try{return JSON.parse(localStorage.getItem('formBrandScope')||'{"mode":"all","brands":[]}')}catch(e){return {mode:'all',brands:[]}}})();

function saveBrandScope(){
  localStorage.setItem('formBrandScope',JSON.stringify(formBrandScope));
}

function setBrandMode(mode){
  formBrandScope.mode=mode;
  if(mode==='all') formBrandScope.brands=[];
  if(mode==='single' && formBrandScope.brands.length>1) formBrandScope.brands=formBrandScope.brands.slice(0,1);
  saveBrandScope();
  renderBrandScope();
}

function toggleFitBrand(brand){
  const has=formBrandScope.brands.includes(brand);
  if(formBrandScope.mode==='single'){
    formBrandScope.brands=has?[]:[brand];
  }else{
    formBrandScope.brands=has?formBrandScope.brands.filter(b=>b!==brand):[...formBrandScope.brands,brand];
  }
  saveBrandScope();
  renderBrandScope();
}

function renderBrandScope(){
  document.querySelectorAll('[data-brand-mode]').forEach(b=>b.classList.toggle('active',b.dataset.brandMode===formBrandScope.mode));
  const wrap=document.getElementById('brandPickerWrap');
  const picker=document.getElementById('brandPicker');
  const hint=document.getElementById('brandScopeHint');
  if(!wrap||!picker||!hint)return;
  wrap.classList.toggle('hidden',formBrandScope.mode==='all');
  picker.innerHTML=FORM_DRIVER_BRANDS.map(brand=>`<button type="button" class="brandChip ${formBrandScope.brands.includes(brand)?'active':''}" onclick="toggleFitBrand('${brand.replace(/'/g,"\\'")}')">${brand}</button>`).join('');
  hint.textContent={
    include:'Only selected brands will be ranked.',
    exclude:'Selected brands will be removed before ranking.',
    single:'Choose one manufacturer to find its best-fitting model.',
    all:''
  }[formBrandScope.mode]||'';
}

function productAllowedByBrandScope(p){
  const mode=formBrandScope.mode, selected=formBrandScope.brands||[];
  if(mode==='all'||!selected.length)return true;
  if(mode==='include'||mode==='single')return selected.includes(p.brand);
  if(mode==='exclude')return !selected.includes(p.brand);
  return true;
}

const _driverRankV52 = driverRankV43;
driverRankV43=function(g){
  return _driverRankV52(g).filter(x=>productAllowedByBrandScope(x.p));
};

document.addEventListener('DOMContentLoaded',renderBrandScope);
setTimeout(renderBrandScope,0);


// FORM 5.3 fitting-path onboarding
const formFitCategoryMeta=[
  {id:'driver',label:'Driver',desc:'Head, loft, configuration and upgrade value.',group:'equipment'},
  {id:'fairway',label:'Fairways + Hybrids',desc:'Long-game gaps, launch and playability.',group:'equipment',future:true},
  {id:'irons',label:'Irons',desc:'Launch, forgiveness, turf interaction and feel.',group:'equipment'},
  {id:'wedges',label:'Wedges',desc:'Loft, bounce, grind and scoring setup.',group:'equipment'},
  {id:'putter',label:'Putter',desc:'Aim, stroke, stability, shape and feel.',group:'equipment'},
  {id:'ball',label:'Golf Ball',desc:'Driver, iron, greenside, feel and conditions.',group:'equipment'},
  {id:'bags',label:'Golf Bag',desc:'Carry style, organization, storage and weight.',group:'equipment'},
  {id:'apparel',label:'Shoes + Apparel',desc:'Comfort, fit, climate, walking and style.',group:'complete'},
  {id:'gloves',label:'Gloves',desc:'Fit, feel, durability and weather.',group:'complete'}
];
const formEquipmentCategories=['driver','fairway','irons','wedges','putter','ball','bags'];
const formCompleteCategories=formFitCategoryMeta.map(x=>x.id);

let formFitStartState={
  path:'single',
  categories:[],
  depth:'quick'
};

function selectFitPath(path){
  formFitStartState.path=path;
  if(path==='single'){
    formFitStartState.categories=formFitStartState.categories.slice(0,1);
  }else if(path==='equipment'){
    formFitStartState.categories=[...formEquipmentCategories];
  }else if(path==='complete'){
    formFitStartState.categories=[...formCompleteCategories];
  }
  document.querySelectorAll('[data-fit-path]').forEach(b=>b.classList.toggle('active',b.dataset.fitPath===path));
  renderFitStart();
}

function toggleFitCategory(id){
  const meta=formFitCategoryMeta.find(x=>x.id===id);
  if(meta?.future)return;
  const has=formFitStartState.categories.includes(id);
  if(formFitStartState.path==='single'){
    formFitStartState.categories=has?[]:[id];
  }else{
    formFitStartState.categories=has?formFitStartState.categories.filter(x=>x!==id):[...formFitStartState.categories,id];
  }
  renderFitStart();
}

function selectFitDepth(depth){
  formFitStartState.depth=depth;
  document.querySelectorAll('[data-fit-depth]').forEach(b=>b.classList.toggle('active',b.dataset.fitDepth===depth));
  renderFitStart();
}

function renderFitStart(){
  const picker=document.getElementById('fitCategoryPicker');
  if(!picker)return;
  const path=formFitStartState.path;
  document.getElementById('fitSelectionTitle').textContent=
    path==='single'?'Select one fitting.':
    path==='equipment'?'Your equipment fitting plan.':
    'Your complete golfer profile.';

  picker.innerHTML=formFitCategoryMeta.map(x=>{
    const selected=formFitStartState.categories.includes(x.id);
    const locked=x.future;
    const includedByPath=path==='complete'||path==='equipment'?selected:true;
    return `<button type="button" class="fitCategoryChoice ${selected?'active':''} ${locked?'locked':''}" onclick="${locked?'':'toggleFitCategory(\''+x.id+'\')'}">
      <b>${x.label}</b><span>${x.desc}</span>
      <small>${locked?'Coming next':selected?'Selected':'Add to fit'}</small>
    </button>`;
  }).join('');

  const count=formFitStartState.categories.filter(id=>!formFitCategoryMeta.find(x=>x.id===id)?.future).length;
  document.getElementById('fitCategoryCount').textContent=count;
  const btn=document.getElementById('beginSelectedFits');
  btn.disabled=count===0;

  const labels=formFitStartState.categories
    .filter(id=>!formFitCategoryMeta.find(x=>x.id===id)?.future)
    .map(id=>formFitCategoryMeta.find(x=>x.id===id)?.label);
  document.getElementById('fitStartSummary').textContent=count
    ? `${formFitStartState.depth==='quick'?'Quick Fit':'Complete Analysis'} · ${labels.join(', ')}`
    : 'Choose at least one fitting to continue.';

  document.querySelectorAll('[data-fit-depth]').forEach(b=>b.classList.toggle('active',b.dataset.fitDepth===formFitStartState.depth));
}

function beginSelectedFits(){
  const cats=formFitStartState.categories.filter(id=>!formFitCategoryMeta.find(x=>x.id===id)?.future);
  if(!cats.length)return;
  localStorage.setItem('formSelectedFitPlan',JSON.stringify({...formFitStartState,categories:cats,savedAt:new Date().toISOString()}));
  // For now, begin with the first selected fitting. The saved plan preserves the remaining sequence.
  openFit(cats[0]);
}

const _showPageFitStart=showPage;
showPage=function(name){
  _showPageFitStart(name);
  if(name==='fitstart')setTimeout(renderFitStart,0);
};

setTimeout(renderFitStart,0);


// FORM 5.4 fittings accordion
function toggleFitAccordion(id){
  document.querySelectorAll('.fitAccordionItem').forEach(item=>{
    const open=item.dataset.fitAccordion===id && !item.classList.contains('open');
    item.classList.toggle('open',open);
    const icon=item.querySelector('.fitAccordionIcon');
    if(icon)icon.textContent=open?'−':'+';
  });
}


// FORM 5.5 simple homepage accordion
function toggleHomeFit(id){
  document.querySelectorAll('.homeFitItem').forEach(item=>{
    const open=item.dataset.homeFit===id && !item.classList.contains('open');
    item.classList.toggle('open',open);
    const icon=item.querySelector('.homeFitHeader b');
    if(icon) icon.textContent=open?'−':'+';
  });
}


const _nextV58=next;
next=function(){
 if(step===1&&!state.handed){
   const box=document.querySelector('#step1 .options');
   box?.classList.add('needsAnswer');
   setTimeout(()=>box?.classList.remove('needsAnswer'),900);
   return;
 }
 _nextV58();
};
