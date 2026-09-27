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
**Status:** IMPLEMENTED AS WORKING ARCHITECTURE (Phase 2 Core Loop)

The core control triad implemented in the Loop Engineering phase:
1. **Spatial Formation (FRONT / CORE / VEIL)**:
   - Sets aggro priority and intrinsic role modifiers (FRONT: +15% innate damage mitigation; CORE: +25% heal & resonance efficacy; VEIL: +30% ritual/channel speed).
2. **Resonance Pair (Bond)**:
   - Defines autonomous trigger-reaction chains between two bonded inhabitants (e.g. `vael_seris` Intercept, `vael_mirel` Emergency Heal & Barrier, `seris_mirel` Channel acceleration).
3. **Battle Directive (Edict)**:
   - Inscribes one battle-wide strategic modifier with strength and tradeoff (`shell` defense, `moon` ritual rush, `roots` sustain).

**Commitment Boundary**:
After pressing COMMIT, all player micro-control is surrendered. The autonomous simulation executes deterministically, outputting an EventStream for the BattleDirector.

**Debrief & Adaptation**:
Post-combat CausalDebrief extracts the top 1–3 decisive causes of victory/defeat, feeding into a single post-battle adaptation decision before the caravan advances.

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

## D005 — Art identity & Sprite Pipeline
**Status:** LOCKED FOR PROTOTYPE

Do not default to generic high-fantasy anime, generic pixel RPG, or card-game UI.

D001 requires that the art direction preserve:
- highly attractive and charismatic character designs;
- beautiful-but-uncanny fantasy;
- a visibly living caravan/ecosystem;
- individual characters that feel worth protecting and remembering.

### Production Sprite Pipeline (`sprite-gen` Standard)
1. **SSOT Master Art**: High-resolution 1:1 bust portraits for Camp and HUD avatars; full-body 4x2 sprite sheets for battle.
2. **8 Canonical Keyposes**:
   - 0: Idle (Breathing / Float)
   - 1: Windup (Preparation / Catalyst raise)
   - 2: Brace / Channel (Shield guard / Moon ritual)
   - 3: Crouch / Absorb (Low defense / Botanical prayer)
   - 4: Hit / Recoil (Impact stagger)
   - 5: Lunge / Dash (Forward charge / Graceful step)
   - 6: Special (Vael Intercept / Seris Moon Burst / Mirel Blossom Pulse / Warden Roar)
   - 7: Recovery / Down (Ground return / Collapse)
3. **Chroma Cutout & Foot Grounding**: `#FF00FF` solid magenta chroma unmixed to transparent alpha with edge defringing. Foot-contact center (`footX`, `footY`) calculated dynamically to anchor actors naturally on the arena floor plane.
4. **Team Silhouette Backlight**: Allies receive gold outline (`#ffe694`), Enemies receive crimson/void outline (`#ff708a`).
