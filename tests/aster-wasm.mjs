import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
// Emscripten 3.1.6's Node path predates native ESM helpers.
globalThis.require=createRequire(import.meta.url);
globalThis.__dirname=fileURLToPath(new URL('../public/aster/',import.meta.url));
const {default:createEngine}=await import('../public/aster/engine.js');
const engine=await createEngine({wasmBinary:readFileSync(new URL('../public/aster/engine.wasm',import.meta.url))});
const fixture=readFileSync(new URL('../public/aster/fixture.bin',import.meta.url));
const receipt=JSON.parse(readFileSync(new URL('../public/aster/reference.json',import.meta.url),'utf8'));
assert.equal(createHash('sha256').update(fixture).digest('hex'),receipt.sha256);
function replay(bytes,step){const ptr=engine._malloc(bytes.length||1);try{engine.HEAPU8.set(bytes,ptr);return JSON.parse(engine.UTF8ToString(engine._replay(ptr,bytes.length,step)));}finally{engine._free(ptr);}}
for(let round=0;round<3;round++)for(const step of [...receipt.states.keys()].sort((a,b)=>round%2?b-a:a-b)){
 const state=replay(fixture,step);assert.equal(state.step,step);assert.equal(state.total,12);
 const {orders,hash,levels}=state;assert.deepEqual({orders,hash,levels},receipt.states[step],`checkpoint ${step}`);
}
assert.equal(replay(fixture,3).levels[0].fifo[0].id,'9007199254740993');
assert.deepEqual(replay(fixture,8).levels[0].fifo.map(o=>o.id),['9007199254740996','9007199254740997']);
for(const n of [1,2,fixture.length-1])assert.ok(replay(fixture.subarray(0,n),0).error,'truncated framing rejected');
let bad=Buffer.from(fixture);bad[2]=63;assert.ok(replay(bad,0).error,'unknown type rejected');
bad=Buffer.from(fixture);bad.writeUInt32BE(999,38+38+38+2+19);assert.ok(replay(bad,4).error,'overcancel rejected');
bad=Buffer.from(fixture);bad[2+19]=90;assert.ok(replay(bad,0).error,'invalid side rejected');
assert.ok(replay(Buffer.concat([fixture.subarray(0,38),fixture.subarray(0,38)]),2).error,'duplicate reference rejected');
assert.ok(replay(fixture,-1).error);assert.ok(replay(fixture,13).error);
assert.deepEqual(replay(fixture,12).levels,receipt.states[12].levels,'recovery after rejection');
console.log('ASTER Wasm: 39 checkpoint comparisons, 64-bit IDs, FIFO replacement, reset and malformed input checks passed.');
