import assert from 'node:assert/strict';
import fs from 'node:fs';
import {ASTER_BENCHMARK,asterEvidence} from '../public/engineering-evidence.js';
assert.equal(ASTER_BENCHMARK.rows.length,4);assert.equal(ASTER_BENCHMARK.frames,368366634);assert.equal(ASTER_BENCHMARK.repetitions,3);assert.equal(ASTER_BENCHMARK.warmups,0);assert.equal(ASTER_BENCHMARK.code,'v0.8.3');assert.equal(ASTER_BENCHMARK.rows[2].rate,1.341);assert.equal(ASTER_BENCHMARK.rows[2].rss,243);assert.ok((ASTER_BENCHMARK.rows[3].rate/ASTER_BENCHMARK.rows[2].rate-1)<.011);
const record=asterEvidence();assert.match(record,/file-backed|File-backed/);assert.match(record,/not.*p99/);assert.match(record,/not.*independent all-stock/);
for(const file of ['app.js','exhibit.js','exploration-quality.js','retro-sectors.js','resume.html']){const text=fs.readFileSync('public/'+file,'utf8');assert.ok(!/302 C\+\+|258 Python|>302<|>258</.test(text),file+' does not disclose QSE counts');assert.match(text,/Marcus Myrick/,file+' preserves collaboration credit');}
const resume=fs.readFileSync('public/resume.html','utf8');assert.match(resume,/conferred 2024/);assert.match(resume,/28 to 15/);assert.match(resume,/estimated 900/);assert.equal(Math.round((28-15)/28*100),46);
console.log('Career evidence: QSE attribution/disclosure, conferred degree, measured versus estimated outcomes and ASTER benchmark boundaries pass.');
