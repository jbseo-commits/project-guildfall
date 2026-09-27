# LOOP ENGINEERING — PROJECT GUILDFALL

> **Status: ACTIVE EXECUTION PROTOCOL**
>
> This file defines **how the project is developed repeatedly until completion**.
> It is not a replacement for `docs/DECISIONS.md`. Product/design decisions still come from the decision log.
>
> The purpose of this protocol is to prevent the project from losing direction between sessions, agents, branches, or visual iterations.

---

## 0. Mission

Build PROJECT GUILDFALL into a polished, playable fantasy autobattler / strategy roguelite while preserving the user-approved identity:

- **Living Caravan**: a wandering living sanctuary/ecosystem.
- Characters are **organs, not inventory**.
- Characters must be **extremely attractive, charismatic, memorable, and emotionally difficult to lose**.
- Combat must express:
  **READ → PLAN → COMMIT → WATCH → UNDERSTAND → ADAPT**.
- The automatic battle must be a reward to watch, not a skipped loading animation.
- Strategic choices must visibly change behavior, positioning, targeting, protection, healing, timing, resonance, or sequencing.
- Attachment may intentionally make the player strategically inefficient.
- Character loss may happen; restoration should eventually be expensive enough to create meaningful emotional decisions.

The development process must continue through repeated evidence-based loops until the release gates in this document are green.

---

# 1. Authority order

When files disagree, use this order:

1. **User's latest explicit instruction**
2. `docs/DECISIONS.md`
3. `docs/GAME-VISION.md`
4. **this file — `LOOP-ENGINEERING.md`**
5. `docs/LOOP-STATE.md`
6. `HANDOFF.md`
7. other design / implementation notes
8. code comments

Never silently override a locked decision because an older implementation does something different.

---

# 2. Mandatory boot sequence for every new session / agent

Before editing code:

1. Pull / inspect current `main`.
2. Read in this exact order:
   - `START-HERE.md`
   - `LOOP-ENGINEERING.md`
   - `docs/LOOP-STATE.md`
   - `docs/DECISIONS.md`
   - `docs/GAME-VISION.md`
   - `docs/WORLD-BIBLE.md`
   - `docs/CHARACTER-BIBLE.md`
   - `docs/NARRATIVE-SPINE.md`
   - `HANDOFF.md`
   - relevant implementation docs
3. Inspect the latest merged commits and open PRs.
4. Inspect the current `.github/workflows/visual-qa.yml`.
5. Inspect the latest available Visual QA screenshots.
6. If deployment is available, inspect the real browser build.
7. Identify **one highest-impact bottleneck**.
8. Create a new branch from current `main`.
9. Begin the loop.

Do not start from memory.
Do not trust an old handoff over current `main`.
Do not start a new feature merely because it is easy to implement.

---

# 3. The loop kernel

Every engineering loop follows exactly this cycle:

## MODE OVERRIDE

Before selecting a bottleneck, inspect the top of `docs/LOOP-STATE.md`.

If it declares an active temporary mode such as **MOCKUP LOCK**, that mode overrides the normal priority queue until its pass condition is GREEN.

For MOCKUP LOCK:
- read `docs/MOCKUP-LOCK.md`;
- do not expand systems/content;
- optimize for Golden Frame similarity first;
- animation must happen inside the locked composition.

## OBSERVE
Inspect the **actual game**, not only source code.

For visual / combat work:
- use real browser rendering;
- inspect desktop 16:9;
- inspect mobile landscape;
- inspect the relevant combat keyframes.

For gameplay work:
- play the loop;
- identify what decision the player makes;
- identify what behavior changes because of it;
- identify whether the player can understand why the result happened.

## DIAGNOSE
Write a concrete failure statement.

Good:
> “Vael's intercept is readable, but the attacker never visibly travels into the collision, so the impact feels like two unrelated animations.”

Bad:
> “Combat needs more polish.”

The diagnosis must describe an observable player-facing problem.

## SELECT ONE BOTTLENECK
Fix the highest-impact failing layer first.

Priority order:

1. broken / unplayable / crash / deployment regression;
2. player cannot understand what to do;
3. player's choice does not visibly change behavior;
4. automatic battle is unreadable or boring;
5. character identity / emotional attachment is weak;
6. visual composition is below the approved target;
7. motion / impact / feedback is weak;
8. performance / mobile regression;
9. content breadth;
10. optional polish.

Do not solve ten unrelated things in one loop.

## HYPOTHESIZE
State what should become observably better.

Example:
> “If the breaker gains a wind-up, visible travel path, lunge, impact stop, and recoil, the opening exchange should read as one attack instead of separate VFX events.”

