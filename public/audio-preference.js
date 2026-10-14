// Enabled by default; AudioContext creation waits for browser user activation.
export function installAudioPreference({buttons,paint,apply}){
 let enabled=true,unlocked=false;
 try{enabled=localStorage.getItem('mk-audio-enabled')!=='false'}catch{}
 function render(){for(const b of buttons){b.setAttribute('aria-pressed',String(enabled));b.title=enabled?'Mute all sound':'Enable sound'}paint(enabled,!unlocked)}
 function set(value){enabled=value;try{localStorage.setItem('mk-audio-enabled',String(value))}catch{}render();apply(enabled)}
 function gesture(e){if(!e.isTrusted||e.type==='keydown'&&(e.repeat||['Shift','Control','Alt','Meta','Tab','Escape'].includes(e.key)))return;
 const control=buttons.find(b=>b===e.target||b.contains(e.target));
 if(control){if(e.type==='keydown'&&!['Enter',' '].includes(e.key))return;e.preventDefault();e.stopImmediatePropagation();unlocked=true;set(!enabled);return}
 if(!unlocked){unlocked=true;render();if(enabled)apply(true)}
 }
 document.addEventListener('click',gesture,true);document.addEventListener('keydown',gesture,true);
 // Pointer drag is also a meaningful first interaction in the 3D scenes.
 document.addEventListener('pointerdown',e=>{if(e.isTrusted&&!e.target.closest('button,a,input,select,summary')&&!unlocked){unlocked=true;render();if(enabled)apply(true)}},true);
 addEventListener('pagehide',()=>{unlocked=false;apply(false)});
 addEventListener('pageshow',()=>render());
 render();return {set,get enabled(){return enabled}};
}
