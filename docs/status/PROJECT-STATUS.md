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
| 시드 데이터 보강 | 완료 | 30일 리포트, incidents, forecasts 등 |
| FCM 푸시 알림 | 미완료 | 실제 발송 테스트 필요 |
| 카카오톡 알림 | 대기 | 사업자 등록 전 |
| 리포트 공유 (PDF/이미지) | 코드 완료 | 프로덕션 테스트 필요 |
| Impeccable UI 디자인 시스템 | 완료 | OKLCH 컬러, 토큰 기반 스페이싱/라디우스/모션, 전 페이지 적용 |
| 다크 모드 | 미구현 | PRD 명시 |
| QR 기기 등록 | 대기 | 하드웨어 준비 후 |
| Frontend E2E 자동화 | 미완료 | Playwright 예정 |

## Deployment
- Frontend: Vercel (signalcraft-web-app.vercel.app)
- Backend: Railway (signalcraft-api)
- Database: Supabase (PostgreSQL) — **프로젝트: `zlcnanvidrjgpuugbcou` (signalcraft)**

## DB Seed Data Status

| 테이블 | 행 수 | 내용 |
|--------|-------|------|
| `devices` | 7 | 한국어 기기명, GOOD/WARNING/DANGER 상태 |
| `daily_reports` | 210 | 7기기 × 30일, 상태별 health_score 분포 |
| `incidents` | 12 | ANOMALY/OVERLOAD/OFFLINE, DANGER/WARNING 집중 |
| `forecasts` | 7 | 모든 기기 golden_time (DANGER 3일, WARNING 12일, GOOD 45일+) |
| `machine_event_logs` | 870 | 최근 3일 ON/OFF/DEF/DOOR 이벤트 |
| `notifications` | 6 | alert/report/maintenance 알림 |
| `maintenance_logs` | 12 | CLEANING/CHECK/PART_REPLACE 이력 |
| `notification_settings` | 1 | 데모 사용자 설정 |

## Recent Changes (2026-03-16)
1. **Impeccable UI 디자인 시스템 적용** — 전 페이지/모달 대상 (36개 컴포넌트)
   - OKLCH 컬러 시스템, Plus Jakarta Sans + Pretendard 폰트 페어링
   - 토큰 기반 스페이싱(`--space-*`), 라디우스(`--radius-sm/md/lg`), 모션(`--ease-out-quart`)
   - 무한 애니메이션 전면 제거 (블롭, ping, bounce, glow)
   - `prefers-reduced-motion` 미디어 쿼리 추가
   - glass-card → 솔리드 카드 서피스, `font-black` 남용 제거
   - 전 인터랙티브 요소 `focus-visible:ring-2` + `aria-label` 접근성 강화
   - Commit: `a2337da`, `737d2cf`
2. Supabase 프로젝트 전환 (`zigwndnmxmxctcayeavx` → `zlcnanvidrjgpuugbcou`) — Commit: `f4bafd5`
3. 시드 데이터 보강 (daily_reports 210행, incidents 12행, forecasts 7행 등) — Commit: `f4bafd5`
4. 문서 시스템 재구조화 — Commit: `74ca340`
5. Railway 디버그 엔드포인트 추가 — Commit: `f43a151`

## Previous Changes (2026-02-15)
1. 알림시스템 연동 — Commit: `6018141`
2. 날짜 설정오류 수정 — Commit: `e2bedbe`
3. 일반 버그 수정 — Commit: `0ef6b3b`
4. 유지보수 이력관리 — Commit: `22c183f`
5. 대시보드 카드 UI — Commit: `1f7e484`
