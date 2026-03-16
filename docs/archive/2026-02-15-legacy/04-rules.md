# Engineering Rules

Last Updated: 2026-02-15

## Runbook
- Frontend:
  - `cd frontend`
  - `npm install`
  - `npm run dev`
  - `npm run build`
- Backend:
  - `cd backend`
  - `python -m venv venv`
  - `.venv\Scripts\Activate.ps1`
  - `pip install -r requirements.txt`
  - `python main.py`
  - API Docs: `http://localhost:8000/docs`

## Core Coding Rules
- Frontend Query Key는 `QUERY_KEYS` 팩토리만 사용.
- mutation 후 무효화는 대상 key만 정밀 invalidation.
- Backend는 Router/Service/Repository 계층 분리 준수.
- 모든 엔드포인트는 소유권/권한 검증 포함.
- `app/features/` 디렉토리는 Frontend 기능 구조와 1:1 대응.

## Security Rules
- `.env` 계열 파일 커밋 금지.
- Supabase RLS 정책 필수 (모든 테이블).
- 비구독자 잠금 모드에서 실제 데이터 DOM 노출 금지.
- API 엔드포인트 소유권 검증 필수 (user_id 기반).

## Review Rubric
- 우선순위: 동작 회귀 > 데이터 정합성 > 보안/권한 > 성능 회귀 > 테스트 누락.
- 심각도:
  - `critical`: 데이터 유출/권한 우회/핵심 플로우 완전 차단
  - `high`: 핵심 기능 오동작
  - `medium`: 성능/모바일/엣지 케이스
  - `low`: 문구/UI/리팩터링
- 머지 기준: `critical`, `high` 0개.

## Encoding Rules
- 모든 코드/문서 UTF-8 + LF.
- ANSI/EUC-KR/CP949 저장 금지.

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide React
- **Backend**: Python 3.x, FastAPI, Pydantic v2, Supabase SDK
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Frontend(Vercel), Backend(Fly.io, nrt region)

## Quick Check Commands
- `cd frontend && npm run build`
- `cd backend && python -m compileall app`
