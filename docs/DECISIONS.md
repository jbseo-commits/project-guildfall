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

### Chosen direction — The Living Caravan

The player leads a **wandering, living dungeon-caravan**: a mobile sanctuary/ecosystem made of beautiful, dangerous, otherworldly beings.

This is a fusion of:
- the **journey, procession, attachment, and visible travel** of a monster caravan;
- the **reactive ecology, interdependence, and living-system identity** of a sentient dungeon.

The fantasy is not “collect generic monsters.” It is to cultivate and lead a **beautiful, uncanny living ecosystem** whose members visibly depend on one another.

#### Player fantasy
The player is the keeper/conductor of a moving sanctuary: responsible for where it travels, who belongs within it, and how its inhabitants coexist and respond when threatened.

#### What the player is building
Not merely a party and not a disposable army.

The player is building:
- a small cast of highly distinctive inhabitants;
- relationships and dependencies between them;
- a living structure that changes how they behave;
- a caravan/ecosystem whose composition is visible during automatic combat.

#### Why automatic combat makes sense
When danger appears, the ecosystem reacts.

Its inhabitants defend, protect, feed, empower, transform, lure, or rescue one another according to their nature and the relationships the player has created. The player's authorship happens before the commitment boundary; the reward is watching the whole organism respond.

#### Character identity constraint
The inhabitants must be **extremely attractive, charismatic, and emotionally desirable characters**, even when they are inhuman.

The intended visual/emotional space is:
- beautiful + dangerous;
- elegant + uncanny;
- alluring rather than disposable;
- strong silhouette and individual identity;
- “I want this character to stay with me,” not “this is another recruit token.”

Avoid a roster that reads as ugly fodder, generic fantasy units, or interchangeable monsters.

#### Signature fantasy hook
> **“I lead a wandering sanctuary of beautiful, dangerous beings — and watch the ecosystem I built come alive when threatened.”**

#### What makes it unlike generic fantasy heroes fighting monsters
The core build is an **interdependent moving ecosystem**, not a stack of class bonuses.

Potential synergy language should grow from the fiction — for example protection, symbiosis, resonance, predation, mutation, shelter, attraction, or sacrifice — rather than defaulting to generic race/class +X% bonuses.

The exact synergy system is NOT locked here.

---

### D001-B — Characters are organs, not inventory
**Status:** LOCKED DESIGN PRINCIPLE

A member of the caravan should feel less like a replaceable unit and more like **a limb, organ, sense, or beloved part of the player's living ecosystem**.

The player should become attached to specific characters and should strongly resist abandoning them.

Design consequences:
- characters must accumulate personal meaning, not only power;
- replacing a member with a numerically better stranger should not be an emotionally neutral optimization;
- relationships and dependencies should make one member's absence visibly affect others and the whole caravan;
- loss, separation, injury, rescue, and recovery should carry emotional and mechanical weight;
- the game should avoid treating recruitment as a conveyor belt of disposable bodies.

This principle does **not** yet decide whether death is permanent, reversible, rare, preventable, or transformed into another state. Those mechanics belong to the later loss/damage/recovery decision.

The target emotion is:

> **“I did not lose a unit. Something that had become part of us is missing.”**


### D001-C — Attachment should create meaningful inefficiency
**Status:** LOCKED DESIGN PRINCIPLE

Characters can be lost.

However, loss should not automatically mean that the optimal response is to replace the missing character with a fresh equivalent.

The game should deliberately allow emotional attachment to create strategically inefficient choices.

If the player wants a beloved character back, recovery should be possible in some form, but it should demand a **large and meaningful cost**: resources, time, route opportunity, risk, ecosystem damage, or another sacrifice.

The exact recovery mechanic and economy are NOT decided yet.

The important principle is:

> **“Love makes you inefficient — and choosing that inefficiency is part of the game.”**

Design consequences:
- recovery must feel like a real sacrifice, not a trivial reset button;
- the player should sometimes face a painful choice between preserving the run and preserving a character;
- replacement should often be cheaper than restoration, but emotionally worse;
- a restored character should feel like someone who was saved, not a file reloaded;
- permanent loss must remain possible enough that survival has weight.

This principle will constrain the later loss / damage / recovery economy decision.

---

## D002 — What does the player control, and what do they surrender?
**Status:** OPEN — NEXT DECISION

D001 establishes constraints for D002:

- controls should make the ecosystem feel authored without requiring constant micro;
- the first-session interaction must remain simple and immediately rewarding;
- player choices should create visible relationships/behaviors between characters;
- the commitment boundary must remain clear: prepare/arrange first, then watch the living system respond;
- deeper tactical authorship may emerge later as mastery, but must not burden onboarding.

Candidate axes to decide:
- caravan order / formation / placement;
- which inhabitants join an encounter;
- relationship or bond assignments;
- behavior priorities;
- environmental/ecosystem nodes;
- ability or instinct loadout;
- conditional reactions;
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

Do not automatically use a Slay-the-Spire map. Decide whether the fantasy calls for a branching map, routes, migrations, regions, seasons, shelters, hunts, pilgrimages, or another structure.

---

## D005 — Art identity
**Status:** BLOCKED

Do not default to generic high-fantasy anime, generic pixel RPG, or card-game UI.

D001 now requires that the art direction preserve:
- highly attractive and charismatic character designs;
- beautiful-but-uncanny fantasy;
- a visibly living caravan/ecosystem;
- individual characters that feel worth protecting and remembering.
