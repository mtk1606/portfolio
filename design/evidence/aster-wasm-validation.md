# ASTER bounded browser replay — October 31, 2026

Delivered scope: actual portable C++ framing, decoder and FIFO Book compiled to
Wasm. Pinned upstream, compatibility change, build flags and disclosure limits
are recorded in engine/aster/README.md. No upstream repository was modified.

Automated evidence:
- Native g++ C++20 output matched all 13 independent Python states and hashes.
- Emscripten 3.1.6 / Clang 15 / Binaryen 108 built the same adapter.
- tests/aster-wasm.mjs passed 39 checkpoint comparisons across forward/reverse
  seeks and resets, large references, FIFO replacement, invalid framing, type,
  side, duplicate reference, excess cancellation and recovery after rejection.
- Fixture SHA-256 is checked before worker initialization; full snapshots and
  fingerprints are compared at each UI checkpoint. Python runs at build time.
- Uncompressed generated JS + Wasm: 233,942 bytes, requested only on coin insert.

UX: physical next/reset buttons retained. The phosphor display holds the bid/ask
queues, keyboard-operable timeline, optional playback and explicit Verify action.
Autoplay starts only on request; pause on tab hiding and worker termination on
reset/cartridge change. QSE remains a separate synthetic explanation.

Preview CLI unavailable: it detected another development server owned by the
preview infrastructure; status then returned stopped. No working source was
altered to bypass preview. Production browser QA follows publication.

Compiler setup: standard apt install was rejected because it would upgrade core
system libraries. Instead, official Ubuntu compiler packages were downloaded and
extracted under /tmp, with no system installation or library upgrades. The
isolated build succeeded; it is not a deployment dependency.

Deferred: real-feed browser replay, general performance claims, interactive
research plot and dedicated mobile review. Black-hole code and assets unchanged.

First live QA: actual worker/Wasm loaded, empty and final checkpoints verified;
keyboard Home/End/ArrowRight scrubbing worked; autoplay/pause and cartridge switch
returned to correct attract states. Visual QA exposed inherited fixed-height flex
layout clipping the new screen; a scoped content-sized replay layout replaces it.
Final visual check follows the corrected publication.
