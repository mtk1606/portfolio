// No iframe, observers or WebGL startup on the main page. Entering is explicit.
const portal=document.querySelector('.city-portal'),preview=portal?.querySelector('.city-portal-view');
if(portal){let leaving=false;
 portal.addEventListener('click',async e=>{if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();if(leaving)return;leaving=true;const veil=document.createElement('div');veil.id='room-passage';veil.innerHTML='<span>AFTER HOURS</span><p>The study is still lit.</p>';document.body.append(veil);try{sessionStorage.setItem('mk-room-entry','1');document.dispatchEvent(new Event('universe-leaving'));if(!matchMedia('(prefers-reduced-motion: reduce)').matches)await veil.animate([{opacity:0},{opacity:1}],{duration:500,fill:'forwards'}).finished}catch{}location.assign(portal.href)});
 addEventListener('pageshow',()=>{leaving=false;document.querySelector('#room-passage')?.remove();document.body.style.overflow=''});
}
