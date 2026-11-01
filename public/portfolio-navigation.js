// One in-page journey: preserve the URL, respect motion, and move keyboard focus.
const OBJECTS={'#work':'.notebook','#projects':'.arcade-arrangement','#experience':'.press-sheet-stack','#highlights':'.navigation-instrument','#press-headline':'.press-sheet-stack'};
export function navigatePortfolio(href,env={document,history,innerWidth,innerHeight,matchMedia:q=>matchMedia(q)}){
 const doc=env.document,selector=OBJECTS[href];
 if(!selector)return false;
 const section=doc.querySelector(href),object=doc.querySelector(selector);
 if(!section||!object)return false;
 let target=env.innerWidth>900?object:section;
 if(href==='#highlights'&&env.innerWidth>900){
  const intro=doc.querySelector('.navigator-intro'),header=doc.querySelector('body>header');
  const available=env.innerHeight-(header?.getBoundingClientRect().height||82)-40;
  if(intro&&object.getBoundingClientRect().bottom-intro.getBoundingClientRect().top<=available)target=intro;
 }
 const quiet=env.matchMedia('(prefers-reduced-motion: reduce)').matches||doc.body.classList.contains('no-motion');
 if(env.history.state?.portfolioTarget!==href)env.history.pushState({...env.history.state,portfolioTarget:href},'',href);
 target.scrollIntoView({behavior:quiet?'instant':'smooth',block:'start'});
 const candidates=[...target.querySelectorAll('h2,h3,h4'),...section.querySelectorAll('h2,h3,h4')];
 const heading=candidates.find(el=>el.getClientRects().length>0);
 if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
 return true;
}
