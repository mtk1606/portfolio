export const AUDIO_DEFAULTS={objects:false,ambience:false,captions:true,volume:.55};
export function cleanAudio(raw){const v=raw&&typeof raw==='object'?raw:{};return {objects:v.objects===true,ambience:v.ambience===true,captions:v.captions!==false,volume:Number.isFinite(v.volume)?Math.max(0,Math.min(1,v.volume)):.55};}
export function cleanVisit(raw){const v=raw&&typeof raw==='object'?raw:{};return {invited:v.invited===true,step:Number.isInteger(v.step)?Math.max(0,Math.min(5,v.step)):0,complete:v.complete===true,discoveries:Array.isArray(v.discoveries)?[...new Set(v.discoveries.filter(x=>typeof x==='string'&&/^(project|research)-(aster|qse|memory|audit|kyle)$/.test(x)))]:[]};}
export function recordDiscovery(visit,kind,id){const key=kind+'-'+id,next=cleanVisit(visit);if(!/^(project|research)-(aster|qse|memory|audit|kyle)$/.test(key))return next;if(!next.discoveries.includes(key))next.discoveries.push(key);return next;}
export const GUIDE_STEPS=[
 {target:'#highlights',title:'Pick something up.',text:'Turn the dial to bring a cartridge, notebook or newspaper into view. Each object is a way into the work. You can leave this guide at any time.'},
 {target:'#work',title:'Keep the inconvenient result.',text:'Each notebook follows a real research question. The paper tabs separate what was expected, what was observed and what changed the interpretation. Start with a finding, then look behind it.'},
 {target:'#projects',title:'Inside the machine.',text:'Choose ASTER or QSE on the cartridge shelf. The red button starts a short explanation of the mechanics. Lift the service ticket for the actual engineering record and its limitations.'},
 {target:'#experience',title:'The professional record.',text:'The newspaper editions collect work at BMO, AstraSage and NTT. Switch editions to explore the roles. Career facts and illustrative stories are labelled separately.'},
 {target:'#after-hours',title:'The study is still lit.',text:'The window opens a room for an unhurried break: a notebook, chess table and computer games. Enter whenever you like, or keep exploring the portfolio.'},
 {target:'#contact',title:'The rest is yours.',text:'That is the short route through the universe. Revisit any object, read the full research, or get in touch. Your guide position and discoveries stay on this browser.'}
];
