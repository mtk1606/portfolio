import {readMemory} from './visitor-memory.js';
const invitation=document.querySelector('#arrival-invitation'),skip=document.querySelector('#arrival-skip'),cue=document.querySelector('#departure-cue'),farewell=document.querySelector('#farewell-panel'),visited=new Set();let timer=0,ready=false;
function arrival(){const active=document.body.dataset.arriving==='true';invitation.hidden=!active;document.body.classList.toggle('study-arriving',active);}
skip.onclick=()=>document.dispatchEvent(new Event('study-arrival-skip'));document.addEventListener('room-first-frame',arrival);document.addEventListener('study-arrival-complete',arrival);arrival();
// Returning visitors never wait behind the opening veil.
if(readMemory().studyArrived===true)document.querySelector('#room-arrival')?.remove();
function offer(){ready=true;if(document.body.dataset.mode==='room'&&!document.body.classList.contains('load-failed'))cue.hidden=false;}
document.addEventListener('room-mode',e=>{arrival();farewell.hidden=e.detail!=='farewell';cue.hidden=true;if(!['room','walk','farewell'].includes(e.detail))visited.add(e.detail);if(e.detail==='room'&&(ready||visited.size>=2))offer();});
document.addEventListener('room-first-frame',()=>{timer=setTimeout(offer,90000);},{once:true});cue.onclick=()=>document.querySelector('[data-go="farewell"]')?.click();document.addEventListener('room-failed',()=>{invitation.hidden=true;cue.hidden=true;});addEventListener('pagehide',()=>clearTimeout(timer));

document.querySelectorAll('[data-go="farewell"]').forEach(b=>b.addEventListener('click',()=>{if(!document.body.classList.contains('load-failed'))return;document.querySelector('#room-menu')?.close();document.querySelector('#panel').hidden=false;document.body.dataset.mode='farewell';farewell.hidden=false;const back=document.querySelector('#back');back.hidden=false;back.onclick=()=>{farewell.hidden=true;document.querySelector('#panel').hidden=true;back.hidden=true;document.body.dataset.mode='room';document.querySelector('#room-menu-open').focus();};}));
