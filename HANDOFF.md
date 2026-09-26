# HANDOFF — PROJECT GUILDFALL

## Current phase

**Loop Engineering active.**

The project is no longer in initial concept exploration.

Current execution stage:

> **G1 Visual Identity → G2 Autobattle Payoff**

The current main already contains the first live tutorial/autobattle slice and screenshot-driven Visual QA.

The authoritative operating documents are now:

- `LOOP-ENGINEERING.md`
- `docs/LOOP-STATE.md`

Read both before changing code.

---

## Locked identity

The current fantasy is the **Living Caravan**:

a wandering living sanctuary / ecosystem made of beautiful, dangerous, highly charismatic beings.

Locked emotional principles:

- characters are **organs, not inventory**;
- losing one should feel like losing part of the living system;
- characters can be lost;
- recovery can exist but should eventually be painfully expensive;
- attachment may make the player strategically inefficient.

See `docs/DECISIONS.md`.

---

## Current playable slice

The current game includes:

### Planning
- enemy intent reading;
- FRONT / CORE / VEIL formation;
- party-member swapping;
- COMMIT boundary.

### Automatic battle
- breaker telegraph / lunge / opening impact;
- hunter rear-target acquisition / shot;
- Vael INTERCEPT;
- Mirel autonomous danger-read / healing;
- Seris concentration / ritual / moon burst;
- finish / resolution.

### Tutorial / explanation
- live-game tutorial overlays;
- battle dialogue;
- combat log;
- causal debrief;
- resonance prototype;
- route / journey presentation.

### Visual QA
Every relevant PR can render actual browser screenshots at:
- mobile landscape;
- desktop 16:9.

Combat QA currently includes:
- READ;
- PLACEMENT;
- CHARGE;
- INTERCEPT;
- BURST;
- FINISH.

---

## Current art / motion status

### Established
- approved Vael / Seris / Mirel visual identities;
- independent hero assets;
- authored enemy silhouette assets;
- layered camp / arena / route;
- battle telegraphs and VFX;
- real screenshot comparison loop.

### Still prototype-level
- hero body pose variation;
- enemy body pose variation;
- attack / impact / recovery transitions;
- some dialogue / environment assets;
- production-level motion continuity.

The highest-priority gap is no longer screen composition.

It is:

> **characters must visibly perform their roles with authored action poses rather than translated static cutouts.**

---

## Exact next action

Read `docs/LOOP-STATE.md`.

At the current checkpoint the next loop is:

> **Vael authored combat poses / frames V1**

Suggested branch:

`vael-authored-frames-v1`

Do not move to content breadth before this and the other core combat-pose loops pass.

---

## Execution rules

1. Use one focused loop per branch.
2. Observe the actual game first.
3. Fix the highest-impact player-facing bottleneck.
4. Build.
5. Capture real browser screenshots.
6. Inspect mobile and desktop.
7. Reject or iterate if worse.
8. Merge only after evidence passes.
9. Update `docs/LOOP-STATE.md`.
10. Continue to the next bottleneck while the session allows.

Do not stop merely because code was written.

---

## Do not silently lock open design decisions

Current implementation contains provisional answers for formation / resonance / spatial logic.

These are not automatically permanent.

Major choices still requiring explicit user lock include:
- permanent control-vs-automation model;
- permanent spatial model;
- permanent run structure;
- permanent loss / restoration economy;
- permanent recruitment model.

Prototype them when useful, but label them provisional.

---

## External deployment note

The latest repository/Visual QA checks passed after Combat Motion V2.

At the last check, Vercel could report a **build-rate-limit** failure.

Treat that as external infrastructure unless a real application build error appears.

Do not confuse provider quota failure with broken game code.
