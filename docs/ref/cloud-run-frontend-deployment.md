# Cloud Run Frontend Deployment

Last Updated: 2026-06-08

## Scope
- 기존 Vercel 호스팅 React/Vite PWA를 Google Cloud Run 정적 컨테이너로 이전한다.
- 본 레포 `backend/`는 deprecated 상태이며 신규 배포 대상이 아니다.
- FE는 외부 FastAPI를 호출한다. DB 직접 접근 정보는 별도 자격 전달 후 개발/배포 방식을 분리한다.

## API Targets
| 용도 | URL | 상태 |
|---|---|---|
| Staging serving API | `https://v1.api.stag.serving.signalcraft.kr` | **활성** (2026-06-08 OpenAPI 확인). Swagger: `/docs` |

> 구 Cloud Run mock (`signalcraft-api-55721952249.asia-northeast3.run.app`) 시절 기록은 `docs/archive/2026-06-08/cloud-run-mock-spec.md` 참조.

## Runtime Config
Vite의 `VITE_*` 값은 원래 빌드 타임에 고정된다. Cloud Run 런타임 환경변수로 API 주소/인증 헤더를 바꿀 수 있도록 컨테이너 시작 시 `/env.js`를 생성한다.

관련 파일:
- `frontend/src/lib/runtimeConfig.ts`
- `frontend/public/env.js`
- `frontend/docker-entrypoint.sh`
- `frontend/nginx.conf`

## Required Environment Variables
| 변수 | 설명 |
|---|---|
| `VITE_API_URL` | 외부 FastAPI base URL |
| `VITE_USE_MOCK_API` | `true` 또는 unset이면 FE mock 사용, `false`이면 외부 API 호출 |
| `VITE_X_AUTH_ID` | staging header auth id |
| `VITE_X_AUTH_PROVIDER` | staging header auth provider |
| `VITE_X_CUSTOMER_ID` | staging customer UUID |
| `VITE_PLACE_ID` | default place_id (path param fallback, `/places/{id}/machines` 호출 시) |
| `VITE_CLIENT_THEME_ID` | 선택 고객 테마 |

## Local Container Smoke
```bash
cd frontend
docker build -t signalcraft-fe .
docker run --rm -p 8080:8080 \
  -e VITE_API_URL=https://v1.api.stag.serving.signalcraft.kr \
  -e VITE_USE_MOCK_API=true \
  signalcraft-fe
```

확인:
- `http://localhost:8080/`가 SPA로 로드된다.
- `http://localhost:8080/env.js`가 `Cache-Control: no-store`로 응답한다.
- `/dashboard` 같은 딥링크가 `index.html`로 fallback된다.

## Deploy Notes
- Cloud Run은 컨테이너 포트로 `PORT`를 주입한다. nginx 설정은 시작 시 `${PORT}`를 반영한다.
- `/env.js`, `/sw.js`, `/manifest.webmanifest`는 캐시하지 않는다.
- 해시가 붙은 정적 assets는 장기 캐시한다.
