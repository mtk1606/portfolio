import assert from 'node:assert/strict';
import {updateRivalry,cleanRivalry,recordPokerChoice,pokerRunScore,CHALLENGE_MARKS} from '../public/rivalry-core.js';
assert.equal(Object.keys(CHALLENGE_MARKS).length,10);
let run=recordPokerChoice({},'hand',false);run=recordPokerChoice(run,'hand',true);assert.deepEqual(pokerRunScore(run,['hand']),{answered:1,wins:0});
let r=updateRivalry({},'poker',8);assert.equal(r.beaten,false);r=updateRivalry(r.marks,'poker',9);assert.equal(r.beaten,true);assert.equal(updateRivalry(r.marks,'poker',4).marks.poker.best,9);
r=updateRivalry({},'word',3);assert.equal(r.beaten,false);r=updateRivalry(r.marks,'word',2);assert.equal(r.beaten,true);assert.equal(updateRivalry(r.marks,'word',5).marks.word.best,2);
for(const v of [NaN,Infinity,-1,11])assert.equal(updateRivalry({},'poker',v).accepted,false);
assert.equal(updateRivalry({},'unknown',1).accepted,false);assert.deepEqual(cleanRivalry({poker:{best:100},word:{best:2}}),{word:{best:2}});
console.log('Challenge scoring: first answers, strict targets, best scores and invalid values passed.');
