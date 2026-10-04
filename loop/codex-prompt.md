# Codex 카라밴 개발 한 바퀴

AGENTS.md와 docs/codex-loop.md를 읽고 START-HERE.md의 필수 진입 순서를 따른다. docs/LOOP-STATE.md의 임시 모드와 docs/DECISIONS.md를 확인한다. 현재 작업 브랜치에서 플레이어에게 보이는 가장 중요한 병목 하나만 고른다.

LOOP-ENGINEERING.md의 전체 순서·품질·기획 권한을 유지한다. 큰 계획 전에 reviewer 상담, explorer 근거 탐색, 필요할 때 researcher 공식 문서 조사, worker의 한정 구현, 별도 reviewer의 검수를 거친다. 같은 오류 두 번째에는 메인이 reviewer에 방향 재검토를 요청한다. 긴 작업 완료 전에 누락을 상담한다.

실제 테스트·빌드·모바일/PC 브라우저 렌더·캡처 비교로 나아졌다는 근거를 확인한다. 현재 Codex 실행에서는 작업 브랜치의 변경분과 검증 결과를 보고한다. main에 직접 push하거나 자동 merge·공개 배포하지 않는다. 상태 기록은 실제 확정/병합 시점에 맞추고 아직 병합되지 않은 결과를 main 완료라고 쓰지 않는다. 한 바퀴 후 모델·검증·상담·남은 문제·다음 한 단계를 보고하고 멈춘다.


현재 custom agents explorer, worker, researcher, reviewer를 필요할 때 명시적으로 호출한다. reviewer는 별도 읽기 전용 검수이며 .codex/agents/reviewer.toml 역할을 사용한다. 주어진 역할 모델을 지원하지 않거나 역할이 로드되지 않으면 BLOCKED로 보고한다. 큰 계획 전, 동일 오류 두 번째, 긴 작업 완료 전 reviewer에게 근거와 diff를 보내 확인한다. 동시에 쓰는 worker는 하나다. 원격 commit/push/merge/배포를 이 실행에서 수행하지 않는다. 변경분과 검증 근거를 작업 브랜치에 남긴 뒤 한 바퀴 후 멈춘다.

진행 상태는 메인이 node scripts/loop-status.mjs --engine codex --role <역할> --status <상태> --stage <단계> --summary "짧은 근거" 형식으로 시작/종료마다 기록한다. runId는 런처가 제공한 값을 사용한다. 검토는 --checkpoint before-plan|repeat-error|before-done을 붙인다. worker의 실제 테스트 종료 코드를 확인한 경우만 --test "테스트 이름" --result passed|failed|blocked로 기록한다. 읽기 전용 에이전트에 로그 쓰기를 맡기지 않는다. 로그에는 raw 출력, 원고, 비밀키를 넣지 않는다. docs/codex-loop.md의 기록 계약을 따른다. 기록 실패를 제품 작업 성공으로 숨기지 않는다.
