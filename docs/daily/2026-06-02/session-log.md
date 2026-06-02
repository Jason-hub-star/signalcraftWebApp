# 2026-06-02 Session Log

## HOME-001 보강 — #3 ON/OFF 요약 + #8 10분 polling + 머신 라인업 교체

### Context
2026-06-01에 OCR HOME-001 9개 요구사항 중 7개를 main(`695f484`)에 반영. 남은 갭:
- **#3 요약 정보 영역** — 완전 누락
- **#8 10분 polling** — `lastUpdatedAt` 표시는 되지만 자동 갱신 없음
- **#6 핀치 줌** — 본체 ✅, 핀치 ❌ → 줌 후 UX(패닝 vs 구간 변경) 미정으로 v0.0.2 분리

사용자 추가 요청: 머신 5대 라인업을 일반 시설관리 장비(냉동칠러/컴프레서/바큠펌프/진공오븐/공조기)로 교체. Raven Materials 시나리오는 유지.

### Step 1 — 머신 5대 라인업 교체 (`frontend/src/lib/mockScenario.ts`)
| 신규 ID | 한글 이름 | type | status |
|---|---|---|---|
| `chiller-01` | 냉동칠러 01 | CHILLER | warning |
| `compressor-01` | 메인 컴프레서 02 | COMPRESSOR | error |
| `vacuum-pump-01` | 바큠펌프 01 | VACUUM_PUMP | running |
| `vacuum-oven-01` | 진공오븐 01 | VACUUM_OVEN | warning |
| `ahu-01` | 공조기 01 | AHU | running |

- `machines`, `equipmentUsage.machines`, `equipmentUsage.segments` 5건 모두 새 ID로 재구성
- `status` 분포(running 2 / warning 2 / error 1) 유지 → `statusOverview`/`dashboardSummary` 카운트 변경 불필요
- `notifications`, `maintenanceHistory`, `aiInsight.periodData.{daily,weekly}` 안의 머신 이름·`device_id` 참조 일관성 갱신 (예: "열처리로 02" → "메인 컴프레서 02")

### Step 2 — `equipmentSummary` 데이터 계약 + mock
- `frontend/src/lib/contracts/dashboardHome.ts`에 `EquipmentSummaryItem` (id/name/type/state), `EquipmentSummaryState` (`'RUNNING'|'OFF'`) 추가
- `DashboardHome.equipmentSummary: EquipmentSummaryItem[]` 필드 신설
- `mockScenario`:
  - `DashboardMetricId` 유니온에 `'equipmentSummary'` 추가
  - `company.enabledMetrics`에 `'equipmentSummary'` 추가
  - `company.labels.equipmentSummary = '설비 요약'`
  - `dashboardHome.equipmentSummary` 5건 (segments 마지막 state 기준 ON/OFF 매핑)
- mockApi 변경 없음 — `GET /dashboard/home`이 통째 직렬화

### Step 2b — 아이콘 매핑 유틸 분리 (`frontend/src/lib/machineIcons.tsx` 신규)
- `MachineCard.tsx:47-57` 내부 함수 → `getMachineIcon(type, className?)` 공용 유틸로 추출
- 신규 키워드 매핑: CHILLER → Snowflake, COMPRESSOR → Gauge, VACUUM → Wind, OVEN → Flame, AHU/AIR_HANDLING → Wind
- `MachineCard.tsx`는 내부 함수 제거 + import로 교체. 미사용 lucide import 정리

### Step 3 — `EquipmentSummarySection.tsx` 신규
- props: `{ items: EquipmentSummaryItem[] }`
- 페이지당 4개(2×2), 5대 → 2페이지(4+1)
- Framer Motion `motion.div drag="x"` + `animate={{ x: -currentPage * containerWidth }}`
- `ResizeObserver`로 컨테이너 폭 측정 → 정확한 페이지 너비 snap
- `onDragEnd`에서 offset 25% 또는 velocity ±300 초과 시 인접 페이지 전환
- 각 카드: 좌측 아이콘 박스(40px primary tint) + 우상단 ON/OFF pill(`bg-emerald-500/10` / `bg-muted`) + 머신명 truncate
- 페이지 ≥ 2일 때만 하단 dot indicator (활성은 가로로 늘어난 dash 형태)
- 접근성: `role="region"` aria-label="설비 요약", 각 카드 `role="group"`, dot은 `role="tab"`

### Step 4 — `DashboardPage.tsx` 통합
- `EquipmentSummarySection` import
- `useQuery({ ..., refetchInterval: 10 * 60 * 1000, refetchIntervalInBackground: false })` 추가 — #8
- 렌더 순서: HomeGreeting → StatusOverviewSection → **EquipmentSummarySection (신규)** → EquipmentUsageSection → MaintenanceCallButton

### Step 5 — 검증
| 항목 | 결과 |
|---|---|
| `npx tsc --noEmit` | 0 errors |
| `npm run build` | pass (3111 modules, 25.56s, gzip 68.79 KiB main) |
| `git diff --check` | clean |
| 기존 머신 ID(rp-reactor-01/ht-furnace-02/rcb-coater-01/voc-chamber-01/air-filter-rig-01) 잔존 | **0건** |
| `equipmentSummary` 신규 사용처 | 6곳 (contract/mock/DashboardPage) |

