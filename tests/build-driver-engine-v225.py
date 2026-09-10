from pathlib import Path

src=Path('assets/driver-engine-v80.js').read_text()
original=src
src=src.replace('// FORM 8.0 — evidence-driven driver scorer','// FORM 8.225 — evidence-driven driver scorer with continuous speed-aware flight needs',1)

anchor='function needProfile(g){\n'
helpers=r'''const flightLaunchMid={under8:7,'8-10':9,'10-12':11,'12-14':13,'14-16':15,'16-18':17,'18-20':19,'20plus':21};
const flightSpinMid={under1500:1400,'1500-1749':1625,'1750-1999':1875,'2000-2249':2125,'2250-2499':2375,'2500-2749':2625,'2750-2999':2875,'3000-3499':3250,'3500plus':3650};
function flightNumeric(id,map){const m=metric(id);if(!m||m.mode==='unknown'||m.value==null)return null;if(m.mode==='exact'){const n=Number(m.value);return Number.isFinite(n)?n:null;}if(m.mode==='range')return map?.[m.value]??null;return null;}
function smoothSeverity(x){x=clamp(x,0,1);return x*x*(3-2*x);}
function flightTargets(speed){const use=Number.isFinite(Number(speed))?Number(speed):95;return {launch:clamp(14.5-.08*(use-70),10.8,14.7),spin:clamp(2850-16*(use-70),2100,2900)};}
function flightNeeds(speed){const t=flightTargets(speed),launch=flightNumeric('launch',flightLaunchMid),spin=flightNumeric('spin',flightSpinMid);let l=null,s=null;if(launch!=null)l={low:smoothSeverity((t.launch-launch-.25)/3),high:smoothSeverity((launch-t.launch-3.25)/3.5),value:launch,target:t.launch};if(spin!=null)s={low:smoothSeverity((t.spin-spin-100)/800),high:smoothSeverity((spin-t.spin-350)/900),value:spin,target:t.spin};return {targets:t,hasLaunch:launch!=null,hasSpin:spin!=null,launch:l||{low:0,high:0},spin:s||{low:0,high:0}};}
function blend(a,b,t){return a+(b-a)*t;}
function flightSignal(ev,need,lowKey,highKey){const low=need?.low||0,high=need?.high||0;if(low>=high&&low>0)return blend(80,val(ev,lowKey),low);if(high>0)return blend(80,val(ev,highKey),high);return 80;}
'''
assert anchor in src
src=src.replace(anchor,helpers+anchor,1)

old="  const spin=classifyMetric('spin')||g.spin||null,launch=classifyMetric('launch')||g.traj||null;"
new="  const spin=classifyMetric('spin')||g.spin||null,launch=classifyMetric('launch')||g.traj||null,flight=flightNeeds(exactOrMid('speed')||speed);"
assert old in src
src=src.replace(old,new,1)
oldret="  return {speed,bs,carry,smash,spin,launch,spinVar:spin==='varies',launchVar:launch==='varies',strike:g.strike,offCenter:['toe','heel','varied'].includes(g.strike),twoWay,directionConflict,fade:!twoWay&&!directionConflict&&(curveFade||costlyFade),draw:!twoWay&&!directionConflict&&(curveDraw||costlyDraw),accuracyW:typeof rankedWeight==='function'?rankedWeight(g,'accuracy'):0,distanceW:typeof rankedWeight==='function'?rankedWeight(g,'distance'):0,flightW:typeof rankedWeight==='function'?rankedWeight(g,'flight'):0,speedQ:q(metric('speed').mode),spinQ:q(metric('spin').mode),launchQ:q(metric('launch').mode),ballQ:q(metric('ballSpeed').mode),carryQ:q(metric('carry').mode)};"
newret="  return {speed,bs,carry,smash,spin,launch,flight,spinVar:spin==='varies',launchVar:launch==='varies',strike:g.strike,offCenter:['toe','heel','varied'].includes(g.strike),twoWay,directionConflict,fade:!twoWay&&!directionConflict&&(curveFade||costlyFade),draw:!twoWay&&!directionConflict&&(curveDraw||costlyDraw),accuracyW:typeof rankedWeight==='function'?rankedWeight(g,'accuracy'):0,distanceW:typeof rankedWeight==='function'?rankedWeight(g,'distance'):0,flightW:typeof rankedWeight==='function'?rankedWeight(g,'flight'):0,speedQ:q(metric('speed').mode),spinQ:q(metric('spin').mode),launchQ:q(metric('launch').mode),ballQ:q(metric('ballSpeed').mode),carryQ:q(metric('carry').mode)};"
assert oldret in src
src=src.replace(oldret,newret,1)

