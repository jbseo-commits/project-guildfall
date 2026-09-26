# VERTICAL SLICE V1 — LIVING CARAVAN

## Purpose

This slice is a **playable hypothesis**, not a locked combat design.

It exists to test whether the current product thesis produces an emotional response in roughly 60–120 seconds:

1. I care which character is exposed.
2. My one planning choice is visible during automatic combat.
3. The game explicitly teaches me why that choice mattered.
4. Losing one member feels like losing part of the ecosystem.
5. I am willing to consider an inefficient recovery choice because I care about that character.

## Prototype assumptions

These are intentionally temporary and must not be treated as D002 decisions:

- three caravan members;
- one guardian relationship choice before combat;
- no direct input after COMMIT;
- deterministic scripted battle timeline;
- one member is endangered as a consequence of the chosen protection target;
- post-battle choice between costly recovery and efficient abandonment.

The displayed recovery costs are placeholders for emotional testing only.

## Cast used in the slice

- **Vael / 베일** — horned guardian; intercepts attacks.
- **Seris / 세리스** — moon-moth seer; needs uninterrupted concentration.
- **Mirel / 미렐** — bloom-root healer; keeps the living system connected.

Their current vector portraits are **prototype silhouettes only**. D001 requires the final characters to be highly attractive, charismatic, individually memorable, and beautiful-but-uncanny. The placeholder art is not the D005 target.

## Interaction loop

READ → choose who Vael protects → COMMIT → WATCH a 9.6-second deterministic fight → DEBRIEF → choose RECOVER or LEAVE → replay with the other plan.

## What to observe

During user testing, do not ask first whether the numbers are balanced. Ask:

- Did you understand what your pre-battle choice changed?
- Did you look at the protected character during the fight?
- When someone fell, did it feel consequential?
- Did the recovery cost feel painful enough to create a real conflict?
- Did you want to replay once with the other protection target?

## Engineering notes

- PixiJS owns presentation and input.
- Prototype combat state lives separately in `src/game/prototype.js`.
- The timeline is deterministic under seed label `GUILDFALL-SLICE-001`.
- Frame rate does not determine combat outcomes.
- Mobile portrait is the primary layout target.

## Next decision after testing

Do **not** expand content.

Use the test to inform D002: what the player controls, and what they surrender after COMMIT.
