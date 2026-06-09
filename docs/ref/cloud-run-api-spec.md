# Cloud Run API Spec (활성 백엔드)

Last Updated: 2026-06-08
Source: `https://v1.api.stag.serving.signalcraft.kr/openapi.json`
Title: SignalCraft Serving API (staging) v0.0.1
Region: asia-northeast3 (Seoul, 외부 서비스)

> 본 문서는 **활성 백엔드**의 엔드포인트 인벤토리입니다. 개선 백로그는 `external-api-audit.md` 참조.
> 본 레포 `backend/` (구 Railway)는 DEPRECATED — 호출 금지.
> 구 mock URL (`signalcraft-api-55721952249.asia-northeast3.run.app`) 시절 메모는 `docs/archive/2026-06-08/` 참고.

## API Base URLs

| 용도 | URL | 상태 |
|---|---|---|
| Staging serving API | `https://v1.api.stag.serving.signalcraft.kr` | **활성** (2026-06-08 OpenAPI 확인) |
| Swagger UI | `https://v1.api.stag.serving.signalcraft.kr/docs` | 인증 헤더 입력 후 직접 호출 가능 |

---

## 인증

모든 비즈 엔드포인트는 **3종 헤더** 필수 (`/health` 제외).

| Header | 타입 | 비고 |
|---|---|---|
| `X-Auth-Id` | string | `VITE_X_AUTH_ID` |
| `X-Auth-Provider` | string | `VITE_X_AUTH_PROVIDER` |
| `X-Customer-ID` | UUID | `VITE_X_CUSTOMER_ID` |

> ⚠️ HTTP 헤더는 case-insensitive. OpenAPI 스펙은 `x-auth-id`처럼 소문자로 표기되어 있지만 FE에서는 가독성을 위해 `X-Auth-Id` 형태로 전송.
> ⚠️ `place_id`는 **헤더가 아니라 path parameter**입니다 (`/places/{place_id}/machines`). 가이드 마크다운(`API_GUIDE.md`) 인증 표에 잘못 끼워 적힌 경우가 있어 주의.

### 인증 실패 코드 매트릭스

| 상태 코드 | 원인 |
|---|---|
| `400` | 헤더 누락 또는 UUID 형식 오류 |
| `401` | X-Auth-Provider / X-Auth-Id 불일치 |
| `403` | X-Customer-ID가 DB에 없거나 비활성화 상태 |
| `404` | 리소스 미발견 (machine_id / place_id 등) |
| `422` | FastAPI 검증 실패 (period enum, body 등) |

### 스테이징 자격
```
X-Auth-Id: poc_raven_0001
X-Auth-Provider: demo_provider
X-Customer-ID: 12d5e33c-405a-4856-bf8e-51fc899c1737
# Default place_id (path param fallback)
VITE_PLACE_ID=b33f995b-0e79-4551-afc4-e0c79238a18a
```

---

## 엔드포인트

| Method | Path | 인증 | 비고 |
|---|---|---|---|
| GET | `/health` | ❌ | 메타 헬스체크 |
| GET | `/me` | ✅ | 사용자/고객사/현장/정비사 컨텍스트 |
| GET | `/machines` | ✅ | 고객사 전체 머신 상태 스냅샷 |
| GET | `/machines/{machine_id}` | ✅ | 머신 상세 + 상태 이력 |
| GET | `/places/{place_id}/machines` | ✅ | 현장별 머신 목록 |

### GET /health [meta]
- 응답: empty `{}` 또는 `{ status, version, env }`
- 헤더 불필요

### GET /me [고객사]
- 응답: `MeResponse`
  - `user`: UserInfo (id, email, name, phone, role, is_active)
  - `customer`: CustomerInfo (id, name, is_active)
  - `places[]`: PlaceInfo (id, name, sub_name?, address?, is_active)
  - `technicians[]`: TechnicianInfo (id, name, phone, address, is_primary, is_active)
