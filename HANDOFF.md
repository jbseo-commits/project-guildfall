# HANDOFF — PROJECT GUILDFALL

## Current phase

**Phase 1C — full autobattler tutorial chapter is live on `main`.**

Public preview:
`https://project-guildfall.vercel.app`

Current tutorial grammar:
**READ → BUILD → COMMIT → WATCH → UNDERSTAND**

The current playable tutorial is no longer a single scripted battle. It teaches three strategic layers progressively and ends with an unguided final exam.

See `docs/VERTICAL-SLICE-V3.md`.

## Locked identity

Read `docs/DECISIONS.md` before changing anything.

The current fantasy is the **Living Caravan**: a wandering living dungeon/sanctuary made of beautiful, dangerous, highly charismatic beings who function as an interdependent ecosystem.

Locked emotional principles:

- characters are **organs, not inventory**;
- losing a character should feel like losing part of the player's own living system;
- characters can be lost;
- recovery can be possible but should demand a painful cost;
- **attachment may make the player strategically inefficient**.

## Critical lessons from V1/V2

### V1 failure
A combat-only demo did not create enough attachment or explain the game.

### V2 improvement
Narrative context made the cast more legible, but the actual strategic choice was still too shallow to read as an autobattler.

### V3 response
The tutorial now teaches:

1. **Formation** — FRONT / CORE / VEIL.
2. **Resonance** — connect two inhabitants using visible TRIGGER → REACTION → PAYOFF chains.
3. **Edict** — choose one battle-wide tactical principle with an explicit trade-off.
4. **Independent exam** — read enemy intents and combine all three systems with no recommendation marker.

Every battle has a hard COMMIT boundary and a post-battle cause-chain debrief.

## Current prototype assumptions

Do NOT silently promote these to D002/D003 final decisions:

- exactly three formation slots;
- exactly one resonance link;
- exactly one edict;
- current numeric bonuses and thresholds;
- current enemy intent rules.

They are a coherent tutorial hypothesis used to test whether the game's strategic grammar works.

## UX requirement

The desired beginner progression is:

**ONE NEW IDEA → GUIDED USE → WATCH IT WORK → EXPLAIN WHY → ADD ONE MORE IDEA**

The final tutorial encounter must remove recommendation cues.

Automatic combat must not be opaque. The game should expose why a build behaved the way it did.

## Art requirement

Current CSS/procedural portraits remain prototype art only.

Final D005 still requires:
- extremely attractive and charismatic characters;
- beautiful-but-uncanny fantasy;
- strong silhouettes;
- visible ecosystem relationships;
- presentation quality far above current placeholders.

## Engineering state

- Vite build system.
- Vercel auto-deploys `main`.
- `src/game/tutorial.js` defines tutorial mechanics, encounters, scoring, and cause-chain data.
- `src/main.js` implements the full tutorial flow.
- `src/style.css` provides the current mobile-first presentation.
- DOM/CSS remains the stable mobile presentation baseline after the first Pixi startup path produced a blank deployed screen.
- PixiJS can be reintroduced into the WATCH/battle layer later, but only behind a reliable first paint/fallback.

## Next action

1. User plays V3 on mobile.
2. Judge whether it now clearly reads as an autobattler.
3. Specifically test:
   - whether enemy intent is understood;
   - whether formation manipulation is intuitive;
   - whether resonance reads as a behavior chain rather than a passive buff;
   - whether edicts have meaningful trade-offs;
   - whether the final exam feels like the player is genuinely building a solution;
   - whether the debrief explains causality.
4. Do not add content breadth until this strategic grammar is convincing.
