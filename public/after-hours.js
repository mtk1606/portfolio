const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const scene=document.querySelector('.city-scene');
addEventListener('pointermove',e=>{if(reduced.matches||e.pointerType==='touch'||document.body.classList.contains('arcade-open'))return;scene.style.setProperty('--dx',(e.clientX/innerWidth-.5)*6+'px');scene.style.setProperty('--dy',(e.clientY/innerHeight-.5)*4+'px')},{passive:true});
const sound=document.querySelector('#sound');sound.onclick=()=>{const on=sound.getAttribute('aria-pressed')!=='true';sound.setAttribute('aria-pressed',String(on));sound.textContent=on?'GAME SOUND ON':'SOUND OFF'};
