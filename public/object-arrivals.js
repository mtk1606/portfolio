// Decorative, once-per-session arrivals. Content is never hidden or scroll-locked.
export const arrivalTargets=[['radio','.receiver-stage'],['notebook','.journal-body'],['newspaper','.newspaper'],['arcade','.arcade-cabinet']];
export function installObjectArrivals({doc=document,win=window,storage}={}){
 if(!storage)try{storage=win.sessionStorage}catch{}
 const media=win.matchMedia('(prefers-reduced-motion: reduce)'),active=new Map(),seen=new Set();
 try{JSON.parse(storage?.getItem('mk-object-arrivals-v1')||'[]').forEach(k=>seen.add(k))}catch{}
 const quiet=()=>media.matches||doc.body.classList.contains('no-motion');
 const remember=key=>{seen.add(key);try{storage?.setItem('mk-object-arrivals-v1',JSON.stringify([...seen]))}catch{}};
 function finish(el){active.get(el)?.();}
 function arrive(el,key){
  if(seen.has(key))return;remember(key);if(quiet()||typeof el.animate!=='function')return;
  const animations=[],props=[];let done=false;
  const animate=(node,frames,duration,delay=0)=>{if(!node)return;const a=node.animate(frames,{duration,delay,easing:'cubic-bezier(.2,.7,.25,1)',fill:'none'});animations.push(a);};
  const cleanup=()=>{if(done)return;done=true;animations.forEach(a=>a.cancel());props.forEach(p=>p.remove());el.classList.remove('object-arriving');active.delete(el);};
  active.set(el,cleanup);el.classList.add('object-arriving');
  if(key==='radio'){
   animate(el,[{transform:'translateY(-12px) rotate(-.8deg)'},{transform:'translateY(1px) rotate(.12deg)',offset:.78},{transform:'none'}],700);
   animate(el.querySelector('.receiver-needle'),[{translate:'-18px 0'},{translate:'3px 0',offset:.72},{translate:'0 0'}],800,90);
   animate(el.querySelector('#finder-knob'),[{rotate:'-18deg'},{rotate:'3deg',offset:.75},{rotate:'0deg'}],800,90);
   const lamp=doc.createElement('i');lamp.className='arrival-radio-glow';lamp.setAttribute('aria-hidden','true');el.append(lamp);props.push(lamp);
   animate(lamp,[{opacity:0},{opacity:.65,offset:.7},{opacity:0}],950);
  }else if(key==='notebook'){
   for(let i=0;i<4;i++){
    const page=doc.createElement('i');page.className='arrival-leaf'+(i===0?' arrival-cover':'');page.setAttribute('aria-hidden','true');el.append(page);props.push(page);
    animate(page,[{transform:'perspective(1100px) rotateY(-8deg)',opacity:0},{transform:'perspective(1100px) rotateY(-20deg)',opacity:1,offset:.12},{transform:'perspective(1100px) rotateY(-115deg)',opacity:.9,offset:.65},{transform:'perspective(1100px) rotateY(-173deg)',opacity:0}],i===0?520:580,i*155);
   }
  }else if(key==='newspaper'){
   const fold=doc.createElement('i');fold.className='arrival-paper-fold';fold.setAttribute('aria-hidden','true');el.append(fold);props.push(fold);
   animate(fold,[{opacity:.55,transform:'perspective(1000px) rotateY(18deg) scaleX(1.5)'},{opacity:0,transform:'perspective(1000px) rotateY(0deg) scaleX(.2)'}],850);
  }else{
   animate(el.querySelector('.cabinet-screen'),[{filter:'brightness(0)'},{filter:'brightness(.35)',offset:.25},{filter:'brightness(1)'}],650,180);
   animate(el.querySelector('.cabinet-marquee'),[{filter:'brightness(.65)'},{filter:'brightness(1.12)',offset:.7},{filter:'brightness(1)'}],400);
  }
  Promise.all(animations.map(a=>a.finished.catch(()=>{}))).then(cleanup);
 }
 const observer='IntersectionObserver'in win?new win.IntersectionObserver(entries=>{for(const e of entries){if(!e.isIntersecting){finish(e.target);continue}if(e.intersectionRatio>=.18||e.intersectionRect?.height>=Math.min(120,win.innerHeight*.18))arrive(e.target,e.target.dataset.arrivalKind)}},{threshold:[0,.05,.1,.18],rootMargin:'0px 0px -5% 0px'}):null;
 const nodes=arrivalTargets.map(([key,selector])=>{const el=doc.querySelector(selector);if(el)el.dataset.arrivalKind=key;return el}).filter(Boolean);
 const cancelAll=()=>{for(const stop of [...active.values()])stop()};
 const onInteract=e=>{for(const el of active.keys())if(el.contains(e.target))finish(el)};
 const onMotion=()=>{if(quiet())cancelAll()};
 const onVisibility=()=>{if(doc.hidden)cancelAll()};
 const start=()=>{for(const el of nodes)observer?.observe(el)};
 if(doc.querySelector('#threshold')?.hidden===false)doc.addEventListener('portfolio-entered',start,{once:true});else start();
 doc.addEventListener('pointerdown',onInteract,true);doc.addEventListener('focusin',onInteract,true);doc.addEventListener('visibilitychange',onVisibility);media.addEventListener('change',onMotion);
 const mutation=new win.MutationObserver(onMotion);mutation.observe(doc.body,{attributes:true,attributeFilter:['class']});
 return ()=>{cancelAll();observer?.disconnect();mutation.disconnect();doc.removeEventListener('portfolio-entered',start);doc.removeEventListener('pointerdown',onInteract,true);doc.removeEventListener('focusin',onInteract,true);doc.removeEventListener('visibilitychange',onVisibility);media.removeEventListener('change',onMotion)};
}
if(typeof document!=='undefined')installObjectArrivals();