### 결정 사항
- **#6 핀치 줌은 이번 PR 제외** — 라이브러리 도입 결정과 줌 후 UX 결정을 별도 검토. v0.0.2 후속 PR
- **스와이프 라이브러리 없이 Framer Motion만 사용** — 이미 `framer-motion@12.29.2` 의존성, 추가 비용 0
- **머신 아이콘은 키워드 매핑 재사용** — 신규 토큰 추가 없이 기존 `classTokens.machineType.{refrigerator,storage,freezer,showcase}` 4종 안에서 분배

### Follow-ups
1. **드래그 마찰 튜닝** — `dragElastic`/snap threshold 사용자 피드백 후 조정

---

## 보강 라운드 2 — 아이콘 구분 + 레거시 제거 + 핀치 줌 + FE-BE 분석

### 아이콘 구분
- `frontend/src/lib/machineIcons.tsx`: `AHU`/`AIR_HANDLING` → `Fan` 아이콘 (`classTokens.machineType.showcase`)으로 교체. 바큠펌프(`Wind`/storage slate)와 시각 구분 완료

### 레거시 컴포넌트 제거 (PR2 완료)
- 파일 삭제: `StatusHero.tsx`, `QuickActions.tsx`, `MachineList.tsx`
- 폐기: `QUERY_KEYS.dashboardSummary`, `mockApi /dashboard/summary` 라우트, `mockScenario.dashboardSummary` 필드
- 잔존 grep 0건

### Gantt 핀치 줌 (`EquipmentGanttChart.tsx`)
- **native touch only** — 의존성 추가 0
- `useEffect`로 `touchstart/touchmove/touchend` 등록 (passive: false로 `preventDefault` 보장)
- 두 손가락 핀치: 두 손가락 거리 + 중심점을 anchor로 `viewport.{start,end}` ratio 수렴/확장. MIN_SPAN 5% (24h 기준 ~72분)까지 확대
- 한 손가락 드래그: 줌 상태(`span < 0.999`)일 때만 viewport shift
- `selectedMachineId` / `periodStartAt` / `periodEndAt` 변경 시 자동 리셋
- 줌 상태일 때 `RotateCcw` "원래대로" pill 버튼 표시 (`bg-primary/10`)
- "지금" 마커는 `viewport.end >= 0.999`일 때만 노출 (확대 시 오해 방지)
- `axisLabels`/`visibleSegments` 모두 effective viewport 기준 재계산

### FE-BE Contract 1:1 매칭 분석
백그라운드 Explore 에이전트 결과:
- ✅ 완전 매칭 9 / ⚠️ 부분 매칭 4 / ❌ 백엔드 누락 2 / 🟡 프론트 미사용 1
- ❌ **`/dashboard/home`**, **`/dashboard/equipment-usage`** 백엔드 라우터 없음 — 어제 추가한 신규
- ⚠️ `/notifications/{id}/read`, `/notifications/mark-all-read` 응답이 `{status:"success"}` ↔ 프론트 기대 `{ok:true}` 불일치
- 🟡 `/dashboard/summary` — 프론트는 폐기, 백엔드는 잔존

## 백엔드 contract 동기화 라운드

### `backend/app/features/dashboard/router.py` 전면 재작성
- **삭제**: `GET /summary` 핸들러 (프론트 폐기에 맞춤)
- **신규 `GET /home`**: `devices` 테이블에서 user의 설비 가져와 동적 빌드
  - `statusOverview`: machines/edgeSensors/server 3카드. machines는 DANGER 분포 기반 healthy/warning/danger 자동 결정. edgeSensors/server는 1차 healthy 고정
  - `equipmentSummary`: devices 매핑. `DEVICE_STATUS_TO_MACHINE_STATUS` + `RUNTIME_TO_SUMMARY_STATE` (running→RUNNING, warning/error→OFF)
  - `equipmentUsage`: `_build_equipment_usage(devices, "24h")` — machines 매핑, segments는 빈 배열(집계는 후속 PR), summary 0
  - `appVersion: f"v{settings.VERSION}"`, `lastUpdatedAt: datetime.now(timezone.utc).isoformat()`, `maintenancePhone: "010-1234-5678"`
- **신규 `GET /equipment-usage`**: `period`/`machine_id` 쿼리. `PERIOD_HOURS` 화이트리스트 (`24h|7d|30d|90d`), 외 값은 400. `machine_id` 있으면 devices 필터링 후 동일 `_build_equipment_usage` 반환

### `backend/app/features/notifications/router.py`
- `POST /{notification_id}/read`, `POST /mark-all-read` 응답을 `{"status":"success"}` → `{"ok": True}`로 통일

### 검증
| 항목 | 결과 |
|---|---|
| `python3 -m compileall app` | pass (router.py 변경분 컴파일됨, 에러 0) |
| 프론트 `tsc --noEmit` | 0 errors |
| 프론트 `npm run build` | pass (30.73s) |
| 레거시 컴포넌트/라우트 grep | 0건 |

### Follow-ups
1. **백엔드 시드 갱신** — `devices` 테이블이 새 머신 라인업(chiller-01/compressor-01/vacuum-pump-01/vacuum-oven-01/ahu-01)으로 갱신됐는지 확인 필요. 현재 백엔드 응답은 DB 시드 그대로
2. **`/equipment-usage` segments 실제 집계** — `machine_event_logs` 또는 `daily_reports`에서 period별 RUNNING/OFF/ERROR/NO_DATA 구간 집계 로직 추가
3. **Pydantic 응답 모델** — 현재 dict 반환. `response_model=DashboardHomeResponse`로 contract 강제 (별도 schemas.py)
4. **모바일 실기기 핀치/패닝 테스트**
