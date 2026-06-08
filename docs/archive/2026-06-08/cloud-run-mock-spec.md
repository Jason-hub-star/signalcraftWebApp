# [Archived] Cloud Run Mock API Spec

> **Archived on 2026-06-08** — `https://v1.api.stag.serving.signalcraft.kr` staging serving API가 활성화되면서, 본 mock URL은 더 이상 활성 백엔드가 아닙니다.
> 활성 스펙은 `docs/ref/cloud-run-api-spec.md` 를 참조.

## 보존 사유
- 구 mock URL 시절 발견된 인벤토리·인증·필드 규약은 활성 staging API 설계의 직접적 기반입니다.
- 회귀 디버깅 시 "옛 mock과 새 staging의 응답 차이"를 확인할 일이 있을 수 있어 단순 보존.

## 구 Base URL (비활성)
- `https://signalcraft-api-55721952249.asia-northeast3.run.app` (Cloud Run mock, 2026-06-05 검증)
- 사용한 OpenAPI 소스: `{baseUrl}/openapi.json`
- region: `asia-northeast3` (Seoul)

## 구 스테이징 자격 (비활성)
```
X-Auth-Id: poc_raven_0001
X-Auth-Provider: demo_provider
X-Customer-ID: 12345678-1234-1234-1234-123456789012
```

> 신 staging customer UUID는 `12d5e33c-405a-4856-bf8e-51fc899c1737` 로 변경됨 (활성 스펙 참조).

## 인벤토리 (당시 4개)
| Method | Path | 응답 스키마 |
|---|---|---|
| GET | `/health` | empty |
| GET | `/me` | `MeResponse` |
| GET | `/machines` | `MachinesResponse` |
| GET | `/machines/{machine_id}` | `MachineDetailResponse` (2필드 — 신 staging은 12필드) |

> 신 staging에서 추가된 엔드포인트: `GET /places/{place_id}/machines`.

## 당시 검증
- 2026-06-05 `GET /health` → `{"status":"ok","env":"staging"}` 200 OK
- FE 어댑터: `frontend/src/lib/contracts/cloudRunApi.ts` 초안이 본 mock 스펙 기준으로 작성됨 (이후 신 staging 사실로 12필드 확장).

## 관련 활성 문서
- `docs/ref/cloud-run-api-spec.md` (현재 활성)
- `docs/ref/external-api-audit.md` (개선 백로그)
- `docs/daily/2026-06-05/session-log.md` (당시 검증 로그)
