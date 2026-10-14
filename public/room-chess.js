import {Chess} from './vendor/chess.mjs';
import {puzzleData} from './puzzles-data.js';
export const uciMove=u=>({from:u.slice(0,2),to:u.slice(2,4),...(u[4]?{promotion:u[4]}:{})});
export class RoomChess {
 constructor(){this.load(0)}
 load(index){this.index=(index+puzzleData.length)%puzzleData.length;this.puzzle=puzzleData[this.index];this.chess=new Chess(this.puzzle.fen);this.ply=0;this.selected=null;this.help=false;this.complete=false;this.history=[];return this}
 get waiting(){return !this.complete&&this.chess.turn()!==this.puzzle.solver}
 get pieces(){return this.chess.board().flat().filter(Boolean)}
 select(square,promotion){if(this.complete||this.waiting)return {kind:'blocked'};const piece=this.chess.get(square);if(piece?.color===this.puzzle.solver){this.selected=square;return {kind:'selected'}}if(!this.selected)return {kind:'empty'};const legal=this.chess.moves({square:this.selected,verbose:true}).filter(m=>m.to===square);if(!legal.length){this.selected=null;return {kind:'illegal'}}if(legal.some(m=>m.promotion)&&!promotion)return {kind:'promotion',to:square};const u=this.selected+square+(promotion||'');if(u!==this.puzzle.moves[this.ply]){this.selected=null;return {kind:'incorrect'}}this.apply(u);return {kind:this.complete?'complete':'correct'}}
 apply(u){const move=this.chess.move(uciMove(u));this.history.push(move.san);this.ply++;this.selected=null;this.complete=this.ply===this.puzzle.moves.length}
 reply(){if(!this.waiting)return false;this.apply(this.puzzle.moves[this.ply]);return true}
 hint(){if(this.complete||this.waiting)return '';this.help=true;this.selected=this.puzzle.moves[this.ply].slice(0,2);return this.puzzle.explanation}
 reveal(){this.help=true;while(!this.complete)this.apply(this.puzzle.moves[this.ply]);return this}
}
