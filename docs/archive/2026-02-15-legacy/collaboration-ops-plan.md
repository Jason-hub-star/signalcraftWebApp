# Collaboration Ops Plan (Single-File Bootstrap)

문서 경로: `docs/collaboration-ops-plan.md`
목적: 이 파일 하나만 AI에게 보여줘도, 협업 문서를 현재 규칙에 맞게 자동 점검/재구성/최신화한다.

## 문서 역할 (고정)
- 이 문서는 `운영 규칙/템플릿`만 관리하는 메타 문서다.
- 오늘 작업 계획/진행/완료/리스크 같은 실행 기록은 이 파일에 직접 작성하지 않는다.

### 실행 기록 작성 위치
1. 오늘 작업 계획: `docs/01-today-plan.md`
2. 완료 반영: `docs/02-progress.md`
3. 미해결 이슈/리스크: `docs/03-open-issues.md`
4. 다음 세션 인수인계: `docs/05-handoff.md`
5. 상세 타임라인 로그: `docs/logs/YYYY-MM-DD-session-log.md`

### 분리 원칙
- `collaboration-ops-plan.md`에는 규칙, 트리거, 구조, 절차만 유지한다.
- 작업 중 변경사항은 반드시 `01~05`와 `logs`에 기록한다.
- 하루 마감 시 상세 로그/임시 문서는 `archive/YYYY-MM-DD/`로 이동한다.

## 1) 사용 규칙 (Trigger)
아래 문장을 그대로 포함해 AI에게 전달하면 된다.

`이 문서를 기준으로 docs를 자동 정리해줘. Active Docs만 최신 상태로 유지하고, 오래된 정보는 archive로 이동해.`

## 2) 운영 원칙
- 작업은 작은 단위(Task)로 쪼갠다. (권장 30-90분)
- 성공한 Task만 즉시 문서에 반영한다.
- 오래된/중복/추정 정보는 Active Docs에서 제거한다.
- 하루 종료 시 당일 상세 기록은 archive로 이동한다.
- 다음날 시작 전 Active Docs는 즉시 실행 가능한 상태여야 한다.

## 3) 표준 문서 구조
Active Docs (루트):
1. `docs/00-index.md`
2. `docs/01-today-plan.md`
3. `docs/02-progress.md`
4. `docs/03-open-issues.md`
5. `docs/04-rules.md`
6. `docs/05-handoff.md`
7. `docs/logs/YYYY-MM-DD-session-log.md`

Archive:
- `docs/archive/YYYY-MM-DD/`

## 4) 자동 구성 절차 (AI 실행용)
1. `docs` 파일 목록을 읽고 Active/Archive를 분리한다.
2. Active Docs 6개 파일(00-05)이 없으면 생성한다.
3. 기존 문서에서 유효 정보만 추출해 00-05로 재배치한다.
4. 깨진 참조 경로/존재하지 않는 문서 링크를 수정한다.
5. 동일 주제 중복 문서는 병합하고, 원본은 archive로 이동한다.
6. 오늘 날짜 로그 파일이 없으면 `logs/YYYY-MM-DD-session-log.md` 생성한다.
7. 결과를 `00-index.md`에 "오늘 읽기 순서"로 고정한다.

## 5) 파일별 책임
- `00-index.md`: 오늘 읽기 순서, Active Docs 링크, Source of Truth 링크
- `01-today-plan.md`: 오늘 Task 목록(todo/doing/done), 각 Task의 AC/검증 명령
- `02-progress.md`: 성공한 변경만 누적 (변경/이유/검증/영향)
- `03-open-issues.md`: 미해결 이슈, 원인, 다음 액션, 우선순위
- `04-rules.md`: 코딩/리뷰/인코딩/보안 규칙
- `05-handoff.md`: 내일 시작 체크리스트, 첫 작업 1-3개

## 6) Task 기록 규격
각 Task는 아래 필드를 반드시 포함한다.
- `id`
- `goal`
- `files`
- `verify`
- `acceptance_criteria`
- `status` (`todo|doing|done`)

## 7) End-of-Day 루틴
1. `01-today-plan.md` 상태 정리
2. 완료된 Task를 `02-progress.md`에 반영
3. 미완료 항목을 `03-open-issues.md`로 이동
4. `05-handoff.md`에 내일 첫 작업 작성
5. 당일 상세 로그/임시 문서는 `archive/YYYY-MM-DD/`로 이동
6. `00-index.md`를 다음날 기준으로 업데이트

## 8) Start-of-Day 루틴
1. `00-index.md` -> `05-handoff.md` -> `01-today-plan.md` 순서로 읽기
2. 전일 미완료 Task를 오늘 최우선으로 배치
3. 첫 done Task 전에는 새 주제 확장 금지

## 9) 품질 게이트
- Active Docs는 UTF-8 + LF
- 존재하지 않는 경로 참조 금지
- 추정/가정 문구 금지, 근거 경로 명시
- 리뷰 시 치명적/높음 이슈 0개여야 머지 가능

## 10) AI에게 마지막으로 전달할 한 줄
`이 문서를 운영 기준으로 사용해 docs를 자동 재구성하고, 완료 후 변경 요약과 남은 리스크를 보고해.`
