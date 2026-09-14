// FORM 14.11.8 candidate — evidence-backed vertical strike adjustment
// Narrow scope: exact toe-zone evidence only. Missing evidence is neutral, never penalized.
(function(){
'use strict';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const r1=v=>Math.round((Number(v)||0)*10)/10;
const key=p=>`${p?.brand||''}|${p?.model||''}`;

// Directly comparable 95-mph Golf Laboratories toe-zone carry data.
// Values are test inputs, not FORM scores. No inferred/imputed cells.
const ZONES={
  'TaylorMade|Qi4D':{center:222.2,toe:{high:223.6,middle:225.8,low:211.3},source:'Golf Digest / Golf Laboratories 95-mph 9-zone robot testing'},
  'PING|G440 K':{center:224.4,toe:{high:223.6,middle:228.3,low:213.6},source:'Golf Digest / Golf Laboratories 95-mph robot toe-zone testing'},
  'Cobra|OPTM MAX-K':{center:221.4,toe:{high:208.5,middle:203.7,low:199.9},source:'Golf Digest / Golf Laboratories 95-mph 9-zone robot testing'}
};

function consistencyScale(g){
  const c=String(g?.strikeConsistency||'tends').toLowerCase();
  if(c==='mostly')return 1;
  if(c==='tends')return .65;
  return 0;
}

function rawAdjustment(delta){
  // Deliberately small and bounded. Strong retention earns a modest advantage;
  // measured weakness receives a similarly modest knock.
  if(delta>=-2)return .5;
  if(delta>=-6)return .2;
  if(delta>=-12)return-.3;
  return-.6;
}

function verticalEvidence(p,g){
  const horizontal=String(g?.strike||'').toLowerCase();
  const vertical=String(g?.strikeVertical||'').toLowerCase();
  const scale=consistencyScale(g);
  if(horizontal!=='toe'||!['high','middle','low'].includes(vertical)||scale<=0){
    return {eligible:false,adjustment:0,reason:'No exact toe-zone vertical adjustment applies.'};
  }
  const evidence=ZONES[key(p)];
  if(!evidence){
    return {eligible:false,adjustment:0,reason:'No directly comparable exact vertical-strike evidence; held neutral.'};
  }
  const zone=evidence.toe?.[vertical];
  if(!Number.isFinite(zone)||!Number.isFinite(evidence.center)){
    return {eligible:false,adjustment:0,reason:'Exact selected-zone evidence is unavailable; held neutral.'};
  }
  const delta=r1(zone-evidence.center);
  const base=rawAdjustment(delta);
  const adjustment=r1(base*scale);
  return {
    eligible:true,
    adjustment,
    baseAdjustment:base,
    consistencyScale:scale,
    zoneCarry:zone,
    centerCarry:evidence.center,
    deltaYards:delta,
    source:evidence.source,
    zone:`${vertical} toe`,
    reason:adjustment>0?'Direct robot testing shows strong carry retention at this strike location.':adjustment<0?'Direct robot testing shows weaker carry retention at this strike location.':'Measured performance is effectively neutral at this strike location.'
  };
}

function apply(detail,p,g){
  if(!detail||typeof detail!=='object')return detail;
  const ev=verticalEvidence(p,g);
  if(!ev.eligible||!ev.adjustment)return {...detail,verticalStrikeEvidence:ev};
  const overall=r1(clamp((+detail.overall||0)+ev.adjustment,45,99.2));
  return {...detail,overall,verticalStrikeEvidence:ev};
}

function init(){
  if(window.FORM_DRIVER_VERTICAL_STRIKE_V235)return true;
  const ENG=window.FORM_DRIVER_ENGINE_V80;
  if(!ENG||typeof ENG.winners!=='function'||typeof ENG.scoreOne!=='function'||typeof ENG.currentScore!=='function')return false;

  const priorScore=ENG.scoreOne.bind(ENG);
  const priorWinners=ENG.winners.bind(ENG);
  const priorCurrent=ENG.currentScore.bind(ENG);

  ENG.scoreOne=(p,g)=>apply(priorScore(p,g),p,g);

  ENG.winners=g=>{
    const rows=priorWinners(g).map(row=>({...row,s:apply(row.s,row.p,g)}));
    rows.sort((a,b)=>b.s.overall-a.s.overall);
    return rows;
  };

  ENG.currentScore=g=>{
    const out=priorCurrent(g);
    if(!out?.detail)return out;
    const brand=g?.currentClub?.brand||'';
    const model=String(g?.currentClub?.model||'').replace(/\s*\(20\d{2}\)\s*/,'').trim();
    const p=(window.products||[]).find(x=>x.brand===brand&&x.model===model);
    if(!p)return out;
    const detail=apply(out.detail,p,g);
    return {...out,score:detail.overall,detail};
  };

  if(typeof window.driverScoreV43==='function')window.driverScoreV43=(p,g)=>ENG.scoreOne(p,g);
  if(typeof window.driverRankV43==='function')window.driverRankV43=g=>ENG.winners(g);
  if(typeof window.currentDriverScoreV43==='function')window.currentDriverScoreV43=g=>ENG.currentScore(g).score??75;

  window.FORM_DRIVER_VERTICAL_STRIKE_V235={
    version:'14.11.8-candidate',
    zones:ZONES,
    rawAdjustment,
    consistencyScale,
    verticalEvidence,
    priorScore,
    priorWinners,
    priorCurrent
  };
  return true;
}

let n=0,t=setInterval(()=>{n++;if(init()||n>240)clearInterval(t);},50);
})();