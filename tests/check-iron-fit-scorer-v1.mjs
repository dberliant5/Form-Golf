import assert from "node:assert/strict";
import {ironFitScoreV1} from "./iron-fit-scorer-v1.mjs";

const longWide={carryYd:164.2,dispersion95SqFt:360.6,descentDeg:42.69};
const shorterTight={carryYd:146.8,dispersion95SqFt:136.6,descentDeg:45.5};
let a=ironFitScoreV1({consistencyNeed:"high",carryNeed:"met",targetCarryYd:150,flight:"adequate"},longWide);
let b=ironFitScoreV1({consistencyNeed:"high",carryNeed:"met",targetCarryYd:150,flight:"adequate"},shorterTight);
assert.ok(b.score>a.score,"distance trap failed");

const flat={carryYd:158,dispersion95SqFt:170,descentDeg:42.7};
const stopping={carryYd:151,dispersion95SqFt:180,descentDeg:46.0};
a=ironFitScoreV1({carryNeed:"high",targetCarryYd:154,flight:"too_low"},flat);
b=ironFitScoreV1({carryNeed:"high",targetCarryYd:154,flight:"too_low"},stopping);
assert.ok(b.score>a.score,"stopping-power gate failed");

const toeStrong={dispersion95SqFt:190,zoneCarry:{mid_center:155,mid_toe:151,low_center:162}};
const toeWeak={dispersion95SqFt:190,zoneCarry:{mid_center:155,mid_toe:140,low_center:162}};
a=ironFitScoreV1({strike:"mid_toe"},toeStrong); b=ironFitScoreV1({strike:"mid_toe"},toeWeak);
assert.ok(a.score>b.score,"toe sensitivity failed");

const missing={dispersion95SqFt:190};
a=ironFitScoreV1({strike:"mid_toe"},missing); b=ironFitScoreV1({strike:"mid_toe"},{dispersion95SqFt:190,zoneCarry:{mid_center:155,mid_toe:155}});
assert.equal(a.score,b.score,"missing strike evidence incorrectly changed fit");
assert.ok(a.confidence<b.confidence,"missing strike evidence should reduce confidence");

const highA={dispersion95SqFt:190,zoneCarry:{mid_center:155,low_center:162}};
const highB={dispersion95SqFt:190,zoneCarry:{mid_center:155,low_center:162}};
a=ironFitScoreV1({strike:"high_center"},highA); b=ironFitScoreV1({strike:"high_center"},highB);
assert.equal(a.score,b.score,"invented high-face differentiation");

console.log("PASS iron scorer adversarial v1",{distanceTrap:[shorterTight,longWide].length,score:b.score});
