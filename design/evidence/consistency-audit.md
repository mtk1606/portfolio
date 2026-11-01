# Simplification and consistency audit — October 31, 2026

Scope: desktop reading route, optional guidance, cartridge state, wording and
screen containment. Dedicated mobile pass and black-hole visuals excluded.

Findings and fixes:
1. Automatic first-visit guide invitation could interrupt the radio's short route.
   Enter now exposes the Guide button without opening an invitation. The footer
   update slip also stays hidden until What's New is explicitly requested. Guide
   and update controls remain available; no new overlay or preference was added.
2. QSE exercise/completion inherited the older portal's centered fixed-height
   flex screen. Scoped content-sized layout keeps queues, choices and finish
   actions in normal flow, matching the correction already applied to ASTER.
3. ASTER's old five-event JS illustration was unreachable but still retained in
   the cartridge controller. Removed its renderer, stage arrays, prediction state
   and advancement branch. Only the real Wasm module owns ASTER playback now.
4. ASTER's service ticket and guide completion still used illustration wording.
   Corrected the boundary and final fixture-verification context. Project shortcut
   now says 'Try the selected cartridge', since QSE can be selected too.
5. Opening ASTER's engineering record while replaying left playback running behind
   the dialog. Expose pause on the controller and invoke it before showing the
   record. Successful final-state verification now records the existing discovery
   marker; merely reaching the end does not earn it. Seek clears the verified label.
6. Update slip's machine-readable date lagged its visible date. Aligned both.

Validation before publication: JS syntax checks; exploration-quality, quick-route,
research-search, research-leaves and aster-wasm tests pass. Production build and
live UI review follow. Existing preview infrastructure is unavailable; no bypass
or alternate browser automation used. No GitHub push, new media or network data.

Live QA: QSE reached the correct twenty-share finish state; its screen had equal
client/scroll heights with scrollTop zero. ASTER final verification recorded the
existing discovery; subsequent seek cleared the verified label. Opening its
record paused playback, and closing returned focus. Guide opened manually with
the corrected fixture scope. Final naming correction: ASTER cartridge completion
reads REPLAY VERIFIED, while QSE retains DEMO SOLVED.
