# Project Status

Last Updated: 2026-06-02

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
| 개발 목업 API 모드 | 완료 | FE 개발 모드에서 Raven Materials 위험/주의/정상 목업 데이터 표시 |
| 고객별 테마/대시보드 설정 | 진행 중 | semantic CSS variables + Raven theme/config foundation |
| 홈 화면 OCR HOME-001 재배치 | 진행 중 | PR1 완료(인사말/상태 카드/설비 Gantt/정비사 전화), PR2(legacy 제거) 대기 |

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

## Recent Changes (2026-06-02)
1. **홈 화면 OCR HOME-001 재배치 (PR1)**
   - 데이터 계약 신설: `frontend/src/lib/contracts/dashboardHome.ts`에 `EquipmentRunState`, `HomeStatusKind`, `HomePeriod`, `StatusOverviewCard`, `GanttSegment`, `DashboardHome` 타입 중앙화
   - `mockScenario.dashboardHome` 추가: 설비/엣지센서/서버 3개 statusOverview 카드, 5개 설비 24시간 Gantt segments, periodOptions 4종, runtime summary
   - `QUERY_KEYS.dashboardHome`, `QUERY_KEYS.equipmentUsage(period, machineId?)` 추가
   - mock API 라우트 추가: `GET /dashboard/home`, `GET /dashboard/equipment-usage`
   - 신규 7개 컴포넌트: `features/dashboard/home/{HomeGreeting, StatusOverviewSection, StatusInfoCard, HelpOverlay, EquipmentUsageSection, EquipmentGanttChart, MaintenanceCallButton}.tsx`
   - `DashboardPage.tsx`를 OCR 순서(인사말 → 상태 정보 → 설비 정보 → 정비사 전화)로 재배치
   - 직접 SVG Gantt(RUNNING/OFF/ERROR/NO_DATA 4상태), `window.matchMedia` 기반 모바일/데스크탑 정비사 전화 분기
   - PR2(기존 `StatusHero/QuickActions/MachineList` 제거) 대기 — `DashboardPage`는 이미 import 끊김
   - 검증: `cd frontend && npm run build` pass, `tsc --noEmit` 0 errors, `git diff --check` clean

2. **API Contract Guard — Machine.status 중앙화 (PR0)**
   - 신규 `frontend/src/lib/contracts/machineStatus.ts`로 `MachineStatus` 타입과 `DEVICE_STATUS_TO_MACHINE_STATUS` 매핑 중앙화
   - `MachineCard` 인라인 union 제거 및 중앙 타입 import
   - 백엔드 `machines/router.py`: `status_map["DANGER"] = "error"`(이전 `"danger"` — 프론트 contract 불일치 수정), `imageUrl = ""`(이전 외부 `placehold.co` URL 제거)
   - 검증: frontend build + `python3 -m compileall app` pass

## Recent Changes (2026-06-01)
1. **고객별 테마/대시보드 설정 기반 추가**
   - `index.css`에 semantic theme variables 및 `data-theme="raven"` override 추가
   - 기존 `signal-*` Tailwind 색상은 semantic variables alias로 유지
   - `theme.ts`에서 허용된 고객 테마만 적용하고 unknown theme은 `signalcraft`로 fallback
   - Raven mock company config에 `themeId`, `dashboardPreset`, `enabledMetrics`, dashboard labels 추가
   - `/dashboard`의 상태 요약 및 설비 목록이 `enabledMetrics` 설정을 따라 렌더되도록 연결
   - OCR 기반 `MAIN-001`, `MAIN-002`, `HOME-001` 요구사항과 코드 영향 분석을 `docs/ref/app-entry-home-ocr-analysis.md`에 문서화
   - 검증: `cd frontend && npm run build` pass; Playwright `/dashboard`, `/report`, `/settings` smoke pass

## Recent Changes (2026-05-27)
1. **Frontend 개발 목업 API 전환 + 토큰 공유화 보강**
   - `apiFetch` 단일 게이트웨이 추가, 백엔드 교체 기간 동안 기본 목업 API 사용
   - 새 백엔드 연결 시 `VITE_USE_MOCK_API=false`로 목업 API 비활성화 가능
   - 설비 상태 목업: DANGER 1건, WARNING 1건, GOOD 1건
   - `QUERY_KEYS` 팩토리 추가 및 기존 query key/invalidation 분산 제거
   - `styles/tokens.ts` 추가, 차트/카카오/헤더/내보내기 색상 직접값과 핵심 UI class token을 공유 토큰으로 이동
   - 상태/브랜드/차트 중심으로 설비 상태, HACCP, 이벤트, 정비 액션, 알림, 하단 네비, 프로필 메뉴 semantic class token 적용
   - 제공 로고를 헤더 좌측 브랜드 마크와 favicon/apple-touch icon에 적용
   - 제공 SVG 아이콘 1차 적용: 하단 네비, Quick Actions 리포트/설정, 설정 고객센터
   - Raven Materials 고객사 맞춤 목업 SSOT `frontend/src/lib/mockScenario.ts` 추가
   - 설비 목업: Black TiO2 합성 반응조, 산소결함 열처리로, RCB 코팅 라인, VOC 성능 챔버, 공조 필터 테스트 리그
   - Recharts 초기 음수 크기 경고 제거를 위한 `useElementSize` 추가
   - 검증: `npm run build`, Playwright `/dashboard`, `/machines`, `/report` smoke

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
