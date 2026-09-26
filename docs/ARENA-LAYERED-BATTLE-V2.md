# ARENA LAYERED BATTLE V2

## Purpose

Move from a single approved concept image to an actual layered game presentation.

The approved concept art remains a temporary environment-quality proxy, but gameplay-critical elements are now independent live layers.

## Implemented in V2

### Real arena layers
- environment/backdrop layer;
- three independent allied actors;
- three independent enemy actors;
- floor positions: FRONT / CORE / VEIL;
- enemy intent arrows;
- resonance tether;
- world-space HP bars;
- live HUD;
- battle VFX;
- tutorial/debrief overlays.

### Player interaction
Before COMMIT:
- select a party member in the battlefield or HUD;
- select FRONT / CORE / VEIL;
- party members swap positions;
- HUD role/location updates immediately.

After COMMIT:
- no micro-control;
- enemy charge;
- target warning;
- Vael intercept behavior;
- Mirel autonomous heal;
- Seris channel/cast;
- enemy HP loss and defeat;
- live HP/state updates;
- post-battle cause chain.

### Result dependency
The battle is not a fixed movie.

Formation changes:
- who receives the first heavy hit;
- who receives rear targeting;
- whether Vael can protect Seris cleanly;
- which unit Mirel identifies as the most endangered;
- the final debrief.

## Quality rule

The approved concept remains the composition/art target.

From this point onward, a visual iteration should not be accepted merely because the static mockup looks good.

It must also survive:
- real actor movement;
- combat readability;
- HUD updates;
- target indicators;
- VFX;
- tutorial overlays;
- different player formations.

## Current art limitation

The environment is still derived from the approved concept as a blurred painted proxy.

The live actor sprites are temporary layered vector/chibi stand-ins.

They are intentionally separate from the background so they can now be replaced one-by-one with authored production assets without rebuilding the battle logic.

## Next visual loop

Replace temporary actor stand-ins with authored character assets while preserving:
- current layer architecture;
- current arena composition;
- current movement/VFX timing;
- current HUD readability.

After the hero assets are credible, repeat for enemies and environment.
