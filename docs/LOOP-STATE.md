# LOOP STATE — PROJECT GUILDFALL

> **Last updated:** 2026-09-27
>
> **MODE OVERRIDE: MOCKUP LOCK & SPRITE-GEN LOCOMOTION CONVERGED**
>
> The Golden Frame geometry, Chapter 01 narrative spine, and 2.5D animated sprite locomotion engine are now unified on main.
> Read `docs/MOCKUP-LOCK.md` and `docs/art/CHARACTER-SPRITE-SSOT.md` before choosing the next loop.

> This file is the current execution checkpoint for `LOOP-ENGINEERING.md`.
> It should be updated after every meaningful merged loop.

---

## Current main baseline

- Latest merged milestones:
  - **Mockup Lock V1 + Painterly Battle Plate** (#26, #27)
  - **World foundation & Chapter 01 runtime** (#18, #20)
  - **Sprite-Gen Production Pipeline & Spatial Locomotion Engine**
- Visual QA: **PASS**
- Prototype CI: **PASS (11/11 deterministic simulation tests passing)**
- Vercel status at last check: **external build-rate-limit failure**, not an application build failure

---

## Current product phase

> **G1 Mockup Lock + G2 Sprite-Gen Locomotion Payoff**

The game has unified the approved mockup composition, Chapter 01 narrative beats, and 2.5D animated sprite locomotion:
- Hero and Boss production sprite sheets (Vael, Seris, Mirel, Boss Warden) with 8 authored keyposes each.
- Real-time magenta (#FF00FF) chroma cutout and defringing in `SpriteAtlas.js`.
- Foot contact anchor calculation (`measureFootCenter`) preventing stance sliding.
- Base standing scale locking preventing crouch/hit-reaction ballooning.
- Spatial locomotion engine: dynamic clash line advance, intercept dash with afterimage trails, and spring-damped knockback.

---

## Locked identity recap

Read `docs/DECISIONS.md` for authority.

Current non-negotiables:

- Living Caravan / living sanctuary fantasy
- beautiful, dangerous, charismatic characters
- characters are organs, not inventory
- attachment matters
- loss may happen
- future restoration should be expensive and emotionally meaningful
- automatic combat must visibly express player authorship

---

## What currently works

### Tutorial / planning
- threat-read tutorial
- formation / placement
- COMMIT boundary
- automatic combat
- causal combat log
- battle debrief & Causal Debrief cause chains
- resonance tutorial prototype
- journey map presentation

### Current party
- Vael (흑요석 수호자 — 2.5D Animated Sprite Atlas)
- Seris (월광나방 예언자 — 2.5D Animated Sprite Atlas)
- Mirel (개화의 사제 — 2.5D Animated Sprite Atlas)

### Narrative now live
- camp warmth before tutorial mechanics
- visible Hush warning
- targeted threat to Seris
- in-world COMMIT language
- character battle barks
- relationship-focused debrief
- post-battle care scene
- departure scene
- provisional sealed-caravan / fourth-heartbeat hook

### Current live combat chain
- breaker telegraph & clash advance
- breaker lunge & opening impact
- hunter rear-target acquisition & projectile shot
- Vael dynamic INTERCEPT dash with afterimages
- Mirel danger read & targeted heal ripple
- Seris ritual charge & screen-shaking moonlight burst
- finish / victory march resolution

### Current visual QA
The workflow captures real browser renders at:
- 1388×550 mobile landscape
- 1536×864 desktop 16:9

Current keyframes:
- READ
- PLACEMENT
- CHARGE
- INTERCEPT
- BURST
- FINISH

---

## What is still provisional / not locked

Do not confuse current implementation with final design decisions.

Still open in `docs/DECISIONS.md`:

- D002 — permanent control vs surrender model
- D003 — permanent spatial model
- D004 — permanent run structure
- D005 — final art identity wording / full production art system
- permanent loss / restoration economy
- permanent recruitment structure

The current formation/resonance systems are useful prototypes and may become final, but should remain **PROVISIONAL** until explicitly locked.

---

## Current visual status

### GREEN
- Living Caravan world foundation
- initial Vael / Seris / Mirel characterization
- Chapter 01 content separation & runtime narrative flow
- overall split-screen tutorial composition & Golden Frame
- camp / tutorial / route / battle hierarchy
- independent live layers
- hero visual identity direction & 2.5D animated atlases
- enemy silhouette differentiation
- mobile landscape support
- screenshot-driven QA pipeline
- combat intent arrows / targeting language
- Vael INTERCEPT dynamic dive & readability

### YELLOW
- enemy authored attack / hit / defeat frames (Hound and Hunter still using animated silhouette atlases)
- battle impact continuity & audio cues
- route-map production finish
- debrief causality presentation polish

### RED
- dedicated Stigmata Hound and Blind-eye Hunter authored sprite sheets
- persistent character attachment systems
- loss / recovery proof
- run-loop multi-wave proof
- content breadth

---

## Rejected / failed experiments that should not be repeated blindly

### Rejected: baked full-screen concept mockup as game
Reason:
- duplicated UI / characters
- not a live game layer system
- cannot support real interaction properly

### Rejected: low-quality style-drifting Seris vector portrait
Reason:
- failed the attractive / charismatic character bar
- style did not match approved cast

### Rejected: direct concept-art crop injection experiment
Reason:
- poor browser result / wrong crop behavior
- did not produce a reliable reusable game asset

### Rejected principle
Do not merge a weaker visual result because time was spent on it.

---

## Current external blocker

### Vercel build-rate-limit
At the last main check:
- GitHub build / CI passed
- Visual QA passed
- Vercel reported build-rate-limit

Treat this as an infrastructure quota issue unless a later deployment exposes a real application error.

Repository work may continue.

---

# NEXT LOOP — HIGHEST PRIORITY

## Target
**Dedicated Enemy Authored Sprite Sheets (Hound & Hunter) & Multi-Wave Run Flow**

### Why this is next
Hero and Boss units are now completely live with 2.5D animated sprite sheets and dynamic locomotion.
The Hound and Hunter are currently animated using palette-adjusted silhouette atlases. Creating dedicated quad and ranged sprite sheets following `sprite-gen` specification will bring all combat participants to full commercial fidelity.

### Pass condition
The loop is GREEN only if:
- Hound and Hunter have distinct 8-keypose frames;
- quad run / ranged fire animations are natural and anchored to foot contact lines;
- 11/11 deterministic engine tests pass;
- mobile landscape and desktop layouts remain pristine.

---

## End-of-loop update rule

After each successful merge, replace / update:

- main commit
- latest merged PR
- current gate status
- what became GREEN
- what remains RED/YELLOW
- rejected experiments
- external blockers
- exact NEXT LOOP
- suggested next branch

Never leave this file saying “next = X” after X has already been merged.

## Claude model routing checkpoint — 2026-10-04

- Claude 실행 경로: `scripts/claude-loop.mjs`와 `docs/MODEL-ROUTING.md`.
- 모델: 메인 Opus/high, 탐색·작업·조사·검수 Sonnet/medium, 중요 판단 Fable advisor.
- 상태: 설정 PR 준비. 실제 Claude 모델·계정·advisor 접근은 실행 환경의 preflight와 `/tasks`에서 확인한다.
- Suggested branch: `claude/<date>-<one-bottleneck>` — 설정 병합 후 최신 main에서 한 병목용 브랜치를 선택한다.
- NEXT LOOP의 현재 게임 대상과 기획 게이트는 위 기록을 그대로 따른다.
