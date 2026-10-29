import * as T from './vendor/three.module.js';
// No image textures: each pixel follows a bent ray through the procedural scene.
export async function createBlackHole(host,{onReady=()=>{},onError=()=>{},onArrival=()=>{},reduced=()=>false}={}){
 const [frag,post]=await Promise.all(['black-hole.frag','black-hole-post.frag'].map(async n=>{const r=await fetch('shaders/'+n);if(!r.ok)throw Error('Shader download failed');return r.text()}));
 const renderer=new T.WebGLRenderer({antialias:false,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(1);renderer.autoClear=true;host.classList.remove('gravity-visible');host.replaceChildren(renderer.domElement);
 const vert='varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';
 const geometry=new T.PlaneGeometry(2,2),camera=new T.Camera(),scene=new T.Scene(),outScene=new T.Scene();
 const uniforms={uResolution:{value:new T.Vector2()},uCamera:{value:new T.Vector3(0,2.7,17)},uBasis:{value:new T.Matrix3()},uTime:{value:0},uFov:{value:.79},uSteps:{value:230},uStepScale:{value:.8},uCollapse:{value:0},uStorageScale:{value:.125},uLensPulse:{value:0}};
 const material=new T.ShaderMaterial({vertexShader:vert,fragmentShader:frag,uniforms,depthTest:false,depthWrite:false});const mesh=new T.Mesh(geometry,material);mesh.frustumCulled=false;scene.add(mesh);
 // Prefer half-float color; square-root encoding also preserves dark gradients in the byte fallback.
 const rt=new T.WebGLRenderTarget(1,1,{type:renderer.extensions.has('EXT_color_buffer_float')?T.HalfFloatType:T.UnsignedByteType,depthBuffer:false,stencilBuffer:false});
 const pp={uScene:{value:rt.texture},uTexel:{value:new T.Vector2()},uFade:{value:1},uFlash:{value:0},uStorageScale:{value:.125}};
 const pm=new T.ShaderMaterial({vertexShader:vert,fragmentShader:post,uniforms:pp,depthTest:false,depthWrite:false});const screen=new T.Mesh(geometry,pm);screen.frustumCulled=false;outScene.add(screen);
 const qualityProfile={steps:280,step:.75};let running=false,raf=0,last=0,paint=0,clock=0,flight=-1,dragging=false,dragX=0,dragY=0,yaw=0,pitch=.157,ready=false,failed=false,arrived=false,warmFrames=0,revealTime=0,targetYaw=0,targetPitch=.157,hoverX=0,hoverY=0,holding=false,pressure=0;
 const position=new T.Vector3(),forward=new T.Vector3(),right=new T.Vector3(),up=new T.Vector3(),UP=new T.Vector3(0,1,0);let cssW=1,cssH=1;
 function resize(){cssW=host.clientWidth||innerWidth;cssH=host.clientHeight||innerHeight;const maxScale=Math.min(devicePixelRatio||1,2);renderer.setSize(cssW,cssH,false);renderer.domElement.style.width='100%';renderer.domElement.style.height='100%';const w=Math.max(1,Math.round(cssW*maxScale)),h=Math.max(1,Math.round(cssH*maxScale));rt.setSize(w,h);uniforms.uResolution.value.set(w,h);pp.uTexel.value.set(1/w,1/h);uniforms.uSteps.value=qualityProfile.steps;uniforms.uStepScale.value=qualityProfile.step;}
 const clamp=(x,a,b)=>Math.min(b,Math.max(a,x)),smooth=(a,b,x)=>{x=clamp((x-a)/(b-a),0,1);return x*x*(3-2*x)};
 function draw(now){if(!running||failed)return;raf=requestAnimationFrame(draw);if(document.hidden){holding=dragging=false;hoverX=hoverY=0;last=now;paint=now;return}if(reduced()&&flight>=0&&!arrived){arrived=true;pp.uFade.value=1;pp.uFlash.value=0;onArrival();return;}const elapsed=(now-(last||now))/1000,dt=Math.min(elapsed,.06);last=now;if(!reduced())clock+=dt;if(warmFrames>=2)revealTime+=dt;const dragEase=reduced()?1:1-Math.exp(-9*dt);const interaction=reduced()||flight>=0?0:1;pressure+=((holding?interaction:0)-pressure)*(1-Math.exp(-3*dt));if(reduced()){pressure=0;holding=false;}uniforms.uLensPulse.value=pressure;const viewYaw=targetYaw+hoverX*.035*interaction,viewPitch=targetPitch+hoverY*.02*interaction;yaw+=(viewYaw-yaw)*dragEase;pitch+=(viewPitch-pitch)*dragEase;if(flight>=0)flight+=elapsed;
  const targetInterval=reduced()&&ready?200:flight>=0?24:32;if(now-paint<targetInterval)return;const frameTime=now-(paint||now);paint=now;
  const t=Math.max(0,flight),fall=smooth(0,5.3,t);const radius=17.21*Math.exp(Math.log(3.2/17.21)*fall);const theta=yaw+(reduced()?0:Math.sin(clock*.08)*.025)+fall*.045;const phi=pitch*(1-fall)+.09*fall;
  position.set(Math.sin(theta)*Math.cos(phi)*radius,Math.sin(phi)*radius,Math.cos(theta)*Math.cos(phi)*radius);forward.copy(position).multiplyScalar(-1).normalize();right.crossVectors(forward,UP).normalize();up.crossVectors(right,forward).normalize();
  uniforms.uBasis.value.set(right.x,up.x,forward.x,right.y,up.y,forward.y,right.z,up.z,forward.z);uniforms.uCamera.value.copy(position);uniforms.uTime.value=clock;uniforms.uFov.value=.79+fall*.10;uniforms.uCollapse.value=0;pp.uFade.value=reduced()?0:Math.max(1-smooth(.1,1.7,revealTime),smooth(3.9,5.3,t));pp.uFlash.value=0;
  renderer.setRenderTarget(rt);renderer.render(scene,camera);renderer.setRenderTarget(null);renderer.render(outScene,camera);
  if(failed)return;warmFrames++;if(warmFrames>=2)host.classList.add('gravity-visible');if(t>=5.3&&!arrived){arrived=true;onArrival()}if(!ready&&warmFrames>=2&&(reduced()||revealTime>=1.7)){ready=true;onReady()}
 }
 renderer.debug.onShaderError=(gl,program,vs,fs)=>{failed=true;onError(Error(gl.getShaderInfoLog(fs)||'Shader compilation failed'))};
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();failed=true;stop();onError(Error('Graphics context was lost'))});
 function start(){if(running||failed)return;running=true;last=0;paint=0;raf=requestAnimationFrame(draw)}function stop(){running=false;holding=false;dragging=false;cancelAnimationFrame(raf)}
 function reset(){flight=-1;arrived=false;pp.uFlash.value=0;uniforms.uCollapse.value=0;pp.uFade.value=1;yaw=targetYaw=0;pitch=targetPitch=.157;hoverX=hoverY=pressure=0;holding=dragging=false;uniforms.uLensPulse.value=0;ready=false;warmFrames=0;revealTime=0;host.classList.remove('gravity-visible');start()}
 function plunge(){if(flight<0){holding=dragging=false;hoverX=hoverY=0;flight=0;start()}}
 const canvas=renderer.domElement;canvas.style.touchAction='none';canvas.tabIndex=0;canvas.role='img';canvas.ariaLabel='Interactive black hole. Drag or use arrow keys to change the view. Press and hold or hold Space to gently bend starlight. Enter and Skip buttons are separate.';
 const canInteract=()=>flight<0&&!reduced()&&running;
 function release(){dragging=false;holding=false}
 canvas.addEventListener('pointerdown',e=>{if(!canInteract()||e.isPrimary===false||e.button>0)return;dragging=true;holding=true;dragX=e.clientX;dragY=e.clientY;hoverX=hoverY=0;canvas.setPointerCapture(e.pointerId)});
 canvas.addEventListener('pointermove',e=>{if(!canInteract())return;if(!dragging){if(e.pointerType==='mouse'){const rect=canvas.getBoundingClientRect();hoverX=clamp((e.clientX-rect.left)/rect.width*2-1,-1,1);hoverY=clamp((e.clientY-rect.top)/rect.height*2-1,-1,1);}return;}const dx=e.clientX-dragX,dy=e.clientY-dragY;if(Math.abs(dx)+Math.abs(dy)>2)holding=false;targetYaw=clamp(targetYaw+dx*.0015,-.30,.30);targetPitch=clamp(targetPitch+dy*.001,.065,.34);dragX=e.clientX;dragY=e.clientY;});
 for(const name of ['pointerup','pointercancel','lostpointercapture','blur'])canvas.addEventListener(name,release);
 canvas.addEventListener('pointerleave',()=>{hoverX=hoverY=0;if(!dragging)holding=false});
 canvas.addEventListener('keydown',e=>{if(!canInteract())return;if(e.code==='Space'){e.preventDefault();holding=true;}const delta={ArrowLeft:[-.025,0],ArrowRight:[.025,0],ArrowUp:[0,-.015],ArrowDown:[0,.015]}[e.key];if(delta){e.preventDefault();hoverX=hoverY=0;targetYaw=clamp(targetYaw+delta[0],-.30,.30);targetPitch=clamp(targetPitch+delta[1],.065,.34);}});
 canvas.addEventListener('keyup',e=>{if(e.code==='Space'){e.preventDefault();holding=false}});
 const observer=new ResizeObserver(resize);observer.observe(host);resize();start();
 return {start,stop,reset,plunge,dispose(){stop();observer.disconnect();geometry.dispose();material.dispose();pm.dispose();rt.dispose();renderer.dispose()}};
}
