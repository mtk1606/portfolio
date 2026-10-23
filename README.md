# Portfolio — reference-led revision

The authoritative visual reference is `design/firstDraft.png`, supplied by the owner. The opening follows its bold sans-serif typography, thermal orange silhouette with blue cosmic atmosphere, orbiting pixel objects, and compact scientific research previews. The earlier serif/copper editorial direction is superseded.

## Implementation
Static HTML/CSS with browser ES modules. Serve `dist/index.html` through Sites. `app.js` imports a locally vendored, pinned chess.js 1.4.0 module; it does not depend on a remote chess service at runtime.

## Chess collection
Ten actual Lichess puzzles from the CC0 open database, retrieved 2026-10-11:
https://database.lichess.org/#puzzles

Selected for ratings 1700–2450, popularity at least 90, at least 100 plays, multi-move lines, and varied themes. Mate-in-one and back-rank-mate tags were excluded. The resulting ratings are 1702–2439. Themes include sacrifice, quiet move, defensive move, deflection, attraction, intermezzo, clearance, pin, fork, and discovered attack.

`design/lichess-selected-source.json` preserves the original source rows. `dist/puzzles.json` and `dist/puzzles-data.js` preserve IDs, ratings, FENs, source links, UCI moves and SAN notation. As required by Lichess format, the source row's first move is played before showing the position. The remaining sequence is the solution. Original links are visible inside the puzzle UI. Ratings are the retrieved snapshot, not live ratings.

All legal moves are checked by chess.js. The intended database continuation is accepted, as is an immediate legal checkmate. The application is a puzzle trainer, not a live analysis engine. Hints and solution reveal do not grant an unassisted solve. Puzzle changes and dialog closure cancel pending automatic replies.

Vendored library: https://github.com/jhlywa/chess.js
License: `dist/vendor/chess-LICENSE.txt` (BSD-2-Clause).

## Visual assets
The original reference remains unchanged in `design/firstDraft.png`. Three project assets were derived with the built-in image-generation tool:
- `dist/assets/reference-hero.webp`: extract the reference's thermal silhouette and blue cosmic background; remove UI, type, sprites, orbit and project cards; retain composition and grain.
- `dist/assets/execution.webp`: recreate the original small execution preview—an orange source branching into fine white event traces in an archival scientific style.
- `dist/assets/attention.webp`: recreate the original small memory preview—layered grainy silhouette frames with green tracking boxes in perspective.
These are conceptual images, not factual data plots. The silhouette is abstract reference artwork, not an authenticated portrait of the owner.

The header comet and favicon pair are native pixel SVGs linking the original star motif to a blue rising line. Sound is opt-in and synthesized locally. Reduced-motion and ticker-pause controls remain available.

## Verification
JavaScript syntax, HTML anchors, local assets, and DOM ID references checked. The full multi-move flow was exercised against the real chess.js library for all ten puzzles, including both orientations, wrong-move rejection, stale-reply cancellation, and hints/reveal behavior. Browser rendering, real-device touch, and audio playback remain unverified in this environment.

## Cosmic universe revision — 11 October 2026

The approved tall reference is implemented as live HTML sections on a continuous photographic deep-field background. Project exhibits contain animated execution particles, illustrative green tracking overlays, and a CRT experience archive with company and content navigation. Tracking is an art treatment, not a running vision model. Career claims and sourced Lichess puzzles are retained.

The threshold uses an edited, text-free version of the approved generated black-hole artwork, animated with a Three.js 0.180.0 ShaderMaterial. Entry zooms toward its shadow and transitions into 1,000 3D star streaks. This hybrid image/WebGL rendering is not general-relativistic ray tracing. A static artwork/CSS fallback, skip button, session shortcut, replay, focus isolation and reduced-motion exit are included. Three.js is vendored with its MIT license.

Optional original synthesized ambient chords supplement the existing interface cues. Inner voice is separately opt-in and explicitly labelled synthetic; browser speech availability varies. It uses short user-provided/adapted reflections, captions, music ducking, and suppresses speech during dialogs or background tabs. No user microphone or camera access is requested. One unassisted chess solve unlocks a downloadable pixel star in Notes from the inside; progress stays on the device.

Validation: JavaScript syntax, local asset/anchor/ID checks, all ten legal chess continuations and trainer regressions, mocked DOM checks for skip/replay/reduced motion/notes/reward/voice fallback. Managed environment has no control-browser skill, so no browser preview server was started. Actual WebGL appearance, responsive screenshots, audio output and touch interactions remain unverified in a browser.

## Procedural entrance revision — supersedes image-based threshold

The threshold now uses `black-hole.js` and two GLSL shaders. It loads no black-hole image. Ray integration and plane-crossing fundamentals adapt GodlyDonuts/ThreeJSBlackHoleSimulation (Saicharan Ramineni, MIT; notice in dist/vendor/black-hole-LICENSE.txt). Midpoint integration, adaptive spatial steps, procedural sky, display encoding and camera choreography are implemented for this site. The rotating cyclic turbulence and temperature treatment were adapted from the user's supplied WebGPU/TSL source, preserved in design/user-black-hole-source.html. This is a visually motivated approximation, not a validated general-relativity simulator.

Rendering starts at balanced quality. Automatic mode adjusts internal resolution and step count with hysteresis. High and Light overrides, a pixel budget, approximately 30fps idle scheduling, hidden-tab suspension and post-entry stop reduce GPU work. Module/shader loading is lazy for returning visitors. WebGL errors produce an explicit message with an immediate path to the site; no image zoom is substituted. Disk, light bending, bloom, background stars and the creative post-horizon warp are procedural. The camera position changes in 3D through the entrance. A new session key ensures previous visitors see the replacement once.

The desktop background is a single outpainted cosmic artwork at its natural aspect ratio, extending beyond page content. The prior fixed low-resolution Hubble layer and separate desktop portrait are no longer active. Mobile uses a matched portrait crop for readable layout. The original reference remains authoritative; generated background content is an interpretation, not an exact pixel match.

The hero keeps the surname together after the deliberate first-name break. After Hours links to the existing pixel-style 3D room as a clearly labeled preview; the approved room remains the default.

Validation: both shaders compiled and rendered with Mesa EGL/ModernGL at outside, approaching-horizon and post-horizon camera states. The byte-target encoding fallback was also rendered to check gradients. A native rendered frame is retained in design/black-hole-render-preview.png. JavaScript syntax, all local paths/IDs/anchors, entrance state transitions, and existing chess continuation tests passed. Native offline rendering verifies shader compilation/output, not Three.js browser integration, responsive appearance, audio or actual laptop frame rates; these still need browser QA.
