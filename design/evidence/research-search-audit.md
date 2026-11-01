# Notebook search interaction — October 31, 2026

Public source repository: mtk1606/How-Much-Attention-Do-You-Actually-Need,
pinned at 2373697b796ace057ee8e7190b38b4b1a60ec2fc.

Read sources: README, site/ACCURACY_AUDIT.md,
research/experiment_log/2026-09-30_06_pilot_v4_result.md,
artifacts/analysis/pilot_mqar_v4/lr_selection.json, curves.csv, summary.json,
and final.json for the three selected pure Mamba-2 runs at .003, .01 and .03.

Scope: one-seed CPU MQAR pilot, four layers, d=64, no attention, L=32. Search
selection uses validation token accuracy averaged over P=2,4,6,8. The displayed
large result uses test token accuracy at P=8 (512 test examples). Their values
must never be plotted as the same metric or used interchangeably.

Stage ranges: [.001,.003], [.001,.003,.01], [.001,.003,.01,.02,.03]. Winners are
selected by validation alone, then the corresponding recorded test result is
shown. Test scores: .26416015625 / .88330078125 / .984130859375.
Validation winners: .4578857421875 / .943115234375 / .992919921875.

The initial failure interpretation was explicitly withdrawn in the public log.
The final pilot did not establish an attention requirement. Best LR .03 is still
at the grid edge in the artifact; the UI preserves that fact even though the
log describes the curve as practically flat. No seed uncertainty is fabricated.
The attention control collapse at .01 prevents a blanket 'higher LR is better'
lesson. No live training, GPU sweep or final capability curve is claimed.

UX: replace the memory spread's Observed leaf, keep Expected/Reconsidered and
other research pages. The range has three discrete recorded stages; the native
range node stays mounted while updating to preserve keyboard focus and dragging.
No automatic animation, sound or extra section. Methods and pinned source links
are folded into a details element. A compact JSON data receipt is public.

Checks: tests/research-search.mjs, tests/research-leaves.mjs and tests/aster-wasm.mjs
passed before packaging. The existing local preview infrastructure conflict was
not worked around; live published-browser QA follows. Dedicated mobile pass is
deferred. Black-hole and audio assets unchanged; no GitHub push requested.

Live QA passed all three stages, reverse keyboard navigation, retained stage after
leaf switching, and folded source/measurement disclosures. Final footer wording
distinguishes actual recorded chart data from the conceptual facing-page art.
