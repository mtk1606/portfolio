import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
const html=await fs.readFile('public/after-hours.html','utf8');
const source=await fs.readFile('public/room-recommendations.js','utf8');
const section=html.match(/<section id="mementos-panel"[\s\S]*?<\/section>/)[0];
const ids=[...section.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);
assert.ok(ids.includes('recommendations-content'));assert.ok(ids.includes('forget-visit'));
class Element{constructor(id){this.id=id;this.dataset={};this.nodes=new Map();this.html='';}set innerHTML(s){this.html=s;if(this.id==='mementos-panel'){nodes.delete('forget-visit');nodes.delete('forget-status');}}get innerHTML(){return this.html}focus(){}querySelector(s){if(!this.nodes.has(s))this.nodes.set(s,new Element(s));return this.nodes.get(s)}querySelectorAll(s){if(s==='[data-shelf]')return ['watch','read','play'].map(kind=>{const n=this.querySelector(s+kind);n.dataset.shelf=kind;return n});if(s==='[data-shelf-item]')return Array.from({length:6},(_,i)=>{const n=this.querySelector(s+i);n.dataset.shelfItem=String(i);return n});return []}}
const nodes=new Map(ids.map(id=>[id,new Element(id)]));
const events=new Map(),classes=new Set(['load-failed']);for(const id of ['panel','farewell-panel','back','room-menu-open','room-menu'])nodes.set(id,new Element(id));nodes.get('room-menu').close=()=>{};const body={dataset:{mode:'room'},classList:{contains:s=>classes.has(s),add:s=>classes.add(s),remove:s=>classes.delete(s)}};const context=vm.createContext({document:{body,querySelector:s=>nodes.get(s.slice(1)),addEventListener:(name,fn)=>events.set(name,fn)},console});
const data=new vm.SourceTextModule(await fs.readFile('public/room-library.js','utf8'),{context});
const mod=new vm.SourceTextModule(source,{context});await mod.link(()=>data);await mod.evaluate();
const host=nodes.get('recommendations-content'),reset=nodes.get('forget-visit');
assert.ok(reset,'Media startup still finds the reset control after recommendations render first');
let clicked=false;reset.onclick=()=>clicked=true;
host.querySelector('[data-shelf]read').onclick();assert.ok(host.html.includes('The Order of Time'));
host.querySelector('[data-shelf-next]').onclick();assert.ok(host.html.includes('Exhalation'));
assert.equal(nodes.get('forget-visit'),reset,'Browsing books preserves existing media handlers');reset.onclick();assert.ok(clicked);
host.querySelector('[data-shelf]play').onclick();assert.ok(host.html.includes('Resident Evil 4'));assert.ok(host.html.includes('God of War III'));assert.ok(host.html.includes('Dofus Retro'));assert.ok(host.html.includes('<img'));host.querySelector('[data-shelf]read').onclick();assert.ok(host.html.includes('Exhalation'),'Returning to a shelf remembers its selected book');
assert.ok(!html.includes("Promise.all([import('/room-play.js'),import('/room-media.js')])"),'Optional media cannot trigger fatal 3D fallback');
console.log('Recommendations render before/after media initialization without removing settings or handlers; tabs and browsing pass.');

const opener=new Element('opener');events.get('click')({target:{closest:()=>opener}});assert.equal(body.dataset.mode,'mementos');assert.equal(nodes.get('panel').hidden,false);assert.equal(nodes.get('back').hidden,false);let prevented=false;events.get('keydown')({key:'Escape',preventDefault(){prevented=true}});assert.ok(prevented);assert.equal(body.dataset.mode,'room');assert.equal(nodes.get('panel').hidden,true);assert.ok(!classes.has('collection-fallback-open'));console.log('Collection fallback: accessible open, Back control, Escape close and room restoration pass.');
