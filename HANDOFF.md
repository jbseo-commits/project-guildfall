# HANDOFF — PROJECT GUILDFALL

## Current phase

**Phase 1B — narrative emotional vertical slice is live on `main`.**

Public preview:
`https://project-guildfall.vercel.app`

Current playable loop:
**COLD OPEN → CARAVAN DIALOGUE → PROTECTION CHOICE → CHARACTER REACTION → COMMIT → WATCH → LOSS → AFTERMATH → RECOVER OR LEAVE → MEMORY**

The first combat-only slice failed the emotional test because the player had no reason to care about the characters before combat. The current version explicitly fixes that.

See `docs/VERTICAL-SLICE-V2.md`.

## Locked identity

Read `docs/DECISIONS.md` before changing anything.

The current fantasy is the **Living Caravan**: a wandering living dungeon/sanctuary made of beautiful, dangerous, highly charismatic beings who function as an interdependent ecosystem.

Key emotional principles are locked:

- characters are **organs, not inventory**;
- losing a character should feel like losing part of the player's own living system;
- characters can be lost;
- recovery can be possible but should demand a painful cost;
- **attachment may make the player strategically inefficient**, and choosing that inefficiency is part of the intended fun.

## Current narrative slice

The live slice now contains:

- a cold open establishing a dying world and the living caravan Arca;
- a nighttime caravan scene before combat;
- character dialogue that gives Vael, Seris, and Mirel recognizable personalities before risk appears;
- a threat reveal that makes the tactical choice fictionally motivated;
- a simple choice: who Vael protects;
- character reactions to the player's order before COMMIT;
- a deterministic ~10 second automatic battle;
- battle dialogue plus cause/effect feedback;
- a specific character becoming downed based on the protection choice;
- a post-battle aftermath scene with character reactions;
- an explicit tension between efficient abandonment and costly recovery;
- a memory scene after either choice so outcomes leave narrative residue.

The current character visuals are still stylized prototype portraits, **not the final D005 art bar**. D001 still requires extremely attractive, charismatic, beautiful-but-uncanny characters.

## Critical product lesson from V1

A battle by itself is not enough.

The player must meet the characters **before** being asked to risk them.

The desired emotional sequence is:

**KNOW THEM → HEAR THEM → MAKE A CHOICE ABOUT THEM → WATCH THE CONSEQUENCE → MISS THEM → PAY TO KEEP THEM**

Do not remove narrative context in pursuit of a shorter combat test.

## Hard rules for future sessions

- Read `START-HERE.md` first.
- Read `docs/DECISIONS.md` before changing design or code.
- Do not silently lock major systems.
- Do not promote prototype assumptions into D002 without the user's explicit decision.
- Prefer a small cast with strong authored personality over content breadth.
- Relationship scenes and battle readability are both product features.
- Do not add rarity-driven replacement pressure that turns beloved characters into disposable upgrades.
- Mobile portrait remains first-class.
- Character loss must create visible narrative residue.
- Final character art must eventually exceed the current procedural prototype quality by a large margin.

## Engineering state

- Vite remains the build system.
- `src/game/prototype.js` contains deterministic battle data/state.
- `src/main.js` currently uses DOM/CSS for reliable mobile rendering after the Pixi startup path produced blank screens on the deployed mobile build.
- PixiJS remains the intended battle renderer direction, but should only be reintroduced after the web/mobile baseline remains stable.
- Vercel auto-deploys `main`.
- Latest deployment should be verified on an actual mobile browser after every visual loop.

## Next action

1. User plays the live narrative slice.
2. Judge:
   - whether the cold open creates curiosity;
   - whether each of the three characters feels different;
   - whether the protection choice now carries emotional meaning;
   - whether the loss scene creates hesitation;
   - whether the expensive rescue choice feels personally tempting.
3. Improve writing, pacing, visual identity, and character art before adding content breadth.
4. Only after the emotional loop works should D002 be locked.
