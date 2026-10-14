import {installAudioPreference} from './audio-preference.js';
import {installRoomLayout} from './room-layout.js';
import {preference,remember,readMemory,playlistURL,forgetMemory} from './pixel-visitor-memory.js';
import {setMusicPlaying,setTVChannel,setRoomLamp} from './pixel-room-scene.js';
import {createScore} from './original-score.js';
const $=s=>document.querySelector(s),score=createScore('city');let wanted=false,request=0;
async function toggle(){wanted=!wanted;const token=++request;try{if(wanted)await score.play();else score.stop();if(token!==request){if(!wanted)score.stop();return}setMusicPlaying(wanted);if(wanted)score.cue('needle');$('#music-toggle').textContent=wanted?'Pause record Ⅱ':'Play record ▷';$('#music-toggle').setAttribute('aria-pressed',String(wanted));$('#music-status').textContent=wanted?'Playing · '+($('#record-choice').value==='city'?'City after dark':'Velvet hour'):'The needle is resting.'}catch{wanted=false;$('#music-status').textContent='Audio could not start. Try Play again.'}}
$('#music-toggle').onclick=toggle;$('#record-choice').onchange=e=>{score.setStyle(e.target.value);$('#music-status').textContent=wanted?'Playing · '+e.target.selectedOptions[0].textContent:'The needle is resting.'};$('#music-volume').oninput=e=>score.setVolume(Number(e.target.value));document.querySelectorAll('[data-channel]').forEach(b=>b.onclick=()=>{setTVChannel(b.dataset.channel);document.querySelectorAll('[data-channel]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))});
document.addEventListener('room-mode',e=>{const m=e.detail;$('#music-panel').hidden=m!=='music';$('#tv-panel').hidden=m!=='tv';if(m==='music')$('#hint').textContent='Pick a record. Let the city carry on.';if(m==='tv')$('#hint').textContent='A late transmission. Nothing urgent.';if(m==='walk')$('#hint').textContent='Drag to look · WASD / arrows to walk · Click an object · Esc to return'});
document.addEventListener('visibilitychange',()=>{if(document.hidden)score.suspend();else if(wanted)score.resume()});addEventListener('pagehide',()=>score.stop());

// Sitting is deliberately quiet: retain the soundtrack, let the interface recede.
let seated=false,restTimer=0;
function wake(){if(!seated)return;document.body.classList.remove('lounge-resting');clearTimeout(restTimer);restTimer=setTimeout(()=>{if(seated&&!['BUTTON','A','INPUT','SELECT'].includes(document.activeElement?.tagName))document.body.classList.add('lounge-resting')},4200)}
document.addEventListener('room-mode',e=>{seated=e.detail==='sofa';clearTimeout(restTimer);document.body.classList.remove('lounge-resting');$('#rest-cue').hidden=!seated;$('#mementos-panel').hidden=e.detail!=='mementos';if(seated){$('#hint').textContent='No next task. Just the view.';$('#room-canvas').focus({preventScroll:true});wake()}if(e.detail==='mementos')$('#hint').textContent='A few things that make this place mine.'});
for(const name of ['pointermove','pointerdown','keydown','focusin'])document.addEventListener(name,wake,{passive:true});

let spatial=true;$('#spatial-sound').onchange=e=>{spatial=e.target.checked;if(!spatial)score.setSpatial(0,0)};
document.addEventListener('room-listener',e=>{if(!spatial||!wanted)return;const {x,z,lookX,lookZ}=e.detail,dx=8.2-x,dz=-2.8-z,fx=lookX-x,fz=lookZ-z,n=Math.hypot(fx,fz)||1,d=Math.hypot(dx,dz);score.setSpatial(d,(-fz*dx+fx*dz)/(n*(d||1))*.45)});
$('#reading-lamp').onclick=()=>{const on=$('#reading-lamp').getAttribute('aria-pressed')!=='true';setRoomLamp(on);$('#reading-lamp').setAttribute('aria-pressed',String(on));$('#reading-lamp').textContent=on?'READING LAMP ON':'READING LAMP OFF';score.cue('switch')};
document.addEventListener('room-mode',e=>{$('#folded-note-panel').hidden=e.detail!=='note';if(e.detail==='note')$('#hint').textContent='A note for the difficult days.'});

addEventListener('pagehide',()=>{wanted=false;request++;setMusicPlaying(false);$('#music-toggle').setAttribute('aria-pressed','false');$('#music-toggle').textContent='Play record ▷';$('#music-status').textContent='The needle is resting.'});

// Restore preferences, never the playing state.
const savedRecord=preference('record','city',['city','velvet']);$('#record-choice').value=savedRecord;score.setStyle(savedRecord);
function markRecord(value){document.querySelectorAll('[data-record]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.record===value)));remember('record',value)}
markRecord(savedRecord);const changeRecord=$('#record-choice').onchange;$('#record-choice').onchange=e=>{changeRecord(e);markRecord(e.target.value)};
document.querySelectorAll('[data-record]').forEach(b=>b.onclick=()=>{$('#record-choice').value=b.dataset.record;$('#record-choice').onchange({target:$('#record-choice')})});
const volume=Number(readMemory().volume);if(Number.isFinite(volume)&&volume>=0&&volume<=.3){$('#music-volume').value=volume;score.setVolume(volume)}
$('#music-volume').oninput=e=>{const v=Number(e.target.value);score.setVolume(v);remember('volume',v)};
spatial=preference('spatial',true,[true,false]);$('#spatial-sound').checked=spatial;$('#spatial-sound').onchange=e=>{spatial=e.target.checked;remember('spatial',spatial);if(!spatial)score.setSpatial(0,0)};
const lamp=preference('lamp',true,[true,false]);setRoomLamp(lamp);$('#reading-lamp').setAttribute('aria-pressed',String(lamp));$('#reading-lamp').textContent=lamp?'READING LAMP ON':'READING LAMP OFF';const lampClick=$('#reading-lamp').onclick;$('#reading-lamp').onclick=()=>{lampClick();remember('lamp',$('#reading-lamp').getAttribute('aria-pressed')==='true')};
function showPlaylist(){const url=playlistURL(readMemory().playlist||'');$('#playlist-open').hidden=!url;$('#playlist-remove').hidden=!url;if(url){$('#playlist-open').href=url;$('#playlist-url').value=url}else{$('#playlist-open').removeAttribute('href');$('#playlist-url').value=''}}
$('#playlist-form').onsubmit=e=>{e.preventDefault();const url=playlistURL($('#playlist-url').value.trim());if(!url){$('#playlist-status').textContent='Use an HTTPS link from one of the music services listed above.';return}const saved=remember('playlist',url);$('#playlist-status').textContent=saved?'Your record is in the sleeve. Saved on this browser.':'This browser could not save the record.';showPlaylist()};
$('#playlist-open').onclick=()=>{if(wanted)toggle()};$('#playlist-remove').onclick=()=>{remember('playlist',null);showPlaylist();$('#playlist-status').textContent='The sleeve is empty.'};showPlaylist();

$('#forget-visit').onclick=()=>{const ok=forgetMemory();$('#forget-status').textContent=ok?'Local memories cleared. Reload to reset the room. Shared arcade scores are unchanged.':'This browser could not clear its saved settings.'};

installRoomLayout();

installAudioPreference({buttons:[$('#room-audio')],paint:enabled=>{$('#room-audio').textContent=enabled?'SOUND ON':'SOUND OFF'},apply:enabled=>{$('#sound').setAttribute('aria-pressed',String(enabled));$('#sound').textContent=enabled?'GAME FX ON':'GAME FX OFF';if(wanted!==enabled)toggle()}});

let returning=false;
$('.universe-back').addEventListener('click',async e=>{if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();if(returning)return;returning=true;wanted=false;request++;score.fadeOut(.45);setMusicPlaying(false);const veil=document.createElement('div');veil.className='room-return-veil';document.body.append(veil);try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)await veil.animate([{opacity:0},{opacity:1}],{duration:500,fill:'forwards'}).finished}catch{}location.assign($('.universe-back').href)});
addEventListener('pageshow',()=>{returning=false;document.querySelector('.room-return-veil')?.remove()});
