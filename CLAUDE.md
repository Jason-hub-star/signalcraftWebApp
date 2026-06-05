# SignalCraft Biz Orchestration Index

무설정 AI 시설 관리 솔루션 — automation-first operating index.

## Repo Boundary
- Write Repo: `C:\Users\ezen601\Desktop\Jason\signalcraftapp`

## Context Loading Order (새 세션 시작 시)
1. **이 파일** — 전체 구조 + 규칙 + 스킬 인덱스
2. `ai-context/START-HERE.md` — 프로젝트 진입점
3. `ai-context/master-plan.md` — 현재 Phase/Sprint + 우선순위
4. `docs/status/PROJECT-STATUS.md` — 기능 상태
5. 작업 대상 폴더의 `CLAUDE.md` — 해당 영역 규칙

## Execution Rules (MUST)
1. 파일 수정 전 반드시 현재 파일 내용을 직접 읽고 작업한다.
2. 기존 코드(타입/훅/함수/API)를 우선 재사용하고 중복 구현을 피한다.
3. Frontend Query Key는 `QUERY_KEYS` 팩토리만 사용한다.
4. Backend는 Router/Service/Repository 계층 분리를 준수한다.
5. CLAUDE.md는 slim으로 유지하고 상세는 `docs/` 또는 `ai-context/`에 둔다.
6. 파괴적 git 조작은 명시적 요청 없이 금지한다.
7. 작업 종료 시 daily log + status board를 동기화한다.
8. `.env` 계열 파일 커밋 금지.

---

## Skills (`.claude/skills/`)

변경 시점에서 drift를 방지하는 4개 스킬. 상세: `.claude/skills/CLAUDE.md`

| # | 스킬 | 트리거 키워드 | 경로 |
|---|------|-------------|------|
| 1 | **pre-commit-validate** | 커밋, pre-commit, 검증 | `signalcraft-guide/core/pre-commit-validate/` |
| 2 | **api-endpoint-add** | 새 API, 엔드포인트, 라우터 추가 | `signalcraft-guide/ops/api-endpoint-add/` |
| 3 | **dashboard-feature-add** | 대시보드 기능, 카드 추가 | `signalcraft-guide/ops/dashboard-feature-add/` |
| 4 | **sprint-docs-sync** | 문서 동기화, sprint docs | `meta/sprint-docs-sync/` |

### 스킬 사용법
작업 키워드가 매칭되면 해당 `SKILL.md`의 **Read First** 파일들을 먼저 읽고, **Do** 절차를 순서대로 실행, **Validation** 체크리스트로 완료 확인.

---

## Automation Prompts (External Scheduler)

야간 drift 탐지 자동화. 스킬(preventive)과 상호 보완(detective).

| 자동화 | 스케줄 | 프롬프트 |
|--------|--------|----------|
| code-doc-align | 10:30 KST | `.claude/automations/code-doc-align.prompt.md` |
| health-monitor | 11:30 KST | `.claude/automations/automation-health-monitor.prompt.md` |
| docs-nightly-organizer | 22:00 KST | `.claude/automations/docs-nightly-organizer.prompt.md` |

---

## Source of Truth Docs
- `ai-context/START-HERE.md` — 프로젝트 진입점
- `ai-context/master-plan.md` — 마스터 플랜
- `ai-context/project-context.md` — 프로젝트 컨텍스트
- `ai-context/coding-guideline.md` — 코딩 가이드라인
- `docs/status/PROJECT-STATUS.md` — 프로젝트 상태
- `docs/ref/PRD.md` — 제품 요구사항 정의서
- `docs/ref/schema.md` — DB 스키마
- `docs/ref/architecture-diagrams.md` — 아키텍처 다이어그램

---

## Folder CLAUDE.md Map (주요)

### Backend
> ⚠️ **DEPRECATED — 2026-06-05** — `backend/` 디렉토리는 Google Cloud Run 외부 서비스로 이관 완료. 코드는 rollback 대비로 잔존하되 신규 작업 금지. 외부 API 스펙은 `docs/ref/cloud-run-api-spec.md` 참조.

### Frontend
| 폴더 | 핵심 내용 |
|------|----------|
| `frontend/` | React 19, Vite, Tailwind CSS v4 |
| `frontend/src/` | features 디렉터리 1:1 대응 |

### Docs & Context
| 폴더 | 핵심 내용 |
|------|----------|
| `docs/status/` | 상태 문서 (PROJECT-STATUS, OPEN-ISSUES) |
| `docs/ref/` | PRD, 스키마, 아키텍처 참조 |
| `docs/daily/` | 일별 세션 로그 |
| `docs/weekly/` | 주간 롤업 |
| `ai-context/` | 마스터 플랜, 코딩 가이드 |

---

## Quick Commands
- FE 빌드: `cd frontend && npm run build`
- FE 타입 체크: `cd frontend && npx tsc --noEmit`
- 외부 API 스펙 확인: `https://signalcraft-api-55721952249.asia-northeast3.run.app/docs`

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide React
- **Backend (외부)**: Google Cloud Run (asia-northeast3) — FastAPI 서비스, 본 레포에서 관리하지 않음
- **Database**: Supabase (PostgreSQL, RLS 활성화)
- **Deployment**: Frontend(Vercel), Backend(Google Cloud Run — 별도 레포)

## Security Rules
- Supabase RLS 정책 필수 (모든 테이블).
- 비구독자 잠금 모드에서 실제 데이터 DOM 노출 금지.
- API 엔드포인트 소유권 검증 필수 (user_id 기반).

## Review Rubric
- 우선순위: 동작 회귀 > 데이터 정합성 > 보안/권한 > 성능 회귀 > 테스트 누락.
- 머지 기준: `critical`, `high` 0개.

## Encoding Rules
- 모든 코드/문서 UTF-8 + LF.

## Completion Format
- Scope / Files / Validation / Daily Sync / Risks / Next Recommendations
