# HANDOFF — PROJECT GUILDFALL

## Current phase

**Phase 2 — Core Loop Engineering is implemented.**

The project has transitioned from scripted visual mockups to a **fully decoupled, deterministic simulation engine and continuous macro loop**:

1. **Independent Deterministic Combat Engine (`src/game/engine/CombatEngine.js`)**:
   - Seed-based, frame-rate independent tick simulation (0.05s dt).
   - Real data-driven actor logic: Formation rules (FRONT / CORE / VEIL), Resonance triggers (Intercept, Emergency Heal, Channel acceleration), and Edicts (Shell, Moon, Roots).
   - Generates deterministic EventStream with full causal metadata.
2. **Causal Debrief Engine (`src/game/engine/CausalDebrief.js`)**:
   - Analyzes the simulation event log and extracts top 1–3 decisive causes of victory/defeat.
3. **Event-Driven Battle Director (`src/game/director/BattleDirector.js`)**:
   - Orchestrates playback on the live arena with anticipation → action → impact → recovery pacing, hit-stop, and camera shake.
4. **Macro Run Manager (`src/game/loop/RunManager.js`)**:
   - State machine: `READ` → `PLAN` → `COMMIT` → `WATCH` → `DEBRIEF` → `ADAPT` → Next Node.
   - Persistent hero HP (organs, not inventory) across nodes with post-battle adaptation recovery.
5. **Authentic Mockup & Dedicated Full-Screen Architecture**:
   - Completely removed the 50/50 split-screen hack and blurry cropped screenshot portraits.
   - **Camp Screen**: Faithfully implements the approved mockup screen (full 16:9 campfire scene, top-left moon badge, left navigation bar, authentic notched RPG parchment speech bubbles for Vael, Seris, Mirel, and drawer panels for Formation/Tactics/Map).
   - **Battle Screen**: Dedicated full-screen arena (battlefield occupies 82% height, live actors, real bottom HUD with high-res portraits, in-arena Causal Debrief overlay).

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

**Phase 3 — Sprite-Gen Production Pipeline is implemented.**

Hero and boss stand-ins have been replaced with full-body 8-keypose production sprite sheets adhering to the `sprite-gen` specification:
- **Vael (베일 - 흑요석 수호자)**: 4x2 grid (Idle, Windup, Brace, Crouch, Hit, Lunge, Intercept, Recovery). Obsidian horns, violet cloak, dark gold-filigree armor, kite shield.
- **Seris (세리스 - 월광나방 예언자)**: 4x2 grid (Idle, Windup, Channel, Crouch, Hit, Step, Moonlight Burst, Recovery). Celestial moth wings, silver hair, glowing moon catalyst.
- **Mirel (미렐 - 개화의 사제)**: 4x2 grid (Idle, Windup, Plant, Prayer, Hit, Step, Blossom Pulse, Recovery). Blooming antler horns, rose hair, botanical vestments, living flower staff.
- **Boss Warden (공허의 파수꾼)**: 4x2 grid (Idle, Windup, Cleave, Slam, Hit, Stride, Roar, Defeated). Corrupted void armor, glowing runes, greatsword.

### Pipeline Technical Features:
1. **Real-time Chroma Cutout & Defringing**: `#FF00FF` magenta chroma unmixed to clean alpha transparency on-the-fly via [SpriteAtlas.js](file:///c:/Users/정현아/project-guildfall/src/game/render/SpriteAtlas.js).
2. **Foot-Anchor Alignment**: Bottom contact line dynamically calculated so actors never float or slide during stance changes.
3. **Team Silhouette Backlight**: Gold outline glow (`#ffe694`) for allies, Crimson outline glow (`#ff708a`) for enemies.
4. **Palette Swapping & Variant Recoloring (`sprite-gen` Workflow 3)**: Lancer (백철 창기병) automatically recolored with silver/white-iron palette swap (`hue-rotate(170deg)`).
5. **Cinematic Battle Beats & Camera Trauma**:
   - `hitstop`: Instant contrast spike and micro-freeze on heavy impacts.
   - `impact-beat`: Punchy horizontal screen trauma camera shake.
   - `guard-impact-beat`: Golden radial shield bloom and heavy shudder during Vael's intercept.
   - `heal-wave-beat`: Emerald floral ripple across the arena during Mirel's bloom.
   - `moon-burst-beat`: Grand celestial flash, zoom in, and heavy resonant shake during Seris's ritual burst.
   - `combat-callout`: Dramatic glowing banners for INTERCEPT, 월광 폭발, 꽃맥박, 위기 조준.
   - `dead`: Defeated units dynamically collapse into a dim grayscale posture.
6. **Runtime Manifests**: [vael_manifest.json](file:///c:/Users/정현아/project-guildfall/src/assets/heroes/vael_manifest.json), [seris_manifest.json](file:///c:/Users/정현아/project-guildfall/src/assets/heroes/seris_manifest.json), [mirel_manifest.json](file:///c:/Users/정현아/project-guildfall/src/assets/heroes/mirel_manifest.json), [boss_warden_manifest.json](file:///c:/Users/정현아/project-guildfall/src/assets/enemies/boss_warden_manifest.json).
7. **CI / Automation Pipeline**: [prototype-ci.yml](file:///c:/Users/정현아/project-guildfall/.github/workflows/prototype-ci.yml) with automated `npm test` (deterministic simulation) + `npm run build`.

## Next action

1. User inspects the live layered battle in-browser at `http://localhost:5173/`.
2. Observe the full Anticipation → Action → Impact → Recovery cycle, hit-stop, camera shake, and dramatic callout banners.
3. When image API quota resets, generate dedicated quadruped Stigmata Hound and Blind-eye Hunter sprite sheets.
4. Expand multi-wave caravan encounters and meta-progression adaptation depth.
