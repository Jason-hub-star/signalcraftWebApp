# Project Status

Last Updated: 2026-03-16

## Current Phase
- **Phase 6: Notifications** — 진행 중

## Feature Status

| 기능 | 상태 | 비고 |
|------|------|------|
| 대시보드 (카드형 UI, 3-State) | 완료 | Phase 3 |
| 일간 리포트 (영수증 형태) | 완료 | Phase 2 |
| 알림 설정 UI + API | 완료 | Phase 6 |
| 유지보수 이력관리 | 완료 | 타임라인 UI |
| FCM 푸시 알림 | 미완료 | 실제 발송 테스트 필요 |
| 카카오톡 알림 | 대기 | 사업자 등록 전 |
| 리포트 공유 (PDF/이미지) | 코드 완료 | 프로덕션 테스트 필요 |
| 다크 모드 | 미구현 | PRD 명시 |
| QR 기기 등록 | 대기 | 하드웨어 준비 후 |
| Frontend E2E 자동화 | 미완료 | Playwright 예정 |

## Deployment
- Frontend: Vercel (signalcraft-web-app.vercel.app)
- Backend: Railway (signalcraft-api)
- Database: Supabase (PostgreSQL)

## Recent Changes (2026-02-15)
1. 알림시스템 연동 — Commit: `6018141`
2. 날짜 설정오류 수정 — Commit: `e2bedbe`
3. 일반 버그 수정 — Commit: `0ef6b3b`
4. 유지보수 이력관리 — Commit: `22c183f`
5. 대시보드 카드 UI — Commit: `1f7e484`
