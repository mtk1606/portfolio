// Original lightweight geometry. Shares the room's materials, lighting and renderer.
export const TABLE_POSITION={x:.6,z:8.3};
export function buildDecisionTable(T,scene,box,cyl,mat){
 const group=new T.Group();group.name='The green table / decision games';group.position.set(TABLE_POSITION.x,0,TABLE_POSITION.z);group.rotation.y=-.18;scene.add(group);
 const walnut=mat('#30251d',.55),rail=mat('#24271e',.62),brass=mat('#97805a',.39,.65),felt=mat('#225342',.98),legs=mat('#25241c',.6);
 function oval(radius,height,y,material){const m=cyl(radius,radius,height,0,y,0,material,group,64);m.scale.z=.64;return m;}
 oval(1.92,.19,2.09,walnut);oval(1.94,.045,2.21,brass);oval(1.87,.13,2.26,rail);oval(1.63,.035,2.33,felt);
 // Turned pedestal and four spreading feet keep the small table visually grounded.
 cyl(.22,.34,1.66,0,1.08,0,walnut,group,24);cyl(.39,.3,.14,0,.34,0,brass,group,32);
 for(let i=0;i<4;i++){const foot=box(.22,.18,1.35,0,.15,.55,legs,group);foot.rotation.y=i*Math.PI/2;foot.position.set(Math.sin(i*Math.PI/2)*.5,.15,Math.cos(i*Math.PI/2)*.5);}
 // A stitched oval on the felt, using a single thin line rather than extra lights.
 const points=[];for(let i=0;i<=100;i++){const a=i/100*Math.PI*2;points.push(new T.Vector3(Math.cos(a)*1.48,2.353,Math.sin(a)*.91));}
 group.add(new T.Line(new T.BufferGeometry().setFromPoints(points),new T.LineDashedMaterial({color:'#baab78',dashSize:.05,gapSize:.035,transparent:true,opacity:.45})));group.children.at(-1).computeLineDistances();
 const art=document.createElement('canvas');art.width=512;art.height=320;const c=art.getContext('2d');c.fillStyle='#e4dcc3';c.fillRect(0,0,512,320);c.fillStyle='#33483c';c.font='32px Georgia';c.fillText('A',26,43);c.fillText('♠',26,79);c.font='130px Georgia';c.fillText('♠',201,210);c.strokeStyle='#aa9c74';c.strokeRect(11,11,490,298);const texture=new T.CanvasTexture(art);texture.colorSpace=T.SRGBColorSpace;
 for(let i=0;i<2;i++){const m=new T.Mesh(new T.PlaneGeometry(.54,.83),i?new T.MeshStandardMaterial({color:'#e4dcc3',roughness:.9}):new T.MeshStandardMaterial({map:texture,roughness:.9}));m.rotation.set(-Math.PI/2,0,-.22+i*.4);m.position.set(-.7+i*.35,2.36+i*.004,.3);group.add(m);}
 // Three stacks of chipped ivory, burgundy and slate counters.
 const colors=['#a99b78','#744d43','#435950'];for(let n=0;n<3;n++)for(let i=0;i<4+n;i++){cyl(.115,.115,.036,.65+n*.22,2.38+i*.038,.4-n*.16,mat(i%2?colors[n]:'#c4b18b',.75),group,16);}
 const plaque=document.createElement('canvas');plaque.width=512;plaque.height=128;const p=plaque.getContext('2d');p.fillStyle='#7f6c43';p.fillRect(0,0,512,128);p.strokeStyle='#d2b77d';p.strokeRect(6,6,500,116);p.fillStyle='#23291f';p.textAlign='center';p.font='29px Georgia';p.fillText('THE GREEN TABLE',256,54);p.font='16px monospace';p.fillText('TAKE A SEAT / YOUR MOVE',256,91);const t=new T.CanvasTexture(plaque);t.colorSpace=T.SRGBColorSpace;const plate=new T.Mesh(new T.PlaneGeometry(1.1,.275),new T.MeshStandardMaterial({map:t,roughness:.6,metalness:.25}));plate.position.set(0,2.375,-.58);plate.rotation.x=-Math.PI/2;group.add(plate);
 // Upholstered chair at the visitor's side.
 box(1.05,.2,.9,0,1.22,2.05,walnut,group);box(.96,.13,.83,0,1.38,2.05,mat('#344137',.96),group);box(1.05,1.15,.12,0,1.91,2.48,walnut,group);box(.84,.86,.08,0,1.94,2.39,mat('#344137',.96),group);for(const x of [-.43,.43])for(const z of [1.72,2.36])box(.1,1.15,.1,x,.6,z,walnut,group);
 return group;
}
