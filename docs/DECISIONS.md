# DECISION LOG

A decision is not locked until the user explicitly chooses it.

## Locked

### D000 — Product thesis
**Status:** LOCKED

Create an original fantasy autobattler / strategy roguelite where meaningful strategic planning is followed by a satisfying automatic battle that visibly expresses the player's build.

### D000-B — Rendering baseline
**Status:** LOCKED FOR PROTOTYPE

Use PixiJS + Vite for the first web/mobile prototype. This is a prototype technology choice, not a permanent platform commitment.

---

## D001 — What fantasy are we actually selling?
**Status:** LOCKED

### Chosen direction — The Contract Guild

The player fantasy is to be the **mastermind of a small fantasy guild**: not the hero manually swinging the sword, but the person who prepares the team, makes a few meaningful tactical decisions, commits the plan, and then watches the guild execute it.

#### World premise
The guild accepts dangerous contracts that cannot be solved by raw strength alone. Each encounter is an assignment where the player reads the situation, assembles a compact team, gives them a plan, and sends them in.

#### What the player is building
Primarily a **guild + battle plan**, not a large army.

The important expression of a build should be visible behavior: who protects whom, who follows up, what event triggers another action, how the team reacts when the plan succeeds or breaks.

#### Why automatic combat makes sense
Once the operation begins, the guild members carry out the plan themselves. The player's authorship happens before the commitment boundary; the payoff is watching the plan become action.

#### Signature fantasy hook
> **“I don't swing the sword. I make the plan that makes my guild look brilliant.”**

#### Accessibility / mastery principle
The fantasy must **not require heavyweight tactical scripting from the beginning**.

Early play should use:
- very few choices at once;
- highly legible consequences;
- short battles;
- generous, exciting feedback when the player's plan works;
- choices that feel smarter than they are difficult to input.

The game should make a new player feel like a clever guild master quickly.

As mastery grows, the same fantasy may open into more detailed tactical authorship: richer conditions, priorities, sequencing, contingency planning, or other advanced controls. The exact form and unlock structure are **not decided here** and belong to D002 and later decisions.

This creates the intended progression:

**EASY TO COMMAND → SATISFYING TO WATCH → CLEAR TO UNDERSTAND → DEEP TO MASTER**

#### Visual identity implied by D001
Potential motifs include contracts, seals, guild marks, tactical directives, mission preparation, and visible cause-and-effect cues during battle. These are identity cues, not a locked art style.

#### What makes it unlike generic fantasy heroes fighting monsters
The core fantasy is not “collect heroes and watch stats collide.” The player's identity is expressed through **authorship of team behavior**, with the battle visibly proving whether the plan worked.

---

## D002 — What does the player control, and what do they surrender?
**Status:** OPEN — NEXT DECISION

D001 now establishes an important constraint for D002:

- the first-session control scheme must stay simple and immediately rewarding;
- advanced tactical authorship should exist as a mastery ceiling rather than an onboarding requirement;
- the commitment boundary must remain clear: prepare first, then watch the guild execute.

Candidate axes to decide:
- formation / placement;
- unit selection;
- ability loadout;
- command cards / tactics;
- target priorities;
- initiative/order scripting;
- pre-battle mana/resource allocation;
- conditional rules (“if ally < 40%, guard them”);
- between-wave adaptation.

The battle must contain a real commitment boundary after which the player watches the consequences.

---

## D003 — Spatial model
**Status:** BLOCKED

Not yet decided whether combat uses:
- lanes;
- grid;
- front/back rows;
- free 2D arena;
- radial positions;
- no explicit board at all.

---

## D004 — Run structure
**Status:** BLOCKED

Do not automatically use a Slay-the-Spire map. Decide whether the fantasy calls for a branching map, contracts, chapters, expeditions, days, districts, floors, seasons, or another structure.

---

## D005 — Art identity
**Status:** BLOCKED

Do not default to generic high-fantasy anime, generic pixel RPG, or card-game UI. Build visual identity from D001.
