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
