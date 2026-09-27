---
name: sprite-gen
version: 2.11.0
description: "Generates game-ready sprite sheets, transparent motion loops (WebP/GIF), and runtime atlas manifests from a single master character image. Supports 8 keyposes, chroma removal, foot-anchor alignment, and team outline integration."
license: Apache-2.0
---

# Sprite Gen Skill

This skill integrates the open-source [sprite-gen](https://github.com/aldegad/sprite-gen) pipeline into Project Guildfall to transform single approved character master illustrations into game-ready sprites, transparent animation loops, and runtime atlas manifests.

## Core Workflows

### 1. Atlas Rows Pipeline (8 Keyposes)
From an approved master image (e.g. `src/assets/heroes/vael_master.jpg`):
1. **Prepare**: Define 8 canonical keyposes (Idle, Aim/Windup, Brace, Crouch, Recoil/Hit, Lunge/Dash, Special/Intercept, Recovery).
2. **Generate Rows**: Request a 4x2 grid preserving character identity, palette, and proportions from SSOT.
3. **Extract & Chroma Cutout**: Segment each pose, remove background to true alpha.
4. **Foot-Anchor Alignment**: Align each frame by bottom 12% foot contact center (`footX`), preserving natural crouching height without artificial scaling.
5. **Atlas Bake**: Pack into a power-of-two PNG atlas + `manifest.json` with frame layouts and anchor data.

### 2. Video-to-Loop Pipeline (Transparent WebP / GIF Loops)
From a character still:
1. **Canvas Placement**: Center character facing `--facing right` (or left for enemies).
2. **Video Generation**: Animate seamless action clip (idle breathing, ritual channel, run cycle).
3. **Frame Extraction**: Slice frames using `ffmpeg`.
4. **Loop Selection & WebP Bake**: Automatically identify the seamless loop cycle and bake with exact alpha using `img2webp`.

### 3. Palette Swap & Team Outlines
1. **Team Silhouette**: Apply team backlight (gold `#ffe694` for allies, crimson/purple `#ff708a` for enemies).
2. **Recolor**: Produce elite / corrupted enemy variants without redrawing.
