# Working After Hours room

Approved source retained in design/checkpoints/approved-room-v2.js and .html. Those original standalone studies also remain in the user's files.

Pre-integration live commit: 871ef82907954a0390042db8e8398a7b59a5d42a
Pre-integration live saved version: appgprj_6acacd62ab108191800dfc4bc5df9805~appgver_76251d5b7ee8819188d3263032692cb7

This change replaces /after-hours.html with the approved modeled room. Previous flat games are available at /after-hours-flat.html as a low graphics fallback. Main portfolio changes are limited to portal art and entry transition. No schema or score-data migration.

room-scene.js renders the approved room, routes ray hits, paints the CRT canvas texture and rebuilds chess pieces. room-play.js owns game lifecycle, scores, keyboard/touch controls, and screen painting. room-chess.js owns legal puzzle transitions and is separately tested. All 10 existing Lichess puzzles are retained with source links. Existing game engines and API remain unchanged.

Keyboard: nav buttons reach objects; on computer arrows/WASD/Space and P; on chess the expandable flat board contains labelled buttons; Escape returns to room. Leaving the computer pauses a run; choosing another game ends it. Blur/hidden pauses. Sound off by default; motion optional. Rendering caps DPR and frame rate, instanced skyline, static shadows updated only on board changes.

To roll back, deploy the recorded saved version through Sites or revert the integration source commit and rebuild/publish through Sites. No database rollback needed.

## Lamp, notebook, and continuous entrance refinement
Previous live integration commit: 4f681eab657779359b06beb293bcfde21225cc46 (saved version appgprj_6acacd62ab108191800dfc4bc5df9805~appgver_d08aee9fe3cc8191a97f5cf22f9f554a).
Chess now has a focused warm lamp, clearer square materials, a physical canvas-texture notebook, and a matching readable paper panel. Both paper views receive the current puzzle, hint/status, and line.
The main portal lazily embeds the actual room. An existing dialog promotes the SAME iframe into the top layer without DOM reparenting, retaining its WebGL context. Expansion and return animate that frame. History tracks /after-hours.html, back/forward returns to the portal, while direct URL visits remain standalone. Offscreen embedded rendering pauses. Reduced motion skips expansion. Failure or early click falls back to ordinary room navigation.

## Scroll performance repair
Preview startup waits for 650 ms without scrolling. It paints a single frame and then pauses, including while visible; entry activates animation, return settles and pauses. Resizes may request one repaint so a paused canvas is not blanked. The modal uses compositor transforms instead of width/height animation, avoiding per-frame WebGL buffer resizing. Page lifecycle handlers restore the parent scroll state. Added portal idle-load and embedded-preview state regression checks. Browser performance still needs user-device verification.

## Lived-in lounge, original soundtracks and explicit portal entry
Rollback point: a5e5dec370ff1d131014bb0bc84ed80907c35267 / appgprj_6acacd62ab108191800dfc4bc5df9805~appgver_562cfcdf7b6881918b71609a0bdb4cb5.
The main page no longer embeds or preloads a WebGL room at any scroll position. Clicking the window fades into a standalone room; browser back remains native. A best-effort session poster uses the actual first rendered room on return. No parent scroll locking or intersection-triggered renderer remains.
Added welcome after threshold arrival; original synthesized cosmic score; original city/velvet instrumental sketches controlled from the modeled hi-fi; optional original TV canvas broadcasts. No named song recordings or third-party samples are included. Audio remains opt-in.
Hand-modeled sofa with coat and hat, coffee table, reading lamp, hi-fi, television, paneled walls and ceiling. Walking uses drag-to-look plus WASD/arrows or touch buttons; bounded movement and furniture obstacles, no pointer lock. Existing games, legal chess and notebook retained. Entering a game focus pauses walking; leaving games retains pause/resume behavior.
Validation: geometry and camera/raycast tests with actual Three classes and stubbed renderer; walking/obstacle checks; portal no-startup/no-scroll-lock regression; game lifecycle, full puzzle lines, arcade simulation. Browser drawing and real-device scroll performance are not verified in this environment.

