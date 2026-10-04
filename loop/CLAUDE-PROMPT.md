# Claude 카라밴 개발 한 바퀴

AGENTS.md와 docs/MODEL-ROUTING.md를 읽고 START-HERE.md의 필수 진입 순서를 따른다. docs/LOOP-STATE.md의 임시 모드와 docs/DECISIONS.md를 확인한다. 현재 작업 브랜치에서 플레이어에게 보이는 가장 중요한 병목 하나만 고른다.

LOOP-ENGINEERING.md의 전체 순서·품질·기획 권한을 유지한다. 큰 계획 전에 advisor 상담, explorer 근거 탐색, 필요할 때 researcher 공식 문서 조사, worker의 한정 구현, 별도 loop-reviewer의 검수를 거친다. 같은 오류 두 번째에는 메인이 advisor에 방향 재검토를 요청한다. 긴 작업 완료 전에 누락을 상담한다.

실제 테스트·빌드·모바일/PC 브라우저 렌더·캡처 비교로 나아졌다는 근거를 확인한다. 현재 Claude 실행에서는 작업 브랜치 커밋과 PR로 보고한다. main에 직접 push하거나 자동 merge·공개 배포하지 않는다. 상태 기록은 실제 확정/병합 시점에 맞추고 아직 병합되지 않은 결과를 main 완료라고 쓰지 않는다. 한 바퀴 후 모델·검증·상담·남은 문제·다음 한 단계를 보고하고 멈춘다.


진행 화면을 위해 세션별 고유 runId로 첫 상태를 기록한다: node scripts/loop-status.mjs --engine claude --role main --status running --stage plan --run <고유-id> --summary "세션 시작". 이후 메인이 각 역할의 시작/종료, advisor 상담 세 시점, 실제 테스트 결과를 docs/codex-loop.md 형식으로 짧게 기록한다. 읽기 전용 에이전트에 로그 쓰기를 맡기지 않는다. 비용·토큰·실행하지 않은 검증을 추측하지 않는다. 마지막 상태 done은 세션 종료만 뜻하며 실제 배포·품질 통과와 구분한다.
