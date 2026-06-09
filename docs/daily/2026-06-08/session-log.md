# 2026-06-08 Session Log

## Drift Fix — Serving API Staging 활성화 대응 (5-Phase)

### Context
- 백엔드팀이 새 staging Serving API 가이드(`API_GUIDE.md`) 전달.
- 활성 도메인: `https://v1.api.stag.serving.signalcraft.kr` (Swagger UI `/docs` 제공).
- 가이드 ↔ 내부 ref 문서 (`docs/ref/cloud-run-api-spec.md`, `external-api-audit.md`) ↔ FE 코드 (`contracts/cloudRunApi.ts`, `api.ts`, `mockApi.ts`, `queryKeys.ts`) 사이 drift 9건 식별.
- high 3건 + 추가 작업 5건 픽스를 `phase-loop` 스킬로 5-phase atomic 진행.

### Key Finding (Phase 1 자기리뷰 중 발견)
- **`place_id`는 헤더가 아니라 path parameter**였음.
- 가이드 인증 헤더 테이블 row 4에 `place_id`가 잘못 적혀 있었으나, OpenAPI 스펙(`/openapi.json`)을 직접 fetch해 사실 확정.
- 인증 헤더는 3종만 필요: `x-auth-id`, `x-auth-provider`, `x-customer-id`.
- 따라서 `api.ts`에 `X-Place-ID` 헤더 추가하지 않았고, `VITE_PLACE_ID` env는 path param fallback 용도로만 유지.

### Phase 1 — 타입 & 헤더 & env
- `frontend/src/lib/contracts/cloudRunApi.ts`
  - Source URL을 신 staging `openapi.json` 으로 갱신.
  - `MachineDetailResponse` 2필드 → 12필드 (`machine_code`, `label`, `place_id`, `operational_state/score`, `current_state`, `remaining_score`, `active_alerts_count`, `sensor_online`, `status_updated_at` 추가, `machine_status_history[]` 주석에 "최대 5,000건" 명시).
  - `PlaceMachinesResponse` 타입 신설.
- `frontend/src/lib/runtimeConfig.ts`
  - `RuntimeConfigKey` 에 `VITE_PLACE_ID` 추가.
- `frontend/src/lib/api.ts`
  - `buildAuthHeaders()` 는 3종 유지 (place_id 추가하지 않음).
- `frontend/.env.example`
  - `VITE_X_CUSTOMER_ID` 신 staging UUID 로 갱신 (`12d5e33c-405a-4856-bf8e-51fc899c1737`).
  - `VITE_PLACE_ID=b33f995b-0e79-4551-afc4-e0c79238a18a` 추가 (path param fallback).
  - 구 mock URL 주석 라인 제거.
- `frontend/public/env.js`
  - 모든 키 목록 주석 보강.
- 검증: `npx tsc --noEmit` 0 errors.

### Phase 2 — queryKey + mockApi
- `frontend/src/lib/queryKeys.ts`
  - `placeMachines(placeId) → ['places', placeId, 'machines']` 팩토리 추가.
- `frontend/src/lib/mockApi.ts`
  - `MOCK_PLACE_ID` 상수 신설.
  - `HISTORY_POINTS_BY_PERIOD`, `isPeriodEnum`, `buildHistoryForMachine`, `toMachineDetail` 헬퍼 추가.
  - `/machines/{id}` 핸들러: period 검증(422), 머신 미발견(404), 12필드 응답.
  - `/places/{place_id}/machines` 핸들러: place_id 매칭(404), `PlaceMachinesResponse` 형태.
  - `buildMeResponse` 의 customer.id 와 places[0].id 를 신 staging UUID 로 통일.
- 검증: `npx tsc --noEmit` 0 errors, `npm run build` 48.25s 성공.

### Phase 3 — 외부 API 문서 갱신
- `docs/ref/cloud-run-api-spec.md` 전면 재작성.
  - Source URL 신 staging openapi.json.
  - 활성 라벨, Swagger UI 링크 명시.
  - 인증 헤더 3종 + `place_id` path param 경고.
  - 에러 코드 매트릭스 5종 (400/401/403/404/422).
  - `/me` 정렬/필터 규칙 명시.
  - `/machines/{id}` 12필드 + history 5000건 limit.
  - `/places/{place_id}/machines` 인벤토리/응답 row 추가.
  - `place_id` 사용 패턴 섹션 신설.
- `docs/ref/external-api-audit.md`
  - Source/Base URL/자격 갱신, 인벤토리 row 추가, place_id path param 경고 반영.
  - 2026-06-08 갱신 노트 추가.
