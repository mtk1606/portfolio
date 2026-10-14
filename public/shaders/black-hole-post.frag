precision highp float;
varying vec2 vUv;
uniform sampler2D uScene;
uniform vec2 uTexel;
uniform float uFade;
uniform float uFlash;
uniform float uStorageScale;
vec3 sampleBright(vec2 uv){vec3 c=pow(texture2D(uScene,uv).rgb,vec3(2.))/uStorageScale;return max(c-.65,0.);}
void main(){vec3 c=pow(texture2D(uScene,vUv).rgb,vec3(2.))/uStorageScale;vec3 glow=vec3(0.);for(int i=0;i<8;i++){float a=float(i)*.785398;vec2 v=vec2(cos(a),sin(a));glow+=sampleBright(vUv+v*uTexel*3.)*.035;glow+=sampleBright(vUv+v*uTexel*10.)*.024;glow+=sampleBright(vUv+v*uTexel*23.)*.015;}c+=glow; c=(c*(2.51*c+.03))/(c*(2.43*c+.59)+.14);c=pow(clamp(c,0.,1.),vec3(1./2.2));c*=1.-.23*pow(length(vUv-.5),1.5);gl_FragColor=vec4(mix(c*(1.-uFade),vec3(.965,.95,.90),uFlash),1.);}
