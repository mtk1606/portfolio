'use strict';
// A deliberately bounded rules engine for composed, pawn-free mate-in-one studies.
// These positions have no castling, en-passant, or promotion rights.
const Chess=(()=>{
const side=p=>p===p.toUpperCase()?'w':'b',other=s=>s==='w'?'b':'w';
const rays={R:[[1,0],[-1,0],[0,1],[0,-1]],B:[[1,1],[1,-1],[-1,1],[-1,-1]],Q:[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]};
function parse(fen){const a=[];for(const c of fen.split(' ')[0]){if(c==='/')continue;if(/\d/.test(c))a.push(...Array(Number(c)).fill(null));else a.push(c)}return a}
function pseudo(b,from,attacks=false){const p=b[from];if(!p)return[];const s=side(p),t=p.toUpperCase(),r=from>>3,c=from%8,out=[];
function add(y,x){if(y<0||y>7||x<0||x>7)return false;const n=y*8+x;if(!b[n]){out.push(n);return true}if(side(b[n])!==s&&(attacks||b[n].toUpperCase()!=='K'))out.push(n);return false}
if(t==='K'){for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(dy||dx)add(r+dy,c+dx)}
else if(t==='N'){for(const [dy,dx]of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]])add(r+dy,c+dx)}
else if(rays[t])for(const [dy,dx]of rays[t])for(let k=1;k<8;k++)if(!add(r+dy*k,c+dx*k))break;
return out}
function attacked(b,square,by){return b.some((p,i)=>p&&side(p)===by&&pseudo(b,i,true).includes(square))}
function inCheck(b,s){const k=b.indexOf(s==='w'?'K':'k');return k<0||attacked(b,k,other(s))}
function apply(b,from,to){const n=b.slice();n[to]=n[from];n[from]=null;return n}
function legal(b,s){const out=[];b.forEach((p,i)=>{if(p&&side(p)===s)for(const j of pseudo(b,i)){if(!inCheck(apply(b,i,j),s))out.push([i,j])}});return out}
const mate=(b,s)=>inCheck(b,s)&&legal(b,s).length===0;
const solutions=b=>legal(b,'w').filter(([f,t])=>mate(apply(b,f,t),'b'));
function fen(b){const rows=[];for(let r=0;r<8;r++){let s='',empty=0;for(let c=0;c<8;c++){let p=b[r*8+c];if(p){if(empty)s+=empty;empty=0;s+=p}else empty++}if(empty)s+=empty;rows.push(s)}return rows.join('/')+' w - - 0 1'}
return {side,parse,pseudo,attacked,inCheck,apply,legal,mate,solutions,fen};})();
if(typeof module!=='undefined')module.exports=Chess;
