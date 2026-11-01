// Long notes open on their own paper sheet instead of stretching physical objects.
const dialog=document.createElement('dialog');dialog.className='reading-view';dialog.setAttribute('aria-labelledby','reading-title');dialog.innerHTML='<header><span>MK / FROM THE WORKBENCH</span><button type="button" aria-label="Close reading view">Close ×</button></header><h2 id="reading-title"></h2><div class="reading-body"></div>';document.body.append(dialog);
let opener=null;
dialog.querySelector('button').onclick=()=>dialog.close();
dialog.addEventListener('close',()=>opener?.focus({preventScroll:true}));
document.addEventListener('click',e=>{
 const summary=e.target.closest('.machine-record > summary,.search-sources > summary,.margin-annotation > summary,.optional-editorial > summary,.aster-receipt-detail > summary');
 if(!summary||e.button||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
 e.preventDefault();if(summary.matches('.machine-record > summary')){document.querySelector('#project-read-more').click();return;}opener=summary;const details=summary.parentElement;
 dialog.querySelector('#reading-title').textContent=details.matches('.optional-editorial')?'The delivery notes':details.matches('.aster-receipt-detail')?'Inside the replay':details.matches('.margin-annotation')?'A note in the margin':'The experiment record';
 const content=dialog.querySelector('.reading-body');content.replaceChildren(...[...details.children].filter(el=>el!==summary).map(el=>{const copy=el.cloneNode(true);copy.removeAttribute('id');copy.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));return copy;}));
 document.dispatchEvent(new CustomEvent('portfolio-reading-open'));dialog.showModal();dialog.querySelector('button').focus();
});
// Header navigation lands the complete object below the fixed header. The section
// headline remains in the normal page flow above it; the URL remains meaningful.
const objects={'#work':'.notebook','#projects':'.arcade-arrangement','#experience':'.press-sheet-stack','#highlights':'.navigation-instrument','#press-headline':'.press-sheet-stack'};
document.addEventListener('click',e=>{
 const link=e.target.closest('body > header nav a,.hero .line-link,#finder-go,[data-quick-stop="production"]');
 if(!link||e.defaultPrevented||e.button||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
 const href=link.getAttribute('href'),target=document.querySelector(objects[href]||'__no_object__');
 if(!target||innerWidth<901)return;
 e.preventDefault();history.pushState(null,'',href);target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches||document.body.classList.contains('no-motion')?'instant':'smooth',block:'start'});
});
