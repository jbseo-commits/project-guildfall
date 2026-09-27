# CHARACTER SPRITE SSOT & ALIGNMENT SPECIFICATION
> Derived from *용사주식회사(Hero Inc.) 캐릭터 스프라이트 제작 가이드* (`https://suile-21173.web.app/hero-inc/prompts`) & Project Guildfall Art Quality Bar.

---

## 1. SSOT (Single Source of Truth) 원칙

SSOT는 캐릭터 스프라이트와 전투 연출 제작 시 **언제나 돌아오는 단 하나의 승인 기준**입니다. 새 결과물이 매력적이라고 매번 기준을 바꾸면 캐릭터의 풍과 비율이 무너집니다.

- **몸 비율 (Head-to-body ratio)**: 등신비 고정
- **얼굴과 장비 (Identity & Equipment)**: 승인된 시그니처 외형 유지
- **바라보는 방향 (Direction)**: 아군은 우측(적을 향함, 3/4 쿼터뷰), 적군은 좌측
- **기준 체고 & 배율 (Common Scale)**: 웅크린 자세는 자연스럽게 낮아야 하며, 포즈 높이에 맞춰 개별 확대 금지
- **발 기준점 (Foot Anchor)**: 이미지 전체 중앙이 아닌, 하단 12% 영역의 접지 발 중심을 기준으로 정렬

---

## 2. 프로젝트 길드폴 3대 주역 SSOT 규격

### ① 베일 (Vael) — 흑요석 수호자 (FRONT)
- **승인 마스터**: `hero_vael_bust_1790482038319.jpg` / `src/assets/heroes/vael_master.jpg`
- **핵심 실루엣**: 완곡하게 휜 검은 양뿔(Ram Horns), 긴 은회색 머릿결, 사자 문장의 흑요석 판금갑주, 짙은 망토
- **기준 체고**: 1.08x (파티 내 최장신 / 듬직한 실루엣)
- **아웃라인**: 아군 황금빛/호박색 백라이트 (`drop-shadow: 0 0 2px rgba(255, 220, 140, 0.85)`)
- **8대 키포즈 역할**:
  1. `Idle`: 양손 방패 지탱 대기
  2. `Aim/Windup`: 어깨를 낮추며 전방 주시 (Anticipation)
  3. `Brace`: 방패 전면 배치 충격 대비
  4. `Crouch Guard`: 몸을 낮춰 후열 시야 확보
  5. `Hit Recoil`: 피격 시 무게 중심 뒤로 쏠림
  6. `Lunge/Dash`: 앞으로 짓쳐 나가며 전열 돌파
  7. `Intercept`: 동료(세리스) 앞을 가로막아 방패를 전개하는 방어 타격
  8. `Recovery`: 중심을 되찾고 방패 재정비

### ② 세리스 (Seris) — 월광의 예언자 (VEIL)
- **승인 마스터**: `hero_seris_bust_1790482138629.jpg` / `src/assets/heroes/seris_master.jpg`
- **핵심 실루엣**: 은라벤더빛 머리, 투명한 달나비(Moon-moth) 날개 머리핀, 성좌 룬이 수놓인 짙은 인디고 후드 로브, 빛나는 고대 마도서
- **기준 체고**: 0.95x (섬세하고 신비로운 의식자 실루엣)
- **아웃라인**: 월광 보랏빛/청백색 백라이트 (`drop-shadow: 0 0 2px rgba(210, 180, 255, 0.85)`)
- **8대 키포즈 역할**:
  1. `Idle`: 마도서를 품에 안고 달빛 부유
  2. `Channel Windup`: 마도서를 펼치며 의식 시동
  3. `Channel Hover`: 공중에 살짝 떠올라 월광을 집중 (호흡 애니메이션)
  4. `Interrupt Stagger`: 직접 타격으로 의식 중단 시 흔들림
  5. `Hit Recoil`: 뒤로 밀려나며 마도서 방어
  6. `Moon Sigil Form`: 머리 위에 거대한 초승달 문양 전개
  7. `Moonlight Burst`: 마도서를 치켜들며 전장 전체를 뒤덮는 월광 파동 방출
  8. `Recovery`: 부드럽게 지면 착지

### ③ 미렐 (Mirel) — 개화의 사제 (CORE)
- **승인 마스터**: `hero_mirel_bust_1790482154107.jpg` / `src/assets/heroes/mirel_master.jpg`
- **핵심 실루엣**: 부드러운 로즈핑크 머리, 꽃이 핀 사슴 나뭇가지 뿔(Flowering Antlers), 덩굴과 벚꽃으로 엮은 에메랄드 의복, 손에 든 꽃가지
- **기준 체고**: 0.90x (다정하고 아담한 생명의 사제 실루엣)
- **아웃라인**: 생명력 에메랄드빛 백라이트 (`drop-shadow: 0 0 2px rgba(120, 240, 150, 0.85)`)
- **8대 키포즈 역할**:
  1. `Idle`: 꽃가지를 든 채 부드럽게 좌우 스웨이
  2. `Sense Windup`: 아군의 상처를 감지하고 꽃가지를 들어 올림
  3. `Heal Cast`: 꽃가지를 휘둘러 나선형 꽃잎 고리 방출
  4. `Barrier Form`: 전열 동료에게 덩굴 방벽 투영
  5. `Hit Recoil`: 움찔하며 꽃가지를 움켜쥠
  6. `Emergency Surge`: 위급 동료를 향해 생명의 빛 급파
  7. `Bloom Wave`: 전열과 후열 사이 생태계 공명 파동
  8. `Recovery`: 평온한 숨을 고르며 다음 치유 준비

---

## 3. 정렬 및 발 기준점(Foot Anchor) 규칙

1. **체고 불변 원칙**:
   - 웅크린 포즈나 낮은 자세를 대기 높이에 맞춰 강제로 확대하지 않습니다.
   - 몸 전체의 배율(`scale`)은 서 있는 기준 체고로 고정합니다.
2. **발 중심점 정렬 (`footX`)**:
   - 무기나 날개가 뻗어나간 방향으로 전체 중앙이 치우치는 문제를 방지하기 위해, **하단 12% 영역의 접지 픽셀 중심**을 정렬 기준으로 삼습니다.
   - CSS 구현: `transform-origin: center bottom`을 기본으로 설정하여 크기 변화나 회전 시 발이 지면에 붙어있도록 보장합니다.
3. **팀 아웃라인 시스템**:
   - 아군: 금빛/호박색 아웃라인 (`drop-shadow(0 0 1.5px #ffe694) drop-shadow(0 0 8px rgba(230,170,70,0.35))`)
   - 적군: 심연 흑자색/진홍색 아웃라인 (`drop-shadow(0 0 1.5px #ff708a) drop-shadow(0 0 8px rgba(180,40,120,0.45))`)
   - 이를 통해 어두운 룬 전장 배경 위에서도 유닛의 위치와 실루엣이 gameplay size에서 100% 읽히도록 보장합니다.

---

## 4. 모션 타이밍 규격 (Anticipation → Action → Impact → Recovery)

- **준비 (Anticipation)**: 공격/시전 전 400~800ms 동안 몸을 반대 방향으로 웅크리거나 에너지를 모으는 동작.
- **행동 (Action)**: 200~300ms의 빠른 전진/타격/방출.
- **충격 (Impact)**: 100~140ms 히트스톱, 플로팅 데미지/치유 텍스트, 카메라 흔들림, VFX 발동.
- **복귀 (Recovery)**: 400~600ms 동안 자연스럽게 대기 자세로 복귀.
