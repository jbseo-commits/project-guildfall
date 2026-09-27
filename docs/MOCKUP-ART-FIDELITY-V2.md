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