## Evidence and personal details release
Rollback: 3bfae9b8c90ed2fbf33ed9314659c6d06152505e / appgprj_6acacd62ab108191800dfc4bc5df9805~appgver_6c2524febedc819182474c10ae6e433c.
Six requested refinements: execution trace plus transparent queue/fee fixture; research notebook (memory pilot, Agentic Markets, Kyle, queue audit); experience case notes inside existing desktop; seated skyline mode with fading controls; personalized film keepsakes/window artwork/notebooks; direct professional links and printable web resume.
Content grounded in attached Career Knowledge v2 and already-published memory project narrative. BMO source mixes aspirations and completed-sounding draft language, so public case notes retain current role/focus and do not assert proposed deployments. Agentic Markets explicitly states deterministic mock validation with zero live model calls. Educational numerical fixtures never presented as recorded QSE/model runs.
No personal voice recording or selected film clip was supplied for this release. Existing original soundtracks/TV loops remain; no synthetic voice is represented as Mohamed.
Validation: execution conservation/queue/fees and report reconciliation; room geometry, seated camera and keepsake mode; game lifecycle and portal no-load/no-lock regressions; HTML local assets and duplicate IDs; production build. Visual browser QA unavailable.

## Materials, camera comfort, spatial sound and source artifacts
Rollback commit: f0dd0f9e3c0ae1e52b6b821eeb21655bf9d4ec8b (saved version appgprj_6acacd62ab108191800dfc4bc5df9805~appgver_c1f8e4cd1c7481918d9f89b3d316334a).
Added three 128px deterministic surface maps (wood, cloth, brushed metal), soft contact-shadow decals and restrained glass sheen; no external textures or live reflection passes. Camera focus uses bounded quintic easing and a small vertical arc; walking accelerates/decelerates and retains obstacles. Reduced motion cancels transitions and reduces idle render cadence. CRT texture updates are throttled away from games; TV off/static mode stops texture repainting. Balanced/Light/High control changes resolution and disables shadows in Light.
Record music uses distance attenuation and gentle stereo positioning with an opt-out; needle/switch cues share opt-in audio. Lounge lamp toggles independently of the chess reading lamp. Hidden note beneath the hat includes Mohamed's own reflections; keepsakes panel provides keyboard access.
Research notebook now includes local original records with pinned source links: CPU throughput CSV, corrected Kyle scorecard, one Agentic Markets episode, historical AS moment-audit checkpoint. Source provenance is in artifact-records.js. The Agentic record is additional to the mock pipeline validation, not evidence of general model behavior. AS historical failing checkpoint is identified as such, alongside later qualified replication status. No QSE benchmark was invented.
Checks: actual Three geometry with renderer stub; camera/obstacle regressions; game lifecycle; portal no-render/no-lock regression; numerical fixture checks; audio opt-in/spatial controls; production build. Browser visual QA and real-device performance verification remain unavailable in this environment.

## 2026-10-13 — A room that remembers
Rollback: 02fcf97c92027894e11acd14f9af6551f67f52cf.
Added guarded browser-local preferences for quality, reduced motion, lamp, volume, spatial audio and selected record. No playback state is retained. Research reopens its last page; chess retains its selected combination and first unassisted completion date, with marks in the notebook and select list. Keepsakes includes a local-memory reset, separate from shared arcade scores.
Record cabinet now has two geometry sleeves and matching CSS sleeve controls for original instrumental sketches, plus a visitor-supplied supported music-service link. No specific Mohamed playlist has been supplied or invented; music-service playback happens in a new tab and stops room music. Links require HTTPS and an allowed service hostname.
Existing clouds retain their slow movement; three window accents and one occasional distant aircraft add restrained city life, paused under reduced motion. No added lighting pass, textures from the network or embedded media. Research pages include evidence-grounded decision notes, without invented personal anecdotes.
Validation: geometry/camera/ray integration, game lifecycle, portal no-idle-renderer/no-scroll-lock regression, evidence calculations, WebAudio opt-in/cancellation and guarded-storage/URL validation pass. Browser visual and real-device audio/performance QA unavailable in this environment; no visual or FPS claims.

