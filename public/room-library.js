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
]};
// Original typographic jackets; no borrowed posters or cover artwork.
export function buildReadingStand(T,scene,box,mat,brass){
 const g=new T.Group();g.name='The reading stand / books and cinema';g.position.set(-8,2.85,-3.85);scene.add(g);const wood=mat('#392820',.65),pages=mat('#d5c5a5',.95);
 box(3.2,.12,1.04,0,0,0,wood,g);box(3.25,.045,1.08,0,.085,0,brass,g);
 for(const x of [-1.25,1.25]){const leg=box(.1,1,.1,x,.55,-.12,brass,g);leg.rotation.x=-.35;}
 const back=box(2.85,1.7,.1,0,.98,-.26,wood,g);back.rotation.x=-.20;
 box(2.95,.12,.30,0,.20,.20,wood,g);
 function cover(item,x,y,z,w,h){const book=new T.Group();book.position.set(x,y,z);book.rotation.x=-.20;g.add(book);box(w,h,.13,0,0,0,pages,book);box(w+.035,h+.025,.035,0,0,.08,mat(item.tone,.8),book);const c=document.createElement('canvas');c.width=512;c.height=720;const ctx=c.getContext('2d');ctx.fillStyle=item.tone;ctx.fillRect(0,0,512,720);ctx.strokeStyle='#d4bf8d';ctx.lineWidth=2;ctx.strokeRect(25,25,462,670);ctx.fillStyle='#e5d5b3';ctx.font='18px monospace';ctx.fillText('THE AFTER HOURS COLLECTION',40,65);ctx.font='36px Georgia';let line='',row=160;for(const word of item.title.split(' ')){if(ctx.measureText(line+word).width>415){ctx.fillText(line,40,row);row+=45;line='';}line+=word+' ';}ctx.fillText(line,40,row);ctx.beginPath();ctx.ellipse(256,425,150,60,-.5,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(256,425,62,0,Math.PI*2);ctx.stroke();ctx.font='20px Georgia';ctx.fillText(item.by,40,620);ctx.font='16px monospace';ctx.fillText('PICK UP / EXPLORE ↗',40,665);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;const face=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:tex}));face.position.z=.105;book.add(face);return book;}
 cover(RECOMMENDATIONS.read[0],-.65,1.03,.06,1.03,1.46).rotation.z=.035;
 cover(RECOMMENDATIONS.watch[0],.65,1.03,.04,1.03,1.46).rotation.z=-.035;
 for(let i=0;i<3;i++){box(.65,.11,.62,1.1,.20+i*.12,.48,mat(['#493e49','#334a4e','#705744'][i]),g);box(.57,.065,.63,1.1,.20+i*.12,.49,pages,g);}
 return g;
}
