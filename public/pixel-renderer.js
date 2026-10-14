// Low-resolution 3D + ordered dithering + a fixed 24-color midnight palette.
// The DOM interface stays at native resolution. No image backdrop or video.
import * as T from './vendor/three.module.js';
export function pixelScale(width,height,quality='auto'){
 const target=quality==='light'?320:quality==='high'?800:560;
 return Math.min(1,target/Math.max(width,height));
}
export function createPixelRenderer(options){
 const r=new T.WebGLRenderer({...options,antialias:false});
 const render=r.render.bind(r),setSize=r.setSize.bind(r),setPixelRatio=r.setPixelRatio.bind(r);
 let width=innerWidth,height=innerHeight;
 const target=new T.WebGLRenderTarget(1,1,{minFilter:T.NearestFilter,magFilter:T.NearestFilter,depthBuffer:true});
 const colors=['08090b','11151b','1b222a','283540','3d4e5a','627483','94a2aa','c2c9c6','211d1a','322a22','49382a','624b34','806246','a3845c','c7ac7c','eee5cb','321e19','522b20','793e25','a25830','cd7945','e9a365','f3c792','fff2da'];
 const uniforms={scene:{value:target.texture},palette:{value:colors.map(hex=>new T.Vector3(parseInt(hex.slice(0,2),16)/255,parseInt(hex.slice(2,4),16)/255,parseInt(hex.slice(4),16)/255))}};
 const material=new T.ShaderMaterial({uniforms,depthTest:false,depthWrite:false,toneMapped:false,
 vertexShader:'varying vec2 uvScene;void main(){uvScene=uv;gl_Position=vec4(position.xy,0.,1.);}',
 fragmentShader:`precision highp float;varying vec2 uvScene;uniform sampler2D scene;uniform vec3 palette[24];
 float bayer(vec2 p){vec2 a=mod(floor(p),2.);vec2 b=mod(floor(p/2.),2.);float low=2.*a.x+3.*a.y-4.*a.x*a.y;float high=2.*b.x+3.*b.y-4.*b.x*b.y;return (4.*low+high+.5)/16.-.5;}
 void main(){vec3 c=texture2D(scene,uvScene).rgb*1.2;c=clamp((c*(2.51*c+.03))/(c*(2.43*c+.59)+.14),0.,1.);c=pow(c,vec3(1./2.2));c+=bayer(gl_FragCoord.xy)*.065;vec3 chosen=palette[0];float best=100.;for(int i=0;i<24;i++){vec3 d=c-palette[i];float score=dot(d*d,vec3(.3,.58,.12));if(score<best){best=score;chosen=palette[i];}}gl_FragColor=vec4(chosen,1.);}`});
 const post=new T.Scene();post.add(new T.Mesh(new T.PlaneGeometry(2,2),material));const camera=new T.Camera();
 const quality=()=>document.querySelector('#room-quality')?.value||'auto';
 let resizing=false;
 r.setPixelRatio=()=>{}; // Resolution is chosen from viewport and the preview's pixel setting.
 r.setSize=(w,h,style=true)=>{if(resizing){setSize(w,h,style);return}resizing=true;try{width=w;height=h;setPixelRatio(pixelScale(width,height,quality()));setSize(w,h,style);const size=r.getDrawingBufferSize(new T.Vector2());target.setSize(size.x,size.y)}finally{resizing=false}};
 r.render=(scene,camera3D)=>{const previous=r.getRenderTarget();r.setRenderTarget(target);render(scene,camera3D);r.setRenderTarget(previous);render(post,camera)};
 const dispose=r.dispose.bind(r);r.dispose=()=>{target.dispose();material.dispose();post.children[0].geometry.dispose();dispose()};
 return r;
}
