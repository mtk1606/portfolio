# Main-page layout audit
The hero retained a viewport-dependent fixed height while later rules padded both it and its child. Text could extend beyond its section on shorter windows and collide with the radio heading. Replaced the fixed height with normal content flow, removed double padding, and gave links an explicit wrapping row. The next section now begins after the full hero content plus its bottom padding. No overflow clipping or whole-page zoom workaround.

Radio wrapper uses border-box width, its caption/presets wrap, and its padding is explicitly reset at every breakpoint. Header spacing compresses at intermediate desktop widths. Hero orbit decorations do not intercept surrounding content; tablet/narrow layouts remove the orbit from the text area. Closing narration symbol has a designated position and copy-email has a readable label and usable hit area.

Baseline live review 1363x936: arcade and newspaper fit; no horizontal section overflow. Full WebGL intro and mobile appearance not validated. Existing black-hole renderer, journal artwork, newspaper art, content, career claims and research data remain unchanged.
