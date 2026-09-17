import assert from "node:assert/strict";
import {rankIronsV1} from "../assets/iron-engine-v1.mjs";
const base={brandMode:"all",brands:[],sevenIron:150,priorities:["dispersion"],direction:"none",trajectory:"good",strike:"mid_center"};
const a=rankIronsV1(base); assert.ok(a.length>10); assert.ok(a[0].model);
const pxg=rankIronsV1({...base,priorities:["distance"],sevenIron:163}); assert.ok(pxg[0].model);
const pingOnly=rankIronsV1({...base,brandMode:"choose",brands:["PING"]}); assert.ok(pingOnly.length>0&&pingOnly.every(x=>/^ping /i.test(x.model)));
const right=rankIronsV1({...base,direction:"right"}),left=rankIronsV1({...base,direction:"left"});
assert.ok(right.length&&left.length);
console.log("PASS iron profile-to-ranking e2e",{control:a.slice(0,3).map(x=>x.model),distance:pxg.slice(0,3).map(x=>x.model),ping:pingOnly.map(x=>x.model)});
