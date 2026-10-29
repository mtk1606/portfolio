const toggle=document.querySelector('#welcome-expand'),content=document.querySelector('#welcome-content'),card=document.querySelector('.clubhouse-welcome');
function setOpen(open){card.hidden=false;content.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.querySelector('span').textContent=open?'−':'+';}
setOpen(false);
toggle.onclick=()=>setOpen(content.hidden);
document.querySelector('#welcome-fold').onclick=()=>{setOpen(false);toggle.focus({preventScroll:true});};
function fallback(){setOpen(true);}
document.addEventListener('room-failed',fallback);if(document.body.classList.contains('load-failed'))fallback();
document.addEventListener('room-mode',()=>{if(!document.body.classList.contains('load-failed'))setOpen(false);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!content.hidden&&!document.querySelector('dialog[open]')){setOpen(false);toggle.focus({preventScroll:true});}});
const names={computer:'The computer / arcade',chess:'The chess table / one good move',music:'Records / pick a side',sofa:'Take a seat by the fire',mementos:'Keepsakes',tv:'Television / late transmission',art:'The painting',walk:'Walk around the study'};
document.addEventListener('focusin',e=>{const button=e.target.closest?.('[data-go]');if(button&&names[button.dataset.go])document.querySelector('#hint').textContent=names[button.dataset.go]+' ↗';});
