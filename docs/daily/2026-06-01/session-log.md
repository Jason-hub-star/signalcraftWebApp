# 2026-06-01 Session Log

## Theme Config Foundation
- Added semantic CSS theme variables for background, foreground, card, primary, secondary, warning, danger, border, muted, ring, and chart colors.
- Added customer theme override support with `data-theme="raven"` while preserving existing `signal-*` Tailwind aliases.
- Added `frontend/src/lib/theme.ts` to resolve and apply allowed customer theme ids with fallback to `signalcraft`.
- Extended Raven mock company config with `themeId`, `dashboardPreset`, `enabledMetrics`, and dashboard labels.
- Connected dashboard status and machine-list sections to `enabledMetrics` so future customer configs can hide sections without route-specific UI forks.

## OCR / Home Refactor Analysis
- Added `docs/ref/app-entry-home-ocr-analysis.md`.
- Documented OCR transcription for `MAIN-001`, `MAIN-002`, and `HOME-001`.
- Mapped OCR requirements to current frontend/backend files and classified reuse, modification, and new-build candidates.
- Noted direct implementation risks: backend `DANGER -> danger` status mismatch, external `placehold.co` URL, and `SmartLogTab` random summary values.

## Validation
- Pass: `cd frontend && npm run build`.
- Pass: Playwright smoke on `/dashboard`, `/report`, `/settings` at `390x844`; `data-theme="raven"` applied and `--primary` resolved to `#2563eb`.

## Socratic Review — HOME-001 재배치 결정

1. **목적**: OCR HOME-001 요구사항(인사말 / 설비·센서·서버 상태 카드 / 기간 선택 + 설비 Gantt / 최근 업데이트 시간 / 정비사 전화)에 맞춰 `DashboardPage`를 재배치한다. 현재 `StatusHero + QuickActions + MachineList` 중심 구조는 OCR과 다르다.
2. **가장 위험한 부분**:
   - 백엔드 `/machines/`의 `DANGER -> danger` 매핑이 프론트 `Machine.status` 기대값(`'error'`)과 불일치. 실제 API 전환 시 status 회귀 가능.
   - `EquipmentGanttChart` 모바일 pinch 제스처가 OCR 요구로 명시되어 있어 구현 비용이 큼.
   - `mockScenario.dashboardHome` 필드 이름이 추후 백엔드 contract와 연결되므로 변경 비용 큼.
3. **대안**:
   - A. `DashboardPage` 완전 재작성 + 기존 컴포넌트 제거 — 사용처 grep 결과 `StatusHero/MachineList/QuickActions`는 모두 `DashboardPage`에서만 import. 안전.
   - B. `dashboardPreset` 분기로 conditional rendering — 분기 비용이 본 작업 가치보다 큼.
   - C. 새 `/home` 라우트 추가 + `/dashboard` 유지 — OCR이 "진입 후 첫 페이지"라고 명시 → 현 `/dashboard`를 교체하는 것이 자연.
   - 결론: A 선택. 단 1차 PR은 신규 컴포넌트 추가 + `DashboardPage` import 교체만, 기존 파일은 별도 PR에서 제거.
4. **되돌리기 어려운 결정**:
   - `DashboardHome` 타입의 필드 이름/형태(특히 `statusOverview.id`, `EquipmentRunState` enum) — mock/types에 박힌 뒤 backend와 일치시키므로 변경 비용 큼. 첫 mock에서 OCR 5개 요구사항을 1:1 매핑해 결정.
   - 백엔드 `DANGER -> error` 매핑 변경 — `Machine.status`를 expect하는 모든 호출자가 영향. 변경 전 `grep "status.*danger\|'error'"` 필수.
   - QUERY_KEYS 추가 / 컴포넌트 추가는 되돌리기 쉬움.
5. **검증 기준**:
   - `cd frontend && npm run build` 통과.
   - Playwright smoke: `/dashboard`에서 OCR 5개 영역(`HomeGreeting`, `StatusOverviewSection`, `EquipmentUsageSection`, lastUpdatedAt 텍스트, `MaintenanceCallButton`) DOM 존재.
   - `data-theme="raven"` 환경에서 statusOverview 카드의 색상이 token 기반.
   - mock 모드에서 `GET /dashboard/home` 응답이 `DashboardHome` 타입과 매칭.
   - 백엔드 `/machines/` 응답에서 `status: 'error'`로 매핑되고 `'danger'`를 expect하는 호출자 0개 확인.

