// Conceptual sketches have a real inspection action; recorded data stays in its own view.
const descriptions={
 memory:{title:'Same key. A different place.',copy:'The key has moved from the drawer to the pocket. Remembering where it was is different from tracking where it is now.'},
 audit:{title:'The price is only part of the story.',copy:'Tickets represent priority: earlier orders at the same price wait ahead of later ones. Available volume can fill those earlier orders before reaching yours.'},
 kyle:{title:'A forecast still needs a useful decision.',copy:'A barometer predicts the weather; taking an umbrella is a separate choice. In the research, predicting market impact and improving a trading decision were tested separately.'}
};
const opener=document.querySelector('.sketch-open');
if(opener){
 const notes={
  memory:{summary:'Was here: the drawer. Now here: the pocket. The faint key in the drawer marks its former location.',labels:[['was here',260,80,-5],['now here',1100,80,4]],paths:['M460 105 Q415 230 505 470','M1260 115 Q1395 285 1320 540'],heads:['M485 448 L505 470 L508 435','M1303 512 L1320 540 L1342 516']},
  audit:{summary:'Served first: the earlier ticket. Waits behind: the later ticket. Queue position changes which order fills.',labels:[['served first',445,90,-5],['waits behind',1020,140,4]],paths:['M680 120 Q740 255 750 570','M1265 185 Q1390 375 1250 745'],heads:['M729 546 L750 570 L767 542','M1240 711 L1250 745 L1280 723']},
  kyle:{summary:'Forecast: the barometer. Decision: taking an umbrella. Predicting something and acting usefully are separate questions.',labels:[['forecast',610,100,-4],['decision',1130,145,5]],paths:['M735 130 Q690 275 500 395','M1330 190 Q1420 390 1230 665'],heads:['M528 389 L500 395 L513 364','M1232 632 L1230 665 L1262 651']}
 };
 const markup=key=>{const n=notes[key];return `<svg class="sketch-annotations" viewBox="0 0 1536 1024" aria-hidden="true"><g class="pencil-arrows">${n.paths.map(d=>`<path d="${d}"/>`).join('')}${n.heads.map(d=>`<path d="${d}"/>`).join('')}</g>${n.labels.map(([label,x,y,angle])=>`<text x="${x}" y="${y}" transform="rotate(${angle} ${x} ${y})">${label}</text>`).join('')}</svg>`;};
 const stage=document.createElement('span');stage.className='sketch-stage';const source=opener.querySelector('img');source.before(stage);stage.append(source);
 const shadow=document.createElement('span');shadow.className='attachment-shadow';shadow.setAttribute('aria-hidden','true');opener.closest('figure').prepend(shadow);
 const corner=document.createElement('span');corner.className='attachment-corner';corner.setAttribute('aria-hidden','true');opener.closest('figure').append(corner);
 function annotate(key){stage.querySelector('.sketch-annotations')?.remove();stage.insertAdjacentHTML('beforeend',markup(key));opener.setAttribute('aria-description',notes[key].summary);}
 annotate(document.querySelector('.notebook').dataset.spread||'memory');
 document.addEventListener('portfolio-context',event=>{if(event.detail?.type==='research'&&notes[event.detail.id])annotate(event.detail.id);});
 const dialog=document.createElement('dialog');dialog.id='notebook-sketch-view';dialog.setAttribute('aria-labelledby','notebook-sketch-title');dialog.innerHTML='<header><span>MK / A STUDY IN THE MARGIN</span><button type="button" aria-label="Close notebook drawing">Close ×</button></header><div class="sketch-stage"><img alt=""></div><h2 id="notebook-sketch-title"></h2><p></p><small>Conceptual graphite illustration · not measured data or a research result.</small>';document.body.append(dialog);
 opener.addEventListener('click',()=>{const source=document.querySelector('#notebook-image'),key=document.querySelector('.notebook').dataset.spread||'memory',description=descriptions[key];dialog.querySelector('img').src=source.src;dialog.querySelector('img').alt=source.alt+' — '+notes[key].summary;dialog.querySelector('.sketch-annotations')?.remove();dialog.querySelector('.sketch-stage').insertAdjacentHTML('beforeend',markup(key));dialog.querySelector('h2').textContent=description.title;dialog.querySelector('p').textContent=description.copy;dialog.showModal();dialog.querySelector('button').focus();});
 dialog.querySelector('button').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>opener.focus({preventScroll:true}));
}
