# MOCKUP LOCK MODE — GOLDEN FRAME

> **Status: ACTIVE TEMPORARY PRODUCTION MODE**
>
> Goal: stop expanding the game and make the approved tutorial mockup behave like a live game first.

## Golden target

The approved tutorial composition is treated as a **Golden Frame**.

For this mode:
- no new core systems;
- no world expansion;
- no run-structure expansion;
- no content breadth;
- no “better idea” redesign of the screen.

The job is to preserve the approved composition and replace static-looking parts with live behavior.

## What is locked

At 16:9 the screen must keep this hierarchy:

- top half ≈ 54%
- bottom battle ≈ 46%
- left camp ≈ 52%
- center tutorial paper ≈ 31%
- right route map ≈ 16%
- bottom-left dialogue ≈ 26–29%
- bottom-right combat log ≈ 19–21%
- bottom-right tip ≈ 19–21%
- progress rail centered across the remaining lower width

These are composition constraints, not suggestions.

## Development order

1. **Static match**
   - positions
   - sizes
   - spacing
   - visual hierarchy
   - character scale
   - battle actor spacing

2. **Minimal live motion**
   - idle
   - attack
   - intercept
   - heal
   - cast
   - hit
   - finish

3. **Replace temporary motion with authored frames**
   - only after the Golden Frame already feels alive

4. Resume broader game systems only after the mockup screen is GREEN.

## Quality rule

Do not rewrite layout from scratch after this point.

For each loop:
- capture the real browser at the Golden Frame viewport;
- compare against the approved mockup;
- change only the largest visible mismatch;
- capture again.

## Visual QA viewports

- Golden Frame: **1648×928**
- Desktop regression: 1536×864
- Mobile landscape regression: 1388×550

The Golden Frame capture is the primary composition judge.

## Pass condition

MOCKUP LOCK is GREEN when:

- a side-by-side viewer immediately recognizes the live game as the approved mockup;
- major UI blocks occupy the same visual weight;
- characters/enemies are the same apparent scale class;
- combat remains readable without moving panels around;
- animation happens **inside the locked frame** rather than redesigning the frame.

Only then resume wider production loops.