## IMPLEMENT
Make the smallest coherent change that can prove or disprove the hypothesis.

Rules:
- preserve independent environment / actor / HUD layers;
- do not regress to a baked single-image mockup;
- do not use a static concept image as the shipping game screen;
- temporary art must be explicitly temporary;
- production character art must preserve the approved character identity;
- do not silently introduce a new major economy / run structure / control model.

## BUILD
At minimum:
- application build passes;
- Prototype CI passes;
- relevant automated checks pass.

## CAPTURE
For every visual or combat PR, render actual screenshots.

Minimum:
- mobile landscape;
- desktop 16:9.

For the current tutorial battle, Visual QA should capture:
- READ;
- PLACEMENT;
- enemy CHARGE / opening attack;
- INTERCEPT / defensive reaction;
- major BURST / payoff;
- FINISH / resolution.

Capture timing must be anchored to the start of battle, not accumulated screenshot delay.

## COMPARE
Compare the new render against:
- the approved concept/composition target;
- the previous main render;
- the locked character identity;
- the current loop hypothesis.

Ask:
- Is it objectively clearer?
- Is the player's choice more visible?
- Does the screen look more like a commercial game and less like a prototype?
- Did any already-good area regress?
- Does the mobile version still read at a glance?

## REJECT OR ITERATE
If the new version is worse:
- do **not** merge it;
- revert / replace the experiment;
- keep the useful diagnosis;
- run another pass.

A failed experiment is acceptable.
A knowingly worse merge is not.

## GATE
Merge only when:
- build/CI passes;
- Visual QA passes where applicable;
- actual screenshots have been inspected;
- the target bottleneck is visibly improved;
- no major regression is introduced.

## MERGE
Use a focused PR.

After merge:
- update `docs/LOOP-STATE.md`;
- record what passed;
- record the next highest-impact bottleneck;
- immediately start the next loop unless a real design decision is required.

---

# 4. Autonomy boundary

The loop should be **highly autonomous inside locked direction**.

The agent may continue without stopping for approval when it is:

- fixing bugs;
- improving responsiveness;
- fixing mobile layout;
- improving readability;
- improving combat choreography;
- replacing temporary art with better art that preserves the locked identity;
- improving VFX / hit-stop / motion timing;
- improving tutorial clarity;
- improving debrief causality;
- adding QA / tests / screenshots;
- optimizing performance;
- improving existing provisional mechanics without changing their product meaning.

The agent must stop and ask the user when a change would lock or materially alter:

- the core fantasy;
- what the player controls vs surrenders;
- the permanent spatial model;
- the permanent run structure;
- the loss / recovery economy;
- permanent character death rules;
- the permanent recruitment model;
- monetization;
- a major roster / faction identity;
- a new core system that invalidates a locked decision.

Prototype experiments may test an open decision, but they must be labeled **PROVISIONAL** until the user locks the decision in `docs/DECISIONS.md`.

---

# 5. Do not stop after every micro-loop

The automation should continue through multiple loops in one working session.

Default behavior:

1. finish a loop;
2. inspect evidence;
3. if it passes, merge;
4. select the next bottleneck;
5. continue.

Stop only when:

- a true user decision is required;
- credentials / deployment permissions block progress;
- an external rate limit blocks the required evidence;
- tool/session limits are reached;
- a regression cannot be diagnosed safely;
- all current milestone gates are green.

When stopping for tool/session limits:
- update `docs/LOOP-STATE.md`;
- leave the repository in a reproducible state;
- state the exact next loop.

---

# 6. Visual truth rule

**Code is not visual evidence.**

Never claim a visual task is complete because:
- CSS was written;
- an animation exists in source;
- a component renders without errors;
- a mockup looks good outside the game.

For every visual change:

> IMPLEMENT → BUILD → RENDER → SCREENSHOT → INSPECT → ADJUST → SCREENSHOT AGAIN

The user explicitly requested this process.

The approved concept image is a **quality / composition proxy**, not a source to flatten into the game.

The final game must remain composed of replaceable live layers:
- environment;
- characters;
- enemies;
- VFX;
- world HUD;
- tutorial guidance;
- logs / debrief;
- route / meta UI.

---

# 7. Character-art rule

Characters are a core product feature.

A character is not finished because the silhouette is readable.

Production-quality characters must satisfy:

- attractive at first glance;
- consistent art direction with the approved cast;
- strong face / hair / costume identity;
- readable silhouette at game scale;
- emotionally desirable;
- recognizable in camp, formation, battle, dialogue, and loss/recovery contexts;
- no unexplained style drift between assets.

For combat, a static cutout being translated around the screen is only an intermediate solution.

Each core character should eventually have authored combat poses / frames for the actions that define them.

