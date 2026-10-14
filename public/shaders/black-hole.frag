// Ray bending and disk-intersection approach adapted from GodlyDonuts/ThreeJSBlackHoleSimulation.
// Copyright (c) 2025 Saicharan Ramineni, MIT; see vendor/black-hole-LICENSE.txt.
// Revised midpoint integration, procedural gas filaments, sky, camera and quality controls.
precision highp float;
varying vec2 vUv;
uniform vec2 uResolution;
uniform vec3 uCamera;
uniform mat3 uBasis;
uniform float uTime;
uniform float uFov;
uniform int uSteps;
uniform float uStepScale;
uniform float uCollapse;
uniform float uStorageScale;
const float PI=3.14159265359;
float hash(float n){return fract(sin(n)*43758.5453);}
float noise(vec3 x){vec3 p=floor(x),f=fract(x);f=f*f*(3.-2.*f);float n=p.x+p.y*157.+p.z*113.;return mix(mix(mix(hash(n),hash(n+1.),f.x),mix(hash(n+157.),hash(n+158.),f.x),f.y),mix(mix(hash(n+113.),hash(n+114.),f.x),mix(hash(n+270.),hash(n+271.),f.x),f.y),f.z);}
float fbm(vec3 p){float f=.5*noise(p);p=p*2.02;f+=.25*noise(p);p=p*2.03;f+=.125*noise(p);p=p*2.01;f+=.0625*noise(p);return f;}
vec3 sky(vec3 rd){
 vec2 uv=vec2(atan(rd.z,rd.x)/6.283185+.5,asin(clamp(rd.y,-1.,1.))/PI+.5);
 vec3 color=vec3(0.);
 for(int i=0;i<3;i++){float scale=180.+float(i)*170.;vec2 cell=floor(uv*scale),f=fract(uv*scale);float h=hash(cell.x+cell.y*713.+float(i)*389.);vec2 pos=vec2(hash(h*417.),hash(h*937.))*.7+.15;float d=length(f-pos);float star=exp(-d*d*900.)*step(.975,h)*(1.+float(i)*.2);color+=star*mix(vec3(.5,.7,1.),vec3(1.,.8,.5),hash(h*74.));}
 float band=exp(-pow(dot(rd,normalize(vec3(.3,1.,.2)))*4.,2.));float neb=fbm(rd*4.+3.);color+=vec3(.016,.023,.038)*band*pow(neb,3.);return color;
}
// Gas turbulence/temperature treatment adapted from the user-supplied WebGPU/TSL source.
float gasFbm(vec3 p){float value=0.,amplitude=.5;for(int i=0;i<4;i++){value+=noise(p)*amplitude;p*=2.5;amplitude*=.8;}return value;}
vec3 blackbody(float kelvin){float t=clamp((kelvin-1000.)/9000.,0.,1.);return vec3(clamp(1.-(t-.8)*2.,.5,1.),smoothstep(0.,.5,t)*(1.-max((t-.7)*.3,0.)),smoothstep(.3,1.,t)*t);}
vec4 disk(vec3 p,vec3 dir){
 float r=length(p.xz);const float inner=2.85;const float outer=10.;if(r<inner||r>outer)return vec4(0.);
 float angle=atan(p.z,p.x),normR=(r-inner)/(outer-inner);
 float cycle=mod(uTime,5.),blend=cycle/5.;float phase1=angle-cycle*8.7/pow(r,1.5),phase2=angle-(cycle+5.)*8.7/pow(r,1.5);
 vec3 coord1=vec3(r*1.81,cos(phase1)/.75,sin(phase1)/.75),coord2=vec3(r*1.81,cos(phase2)/.75,sin(phase2)/.75);
 float turbulence=mix(gasFbm(coord2),gasFbm(coord1),blend);
 float threads=pow(clamp(turbulence,0.,1.),7.4);
 float edge=smoothstep(0.,.12,normR)*(1.-smoothstep(.5,1.,normR));
 float temperature=mix(1500.,26000.,pow(inner/r,5.22));vec3 color=blackbody(temperature);color=mix(color,vec3(1.,.84,.65)*max(max(color.r,color.g),color.b),.72);
 float beta=.3/sqrt(r/inner);vec3 tangent=normalize(vec3(p.z,0.,-p.x));float doppler=1./(1.-beta*dot(tangent,dir));
 float opacity=threads*edge;float emiss=5.*pow(doppler,3.)*opacity;
 return vec4(color*emiss,opacity);
}
vec3 acceleration(vec3 p,float h2){float r2=dot(p,p);return -1.5*h2*p/(r2*r2*sqrt(r2));}
void main(){
 vec2 xy=vUv*2.-1.;xy.x*=uResolution.x/uResolution.y;
 vec3 rd=normalize(uBasis*vec3(xy*tan(uFov*.5),1.));vec3 p=uCamera,v=rd;
 float h2=dot(cross(p,v),cross(p,v));vec3 col=vec3(0.);float trans=1.;bool captured=false;bool escaped=false;
 for(int i=0;i<uSteps;i++){
  float r=length(p);if(r<1.001){captured=true;break;}if(r>65.&&dot(p,v)>0.){escaped=true;break;}
  float stepSize=clamp(r*.085,.025,2.)*uStepScale;
  // Midpoint integration keeps strong deflections smoother than a fixed Euler step.
  vec3 acc=acceleration(p,h2);vec3 vm=v+acc*stepSize*.5;vec3 pm=p+v*stepSize*.5;
  vec3 nextV=v+acceleration(pm,h2)*stepSize;vec3 nextP=p+vm*stepSize;
  if(p.y*nextP.y<=0.){
   float f=clamp(p.y/(p.y-nextP.y),0.,1.);vec3 hit=mix(p,nextP,f);vec4 gas=disk(hit,normalize(vm));
   col+=gas.rgb*trans;trans*=1.-gas.a;if(trans<.035)break;
  }
  p=nextP;v=nextV;
 }
 if(!captured)col+=sky(normalize(v))*trans;
 // Crossing the horizon resolves directly into a point of light. No star travel.
 float core=exp(-dot(xy,xy)/mix(.008,.00015,uCollapse));
 float halo=exp(-length(xy)*18.)*.16;
 col=mix(col,vec3(1.,.97,.9)*(core*5.+halo),uCollapse);
 gl_FragColor=vec4(sqrt(max(col*uStorageScale,vec3(0.))),1.);
}
