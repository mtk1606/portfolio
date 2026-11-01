# Portfolio experience review — 2026-10-30

Audience: curious visitors, coworkers, recruiters and hiring managers.

## Decisions made before adding features

- Preserve ordinary navigation, résumé and source links. Interaction is optional; no game completion gates the professional record.
- Keep one guide and one audio surface. Remove the duplicate Next/Skip action; fold restart/follow settings away.
- Make help action-based, explicit and deterministic. It never opens itself or auto-solves a question.
- Keep fictional practice stories folded and explicitly labelled, with real career scope first.
- Put inspection notes inside existing objects. Avoid new dashboards or floating notifications.
- Show real dated updates in one in-flow slip. First-visit invitations take precedence; opened/dismissed updates do not repeat.

## Implementation audit

- ASTER completion conserves quantity: 75 incoming minus 60 ahead gives 15 to B; 45 of B remain.
- QSE completion conserves quantity: 80 incoming minus 60 ahead gives 20 of 30; 10 remain.
- Completion gives a takeaway and direct engineering/other-project choices, with the teaching-fixture boundary intact.
- Guide reacts only while enabled, unpaused and following objects. No new scroll or narration is triggered by contextual help.
- Rotating a cartridge cancels stale work if another cartridge is selected during the animation.
- Startup audio is reserved for startup. Normal advances and repeat selections use short, quieter cues; hover is silent.
- Mobile changes prioritize navigation reach, 44px controls, smaller optional guidance and single-column paper layouts.
- New behavior uses existing events and finite animations, not new continuous render loops.

## Checks

Automated: context routing, hints, completion arithmetic, discovery retention, audio opt-in/mute, research leaves, internal anchors, unique IDs, syntax and production build.

Browser: pending final pass at desktop and narrow CSS viewport. This is a browser layout review, not a physical-device or headphone listening test.

## Constraints kept

Sites only. No GitHub push. No black-hole shader/geometry change. Voice narration remains deferred; no generated voice or new narration autoplay.

## Follow-up: recruiter journey and live interaction audit

The hero now leads directly to selected projects. A restrained text shortcut in the existing project heading opens ASTER's engineering record without requiring gameplay. The record explains event ordering, FIFO, inspection and the precise scope of Python comparisons. No new dashboard or card section was added.

Live browser checks on version 95 passed: direct record opening; Escape dismissal and focus return to flagship-record; ASTER wrong-answer help, opening the guide on current context, correct-answer acknowledgement and completed quantity conservation; QSE completion with 20 filled and 10 remaining; newspaper illustration dialog with fictional-art boundary. Desktop document width does not exceed viewport. The actual 3D scene cannot be audited because this browser reports 3D unavailable; its source was left unchanged.

Responsive CSS and bounded completion scrolling were reviewed, but a phone viewport could not be exercised: browser zoom input did not change CSS viewport width and no resize capability is exposed. Physical phone and headphone listening remain unverified. Do not describe these as passed. The prior local preview route refused connections; live Sites was used for interaction checks.

Narration is prepared, not generated or enabled: first visit offers an optional text tour; free exploration remains available; returning visitors remain quiet. Draft script and integration contract are in design/narration-plan.md. Voice still requires opt-in, interruption, captions and ambience ducking when recorded clips are integrated.

## Professional narrative and restraint pass

Hero now states the actual software focus and one scoped ASTER evidence point. The engineering record includes an explicit synthetic bid-queue trace and distinguishes replay scale from independently compared state. No invented incident, personal decision history, or benchmark was added.

Removed side navigation and the three repeated transition links; retained direct header links, optional Guide, and the interactive radio. Audio settings now expose working sentence captions directly and explain object-triggered narration without a disabled voice checkbox. Closing links bring résumé, email and LinkedIn together. About and Contact no longer reserve oversized section height.

The main page now requests a generated portfolio stylesheet. Source stylesheet order remains explicit in design/portfolio-style-order.json; dev/build regenerates the bundle. This is request consolidation, not a claim that all old CSS rules have been redesigned. Study and résumé styles remain separate.

Passed: production build; unique IDs/internal anchors; caption control retention; one portfolio CSS link; evidence, caption, research-leaf, cleanup and exploration-state checks. Live layout follow-up is performed after publication. Actual phone, contrast certification and performance benchmarking remain unverified.