## 2026-10-13 — Follow the work
Rollback: d2c22adbb23b6b45805f96d9342b213ece62ff2b.
Execution exhibit now has a five-stage user-controlled order journey, a quantity-block queue, incoming flow and fee controls, counterfactual comparison and reset. It remains explicitly a browser teaching fixture, not a captured engine run. Scoped trace control attributes avoid interference with the surrounding animated illustration.
Each research leaf asks for a prediction or offers direct reveal; findings and limitations stay accessible in a disclosure. Prompts use existing career and committed-artifact evidence; there is no score or universal correctness claim. Added Mohamed’s previously supplied words as a notebook margin note; no invented playlist, voice recording or favorite book.
Hero now immediately names software, AI and market mechanics while retaining personal introductory copy and established links. Mobile room toolbar becomes horizontally scrollable; ResizeObserver measures its actual height for panel/walking-control offsets. Safe-area and short-landscape styles added; mobile form font size avoids automatic input zoom where supported.
Validation: existing portal, room geometry/lifecycle, audio, persistence and evidence checks pass; new mounted-control simulation checks fills, fees, stages, reset, and panel-size calculations at portrait/landscape dimensions. Production build via Site workflow. No browser-control skill is available, so real-device visual/audio/performance audit remains unperformed; no preview server or alternative browser path was used.

## 2026-10-13 — Execution instrument prototype
Rollback: f0a9580f8b523e237b4f46cc204d5992ef5e4392.
Replaced the selected-work execution thumbnail and old branching-particle overlay with an original live isometric SVG exchange mechanism. The same geometry opens into a larger inspection view, carrying the preview’s current incoming-flow position. Added three price-context lanes, active FIFO lane, orange 30-share order, model-driven matching wheel, filled tray and liftable glass cover. Controls: resume/pause, step incoming sells, new order, cancel remainder, quarter-speed playback, flow scrubbing, queue counterfactual and entry fees. Existing actual project evidence remains beneath the instrument; the old duplicate full-screen trace and slip were removed from this exhibit (desktop teaching fixture remains).
This is an original visual analogy inspired by the Anatomy reference, not imported Anatomy code or a real QSE recording. Integer share counts, fill/cancellation quantities and fees use one deterministic model. Offscreen/hidden work is skipped, reduced motion uses explicit steps, and modal cleanup cancels RAF and observer. No new libraries or remote downloads.
Validation: share conservation through all integer flow levels, queue priority, cancellation, fees, geometry bounds with glass down/up, controls and disposal tested; portfolio evidence and portal regression pass. A basic local polygon rasterization was inspected for geometry/framing, not a browser screenshot. Real browser performance, visual integration and device testing remain outstanding.

## 2026-10-14 — Autonomous research instruments
Rollback: 4b5fdcf2c0dade38cee755ff8b85963e96d58b39.
Prioritized previously text-only projects: audit, Kyle holdout and Agentic Markets now have original isometric SVG instruments in a visible three-card main-page row and expanded views. Audit is explicitly an eight-world experimental-design analogy with identical scripted input pulses, not a claimed outcome simulation. Kyle replays the corrected four-market scorecard; Agentic Markets replays saved equity snapshots and compares the final report only at the final day. Original artifact download and commit-pinned sources remain beneath each view.
All three start autonomously and loop while visible, retaining pause, stepping and slower playback. Offscreen/hidden rendering pauses; reduced motion stays still with explicit stepping. Execution instrument now autoplays, holds its result for three seconds, then repeats. Existing photographic memory demonstration also plays on its own, with pause and manual scrubbing; its visual identity is preserved.
Validation: all eight ablation combinations; recorded forecast/quote/execution counts; equity values checked against saved source; mounted autonomous advance, hidden pause, stepping and observer/RAF disposal pass. Existing execution, evidence and portal regression checks pass. No browser visual/device audit available. No new dependencies or generated imagery.

