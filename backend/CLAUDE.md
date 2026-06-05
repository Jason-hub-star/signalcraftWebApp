# backend/ — ⚠️ DEPRECATED (2026-06-05)

> 본 디렉토리는 **Google Cloud Run 외부 서비스로 이관 완료**되어 더 이상 신규 작업 대상이 아닙니다.
> 코드는 rollback 대비로 잔존하되, FE는 더 이상 본 백엔드를 호출하지 않습니다.
> 활성 백엔드 스펙: `docs/ref/cloud-run-api-spec.md`

## Why Deprecated
- 2026-06-05 결정: FE는 외부 Cloud Run FastAPI(`signalcraft-api-*.asia-northeast3.run.app`)로 단일화.
- 본 레포 `backend/`(구 Railway 배포 대상)는 신규 기능 추가/배포 중단.
- 물리 삭제는 후속 PR에서 수행 예정.

## Historical Reference (참고용)
구 구조 (Router/Service/Repository 계층, FastAPI + Supabase SDK)는 Cloud Run 신규 BE 작업 시 참고 자료로 활용 가능.

```
backend/
├── main.py              — Uvicorn 엔트리포인트
├── app/
│   ├── main.py          — FastAPI app 생성 + 라우터 등록
│   ├── core/config.py   — 환경변수, Supabase 설정
│   └── features/        — dashboard / machines / notifications / reports / settings / shared
├── Dockerfile
├── railway.toml         — (legacy)
├── fly.toml             — (legacy)
└── requirements.txt
```

## Do Not
- 본 디렉토리 코드 신규 수정 금지
- Railway에 신규 배포 금지
- 본 BE에 의존하는 FE 코드 신규 작성 금지

## Need a Backend Change?
외부 Cloud Run 레포에서 작업 + `docs/ref/external-api-audit.md`의 백로그(A1~A8) 참고.
