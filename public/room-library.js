export const RECOMMENDATIONS={watch:[
 {title:'Interstellar',by:'2014 · Film',tag:'Start here',note:'For the scale of space, the passing of time, and the people waiting back home.',tone:'#303c45',motif:'orbit'},
 {title:'Back to the Future',by:'1985 · Film',tag:'A little electricity',note:'An eccentric inventor, a very particular car, and the joy of asking “what if?”',tone:'#664634',motif:'bolt'},
 {title:'Steins;Gate',by:'2011 · Anime series',tag:'Let it build',note:'A scrappy lab, small experiments, and consequences that refuse to stay small. Give the opening time.',tone:'#4c453c',motif:'clock'},
 {title:'Arrival',by:'2016 · Film',tag:'Stay curious',note:'Language, perception, and a story that rewards looking at the beginning again.',tone:'#374b49',motif:'orbit'},
 {title:'The Prestige',by:'2006 · Film',tag:'Look closely',note:'Rivalry, obsession, and the cost of making something extraordinary.',tone:'#493a48',motif:'bolt'},
 {title:'Contact',by:'1997 · Film',tag:'Keep listening',note:'A search for a signal becomes a question about evidence, belief, and being alone.',tone:'#354052',motif:'orbit'}
],read:[
 {title:'The Order of Time',by:'Carlo Rovelli',tag:'Time, reconsidered',note:'A short, thoughtful companion to the questions Interstellar leaves behind.',tone:'#384c57',motif:'clock',url:'https://www.penguinrandomhouse.com/books/551483/the-order-of-time-by-carlo-rovelli/'},
 {title:'Exhalation',by:'Ted Chiang',tag:'One story at a time',note:'Precise thought experiments with very human stakes: choice, memory, and what a life means.',tone:'#685242',motif:'orbit',url:'https://www.penguinrandomhouse.com/books/538034/exhalation-by-ted-chiang/'},
 {title:'Thinking in Systems',by:'Donella H. Meadows',tag:'See the connections',note:'Feedback loops, delays, and why a sensible local fix can create a bigger problem elsewhere.',tone:'#3f5142',motif:'orbit',url:'https://www.chelseagreen.com/product/thinking-in-systems/'},
 {title:'The Beginning of Infinity',by:'David Deutsch',tag:'Keep asking why',note:'An ambitious argument for explanation, knowledge, and problems we can learn to solve.',tone:'#383b58',motif:'bolt',url:'https://www.penguinrandomhouse.com/search/?q=The%20Beginning%20of%20Infinity'},
 {title:'Surely You’re Joking, Mr. Feynman!',by:'Richard P. Feynman',tag:'Follow the curiosity',note:'Stories of experiments, detours, and the pleasure of figuring things out.',tone:'#6c483e',motif:'bolt',url:'https://wwnorton.com/books/9780393355628'},
 {title:'The Three-Body Problem',by:'Cixin Liu',tag:'Think on a larger scale',note:'Science fiction that starts with a mystery and keeps widening the frame.',tone:'#354b53',motif:'orbit',url:'https://us.macmillan.com/books/9781250370600/thethreebodyproblem/'}
],play:[
 {title:'Resident Evil 4',by:'2005 · Survival horror',tag:'The original',note:'Leon, a remote village, and an opening encounter that still sets the pace. The 2005 game belongs on this shelf.',tone:'#493b35',url:'https://www.residentevil.com/'},
 {title:'God of War III',by:'2010 · PlayStation 3',tag:'Myth at full volume',note:'Huge set pieces, chained blades, and a clash with Olympus. This is the third Greek-era game.',tone:'#59433f',url:'https://www.playstation.com/games/god-of-war/'},
 {title:'Dofus Retro',by:'Ankama · Tactical MMORPG',tag:'Back to the World of Twelve',note:'Turn-based fights, character builds, and the slower rhythm of a shared adventure. A different kind of nostalgia.',tone:'#59623b',url:'https://www.dofus.com/'}
]};

const slugs={watch:['interstellar','back-to-the-future','steins-gate','arrival','prestige','contact'],read:['order-of-time','exhalation','thinking-in-systems','beginning-of-infinity','feynman','three-body-problem'],play:['resident-evil-4','god-of-war-3','dofus-retro']};
for(const [kind,items] of Object.entries(RECOMMENDATIONS))items.forEach((item,i)=>{item.cover='/assets/collection/'+slugs[kind][i]+'.webp';});
// Walnut shelving, paper edges and separate DVD / game cases. Artwork is loaded locally.
export function buildReadingStand(T,scene,box,mat,brass){
 const g=new T.Group();g.name='The collection shelves / books, DVDs and games';g.position.set(-8,0,-4);scene.add(g);
 const wood=mat('#392820',.65),dark=mat('#1d1715',.9),pages=mat('#cfbfa0',.95),plastic=mat('#22242b',.38);
 box(3.55,5.8,.13,0,3,-.43,dark,g);for(const x of [-1.75,1.75]){box(.14,5.9,.95,x,3,0,wood,g);box(.025,5.6,.025,x,3,.49,brass,g);}
 const loader=new T.TextureLoader();
 for(const [row,kind] of ['read','watch','play'].entries()){
  const y=.60+row*1.65;box(3.6,.14,1.02,0,y,0,wood,g);box(3.6,.025,.03,0,y+.07,.52,brass,g);
  const items=RECOMMENDATIONS[kind],gap=kind==='play'?.91:.52,w=kind==='play'?.78:.45,h=kind==='read'?1.15:1.2;
  items.forEach((item,i)=>{const book=new T.Group();book.position.set((i-(items.length-1)/2)*gap,y+h/2+.09,.13);g.add(book);book.name=kind+' / '+item.title;
   box(w+.025,h+.025,.13,0,0,0,kind==='read'?mat(item.tone,.8):plastic,book);if(kind==='read')box(w-.015,h-.06,.105,0,0,.025,pages,book);
   const face=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:0xffffff}));face.position.z=.085;book.add(face);
   loader.load(item.cover,texture=>{texture.colorSpace=T.SRGBColorSpace;const ratio=texture.image.width/texture.image.height,frame=w/h;face.scale.set(ratio>frame?1:ratio/frame,ratio>frame?frame/ratio:1,1);face.material.map=texture;face.material.needsUpdate=true;},undefined,()=>{face.material.color.set(item.tone);});
  });
  const c=document.createElement('canvas');c.width=512;c.height=64;const ctx=c.getContext('2d');ctx.fillStyle='#35271f';ctx.fillRect(0,0,512,64);ctx.fillStyle='#d7c299';ctx.font='24px monospace';ctx.textAlign='center';ctx.fillText({read:'01 / THE BOOKSHELF',watch:'02 / DVD & SERIES',play:'03 / THE GAME SHELF'}[kind],256,43);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;const plaque=new T.Mesh(new T.PlaneGeometry(2.4,.25),new T.MeshBasicMaterial({map:tex}));plaque.position.set(0,y-.17,.54);g.add(plaque);
 }
 box(3.7,.18,1.08,0,5.68,0,wood,g);return g;
}
