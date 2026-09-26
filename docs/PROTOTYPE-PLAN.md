# PROTOTYPE PLAN — CURRENT EVIDENCE LADDER

This file now describes **what the prototype must prove next**, not the original chronological plan.

For execution order and automation rules, read:
- `LOOP-ENGINEERING.md`
- `docs/LOOP-STATE.md`

For authoritative product decisions, read:
- `docs/DECISIONS.md`

---

## P0 — Identity proof
**Status: PASSED**

The Living Caravan identity is locked.

The prototype already expresses:
- a small cast of distinctive inhabitants;
- formation / relationship-based behavior;
- a clear COMMIT boundary;
- automatic battle;
- visible protection / healing / ritual chains.

---

## P1 — Greybox duel
**Status: PASSED AS A FUNCTIONAL PROTOTYPE**

Current slice includes:
- 3 player characters;
- 3 enemies;
- threat reading;
- prebattle placement;
- automatic combat;
- causal result / debrief.

The project is no longer limited to greybox presentation.

---

## P2 — Build divergence test
**Status: PARTIAL / NOT YET PROVEN STRONGLY ENOUGH**

Goal:
Create at least two builds with similar raw power budgets that visibly behave differently.

Pass condition:
- a blind viewer can describe the behavioral difference from the fight alone;
- the player can predict at least one consequence before COMMIT;
- neither setup is an obvious universal winner.

The current formation prototype changes damage routing and protection behavior, but this gate still needs a deliberate A/B proof.

---

## P3 — Adaptation loop
**Status: PARTIAL**

Current tutorial contains causal debrief and next-step guidance.

Still required:
- a post-fight decision directly motivated by the previous battle;
- a second attempt where that adaptation visibly changes the outcome;
- enough clarity that the player can say why the change mattered.

---

## P4 — Identity slice
**Status: IN PROGRESS**

Already established:
- Vael / Seris / Mirel identities;
- camp;
- journey map;
- forest arena;
- enemy silhouettes;
- telegraphs;
- hit-stop / VFX;
- screenshot-driven Visual QA.

Current bottleneck:
- authored character combat poses / frames;
- authored enemy action poses;
- production-level motion continuity.

This is the current primary prototype work.

---

## P5 — Attachment proof
**Status: NOT STARTED**

Goal:
Prove that a specific character can become emotionally and mechanically difficult to replace.

Minimum experiment should include some combination of:
- persistent individual state;
- relationship / dependency;
- injury;
- absence;
- rescue;
- memory;
- recovery cost.

Do not build the permanent economy before the user locks the relevant decision.

---

## P6 — Loss / recovery proof
**Status: BLOCKED BY DESIGN DECISION**

The game must eventually prove:

> replacing someone may be efficient, but restoring someone you love may still be worth the sacrifice.

Required future evidence:
- loss is possible;
- restoration exists in at least one form;
- restoration is expensive;
- replacement is sometimes strategically cheaper;
- emotional attachment can rationally drive inefficient play.

The permanent rules require explicit user approval.

---

## P7 — Run-loop proof
**Status: BLOCKED BY D004**

Do not default to a copied Slay-the-Spire route structure.

The Living Caravan run structure must be chosen deliberately.

Once locked, prove:
- multiple encounters;
- travel / route decisions;
- adaptation between battles;
- persistent party relationships;
- reasons to continue despite injury / loss.

---

## Stop conditions

Do not scale content if any of these are true:

- watching battle is boring;
- results feel random or unreadable;
- strategic choices only change hidden percentages;
- characters feel disposable;
- the best strategy is obvious every time;
- the battle is more fun to skip than watch;
- motion looks like static cutouts being dragged through VFX;
- mobile landscape cannot communicate the same core causes as desktop;
- production art is being replaced by style-drifting shortcuts.

---

## Current next step

Always read `docs/LOOP-STATE.md`.

At the current checkpoint, the next evidence target is:

> **authored Vael combat poses / frames**

Do not jump to content breadth before the core action language passes.
