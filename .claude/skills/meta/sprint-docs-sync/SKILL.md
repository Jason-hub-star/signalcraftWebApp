---
name: sprint-docs-sync
description: "문서 동기화 — sprint docs, 문서 동기화, docs sync, 정리, 상태 업데이트"
---

## Trigger
사용자가 "문서 동기화", "docs sync", "정리", "상태 업데이트"를 요청할 때 활성화.

## Input Context
없음 (전체 문서 대상)

## Read First
1. 루트 `CLAUDE.md` — Source of Truth Docs 섹션
2. `ai-context/START-HERE.md` — 현재 상태 스냅샷
3. `docs/status/PROJECT-STATUS.md` — 기능 상태
4. `docs/status/OPEN-ISSUES.md` — 미해결 이슈

## Do (순서 엄수)
1. `git log --oneline -20` — 최근 커밋 확인
2. `docs/status/PROJECT-STATUS.md` — 기능 상태 업데이트 (커밋 기반)
3. `docs/status/OPEN-ISSUES.md` — 해결된 이슈 제거, 새 이슈 추가
4. `ai-context/master-plan.md` — Phase/우선순위 업데이트
5. `ai-context/START-HERE.md` — 상태 스냅샷 갱신
6. 오늘 날짜 daily 로그 확인/생성 (`docs/daily/YYYY-MM-DD/`)
7. 주간 롤업 필요 시 `docs/weekly/YYYY-WNN.md` 생성/업데이트

## Do Not
1. 코드 파일을 수정하지 않는다
2. 추정/가정 문구를 문서에 작성하지 않는다
3. 존재하지 않는 경로를 참조하지 않는다
4. archive 문서를 수정하지 않는다

## Validation
- [ ] 모든 문서 참조 경로가 유효한지 확인
- [ ] PROJECT-STATUS 기능 상태가 실제 코드와 일치
- [ ] OPEN-ISSUES에 해결된 이슈가 남아있지 않음
- [ ] master-plan Phase 상태가 최신

## Output Template
```
[sprint-docs-sync 완료]
- PROJECT-STATUS: {updated/no change}
- OPEN-ISSUES: {n}개 업데이트
- master-plan: {updated/no change}
- START-HERE: {updated/no change}
- daily log: {created/updated/exists}
- weekly rollup: {created/N/A}
```
