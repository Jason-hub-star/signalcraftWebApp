# Open Issues

Last Updated: 2026-02-15

## High Priority

### Production Verification 필요
- **이슈**: 최근 배포된 기능 검증 미완료 (알림시스템, 날짜수정, 유지보수 이력)
- **영향**: 프로덕션 환경에서 기능 정상 작동 확인 필요
- **다음 액션**:
  1. Vercel 배포 사이트 접속
  2. 알림 설정 변경 및 저장 테스트
  3. 유지보수 이력 등록/조회 테스트
  4. 날짜 관련 기능 정상 확인
- **소유자**: Dev

### Backend API 안정성
- **이슈**: Fly.io 배포 환경에서의 API 응답 안정성 확인 필요 (Render→Fly.io 마이그레이션 완료)
- **영향**: Frontend-Backend 통신 지연 또는 에러 가능
- **다음 액션**: API 엔드포인트별 응답 테스트
- **소유자**: Dev

## Medium Priority

### 공유기능 안정화
- **이슈**: 리포트 공유 (PDF, 이미지, 링크) 기능 프로덕션 테스트 미완료
- **상태**: 코드 구현 완료 (Commit: `6297cb6`)
- **다음 액션**: 다양한 기기/브라우저에서 공유 기능 테스트
- **소유자**: Dev

### 알림 푸시 발송
- **이슈**: FCM 푸시 알림 실제 발송 테스트 미완료
- **상태**: 알림 설정 UI + API 연동 완료
- **다음 액션**: FCM 토큰 등록 → 실제 푸시 발송 테스트
- **소유자**: Dev

## Low Priority

### Frontend E2E 자동화
- **이슈**: Playwright/Cypress 자동화 미완료
- **상태**: 수동 테스트로 검증 중
- **다음 액션**: 핵심 시나리오 Playwright 자동화
- **소유자**: Dev

### 다크 모드 지원
- **이슈**: Phase 5 (Advanced UX) 다크 모드 미구현
- **상태**: PRD에 명시된 마일스톤
- **다음 액션**: 테마 시스템 설계 및 구현
- **소유자**: Dev

## Backlog (낮은 우선순위)

### 카카오톡 알림 연동
- 사업자 등록 전이라 실 발송 불가
- 준비중 배지로 UI만 표시

### QR 기기 등록
- ESP32 연동 시 QR 스캔 기반 등록 플로우 구현 필요
- 하드웨어 준비 후 진행

---

## Completed (Recent)

### 2026-02-15
- 알림시스템 연동
- 날짜 설정오류 수정
- 오류수정
- 유지보수 이력관리
- 대시보드 카드 조절

### 2026-02-14 이전
- Phase 21: Notification System & Preferences
- Phase 20: Maintenance Record & History
- Phase 18: Cloud Deployment (Backend)
- Phase 17: Advanced Sharing & Reporting
- Phase 14: Dashboard & Infrastructure
- Phase 12: Database V2 & Migration