oldspin=r'''function spinPart(p,n,ev){
  if(n.spinVar){const s=val(ev,'spinConsistency');return part('spin','Spin consistency',26+12*n.spinQ,s,'Your spin varies, so FORM values a head that keeps spin more stable across strike locations.',conf(ev,'spinConsistency'));}
  if(n.spin==='low'){const support=val(ev,'spinSupport'),cons=val(ev,'spinConsistency');return part('spin','Spin fit',24+16*n.spinQ,support*.75+cons*.25,'Your low-spin profile puts a premium on preserving enough spin and avoiding large strike-to-strike drops.',conf(ev,'spinSupport')*.7+conf(ev,'spinConsistency')*.3);}
  if(n.spin==='high'){const red=val(ev,'spinReduction'),cons=val(ev,'spinConsistency');return part('spin','Spin fit',24+16*n.spinQ,red*.78+cons*.22,'Your high-spin profile rewards heads that reduce excess spin without becoming unstable across the face.',conf(ev,'spinReduction')*.75+conf(ev,'spinConsistency')*.25);}
  return part('spin','Spin fit',10,78+(val(ev,'spinConsistency')-75)*.18,'No major spin problem was identified, so FORM keeps this category lower-weight.',conf(ev,'spinConsistency'));
}'''
newspin=r'''function spinPart(p,n,ev){
  if(n.spinVar){const s=val(ev,'spinConsistency');return part('spin','Spin consistency',26+12*n.spinQ,s,'Your spin varies, so FORM values a head that keeps spin more stable across strike locations.',conf(ev,'spinConsistency'));}
  if(n.flight?.hasSpin){const low=n.flight.spin.low||0,high=n.flight.spin.high||0,severity=Math.max(low,high),cons=val(ev,'spinConsistency'),neutralScore=78+(cons-75)*.18,neutralW=10,neutralC=conf(ev,'spinConsistency');if(low>=high&&low>0){const target=val(ev,'spinSupport')*.75+cons*.25,targetW=24+16*n.spinQ,targetC=conf(ev,'spinSupport')*.7+conf(ev,'spinConsistency')*.3;return part('spin','Spin fit',blend(neutralW,targetW,severity),blend(neutralScore,target,severity),'Lower-than-target spin progressively increases the value of preserving spin without a hard cutoff.',blend(neutralC,targetC,severity));}if(high>0){const target=val(ev,'spinReduction')*.78+cons*.22,targetW=24+16*n.spinQ,targetC=conf(ev,'spinReduction')*.75+conf(ev,'spinConsistency')*.25;return part('spin','Spin fit',blend(neutralW,targetW,severity),blend(neutralScore,target,severity),'Higher-than-target spin progressively increases the value of spin reduction without a hard cutoff.',blend(neutralC,targetC,severity));}return part('spin','Spin fit',neutralW,neutralScore,'Spin is near the speed-aware neutral window, so FORM keeps this category lower-weight.',neutralC);}
  if(n.spin==='low'){const support=val(ev,'spinSupport'),cons=val(ev,'spinConsistency');return part('spin','Spin fit',24+16*n.spinQ,support*.75+cons*.25,'Your low-spin profile puts a premium on preserving enough spin and avoiding large strike-to-strike drops.',conf(ev,'spinSupport')*.7+conf(ev,'spinConsistency')*.3);}
  if(n.spin==='high'){const red=val(ev,'spinReduction'),cons=val(ev,'spinConsistency');return part('spin','Spin fit',24+16*n.spinQ,red*.78+cons*.22,'Your high-spin profile rewards heads that reduce excess spin without becoming unstable across the face.',conf(ev,'spinReduction')*.75+conf(ev,'spinConsistency')*.25);}
  return part('spin','Spin fit',10,78+(val(ev,'spinConsistency')-75)*.18,'No major spin problem was identified, so FORM keeps this category lower-weight.',conf(ev,'spinConsistency'));
}'''
assert oldspin in src
src=src.replace(oldspin,newspin,1)

