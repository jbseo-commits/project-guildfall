# Mockup Art Fidelity V2 — production asset gate

This branch follows docs/MOCKUP-LOCK.md. Preserve Golden Frame geometry and live independent layers.

## Verified source asset inventory (main, 2026-09-27)
- `src/assets/heroes/vael.webp`: 8,124 bytes
- `src/assets/heroes/seris.webp`: 6,428 bytes
- `src/assets/heroes/mirel.webp`: 6,864 bytes
- `src/assets/scenes/camp-clean.svg`: 13,174 bytes
- `src/assets/scenes/arena-clearing.svg`: 6,912 bytes
- `src/assets/scenes/journey-map.svg`: 1,743 bytes
- `src/scenePlates.js`: inline base64 WebP plates, separate from independently layered actors.
- Enemy breaker/hound/hunter remain SVG assets.

File size alone does not prove image quality; inspect actual browser captures before marking any item GREEN.

## Production acceptance checklist
1. Preserve the 1648x928 approved Golden Frame and all panel proportions.
2. Replace the visibly weakest existing **independent** art asset with a faithful approved-character/environment asset. Never use a flattened screenshot as a game background containing duplicate actors/UI.
3. Capture actual `golden-1648x928`, `desktop-16x9`, and `mobile-landscape` story, placement, charge, intercept, burst and finish states using existing visual QA.
4. Compare the captured Golden Frame with the approved mockup side by side; explicitly note any deviations in face identity, silhouette, crop, apparent scale, sharpness, layering and panel hierarchy.
5. Verify characters remain independently animated and clickable game controls are unobstructed.
6. No new mechanics, world expansion or geometry redesign.
7. Merge only after actual art replacement, screenshots and review. Updating a checklist is not a visual pass.

## Current blocker
The approved high-resolution mockup source and full-resolution character masters are not present in the inspected source asset folders. The next implementation should source approved masters, then replace one low-fidelity layer at a time and inspect captures. Do not upscale tiny crops and call them production art.

## User-supplied visual reference — 2026-09-27

The user supplied a phone screenshot of the approved target composition (screenshot contains phone chrome, black margins and cropped right/left edges; **not** a production art master).

**Visual target, top camp**
- Rich, detailed painterly caravan interior/exterior at twilight: layered wooden mobile sanctuary, hanging amber lanterns, warm firelight and cool blue-purple distant landscape.
- Three individually identifiable characters seated by the campfire: Vael at left, Seris reading at center, Mirel at right. Character illustrations are crisp and highly detailed, with consistent faces, costume and proportions.
- Cream parchment dialogue balloons sit near each speaking character and do not obscure the cast.
- Camp scene is richly populated with small props, flora and caravan architecture rather than a blurred plate.

**Visual target, bottom combat**
- Continuous painterly forest-clearing battle arena with cool blue depth, glowing flora, warm earth foreground.
- Three live independently layered party actors (Mirel left, Seris center, Vael right), consistent with their camp identities. Enemy target sits to the right (cropped in screenshot).
- Vael has an immediately readable active shield/intercept pose and blue arc; orange intent arrow points toward the target. Seris/Mirel have distinct supporting silhouettes.
- Thin readable HP bars sit above actors; do not obscure heads.
- Lower overlay: cream Seris dialogue panel at left; horizontal READ → PLACE → BATTLE progress rail centered/right, with amber active PLACE marker.
- Character scale, foreground grounding, lighting direction and arena perspective must match across all actors.

**Reference constraints**
- The screenshot is a *partial visual reference*: it is not a complete uncropped 1648×928 Golden Frame, and its black phone margins / system icons / viewer buttons must never be included in game art.
- Never paste this screenshot as a single game layer or crop character sprites out of the compressed phone screenshot as production assets.
- Retain the independently layered live scene and existing locked geometry from `docs/MOCKUP-LOCK.md`. The screenshot's visible camp and battle relationships provide an art-direction target, not authorization to change layout.
- The approved original full-resolution camp plate, combat plate, Vael/Seris/Mirel masters and enemy art are still needed to perform a faithful art replacement.
- A successful code build alone is not a fidelity pass: inspect actual rendered screenshots and document visible deviations.
