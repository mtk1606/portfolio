// Only visitor preferences and local progress. Playback is never persisted.
const KEY='mk-visitor-memory-v1';
export function readMemory(){try{const x=JSON.parse(localStorage.getItem(KEY)||'{}');return x&&typeof x==='object'&&!Array.isArray(x)?x:{}}catch{return {}}}
export function remember(key,value){try{localStorage.setItem(KEY,JSON.stringify({...readMemory(),[key]:value}));return true}catch{return false}}
export function preference(key,fallback,allowed){const v=readMemory()[key];return allowed.includes(v)?v:fallback}
export function recordSolve(id,date=new Date()){const old=readMemory().solved||{},solved=typeof old==='object'&&!Array.isArray(old)?old:{};if(!solved[id])solved[id]=date.toISOString();remember('solved',solved);return solved[id]}
export function playlistURL(value){try{const u=new URL(value);return u.protocol==='https:'&&['open.spotify.com','music.apple.com','www.youtube.com','youtube.com','music.youtube.com','soundcloud.com','bandcamp.com'].some(h=>u.hostname===h||u.hostname.endsWith('.'+h))?u.href:null}catch{return null}}

export function forgetMemory(){try{localStorage.removeItem(KEY);localStorage.removeItem('mk-afterhours-darts-v1');return true}catch{return false}}
