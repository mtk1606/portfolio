# The green table / first playable release

A compact oval bottle-green felt table, walnut rail, brass plaque, chair and physical cards/chips are added to the study. It is selectable in the room and through Explore the study, including the WebGL fallback. Existing games are unchanged. The table uses the existing renderer and lighting; no new continuous animation, audio, external scripts or account integration.

## Games

- Your Move: three decisions from two documented matches: Moneymaker's 2003 river bluff, Farha's decision facing that bluff, and Chan's 1988 river call against Seidel. Opponent cards stay hidden until the move and rationale are committed. Variable bluff sizing and a visitor-supplied probability feed an explicitly simplified EV calculation. Original outcome and educational interpretation are kept distinct. No alternate hand result or solver score is fabricated.
- The Sealed Year: three original envelopes using 2000, 2008 and 2022 nominal full-year return rows. Predecision clues come exclusively from the preceding year's table. Allocate fictional USD 10,000 across stocks, ten-year Treasuries, gold and bills in 5% increments; allocation must sum to 100%. Comparison includes equal weights and all 286 allocations on a 10% grid, explicitly not visitor scores. Sources and assumptions are available at reveal. Local browser progress records explored cases.

The 2003 poker amounts are marked as a rounded recreation with a 1.8m pot before a 2.8m effective shove. The 1988 pot/stack numbers are explicitly hypothetical teaching chips; historical cards/action are attributed to the 1988 recap. This avoids presenting uncertain historical stack sizes as precise facts.

## Source records

- https://www.wsop.com/news/10-chris-moneymaker/
- https://www.vegasslotsonline.com/news/2024/05/28/five-iconic-wsop-hands-4-moneymaker-vs-farha/
- https://www.cardplayer.com/poker-news/4525-wsop-history-1988-recap
- https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histretSP.html (January 2026 table)
- https://www.alldle.net/game/erstwhile (inspiration listing; original game was inaccessible to the lookup)

## Verification

- Browser: game menu, concealed poker cards, bet selection, reasoning commitment, EV/reveal, progressive year clues, locked equal-weight allocation ($10,204.75 for 2000), local progress and one return to room.
- Pure logic: unique cards, action validity, call/bluff break-even equations, all-in limiting cases, weighted returns, capital conservation, 286-portfolio grid and invalid allocations.
- Room geometry: Three.js initialization with the new table, decision camera/side-panel state, and existing room regression suite; renderer drawing is stubbed.
- Browser has no WebGL, so the room's physical table appearance is not visually verified in this environment. Both games are playable through the directory fallback.

## Simplified poker revision

Poker now offers one final action with two immediate buttons, no bet-size, rationale form, probability estimate, EV panel or solver language. Three distinct historical hands: Moneymaker–Farha (bet/check), Negreanu–Hansen (call/fold), Chan–Seidel (call/fold). All six choices have explicit fixed-replay outcomes. A saved-chip fold is labeled as avoiding a losing final call, never as winning the pot. The original play is separately reported. The 1988 exact pot is omitted instead of using invented chips. Source for 2006: https://www.cardplayer.com/poker-news/1640563-daniel-negreanu-gus-hansen-break-down-iconic-high-stakes-poker-hand . Historical allocation game unchanged.
