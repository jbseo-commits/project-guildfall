# PROJECT GUILDFALL

> **Working title only.** Original fantasy autobattler / strategy roguelite experiment.

The project starts from one product thesis:

**Make the planning feel as consequential as a deckbuilder, then make the payoff feel as satisfying as watching your own autobattler build come alive.**

This repository is deliberately decision-first. Major systems are not considered decided until they are recorded in `docs/DECISIONS.md`.

## Start here

1. Read `START-HERE.md`.
2. Read `docs/GAME-VISION.md` and `docs/DECISIONS.md`.
3. In a new ChatGPT/Claude Code session, use `NEW-SESSION-PROMPT.md`.
4. Make **Decision 001** with the user before implementing the first real combat system.

## Tech baseline

- Web/mobile-first prototype
- Vite
- PixiJS
- JavaScript initially; TypeScript can be adopted by explicit decision
- 60 Hz render loop where supported
- Gameplay state kept separate from presentation state

## Non-goal

This is **not** a clone of any specific existing autobattler, JRPG, or deckbuilder. We can study genre grammar, but names, characters, art direction, UI, progression, combat rules, economy, and content must be original.
