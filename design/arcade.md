# After-hours arcade

Two original browser games: Orbital Drift (asteroid survival) and Night Circuit (maze chase). Both use existing muted ivory, ember, green and near-black palette. Sound obeys the site's existing opt-in toggle. Keyboard, touch, pause, blur-pause, reduced-motion celebration and modal exit are provided. Games end after three lives or five minutes; maze completion awards a bonus.

The games are available only at the computer inside the 3D After Hours room. House challenges: 1,500 and 1,200. These are not Mohamed's personal records. When real records are supplied, update both client targets in public/room-play.js and server targets in app/api/arcade/route.ts together, and change the label honestly.

Shared scores use D1. The server creates one-use run IDs and checks qualification, elapsed time, name format and plausible bounds. This is a casual browser-submitted leaderboard, not anti-cheat-secure competitive scoring. A name is requested only after a qualifying completed run; submission is voluntary. Names are displayed with textContent.

The original static application now lives in public/, and portfolio.html is served unchanged by the root route. The Sites Vinext server adds /api/arcade and database migrations. Public scripts and artwork remain direct static assets.

Checks: all maze cells/spawns reachable; both game loops reach one game-over callback; pause and cleanup; API backed by in-memory SQLite rejects invalid names, duplicate saves, unknown games, and non-qualifying scores. Browser visual/performance QA is unavailable.