For example, Vael should visibly distinguish:
- idle / breath;
- guard-ready;
- brace;
- intercept movement;
- shield impact;
- hit reaction;
- counter / finish;
- recovery;
- downed / critical state.

Seris and Mirel require equally role-specific pose language.

Do not call a motion loop production-complete if the body pose never meaningfully changes.

---

# 8. Battle-readability rule

A viewer should understand major causes **without reading the combat log**.

For every important combat event, communicate:

1. **INTENT** — who is about to do what;
2. **TARGET** — who is affected;
3. **ACTION** — visible movement / cast / attack;
4. **CONTACT** — impact / protection / heal / trigger;
5. **RESULT** — HP / state / enemy formation changes;
6. **CAUSE** — why it happened when relevant.

Important chains should read visually, for example:

> Hunter targets Seris  
> → Vael recognizes the threat  
> → Vael intercepts  
> → shot contacts shield / Vael  
> → Seris keeps concentration  
> → Mirel stabilizes Vael  
> → Seris completes ritual  
> → moon burst resolves

If the log is required to understand the chain, the loop is not finished.

---

# 9. Strategic-choice rule

The game is not allowed to become an animation viewer.

Every core encounter must contain a meaningful player choice before COMMIT.

A valid choice:
- changes behavior;
- has a visible consequence;
- creates a tradeoff;
- can be understood after the fight;
- can lead to a different adaptation.

Invalid “choices”:
- hidden +3% bonuses with no visible effect;
- an obvious best button every time;
- cosmetic placement that does not affect combat;
- busywork that does not alter the battle.

The first-session choices should remain simple.

Depth should expand with mastery:
- onboarding = few, legible decisions;
- experienced player = richer conditional authorship;
- late mastery may approach the “A-style” tactical rule depth discussed during concept exploration, without burdening beginners.

---

# 10. Attachment / loss rule

The completed game must eventually prove the locked emotional thesis:

> “I did not lose a unit. Something that had become part of us is missing.”

Therefore later production loops must create systems that support:

- persistent individual identity;
- relationships / dependencies;
- memory of shared battles or events;
- visible absence when someone is lost;
- meaningful injury / rescue / recovery;
- expensive restoration;
- situations where replacing someone is efficient but emotionally undesirable.

Do not implement a disposable recruitment treadmill that destroys this premise.

---

# 11. Performance rule

Visual quality does not excuse broken mobile performance.

For every major art / motion pass, check:

- no catastrophic layout shift;
- no animation causing control lock;
- no repeated timers surviving phase changes;
- no unnecessary large DOM growth;
- no uncontrolled filter / blur stacking;
- reasonable mobile landscape performance;
- reduced-motion fallback remains valid;
- build remains deterministic enough for screenshot QA.

If a visually better version introduces obvious stutter, treat that as a regression and continue the loop.

---

# 12. Branch / PR protocol

One loop = one focused branch.

Suggested branch names:

- `combat-motion-v3`
- `vael-authored-frames-v1`
- `tutorial-command-v1`
- `loss-recovery-prototype-v1`
- `mobile-layout-v4`

A PR must include:

- observed problem;
- hypothesis;
- what changed;
- what did **not** change;
- evidence;
- regression notes;
- next bottleneck.

Do not merge an experiment only because substantial time was spent on it.

---

# 13. External failure handling

Differentiate **code failure** from **external infrastructure failure**.

Examples:
- Vercel build-rate-limit;
- provider outage;
- credential expiration.

If:
- local/CI build passes;
- Visual QA passes;
- the deployment provider fails only because of an external quota;

then:
- record the external block in `docs/LOOP-STATE.md`;
- do not misdiagnose it as a code regression;
- continue repository work when possible;
- retry deployment later.

Do not bypass a real application build error by calling it an infrastructure issue.

---

# 14. Completion ladder

The project is not “complete” because one tutorial battle looks good.

Progress through these gates in order.

## G0 — Repository integrity
PASS when:
- main builds;
- CI passes;
- reproducible browser run exists;
- no known blocker prevents basic play.

## G1 — Visual identity
PASS when:
- the screen reads as a commercial fantasy game;
- no major section looks like placeholder UI;
- hero art is stylistically coherent;
- the arena, camp, route, HUD, enemies, and VFX belong to one visual world;
- mobile landscape remains readable.

## G2 — Autobattle payoff
PASS when:
- at least two different prebattle configurations behave visibly differently;
- combat intent/action/contact/result are legible;
- the fight is enjoyable to watch without manual micro;
- major characters have authored action poses rather than only translated static cutouts;
- key interactions have satisfying motion, timing, VFX, and hit feedback.

