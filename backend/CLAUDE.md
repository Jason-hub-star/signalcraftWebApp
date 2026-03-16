# backend/

FastAPI + Pydantic v2 기반 Backend API.

## Tech
- Python 3.x, FastAPI, Pydantic v2
- Supabase SDK (PostgreSQL)
- Numba (연산 가속, 신호 처리)

## 디렉토리 구조
```
backend/
├── main.py              — Uvicorn 엔트리포인트
├── app/
│   ├── main.py          — FastAPI app 생성 + 라우터 등록
│   ├── core/
│   │   └── config.py    — 환경변수, Supabase 설정
│   └── features/        — 기능 모듈 (Frontend 1:1 대응)
│       ├── dashboard/   — 대시보드 API
│       ├── machines/    — 설비 관리 API
│       ├── notifications/ — 알림 설정 API
│       ├── reports/     — 리포트 API
│       ├── settings/    — 환경설정 API
│       └── shared/      — 공유 유틸리티
├── Dockerfile           — Docker 이미지
├── fly.toml             — Fly.io 설정 (legacy)
├── railway.toml         — Railway 설정 (현재)
├── requirements.txt     — 의존성
└── start.sh             — 컨테이너 시작 스크립트
```

## Rules
- Router / Service / Repository 계층 분리
- 모든 엔드포인트는 소유권 검증 (user_id 기반)
- Supabase RLS 정책 필수
- `.env` 커밋 금지 (secrets는 Railway 환경변수)

## Run & Check
```bash
python -m venv venv
.venv\Scripts\Activate.ps1   # Windows
pip install -r requirements.txt
python main.py               # 개발 서버 (port 8000)
python -m compileall app     # 컴파일 체크
```

## API Docs
- 로컬: `http://localhost:8000/docs` (Swagger UI)

## Deployment
- Railway (signalcraft-api)
- Dockerfile + start.sh (PORT 환경변수 바인딩)
