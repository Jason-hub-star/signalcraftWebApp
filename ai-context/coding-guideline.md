# SignalCraft Biz Coding Guideline

기준일: 2026-03-16 (KST)

## Frontend

### 기본 규칙
- React 19 + Vite + Tailwind CSS v4
- TypeScript strict mode
- Query Key는 `QUERY_KEYS` 팩토리만 사용
- mutation 후 무효화는 대상 key만 정밀 invalidation
- TanStack Query 기반 서버 상태 관리

### 디렉토리 규칙
- `src/features/` — 기능 모듈 (Backend 구조와 1:1 대응)
- `src/components/` — 공유 UI 컴포넌트
- `src/lib/` — 유틸리티, API 클라이언트, 훅

### UI 원칙
- Toss-Style: 간결, 신뢰감, 대화체
- 숫자는 크고 굵게, 설명은 "~하고 있어요" 체
- 3-State Logic: 정상(Mint Green) / 주의(Warm Orange) / 위험(Soft Red)
- Framer Motion + Lucide React 아이콘

## Backend

### 기본 규칙
- Python 3.x + FastAPI + Pydantic v2
- Router / Service / Repository 계층 분리
- 모든 엔드포인트는 소유권/권한 검증 포함 (user_id 기반)

### 디렉토리 규칙
- `app/api/` — 라우터 (엔드포인트 정의)
- `app/services/` — 비즈니스 로직
- `app/models/` — Pydantic 모델

## 공통

### 인코딩
- 모든 코드/문서: UTF-8 + LF
- ANSI/EUC-KR/CP949 저장 금지

### 보안
- `.env` 계열 파일 커밋 금지
- Supabase RLS 정책 필수 (모든 테이블)
- API 엔드포인트 소유권 검증 필수

### 리뷰 기준
- 우선순위: 동작 회귀 > 데이터 정합성 > 보안/권한 > 성능 회귀 > 테스트 누락
- 심각도: critical / high / medium / low
- 머지 기준: critical, high 0개

### 빌드 검증
```bash
cd frontend && npm run build
cd backend && python -m compileall app
```
