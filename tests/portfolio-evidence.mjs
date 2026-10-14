import assert from 'node:assert/strict';
import {evaluateTrace} from '../public/decision-trace.js';
import {reportGap} from '../public/research-notebook.js';
import {experienceCase} from '../public/experience-cases.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} ~= ${b}`);
const normal=evaluateTrace();assert.equal(normal.filled,20);assert.equal(normal.remaining,10);near(normal.gross,1.6);near(normal.fees,.4);near(normal.net,1.2);
assert.equal(evaluateTrace({flow:40}).filled,0);assert.equal(evaluateTrace({flow:60}).filled,0);assert.equal(evaluateTrace({flow:200}).filled,30);assert.equal(evaluateTrace({ahead:0}).filled,30);near(evaluateTrace({feeBps:8}).net,0);assert.ok(evaluateTrace({feeBps:15}).net<0);
for(let flow=0;flow<=200;flow+=5){const r=evaluateTrace({flow});assert.equal(r.filled+r.remaining,30);assert.ok(r.filled<=Math.max(0,flow-60));}
assert.deepEqual(reportGap(),{truth:18,gap:6});assert.equal(reportGap({reported:18}).gap,0);assert.equal(reportGap({reported:0}).gap,-18);
assert.match(experienceCase('bmo'),/not yet included/);assert.match(experienceCase('astra'),/MY CONTRIBUTION/);assert.match(experienceCase('ntt'),/200\+/);
console.log('Execution quantity conservation, queue boundaries, fee break-even and independent report reconciliation pass.');
