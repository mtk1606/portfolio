import * as T from './vendor/three.module.js';
// No image textures: each pixel follows a bent ray through the procedural scene.
export async function createBlackHole(host,{onReady=()=>{},onError=()=>{},onArrival=()=>{},reduced=()=>false}={}){
 const [frag,post]=await Promise.all(['black-hole.frag','black-hole-post.frag'].map(async n=>{const r=await fetch('shaders/'+n);if(!r.ok)throw Error('Shader download failed');return r.text()}));
 const renderer=new T.WebGLRenderer({antialias:false,alpha:false,powerPreference:'default'});renderer.setPixelRatio(1);renderer.autoClear=true;host.classList.remove('gravity-visible');host.replaceChildren(renderer.domElement);
 const vert='varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';
 const geometry=new T.PlaneGeometry(2,2),camera=new T.Camera(),scene=new T.Scene(),outScene=new T.Scene();
 const uniforms={uResolution:{value:new T.Vector2()},uCamera:{value:new T.Vector3(0,2.7,17)},uBasis:{value:new T.Matrix3()},uTime:{value:0},uFov:{value:.79},uSteps:{value:230},uStepScale:{value:.8},uCollapse:{value:0},uStorageScale:{value:.125}};
 const material=new T.ShaderMaterial({vertexShader:vert,fragmentShader:frag,uniforms,depthTest:false,depthWrite:false});const mesh=new T.Mesh(geometry,material);mesh.frustumCulled=false;scene.add(mesh);
 // Prefer half-float color; square-root encoding also preserves dark gradients in the byte fallback.
 const rt=new T.WebGLRenderTarget(1,1,{type:renderer.extensions.has('EXT_color_buffer_float')?T.HalfFloatType:T.UnsignedByteType,depthBuffer:false,stencilBuffer:false});
 const pp={uScene:{value:rt.texture},uTexel:{value:new T.Vector2()},uFade:{value:1},uFlash:{value:0},uStorageScale:{value:.125}};
 const pm=new T.ShaderMaterial({vertexShader:vert,fragmentShader:post,uniforms:pp,depthTest:false,depthWrite:false});const screen=new T.Mesh(geometry,pm);screen.frustumCulled=false;outScene.add(screen);
 const tiers=[{scale:.5,steps:150,step:1.25},{scale:.72,steps:210,step:1},{scale:1,steps:280,step:.75}];let tier=1,mode='auto',running=false,raf=0,last=0,paint=0,clock=0,flight=-1,dragging=false,dragX=0,dragY=0,yaw=0,pitch=.157,avg=33,count=0,cooldown=0,ready=false,failed=false,arrived=false,warmFrames=0,revealTime=0,targetYaw=0,targetPitch=.157;
 const position=new T.Vector3(),forward=new T.Vector3(),right=new T.Vector3(),up=new T.Vector3(),UP=new T.Vector3(0,1,0);let cssW=1,cssH=1;
 function resize(){cssW=host.clientWidth||innerWidth;cssH=host.clientHeight||innerHeight;const maxScale=Math.min(devicePixelRatio||1,1.4,Math.sqrt(1500000/(cssW*cssH)));renderer.setSize(cssW,cssH,false);renderer.domElement.style.width='100%';renderer.domElement.style.height='100%';const w=Math.max(1,Math.round(cssW*maxScale*tiers[tier].scale)),h=Math.max(1,Math.round(cssH*maxScale*tiers[tier].scale));rt.setSize(w,h);uniforms.uResolution.value.set(w,h);pp.uTexel.value.set(1/w,1/h);uniforms.uSteps.value=tiers[tier].steps;uniforms.uStepScale.value=tiers[tier].step;}
 const clamp=(x,a,b)=>Math.min(b,Math.max(a,x)),smooth=(a,b,x)=>{x=clamp((x-a)/(b-a),0,1);return x*x*(3-2*x)};
 function draw(now){if(!running||failed)return;raf=requestAnimationFrame(draw);if(document.hidden){last=now;paint=now;return}const elapsed=(now-(last||now))/1000,dt=Math.min(elapsed,.06);last=now;if(!reduced())clock+=dt;if(warmFrames>=2)revealTime+=dt;const dragEase=reduced()?1:1-Math.exp(-9*dt);yaw+=(targetYaw-yaw)*dragEase;pitch+=(targetPitch-pitch)*dragEase;if(flight>=0)flight+=elapsed;
  const targetInterval=flight>=0?16:32;if(now-paint<targetInterval)return;const frameTime=now-(paint||now);paint=now;
  if(mode==='auto'&&flight<0&&frameTime>0){avg=avg*.95+frameTime*.05;count++;if(now>cooldown&&count>50){if(avg>48&&tier>0){tier--;resize();cooldown=now+6000;count=0;avg=33}else if(avg<36&&tier<2){tier++;resize();cooldown=now+10000;count=0}}}
  const t=Math.max(0,flight),fall=smooth(0,4.5,t);const radius=17.21*(1-fall)+.72*fall;const theta=yaw+(reduced()?0:Math.sin(clock*.08)*.025)+fall*.20;const phi=pitch*(1-fall)+.035*fall;
  position.set(Math.sin(theta)*Math.cos(phi)*radius,Math.sin(phi)*radius,Math.cos(theta)*Math.cos(phi)*radius);forward.copy(position).multiplyScalar(-1).normalize();right.crossVectors(forward,UP).normalize();up.crossVectors(right,forward).normalize();
  uniforms.uBasis.value.set(right.x,up.x,forward.x,right.y,up.y,forward.y,right.z,up.z,forward.z);uniforms.uCamera.value.copy(position);uniforms.uTime.value=clock;uniforms.uFov.value=.79+fall*.22;uniforms.uCollapse.value=smooth(4.25,4.95,t);pp.uFade.value=reduced()?0:1-smooth(.1,1.7,revealTime);pp.uFlash.value=smooth(4.95,5.3,t);
  renderer.setRenderTarget(rt);renderer.render(scene,camera);renderer.setRenderTarget(null);renderer.render(outScene,camera);
  if(failed)return;warmFrames++;if(warmFrames>=2)host.classList.add('gravity-visible');if(t>=5.3&&!arrived){arrived=true;onArrival()}if(!ready&&warmFrames>=2&&(reduced()||revealTime>=1.7)){ready=true;onReady()}
 }
 renderer.debug.onShaderError=(gl,program,vs,fs)=>{failed=true;onError(Error(gl.getShaderInfoLog(fs)||'Shader compilation failed'))};
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();failed=true;stop();onError(Error('Graphics context was lost'))});
 function start(){if(running||failed)return;running=true;last=0;paint=0;raf=requestAnimationFrame(draw)}function stop(){running=false;cancelAnimationFrame(raf)}
 function reset(){flight=-1;arrived=false;pp.uFlash.value=0;uniforms.uCollapse.value=0;pp.uFade.value=1;yaw=targetYaw=0;pitch=targetPitch=.157;ready=false;warmFrames=0;revealTime=0;host.classList.remove('gravity-visible');start()}
 function plunge(){if(flight<0){flight=0;start()}}
 function quality(v){mode=v;tier=v==='high'?2:v==='eco'?0:1;count=0;avg=33;cooldown=performance.now()+5000;resize()}
 const canvas=renderer.domElement;canvas.style.touchAction='none';canvas.addEventListener('pointerdown',e=>{if(flight>=0)return;dragging=true;dragX=e.clientX;dragY=e.clientY;canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!dragging||flight>=0)return;targetYaw+=(e.clientX-dragX)*.003;targetPitch=clamp(targetPitch+(e.clientY-dragY)*.002,-.55,.65);if(Math.abs(targetPitch)<.035)targetPitch=.035;dragX=e.clientX;dragY=e.clientY});canvas.addEventListener('pointerup',()=>dragging=false);canvas.addEventListener('pointercancel',()=>dragging=false);canvas.addEventListener('lostpointercapture',()=>dragging=false);
 const observer=new ResizeObserver(resize);observer.observe(host);resize();start();
 return {start,stop,reset,plunge,quality,dispose(){stop();observer.disconnect();geometry.dispose();material.dispose();pm.dispose();rt.dispose();renderer.dispose()}};
}
