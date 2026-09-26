# HANDOFF — PROJECT GUILDFALL

## Current phase

**Phase 1 — first Living Caravan vertical slice is implemented on a prototype branch.**

Active branch: `prototype/living-caravan-slice-v1`

Playable hypothesis:
**READ → choose protection target → COMMIT → WATCH → LOSS → RECOVER OR LEAVE**

This is deliberately a test harness, not a locked combat model. See `docs/VERTICAL-SLICE-V1.md`.

## Locked identity

Read `docs/DECISIONS.md` before changing anything.

The current fantasy is the **Living Caravan**: a wandering living dungeon/sanctuary made of beautiful, dangerous, highly charismatic beings who function as an interdependent ecosystem.

Key emotional principles are locked:

- characters are **organs, not inventory**;
- losing a character should feel like losing part of the player's own living system;
- characters can be lost;
- recovery can be possible but should demand a painful cost;
- **attachment may make the player strategically inefficient**, and choosing that inefficiency is part of the intended fun.

## Current prototype

The slice currently contains:

- three prototype inhabitants: Vael, Seris, Mirel;
- one simple pre-battle choice: who Vael protects;
- a deterministic ~10 second PixiJS automatic battle;
- visible praise/debrief messages connecting the player's choice to battle events;
- one member becoming downed depending on the protection decision;
- a post-battle choice between expensive recovery and efficient abandonment;
- replay with the alternate protection choice.

The character visuals are **temporary procedural silhouettes**. They do NOT satisfy the final art bar. D001 requires extremely attractive, charismatic, beautiful-but-uncanny characters. Do not mistake these placeholders for D005.

## User intent

The user wants an original fantasy autobattler / strategy roguelite developed collaboratively through explicit design decisions.

The core product pleasure remains:

- strategic authorship before automatic resolution;
- strong WATCH payoff;
- clear cause and effect;
- emotional attachment to a small cast;
- an ecosystem that feels alive rather than a roster of disposable units.

## Hard rules for future sessions

- Read `START-HERE.md` first.
- Read `docs/DECISIONS.md` before changing design or code.
- Do not silently lock major systems.
- Do not promote prototype assumptions into D002 without the user's explicit decision.
- Prefer one strong core loop over broad content.
- Treat battle readability and animation payoff as product features.
- Do not add rarity-driven replacement pressure that turns beloved characters into disposable upgrades without an explicit design decision.
- Keep simulation/game state independent from rendering.
- Mobile portrait remains first-class.

## Next action

1. Let the user play/inspect vertical slice v1.
2. Collect reaction specifically around:
   - whether the one planning choice is legible;
   - whether WATCH feels rewarding;
   - whether the downed character creates an emotional response;
   - whether recovery vs abandonment creates a genuine conflict.
3. Use that feedback to run **D002 — what the player controls, and what they surrender**.
4. Do not scale content before that.

## Engineering state

- Vite + PixiJS.
- `src/game/prototype.js` contains deterministic prototype battle data/state.
- `src/main.js` contains PixiJS presentation/input.
- `vite.config.js` uses portable relative asset paths.
- prototype CI validates `npm install && npm run build`.
