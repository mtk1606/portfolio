import assert from 'node:assert/strict';
import fs from 'node:fs';

const root = fs.readFileSync('portfolio.html', 'utf8');
const room = fs.readFileSync('public/after-hours.html', 'utf8');
const publicPages = fs.readdirSync('public').filter(name => name.endsWith('.html')).sort();

assert.deepEqual(publicPages, ['after-hours.html', 'resume.html']);
assert.match(root, /href="\/after-hours\.html"|href="#after-hours"/);
assert.doesNotMatch(root, /quick-game|chess-dialog|probability-dialog|notes-dialog/);
assert.doesNotMatch(root, /after-hours-flat|after-hours-pixel|retro-arcade/);
assert.match(room, /id="computer-panel"/);
assert.match(room, /id="chess-panel"/);
assert.match(room, /id="tv-panel"/);
assert.match(room, /room-play\.js/);
for (const removed of ['after-hours-flat.html', 'after-hours-pixel.html', 'after-hours.js', 'retro-arcade.js', 'room-embed.js']) {
  assert.equal(fs.existsSync(`public/${removed}`), false, `${removed} should stay removed`);
}

console.log('Only the portfolio and résumé pages remain outside the After Hours room; the room activities remain available.');
