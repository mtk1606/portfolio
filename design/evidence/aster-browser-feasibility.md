# Initial feasibility review (superseded by the bounded prototype)

The review below records the earlier state. The C++/Wasm fixture replay is now implemented; see `engine/aster/README.md` and `design/evidence/aster-wasm-validation.md` for the delivered scope. Full-feed browser replay remains outside it.

# ASTER browser replay: feasibility review, not a completed feature

The current cabinet remains a synthetic browser illustration. No Wasm artifact or live C++ claim is published in this pass.

Source inspection: Book and ITCH core use ordinary C++20 containers/integer fields. A bounded, single-threaded browser adapter is plausible. The existing CMake target also compiles Linux file-mapping code (mmap, madvise, file descriptors); do not compile the Linux CLI unchanged and describe it as a browser port.

Next prototype should compile only the decoder/book plus a small browser adapter. Use a Web Worker and a small generated BinaryFILE fixture initially. This repository's public source does not bundle Nasdaq recordings; no feed-byte redistribution right was established here.

The Book API exposes apply, levels, validate and deterministic digest. Expose reset, bounded replay-to-index, snapshot and validation via the adapter. Preserve 64-bit references and digests as strings/BigInt, never lossy JavaScript Number conversions. Scrubbing should initially reset and replay the bounded fixture; add snapshots only if needed.

The Python reference must independently generate the golden state and FIFO-sensitive digest from the same fixture. A matching digest demonstrates agreement on that fixture, not full-engine correctness. Add deliberately corrupted/truncated frames, cancellation/replacement cases, reader/model equivalence and repeated reset tests before publishing.

Environment check: native g++ exists, but Emscripten/em++ and CMake were not available. No browser binary was compiled or benchmarked. This is a source-level feasibility assessment; compilation and real-browser validation remain next.

Gate for integration: reproducible pinned build, separate Python fixture receipt, passing core checks, correct cancellation/reset behavior, accessible controls, lazy worker loading and a separate browser-throughput methodology. Never reuse native trial numbers as browser measurements, or publish a vendor-certified verification claim.
