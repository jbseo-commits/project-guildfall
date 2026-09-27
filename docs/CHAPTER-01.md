# CHAPTER 01 — LEAVING NIGHT IMPLEMENTATION

> **Status: PROVISIONAL CONTENT PACK**
>
> Source data: `src/content/chapter01.js`
>
> This chapter is designed to plug into the current tutorial without changing D002–D004.

---

## Goal

The existing tutorial already teaches:
- threat reading;
- placement;
- COMMIT;
- autonomous reaction;
- debrief.

Chapter 01 gives those mechanics a reason to exist.

The target emotional sequence is:

> **warmth → wrongness → threat → plan → automatic protection → care → departure**

The player should finish the tutorial remembering the three characters, not only the buttons.

---

## Runtime integration order

When the active combat-art loop is safe to integrate narrative, use this order:

### 1. Camp warmth
Show 10–20 seconds of living-camp behavior before tutorial UI dominates the screen.

Do not force the player to read a lore panel.

### 2. Hush sign
One visual anomaly:
- frozen flame;
- crystallizing bark;
- silent insect.

Keep it short.

### 3. Enemy arrival
Seris interprets the threat.

This naturally opens the existing “적의 의도 읽기” tutorial.

### 4. Existing planning tutorial
Reuse current formation UI.

Character barks should reinforce role comprehension.

### 5. Existing battle
Use `battle_barks` from the content file at already-existing combat beats.

Barks should be short enough not to obscure combat.

### 6. Existing debrief
Replace purely instructional framing with:
- causal explanation;
- character acknowledgement.

### 7. Departure
Return to camp / route framing.

The player sees the caravan move because remaining still has become dangerous.

---

## Presentation rule

Never put long dialogue over the most important combat contact.

Recommended safe moments:
- pre-telegraph;
- short target callout;
- after impact;
- charge windup;
- post-battle.

During:
- INTERCEPT contact;
- moon burst contact;
- major hit-stop;

prefer a 1–4 word bark or no text.

---

## First chapter pass criteria

The chapter is GREEN only if a new player can infer, without reading a lore encyclopedia:

1. this group lives together;
2. remaining still is dangerous;
3. Seris can read patterns;
4. Vael protects people;
5. Mirel notices and repairs damage;
6. the trio survived because of their relationships;
7. leaving the forest is necessary.

---

## Attachment experiment candidate

The optional “Mirel's bloom” choice is intentionally small.

It is useful because it can test D001-C early:

> will the player accept a slight strategic cost for something that only matters because Mirel cares about it?

Do not make the cost large in the tutorial.

The first test should measure:
- whether players understand the tradeoff;
- whether they care;
- whether the choice feels manipulative.

This is **not** a permanent economy decision.

---

## Integration safety

Antigravity / other agents working on authored combat frames should not need to rewrite this content.

Keep narrative data separate from:
- animation timing;
- actor rendering;
- formation logic;
- combat resolution.

The presentation layer should consume content IDs and trigger barks at existing semantic battle events.


---

## Parallel-loop ideas retained after PR #19 closed itself as duplicate

The autonomous local loop independently produced a first-act draft before noticing the newer canonical world foundation on `main`.

The duplicate world bible was correctly **not** merged.

A few narrative ideas were compatible enough to retain here:

### 1. The attackers want a person, not generic victory
The first encounter becomes emotionally clearer if the rear-targeting hunter is trying to **take Seris**.

That turns tutorial targeting from:
> “blue arrow means rear attack”

into:
> “someone is trying to take one of ours.”

This reinforces the Living Caravan thesis immediately.

### 2. COMMIT should have fictional language
Working copy:

> **문을 닫는다.**

Secondary:

> 이제 서로를 믿어야 합니다.

The exact wording remains provisional, but the principle is useful:
the commitment boundary should feel like an action inside the world, not a generic “START BATTLE” button.

### 3. The debrief should show the relationship chain
Preferred causal presentation:

> 세리스가 표적이 됨  
> → 베일이 가로막음  
> → 베일이 가장 위험한 상태가 됨  
> → 미렐이 베일을 회복  
> → 세리스 집중 유지  
> → 월광 의식 완성

The player should be able to point backward to the placement decision and think:

> “내가 저 관계가 작동하도록 만들었다.”

### 4. Optional chapter-ending mystery
A recovered attacker mark may match an old sealed structure inside the caravan.

A pulse from behind the seal can imply:
- the caravan has a history the current trio does not fully understand;
- outside groups may know something about it;
- the home itself can become a mystery.

This is a **PROVISIONAL hook**, not locked lore.

### 5. Physical home memory
After meaningful battles, the caravan itself should eventually remember:
- a new protective growth;
- changed resting positions;
- a repaired wall;
- an empty place;
- a new map or object.

This idea belongs in future attachment loops because it makes “the caravan is the party” visible.
