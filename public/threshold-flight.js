// The text falls into the same screen-centred origin as the existing camera target.
// This changes the HTML overlay only; renderer, shaders and camera remain untouched.
export function gravityProgress(t){return Math.pow(Math.max(0,Math.min(1,t)),3.15);}
export function wordFlight(dx,dy,index=0){
 const distance=Math.hypot(dx,dy)||1,arc=Math.min(40,distance*.065)*(index%2?1:-1);
 return [0,.18,.36,.52,.68,.82,.91,1].map(t=>{
  const p=gravityProgress(t),curve=Math.sin(Math.PI*p)*arc;
  const x=dx*p-dy/distance*curve,y=dy*p+dx/distance*curve;
  const scale=t===1?0:1-p*.94,stretch=1+Math.sin(Math.PI*p)*.22;
  return {offset:t,transform:`translate(${x}px, ${y}px) rotate(${Math.sin(Math.PI*p)*arc*.12}deg) scale(${scale*stretch}, ${scale/stretch})`,opacity:p<.72?1:Math.max(0,(1-p)/.28),filter:`blur(${p>.7?(p-.7)*3:0}px)`};
 });
}
export function absorbThresholdText(threshold,{duration=4300}={}){
 const box=threshold.getBoundingClientRect(),cx=box.width/2,cy=box.height/2;
 const layer=document.createElement('div');layer.className='threshold-suction';layer.setAttribute('aria-hidden','true');
 const fragments=[];
 for(const root of threshold.querySelectorAll('.threshold-top>span,.threshold-shortcuts a,.threshold-shortcuts button,.threshold-copy p,#enter-universe,#intro-sound,#journey-status')){
  if(!root.getClientRects().length||getComputedStyle(root).visibility==='hidden')continue;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){
   const node=walker.currentNode,style=getComputedStyle(node.parentElement);
   for(const match of node.textContent.matchAll(/\S+/g)){
    const range=document.createRange();range.setStart(node,match.index);range.setEnd(node,match.index+match[0].length);const rect=range.getBoundingClientRect();
    if(!rect.width||!rect.height)continue;
    const word=document.createElement('span');word.className='threshold-suction-word';word.textContent=match[0];
    Object.assign(word.style,{left:`${rect.left-box.left}px`,top:`${rect.top-box.top}px`,font:style.font,letterSpacing:style.letterSpacing,color:style.color,lineHeight:`${rect.height}px`,textShadow:style.textShadow});
    layer.append(word);fragments.push({word,dx:cx-(rect.left-box.left+rect.width/2),dy:cy-(rect.top-box.top+rect.height/2)});
   }
  }
 }
 const surfaces=[...threshold.querySelectorAll('.threshold-top,.threshold-copy,#intro-sound,#gravity-scene')].map(el=>({el,inert:el.inert}));
 surfaces.forEach(({el})=>el.inert=true);
 threshold.append(layer);threshold.classList.add('gravity-absorbing');
 const animations=fragments.map(({word,dx,dy},i)=>word.animate(wordFlight(dx,dy,i),{duration,delay:Math.min(i*5,90),easing:'linear',fill:'forwards'}));
 // Keep original text hidden until the threshold is gone, including the fade out.
 return ()=>{animations.forEach(animation=>animation.cancel());layer.remove();threshold.classList.remove('gravity-absorbing');surfaces.forEach(({el,inert})=>el.inert=inert);};
}
