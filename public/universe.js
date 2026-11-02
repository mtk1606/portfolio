import {absorbThresholdText} from './threshold-flight.js?v=144';
import {audioSettings,audioUnlocked,setAudioSettings} from './portfolio-audio.js';
import {createScore} from './original-score.js';
// The threshold is an actual procedural ray tracer, loaded only when needed.
const q=s=>document.querySelector(s),threshold=q('#threshold'),sceneHost=q('#gravity-scene');
const quiet=()=>document.body.classList.contains('no-motion')||matchMedia('(prefers-reduced-motion: reduce)').matches;
let engine=null,loading=null,started=false,finished=false,flightTimer,exitTimer,darkTimer,ambientReady=false;
const content=[q('header'),q('main'),q('footer')];content.forEach(e=>e.inert=true);
let cancelFlightSound=()=>{},cancelTextAbsorption=()=>{},replaying=false;
function exit(cinematic=false){
 if(finished)return;finished=true;clearTimeout(flightTimer);clearTimeout(darkTimer);cancelFlightSound();
 const animate=cinematic===true&&!quiet();engine?.stop();
 const complete=()=>{threshold.hidden=true;cancelTextAbsorption();q('#skip-flight').hidden=true;content.forEach(e=>e.inert=false);cosmicScore.setStyle('cosmic');syncAudio();document.dispatchEvent(new Event('portfolio-entered'));if(animate||replaying)q('#home').scrollIntoView({behavior:'instant',block:'start'});replaying=false;q('#home .line-link').focus({preventScroll:true})};
 if(animate){q('#skip-flight').hidden=true;threshold.classList.add('arrival-flash');cosmicScore.fadeOut(.12);darkTimer=setTimeout(()=>{threshold.classList.add('departed');document.body.classList.add('arriving');exitTimer=setTimeout(complete,850)},180)}else{threshold.classList.add('departed');complete()}
 try{sessionStorage.setItem('mk-ray-arrived-v3','1')}catch{}
}
async function initGravity(){if(engine)return engine;if(loading)return loading;loading=(async()=>{try{q('#journey-status').textContent='Preparing the journey…';const {createBlackHole}=await import('./black-hole.js');engine=await createBlackHole(sceneHost,{reduced:quiet,onArrival:()=>exit(true),onReady:()=>{if(finished)return;threshold.classList.add('scene-ready');q('#journey-status').textContent=quiet()?'TAKE YOUR TIME. ENTER WHEN READY.':'DRAG TO LOOK · PRESS & HOLD TO BEND LIGHT';q('#enter-universe').disabled=false;},onError:fail});if(finished)engine.stop();return engine}catch(e){fail(e);return null}})();return loading;}
function fail(e){engine?.stop();engine=null;sceneHost.replaceChildren();threshold.classList.add('render-unavailable','scene-ready');q('#journey-status').textContent='3D rendering is unavailable on this browser. You can still explore the site.';q('#enter-universe').textContent='EXPLORE THE SITE →';q('#enter-universe').disabled=false;if(started&&!finished)exit();console.info('Black-hole renderer unavailable:',e.message)}
function enter(){if(started||finished)return;if(quiet()||!engine){exit();return}started=true;cancelTextAbsorption=absorbThresholdText(threshold);q('#skip-flight').hidden=false;q('#skip-flight').focus({preventScroll:true});threshold.classList.add('travelling');q('#journey-status').textContent='A LITTLE FURTHER.';q('#enter-universe').disabled=true;engine.plunge();if(ambientOn)flightSound();flightTimer=setTimeout(()=>{if(!finished)exit(true)},8000);}
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',()=>{if(started&&!finished&&quiet())exit()});
q('#enter-universe').onclick=enter;q('#skip-intro').onclick=exit;q('#skip-flight').onclick=exit;
q('#replay-intro').onclick=async()=>{replaying=true;cancelTextAbsorption();q('#skip-flight').hidden=true;clearTimeout(exitTimer);clearTimeout(darkTimer);finished=false;started=false;cancelFlightSound();threshold.classList.remove('scene-ready');sceneHost.classList.remove('gravity-visible');threshold.hidden=false;threshold.classList.remove('departed','travelling','arrival-flash');document.body.classList.remove('arriving');content.forEach(e=>e.inert=true);q('#enter-universe').disabled=true;q('#journey-status').textContent='Preparing the journey…';cosmicScore.setStyle('threshold');if(!engine)loading=null;await initGravity();engine?.reset();q('#skip-intro').focus({preventScroll:true});};
threshold.addEventListener('keydown',e=>{if(e.key==='Escape')exit();if(e.key==='Tab'){const items=[...threshold.querySelectorAll('a[href],button:not(:disabled),select,summary,canvas[tabindex]')].filter(el=>!el.closest('[inert]')&&el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden');const first=items[0],end=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();end.focus()}else if(!e.shiftKey&&document.activeElement===end){e.preventDefault();first.focus()}}});
try{if(sessionStorage.getItem('mk-ray-arrived-v3')||new URLSearchParams(location.search).get('chess')==='1'){finished=true;threshold.hidden=true;content.forEach(e=>e.inert=false)}}catch{}
if(!finished){q('#enter-universe').disabled=true;initGravity();}
// Animated exhibit overlays. Motion is illustrative, not a live ML inference claim.
const flow=q('#execution-flow');
if(flow){
const ctx=flow.getContext('2d');flow.width=640;flow.height=410;
const branches=Array.from({length:24},(_,i)=>({y:25+i*15,speed:.07+Math.random()*.07,offset:Math.random()}));let exhibitTime=0,prevTime=0;
// Only the exhibit being explored animates; no continuous offscreen canvas loop.
let exhibitFrame=0,exhibitVisible=false,exhibitEngaged=false;
const executionCard=flow.closest('.exhibit');
function drawExhibits(t){exhibitFrame=0;const dt=Math.min((t-(prevTime||t))/1000,.05);prevTime=t;if(exhibitEngaged&&!quiet())exhibitTime+=dt;ctx.clearRect(0,0,640,410);for(const b of branches){const u=(exhibitTime*b.speed+b.offset)%1,x=50+u*530,y=205+(b.y-205)*Math.pow(u,.65);ctx.fillStyle=u<.22?'#e99a60':'#e8e2d5';ctx.shadowBlur=4;ctx.shadowColor=ctx.fillStyle;ctx.beginPath();ctx.arc(x,y,1.3,0,Math.PI*2);ctx.fill()}if(exhibitVisible&&exhibitEngaged&&!quiet()&&!document.hidden)exhibitFrame=requestAnimationFrame(drawExhibits)}
function syncExhibit(){cancelAnimationFrame(exhibitFrame);exhibitFrame=0;prevTime=0;if(exhibitVisible&&!document.hidden)exhibitFrame=requestAnimationFrame(drawExhibits)}
for(const event of ['pointerenter','focusin'])executionCard.addEventListener(event,()=>{exhibitEngaged=true;syncExhibit()});
for(const event of ['pointerleave','focusout'])executionCard.addEventListener(event,()=>{exhibitEngaged=executionCard.matches(':hover,:focus-within');syncExhibit()});
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries){entry.target.classList.toggle('motion-visible',entry.isIntersecting);if(entry.target===executionCard){exhibitVisible=entry.isIntersecting;syncExhibit()}}},{threshold:.05});document.querySelectorAll('.exhibit,.market-wire').forEach(el=>observer.observe(el))}else{exhibitVisible=true;syncExhibit()}
document.addEventListener('visibilitychange',()=>{document.body.classList.toggle('page-sleeping',document.hidden);syncExhibit()});new MutationObserver(syncExhibit).observe(document.body,{attributes:true,attributeFilter:['class']});
}
document.querySelectorAll('[data-experience]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.chapter-switch button').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.experience===b.dataset.experience)))}));
// Original, quiet ambient score. Audio starts only after a visitor chooses sound.
let ambientContext,ambientGain,ambientOn=false,ambientNodes=[],narrating=false;
const cosmicScore=createScore(threshold.hidden?'cosmic':'threshold');
function ambient(enable){ambientOn=enable;if(!enable){cancelFlightSound();cosmicScore.stop();return}cosmicScore.play().then(()=>{ambientContext=cosmicScore.context;ambientGain=cosmicScore.master}).catch(()=>{});}
function syncAudio(){const settings=audioSettings();cosmicScore.setVolume(settings.volume*(narrating?.025:.12));const on=settings.ambience&&audioUnlocked()&&!document.hidden;if(on){if(!cosmicScore.playing)ambient(true);else cosmicScore.resume();}else ambient(false);q('#intro-sound').setAttribute('aria-pressed',String(settings.objects||settings.ambience));q('#intro-sound').textContent=settings.objects||settings.ambience?'♫ Sound on':'♫ Sound off';}
q('#intro-sound').onclick=()=>{const settings=audioSettings(),on=!(settings.objects||settings.ambience);setAudioSettings({objects:on,ambience:on});};
document.addEventListener('portfolio-audio-setting',syncAudio);document.addEventListener('portfolio-audio-unlocked',syncAudio);document.addEventListener('portfolio-narration-active',e=>{narrating=e.detail===true;syncAudio();});syncAudio();
function flightSound(){
 if(!ambientContext||!ambientGain)return;cancelFlightSound();
 const ctx=ambientContext,t=ctx.currentTime,g=ctx.createGain(),low=ctx.createOscillator(),overtone=ctx.createOscillator();let stopped=false;
 low.type='sine';overtone.type='sine';low.frequency.setValueAtTime(36,t);low.frequency.exponentialRampToValueAtTime(54,t+4.3);low.frequency.exponentialRampToValueAtTime(27,t+5.1);
 overtone.frequency.setValueAtTime(72,t);overtone.frequency.exponentialRampToValueAtTime(104,t+4.3);overtone.frequency.exponentialRampToValueAtTime(40,t+5.1);
 const overtoneGain=ctx.createGain();overtoneGain.gain.value=.16;low.connect(g);overtone.connect(overtoneGain);overtoneGain.connect(g);g.connect(ambientGain);
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.024,t+1.6);g.gain.exponentialRampToValueAtTime(.11,t+4.4);g.gain.exponentialRampToValueAtTime(.0001,t+5.15);
 low.start();overtone.start();low.stop(t+5.3);overtone.stop(t+5.3);
 cancelFlightSound=()=>{if(stopped)return;stopped=true;const now=ctx.currentTime;g.gain.cancelScheduledValues(now);g.gain.setTargetAtTime(.0001,now,.02);for(const o of [low,overtone])try{o.stop(now+.12)}catch{}};
 low.onended=()=>{low.disconnect();g.disconnect()};overtone.onended=()=>{overtone.disconnect();overtoneGain.disconnect()};
}
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelFlightSound();cosmicScore.suspend()}else syncAudio()});

document.addEventListener('universe-leaving',()=>{ambientOn=false;cosmicScore.fadeOut(.45);if('speechSynthesis'in window)speechSynthesis.cancel()});

let welcomeTimer;function showWelcome(){const w=document.querySelector('#universe-welcome');if(!w)return;clearTimeout(welcomeTimer);w.hidden=false;w.classList.add('visible');welcomeTimer=setTimeout(()=>{w.classList.remove('visible');setTimeout(()=>w.hidden=true,600)},5200)}
document.querySelector('#welcome-dismiss').onclick=()=>{clearTimeout(welcomeTimer);document.querySelector('#universe-welcome').hidden=true};