## G3 — Tutorial vertical slice
PASS when a new player can complete a coherent onboarding sequence that teaches:
- threat reading;
- formation / preparation;
- COMMIT;
- automatic reaction;
- causal debrief;
- adaptation;
- at least one relationship / resonance concept.

The tutorial should feel like playing the real game, not reading a separate UI lesson.

## G4 — Strategic divergence
PASS when:
- two builds with similar raw power behave differently;
- both have legitimate strengths / weaknesses;
- the player can predict at least one consequence before COMMIT;
- post-battle adaptation can reverse or improve a failed plan.

## G5 — Character attachment
PASS when:
- characters persist beyond one battle;
- the player has concrete reasons to care about specific individuals;
- relationships affect behavior;
- injury / risk / absence has visible emotional and mechanical consequences.

## G6 — Loss / recovery proof
PASS when:
- character loss is possible;
- restoration is possible in at least one form;
- restoration is meaningfully expensive;
- replacement is sometimes more efficient;
- saving a beloved character can be a strategically inefficient but valid choice.

This gate requires the user's locked decision for the permanent recovery economy.

## G7 — Run loop
PASS when:
- a run contains multiple encounters;
- between-battle decisions matter;
- route / travel structure fits the Living Caravan fantasy;
- the run does not default to a copied Slay-the-Spire map grammar;
- encounters produce meaningful adaptation.

This gate requires the user's locked run-structure decision.

## G8 — Content minimum
PASS when the game has enough:
- characters;
- enemies;
- encounters;
- build interactions;
- events;
- recovery / relationship situations

to sustain the intended first release without obvious repetition.

Do not attempt G8 before G0–G7 are stable.

## G9 — Release candidate
PASS when:
- critical bugs are resolved;
- performance is acceptable on target devices;
- onboarding works;
- major loops are understandable;
- save/restart behavior is safe;
- visuals are coherent;
- audio / feedback are production-ready;
- deployment is stable;
- no known placeholder is being mislabeled as final.

**Only then call the game complete.**

---

# 15. Current loop family

As of the current main baseline, the project is in:

> **G1 → G2 transition: visual identity is substantially established; combat motion and authored action poses are now the major bottleneck.**

The next loops should prioritize:

1. authored Vael combat poses / frames;
2. Vael pose integration + real screenshot QA;
3. Seris role-specific cast / concentration / burst poses;
4. Mirel sense / heal / recovery poses;
5. authored enemy attack / hit / defeat poses;
6. smooth transition timing and mobile performance;
7. stronger causal debrief;
8. strategic divergence tests;
9. only then broaden tutorial / run systems.

The exact current state must always be read from `docs/LOOP-STATE.md`.

---

# 16. Loop scorecard

After each loop, score only the target area:

- **BROKEN** — unusable / regression;
- **RED** — clearly below target;
- **YELLOW** — functional but visibly prototype-level;
- **GREEN** — good enough to move to the next bottleneck;
- **LOCKED** — user-approved direction that should not be casually revisited.

Do not give the entire game a vanity score.

A loop passes only if its target moves upward without causing a higher-priority regression.

---

# 17. Anti-patterns

Never do these:

- keep adding systems because the current one feels unfinished;
- claim visual success without inspecting a real render;
- merge worse art because it took a long time to make;
- change character style between scenes;
- replace gameplay with a beautiful static mockup;
- build dozens of classes / items before the core loop is fun;
- hide unclear behavior behind more text;
- treat characters as disposable inventory;
- copy another game's UI, economy, map, roster, or identity;
- silently lock an open major design decision;
- optimize only for desktop and ignore mobile landscape;
- add particle spam instead of readable action;
- confuse “more effects” with “better combat”;
- stop after a successful micro-loop when the next bottleneck is obvious.

---

# 18. End-of-session handoff format

Before a session ends, update `docs/LOOP-STATE.md` with:

- current main commit / milestone;
- latest merged PR;
- current gate status;
- what was visually verified;
- what failed and was rejected;
- known external blockers;
- exact next bottleneck;
- exact next branch suggestion;
- files most likely to change next.

A new session should be able to resume in minutes without asking the user to reconstruct history.

---

# 19. Final operating command

When instructed only with:

> **“다음” / “계속 진행해” / “루프 계속”**

interpret it as:

1. read current `docs/LOOP-STATE.md`;
2. choose the highest-impact unresolved bottleneck allowed by the autonomy boundary;
3. execute the full loop;
4. inspect actual evidence;
5. reject or iterate if necessary;
6. merge only after gates pass;
7. update loop state;
8. continue to the next bottleneck while the session allows.

Do not answer with a plan only when implementation tools are available.

**The loop is complete only when the relevant release gate is green — not when code has merely been written.**
