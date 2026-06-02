# Open Issues

Last Updated: 2026-06-02

## High Priority

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

### Railway/Vercel 환경변수 전환
- **이슈**: 새 Supabase 프로젝트(`zlcnanvidrjgpuugbcou`)로 로컬 .env는 전환 완료, Railway/Vercel 환경변수는 수동 변경 필요
- **영향**: 프로덕션에서 여전히 구 프로젝트를 바라보고 있음
- **다음 액션**: Railway → `SUPABASE_URL` + `SUPABASE_KEY`, Vercel → `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` 변경 후 재배포
- **소유자**: Dev

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

### Backend API 안정성
- **이슈**: Railway 배포 환경에서의 API 응답 안정성 확인 필요
- **영향**: Frontend-Backend 통신 지연 또는 에러 가능
- **다음 액션**: API 엔드포인트별 응답 테스트
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
