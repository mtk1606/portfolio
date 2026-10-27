import {env} from 'cloudflare:workers';

const key='after-hours-feature.mp4';
const json=(value:unknown,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store'}});
const videoHeaders=(size:number,etag?:string)=>({
 'Accept-Ranges':'bytes',
 'Cache-Control':'public, max-age=3600',
 'Content-Disposition':'inline; filename="after-hours-feature.mp4"',
 'Content-Length':String(size),
 'Content-Type':'video/mp4',
 ...(etag?{'ETag':etag}:{})
});

function parseRange(value:string,size:number){
 const match=/^bytes=(\d*)-(\d*)$/.exec(value.trim());
 if(!match||(!match[1]&&!match[2]))return null;
 let start:number,end:number;
 if(!match[1]){const suffix=Number(match[2]);if(!suffix)return null;start=Math.max(0,size-suffix);end=size-1}
 else{start=Number(match[1]);end=match[2]?Number(match[2]):size-1}
 if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>=size||end<start)return null;
 return {start,end:Math.min(end,size-1)};
}

export async function HEAD(){
 if(!env.BUCKET)return json({error:'Video storage is not configured.'},503);
 const object=await env.BUCKET.head(key);
 if(!object)return json({error:'No feature is available yet.'},404);
 return new Response(null,{headers:videoHeaders(object.size,object.httpEtag)});
}

export async function GET(request:Request){
 if(!env.BUCKET)return json({error:'Video storage is not configured.'},503);
 const head=await env.BUCKET.head(key);
 if(!head)return json({error:'No feature is available yet.'},404);
 const rawRange=request.headers.get('range');
 const range=rawRange?parseRange(rawRange,head.size):null;
 if(rawRange&&!range)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${head.size}`,'Accept-Ranges':'bytes'}});
 const object=await env.BUCKET.get(key,range?{range:{offset:range.start,length:range.end-range.start+1}}:undefined);
 if(!object)return json({error:'No feature is available yet.'},404);
 const size=range?range.end-range.start+1:object.size;
 const headers=videoHeaders(size,object.httpEtag);
 if(range)headers['Content-Range' as keyof typeof headers]=`bytes ${range.start}-${range.end}/${head.size}`;
 return new Response(object.body,{status:range?206:200,headers});
}

