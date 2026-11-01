import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {searchStage,searchMarkup,SEARCH_RECEIPT,SEARCH_STAGES} from '../public/research-search.js';
const receipt=JSON.parse(readFileSync(new URL('../public/research/mqar-search-receipt.json',import.meta.url),'utf8'));
assert.deepEqual(SEARCH_RECEIPT,receipt,'UI uses the audited receipt');
const stages=[0,1,2].map(searchStage);
assert.deepEqual(stages.map(s=>s.points.length),[2,3,5]);
assert.deepEqual(stages.map(s=>s.winner.lr),[.003,.01,.03]);
assert.deepEqual(stages.map(s=>s.test.accuracy),[.26416015625,.88330078125,.984130859375]);
assert.deepEqual(stages.map(s=>s.winner.accuracy),[.4578857421875,.943115234375,.992919921875]);
for(const s of stages){
 assert.ok(s.points.every(p=>p.lr<=s.max));
 assert.equal(s.test.nExamples,512);
 assert.match(s.test.experimentId,/mamba2_a0of4.*_s0_/);
 const markup=searchMarkup(s.index);
 assert.match(markup,/SELECT ON VALIDATION → CHECK ON TEST/);
 assert.match(markup,/One training seed/);
 assert.match(markup,/best LR is still at the search edge/);
 assert.ok(markup.includes(receipt.sourceCommit),'source links pinned');
 assert.ok(!markup.includes('confidence interval'),'no seed uncertainty invented');
}
assert.match(searchMarkup(0),/26.4%/);assert.match(searchMarkup(1),/88.3%/);assert.match(searchMarkup(2),/98.4%/);
assert.equal((searchMarkup(0).match(/class="search-point /g)||[]).length,2);
assert.equal((searchMarkup(2).match(/class="search-point /g)||[]).length,5);
assert.match(searchMarkup(2),/attention-only control collapsed/);
for(const bad of [-1,3,NaN,.5])assert.throws(()=>searchStage(bad));
console.log('Research search: pinned data, validation selection, separate test scores, exact reveal counts, scope limits and source links pass.');
