export const CHALLENGE_MARKS={
 poker:{target:8,label:'8 / 10',rule:'Get 9 or 10 right. First choice per hand counts.',max:10},
 year:{target:500,label:'$500 ahead',rule:'Beat equal weights by more than $500 in a sealed year.',max:10000},
 lander:{target:2400,label:'2,400 points',rule:'Finish a flight above 2,400 points.',max:100000},
 orbit:{target:3000,label:'3,000 points',rule:'Finish a run above 3,000 points.',max:1000000},
 maze:{target:1800,label:'1,800 points',rule:'Finish a run above 1,800 points.',max:1000000},
 word:{target:3,label:'3 guesses',rule:'Solve a word in one or two guesses.',lower:true,max:6},
 sudoku:{target:2,label:'Medium · no hints',rule:'Solve Hard or Expert without a hint.',max:4},
 tiles:{target:300,label:'300 points',rule:'Score above 300 on one solo board.',max:100000},
 chess:{target:3,label:'3 clean combinations',rule:'Complete four different combinations without help.',max:100},
 pool:{target:3,label:'3 clean pots in a row',rule:'Make four consecutive clean pots. A miss or scratch breaks the streak.',max:1000}
};
export function cleanRivalry(raw){const out={};if(!raw||typeof raw!=='object')return out;for(const [key,m]of Object.entries(CHALLENGE_MARKS)){const v=raw[key];if(v&&Number.isFinite(v.best)&&v.best>=0&&v.best<=m.max)out[key]={best:v.best};}return out;}
export function updateRivalry(raw,key,score){const marks=cleanRivalry(raw),m=CHALLENGE_MARKS[key];if(!m||!Number.isFinite(score)||score<0||score>m.max)return {marks,accepted:false};const old=marks[key]?.best,best=old===undefined?score:m.lower?Math.min(old,score):Math.max(old,score);marks[key]={best};return {marks,accepted:true,improved:old===undefined||best!==old,beaten:m.lower?best<m.target:best>m.target};}
export function recordPokerChoice(run,id,win){if(Object.hasOwn(run,id))return {...run};return {...run,[id]:win===true};}
export function pokerRunScore(run,ids){return {answered:ids.filter(id=>Object.hasOwn(run,id)).length,wins:ids.filter(id=>run[id]===true).length};}
