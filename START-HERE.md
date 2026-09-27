# START HERE — PROJECT GUILDFALL

## What we are building

PROJECT GUILDFALL is an original fantasy autobattler / strategy roguelite built around:

> **READ → PLAN → COMMIT → WATCH → UNDERSTAND → ADAPT**

The player should make meaningful strategic choices before or between automatic combat beats, then watch those choices become readable, satisfying behavior.

The current fantasy is **LOCKED**:

> **The Living Caravan** — a wandering living sanctuary made of beautiful, dangerous, charismatic beings who function as an interdependent ecosystem.

Characters are **organs, not inventory**.

Read `docs/DECISIONS.md` for the authoritative design record.

---

# Mandatory entry sequence

Every new session / agent must read in this order:

1. `START-HERE.md`
2. `LOOP-ENGINEERING.md`
3. `docs/LOOP-STATE.md`
4. `docs/DECISIONS.md`
5. `docs/GAME-VISION.md`
6. `docs/WORLD-BIBLE.md`
7. `docs/NARRATIVE-VERTICAL-SLICE.md`
8. `HANDOFF.md`
9. relevant implementation docs

Then inspect:
- current `main`;
- latest merged PRs;
- open PRs;
- latest Visual QA screenshots;
- the live deployment when available.

Do not restart concept exploration from D001.
Do not rely on an old handoff over current `main`.

---

# Current phase

The project is currently transitioning from:

> **G1 — Visual Identity**

into:

> **G2 — Autobattle Payoff**

The current game already includes:

- real browser-playable tutorial flow;
- threat reading;
- formation / placement;
- COMMIT boundary;
- automatic battle;
- Vael / Seris / Mirel;
- resonance prototype;
- authored enemy silhouettes;
- camp / journey / arena presentation;
- combat telegraphs;
- Vael INTERCEPT;
- Mirel autonomous heal;
- Seris ritual / moon burst;
- causal combat log / debrief;
- screenshot-driven Visual QA on mobile landscape and desktop 16:9.

The current largest bottleneck is **authored combat poses / frames**.

See `docs/LOOP-STATE.md` for the exact next task.

---

# Engineering rule

Do not regress to a baked single-image mockup.

The game must remain independently layered:

- environment;
- player actors;
- enemy actors;
- VFX;
- world HUD;
- tutorial guidance;
- route / meta UI;
- debrief.

Battle logic and art should remain replaceable independently.

---

# Core product constraints

1. Automatic combat must be readable and satisfying.
2. Player choices must visibly change behavior, not only hidden numbers.
3. Watching battle is part of the reward.
4. First-session decisions should be simple.
5. Tactical depth may grow substantially for experienced players.
6. Characters must be extremely attractive, charismatic, memorable, and difficult to treat as disposable.
7. Loss may happen; the later recovery economy must make restoration meaningfully expensive.
8. Mobile landscape is a first-class target.
9. Real rendered screenshots are required evidence for visual completion.
10. Do not copy another game's IP, exact UI, economy, map structure, roster, or visual identity.

---

# How to continue

If the user's instruction is simply:

> “다음” / “계속” / “루프 계속”

follow `LOOP-ENGINEERING.md`.

Do not answer with a plan only when implementation tools are available.

The loop should:
- select the highest-impact bottleneck;
- implement it;
- build it;
- capture the real game;
- compare;
- reject or iterate if needed;
- merge only after the gate passes;
- update `docs/LOOP-STATE.md`;
- continue while the session allows.
