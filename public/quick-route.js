// Three direct stops on the existing receiver; no tour state or automatic progression.
export const FAST_ROUTE={engineering:{target:'#flagship-record',label:'ASTER engineering record'},production:{target:'#press-headline',label:'BMO production outcomes'},resume:{href:'/assets/mohamed-el-khoudimi-resume.pdf',label:'Resume'}};
export function mountQuickRoute(root=document){
 const engineering=root.querySelector('[data-quick-stop="engineering"]');
 const production=root.querySelector('[data-quick-stop="production"]');
 if(!engineering||!production)return;
 engineering.addEventListener('click',()=>root.querySelector(FAST_ROUTE.engineering.target)?.click());
 production.addEventListener('click',e=>{
  if(e.button||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
  root.querySelector('[data-edition="bmo"]')?.click();
  // The headline and measured lead are the destination; leave longer notes folded.
  const heading=root.querySelector(FAST_ROUTE.production.target);
  if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
 });
}
