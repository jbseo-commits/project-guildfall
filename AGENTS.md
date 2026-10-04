# AGENTS.md

## Product workflow

1. Read `START-HERE.md`, `HANDOFF.md`, and `docs/DECISIONS.md` before substantial work.
2. Major game-design decisions require an explicit entry in `docs/DECISIONS.md`.
3. If a requested implementation would implicitly decide an unresolved major design question, surface that choice first unless the user has already made it.
4. For small implementation details, make a reasonable choice and document it only if it creates future constraints.

## Engineering principles

- Keep simulation/game state independent from rendering.
- PixiJS owns the game scene; DOM is reserved for menus/accessibility/debug UI when appropriate.
- No game rule may depend on frame rate.
- Deterministic seeds should be supported early for debugging and A/B evaluation.
- Mobile portrait is a first-class target; landscape and desktop are secondary but supported.
- Prefer data-driven units, abilities, synergies, encounters, and status effects.
- Write tests for combat resolution and deterministic state transitions before content scale-up.

## Visual principles

- Battle silhouettes and intent must read at gameplay size.
- Do not substitute visual noise for feedback.
- Major automatic actions should have anticipation → action → impact → recovery.
- The player must be able to connect a strategic choice to what happens on screen.

## Reference boundary

Study genre patterns, never reproduce protected art/assets/text or a distinctive game wholesale.

## Claude 모델 분업

Claude Code에서 이 루프를 수행하면 [모델 분업](docs/MODEL-ROUTING.md)의 역할·advisor 상담·실행 확인을 함께 따른다. 이 지침은 기존 품질·권한·중단 조건을 대체하지 않는다.
