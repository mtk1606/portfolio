import assert from 'node:assert/strict';
import {gravityProgress,wordFlight,tidalState} from '../public/threshold-flight.js';
assert.equal(gravityProgress(-1),0);
assert.equal(gravityProgress(2),1);
assert.ok(gravityProgress(.5)<.12,'first half stays slow');
const distances=[0,.2,.4,.6,.8,1].map(gravityProgress);
const speeds=distances.slice(1).map((n,i)=>n-distances[i]);
assert.ok(speeds.every((n,i)=>!i||n>speeds[i-1]),'equal time intervals travel progressively farther');
for(const [dx,dy] of [[600,400],[-600,-400],[0,400],[0,0]]){
 const frames=wordFlight(dx,dy,3);
 assert.equal(frames[0].opacity,1);assert.equal(frames.at(-1).opacity,0);
 assert.match(frames.at(-1).transform,/scale\(0, 0\)/);
 assert.ok(frames.every(f=>!f.transform.includes('NaN')&&!f.transform.includes('Infinity')));
 const target=frames.at(-1).transform.match(/translate\(([-\d.e+]+)px, ([-\d.e+]+)px\)/);
 assert.ok(Math.abs(Number(target[1])-dx)<1e-8&&Math.abs(Number(target[2])-dy)<1e-8,'all paths converge exactly at the lens centre');
}
console.log('Threshold typography: accelerating travel, finite paths and exact centre convergence passed. WebGL rendering is not simulated.');

for(const [dx,dy] of [[500,0],[0,500],[-300,400]]){
 const early=tidalState(dx,dy,.3),near=tidalState(dx,dy,.96);
 assert.ok(near.stretch/near.width>early.stretch/early.width*8,'tidal anisotropy grows strongly toward the centre');
 assert.ok(Math.abs(near.angle-Math.atan2(dy,dx)*180/Math.PI)<1e-8,'stretch axis points toward the hole');
 const end=tidalState(dx,dy,1);assert.equal(end.stretch,0);assert.equal(end.width,0);assert.equal(end.opacity,0);
}