**Decision**: 대안 A 채택, PR을 두 개로 분리.

## API Contract Guard — Machine.status 중앙화

### Contract sources (확인 근거)
| 출처 | 값 |
|---|---|
| DB `devices.status` (`docs/ref/schema.md:74`) | `'GOOD' \| 'WARNING' \| 'DANGER'` |
| Backend `/machines/` 응답 (수정 전) | `'running' \| 'warning' \| 'danger'` ← 잘못 |
| Frontend `Machine.status` 타입 (`MachineCard.tsx:13`) | `'running' \| 'warning' \| 'error'` |

### Callers expecting `'error'`
- `MachinePage.tsx:38` filter 분기, `MachineDetailModal/AnalysisTab.tsx:140` 상태 라벨, `MaintenanceTab/index.tsx`, `mockApi.ts` 다수.
- 백엔드가 `'danger'`를 내려보내면 위 분기들이 모두 fallthrough → 잘못된 라벨/색상 가능. (현재는 mock API가 정답을 내려주고 있어 운 좋게 통과 중)

### Changes
- 신규: `frontend/src/lib/contracts/machineStatus.ts`
  - `MACHINE_STATUS = ['running', 'warning', 'error']` const tuple
  - `MachineStatus` 타입
  - `DEVICE_STATUS_TO_MACHINE_STATUS` 매핑 (`GOOD→running, WARNING→warning, DANGER→error`)
- 수정: `MachineCard.tsx` — `Machine.status`를 `MachineStatus`로 교체 (계약 중앙 import).
- 수정: `backend/app/features/machines/router.py`
  - `status_map["DANGER"] = "error"` (이전 `"danger"`)
  - `imageUrl = ""` (이전 `placehold.co` 외부 URL — frontend "외부 이미지 URL 금지" 규칙)

### Validation
- Pass: `cd frontend && npm run build` (DashboardPage chunk 9.91 kB, PWA precache 28 entries).
- Pass: `python3 -m compileall app` — `app/features/machines/router.py` 포함 전체 컴파일 클린.
- Pass: `git diff --check` — whitespace 오류 없음.

### Notes
- 백엔드 Pydantic v2 응답 모델은 아직 도입 전. 계약을 더 강하게 묶으려면 추후 `MachineResponse` 모델을 만들어 `status: Literal['running','warning','error']`로 강제하는 follow-up이 필요.
- `imageUrl` 필드는 frontend가 현재 렌더링에 사용하지 않으므로 빈 문자열로 유지. 차후 `Machine` 타입에서 `imageUrl?` optional로 풀어주는 follow-up 후보.

## OCR HOME-001 재배치 — 구현 (PR1)

플랜 파일: `/Users/family/.claude/plans/cosmic-waddling-elephant.md` (승인 완료)

### Step 1 — 데이터/URL/캐시키
- 신규 `frontend/src/lib/contracts/dashboardHome.ts`: `EquipmentRunState`, `HomeStatusKind`, `HomePeriod`, `StatusOverviewCard`, `GanttSegment`, `EquipmentUsageData`, `DashboardHome` 타입과 enum 상수
- `frontend/src/lib/mockScenario.ts` `dashboardHome` 필드 추가 (`v0.0.1` appVersion, 3 statusOverview 카드, 5대 24h Gantt segments, periodOptions 4종, 누적 시간 summary, 정비사 번호)
- `frontend/src/lib/queryKeys.ts` `dashboardHome`, `equipmentUsage(period, machineId?)` 추가
- `frontend/src/lib/mockApi.ts` `GET /dashboard/home`, `GET /dashboard/equipment-usage` 라우트 (`machine_id` 필터 적용)

