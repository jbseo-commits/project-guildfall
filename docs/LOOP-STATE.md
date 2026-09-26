# LOOP STATE — PROJECT GUILDFALL

> **Last updated:** 2026-09-27
>
> This file is the current execution checkpoint for `LOOP-ENGINEERING.md`.
> It should be updated after every meaningful merged loop.

---

## Current main baseline

- Main commit: `07a6bc98a80c943dce649ff173700ad9c74d2326`
- Latest merged milestone: **Combat Motion V2**
- Latest merged PR: **#16 — Combat motion v2: connected attacks, intercepts and ritual payoff**
- Visual QA: **PASS**
- Prototype CI: **PASS**
- Vercel status at last check: **external build-rate-limit failure**, not an application build failure

---

## Current product phase

> **G1 → G2 transition**

The game already has a recognizable visual identity and a functioning tutorial/autobattle slice.

The current highest-value work is no longer “make the screen exist.”

It is:

> **make the characters and enemies actually perform authored combat actions instead of moving static cutouts through effects.**

---

## Locked identity recap

Read `docs/DECISIONS.md` for authority.

Current non-negotiables:

- Living Caravan / living sanctuary fantasy
- beautiful, dangerous, charismatic characters
- characters are organs, not inventory
- attachment matters
- loss may happen
- future restoration should be expensive and emotionally meaningful
- automatic combat must visibly express player authorship

---

## What currently works

### Tutorial / planning
- threat-read tutorial
- formation / placement
- COMMIT boundary
- automatic combat
- causal combat log
- battle debrief
- resonance tutorial prototype
- journey map presentation

### Current party
- Vael
- Seris
- Mirel

### Current live combat chain
- breaker telegraph
- breaker lunge
- opening impact
- hunter rear-target acquisition
- hunter shot
- Vael INTERCEPT
- Mirel danger read
- Mirel heal
- Seris ritual charge
- Seris moon burst
- finish / resolution

### Current visual QA
The workflow captures real browser renders at:
- 1388×550 mobile landscape
- 1536×864 desktop 16:9

Current keyframes:
- READ
- PLACEMENT
- CHARGE
- INTERCEPT
- BURST
- FINISH

Keyframe timing is anchored to battle start.

---

## What is still provisional / not locked

Do not confuse current implementation with final design decisions.

Still open in `docs/DECISIONS.md`:

- D002 — permanent control vs surrender model
- D003 — permanent spatial model
- D004 — permanent run structure
- D005 — final art identity wording / full production art system
- permanent loss / restoration economy
- permanent recruitment structure

The current formation/resonance systems are useful prototypes and may become final, but should remain **PROVISIONAL** until explicitly locked.

---

## Current visual status

### GREEN
- overall split-screen tutorial composition
- camp / tutorial / route / battle hierarchy
- independent live layers
- hero visual identity direction
- enemy silhouette differentiation
- mobile landscape support
- screenshot-driven QA pipeline
- combat intent arrows / targeting language
- Vael INTERCEPT readability

### YELLOW
- hero combat motion
- enemy combat motion
- battle impact continuity
- Seris dialogue portrait solution
- arena depth / production finish
- route-map production finish
- debrief causality presentation
- VFX density / restraint balance

### RED
- authored hero action poses / frames
- authored enemy attack / hit / defeat frames
- production-level body motion
- persistent character attachment systems
- loss / recovery proof
- run-loop proof
- content breadth

---

## Rejected / failed experiments that should not be repeated blindly

### Rejected: baked full-screen concept mockup as game
Reason:
- duplicated UI / characters
- not a live game layer system
- cannot support real interaction properly

### Rejected: low-quality style-drifting Seris vector portrait
Reason:
- failed the attractive / charismatic character bar
- style did not match approved cast

### Rejected: direct concept-art crop injection experiment
Reason:
- poor browser result / wrong crop behavior
- did not produce a reliable reusable game asset

### Rejected principle
Do not merge a weaker visual result because time was spent on it.

---

## Current external blocker

### Vercel build-rate-limit
At the last main check:
- GitHub build / CI passed
- Visual QA passed
- Vercel reported build-rate-limit

Treat this as an infrastructure quota issue unless a later deployment exposes a real application error.

Repository work may continue.

---

# NEXT LOOP — HIGHEST PRIORITY

## Target
**Vael authored combat poses / frames V1**

### Why this is next
Vael is the clearest proof character for the game's autobattle fantasy.

His defining behavior is:
- read threat;
- brace;
- move to protect;
- absorb contact;
- recover / counter.

Right now this logic reads, but most body motion is still the same static artwork being translated / rotated.

That is the current largest gap between:
- “functional prototype”
and
- “commercial-feeling character combat.”

### Required pose set
At minimum:

1. idle / breath
2. guard-ready
3. brace
4. intercept travel
5. shield-impact
6. hit reaction
7. counter / finish
8. recovery
9. critical / downed candidate

### Pass condition
The loop is GREEN only if:

- Vael visibly changes pose, not merely position;
- the intercept chain is readable without the log;
- the character still looks like the approved Vael;
- no face / silhouette / costume style drift;
- mobile landscape remains readable;
- CHARGE / INTERCEPT / FINISH Visual QA frames all improve;
- movement does not introduce obvious stutter.

### Suggested branch
`vael-authored-frames-v1`

### Likely files
- `src/assets/heroes/`
- `src/main.js`
- `src/style.css`
- `.github/workflows/visual-qa.yml` only if new evidence timing is needed

---

# Queue after Vael

Proceed in this order unless evidence reveals a higher-priority regression:

1. Vael authored combat poses
2. Seris authored concentration / cast / burst poses
3. Mirel authored sense / heal / recovery poses
4. enemy authored attack / hit / defeat poses
5. transition smoothing / performance pass
6. stronger causal debrief
7. two-build strategic divergence test
8. D002 user lock if the prototype has enough evidence
9. attachment / injury persistence prototype
10. loss / restoration economy decision with user
11. run-structure decision with user
12. run-loop prototype
13. content breadth only after core gates pass

---

## End-of-loop update rule

After each successful merge, replace / update:

- main commit
- latest merged PR
- current gate status
- what became GREEN
- what remains RED/YELLOW
- rejected experiments
- external blockers
- exact NEXT LOOP
- suggested next branch

Never leave this file saying “next = X” after X has already been merged.
