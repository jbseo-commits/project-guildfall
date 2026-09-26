# NEW SESSION PROMPT — PROJECT GUILDFALL

아래 문장을 새 ChatGPT / coding-agent 세션에 그대로 전달한다.

---

GitHub 저장소 `jjsjb88-alt/project-guildfall`의 현재 `main`을 확인하고, 다음 파일을 반드시 순서대로 읽어라.

1. `START-HERE.md`
2. `LOOP-ENGINEERING.md`
3. `docs/LOOP-STATE.md`
4. `docs/DECISIONS.md`
5. `docs/GAME-VISION.md`
6. `HANDOFF.md`

그 다음 최신 merged PR, open PR, CI, Visual QA 결과를 확인하고 `docs/LOOP-STATE.md`의 **NEXT LOOP**부터 바로 실행해라.

계획만 작성하고 멈추지 마라. 구현 도구가 있으면 직접 브랜치를 만들고 수정하고 빌드하고 실제 브라우저 렌더를 캡처해서 검수하라.

반드시 `LOOP-ENGINEERING.md`의 루프를 지켜라:

**OBSERVE → DIAGNOSE → SELECT ONE BOTTLENECK → HYPOTHESIZE → IMPLEMENT → BUILD → CAPTURE → COMPARE → REJECT/ITERATE → GATE → MERGE → UPDATE LOOP STATE → NEXT LOOP**

특히 다음 원칙을 절대 낮추지 마라.

- 실제 렌더 스크린샷을 보지 않고 비주얼 완료 판정 금지.
- 모바일 가로 + 데스크톱 16:9 둘 다 검수.
- 전투는 READ / PLACEMENT / CHARGE / INTERCEPT / BURST / FINISH 주요 프레임을 검수.
- 기존보다 나빠진 실험은 머지하지 말 것.
- 캐릭터는 매우 미형이고 매력적이며 기존 승인 스타일과 일치해야 함.
- 캐릭터는 소모품이 아니라 Living Caravan의 팔다리/장기처럼 느껴져야 함.
- 정적인 캐릭터 이미지를 단순 이동시키는 것만으로 production combat motion 완료 판정 금지.
- 주요 전투 행동은 authored pose/frame으로 발전시킬 것.
- 자동전투는 로그를 읽지 않아도 의도 → 대상 → 행동 → 접촉 → 결과 → 원인이 읽혀야 함.
- 플레이어 선택은 실제 행동을 바꿔야 함.
- major design decision이 열려 있으면 임의로 영구 확정하지 말고 PROVISIONAL로 실험하거나 사용자 결정을 요청.
- 별도 정적 목업 화면으로 회귀하지 말고 실제 게임 레이어를 개선할 것.
- 한 마이크로 루프가 끝났다고 세션을 멈추지 말고, 다음 병목이 명확하면 가능한 범위에서 계속 진행할 것.
- 세션 종료 전 반드시 `docs/LOOP-STATE.md`를 최신 상태로 갱신할 것.

사용자가 “다음”, “계속”, “루프 계속”이라고 하면 위 프로토콜을 다시 설명하지 말고 즉시 다음 루프를 실행해라.

현재 상태와 정확한 다음 작업은 추측하지 말고 반드시 `docs/LOOP-STATE.md`에서 읽어라.
