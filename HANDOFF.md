# HANDOFF — PROJECT GUILDFALL

## Current phase

**Loop Engineering active — Phase 2 & Phase 3 Implemented.**

The project has transitioned from scripted visual mockups to a **fully decoupled, deterministic simulation engine, continuous macro loop, and 2.5D animated sprite locomotion**:

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

The authoritative operating documents are:
- `LOOP-ENGINEERING.md`
- `docs/LOOP-STATE.md`

---

## Locked identity

The current fantasy is the **Living Caravan**:

a wandering living sanctuary / ecosystem made of beautiful, dangerous, highly charismatic beings.

Locked emotional principles:

- characters are **organs, not inventory**;
- losing one should feel like losing part of the living system;
- characters can be lost;
- recovery can exist but should eventually be painfully expensive;
- attachment may make the player strategically inefficient.

See `docs/DECISIONS.md`.

---

## Current playable slice

The current game includes:

### Planning
- enemy intent reading;
- FRONT / CORE / VEIL formation;
- party-member swapping;
- COMMIT boundary.

### Automatic battle
- breaker telegraph / lunge / opening impact;
- hunter rear-target acquisition / shot;
- Vael INTERCEPT;
- Mirel autonomous danger-read / healing;
- Seris concentration / ritual / moon burst;
- finish / resolution.

### Tutorial / explanation
- live-game tutorial overlays;
- battle dialogue;
- combat log;
- causal debrief;
- resonance prototype;
- route / journey presentation.

### Visual QA
Every relevant PR can render actual browser screenshots at:
- mobile landscape;
- desktop 16:9.

Combat QA currently includes:
- READ;
- PLACEMENT;
- CHARGE;
- INTERCEPT;
- BURST;
- FINISH.

---

## Art & Motion Pipeline (`sprite-gen` & Locomotion Engine)

Hero and boss stand-ins have been replaced with full-body 8-keypose production sprite sheets adhering to the `sprite-gen` specification:
- **Vael (베일 - 흑요석 수호자)**: 4x2 grid (Idle, Windup, Brace, Crouch, Hit, Lunge, Intercept, Recovery). Obsidian horns, violet cloak, dark gold-filigree armor, kite shield.
- **Seris (세리스 - 월광나방 예언자)**: 4x2 grid (Idle, Windup, Channel, Crouch, Hit, Step, Moonlight Burst, Recovery). Celestial moth wings, silver hair, glowing moon catalyst.
- **Mirel (미렐 - 개화의 사제)**: 4x2 grid (Idle, Windup, Plant, Prayer, Hit, Step, Blossom Pulse, Recovery). Blooming antler horns, rose hair, botanical vestments, living flower staff.
- **Boss Warden (공허의 파수꾼)**: 4x2 grid (Idle, Windup, Cleave, Slam, Hit, Stride, Roar, Defeated). Corrupted void armor, glowing runes, greatsword.

### Pipeline Technical Features:
1. **Real-time Chroma Cutout & Defringing**: `#FF00FF` magenta chroma unmixed to clean alpha transparency on-the-fly via [SpriteAtlas.js](file:///c:/Users/정현아/project-guildfall/src/game/render/SpriteAtlas.js).
2. **Foot-Anchor Alignment**: Bottom 12% contact line dynamically calculated (`measureFootCenter`) so actors never float or slide during stance changes.
3. **Scale Locking**: Frame 0 height (`this.baseCharHeight`) locked as master scale to prevent crouching/hit-reaction ballooning.
4. **Spatial Locomotion Engine**: Characters physically advance across the arena to clash lines, dash with afterimage trails, intercept dive, and recoil with spring damping.
5. **Team Silhouette Backlight**: Gold outline glow (`#ffe694`) for allies, Crimson outline glow (`#ff708a`) for enemies.
6. **Cinematic Battle Beats & Camera Trauma**:
   - `hitstop`: Instant contrast spike and micro-freeze on heavy impacts.
   - `impact-beat`: Punchy horizontal screen trauma camera shake.
   - `guard-impact-beat`: Golden radial shield bloom and heavy shudder during Vael's intercept.
   - `heal-wave-beat`: Emerald floral ripple across the arena during Mirel's bloom.
   - `moon-burst-beat`: Grand celestial flash, zoom in, and heavy resonant shake during Seris's ritual burst.
   - `combat-callout`: Dramatic glowing banners for INTERCEPT, 월광 폭발, 꽃맥박, 위기 조준.
   - `dead`: Defeated units dynamically collapse into a dim grayscale posture.
7. **Runtime Manifests**: [vael_manifest.json](file:///c:/Users/정현아/project-guildfall/src/assets/heroes/vael_manifest.json), [seris_manifest.json](file:///c:/Users/정현아/project-guildfall/src/assets/heroes/seris_manifest.json), [mirel_manifest.json](file:///c:/Users/정현아/project-guildfall/src/assets/heroes/mirel_manifest.json), [boss_warden_manifest.json](file:///c:/Users/정현아/project-guildfall/src/assets/enemies/boss_warden_manifest.json).
8. **CI / Automation Pipeline**: [prototype-ci.yml](file:///c:/Users/정현아/project-guildfall/.github/workflows/prototype-ci.yml) with automated `npm test` (deterministic simulation) + `npm run build`.

---

## Exact next action

1. User inspects the live layered battle in-browser at `http://localhost:5173/`.
2. Observe the full Anticipation → Action → Impact → Recovery cycle, hit-stop, camera shake, and dramatic callout banners.
3. When image API quota resets, generate dedicated quadruped Stigmata Hound and Blind-eye Hunter sprite sheets.
4. Expand multi-wave caravan encounters and meta-progression adaptation depth according to `docs/LOOP-STATE.md`.

---

## Execution rules

1. Use one focused loop per branch.
2. Observe the actual game first.
3. Fix the highest-impact player-facing bottleneck.
4. Build.
5. Capture real browser screenshots.
6. Inspect mobile and desktop.
7. Reject or iterate if worse.
8. Merge only after evidence passes.
9. Update `docs/LOOP-STATE.md`.
10. Continue to the next bottleneck while the session allows.

Do not stop merely because code was written.

---

## External deployment note

The latest repository/Visual QA checks passed.
At the last check, Vercel could report a **build-rate-limit** failure.
Treat that as external infrastructure unless a real application build error appears.
Do not confuse provider quota failure with broken game code.
