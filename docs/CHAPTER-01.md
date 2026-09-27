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