### Step 2 — 7개 home 컴포넌트
- `features/dashboard/home/HomeGreeting.tsx`: 인사말 + `formatRelativeTime` 인라인 유틸 (`방금 전`, `N분 전`, `N시간 전`, `N일 전`)
- `StatusInfoCard.tsx`: Wrench/Radio/Server Lucide 아이콘 + healthyCount/totalCount + state dot/text 토큰
- `StatusOverviewSection.tsx`: 섹션 헤더(`HelpCircle` 버튼) + 3카드 grid
- `HelpOverlay.tsx`: `AIInsightModal` 패턴 단순화, framer 외부 클릭 닫기 + `aria-modal`
- `EquipmentGanttChart.tsx`: SVG `<rect>` 직접 렌더. `viewBox="0 0 100 48"` + percent x/width, NO_DATA는 dashed border 범례. 색은 `colors.primary/danger/warning`
- `EquipmentUsageSection.tsx`: 기간 탭(role="tablist") + native `<select>` 설비 드롭다운 + Gantt + 누적/정지 시간 카드. `periodStartAt/periodEndAt`은 segments의 max endedAt에서 period span 역산
- `MaintenanceCallButton.tsx`: `useIsDesktop` (`(hover: hover) and (pointer: fine)`) hook. 모바일은 `<a href="tel:">`, 데스크탑은 framer 팝업 + `tel:` 보조 버튼

### Step 3 — `DashboardPage.tsx` 재배치
- `StatusHero`, `QuickActions`, `MachineList`, `dashboardSummary` query, `DashboardSummary` 인터페이스 제거
- `useQuery({ queryKey: QUERY_KEYS.dashboardHome, ... })` 추가, isPending/error 분기로 로딩/실패 UI
- 렌더 순서: `HomeGreeting` → `StatusOverviewSection` (enabledMetrics `statusSummary`) → `EquipmentUsageSection` (enabledMetrics `equipmentUsage`) → `MaintenanceCallButton`
- 페이지 레벨 `helpSection: 'status'|'equipment'|null` state + `HELP_COPY` 객체로 `HelpOverlay` 단일 인스턴스 제어
- `selectedPeriod` state는 1차 placeholder (mock은 period 무관하게 같은 segments 반환)

### Validation
- Pass: `cd frontend && npm run build` (`DashboardPage` 청크 9.91 → 15.05 kB)
- Pass: `npx tsc --noEmit` — 0 errors
- Pass: `git diff --check` — whitespace 0 errors
- Pass: `grep -rn "^import.*StatusHero\|QuickActions\|MachineList"` — `DashboardPage`에서 import 0건 (PR2 안전)

### Risks / Follow-ups
- PR2: `StatusHero.tsx`, `QuickActions.tsx`, `MachineList.tsx`, `mockApi /dashboard/summary` 제거 + `QUERY_KEYS.dashboardSummary` 폐기 후속 PR
- `equipmentUsage` query는 아직 컴포넌트 state에 연동 안 됨 — `selectedPeriod` 변경 시 mock API 재호출 로직은 다음 PR
- backend 실제 `/dashboard/home`, `/dashboard/equipment-usage` 엔드포인트 + Pydantic 응답 모델은 별도 작업
- 모바일 pinch는 별도 PR

## EntrySplash 추가 (MAIN-001 부분 통합)

OCR `MAIN-001`(앱 진입 로고)을 별도 페이지가 아닌 `/dashboard` 홈 위의 풀스크린 오버레이로 통합. 별도 라우트/스플래시 페이지 신설 없이 같은 경험 구현.

### Changes
- 신규 `frontend/src/components/features/dashboard/home/EntrySplash.tsx`
  - 풀스크린 `fixed inset-0 z-[200]` 오버레이
  - 로고(`@/assets/signalcraft-logo.png`) + "SignalCraft" + "무설정 AI 시설 관리" + 버전
  - Framer Motion fade in/out (`0.4s ease-out-quart`)
  - `autoDismissMs=2500` props 기본값 + 탭하면 즉시 dismiss (`useEffect setTimeout` cleanup)
- `DashboardPage.tsx` 통합
  - `ENTRY_SPLASH_FLAG = 'signalcraft:entrySplashShown'`
  - `shouldShowEntrySplash()` 가드: `sessionStorage.getItem(...) === null` 첫 진입만
  - `dismissEntrySplash`: sessionStorage 세팅 + state false (try/catch로 Safari private mode 안전망)
  - `AnimatePresence`로 마운트/언마운트 애니메이션
  - `home?.appVersion ?? 'v0.0.1'` fallback — splash가 home 로딩 전 표시되어도 안전

### Validation
- Pass: `npm run build`
- 수동 확인 포인트: DevTools Application > Session Storage에 `signalcraft:entrySplashShown=1` 기록, 새로고침 시 다시 표시 안 됨, 탭/창 새로 열면 다시 표시
