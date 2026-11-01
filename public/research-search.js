import {SEARCH_RECEIPT as data} from './research-search-data.js';
export {SEARCH_RECEIPT} from './research-search-data.js';
const root=`https://github.com/${data.sourceRepository}/blob/${data.sourceCommit}/`;
export const SEARCH_STAGES=[{max:.003,label:'Original search',heading:'A weak result. An open question.',note:'Poor recall at this search boundary. Before blaming the architecture, test a wider range.'},{max:.01,label:'First extension',heading:'The gap shrinks.',note:'Recall improves without adding attention. The original failure interpretation no longer holds.'},{max:.03,label:'Second extension',heading:'The interpretation changes.',note:'The model reaches 98.4% on this test. This easy pilot cannot establish an attention requirement.'}];
export function searchStage(index){
  if(!Number.isInteger(index)||index<0||index>=SEARCH_STAGES.length)throw Error('Invalid search stage');
  const stage=SEARCH_STAGES[index];
  const points=Object.entries(data.validation).map(([lr,accuracy])=>({lr:Number(lr),accuracy})).filter(p=>p.lr<=stage.max);
  const winner=points.reduce((a,b)=>b.accuracy>a.accuracy?b:a);
  const test=data.testP8.find(r=>r.lr===winner.lr);
  return {...stage,index,points,winner,test};
}
const pct=n=>(n*100).toFixed(1)+'%';
const rate=n=>n===.001?'1e−3':n===.003?'3e−3':n===.01?'1e−2':n===.02?'2e−2':'3e−2';
const x=n=>42+(Math.log10(n)-Math.log10(.001))/(Math.log10(.03)-Math.log10(.001))*276;
const y=n=>103-n*78;
export function searchMarkup(index){
 const s=searchStage(index),all=Object.keys(data.validation).map(Number);
 return `<div class="search-experiment"><span class="search-kicker">MQAR / RECORDED CPU PILOT / SEED 0</span><h4>Was it the model, or the search?</h4><p class="search-invitation">Move the pencil to widen the search. The model stays the same.</p><figure class="search-figure"><svg viewBox="0 0 350 140" role="img" aria-labelledby="search-plot-title search-plot-description"><title id="search-plot-title">Recorded validation accuracy as the learning-rate search widens</title><desc id="search-plot-description">${s.points.length} measured learning rates. Best validation mean ${pct(s.winner.accuracy)} at ${s.winner.lr}. Separate test accuracy for eight pairs: ${pct(s.test.accuracy)}.</desc>${[0,.5,1].map(n=>`<line x1="42" x2="322" y1="${y(n)}" y2="${y(n)}" class="search-grid"/><text x="34" y="${y(n)+4}" text-anchor="end">${n*100}%</text>`).join('')}<path d="M42 20V103H322" class="search-axis"/><text x="42" y="14" class="search-axis-title">VALIDATION / MEAN OVER 2, 4, 6, 8 PAIRS</text>${all.map(lr=>`<text x="${x(lr)}" y="120" text-anchor="middle">${rate(lr)}</text>`).join('')}<text x="182" y="138" text-anchor="middle">Learning rate · logarithmic scale</text>${s.points.map(p=>`<circle cx="${x(p.lr)}" cy="${y(p.accuracy)}" r="${p.lr===s.winner.lr?5:3.5}" class="search-point ${p.lr===s.winner.lr?'search-winner':''}"/>`).join('')}${index<2?`<text x="${index===0?240:286}" y="75" text-anchor="middle" class="search-unseen">not searched yet</text>`:''}</svg><figcaption>Dots are recorded runs. No simulated or interpolated results.</figcaption></figure><div class="search-control"><label for="learning-search">Widen the learning-rate search</label><output id="search-range">${s.label} · ${s.points.length} rates</output><div class="pencil-rail"><input id="learning-search" type="range" min="0" max="2" step="1" value="${index}" aria-describedby="search-control-help" aria-valuetext="${s.label}: 0.001 to ${s.max}"/></div><div class="search-stops" aria-hidden="true"><span>Original</span><span>Wider</span><span>Widest</span></div><small id="search-control-help">Drag or use arrow keys. Each stop reveals an actual search extension.</small></div><div class="search-reading" aria-live="polite" aria-atomic="true"><span>SELECT ON VALIDATION → CHECK ON TEST</span><div class="search-result-line"><strong>${pct(s.test.accuracy)}</strong><p>test token accuracy<br><small>8 pairs · 512 examples · LR ${rate(s.winner.lr)}</small></p></div><h5>${s.heading}</h5><p>${s.note}</p></div><p class="search-limits">One training seed · 4 layers · width 64 · L=32. The best LR is still at the search edge.</p><details class="search-sources"><summary>Open the experiment record +</summary><p>MQAR asks a model to recall values paired with keys. Learning rate controls the size of training updates. Here, the learning rate is selected by validation accuracy averaged across four pair counts; the large number above is a separate test score at eight pairs.</p><p>This replays recorded evidence; it does not train a model in your browser. Widening this search improved this model, but higher rates do not always help: the attention-only control collapsed at 1e−2.</p><table><caption>Recorded validation token accuracy</caption><thead><tr><th scope="col">Learning rate</th><th scope="col">Mean accuracy</th></tr></thead><tbody>${s.points.map(p=>`<tr><th scope="row">${rate(p.lr)}</th><td>${pct(p.accuracy)}</td></tr>`).join('')}</tbody></table><p class="search-source-links"><a href="${root+data.logPath}" target="_blank" rel="noopener">Correction & methods ↗</a><a href="${root+data.selectionPath}" target="_blank" rel="noopener">Validation selection ↗</a><a href="${root+s.test.sourcePath}" target="_blank" rel="noopener">Selected run’s test record ↗</a><a href="/research/mqar-search-receipt.json" target="_blank" rel="noopener">Data receipt ↗</a></p></details></div>`;
}
let remembered=0;
export function mountSearchExperiment(sheet){
 sheet.innerHTML=searchMarkup(remembered);
 const input=sheet.querySelector('#learning-search');
 input.oninput=()=>{
  const index=Number(input.value),stage=searchStage(index);
  remembered=index;
  const update=document.createElement('div');update.innerHTML=searchMarkup(index);
  // Keep the native range node mounted so a pointer drag retains capture and focus.
  for(const selector of ['.search-figure','.search-reading','.search-sources']){
   sheet.querySelector(selector).innerHTML=update.querySelector(selector).innerHTML;
  }
  sheet.querySelector('#search-range').textContent=stage.label+' · '+stage.points.length+' rates';
  input.setAttribute('aria-valuetext',stage.label+': 0.001 to '+stage.max);
 };
}
