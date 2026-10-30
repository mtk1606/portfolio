import assert from 'node:assert/strict';
import {CAPTIONS,captionAt} from '../public/voice-captions.js';
assert.equal(Object.keys(CAPTIONS).length,8);
for(const [key,cues] of Object.entries(CAPTIONS)){
 assert.ok(cues.length>1,key+' has sentence cues');let end=0;
 for(const cue of cues){assert.ok(Number.isFinite(cue.start)&&cue.start>=end,key+' ordered cues');assert.ok(cue.end>cue.start);assert.ok(cue.text.length>0&&cue.text.split(/\s+/).length<=18);assert.equal(captionAt(cues,(cue.start+cue.end)/2),cue.text);end=cue.end;}
 assert.equal(captionAt(cues,end+.1),'');assert.equal(captionAt(cues,-1),'');
}
assert.equal(captionAt([],1),'');
console.log('All eight recordings have ordered sentence cues; boundaries, silence and completion clear captions.');
