import assert from 'node:assert/strict';
import {wordMarks,sudokuConflicts,PUZZLE,SOLUTION,rackAllows,poolStep} from '../public/games-core.js';
assert.deepEqual(wordMarks('EERIE','CRANE'),['absent','absent','present','absent','exact']);
assert.equal(sudokuConflicts(SOLUTION.split('')).size,0);assert.equal(sudokuConflicts(PUZZLE.split('').map(x=>x==='0'?'':x)).size,0);assert.ok(sudokuConflicts(Array(81).fill('1')).size>0);
assert.equal(rackAllows('RETAINS','RETAINS'),true);assert.equal(rackAllows('TEETH','RETAINS'),false);
let balls=[{x:300,y:200,vx:100,vy:0},{x:321,y:200,vx:0,vy:0}];poolStep(balls,.001);assert.ok(balls[1].vx>90);assert.ok(Math.abs(balls[0].vx)<1);
balls=[{x:38,y:38,vx:0,vy:0}];poolStep(balls,.01);assert.equal(balls[0].sunk,true);
balls=[{x:700,y:200,vx:100,vy:0}];poolStep(balls,.2);assert.ok(balls[0].vx<0);assert.ok(balls[0].x<=709);
console.log('notebook rules, Sudoku constraints, pool collision/pocket/cushion passed');
