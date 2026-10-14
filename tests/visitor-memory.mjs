import assert from 'node:assert/strict';
import {readMemory,remember,recordSolve,playlistURL,preference,forgetMemory} from '../public/visitor-memory.js';
assert.deepEqual(readMemory(),{});assert.equal(remember('volume',.1),false,'blocked storage never breaks the room');
let value=null;globalThis.localStorage={getItem:()=>value,setItem:(_,v)=>value=v,removeItem:()=>value=null};
value='{broken';assert.deepEqual(readMemory(),{});remember('quality','high');remember('researchPage',3);assert.equal(preference('quality','auto',['auto','light','high']),'high');assert.equal(readMemory().researchPage,3);remember('quality','unexpected');assert.equal(preference('quality','auto',['auto','light','high']),'auto');
const date=new Date('2026-10-13T12:00:00Z');recordSolve('abc',date);recordSolve('abc',new Date('2026-10-14T12:00:00Z'));assert.equal(readMemory().solved.abc,date.toISOString(),'keep original solve date');
for(const bad of ['javascript:alert(1)','http://youtube.com/watch?v=a','https://youtube.com.evil.test','https://evil.test/?youtube.com'])assert.equal(playlistURL(bad),null);
assert.equal(playlistURL('https://open.spotify.com/playlist/abc'),'https://open.spotify.com/playlist/abc');assert.equal(playlistURL('https://artist.bandcamp.com/album/example'),'https://artist.bandcamp.com/album/example');forgetMemory();assert.deepEqual(readMemory(),{});console.log('Visitor memory: corrupt/blocked storage, preference validation, first solve date, playlist URL safety and local reset pass.');
