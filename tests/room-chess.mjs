import assert from 'node:assert/strict';
import {RoomChess} from '../public/room-chess.js';
import {puzzleData} from '../public/puzzles-data.js';
for(let i=0;i<puzzleData.length;i++){
 const state=new RoomChess().load(i),p=state.puzzle;let own=0,replies=0;
 while(!state.complete){if(state.waiting){assert.ok(state.reply());replies++;continue}const u=p.moves[state.ply];assert.equal(state.select(u.slice(0,2)).kind,'selected');const answer=state.select(u.slice(2,4),u[4]);assert.ok(['correct','complete'].includes(answer.kind));own++}
 assert.equal(state.history.length,p.moves.length);assert.equal(state.help,false);assert.ok(own>=2);assert.ok(replies>=1);assert.equal(state.select('a1').kind,'blocked');
 state.load(i);state.hint();assert.ok(state.help);state.reveal();assert.ok(state.complete);assert.deepEqual(state.history,p.san);state.load(i);assert.equal(state.help,false);
}
const state=new RoomChess(),fen=state.chess.fen();const wrong=state.chess.moves({verbose:true}).find(m=>m.from+m.to+(m.promotion||'')!==state.puzzle.moves[0]);state.select(wrong.from);assert.equal(state.select(wrong.to,wrong.promotion).kind,'incorrect');assert.equal(state.chess.fen(),fen);state.select('h4');assert.equal(state.select('h1').kind,'illegal');assert.equal(state.chess.fen(),fen);console.log('All 10 table puzzles: complete lines, automatic replies, reset/help, wrong and illegal moves verified.');
