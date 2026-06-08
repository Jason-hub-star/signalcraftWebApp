# Open Issues

Last Updated: 2026-06-08

## High Priority

### QUERY_KEYS.userProfile → `['me']` 시맨틱 리네임 (후속)
- **이슈**: Cloud Run `/me` 호출로 전환 후에도 쿼리 키가 `['user', 'profile']`로 남아 시맨틱 불일치
- **영향**: 신규 작업자 혼동 가능. 캐시 정합성 자체는 OK (DashboardPage·ProfileCard 동일 키 사용)
- **다음 액션**: `QUERY_KEYS.userProfile = ['me']`로 변경 + 2개 호출처 동시 갱신
- **소유자**: Dev (후속 PR로 이관, 2026-06-05 자기리뷰 합의)

### 외부 Cloud Run API 아쉬운 점 (External API Audit)
- **이슈**: `signalcraft-api-*.asia-northeast3.run.app` 사양 감사 결과 8개 개선 항목 식별 — 상세는 `docs/ref/external-api-audit.md` 참조
- **요약**:
  - A1. 헤더 인증(`X-Auth-Id`) 임시방편 → JWT 전환 필요 (critical)
  - A2. `/machines` 페이지네이션 부재 (high)
  - A3. `period` enum 4개 고정 → from/to 쿼리로 일반화 (medium)
  - A4. 필터/정렬 미지원 (medium)
  - A5. API 버전 prefix(`/v1/`) 부재 (high)
  - A6. 알림 상세 엔드포인트 부재 (medium)
  - A7. 태그 영문/한글 혼용 (low)
  - A8. 응답 메타데이터(server_time, request_id) 부재 (low)
- **영향**: FE 통합 시 어댑터 레이어 + 헤더 주입 + enum 매핑 필요. 프로덕션 진입 전 A1/A2/A5 백엔드 보강 필수.
- **다음 액션**: FE 통합은 어댑터 패턴으로 흡수하면서 백엔드 측에 A1/A2/A5 보강 요청
- **소유자**: Dev (FE 통합) + 외부 API 팀 (BE 보강)

### 백엔드 `equipmentSummary.state` 매핑 의미 혼동
- **이슈**: `backend/app/features/dashboard/router.py`의 `RUNTIME_TO_SUMMARY_STATE`가 건강도(GOOD/WARNING/DANGER) 기반으로 작동 상태(RUNNING/OFF)를 추정 — WARNING device는 OFF로 잘못 변환됨
- **영향**: 실 백엔드 연결 시 `equipmentSummary` 응답이 mock과 달라짐. 예: vacuum-oven-01(건강도 warning + 실제 RUNNING) → 백엔드는 OFF로 응답
- **근본 원인**: Supabase `devices` 테이블에 작동 상태(RUNNING/OFF) 필드 없음. 작동 상태는 `machine_event_logs`에서 와야 정확
- **다음 액션**: (1) `devices.operational_status` 컬럼 추가하거나 (2) `machine_event_logs` 최신 이벤트 기반 집계로 변경. mockScenario와 매핑 일치 필요
- **소유자**: Dev (백엔드 시드/스키마 검토와 함께)

### 백엔드 `devices` 시드 새 머신 라인업 갱신 미확인
- **이슈**: 프론트는 새 5대(chiller-01/compressor-01/vacuum-pump-01/vacuum-oven-01/ahu-01)로 갱신됐지만 Supabase DB 시드는 미확인
- **영향**: 실 백엔드 응답이 mock과 다른 한국어 기기명/ID를 반환할 가능성
- **다음 액션**: Supabase `devices` 테이블 직접 조회 → 새 라인업으로 시드 마이그레이션
- **소유자**: Dev

### FE Cloud Run 환경변수 + 새 API 도메인 활성화 확인
- **이슈**: Vercel 호스팅 웹앱을 Cloud Run으로 이전하면서 런타임 환경변수 등록 필요
- **영향**: Cloud Run runtime env 미설정 시 FE가 외부 API 호출 실패
- **다음 액션**: Cloud Run service environment variables에 6종 등록
  - `VITE_API_URL=https://v1.api.stag.serving.signalcraft.kr`
  - `VITE_USE_MOCK_API=false` (실호출 전환 시)
  - `VITE_X_AUTH_ID=poc_raven_0001` (스테이징)
  - `VITE_X_AUTH_PROVIDER=demo_provider` (스테이징)
  - `VITE_X_CUSTOMER_ID=12d5e33c-405a-4856-bf8e-51fc899c1737` (스테이징)
  - `VITE_PLACE_ID=b33f995b-0e79-4551-afc4-e0c79238a18a` (default path param)
- **소유자**: Dev
- **상태**: 2026-06-08 staging API 활성 확인. OpenAPI 스펙 검증 완료. Cloud Run 환경변수 등록만 남음.

### RLS 정책 추가 필요
- **이슈**: `incidents`, `machine_event_logs`, `forecasts` 테이블에 SELECT RLS 정책 미설정 → anon key로 데이터 읽기 불가
- **영향**: Frontend에서 해당 테이블 데이터 조회 실패 가능
- **다음 액션**: Supabase SQL Editor에서 각 테이블에 `FOR SELECT TO public USING (true)` 정책 추가
- **소유자**: Dev

### Production Verification 필요
- **이슈**: 최근 배포된 기능 검증 미완료 (알림시스템, 날짜수정, 유지보수 이력)
- **영향**: 프로덕션 환경에서 기능 정상 작동 확인 필요
- **다음 액션**: Vercel 사이트 접속 → 알림 설정/유지보수 이력 테스트
- **소유자**: Dev

## Medium Priority

### 공유기능 안정화
- **이슈**: 리포트 공유 (PDF, 이미지, 링크) 프로덕션 테스트 미완료
- **다음 액션**: 다양한 기기/브라우저에서 공유 기능 테스트

### 알림 푸시 발송
- **이슈**: FCM 푸시 알림 실제 발송 테스트 미완료
- **다음 액션**: FCM 토큰 등록 → 실제 푸시 발송 테스트

## Low Priority

### Frontend E2E 자동화
- **이슈**: Playwright/Cypress 자동화 미완료
- **다음 액션**: 핵심 시나리오 Playwright 자동화

### 다크 모드 지원
- **이슈**: Phase 5 (Advanced UX) 다크 모드 미구현
- **다음 액션**: 테마 시스템 설계 및 구현

## Backlog

### 카카오톡 알림 연동
- 사업자 등록 전이라 실 발송 불가 (준비중 배지)

### QR 기기 등록
- ESP32 연동 시 QR 스캔 기반 등록 플로우 (하드웨어 준비 후)
