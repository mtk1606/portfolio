import assert from 'node:assert/strict';
import {evaluateTrace,traceStages,mountDecisionTrace} from '../public/decision-trace.js';
import {roomInsets} from '../public/room-layout.js';
// Exercise the mounted controls without a browser renderer.
const elements=new Map();function el(key){if(!elements.has(key))elements.set(key,{value:key==='[data-fee]'?'2':key==='[data-flow]'?'80':key==='[data-assumption]'?'60':'',textContent:'',setAttribute(k,v){this[k]=v}});return elements.get(key)}
const buttons=Array.from({length:5},(_,i)=>({...el('step'+i),dataset:{traceStep:String(i)}}));
const host={innerHTML:'',querySelector:el,querySelectorAll:()=>buttons};mountDecisionTrace(host);
assert.equal(el('[data-fill]').textContent,'20 / 30 shares');buttons[2].onclick();assert.match(el('[data-stage-text]').textContent,/20 fill ours/);el('[data-flow]').value='40';el('[data-flow]').oninput();assert.equal(el('[data-fill]').textContent,'0 / 30 shares');assert.match(el('[data-verdict]').textContent,/No position/);el('[data-assumption]').value='0';el('[data-assumption]').onchange();assert.equal(el('[data-fill]').textContent,'30 / 30 shares');el('[data-fee]').value='15';el('[data-fee]').oninput();assert.match(el('[data-net]').textContent,/−\$2.10/);el('[data-reset]').onclick();assert.equal(el('[data-fill]').textContent,'20 / 30 shares');assert.equal(el('[data-prev]').disabled,true);assert.equal(el('[data-fee]').value,2);
for(const ahead of [0,60])for(const flow of [0,40,60,80,120]){const r=evaluateTrace({ahead,flow});assert.equal(traceStages({ahead,flow}).length,5);assert.ok(r.filled>=0&&r.filled<=30)}
for(const [height,footer] of [[568,100],[844,120],[390,90],[900,200]]){const r=roomInsets(height,footer);assert.ok(r.bottom>footer);assert.ok(r.panelHeight+r.bottom+100<=height)}
console.log('Mounted order controls: stage navigation, zero fills, counterfactual fills, negative net and reset pass. Room panel insets checked at portrait/landscape sizes. No browser rendering is claimed.');