- 정렬/필터 규칙
  - `places`: `is_active=true`만, 이름 오름차순
  - `technicians`: `is_active=true`만, `is_primary=true` 우선 정렬
- 비고: 현재 staging에서 `user` 필드는 OAuth 연동 전이므로 빈 값으로 반환됨.

### GET /machines [머신]
- 응답: `MachinesResponse`
  - `machines[]`: CloudRunMachineStatus
    - `machine_id` (UUID), `machine_code`, `label?`
    - `operational_state`: `running` \| `stopped` \| `error` \| `unknown`
    - `current_state`: `unknown` \| `normal` \| `warning` \| `abnormal` \| `critical` \| `offline`
    - `operational_score?` (0.0~1.0), `remaining_score?`
    - `active_alerts_count` (기본 0)
    - `sensor_online` (bool, 최근 10분 이내 하트비트 수신 여부)
    - `updated_at` (ISO timestamp \| null)
- 정렬: `machine_code` 오름차순

### GET /machines/{machine_id} [머신]
- Path: `machine_id` (UUID)
- Query: `period` ∈ {`24h`, `3d`, `5d`, `7d`} — **필수**
- 응답: `MachineDetailResponse` (총 12필드)
  - `machine_id`, `machine_code`, `label`, `place_id`
  - `operational_state`, `operational_score`, `current_state`, `remaining_score`
  - `active_alerts_count`, `sensor_online`
  - `status_updated_at` (현재 상태 마지막 갱신 시각, nullable)
  - `machine_status_history[]`: MachineStatusHistoryPoint
    - `id`, `operational_state`, `operational_score?`, `current_state`, `recorded_at`
    - 정렬: `recorded_at` 내림차순, **최대 5,000건**
- 에러: `404` (해당 머신을 찾을 수 없습니다)

### GET /places/{place_id}/machines [머신]
- Path: `place_id` (UUID, `/me` 응답의 `places[].id`)
- 응답: `PlaceMachinesResponse`
  - `place_id` (UUID)
  - `machines[]`: CloudRunMachineStatus (`/machines`와 동일 shape)
- 에러: `404` (해당 현장을 찾을 수 없습니다)

---

## FE 매핑

| Cloud Run | FE 사용처 | 어댑터 |
|---|---|---|
| `GET /me` | `DashboardPage.userProfile`, `ProfileCard` | `MeResponse` → `UserProfile` (name/email/role만 우선) |
| `GET /machines` | `MachinePage` | `MachinesResponse.machines[]` → 내부 `Machine` shape (6→3 state via `machineStateAdapter.toLegacyMachineStatus`) |
| `GET /machines/{id}` | 머신 상세 차트 | `MachineDetailResponse.machine_status_history[]` |
| `GET /places/{id}/machines` | 현장 필터 (옵션, 단일 place에서는 `/machines` 사용 가능) | `PlaceMachinesResponse.machines[]` |
| `GET /health` | (선택) PWA 헬스체크 | 없음 |

## FE에서 mock으로 유지되는 엔드포인트
Cloud Run에 없으므로 `mockApi`가 계속 응답:
- `/dashboard/home`, `/dashboard/equipment-usage`, `/dashboard/machine-detail/{analysis|smart-log|maintenance}`
- `/notifications/*`, `/reports/*`, `/maintenance/*`, `/service-tickets/*`

→ `VITE_USE_MOCK_API=false`로 켜면 위 경로는 404. UI 측에서 "준비 중" 폴백 노출.

---

## 어댑터 규약 (FE 내부)

### Score 의미 (2026-06-05 자기리뷰 반영)
- `operational_score` → **운전 건강도** (health %로 표시 가능)
- `remaining_score` → **남은 수명** 의미. health 표시 fallback에서 제외.
- FE health 산출 순서: `operational_score ?? HEALTH_FROM_OPERATIONAL[current_state]`

### MeResponse 미제공 필드
- Cloud Run `/me`에 `device_count`, `plan` 없음 → FE `UserProfile`에서 `optional`로 두고 UI는 `undefined` → "미정"으로 표시.

