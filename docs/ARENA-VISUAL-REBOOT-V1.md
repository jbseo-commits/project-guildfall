# ARENA VISUAL REBOOT V1 — QUALITY BAR

## Why this reboot exists

The previous tutorial V3 proved interaction flow, but visually it still read as a mobile UI prototype with stacked cards.

That is **not acceptable** as the target game presentation.

The reference quality bar supplied by the user establishes a different standard:

- the **battlefield dominates the screen**;
- units exist as real actors in a spatial arena, not portrait cards;
- combat readability comes from positioning, movement, VFX, health bars, targeting markers, and animation;
- the bottom HUD summarizes the party without replacing the battlefield;
- tutorial guidance appears as temporary overlays on top of the real game, not as separate tutorial pages;
- the screen should feel like a finished commercial game before explanatory text appears.

## Mandatory screen composition

Primary target: **16:9 landscape**.

### Battlefield
- occupy roughly 75–82% of screen height;
- full illustrated environment, not flat panels;
- clear arena bounds and focal center;
- 3–5 player actors and 3–5 enemy actors visible simultaneously;
- real movement between positions;
- readable projectiles, shields, casts, impacts, heals, aggro/target indicators;
- subtle camera shake, hit stop, and focus zoom during important events;
- no oversized UI cards covering the battlefield during active combat.

### Bottom HUD
Each allied character must have:
- portrait/silhouette;
- HP;
- current action/state;
- 3–5 small ability/status icons;
- highlight when that character's planned behavior triggers.

Enemy side should expose:
- HP;
- intent/priority indicators;
- current status.

### Planning overlay
Planning happens on the **same arena**.

The player should:
- select units directly in the arena;
- reposition them spatially;
- create a resonance link by dragging/connecting two actors;
- choose one battle edict from a compact lower panel;
- press COMMIT from the HUD.

No full-screen card menu should replace the battlefield.

### Tutorial presentation
Tutorial is an overlay on the live game.

Examples:
- dim everything except FRONT while explaining positioning;
- draw an animated arrow from enemy intent to the unit that will receive it;
- pulse two characters when teaching resonance;
- show TRIGGER → REACTION → PAYOFF beside the actual actors while the fight is paused;
- resume battle and let the player watch the exact taught rule fire.

The player should never feel they left the game to read a tutorial page.

## Art target

Final direction remains:
- beautiful + dangerous;
- highly attractive charismatic cast;
- elegant uncanny fantasy;
- living sanctuary/ecosystem motifs.

The current CSS portraits are **not acceptable final or near-final art**.

Before the next quality claim, the slice needs:
1. one finished arena background;
2. at least three production-quality hero sprites;
3. at least three production-quality enemy sprites;
4. readable animation poses;
5. coherent HUD art;
6. battle VFX that match the art direction.

## Animation target

Minimum hero loop:
- idle/breath;
- locomotion;
- wind-up;
- attack/cast;
- hit reaction;
- special reaction;
- downed.

Important actions must interpolate smoothly. Avoid frame-jump presentation that reads as swapping static poses.

## Tutorial chapter structure

The existing strategic grammar remains useful:

**READ → BUILD → COMMIT → WATCH → UNDERSTAND**

But it must now be taught entirely inside the arena:

### Beat 1 — Formation
Highlight FRONT / CORE / VEIL directly on the floor.

### Beat 2 — Resonance
Create a visible tether between two characters.
When triggered, the tether lights and carries the reaction.

### Beat 3 — Edict
Choose one compact command from the HUD.
The chosen command becomes a persistent battle-state badge.

### Beat 4 — Final exam
All overlays disappear except enemy intent.
Player solves the fight in the real arena.

## Acceptance criteria

Do not call the visual slice successful unless:
- a screenshot without tutorial text still looks like a real game;
- the battlefield is visually dominant;
- each unit can be understood at a glance;
- important automatic reactions are readable without reading logs;
- the bottom HUD supports, rather than replaces, the battle;
- the scene is attractive enough that watching the fight is intrinsically rewarding;
- tutorial overlays can be removed and the underlying game still looks finished.

## Development rule

Do **not** polish V3's stacked-card tutorial UI.

Build the arena-first presentation on branch:

`visual-reboot/arena-tutorial-v1`

The branch should remain isolated until the arena quality bar is met.
