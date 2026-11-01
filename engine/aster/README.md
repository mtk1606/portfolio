# Bounded ASTER browser port

Portable framing, ITCH decoder and FIFO Book from Mohamed El Khoudimi's MIT-licensed
ASTER engine, pinned at `a1d84909f9b4c146b33ba58d8e09d2718ca231aa`.
Upstream: https://github.com/mtk1606/aster-market-engine

The single compatibility change in `src/book.cpp` copies a structured-binding
stock locate to an ordinary local before lambda capture (Clang 15 compatibility).
No order-book semantics were intentionally changed. `browser/adapter.cpp` is the
portfolio adapter; Linux readers, CLI, session audits and threading are excluded.
The adapter accepts at most 64 KiB and 512 messages. Every seek reconstructs a new
book from the beginning; C++ state never carries between timeline requests.

Build with Emscripten **3.1.6**, Clang **15.0.7**, Binaryen **108**, Python 3 and Node:

```sh
bash engine/aster/browser/build.sh
```

Generated JS/Wasm and the fixture receipt are committed. Regular Sites builds
need no compiler or system package installation. See the exact flags in build.sh.
The 64 MiB memory cap is a ceiling, not a claim of measured memory use.

`browser/reference.py` generates a synthetic, length-prefixed ITCH recording and
independently decodes it into a Python dictionary/list model. Its 13 receipts
contain full price levels, quantities, FIFO references and 64-bit FNV fingerprints.
Hashes are noncryptographic state fingerprints, not certificates. Fixture SHA-256
only detects accidental mismatch between the bytes and receipt.

The worker compares complete states in addition to fingerprints. Order references
and 64-bit hashes are serialized as strings; they never pass through JS Number.
The UI does not run Python live: it compares with the build-time Python receipt.
No Nasdaq recording, employer data or QSE source is included.

Verification covers this fixture only. It does not establish full-day equivalence,
exchange correctness, live queue position, profitability, or native performance.
Browser throughput is intentionally not shown for this tiny educational workload.

Tests: `node tests/aster-wasm.mjs` from repository root. Includes every checkpoint
in both directions, resets, replacement FIFO priority, >2^53 references, malformed
framing, invalid type/side, duplicate reference, excess cancellation and recovery.