- `docs/ref/cloud-run-frontend-deployment.md`
  - Last Updated 2026-06-08.
  - API Targets에서 구 mock URL 제거 후 archive 참조.
  - `VITE_PLACE_ID` env var row 추가.
  - docker run 예시 URL 신 staging.
- `docs/status/OPEN-ISSUES.md`
  - Cloud Run env 6종 명시 (`VITE_PLACE_ID` 추가), customer UUID 신 staging, 상태 라벨 갱신.
- `docs/status/PROJECT-STATUS.md`
  - Deployment 섹션 API 라인 활성 라벨 + Swagger 명시.
  - Last Updated 2026-06-08.

### Phase 4 — 아카이브
- `docs/archive/2026-06-08/` 폴더 신설.
- `docs/archive/2026-06-08/cloud-run-mock-spec.md` (new): 구 mock URL 시절 base/자격/4개 인벤토리 스냅샷 보존.
- `docs/archive/2026-06-08/backend-railway-residue.md` (new): Railway 시절 배경 + 이관 후 경계 + rollback 정책.
- root `CLAUDE.md` Quick Commands 라인의 stale "현재 mock docs" 표현을 활성 Swagger URL 로 정리.
- 검증: 활성 문서에서 구 mock URL/UUID 잔재 0건 (`grep -v archive`).

### Phase 5 — status board + daily log
- `docs/status/PROJECT-STATUS.md` Backend 전환 공지 섹션에 "2026-06-08 드리프트 픽스 완료" 5건 + "다음 우선순위" 4건 추가.
- 본 daily log 신설.

### Verification
- `cd frontend && npx tsc --noEmit` → 0 errors
- `cd frontend && npm run build` → 48.25s 성공, PWA precache 30 entries
- `grep -r "Railway\|signalcraft-api-55721952249\|12345678-1234-1234-1234-123456789012" docs --include="*.md" | grep -v archive | grep -v "daily/2026-06-05"` → 0 건

### Daily Sync
- Backend 전환 공지 + 다음 우선순위 4건 PROJECT-STATUS 에 반영.
- OPEN-ISSUES 의 Cloud Run env 등록 항목 6종으로 확장.

### Risks / Follow-up
- Cloud Run FE 컨테이너에 신규 env `VITE_PLACE_ID` 등록 누락 시 `/places/{id}/machines` 호출 실패 가능 → 배포 시 6종 env 등록 체크리스트.
- `mockApi` 의 `MOCK_PLACE_ID` 는 mock 전용 UUID(`00000000-...-0010`)이며 staging 자격(`b33f995b-...`)과 별개. `VITE_USE_MOCK_API=false` 전환 시 자동으로 staging 자격이 사용되므로 충돌 없음.
- 가이드 마크다운(`API_GUIDE.md`)이 헤더 표에 path param 을 끼워 적은 모호함은 백엔드팀 피드백 필요. 한편 OpenAPI 스펙이 SoT 이므로 코드/문서는 사실대로 정렬됨.

### Next Recommendations
- Cloud Run FE 컨테이너 실배포 검증.
- 외부 API JWT/Bearer 전환 (audit A1).
- `/machines` 페이지네이션 (audit A2).
- `QUERY_KEYS.userProfile` → `['me']` 시맨틱 리네임 (유보 중).

---

## PHASE-LOOP 2 — Fallback UI Infrastructure + Per-Endpoint Mock Override (2026-06-08)

### Context
첫 phase-loop (drift fix) 완료 후 운영 사이트 자동 검증 결과 mock 모드 회귀 0건. 다만 `VITE_USE_MOCK_API=false` 한 줄로 실 API 전환 시 신 staging에 없는 endpoint 9개가 한 번에 깨질 위험. 점진 전환 가능하도록 폴백 UI 인프라 + per-endpoint override 도입.

### Phase 1 — 폴백 컴포넌트 + 에러 헬퍼
- `src/components/shared/EndpointPending.tsx` (new) — 3-mode (preparing/empty/error), Tailwind classTokens + Framer Motion + aria-live.
- `src/lib/apiErrorHelper.ts` (new) — `ApiError` class, `isApiPendingStatus`, `getEndpointPendingMode`, `throwIfNotOk`.
- 검증: tsc 0 errors. Opus 자기리뷰 10/10 PASS.

