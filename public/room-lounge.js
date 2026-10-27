// Hand-built furnishings and original television loops. No external media downloads.
export function buildLounge(T,scene,box,cyl,mat,brass){
 const leather=mat('#553d35',.88),walnut=mat('#38251f'),dark=mat('#11151b'),linen=mat('#a99b83'),coatMat=mat('#252832');
 function cushion(w,h,d,x,y,z,parent,m=leather){const shape=new T.Shape(),r=.12;shape.moveTo(-w/2+r,-h/2);shape.lineTo(w/2-r,-h/2);shape.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);shape.lineTo(w/2,h/2-r);shape.quadraticCurveTo(w/2,h/2,w/2-r,h/2);shape.lineTo(-w/2+r,h/2);shape.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);shape.lineTo(-w/2,-h/2+r);shape.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);const g=new T.ExtrudeGeometry(shape,{depth:d-.16,bevelEnabled:true,bevelThickness:.08,bevelSize:.06,bevelSegments:3,steps:1});g.translate(0,0,-(d-.16)/2);const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;parent.add(o);return o}
 // Paneled walls complete the view when visitors turn away from the skyline.
 box(.3,13,29,-12,6.35,6.5,walnut);box(.3,13,29,12,6.35,6.5,walnut);box(24,13,.3,0,6.35,21,walnut);box(24,.2,29,0,13,6.5,dark);
 for(const x of [-11.8,11.8]){for(const z of [-4,1,6,11,16]){box(.03,8.7,.035,x,5,z,brass);box(.03,.035,4.8,x,9.3,z+2.4,brass);box(.03,.035,4.8,x,.7,z+2.4,brass)}box(.035,.1,29,x,11.8,6.5,brass)}
 for(const x of [-8,-4,0,4,8]){box(.035,9,.03,x,5,20.8,brass);box(3.6,.035,.03,x+1.8,9.5,20.8,brass)}
 const sofa=new T.Group();sofa.position.set(-4.5,0,7);sofa.rotation.y=Math.PI;scene.add(sofa);box(6.6,.35,2.6,0,.65,0,walnut,sofa);for(const x of [-2.8,2.8])for(const z of [-.9,.9])cyl(.055,.07,.6,x,.3,z,brass,sofa);
 cushion(6.1,1.9,.55,0,1.6,-1.05,sofa);for(const x of [-2,0,2]){cushion(1.93,.48,2.1,x,1.02,.1,sofa);cushion(1.92,1.1,.35,x,1.76,-.64,sofa)}for(const x of [-3.15,3.15])cushion(.45,1.1,2.6,x,1.22,0,sofa);const pillow=cushion(.95,.85,.25,2.12,1.53,-.3,sofa,linen);pillow.rotation.z=-.22;
 // Folded cloth follows the back and falls across the seat.
 const cloth=new T.PlaneGeometry(1.7,2.8,18,28),a=cloth.attributes.position;for(let i=0;i<a.count;i++){const x=a.getX(i),v=(a.getY(i)+1.4)/2.8;a.setXYZ(i,x-1.35,1.13+Math.max(0,v-.48)*2.5+.06*Math.sin(x*17+v*8),1-v*2.15+.055*Math.sin(x*12))}cloth.computeVertexNormals();coatMat.side=T.DoubleSide;const coat=new T.Mesh(cloth,coatMat);coat.castShadow=true;sofa.add(coat);const sleeve=cushion(.39,.18,1.35,-.35,1.24,.24,sofa,coatMat);sleeve.rotation.y=.55;for(let i=0;i<3;i++)cyl(.025,.025,.02,-1.2,1.22,.25+i*.2,brass,sofa);
 const hat=new T.Group();hat.position.set(.4,1.34,.35);hat.rotation.set(.12,0,.12);sofa.add(hat);const brim=cyl(.53,.53,.055,0,0,0,dark,hat,40);brim.scale.z=.8;const crown=cyl(.29,.35,.33,0,.17,0,dark,hat,32);crown.scale.z=.8;cyl(.345,.35,.07,0,.07,0,walnut,hat,32).scale.z=.8;
 box(5,.18,2,-4.5,.95,10.35,mat('#22272a',.3,.25));for(const x of [-6.5,-2.5])for(const z of [9.65,11.05])box(.06,.85,.06,x,.45,z,brass);box(1.5,.09,.85,-4.9,1.08,10.35,linen);box(1.3,.08,.8,-4.75,1.16,10.4,walnut);cyl(.35,.35,.025,-3.15,1.06,10.25,brass);cyl(.13,.1,.22,-3.15,1.19,10.25,linen);
 // Personal objects: film tickets and notebooks drawn as texture, not stock imagery.
 function paper(w,h,x,y,z,paint,flat=false){const c=document.createElement('canvas');c.width=768;c.height=512;paint(c.getContext('2d'));const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:t}));m.position.set(x,y,z);if(flat)m.rotation.x=-Math.PI/2;scene.add(m);return m}
 paper(1.4,.8,-5.6,1.235,10.4,c=>{c.fillStyle='#cfbb91';c.fillRect(0,0,768,512);c.fillStyle='#292726';c.font='27px monospace';c.fillText('AFTER HOURS / DOUBLE FEATURE',35,65);c.font='48px Georgia';c.fillText('Interstellar',35,190);c.fillText('Back to the Future',35,290);c.font='22px monospace';c.fillText('TIME · CURIOSITY · POSSIBILITY',35,430)},true).rotation.z=.12;
 box(2.5,1.8,.08,-8,3.9,-4.2,brass);paper(2.34,1.64,-8,3.9,-4.14,c=>{c.fillStyle='#1d241f';c.fillRect(0,0,768,512);c.strokeStyle='#bbab83';c.lineWidth=3;c.strokeRect(90,70,590,340);c.beginPath();c.moveTo(385,70);c.lineTo(385,410);c.moveTo(90,245);c.lineTo(680,245);c.stroke();c.fillStyle='#e7d8b5';c.font='36px Georgia';c.fillText('Outside the frame.',185,470)});
 paper(2.7,.58,-8,2.06,-3.63,c=>{c.fillStyle='#28261f';c.fillRect(0,0,768,512);c.fillStyle='#d7cba7';c.font='31px monospace';c.fillText('SYSTEMS  /  QUESTIONS  /  FIELD NOTES',25,260)});
 paper(.9,.62,-4.94,1.32,6.56,c=>{c.fillStyle='#dbcca8';c.fillRect(0,0,768,512);c.fillStyle='#544730';c.font='italic 55px Georgia';c.fillText('For the difficult days.',35,160);c.font='38px Georgia';c.fillText('Keep your own frame of mind.',35,320)},true).rotation.z=-.12;
 // Low walnut hi-fi cabinet, loudspeakers and a spinning record.
 const stereo=new T.Group();stereo.position.set(8.2,0,-2.8);scene.add(stereo);box(3.6,1.4,1.45,0,1.05,0,walnut,stereo);for(const x of [-1.4,1.4])box(.07,.4,.8,x,.2,0,brass,stereo);box(1.75,.48,.07,0,1.17,.77,brass,stereo);box(.8,.16,.03,-.23,1.21,.82,dark,stereo);for(const x of [.44,.7])cyl(.095,.095,.08,x,1.19,.84,dark,stereo).rotation.x=Math.PI/2;
 for(const x of [-1.25,1.25]){box(.63,1.03,.1,x,1.08,.79,dark,stereo);for(let i=0;i<12;i++)box(.016,.94,.025,x-.26+i*.047,1.08,.86,walnut,stereo)}
 for(let i=0;i<2;i++){const sleeve=box(.68,.78,.035,-.62+i*.5,2.26,-.37,mat(i?'#432b35':'#24302c'),stereo);sleeve.rotation.z=i?.08:-.12;box(.36,.035,.043,-.62+i*.5,2.47,-.343,brass,stereo);box(.21,.018,.044,-.62+i*.5,2.37,-.342,mat('#c4b18a'),stereo)}
 box(1.6,.11,1.1,0,1.82,0,dark,stereo);const record=cyl(.48,.48,.025,-.18,1.89,0,dark,stereo,48);cyl(.14,.14,.03,-.18,1.91,0,mat('#a85a38'),stereo,24);const recordMark=box(.18,.005,.025,.15,.02,0,brass,record);box(.025,.025,.65,.5,1.98,.1,brass,stereo).rotation.y=.35;
 const lamp=new T.PointLight('#ffc583',35,9,2);lamp.position.set(-4,4,8);scene.add(lamp);cyl(.38,.45,.1,-8.3,.1,7.6,brass);cyl(.035,.035,4.6,-8.3,2.35,7.6,brass);cyl(.42,.72,.9,-8.3,4.7,7.6,linen);
 // TV has its own original, low-resolution broadcast canvas.
 const tv=new T.Group();tv.position.set(-9.3,0,3.8);tv.rotation.y=.9;scene.add(tv);box(3.2,.14,1.5,0,1.1,0,walnut,tv);for(const x of [-1.25,1.25])box(.08,1.1,.8,x,.55,0,brass,tv);cushion(2.8,1.9,1.25,0,2.1,0,tv,walnut);box(2.5,1.64,.08,0,2.15,.67,dark,tv);
 const c=document.createElement('canvas');c.width=480;c.height=320;const ctx=c.getContext('2d'),texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;const screen=new T.Mesh(new T.PlaneGeometry(2.05,1.4),new T.MeshBasicMaterial({map:texture}));screen.position.set(-.12,2.15,.72);tv.add(screen);for(const y of [1.88,2.37])cyl(.09,.09,.04,1.12,y,.74,brass,tv).rotation.x=Math.PI/2;
 const video=document.createElement('video');video.src='/api/video';video.crossOrigin='anonymous';video.preload='none';video.playsInline=true;
 let channel=0,playing=false,last=-1,videoMode=false;
 video.addEventListener('ended',()=>{videoMode=false;channel=0;last=-1;document.dispatchEvent(new Event('tv-video-ended'))});
 function update(t,motion){
  if(playing&&motion)record.rotation.y=t*.9;
  if(videoMode){if(video.readyState>=2&&Math.floor(t*24)!==last){last=Math.floor(t*24);ctx.fillStyle='#070809';ctx.fillRect(0,0,480,320);const scale=Math.min(480/video.videoWidth,320/video.videoHeight),w=video.videoWidth*scale,h=video.videoHeight*scale;ctx.drawImage(video,(480-w)/2,(320-h)/2,w,h);texture.needsUpdate=true}return}
  if(last>=0&&(!channel||!motion))return;
  if(Math.floor(t*8)===last)return;
  last=Math.floor(t*8);ctx.fillStyle='#07100f';ctx.fillRect(0,0,480,320);
  if(channel){
   ctx.fillStyle=channel===1?'#84968b':'#cabfa3';
   if(channel===1){for(let i=0;i<24;i++){const h=45+(i*71%157),x=i*23;ctx.fillStyle='#233731';ctx.fillRect(x,270-h,19,h);ctx.fillStyle='#8b9e88';for(let y=278-h;y<260;y+=12)for(let k=0;k<3;k++)if((i+k+y)%5<3)ctx.fillRect(x+3+k*5,y,2,4)}}
   else{for(let i=0;i<85;i++){const x=(i*137)%480,y=(i*i*43)%265;ctx.globalAlpha=.35+.5*Math.sin(i+(motion?t*.3:0))**2;ctx.fillRect(x,y,i%9===0?2:1,i%9===0?2:1)}ctx.globalAlpha=1}
   ctx.fillStyle='#bcbf9e';ctx.font='12px monospace';ctx.fillText(channel===1?'01 / THE CITY IS STILL AWAKE':'02 / A LITTLE PERSPECTIVE',24,298)
  }else{ctx.fillStyle='#3d4c43';ctx.font='14px monospace';ctx.fillText('LATE TRANSMISSION',155,165)}
  for(let y=0;y<320;y+=4){ctx.fillStyle='#00000035';ctx.fillRect(0,y,480,1)}texture.needsUpdate=true
 }
 async function setVideo(on){
  if(!on){videoMode=false;video.pause();try{video.currentTime=0}catch{}channel=0;last=-1;return}
  videoMode=true;channel=0;last=-1;
  try{await video.play()}catch(error){videoMode=false;video.pause();throw error}
 }
 function setChannel(value){videoMode=false;video.pause();try{video.currentTime=0}catch{}channel=Number(value);last=-1}

 return {update,setLamp(v){lamp.intensity=v?35:0},setPlaying(v){playing=v},setChannel,setVideo};
}
