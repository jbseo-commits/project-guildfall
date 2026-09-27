# PROJECT GUILDFALL

> **Working title only.** Original fantasy autobattler / strategy roguelite.

The product thesis is:

> **Make planning feel consequential, then make the payoff feel satisfying to watch.**

The current locked fantasy is **The Living Caravan**:
a wandering living sanctuary / ecosystem made of beautiful, dangerous, charismatic beings who visibly depend on one another.

Characters are **organs, not inventory**.

---

## Start here

For any new ChatGPT / coding-agent session:

1. Read `START-HERE.md`.
2. Read `LOOP-ENGINEERING.md`.
3. Read `docs/LOOP-STATE.md`.
4. Read `docs/DECISIONS.md`.
5. Read `docs/GAME-VISION.md`.
6. Read `docs/WORLD-BIBLE.md`.
7. Read `docs/CHARACTER-BIBLE.md`.
8. Read `docs/NARRATIVE-SPINE.md`.
9. Read `HANDOFF.md`.
10. Inspect current `main`, latest Visual QA artifacts, and live deployment when available.
11. Continue the highest-priority loop.

Do **not** restart Decision 001.

---

## Development method

The repository now uses an evidence-first loop:

> **OBSERVE → DIAGNOSE → SELECT ONE BOTTLENECK → IMPLEMENT → BUILD → CAPTURE → COMPARE → ITERATE / REJECT → MERGE → UPDATE STATE → NEXT LOOP**

Visual work is not considered complete until the **real browser render** has been inspected.

Current Visual QA renders:
- mobile landscape;
- desktop 16:9;
- tutorial read;
- placement;
- charge;
- intercept;
- major burst;
- finish.

See `LOOP-ENGINEERING.md` for the full execution protocol.

---

## Current milestone

The project is transitioning from:

- **G1 — Visual Identity**

to:

- **G2 — Autobattle Payoff**

Current main already includes:
- threat-read tutorial;
- formation;
- COMMIT;
- automatic battle;
- Vael / Seris / Mirel;
- enemy telegraphs;
- Vael INTERCEPT;
- Mirel autonomous heal;
- Seris moon ritual;
- resonance prototype;
- causal debrief;
- camp / route / forest arena;
- screenshot-driven QA.

The next exact bottleneck is recorded in `docs/LOOP-STATE.md`.

---

## Tech baseline

- Web / mobile-first
- Vite
- JavaScript
- live independent environment / actor / VFX / HUD layers
- 60 Hz motion target where supported
- gameplay state separate from presentation where practical
- GitHub Actions Prototype CI
- Playwright screenshot Visual QA

PixiJS remains the prototype rendering direction in the design record, but current implementation details should be verified from `main` before assuming architecture.

---

## Decision discipline

Major systems are not considered permanent until recorded in `docs/DECISIONS.md`.

Do not silently lock:
- control-vs-automation ownership;
- spatial model;
- run structure;
- loss / recovery economy;
- recruitment model;
- other major product decisions.

Prototype hypotheses are allowed; permanent decisions require explicit user approval.

---

## Non-goal

This is **not** a clone of any specific autobattler, JRPG, deckbuilder, or roguelite.

We may study genre grammar, but names, characters, art direction, UI, progression, combat rules, economy, map structure, and content must remain original.