### Phase 2 — 로컬 dev 서버 + agent-browser 자동 검증
- 임시 `.env.local`에 `VITE_USE_MOCK_API=false` + 신 staging 자격 작성.
- `npm run dev` 백그라운드, agent-browser 세션 `sc-fb`로 4페이지 순회.
- 결과: console.error 0건, unhandledrejection 0건. 신 staging 404: `/notifications/`, `/notifications/settings`, `/me`(예상 외, 자격 확인 후속 필요).
- 페이지별: `/dashboard` 기존 빨간 박스 폴백 / `/machines` 200 응답이지만 label sparse / `/report` "리포트 없음" 폴백 정상 / `/settings` "사용자 님" 폴백 정상.
- 사전 식별 9개 회귀 페이지와 실제 결과 매칭, 신규 회귀 발견 없음.
- `.env.local` 삭제, 세션 종료.
- Opus 자기리뷰 10/10 PASS (조건부 — Dashboard layout 보존 검토는 Phase 3 자체 진단으로 보강).

### Phase 3 — 페이지별 폴백 통일 적용 (8개 페이지)
- DashboardPage — `/me`, `/dashboard/home` throwIfNotOk + Activity 아이콘 EndpointPending.
- AnalysisTab — TrendingDown 아이콘.
- SmartLogTab — FileText 아이콘.
- MaintenanceTab — Wrench 아이콘, error 변수 신설.
- NotificationModal — Bell 아이콘.
- Header (알림 뱃지) — throwIfNotOk + `retry:false` silent 폴백.
- ReportPage — `/machines/`, `/reports/` throwIfNotOk (latestReport는 기존 null 패턴 보존).
- SettingsPage — `/notifications/settings` throwIfNotOk + `retry:false` silent.
- 검증: tsc 0 errors, build 5.87s, PWA precache 30 entries.
- Opus 자기리뷰 10/10 PASS.

### Phase 4 — Per-Endpoint Mock Override
- `mockApi.ts`: `ENDPOINTS_DISABLED_IN_MOCK: Set<string>` 상수(현재 빈) + `isMockApiEnabledForEndpoint(path)` 함수 신설.
- `api.ts`: `isMockApiEnabled()` → `isMockApiEnabledForEndpoint(normalizedPath)` 교체.
- `.env.example`: "Per-Endpoint Mock Override" 섹션 신설 (코드 상수 제어 방식 안내).
- 정확한 path 매칭 (query string 제외, sub-path 자동 포함 X) — 주석으로 명시.
- 검증: tsc 0 errors, build 통과.
- Opus 자기리뷰 10/10 PASS.

### Phase 5 — 문서 동기화 + daily log
- `docs/ref/cloud-run-api-spec.md`에 "FE Fallback Pattern (2026-06-08~)" 섹션 신설 — 인프라 / 사용 패턴 / Per-Endpoint Override 운영 가이드.
- `docs/status/PROJECT-STATUS.md` — 2026-06-08 phase-loop 2 완료 5건 + 다음 우선순위 갱신.
- 본 daily log append (PHASE-LOOP 2 섹션).

### Verification
- `cd frontend && npx tsc --noEmit` → 0 errors (각 phase)
- `cd frontend && npm run build` → 성공, PWA precache 30 entries
- 콘솔/runtime 에러 누적 0건
- `isMockApiEnabled` 외부 호출처 0건 (grep)

### Daily Sync
- PROJECT-STATUS Phase-loop 2 완료 5건 + 다음 우선순위 5건 추가.
- cloud-run-api-spec FE Fallback Pattern 섹션으로 운영 가이드 통합.

### Risks / Follow-up
- 백엔드 endpoint 활성화 시 `mockApi.ts ENDPOINTS_DISABLED_IN_MOCK`에 path 추가만으로 점진 전환 — 빌드 후 배포 필요.
- 신 staging `/me` 404 — 자격 또는 API 일시 장애 확인 필요 (Phase 3 범위 밖).
- 실 staging `/machines` 응답 sparse — label null 폴백 (`label ?? machine_code`) 별도 백로그.
- `enabled: isOpen` 패턴(NotificationModal)은 모달 열린 후 첫 호출 시점에만 폴백 노출 — 의도된 동작.

### Next Recommendations
- 백엔드 endpoint 순차 활성화 (`/dashboard/home` → `/notifications/*` → `/reports/*`).
- 각 활성화 시점에 `ENDPOINTS_DISABLED_IN_MOCK`에 path 추가 후 재배포.
- `/machines` label null 폴백 (`label ?? machine_code`) 백로그 작업.
- Vercel preview 자동 검증 CI 도입 (agent-browser 스크립트 GitHub Actions).
