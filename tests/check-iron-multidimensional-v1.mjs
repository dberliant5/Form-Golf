import assert from "node:assert/strict";
import {ironFitScoreV1} from "./iron-fit-scorer-v1.mjs";

const base={dispersion95SqFt:180,carryYd:150,descentDeg:45};
const narrow={...base,lateralWidthYd:5};
const wide={...base,lateralWidthYd:10};
assert.ok(ironFitScoreV1({directionNeed:"high"},narrow).score>ironFitScoreV1({directionNeed:"high"},wide).score);

const draw={...base,axisDeg:-2.2}, fade={...base,axisDeg:2.2};
assert.ok(ironFitScoreV1({directionMiss:"right"},draw).score>ironFitScoreV1({directionMiss:"right"},fade).score);
assert.ok(ironFitScoreV1({directionMiss:"left"},fade).score>ironFitScoreV1({directionMiss:"left"},draw).score);

const noAxis={...base};
const neutralA=ironFitScoreV1({directionMiss:"right"},noAxis);
const neutralB=ironFitScoreV1({directionMiss:"right"},{...noAxis});
assert.equal(neutralA.score,neutralB.score);
assert.ok(neutralA.confidence<ironFitScoreV1({directionMiss:"right"},draw).confidence);

const q={dispersion95SqFt:85.4};
const i={dispersion95SqFt:136.6,lateralWidthYd:4.58,carryYd:146.8};
const qControl=ironFitScoreV1({consistencyNeed:"high",directionNeed:"high",targetCarryYd:147},q);
const iControl=ironFitScoreV1({consistencyNeed:"high",directionNeed:"high",targetCarryYd:147},i);
assert.ok(qControl.confidence<iControl.confidence,"sparse metric leader gained coverage advantage");

console.log("PASS iron multidimensional dispersion/directional gates",{qControl,iControl});
