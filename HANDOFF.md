# HANDOFF — PROJECT GUILDFALL

## Current phase

**Phase 1D — arena-first layered battle is implemented on branch `arena-layered-battle-v2`.**

The project has moved past the static high-fidelity concept mockup.

The current target is now:

**REAL ARENA LAYERS → REAL ACTOR MOVEMENT → READABLE AUTO COMBAT → LIVE HUD → DEBRIEF**

See:
- `docs/ARENA-VISUAL-REBOOT-V1.md`
- `docs/ARENA-LAYERED-BATTLE-V2.md`

## Locked identity

Read `docs/DECISIONS.md` before changing anything.

The current fantasy is the **Living Caravan**:
a wandering living dungeon/sanctuary made of beautiful, dangerous, highly charismatic beings who function as an interdependent ecosystem.

Locked emotional principles:
- characters are **organs, not inventory**;
- losing one should feel like losing part of the living system;
- characters can be lost;
- recovery can exist but should be painfully expensive;
- attachment may make the player strategically inefficient.

## Critical visual direction

The user explicitly rejected a tutorial that looked like stacked cards / a UI prototype.

The accepted visual standard is an **arena-dominant commercial game screen**:
- battlefield dominates;
- characters exist in space;
- bottom HUD supports the battlefield;
- tutorial guidance overlays the live game;
- no separate tutorial page replacing the game;
- a screenshot without tutorial text should still look like a game.

The approved concept art is the current quality/composition proxy.

## Current layered implementation

Branch `arena-layered-battle-v2` now separates:

- painted environment proxy;
- player actors;
- enemy actors;
- FRONT / CORE / VEIL floor slots;
- enemy intent arrows;
- resonance tether;
- world HP bars;
- battle VFX;
- party HUD;
- enemy HUD;
- tutorial coach;
- post-battle debrief.

### Planning
The player can:
- select a hero in the world or HUD;
- move them between FRONT / CORE / VEIL;
- swap occupied positions;
- see the HUD update immediately.

### After COMMIT
No micro-control.

The current autonomous sequence includes:
- enemy charge;
- target warning;
- first collision;
- Vael intercept if formation allows it;
- Mirel autonomous heal of the weakest party member;
- Seris channel;
- moon burst;
- enemy defeat;
- cause-chain debrief.

Different formations change who receives damage and whether the clean protection chain occurs.

## Art status

The architecture is now ready for real art replacement.

Still temporary:
- painted battlefield proxy derived from accepted concept composition;
- live CSS/vector actor stand-ins;
- enemy stand-ins.

Do **not** call these production character assets.

Final D005 still requires:
- extremely attractive charismatic character designs;
- elegant beautiful-but-uncanny fantasy;
- production-quality authored sprites;
- readable animation poses;
- strong silhouettes.

## Engineering rule

Do not regress to a baked single-image mockup.

Any new art must plug into the current independent actor/environment/HUD layers.

Battle logic and art should remain replaceable independently.

## Next action

1. User inspects the layered battle in-browser.
2. If the live composition/readability feels correct, replace hero stand-ins first:
   - Vael;
   - Seris;
   - Mirel.
3. Give each hero at minimum:
   - idle/breath;
   - move;
   - wind-up;
   - attack/cast;
   - hit reaction;
   - special reaction;
   - downed.
4. Then replace enemy stand-ins.
5. Then replace the blurred environment proxy with a clean authored battlefield.
6. Only after art/motion passes, expand resonance/edict tutorial depth.
