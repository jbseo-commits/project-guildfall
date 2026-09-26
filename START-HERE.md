# START HERE — PROJECT GUILDFALL

## What we are building

A new original fantasy autobattler / strategy roguelite created collaboratively with the user.

The experience we want to explore is:

> **PLAN → COMMIT → WATCH → UNDERSTAND → ADAPT**

The player should make meaningful pre-combat or pre-exchange decisions, then briefly lose direct control and watch those decisions become a readable, satisfying battle. The result must teach the player *why* the build worked or failed, creating the next decision.

## What is already decided

Only these are locked:

1. It is fantasy, but the specific world/theme is **not decided**.
2. Combat has a meaningful automatic-resolution component.
3. The player must have high-agency strategic decisions before or between automatic combat beats.
4. Watching the battle is part of the reward, not a disposable loading animation.
5. PixiJS is the default prototype renderer because it is well suited to a game-like scene graph, sprites, VFX, timing, and mobile web deployment.
6. We will build a vertical slice before building content breadth.
7. We will not copy another game's IP, visual identity, exact economy, exact unit roster, or UI.

Everything else is open.

## First task in a new session

Do **not** start by inventing 30 classes or implementing a full combat engine.

Read this file and `docs/DECISIONS.md`, then work through **Decision 001: What fantasy are we actually selling?** with the user.

Present 3 sharply differentiated directions. Each direction should answer:

- Who does the player *feel like* they are?
- What are they building: a party, guild, caravan, cult, army, school, expedition, etc.?
- Why do fights happen?
- What makes a run visually and mechanically recognizable as *this game*?
- What is the unique fantasy hook that could fit in one sentence?

The user chooses or combines. Record the result in `docs/DECISIONS.md` before moving to Decision 002.

## Decision order

1. Fantasy / player identity
2. Combat ownership: what the player controls vs watches
3. Board topology / party size / spatial logic
4. Unit identity and synergy language
5. Run structure and between-battle decisions
6. Loss / damage / recovery economy
7. Recruitment / drafting / deck-like decision layer
8. Visual direction
9. First vertical slice encounter

## Vertical-slice target

The first playable slice should eventually prove only this:

- The player can form a small build.
- Two meaningfully different builds behave differently without manual micro.
- The automatic battle is visually readable and fun to watch for roughly 5–15 seconds.
- The result clearly exposes the cause of success/failure.
- The player gets one interesting adaptation decision and wants to try again.

If the slice does not prove those five things, do not add meta-progression.
