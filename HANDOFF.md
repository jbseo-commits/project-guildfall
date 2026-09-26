# HANDOFF — PROJECT GUILDFALL

## Current phase

**Phase 0 — decision architecture / blank-slate prototype.**

No core combat model has been approved yet.

## User intent

The user wants to create an original fantasy autobattler with their own identity, developed collaboratively through explicit design decisions rather than receiving a finished concept imposed by the assistant.

The motivating design insight is the combination of:

- deckbuilder-like / roguelite strategic decision weight;
- autobattler-like payoff of watching your build execute;
- strong game-feel and visual readability using PixiJS.

## Hard rules for future sessions

- Read `START-HERE.md` first.
- Read `docs/DECISIONS.md` before changing design or code.
- Do not silently lock major systems.
- For every major design fork, present concrete options and tradeoffs, get the user's decision, then record it.
- Prefer one strong core loop over a broad pile of systems.
- Treat battle readability and animation payoff as product features, not polish added at the end.
- Do not copy a reference game's named systems, character designs, UI layout, progression table, or content.
- Use references to understand *why a genre pattern works*, then implement an original expression.

## Next action

Run Decision 001 in `docs/DECISIONS.md`.

Do not implement the real battle engine until Decision 001 and Decision 002 are locked.

## Engineering state

A minimal Vite + PixiJS shell exists only to prove the toolchain and give us somewhere to render prototypes.
It contains no final gameplay rules.

## Working title

`PROJECT GUILDFALL` is a temporary codename and should be renamed once the fantasy identity is locked.
