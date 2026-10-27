import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

let stored=null;
const bucket={
 async head(){return stored?{size:stored.length,httpEtag:'test-etag'}:null},
 async get(_key,options){
  if(!stored)return null;
  const offset=options?.range?.offset||0,length=options?.range?.length??stored.length;
  const bytes=stored.subarray(offset,offset+length);
  return {size:bytes.length,httpEtag:'test-etag',body:new Response(bytes).body};
 }
};
globalThis.testEnv={BUCKET:bucket};
let source=fs.readFileSync('app/api/video/route.ts','utf8').replace("import {env} from 'cloudflare:workers';",'const env=globalThis.testEnv;');
source=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {GET,HEAD}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
assert.equal((await GET(new Request('https://example.test/api/video'))).status,404);
assert.equal((await HEAD()).status,404);
const clip=Buffer.from('0123456789abcdefghijklmnopqrstuvwxyz');
stored=clip;
const full=await GET(new Request('https://example.test/api/video'));
assert.equal(full.status,200);assert.equal(full.headers.get('content-type'),'video/mp4');
assert.equal(full.headers.get('accept-ranges'),'bytes');
assert.equal(full.headers.get('content-length'),String(clip.length));
assert.deepEqual(Buffer.from(await full.arrayBuffer()),clip);
const partial=await GET(new Request('https://example.test/api/video',{headers:{Range:'bytes=5-11'}}));
assert.equal(partial.status,206);assert.equal(partial.headers.get('content-range'),`bytes 5-11/${clip.length}`);
assert.deepEqual(Buffer.from(await partial.arrayBuffer()),clip.subarray(5,12));
const suffix=await GET(new Request('https://example.test/api/video',{headers:{Range:'bytes=-4'}}));
assert.equal(suffix.status,206);assert.deepEqual(Buffer.from(await suffix.arrayBuffer()),clip.subarray(-4));
assert.equal((await GET(new Request('https://example.test/api/video',{headers:{Range:'bytes=999-1000'}}))).status,416);
assert.equal((await HEAD()).headers.get('content-length'),String(clip.length));
console.log('TV video storage: missing asset response, HEAD, full stream, byte and suffix ranges, and invalid-range response pass.');
