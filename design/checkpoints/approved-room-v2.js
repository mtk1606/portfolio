import * as T from '/workspace/sites/khoudimi-universe/public/vendor/three.module.js';
const canvas=document.querySelector('canvas'),hint=document.querySelector('#hint'),back=document.querySelector('#back'),panel=document.querySelector('#panel');
let renderer;try{renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'low-power'})}catch(e){hint.textContent='This 3D sketch needs WebGL. Please open it in a desktop browser.';throw e}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
const scene=new T.Scene();scene.background=new T.Color('#100a1b');scene.fog=new T.Fog('#120e24',35,115);
const camera=new T.PerspectiveCamera(48,innerWidth/innerHeight,.1,160);const home=new T.Vector3(9,6.4,15),homeLook=new T.Vector3(0,3,-3);if(innerWidth<650){home.set(12,9,23);camera.fov=55;camera.updateProjectionMatrix()}camera.position.copy(home);const dest=home.clone(),look=homeLook.clone(),lookDest=look.clone();
const mat=(color,roughness=.8,metalness=0)=>new T.MeshStandardMaterial({color,roughness,metalness});
const ink=mat('#10141f'),wood=mat('#241822'),brass=mat('#916c3c',.35,.65),stone=mat('#29303e'),ivory=mat('#c4b18a'),black=mat('#141a28');const emissive=(color,intensity=1)=>new T.MeshStandardMaterial({color,emissive:color,emissiveIntensity:intensity});
const unitBox=new T.BoxGeometry(1,1,1);function box(w,h,d,x,y,z,m,parent=scene){const o=new T.Mesh(unitBox,m);o.scale.set(w,h,d);o.position.set(x,y,z);o.receiveShadow=true;o.castShadow=z>-10;parent.add(o);return o}
function cyl(r1,r2,h,x,y,z,m,parent=scene,n=20){const o=new T.Mesh(new T.CylinderGeometry(r1,r2,h,n),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
scene.add(new T.HemisphereLight('#717aad','#141019',.7));const warm=new T.PointLight('#ffb458',65,18,2);warm.position.set(-5,5,2);scene.add(warm);const moonlight=new T.DirectionalLight('#7c8cff',2.8);moonlight.position.set(-8,14,-15);scene.add(moonlight);moonlight.castShadow=true;moonlight.shadow.mapSize.set(2048,2048);Object.assign(moonlight.shadow.camera,{left:-17,right:17,top:18,bottom:-14,near:.5,far:65});moonlight.shadow.bias=-.0003;moonlight.shadow.normalBias=.03;moonlight.target.position.set(0,0,2);scene.add(moonlight.target);
const lampLight=new T.SpotLight('#ffbd73',35,12,Math.PI/3,.6,1.5);lampLight.position.set(-5.5,4.03,-.6);lampLight.target.position.set(-4.6,2.4,.6);scene.add(lampLight,lampLight.target);const fill=new T.PointLight('#d95936',30,16);fill.position.set(8,4,-3);scene.add(fill);
// Art Deco room: open camera side, a tall mullioned window, an inlaid floor.
box(25,.3,23,0,-.2,1,ink);for(let i=-5;i<=5;i++){box(.025,.013,23,i*2,.005,1,brass);box(25,.013,.025,0,.006,i*2+1,brass)}
box(2.8,13,.7,-10,6.3,-8,wood);box(2.8,13,.7,10,6.3,-8,wood);box(23,1.4,.8,0,12,-8,wood);box(23,1,.9,0,.5,-8,wood);
for(const x of [-8.5,-4.25,0,4.25,8.5]){box(.2,11.3,.24,x,6.4,-7.7,brass);box(.08,11.3,.32,x+.14,6.4,-7.6,ink)}
for(const y of [1.2,10.9])box(17.3,.12,.3,0,y,-7.6,brass);
for(const side of [-1,1])for(let k=0;k<4;k++){box(.12,11-k*.6,.15,side*(9.2+k*.3),5.9,-7.5,brass)}
// Distant stylized city built from stepped solids and sparse glowing windows.
let seed=78;function random(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
const cityStart=scene.children.length;const cityMats=[mat('#101525'),mat('#211626')];
const windows=[emissive('#be9563',.8),emissive('#858bc0',.6)];
for(let i=0;i<48;i++){const x=(i%16-7.5)*3.4+(random()-.5),z=-20-Math.floor(i/16)*15,h=4+random()*20,w=1.5+random()*1.7;const bmat=cityMats[i%2];box(w,h,3,x,h/2-2,z,bmat);box(w*.65,h*.22,2.2,x,h-2+h*.11,z,bmat);if(i%3===0){box(w*.36,h*.13,1.2,x,h*1.22-2+h*.065,z,bmat);box(.06,2, .06,x,h*1.35-1,z,brass)}for(let row=0;row<Math.floor(h*1.1);row++)for(let col=0;col<3;col++)if(random()>.57)box(.12,.28,.03,x+(col-1)*w*.25,row*.85-1,z+1.52,windows[i%2])}
// Instance repeated architecture and windows to reduce draw calls.
const cityMeshes=scene.children.slice(cityStart),batches=new Map();for(const o of cityMeshes){if(!o.isMesh)continue;const key=o.material.uuid;if(!batches.has(key))batches.set(key,[]);batches.get(key).push(o)}for(const list of batches.values()){const batch=new T.InstancedMesh(unitBox,list[0].material,list.length);list.forEach((o,i)=>{o.updateMatrix();batch.setMatrixAt(i,o.matrix);scene.remove(o)});scene.add(batch)}
const moon=new T.Mesh(new T.SphereGeometry(5.2,48,32),new T.MeshBasicMaterial({color:'#e7ccab'}));moon.position.set(-11,17,-60);scene.add(moon);
// Horizontal cut-paper clouds, kept sparse and graphic.
const clouds=[];
for(let i=0;i<5;i++){const c=box(20+i*3,.15+i*.12,.4,-16+i*6,15+i*2,-54+i,mat('#291827'));c.userData.origin=c.position.x;clouds.push(c)}
// Desk, integrated computer, keyboard and lamp.
const computer=new T.Group();scene.add(computer);computer.position.set(-3,0,0);box(7,.3,3,0,2.25,0,wood,computer);box(7.1,.07,3.1,0,2.45,0,brass,computer);for(const x of [-2.8,2.8]){box(.3,2.2,2.4,x,1.1,0,ink,computer);box(.08,2.2,.1,x+.17,1.1,1.2,brass,computer)}
box(2.65,2.1,1.35,0,3.65,-.3,stone,computer);box(2.45,1.88,.15,0,3.65,.44,ink,computer);box(2.08,1.44,.04,0,3.72,.53,emissive('#426c65',.5),computer);box(.8,.15,.8,0,2.57,-.3,stone,computer);
const screenCanvas=document.createElement('canvas');screenCanvas.width=640;screenCanvas.height=440;const ctx=screenCanvas.getContext('2d');const tex=new T.CanvasTexture(screenCanvas);tex.colorSpace=T.SRGBColorSpace;const screen=new T.Mesh(new T.PlaneGeometry(2.03,1.39),new T.MeshBasicMaterial({map:tex}));screen.position.set(0,3.72,.56);computer.add(screen);
function screenDraw(t){ctx.fillStyle='#061c1b';ctx.fillRect(0,0,640,440);ctx.fillStyle='#9cc0a0';ctx.font='20px monospace';ctx.fillText('M K   /   A F T E R   H O U R S',45,65);ctx.fillStyle='#527b68';ctx.fillRect(45,88,550,2);ctx.fillStyle='#d6c798';ctx.font='30px monospace';ctx.fillText('01  ORBITAL DRIFT',50,166);ctx.fillText('02  NIGHT CIRCUIT',50,225);ctx.fillStyle='#82a88a';ctx.font='17px monospace';ctx.fillText('A LITTLE ROOM TO PLAY.',50,320);if(Math.floor(t)%2===0)ctx.fillRect(50,358,11,19);for(let y=0;y<440;y+=4){ctx.fillStyle='#00000025';ctx.fillRect(0,y,640,1)}tex.needsUpdate=true}screenDraw(0);
box(2.8,.15,.85,0,2.59,1,stone,computer);for(let row=0;row<4;row++)for(let col=0;col<12;col++)box(.17,.035,.12,-1.16+col*.21,2.68,.73+row*.16,ivory,computer);
cyl(.4,.5,.09,-2.5,2.6,-.6,brass,computer);cyl(.035,.035,1.6,-2.5,3.4,-.6,brass,computer);cyl(.48,.7,.45,-2.5,4.3,-.6,ink,computer);cyl(.44,.44,.04,-2.5,4.08,-.6,emissive('#ffd398',1.5),computer);
// Small notebook, laid on the desk.
box(.9,.09,1.2,2.3,2.6,.3,ivory,computer);box(.025,.1,1.2,1.87,2.61,.3,brass,computer);
// Chess table: physical pieces, no floating board.
const chess=new T.Group();chess.position.set(4,0,2);chess.rotation.y=-.2;scene.add(chess);cyl(1.9,1.9,.18,0,2.03,0,wood,chess,48);cyl(.18,.28,1.7,0,1.1,0,brass,chess);cyl(.9,1.2,.17,0,.18,0,ink,chess);
box(2.75,.09,2.75,0,2.17,0,brass,chess);for(let x=0;x<8;x++)for(let z=0;z<8;z++)box(.32,.025,.32,(x-3.5)*.32,2.23,(z-3.5)*.32,(x+z)%2?ink:ivory,chess);
function piece(x,z,m,type){const px=(x-3.5)*.32,pz=(z-3.5)*.32;const points=[new T.Vector2(.11,0),new T.Vector2(.11,.04),new T.Vector2(.07,.07),new T.Vector2(.04,.19),new T.Vector2(.09,.23),new T.Vector2(.065,.28),new T.Vector2(.02,type===1?.4:.32)];const o=new T.Mesh(new T.LatheGeometry(points,12),m);o.position.set(px,2.25,pz);chess.add(o);if(type===1){box(.025,.13,.025,px,2.68,pz,m,chess);box(.09,.025,.025,px,2.71,pz,m,chess)}}
for(const [x,z,m,t] of [[4,7,ivory,1],[3,5,ivory,0],[5,6,ivory,0],[2,4,ivory,0],[4,0,brass,1],[1,2,brass,0],[5,1,brass,0],[7,2,brass,0]])piece(x,z,m,t);
// A dark lounge chair grounds the right edge of the room.
const chair=new T.Group();chair.position.set(7,0,5);chair.rotation.y=-.5;scene.add(chair);box(2, .55,2,0,1,0,wood,chair);box(2,2.1,.45,0,1.8,1,wood,chair);for(const x of [-1,1])box(.35,.9,2.3,x,1.4,0,ink,chair);for(const x of [-.8,.8])for(const z of [-.7,.7])box(.08,.8,.08,x,.4,z,brass,chair);
// Tailored furnishings: wool rug, layered drawer fronts, hardware, and a low bookcase.
const rug=mat('#39202a',1);box(13,.025,9,0,.035,2,rug);
for(const inset of [0,.14,.42]){const w=12.6-inset*2,d=8.6-inset*2;box(w,.015,.025,0,.056,2-d/2,brass);box(w,.015,.025,0,.056,2+d/2,brass);box(.025,.015,d,-w/2,.056,2,brass);box(.025,.015,d,w/2,.056,2,brass)}
for(let i=0;i<3;i++){box(1.3,.48,.12,-2.55,1.7-i*.52,1.28,wood,computer);box(.4,.045,.09,-2.55,1.7-i*.52,1.38,brass,computer)}
// CRT ventilation, drive slot, power switch, and cable.
for(let i=0;i<10;i++)box(.023,.3,.02,.7+i*.05,3.02,.535,black,computer);
box(.6,.06,.03,-.65,2.98,.54,black,computer);cyl(.045,.045,.02,1.06,3.02,.58,emissive('#c99b47'),computer).rotation.x=Math.PI/2;
const cableCurve=new T.CatmullRomCurve3([new T.Vector3(-1.8,2.7,-.7),new T.Vector3(-1.7,2.5,-1.1),new T.Vector3(-.7,2.5,-1.35),new T.Vector3(0,2.8,-1)]);computer.add(new T.Mesh(new T.TubeGeometry(cableCurve,20,.025,6,false),black));
const pen=box(.035,.035,.65,2.3,2.68,.3,brass,computer);pen.rotation.y=.3;
// A coffee cup with an actual curved handle.
cyl(.16,.12,.25,1.65,2.7,1,ivory,computer);cyl(.133,.133,.007,1.65,2.829,1,mat('#302219'),computer);const handle=new T.Mesh(new T.TorusGeometry(.10,.028,8,18),ivory);handle.position.set(1.82,2.72,1);computer.add(handle);
const shelf=new T.Group();shelf.position.set(-8,0,-4);scene.add(shelf);box(3.3,2.8,.7,0,1.4,0,wood,shelf);for(const y of [.1,1.3,2.7])box(3.5,.1,1,0,y,.2,brass,shelf);const covers=[mat('#6a3430'),mat('#344650'),mat('#665139'),mat('#938773')];for(let i=0;i<13;i++){const h=.7+random()*.4;box(.14,.0+h,.65,-1.35+i*.21,1.4+h/2,.33,covers[i%4],shelf);box(.15,.018,.015,-1.35+i*.21,1.6,.665,brass,shelf)}
// A fan-shaped Deco ornament crowns the window.
for(let i=-7;i<=7;i++){const o=box(.035,1.3,.06,0,11.15,-7.4,brass);o.rotation.z=i*.16;o.position.x=Math.sin(i*.16)*.6;o.position.y+=Math.cos(i*.16)*.6}
// Tiny motes only in the desk light; no starfield inside the room.
const dustPositions=new Float32Array(150);for(let i=0;i<50;i++){dustPositions[i*3]=-7+random()*5;dustPositions[i*3+1]=1+random()*5;dustPositions[i*3+2]=-2+random()*5}const dustGeo=new T.BufferGeometry();dustGeo.setAttribute('position',new T.BufferAttribute(dustPositions,3));const dust=new T.Points(dustGeo,new T.PointsMaterial({color:'#d7b07c',size:.014,transparent:true,opacity:.35,depthWrite:false}));scene.add(dust);
// Pick only purposeful objects; camera movement is true perspective.
const pickables=[];function hotspot(w,h,d,x,y,z,name){const o=box(w,h,d,x,y,z,new T.MeshBasicMaterial({visible:false}));o.userData.name=name;pickables.push(o)}hotspot(3,2.6,2,-3,3.6,0,'computer');hotspot(3,1.2,3,4,2.4,2,'chess');
let mode='room',pointer=new T.Vector2(),ray=new T.Raycaster(),hover='',lastScreen=0;let reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const motionButton=document.querySelector('#motion');motionButton.setAttribute('aria-pressed',String(reduced));motionButton.onclick=()=>{reduced=!reduced;motionButton.setAttribute('aria-pressed',String(reduced));motionButton.textContent=reduced?'MOTION OFF':'MOTION ON'};
function enter(name){mode=name;document.querySelectorAll('[data-go]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.go===name)));back.hidden=name==='room';panel.hidden=name==='room';if(name==='computer'){dest.set(-3,4,innerWidth<650?8:5);lookDest.set(-3,3.55,.1);panel.innerHTML='<b>THE COMPUTER</b><p>Games would open directly on this screen.</p><small>Interaction sketch · game integration comes after the room is approved.</small>'}else if(name==='chess'){dest.set(5,innerWidth<650?7.8:5.5,innerWidth<650?8:6.1);lookDest.set(4,2.3,2);panel.innerHTML='<b>ONE GOOD MOVE</b><p>The tabletop becomes the puzzle.</p><small>Composition study · pieces are illustrative.</small>'}else{dest.copy(home);lookDest.copy(homeLook)}if(reduced){camera.position.copy(dest);look.copy(lookDest)}}
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>enter(b.dataset.go));back.onclick=()=>enter('room');addEventListener('keydown',e=>{if(e.key==='Escape')enter('room')});
function pick(e){pointer.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);ray.setFromCamera(pointer,camera);return ray.intersectObjects(pickables)[0]?.object.userData.name||''}
canvas.addEventListener('pointermove',e=>{hover=pick(e);canvas.style.cursor=hover?'pointer':'default';hint.textContent=hover==='computer'?'ENTER THE COMPUTER ↗':hover==='chess'?'TAKE A SEAT ↗':'Explore the objects. Escape brings you back.'});canvas.addEventListener('pointerup',e=>{const hit=pick(e);if(hit)enter(hit)});
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
let last=0;function frame(now){requestAnimationFrame(frame);if(document.hidden||now-last<32)return;const dt=Math.min((now-last)/1000,.1);last=now;const ease=reduced?1:1-Math.exp(-4*dt);camera.position.lerp(dest,ease);look.lerp(lookDest,ease);camera.lookAt(look);if(!reduced){clouds.forEach((c,i)=>c.position.x=c.userData.origin+Math.sin(now*.00003+i)*1.3);dust.rotation.y=Math.sin(now*.0001)*.03;}if(now-lastScreen>700){screenDraw(now/1000);lastScreen=now}renderer.render(scene,camera);renderer.shadowMap.autoUpdate=false}requestAnimationFrame(frame);