## 2026-10-14 — Kyle: two questions, four markets
Rollback: 0fefbea1c0e4bd750ef8081e7baae55c0ab62aec.
Replaced only Kyle’s repeated isometric machine with a restrained, four-stage visual explanation in both the main preview and expanded view. Four named market lanes pass forecastability; two pass the execution-cost criterion; final frame states the required three and failed criterion. No invented price traces, profit figures or causal simulation. Animate between discrete recorded outcomes with simple luminous markers; controls reduced to pause and next. Deeper methodology and original source live in one Explore disclosure. Reduced motion shows the conclusion immediately. Other projects remain unchanged for judging this single redesign.
Validation: animation outcomes checked against parsed corrected CSV; stage looping, automatic progression, manual advance, hidden pause and cleanup tested. No supported browser QA available; real-device visual review remains outstanding.

## 2026-10-14 — Distinct, simple project stories
Rollback: 20f4b629744a8c658e282093427bb351cbd2136f.
Applied the approved simpler direction to remaining project previews and expanded views. Execution uses a single FIFO queue with six earlier 10-share blocks and our three; audit compares the same scripted 80-share sell flow with/without queue priority; Agentic Markets presents its recorded agent claim next to the independent realized/unrealized ledger and final zero difference; memory retains the photographic asset while explaining initial-value recall versus an updated value with an explicitly illustrative BLUE→AMBER sequence.
Removed the mechanical instrument imports from active collection rendering. Each project has its own visual structure; common playback supplies automatic 16-second loops, pause, next, reduced-motion final state, offscreen/hidden pause and modal cleanup. Methodology, caveats and source records sit behind Explore. Kyle’s approved story, main cosmic theme and After Hours remain intact.
Checks: example share conservation, source ledger numbers, autonomous advance, manual advance, hidden pause and cleanup tested; Kyle and portal regressions pass. No browser/device visual verification available.

## 2026-10-14 — Retire the project-explainer experiment
User rejected the direction and asked to scrap it. Restored portfolio.html, inner-collection.js and universe.js from f0a9580f8b523e237b4f46cc204d5992ef5e4392, the image-led presentation before the Anatomy-inspired round. New story/instrument modules are no longer imported by the page; retained files/history permit recovery. Room, intro, settings, games and all unrelated source remain unchanged. Syntax and portal regression pass. Browser visual verification unavailable.

## 2026-10-14 — Black-hole entrance polish
Rollback: 0d6b11adbc2e1b1f97ecf83b8bf3f64e95d08422.
First two render frames remain hidden; post-process fade reveals the procedural scene from black over approximately 1.7 seconds of visible runtime. Entrance copy fades in on readiness. Reset clears visibility, reveal progress, collapse and flash to avoid exposing the old arrival frame. Drag targets ease toward the camera instead of immediately snapping; lost pointer capture clears dragging. Replay keyboard focus goes to the available Skip button while Enter warms up. Threshold résumé link explicitly accepts pointer input.
No new imagery, render pass, dependency or hyperspace phase. Existing plunge/arrival timing is preserved. Reduced motion skips the gradual reveal after warmup; hidden tabs do not advance it. Tests use actual Three objects with a stub renderer to verify first-frame blackout, gradual fade, hidden-tab pause, single arrival, replay and reduced motion. Portal regression passes. Browser visual/perceptual QA remains unavailable.

## Streamed TV feature
The modeled television retains its original city and deep-field loops and can also play the loaded 23:14 H.264/AAC MP4 from the Site's R2 bucket. `/api/video` serves byte ranges so playback and seeking do not require downloading the full file first. The media remains outside Git history; the attached Matroska file was remuxed to MP4 without re-encoding, and its subtitle tracks were not included. The temporary upload route and page were removed after the authorized file was uploaded.
