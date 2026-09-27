# LOOP STATE — PROJECT GUILDFALL

> **MODE OVERRIDE: MOCKUP LOCK ACTIVE**
>
> Until the Golden Frame is GREEN, do not expand systems, world, run structure, or content breadth.
> Read `docs/MOCKUP-LOCK.md` before choosing the next loop.

> This file is the current execution checkpoint for `LOOP-ENGINEERING.md`.
> It should be updated after every meaningful merged loop.

---

## Current main baseline

- Main commit: `b56cbd51ca6ca08af95e209cf35b2dd965b9e8c5`
- Latest merged milestone: **Mockup Lock V1 + Painterly Battle Plate**
- Latest merged PRs:
  - **#26 — Mockup Lock v1: freeze Golden Frame before more systems**
  - **#27 — Mockup art match v1: promote painterly battle plate**
- World foundation: **#18 — merged**
- Chapter 01 content pack: **#20 — merged**
- Visual QA: **PASS**
- Prototype CI: **PASS**
- Vercel status at last check: **external build-rate-limit failure**, not an application build failure

---

## Current product phase

> **MOCKUP LOCK → G2**

The game has enough systems and narrative to stop expanding.

The current blocking problem is simpler:

> **the live browser screen still does not look close enough to the approved mockup.**

Therefore the project is temporarily in **MOCKUP LOCK MODE**.

First make the approved screen composition visually match and move. Only after the Golden Frame is GREEN should broader production resume.

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

### Narrative now live
- camp warmth before tutorial mechanics
- visible Hush warning
- targeted threat to Seris
- in-world COMMIT language
- character battle barks
- relationship-focused debrief
- post-battle care scene
- departure scene
- provisional sealed-caravan / fourth-heartbeat hook

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
- Living Caravan world foundation
- initial Vael / Seris / Mirel characterization
- Chapter 01 content separation
- Chapter 01 runtime narrative flow
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
**Mockup Art Fidelity V2**

### Why this is next
Golden Frame geometry is now substantially locked.

The remaining mismatch is primarily **art fidelity**, not layout:
- camp art is too soft / low-resolution;
- battle environment is painterly but still blurred;
- hero battle sprites are low-resolution crops;
- dialogue portrait quality is below the approved mockup;
- enemies are readable but not yet at the approved illustration quality.

Do not redesign the frame. Replace weak art inside it.

### Pass condition
The loop is GREEN only if:
- the 1648×928 live capture keeps the locked geometry;
- camp and battle art no longer look obviously low-resolution / placeholder;
- hero sprites and dialogue portrait preserve the approved character identity;
- enemies no longer read as temporary vector stand-ins;
- no new system is introduced;
- mobile landscape retains the same hierarchy.

### Suggested branch
`mockup-art-fidelity-v2`

### Likely files
- `src/assets/scenes/`
- `src/assets/heroes/`
- `src/assets/enemies/`
- `src/style.css`
- `src/main.js`
- `.github/workflows/visual-qa.yml` only if evidence capture needs refinement

# Queue after Golden Frame

Proceed in this order unless evidence reveals a higher-priority regression:

1. Mockup art fidelity
2. minimal live motion inside the locked frame
3. Vael authored combat poses
4. Seris authored concentration / cast / burst poses
5. Mirel authored sense / heal / recovery poses
6. enemy authored attack / hit / defeat poses
7. transition smoothing / performance pass
8. stronger causal debrief
9. two-build strategic divergence test
10. only then resume broader systems / run work

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
