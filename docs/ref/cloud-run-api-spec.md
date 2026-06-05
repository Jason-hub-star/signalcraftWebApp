# Cloud Run API Spec (활성 백엔드)

Last Updated: 2026-06-05
Source: `https://signalcraft-api-55721952249.asia-northeast3.run.app/openapi.json`
Title: SignalCraft API (staging) v0.0.1
Region: asia-northeast3 (Seoul)

> 본 문서는 **활성 백엔드**의 엔드포인트 인벤토리입니다. 개선 백로그는 `external-api-audit.md` 참조.
> 본 레포 `backend/` (구 Railway)는 DEPRECATED — 호출 금지.

---

## 인증

모든 비즈 엔드포인트는 3종 헤더 필수 (`/health` 제외).

| Header | 값 | 비고 |
|---|---|---|
| `X-Auth-Id` | 사용자 식별자 | `VITE_X_AUTH_ID` |
| `X-Auth-Provider` | 인증 제공자 | `VITE_X_AUTH_PROVIDER` |
| `X-Customer-ID` | 고객사 UUID | `VITE_X_CUSTOMER_ID` |

### 스테이징 자격
```
X-Auth-Id: poc_raven_0001
X-Auth-Provider: demo_provider
X-Customer-ID: 12345678-1234-1234-1234-123456789012
```

---

## 엔드포인트

### GET /health [meta]
- 응답: empty `{}`
- 헤더 불필요

### GET /me [user]
- 응답: `MeResponse`
  - `user`: UserInfo (id, email, name, phone, role, is_active)
  - `customer`: CustomerInfo (id, name, is_active)
  - `places[]`: PlaceInfo (id, name, sub_name?, address?, is_active)
  - `technicians[]`: TechnicianInfo (id, name, phone, address, is_primary, is_active)
- 에러: 400 (헤더 불일치), 422 (검증)

### GET /machines [machine]
- 응답: `MachinesResponse`
  - `machines[]`: MachineStatus
    - `machine_id` (UUID), `machine_code`, `label?`
    - `operational_state`: `running` \| `stopped` \| `error` \| `unknown`
    - `current_state`: `unknown` \| `normal` \| `warning` \| `abnormal` \| `critical` \| `offline`
    - `operational_score?`, `remaining_score?`
    - `active_alerts_count` (기본 0)
    - `sensor_online` (bool)
    - `updated_at` (ISO timestamp)

### GET /machines/{machine_id} [machine]
- Path: `machine_id` (UUID)
- Query: `period` ∈ {`24h`, `3d`, `5d`, `7d`} — **필수**
- 응답: `MachineDetailResponse`
  - `machine_id`
  - `machine_status_history[]`: MachineStatusHistoryPoint
    - `id`, `operational_state`, `operational_score?`, `current_state`, `recorded_at`

---

## FE 매핑

| Cloud Run | FE 사용처 | 어댑터 |
|---|---|---|
| `GET /me` | `DashboardPage.userProfile`, `ProfileCard` | `MeResponse` → `UserProfile` (name/email/role만 우선) |
| `GET /machines` | `MachinePage` | `MachinesResponse.machines[]` → 내부 `Machine` shape (6→3 state via `machineStateAdapter.toLegacyMachineStatus`) |
| `GET /machines/{id}` | (신규) 머신 상세 차트 | `MachineDetailResponse.machine_status_history[]` |
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

## 관련 문서
- 개선 백로그 8건: `docs/ref/external-api-audit.md`
- FE 전환 플랜: `/Users/family/.claude/plans/glimmering-seeking-harbor.md`
