import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const sources=JSON.parse(await readFile(new URL('design/portfolio-style-order.json',root),'utf8'));
const chunks=await Promise.all(sources.map(async file=>'/* '+file+' */\n'+await readFile(new URL('public/'+file,root),'utf8')));
await writeFile(new URL('public/portfolio.css',root),chunks.join('\n'));
