import {cleanAudio} from './exploration-state.js';
const KEY='mk-portfolio-audio-v1';let settings;try{settings=cleanAudio(JSON.parse(localStorage.getItem(KEY)||'{}'))}catch{settings=cleanAudio()}
let ctx,master,unlocked=false,serial=0,lastKind='',lastTime=-1;const voices=new Set();
export const audioSettings=()=>({...settings});export const audioUnlocked=()=>unlocked;
function emit(){document.dispatchEvent(new CustomEvent('portfolio-audio-setting',{detail:audioSettings()}));}
export function setAudioSettings(patch){settings=cleanAudio({...settings,...patch});try{localStorage.setItem(KEY,JSON.stringify(settings));localStorage.setItem('mk-audio-enabled',String(settings.objects));}catch{}if(master)master.gain.setTargetAtTime(settings.volume*.2,ctx.currentTime,.06);if(!settings.objects)stopObjectAudio();emit();}
function unlock(e){if(!e.isTrusted||e.type==='keydown'&&(e.repeat||['Tab','Shift','Alt','Control','Meta','Escape'].includes(e.key)))return;if(!unlocked){unlocked=true;document.dispatchEvent(new Event('portfolio-audio-unlocked'));}}
document.addEventListener('pointerdown',unlock,true);document.addEventListener('keydown',unlock,true);document.addEventListener('click',unlock,true);
function setup(){if(!unlocked||document.hidden)return false;const A=window.AudioContext||window.webkitAudioContext;if(!A)return false;if(!ctx){ctx=new A();master=ctx.createGain();master.gain.value=settings.volume*.2;const limit=ctx.createDynamicsCompressor();limit.threshold.value=-18;limit.ratio.value=3;master.connect(limit);limit.connect(ctx.destination);}ctx.resume().catch(()=>{});return true;}
export function stopObjectAudio(){serial++;for(const voice of voices)try{voice.stop()}catch{}voices.clear();if(ctx)ctx.suspend().catch(()=>{});}
function track(source,nodes){voices.add(source);source.onended=()=>{voices.delete(source);source.disconnect();nodes.forEach(n=>n.disconnect());};if(voices.size>8){const first=voices.values().next().value;try{first.stop()}catch{}voices.delete(first);}}
function noise(at,duration,frequency,amp,q=.6){const n=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain(),buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*duration),ctx.sampleRate),data=buffer.getChannelData(0);let smooth=0;for(let i=0;i<data.length;i++){smooth=.72*smooth+.28*(Math.random()*2-1);data[i]=smooth;}n.buffer=buffer;filter.type='bandpass';filter.frequency.value=frequency;filter.Q.value=q;gain.gain.setValueAtTime(.0001,at);gain.gain.linearRampToValueAtTime(amp,at+.008);gain.gain.exponentialRampToValueAtTime(.0001,at+duration);n.connect(filter);filter.connect(gain);gain.connect(master);track(n,[filter,gain]);n.start(at);n.stop(at+duration+.01);}
function tone(at,freq,duration,amp,end=freq){const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(freq,at);o.frequency.exponentialRampToValueAtTime(end,at+duration);g.gain.setValueAtTime(.0001,at);g.gain.linearRampToValueAtTime(amp,at+.004);g.gain.exponentialRampToValueAtTime(.0001,at+duration);o.connect(g);g.connect(master);track(o,[g]);o.start(at);o.stop(at+duration+.01);}
export function playObjectSound(kind='press'){if(!settings.objects||!unlocked||document.hidden)return false;try{if(!setup())return false;const t=ctx.currentTime;if(kind===lastKind&&t-lastTime<.065)return false;lastKind=kind;lastTime=t;const v=.94+Math.random()*.12;
 if(kind==='dial'){noise(t,.045,1700*v,.5);tone(t,340*v,.045,.15,170);noise(t+.038,.025,850,.17);}
 else if(kind==='page'||kind==='leaf'){noise(t,.16,1100*v,.58);noise(t+.075,.13,2400*v,.3);}
 else if(kind==='cartridge'){noise(t,.1,480*v,.8);tone(t,140*v,.12,.35,78);noise(t+.11,.045,1800,.26);}
 else if(kind==='boot'){tone(t,220,.07,.16);tone(t+.095,330,.07,.12);tone(t+.19,440,.09,.09);}
 else if(kind==='paper'||kind==='ticket'){noise(t,.1,900*v,.6);noise(t+.07,.14,1900*v,.4);noise(t+.18,.06,700,.2);}
 else if(kind==='portal'){noise(t,.55,480,.2);tone(t,80,.5,.17,48);}
 else if(kind==='discovery'){tone(t,420*v,.085,.18,360);noise(t,.05,900,.25);}
 else{noise(t,.045,1200*v,.35);tone(t,190*v,.055,.16,110);}return true;
 }catch{return false;}}
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopObjectAudio();});addEventListener('pagehide',stopObjectAudio);document.addEventListener('universe-leaving',stopObjectAudio);
// Future narration can use these events to duck the existing ambience, without overlapping clips.
export function narrationActivity(active){document.dispatchEvent(new CustomEvent('portfolio-narration-active',{detail:active===true}));}