oldlaunch=r'''function launchPart(p,n,ev){
  if(n.launchVar){const s=val(ev,'launchConsistency');return part('launch','Launch consistency',17+8*n.launchQ,s,'Your launch varies, so consistency matters more than targeting a single launch window.',conf(ev,'launchConsistency'));}
  if(n.launch==='low'){return part('launch','Launch fit',18+10*n.launchQ,val(ev,'launchSupport'),'Your lower launch increases the value of a head that adds launch without creating other conflicts.',conf(ev,'launchSupport'));}
  if(n.launch==='high'){return part('launch','Launch fit',18+10*n.launchQ,val(ev,'launchControl'),'Your higher launch increases the value of a head that controls flight.',conf(ev,'launchControl'));}
  return part('launch','Launch fit',9,80+(val(ev,'launchConsistency')-75)*.15,'No major launch problem was identified.',conf(ev,'launchConsistency'));
}'''
newlaunch=r'''function launchPart(p,n,ev){
  if(n.launchVar){const s=val(ev,'launchConsistency');return part('launch','Launch consistency',17+8*n.launchQ,s,'Your launch varies, so consistency matters more than targeting a single launch window.',conf(ev,'launchConsistency'));}
  if(n.flight?.hasLaunch){const low=n.flight.launch.low||0,high=n.flight.launch.high||0,severity=Math.max(low,high),cons=val(ev,'launchConsistency'),neutralScore=80+(cons-75)*.15,neutralW=9,neutralC=conf(ev,'launchConsistency');if(low>=high&&low>0)return part('launch','Launch fit',blend(neutralW,18+10*n.launchQ,severity),blend(neutralScore,val(ev,'launchSupport'),severity),'Lower-than-target launch progressively increases the value of launch support without a hard cutoff.',blend(neutralC,conf(ev,'launchSupport'),severity));if(high>0)return part('launch','Launch fit',blend(neutralW,18+10*n.launchQ,severity),blend(neutralScore,val(ev,'launchControl'),severity),'Higher-than-target launch progressively increases the value of flight control without a hard cutoff.',blend(neutralC,conf(ev,'launchControl'),severity));return part('launch','Launch fit',neutralW,neutralScore,'Launch is near the speed-aware neutral window, so FORM keeps this category lower-weight.',neutralC);}
  if(n.launch==='low'){return part('launch','Launch fit',18+10*n.launchQ,val(ev,'launchSupport'),'Your lower launch increases the value of a head that adds launch without creating other conflicts.',conf(ev,'launchSupport'));}
  if(n.launch==='high'){return part('launch','Launch fit',18+10*n.launchQ,val(ev,'launchControl'),'Your higher launch increases the value of a head that controls flight.',conf(ev,'launchControl'));}
  return part('launch','Launch fit',9,80+(val(ev,'launchConsistency')-75)*.15,'No major launch problem was identified.',conf(ev,'launchConsistency'));
}'''
assert oldlaunch in src
src=src.replace(oldlaunch,newlaunch,1)

oldcarry=r'''function carryPart(p,n,ev){
  if(!n.carry||!n.speed)return null;
  const ypm=n.carry/n.speed;let s=82;const launchNeed=n.launch==='low'?val(ev,'launchSupport'):n.launch==='high'?val(ev,'launchControl'):80;const spinNeed=n.spin==='low'?val(ev,'spinSupport'):n.spin==='high'?val(ev,'spinReduction'):80;s=launchNeed*.45+spinNeed*.4+val(ev,'speedPotential')*.15;if(ypm>=2.4&&ypm<=2.75)s=(s+90)/2;
  return part('carry','Carry efficiency',6+5*n.carryQ,s,`Carry (${n.carry} yd) is used only as a supporting output check, not as a stand-alone distance target.`,(conf(ev,'launchSupport')+conf(ev,'spinSupport')+conf(ev,'speedPotential'))/3);
}'''
newcarry=r'''function carryPart(p,n,ev){
  if(!n.carry||!n.speed)return null;
  const ypm=n.carry/n.speed;let s=82;const launchNeed=n.flight?.hasLaunch?flightSignal(ev,n.flight.launch,'launchSupport','launchControl'):(n.launch==='low'?val(ev,'launchSupport'):n.launch==='high'?val(ev,'launchControl'):80);const spinNeed=n.flight?.hasSpin?flightSignal(ev,n.flight.spin,'spinSupport','spinReduction'):(n.spin==='low'?val(ev,'spinSupport'):n.spin==='high'?val(ev,'spinReduction'):80);s=launchNeed*.45+spinNeed*.4+val(ev,'speedPotential')*.15;if(ypm>=2.4&&ypm<=2.75)s=(s+90)/2;
  return part('carry','Carry efficiency',6+5*n.carryQ,s,`Carry (${n.carry} yd) is used only as a supporting output check; launch and spin use the same continuous speed-aware needs as the primary flight components.`,(conf(ev,'launchSupport')+conf(ev,'spinSupport')+conf(ev,'speedPotential'))/3);
}'''
assert oldcarry in src
src=src.replace(oldcarry,newcarry,1)

assert src != original
assert "x<2100?'low'" in src  # retained only as fallback classification for nonnumeric/general inputs
Path('assets/driver-engine-v225.js').write_text(src)
print('built assets/driver-engine-v225.js',len(src))