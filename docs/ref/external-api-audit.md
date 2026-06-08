# External API Audit — SignalCraft Serving API (staging v0.0.1)

Last Updated: 2026-06-08
Source: `https://v1.api.stag.serving.signalcraft.kr/openapi.json`
Scope: 외부 FastAPI 서비스. ON/OFF (L1) 검증 + 대시보드 연동용.

> 본 문서는 **외부 staging serving API** 사양 감사 결과이며, 본 레포 `backend/` (구 Railway, DEPRECATED)와는 별개의 서비스입니다.
> 구 mock URL (`signalcraft-api-55721952249.asia-northeast3.run.app`) 시절 감사 메모는 `docs/archive/2026-06-08/cloud-run-mock-spec.md` 참조.

## 0. Base URL 메모
- **활성 staging API**: `https://v1.api.stag.serving.signalcraft.kr` (2026-06-08 OpenAPI 확인)
- Swagger UI: `https://v1.api.stag.serving.signalcraft.kr/docs`

---

## 1. 엔드포인트 인벤토리

| Method | Path | Tag | 응답 스키마 | 비고 |
|---|---|---|---|---|
| GET | `/health` | meta | (empty) | 인증 헤더 불필요 |
| GET | `/me` | 고객사 | `MeResponse` | 컨텍스트 부트스트랩 |
| GET | `/machines` | 머신 | `MachinesResponse` | 현재 상태 스냅샷 |
| GET | `/machines/{machine_id}` | 머신 | `MachineDetailResponse` | 시계열 + `period` 쿼리 필수 |
| GET | `/places/{place_id}/machines` | 머신 | `PlaceMachinesResponse` | 현장별 머신 목록 |

### 공통 인증 헤더 (`/health` 제외 전부 필수)
- `X-Auth-Id: string`
- `X-Auth-Provider: string`
- `X-Customer-ID: string` (UUID)

> ⚠️ `place_id`는 **헤더가 아니라 path parameter**입니다. 가이드 마크다운(`API_GUIDE.md`)의 인증 표에 헤더처럼 적혀있던 row는 path param이 잘못 노출된 것 — OpenAPI 스펙(`/openapi.json`)으로 사실 확정 (2026-06-08).

### 스테이징 테스트 자격
- `X-Auth-Id=poc_raven_0001`
- `X-Auth-Provider=demo_provider`
- `X-Customer-ID=12d5e33c-405a-4856-bf8e-51fc899c1737`
- Default place_id (path param fallback): `b33f995b-0e79-4551-afc4-e0c79238a18a`

---

## 2. 핵심 도메인 모델

### 이중 상태 분리 (잘 설계된 부분)
| 필드 | enum | 의미 |
|---|---|---|
| `operational_state` | `OperationalState`: `running` \| `stopped` \| `error` \| `unknown` | "기계가 돌고 있는가" (운전) |
| `current_state` | `MachineState`: `unknown` \| `normal` \| `warning` \| `abnormal` \| `critical` \| `offline` | "기계가 건강한가" (건강도) |

→ "running + critical" 같이 운전 중 위험을 표현 가능. 내부 `MACHINE_STATUS = ['running','warning','error']` 3단계보다 표현력 넓음.

### Period enum (검토 필요)
- `PeriodEnum`: `24h` \| `3d` \| `5d` \| `7d` 고정

---

## 3. 아키텍처 아쉬운 점 (개선 권장)

### A1. 헤더 인증은 임시방편 ⚠️ critical
- **현상**: `X-Auth-Id`를 그대로 신뢰. 서명/만료/스코프 없음.
- **위험**: 헤더 위조 시 타 고객사 데이터 접근 가능. PoC 외에는 사용 불가.
- **권장**: JWT(Bearer) 또는 Supabase Auth 토큰 검증으로 전환. `X-Customer-ID`도 토큰 클레임에서 유도.

### A2. `/machines` 페이지네이션 부재 ⚠️ high
- **현상**: 응답이 `{ machines: [] }` 단일 배열. limit/offset/cursor 없음.
- **위험**: 고객 1곳에 기계 수백 대 들어오면 응답 폭발 + 모바일 렌더 부하.
- **권장**: `?limit=&cursor=` 추가, 응답에 `next_cursor` 포함.

### A3. `period` enum 4개 고정 ⚠️ medium
- **현상**: 24h/3d/5d/7d만 가능. 1h, 30d 등 비즈 요청 들어오면 enum 추가 필요.
- **권장**: `?from=&to=` ISO timestamp로 일반화하고 enum은 FE 프리셋으로 유지.

### A4. 필터/정렬 미지원 ⚠️ medium
- **현상**: `/machines?state=critical&sort=-updated_at` 불가.
- **권장**: 위험 머신만 보기 UI 만들면 즉시 필요. 쿼리 파라미터 추가.

### A5. API 버전 prefix 부재 ⚠️ high
- **현상**: `/machines` (no `/v1/`).
- **위험**: Breaking change 발생 시 모든 클라이언트 동시 깨짐.
- **권장**: `/v1/` prefix 신설 후 점진 마이그레이션.

### A6. 알림 상세 엔드포인트 부재 ⚠️ medium
- **현상**: `active_alerts_count`만 존재. 실제 알람 리스트 조회 API 없음.
- **권장**: `GET /machines/{id}/alerts`, `GET /alerts?state=open` 신설.

### A7. 태그 명명 일관성 ⚠️ low
- **현상**: `meta`, `machine` (영문) + `사용자 관련` (한글) 혼용.
- **권장**: 영문 통일 (`user`, `machine`, `meta`).

### A8. 응답 메타데이터 부재 ⚠️ low
- **현상**: 응답에 `server_time`, `data_freshness`, `request_id` 없음.
- **권장**: 디버깅/타임스큐 보정용 메타 헤더 또는 envelope 도입.

---

## 4. FE 통합 영향도

| 영역 | 현재 상태 | 외부 API 도입 시 |
|---|---|---|
| `frontend/src/lib/api.ts` | `VITE_API_URL` 단일 base | 외부 API용 별도 base + 헤더 주입 필요 |
| `frontend/src/lib/contracts/machineStatus.ts` | 3단계 enum (`running/warning/error`) | 외부 6단계 + 4단계 enum 매핑 필요 |
| `frontend/src/lib/queryKeys.ts` | `machines: ['machines']` 키 존재 | 외부 API용 키는 별도 네임스페이스 권장 |
| 대시보드 mock | `mockScenario` 풍부 | 외부 응답 → mock contract 매핑 어댑터 필요 |

---

## 5. 점수 요약
**PoC/스테이징 기준 B+**. 개념 분리(운전/건강)와 응답 래퍼는 훌륭하나, 프로덕션 진입 전 **인증·페이지네이션·버전 prefix** 3종 보강 필수.

> 2026-06-08 갱신: `/places/{place_id}/machines` 엔드포인트 활성 확인 (A4 필터/정렬 미지원 일부 완화). 그 외 백로그는 그대로 유효.
