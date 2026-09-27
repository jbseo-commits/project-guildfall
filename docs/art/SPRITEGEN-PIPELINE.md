# SPRITE-GEN PIPELINE & INTEGRATION GUIDE
> Open Source Engine: [aldegad/sprite-gen](https://github.com/aldegad/sprite-gen)  
> Project Guildfall Sprite Architecture: `src/game/render/SpriteAtlas.js`

---

## 1. 개요 (Overview)

`sprite-gen`은 단 한 장의 승인된 마스터 원화(SSOT)로부터 **게임 엔진에 즉시 임포트 가능한 8대 키포즈 스프라이트 시트, 픽셀 단위 발 기준점 정렬(`footX`), 투명 알파 마스크, 런타임 `manifest.json` 아틀라스**를 자동으로 빌드하는 오픈소스 파이프라인입니다.

본 프로젝트(Project Guildfall)는 `sprite-gen`의 아틀라스 매니페스트 규격을 런타임에서 직접 해석하는 `src/game/render/SpriteAtlas.js` 엔진 레이어를 구비하고 있습니다.

---

## 2. 3대 주역 + 보스 SpriteGen 실행 레시피

### ① 베일 (Vael) — 흑요석 수호자 (FRONT)
```bash
sprite-gen gen-set \
  --ref src/assets/heroes/vael_master.jpg \
  --facing right \
  --poses "1. Idle shield guard, 2. Lowered shoulder windup, 3. Raised shield bracing, 4. Low crouch guard, 5. Recoil hit reaction, 6. Forward shield dash, 7. Intercept protective bash, 8. Recovery guard" \
  --columns 4 --rows 2 \
  --cell 512 --edge-padding 2 --bottom-padding 18 \
  --output src/assets/heroes/vael_atlas.png
```

### ② 세리스 (Seris) — 월광의 예언자 (VEIL)
```bash
sprite-gen gen-set \
  --ref src/assets/heroes/seris_master.jpg \
  --facing right \
  --poses "1. Idle floating grimoire, 2. Grimoire opening windup, 3. Celestial channel hovering, 4. Low crouch dodge, 5. Recoil interruption stagger, 6. Moon sigil invocation, 7. Moonlight burst detonation, 8. Gentle landing recovery" \
  --columns 4 --rows 2 \
  --cell 512 --edge-padding 2 --bottom-padding 18 \
  --output src/assets/heroes/seris_atlas.png
```

### ③ 미렐 (Mirel) — 개화의 사제 (CORE)
```bash
sprite-gen gen-set \
  --ref src/assets/heroes/mirel_master.jpg \
  --facing right \
  --poses "1. Idle blossom branch sway, 2. Branch raising sense windup, 3. Blooming petal ring cast, 4. Low crouch shelter, 5. Recoil hit reaction, 6. Emergency healing surge, 7. Full bloom wave burst, 8. Recovery stance" \
  --columns 4 --rows 2 \
  --cell 512 --edge-padding 2 --bottom-padding 18 \
  --output src/assets/heroes/mirel_atlas.png
```

### ④ 공허의 파수꾼 (Hollow Warden) — 룬 골렘 보스 (ENEMY BOSS)
```bash
sprite-gen gen-set \
  --ref src/assets/enemies/boss_warden_master.jpg \
  --facing left \
  --poses "1. Idle colossal greatsword rest, 2. Two-handed heavy windup, 3. Runic roar charge, 4. Earth-stomp brace, 5. Recoil armor crack, 6. Ground-splitter lunge, 7. Corrupted flame slash, 8. Greatsword plant recovery" \
  --columns 4 --rows 2 \
  --cell 512 --edge-padding 2 --bottom-padding 18 \
  --output src/assets/enemies/boss_warden_atlas.png
```

---

## 3. SpriteGen 핵심 정렬 규칙 연동

1. **발 접지 기준 (`footX`, 하단 12% 밴드)**:
   - 무기를 뻗거나 망토가 휘날려도 캐릭터 몸체가 좌우로 흔들리지 않도록 `measureFootCenter()` 알고리즘 적용.
   - CSS/PixiJS에서는 `transform-origin: center bottom`으로 연동.
2. **체고 보존 배율 (`fitScale`)**:
   - 웅크린 포즈(4번 포즈)의 높이가 320px이고 서 있는 포즈가 470px일 때, 웅크린 포즈를 강제로 확대하지 않고 1.0배 공통 배율 유지.
3. **팀 아웃라인 결합**:
   - 추출된 알파 테두리에 `drop-shadow(0 0 2px #ffe694)`(아군) / `drop-shadow(0 0 2px #ff708a)`(적군)을 실시간 합성하여 어두운 전장 위에서 가독성 100% 확보.
