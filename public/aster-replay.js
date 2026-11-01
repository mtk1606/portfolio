// Lazy-loaded only after the ASTER coin is inserted. All core work stays off the UI thread.
export function mountAsterReplay(host,{setMain,onStep}){
  let worker,step=0,total=12,request=0,destroyed=false,playing=false,timer=null,last=null,watchdog=null;
  host.innerHTML=`<div class="aster-live"><div class="aster-live-heading"><h4>THE REPLAY BENCH</h4><span id="aster-engine-state" role="status">WAKING THE C++ CORE…</span></div><div class="aster-live-book" aria-label="Displayed order book"><section><h5>BUY / BEST FIRST</h5><div id="aster-bids">Waiting for the engine…</div></section><section><h5>SELL / BEST FIRST</h5><div id="aster-asks">Waiting for the engine…</div></section></div><div class="aster-transport"><button id="aster-play" disabled>▶ Play</button><label for="aster-timeline">Event <output id="aster-position">0 / 12</output></label><input id="aster-timeline" type="range" min="0" max="12" value="0" step="1" disabled aria-label="Replay event timeline"></div><p id="aster-event" class="aster-event">A small synthetic recording. No live market connection.</p><div class="aster-verification"><button id="aster-verify" disabled>Verify state</button><span id="aster-receipt" role="status">Compare with the independent Python reference.</span></div><details class="aster-receipt-detail"><summary>What is being checked?</summary><p>The actual ASTER C++ decoder and FIFO book run as WebAssembly in a worker. The timeline rebuilds from the start. Verify compares the full displayed state and FIFO-sensitive hash with a separately generated Python result for this synthetic fixture.</p><p>This checks 12 fixture messages. It does not independently verify a full trading day or measure native performance.</p><p>Large order references remain decimal strings. A partial cancel keeps priority; replacement creates a new queue position.</p><a href="/aster/reference.json" target="_blank" rel="noopener">Python receipt ↗</a><code id="aster-hash"></code></details></div>`;
  const q=s=>host.querySelector(s);
  function stop(){playing=false;clearTimeout(timer);q('#aster-play').textContent='▶ Play';}
  function fail(){if(destroyed)return;clearTimeout(watchdog);stop();setMain('RELOAD',true);q('#aster-engine-state').textContent='REPLAY UNAVAILABLE';q('#aster-event').textContent='The C++ replay could not load. Use Reset to retry, or read the engineering record above.';q('#aster-timeline').disabled=true;q('#aster-play').disabled=true;q('#aster-verify').disabled=true;}
  function seek(n){if(destroyed)return;step=n;last=null;q('#aster-verify').disabled=true;q('#aster-verify').textContent='Verify state';delete q('#aster-receipt').dataset.result;q('#aster-receipt').textContent='State changed. Verify this checkpoint.';setMain('REBUILDING',true);worker.postMessage({id:++request,step});}
  function renderSide(side,target,aliases){
    const el=q(target);el.replaceChildren();
    const levels=last.state.levels.filter(l=>l.side===side);
    if(!levels.length){const empty=document.createElement('p');empty.className='aster-empty';empty.textContent='No orders';el.append(empty);return;}
    for(const level of levels){const row=document.createElement('div');row.className='aster-level';const price=document.createElement('strong');price.textContent=(level.price4/10000).toFixed(2)+' · '+level.shares+' shares';row.append(price);const queue=document.createElement('div');queue.className='aster-fifo';for(const o of level.fifo){const order=document.createElement('span');order.textContent=(aliases[o.id]||o.id)+' / '+o.shares;order.title='Order reference '+o.id;queue.append(order);}row.append(queue);el.append(row);}
  }
  try{worker=new Worker(new URL('./aster/replay-worker.js',import.meta.url),{type:'module'});}catch{fail();return {next(){},destroy(){destroyed=true;}};}
  worker.onerror=fail;
  watchdog=setTimeout(fail,20000);
  worker.onmessage=({data})=>{
    if(destroyed||data.id!==request)return;
    if(data.error){fail();return;}
    clearTimeout(watchdog);last=data;total=data.state.total;
    q('#aster-engine-state').textContent='C++20 / WASM · SYNTHETIC ITCH';
    q('#aster-timeline').disabled=false;q('#aster-play').disabled=false;q('#aster-verify').disabled=false;
    q('#aster-timeline').value=String(step);q('#aster-position').textContent=step+' / '+total;
    q('#aster-event').textContent=data.labels[step];
    q('#aster-hash').textContent='C++: '+data.state.hash+'\nPython: '+data.expected;
    renderSide('B','#aster-bids',data.aliases);renderSide('S','#aster-asks',data.aliases);
    setMain(step===total?'REPLAY':'NEXT EVENT');onStep(step,total);
    if(step===total){stop();q('#aster-receipt').textContent='Replay complete. Verify the final state, or scrub back to inspect a change.';}
    else if(playing)timer=setTimeout(()=>seek(step+1),1300);
  };
  q('#aster-timeline').oninput=e=>{stop();seek(Number(e.target.value));};
  q('#aster-play').onclick=()=>{if(playing){stop();return;}playing=true;q('#aster-play').textContent='Ⅱ Pause';seek(step===total?0:step+1);};
  q('#aster-verify').onclick=()=>{if(!last)return;const result=q('#aster-receipt');result.textContent=last.matches?'✓ MATCH · Full state and FIFO hash agree at event '+step+'.':'Mismatch · This checkpoint differs from the Python reference.';result.dataset.result=last.matches?'pass':'fail';if(last.matches&&step===total){q('#aster-verify').textContent='Verified ✓';document.dispatchEvent(new CustomEvent('portfolio-context',{detail:{type:'demo-complete',id:'aster'}}));document.dispatchEvent(new CustomEvent('portfolio-discovery',{detail:{kind:'project',id:'aster'}}));}};
  const visibility=()=>{if(document.hidden)stop();};document.addEventListener('visibilitychange',visibility);document.addEventListener('portfolio-reading-open',stop);
  seek(0);
  return {pause:stop,next(){stop();seek(step===total?0:Math.min(total,step+1));},destroy(){destroyed=true;clearTimeout(watchdog);clearTimeout(timer);worker.terminate();document.removeEventListener('visibilitychange',visibility);document.removeEventListener('portfolio-reading-open',stop);}};
}
