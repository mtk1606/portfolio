import assert from 'node:assert/strict';
import {POKER_CASES,YEAR_CASES,INITIAL_WEIGHTS,portfolioResult,gridComparison,callThreshold,foldThreshold,callEV,bluffEV} from '../public/decision-table-data.js';
assert.equal(POKER_CASES.length,3);assert.equal(YEAR_CASES.length,3);
for(const p of POKER_CASES){const cards=[...p.hole,...p.board,...p.opponent];assert.equal(new Set(cards).size,9,'No card can occur twice');assert.ok(p.sources.length);assert.ok(p.actions.some(a=>a[0]===p.actual));for(const [id]of p.reasons)assert.ok(p.feedback[id]);assert.ok(p.pot>=p.toCall);}
assert.equal(callThreshold(4600000,2800000),28/74);
assert.ok(Math.abs(callEV(4600000,2800000,28/74))<1e-8);
assert.ok(Math.abs(bluffEV(1800000,2800000,foldThreshold(1800000,2800000)))<1e-8);
assert.equal(callEV(420,200,1),420);assert.equal(callEV(420,200,0),-200);
for(const y of YEAR_CASES){const equal=portfolioResult(INITIAL_WEIGHTS,y.returns);assert.ok(Math.abs(equal.percent-Object.values(y.returns).reduce((a,b)=>a+b,0)/4)<1e-9);for(const key of Object.keys(INITIAL_WEIGHTS)){const weights=Object.fromEntries(Object.keys(INITIAL_WEIGHTS).map(k=>[k,k===key?100:0]));assert.ok(Math.abs(portfolioResult(weights,y.returns).percent-y.returns[key])<1e-9);}
 const cmp=gridComparison(INITIAL_WEIGHTS,y.returns);assert.equal(cmp.total,286);assert.ok(cmp.below>=0&&cmp.below<=286);const best=Object.keys(y.returns).sort((a,b)=>y.returns[b]-y.returns[a])[0];assert.equal(gridComparison(Object.fromEntries(Object.keys(y.returns).map(k=>[k,k===best?100:0])),y.returns).below,286);}
assert.ok(Math.abs(portfolioResult({stocks:100,bonds:0,gold:0,bills:0},YEAR_CASES[1].returns).end-6345)<1e-8);
for(const bad of [{stocks:100,bonds:100,gold:0,bills:0},{stocks:NaN,bonds:0,gold:0,bills:100},{stocks:-5,bonds:5,gold:0,bills:100},{}])assert.throws(()=>portfolioResult(bad,YEAR_CASES[0].returns),RangeError);
console.log('Decision table: unique cards, legal actions, call/bluff break-even, capital conservation, invalid-allocation rejection and all 286 comparison portfolios passed.');