### `place_id` 사용 패턴
- FE 부팅 시 `VITE_PLACE_ID` env를 기본값으로 사용 (fallback)
- `/me` 응답이 도착하면 `places[0].id`로 갱신 (다중 place 지원 시 selector 도입)
- `/places/{id}/machines` path param에 주입

## FE Fallback Pattern (2026-06-08~)

### 목적
신 staging API에 아직 없는 endpoint(`/dashboard/*`, `/notifications/*`, `/reports/*` 등)를 호출할 때 흰 화면 대신 "준비 중" 폴백 UI를 표시. 백엔드가 endpoint 하나씩 완성하는 순서대로 점진적으로 실 API로 전환.

### 인프라
- `frontend/src/components/shared/EndpointPending.tsx`
  - 단일 컴포넌트, 3-mode (`preparing` | `empty` | `error`)
  - props: `title`, `description?`, `icon?` (Lucide), `mode?` (기본 `preparing`)
  - 톤: `preparing`=파랑/Clock, `empty`=회색/Clock, `error`=빨강/AlertCircle
  - aria-live, role, Framer Motion 부드러운 등장
- `frontend/src/lib/apiErrorHelper.ts`
  - `ApiError` class (status + message)
  - `isApiPendingStatus(status)` — 404 또는 5xx
  - `getEndpointPendingMode(error)` — error 객체에서 mode 자동 분류
  - `throwIfNotOk(response, label)` — 응답이 not ok 시 ApiError throw, mockApi 200 응답은 무영향

### 사용 패턴 (페이지/컴포넌트에서)
```ts
const { data, isPending, error } = useQuery<T>({
    queryKey: ...,
    queryFn: async () => {
        const response = await throwIfNotOk(await apiFetch(path), path);
        return response.json();
    },
});

if (isPending) return <LoadingSpinner />;
if (error) return (
    <EndpointPending
        title="..."
        description="..."
        icon={...}
        mode={getEndpointPendingMode(error)}
    />
);
```

### Per-Endpoint Mock Override
- `frontend/src/lib/mockApi.ts` 의 `ENDPOINTS_DISABLED_IN_MOCK: Set<string>` 상수로 제어 (env 토큰 아님).
- 백엔드 endpoint 활성화 순서대로 set 에 path 추가 → 해당 path만 mock 건너뛰고 실 API fall-through.
- 정확한 path 매칭 (query string 제외, sub-path 자동 포함 X).
- `isMockApiEnabledForEndpoint(path)` 함수가 apiFetch 분기 결정.

예) 알림 API 완성 시:
```ts
const ENDPOINTS_DISABLED_IN_MOCK = new Set<string>([
    '/notifications/',
    '/notifications/settings',
]);
```
이 변경 후 FE 재빌드/재배포만 하면 알림 path만 실 API로 전환됨. 다른 mock-only endpoint는 그대로 mock 응답.

### 폴백 적용 위치 (2026-06-08 기준)
- DashboardPage (대시보드 홈) — `/dashboard/home`
- AnalysisTab — `/dashboard/machine-detail/analysis`
- SmartLogTab — `/dashboard/machine-detail/smart-log`
- MaintenanceTab — `/dashboard/machine-detail/maintenance`
- NotificationModal — `/notifications/`
- Header 알림 뱃지 — `/notifications/` (silent, 뱃지 숨김)
- SettingsPage — `/notifications/settings` (silent, 토글 off 유지)
- ReportPage — `/reports/latest/{id}` (기존 null 폴백), `/reports/` (silent 빈 trend)

## 관련 문서
- 개선 백로그 8건: `docs/ref/external-api-audit.md`
- FE 전환 플랜: `/Users/family/.claude/plans/glimmering-seeking-harbor.md`
- 구 mock URL 시절 메모: `docs/archive/2026-06-08/cloud-run-mock-spec.md`
