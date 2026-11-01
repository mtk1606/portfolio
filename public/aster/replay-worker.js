import createEngine from './engine.js';
let engine, fixture, receipt;
async function initialize(){
  const [wasm,bytes,reference]=await Promise.all([
    fetch(new URL('./engine.wasm',import.meta.url)).then(ok),
    fetch(new URL('./fixture.bin',import.meta.url)).then(ok),
    fetch(new URL('./reference.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('reference');return r.json();})
  ]);
  fixture=new Uint8Array(bytes); receipt=reference;
  const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',fixture)),x=>x.toString(16).padStart(2,'0')).join('');
  if(digest!==receipt.sha256)throw Error('fixture checksum');
  engine=await createEngine({wasmBinary:wasm});
}
async function ok(r){if(!r.ok)throw Error('asset');return r.arrayBuffer();}
const ready=initialize();
self.onmessage=async ({data})=>{
  try{
    await ready;
    const step=data.step;
    if(!Number.isInteger(step)||step<0||step>=receipt.states.length)throw Error('timeline');
    const ptr=engine._malloc(fixture.length);
    let state;
    try{
      engine.HEAPU8.set(fixture,ptr);
      state=JSON.parse(engine.UTF8ToString(engine._replay(ptr,fixture.length,step)));
    }finally{engine._free(ptr);}
    if(state.error)throw Error('core rejection');
    const golden=receipt.states[step];
    const matches=state.hash===golden.hash&&state.orders===golden.orders&&JSON.stringify(state.levels)===JSON.stringify(golden.levels);
    self.postMessage({id:data.id,state,expected:golden.hash,matches,labels:receipt.labels,aliases:receipt.aliases});
  }catch{self.postMessage({id:data.id,error:'The replay could not be verified. Reload the cartridge to try again.'});}
};
