# AI Context Start Here

기준일: 2026-03-16 (KST)

## Active Docs (read in order)
1. `ai-context/START-HERE.md`
2. `ai-context/master-plan.md`
3. `ai-context/project-context.md`
4. `ai-context/coding-guideline.md`

## Current Status Snapshot
- 현재 단계: **Phase 7 (Cloud Run 백엔드 전환) 진행 중**
- 배포 상태: FE(Vercel) + BE(Google Cloud Run, asia-northeast3) — 본 레포 `backend/`는 DEPRECATED
- 최신 반영: 외부 Cloud Run FastAPI(`/health`, `/me`, `/machines`, `/machines/{id}`)로 FE 단일화 진행 중
- 최신 커밋 기준: `docs/status/PROJECT-STATUS.md` 우선
- 외부 API 스펙: `docs/ref/cloud-run-api-spec.md`

## Source of Truth
- 운영 상태: `docs/status/PROJECT-STATUS.md`
- 미해결 이슈: `docs/status/OPEN-ISSUES.md`
- 구조/아키텍처: `docs/ref/architecture-diagrams.md`
- 누적 진행: `docs/ref/progress-archive.md`

## Logs and Archive Rules
- 작업 중 기록: `docs/daily/YYYY-MM-DD/`
- 마일스톤 종료/핵심 변경은 `ai-context/archive/YYYY-MM-DD/`에 반영
- 운영 규칙/의사결정 충돌 시: 최신 archive > 과거 archive

## Working Rule
- 일반 작업: Active Docs 순서대로 확인 후 구현
- 첫 done Task 전에는 새 주제 확장 금지
- Task는 30-90분 단위로 쪼개고, 성공 시 즉시 status에 반영
