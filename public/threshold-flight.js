// HTML tidal choreography only. The black-hole renderer and camera are unchanged.
export function gravityProgress(t){return Math.pow(Math.max(0,Math.min(1,t)),3.15);}
export function tidalState(dx,dy,t,index=0){
 const p=gravityProgress(t),distance=Math.hypot(dx,dy)||1;
 // Shared handedness: a restrained inward spiral rather than alternating zigzags.
 const arc=Math.min(64,distance*.1)*(1+(index%7)*.025),curve=Math.sin(Math.PI*p)*arc;
 const tidal=Math.pow(p,2.2),size=1-p*.72;
 return {x:dx*p-dy/distance*curve,y:dy*p+dx/distance*curve,angle:Math.atan2(dy,dx)*180/Math.PI,
  stretch:t>=1?0:size*(1+tidal*9),width:t>=1?0:Math.max(.035,size/(1+tidal*5)),
  opacity:p<.87?1:Math.max(0,(1-p)/.13),glow:Math.max(0,(p-.55)/.45)};
}
export function wordFlight(dx,dy,index=0){
 return [0,.16,.3,.44,.56,.66,.75,.82,.88,.93,.965,.985,1].map(t=>{
  const s=tidalState(dx,dy,t,index);
  return {offset:t,transform:`translate(${s.x}px, ${s.y}px) rotate(${s.angle}deg) scale(${s.stretch}, ${s.width}) rotate(${-s.angle}deg)`,opacity:s.opacity,
   textShadow:`${-dx/(Math.hypot(dx,dy)||1)*s.glow*3}px ${-dy/(Math.hypot(dx,dy)||1)*s.glow*3}px ${s.glow*2}px rgba(235,211,173,${s.glow*.28})`,filter:`blur(${s.glow*.35}px)`};
 });
}
export function absorbThresholdText(threshold,{duration=4450}={}){
 const box=threshold.getBoundingClientRect(),cx=box.width/2,cy=box.height/2;
 const layer=document.createElement('div');layer.className='threshold-suction';layer.setAttribute('aria-hidden','true');
 const fragments=[],segmenter=typeof Intl.Segmenter==='function'?new Intl.Segmenter(undefined,{granularity:'grapheme'}):null;
 const roots=threshold.querySelectorAll('.threshold-top>span,.threshold-shortcuts a,.threshold-shortcuts button,.threshold-copy p,#enter-universe,#intro-sound,#journey-status');
 for(const root of roots){
  if(!root.getClientRects().length||getComputedStyle(root).visibility==='hidden')continue;
  const stage=root.id==='enter-universe'?0:root.closest('.threshold-copy')?110:230;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){
   const node=walker.currentNode,style=getComputedStyle(node.parentElement);
   const segments=segmenter?[...segmenter.segment(node.textContent)]:Array.from(node.textContent).map((segment,i,a)=>({segment,index:a.slice(0,i).join('').length}));
   for(const {segment,index} of segments){
    if(!segment.trim())continue;
    const range=document.createRange();range.setStart(node,index);range.setEnd(node,index+segment.length);const rect=range.getBoundingClientRect();
    if(!rect.width||!rect.height)continue;
    const word=document.createElement('span');word.className='threshold-suction-word';word.textContent=segment;
    Object.assign(word.style,{left:`${rect.left-box.left}px`,top:`${rect.top-box.top}px`,width:`${rect.width}px`,height:`${rect.height}px`,font:style.font,fontKerning:'none',letterSpacing:'0px',color:style.color,lineHeight:`${rect.height}px`});
    layer.append(word);fragments.push({word,stage,dx:cx-(rect.left-box.left+rect.width/2),dy:cy-(rect.top-box.top+rect.height/2)});
   }
  }
 }
 const surfaces=[...threshold.querySelectorAll('.threshold-top,.threshold-copy,#intro-sound,#gravity-scene')].map(el=>({el,inert:el.inert}));
 surfaces.forEach(({el})=>el.inert=true);threshold.append(layer);threshold.classList.add('gravity-absorbing');
 const maxDistance=Math.max(1,...fragments.map(f=>Math.hypot(f.dx,f.dy)));
 const animations=fragments.map(({word,dx,dy,stage},i)=>word.animate(wordFlight(dx,dy,i),{duration,delay:stage+Math.hypot(dx,dy)/maxDistance*160+(i%5)*7,easing:'linear',fill:'forwards'}));
 let cleaned=false;
 return ()=>{if(cleaned)return;cleaned=true;animations.forEach(a=>a.cancel());layer.remove();threshold.classList.remove('gravity-absorbing');surfaces.forEach(({el,inert})=>el.inert=inert);};
}
