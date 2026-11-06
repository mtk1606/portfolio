// Facts are paraphrased from the linked records. Analysis and teaching models are original.
const wsop='https://www.wsop.com/news/10-chris-moneymaker/';
const recap='https://www.cardplayer.com/poker-news/4525-wsop-history-1988-recap';
export const POKER_CASES=[
 {id:'moneymaker',label:'01 / One last bluff',event:'2003 WSOP · Moneymaker vs Farha',hero:'Chris Moneymaker',villain:'Sam Farha',hole:['Ks','7h'],board:['9s','2d','6s','8s','3h'],opponent:['Qs','9h'],pot:1800000,toCall:0,
 question:'Farha checks. Your draw missed. Bet or check?',
 history:[['Before the flop','You raise to 100,000. Farha calls.'],['Flop','9♠ 2♦ 6♠ · You both check.'],['Turn','8♠ · Farha bets 300,000. You raise to 800,000; he calls.'],['River','3♥ · Farha checks. Your move.']],
 actions:[['bet','Bet'],['check','Check']],winningAction:'bet',actual:'bet',
 outcomes:{bet:'Your bluff works. Farha folds his pair of nines, and you take the pot.',check:'At showdown, Farha’s pair of nines beats your king-high. You lose the pot.'},
 actualText:'Moneymaker moved all-in. Farha folded. A famous bluff that helped change poker history.',
 note:'Pot rounded to 1.8m chips. Bet replays the historical all-in; Check uses a showdown against the recorded cards. Win/lose describes this fixed replay, not the best strategy in every similar hand.',sources:[['WSOP · the original hand',wsop]]},
 {id:'negreanu',label:'02 / A full house',event:'2006 High Stakes Poker · Negreanu vs Hansen',hero:'Daniel Negreanu',villain:'Gus Hansen',hole:['6s','6h'],board:['9c','6d','5h','5s','8s'],opponent:['5d','5c'],pot:408700,toCall:167000,
 question:'You have a full house. Hansen moves all-in. Call or fold?',
 history:[['Before the flop','Hansen raises to 2,100. You raise to 5,000; he calls.'],['Flop','9♣ 6♦ 5♥ · You bet 8,000. Hansen raises to 26,000; you call.'],['Turn','5♠ · Hansen bets 24,000. You call.'],['River','8♠ · Hansen checks. You bet 65,000; he shoves. It costs 167,000 more to call.']],
 actions:[['call','Call'],['fold','Fold']],winningAction:'fold',actual:'call',
 outcomes:{fold:'You escape. Hansen has four fives. Folding saves your last 167,000 in this decision.',call:'Hansen turns over four fives. They beat your full house. You lose the extra 167,000.'},
 actualText:'Negreanu called. Hansen showed four fives and won the 575,700 pot.',
 note:'Pot includes Hansen’s river shove. A fold is a challenge win because it avoids the losing final call; it does not win the pot. This is a hindsight replay, not a claim that a full house should always be folded.',sources:[['Card Player · the players revisit the hand','https://www.cardplayer.com/poker-news/1640563-daniel-negreanu-gus-hansen-break-down-iconic-high-stakes-poker-hand']]},
 {id:'chan',label:'03 / The final call',event:'1988 WSOP · Chan vs Seidel',hero:'Johnny Chan',villain:'Erik Seidel',hole:['Jc','9c'],board:['Qs','Th','8d','2s','6d'],opponent:['Qc','7h'],pot:null,toCall:null,
 question:'You have a straight. Seidel moves all-in. Call or fold?',
 history:[['Before the flop','You limp. Seidel checks.'],['Flop','Q♠ T♥ 8♦ · You bet 40,000. Seidel raises 50,000 more; you call.'],['Turn','2♠ · Both players check.'],['River','6♦ · Seidel moves all-in. Your move.']],
 actions:[['call','Call'],['fold','Fold']],winningAction:'call',actual:'call',
 outcomes:{call:'Your straight beats Seidel’s pair of queens. You win the hand.',fold:'You fold the winning straight and give Seidel the pot.'},
 actualText:'Chan called, showed his straight and won his second consecutive Main Event title.',
 note:'Historical cards and action. Exact final pot and shove amounts are not supplied by this source, so they are not invented. Your straight is the highest possible hand on this board.',sources:[['Card Player · the 1988 final hand',recap]]}
];
export function pokerOutcome(hand,action){if(!hand.actions.some(([id])=>id===action))throw new RangeError('Choose one of the two available moves.');return {win:action===hand.winningAction,text:hand.outcomes[action]};}
export const RETURN_SOURCE='https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histretSP.html';
export const ASSETS=[{key:'stocks',name:'US equities',detail:'S&P 500 · dividends included'},{key:'bonds',name:'US Treasuries',detail:'10-year bond · price + coupon'},{key:'gold',name:'Gold',detail:'Annual nominal USD return'},{key:'bills',name:'Treasury bills',detail:'3-month bills · average annual rate proxy'}];
// All clues are available at the start of the target year. Returns are full-calendar-year data.
export const YEAR_CASES=[
 {id:'envelope-a',label:'Envelope A',year:2000,clues:['US equities gained 20.89% in the year just finished. Enthusiasm is easy to find.','Ten-year Treasury bonds lost 8.25% last year. Their price can fall even when the borrower is a government.','Last year’s bill-rate proxy was 4.78%; gold gained 0.85%. You have no preview of the coming year.'],returns:{stocks:-9.03,bonds:16.66,gold:-5.44,bills:6.00},lesson:'Recent winners did not keep winning. Longer-duration Treasuries gained while stocks fell. Last year’s return was a clue about the past, not a promise.'},
 {id:'envelope-b',label:'Envelope B',year:2008,clues:['US equities gained 5.48% in the year just finished. A positive index return does not describe every corner of the market.','US real estate in this dataset fell 5.40% last year; gold rose 31.92%. The assets are telling different stories.','Ten-year Treasuries returned 10.21% last year; the bill-rate proxy was 4.48%. Decide before the new year unfolds.'],returns:{stocks:-36.55,bonds:20.10,gold:4.32,bills:1.40},lesson:'Diversification helped in this crisis, but the strongest portfolio is obvious only after the year is revealed. A one-year result cannot validate a permanent allocation rule.'},
 {id:'envelope-c',label:'Envelope C',year:2022,clues:['US equities gained 28.47% in the year just finished. A strong recent record can make risk feel distant.','Ten-year Treasury bonds lost 4.42% last year. Government credit quality does not remove interest-rate risk.','The bill-rate proxy was 0.04% last year; gold fell 3.75%. Build a portfolio without knowing the next twelve months.'],returns:{stocks:-18.04,bonds:-17.83,gold:.55,bills:2.09},lesson:'Stocks and longer-duration Treasuries both fell. Diversification is not a guarantee that one asset rises whenever another falls; the source of the shock matters.'}
];
export const INITIAL_WEIGHTS={stocks:25,bonds:25,gold:25,bills:25};
export function portfolioResult(weights,returns,capital=10000){
 const values=ASSETS.map(a=>weights[a.key]);if(values.some(v=>!Number.isFinite(v)||v<0||v>100)||Math.abs(values.reduce((a,b)=>a+b,0)-100)>1e-8)throw new RangeError('Allocate exactly 100% with no borrowing.');
 const contributions=ASSETS.map(a=>({key:a.key,start:capital*weights[a.key]/100,end:capital*weights[a.key]/100*(1+returns[a.key]/100)}));const end=contributions.reduce((n,a)=>n+a.end,0);return {end,gain:end-capital,percent:(end/capital-1)*100,contributions};
}
export function gridComparison(weights,returns){const result=portfolioResult(weights,returns).end;let total=0,below=0;for(let a=0;a<=10;a++)for(let b=0;b<=10-a;b++)for(let c=0;c<=10-a-b;c++){const value=portfolioResult({stocks:a*10,bonds:b*10,gold:c*10,bills:(10-a-b-c)*10},returns).end;total++;if(value<=result+1e-8)below++;}return {below,total};}
export function callThreshold(potIncludingBet,call){return call/(potIncludingBet+call);}
export function foldThreshold(pot,risk){return risk/(pot+risk);}
export function callEV(potIncludingBet,call,winProbability){return winProbability*potIncludingBet-(1-winProbability)*call;}
export function bluffEV(pot,risk,foldProbability){return foldProbability*pot-(1-foldProbability)*risk;}
