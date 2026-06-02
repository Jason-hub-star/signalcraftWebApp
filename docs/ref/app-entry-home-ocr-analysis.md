# App Entry / Home OCR Analysis

기준일: 2026-06-01

## 1. OCR 원문 정리

### MAIN-001 — 앱 진입 페이지

| 항목 | 내용 |
|---|---|
| 화면 ID | `MAIN-001` |
| 버전 | `0.0.1` |
| 페이지 제목 | 앱 진입 페이지 |
| 작성일자 | `2026.06.01` |
| 페이지 설명 | 앱 진입 전, 회사 로고를 보여주는 화면 |

요구사항:
1. 회사 로고 노출
2. 버전 노출, DB에서 버전ID 호출

### MAIN-002 — 스플래시 페이지

| 항목 | 내용 |
|---|---|
| 화면 ID | `MAIN-002` |
| 버전 | `0.0.1` |
| 페이지 제목 | 스플래시 페이지 |
| 작성일자 | `2026.06.01` |
| 페이지 설명 | 앱 진입 전, 데이터 로딩시 실행 여부를 확인시켜주는 기능 |

요구사항:
1. 전체 데이터를 불러올 때 보여지는 로딩 컴포넌트. 기존 UI 재사용.

### HOME-001 — 홈 페이지

| 항목 | 내용 |
|---|---|
| 화면 ID | `HOME-001` |
| 버전 | `0.0.1` |
| 페이지 제목 | 홈 페이지 |
| 작성일자 | `2026.06.01` |
| 페이지 설명 | 로딩 완료시 가장 먼저 보여지는 페이지 |

요구사항:
1. 앱 진입시 인사말: API 호출시 사용자의 데이터 중 `사용자 이름` 기반으로 동적 구성
2. 상태 정보 영역: 현재 설치된 설비와 엣지 센서, 서버 상태 요약
3. 설비 정보 영역: 설비의 ON/OFF 동작 감지 정보
4. 업데이트 시간 정보: 가장 최근 서버로부터 받아온 데이터 시간. `v0.0.1`에서는 polling 방식, 데이터 수집 시간 간격은 10분 고정
5. 정비사 전화하기 버튼: 모바일은 전화 연결, 데스크탑은 팝업으로 전화번호 안내

### HOME-001 — 상태 정보 영역

요구사항:
1. 상태 정보 타이틀: `상태 정보` 타이틀 표시, 타이틀과 도움말 버튼을 가로 배치
2. 상태 정보 도움말 버튼: 각 컴포넌트 설명. 팝업 형태로 표시하며 팝업 외 영역 클릭 시 overlay를 제거
3. 상태 구분 아이콘: 설비 / 센서 / 서버를 시각적으로 보여주는 아이콘. 배경은 메인 파란색, 아이콘은 하얀색
4. 연결 상태 시각화: 아이콘 아래 작은 상태 표시. 상태 문구와 색상은 양호(초록), 보통(노랑), 불량(빨강)
5. 연결 상태 타이틀: 현재 컴포넌트가 어떤 기기 상태인지 보여주는 타이틀
6. 설비 댓수 표시 영역: 현재 컴포넌트에 그룹핑된 설비의 양호 카운트 / 전체 카운트 표시. 보통 또는 불량이면 양호 카운트가 작게 표시됨

### HOME-001 — 설비 정보 영역

요구사항:
1. 상태 정보 타이틀: `상태 정보` 타이틀 표시, 타이틀과 도움말 버튼을 가로 배치
2. 상태 정보 도움말 버튼: 각 컴포넌트 설명. 팝업 형태로 표시하며 팝업 외 영역 클릭 시 overlay를 제거
3. 기간 선택 버튼: 지난 24시간, 지난 7일, 지난 30일, 지난 90일. `v0.0.1`은 네 개 기간만 제공하고 향후 자세한 기간 설정 추가 예정
4. 설비 선택 드롭다운: 전체 갯수는 `상태 정보` 섹션의 `설비 구동 상태` 전체 카운트와 동일해야 함
5. 설비 ON/OFF 그래프: Gantt Chart. 기간 선택 버튼으로 지정된 기간 동안의 상태를 그래프로 표시. 모바일은 pinch 또는 두 손가락 그리기로 기간 변경 가능 필요. 상태는 `RUNNING` 파랑, `OFF` 빨강, `ERROR` 주황, `NO DATA` 투명
6. 전체 구동 시간 요약 영역: 센서 부착 이후 시간을 더해 보여줌. 구동 누적 시간과 정지 누적 시간을 표시

## 2. 현재 코드 매핑

| 요구 영역 | 현재 파일 | 현재 상태 | 판단 |
|---|---|---|---|
| `/dashboard` 홈 라우트 | `frontend/src/App.tsx`, `DashboardPage.tsx` | `/dashboard`가 루트 홈으로 사용됨 | 재사용 |
| 앱 진입 로딩 | `App.tsx`의 `LoadingSpinner` | lazy route fallback만 있음 | 수정 필요 |
| 회사 로고/헤더 | `Header.tsx`, `signalcraft-logo.png` | 상단 헤더에 SignalCraft 로고 표시 | 부분 재사용 |
| 사용자 이름 기반 인사말 | `DashboardPage.tsx`, `/shared/user-profile/me` | `full_name` 기반 인사말 존재 | 재사용 |
| 상태 정보 요약 | `StatusHero.tsx`, `/dashboard/summary` | GOOD/WARNING/DANGER 카운트 기반 hero | 수정 또는 신규 |
| 설비 목록 카드 | `MachineList.tsx`, `MachineCard.tsx`, `/machines/` | 설비 리스트/상세 모달 중심 | 부분 재사용 |
| ON/OFF 상세 로그 | `SmartLogTab.tsx`, `/dashboard/machine-detail/smart-log` | 테이블형 로그, Gantt 없음 | 신규 필요 |
| 업데이트 시간 | `devices.last_seen_at`, `telemetry_logs.captured_at`, `machine_event_logs.occurred_at` | UI 노출 없음 | 신규 필요 |
| 정비사 전화 버튼 | `MaintenanceTab`의 서비스 신청 흐름 | 전화 연결/팝업 없음 | 신규 필요 |
| 고객 테마/설정 | `mockScenario.company`, `theme.ts`, `index.css` | theme/config foundation 존재 | 재사용 |

## 3. 재사용할 것

### UI / 컴포넌트
- `Header`, `BottomNav`: 앱 shell 유지.
- `App.tsx`의 `LoadingSpinner`: `MAIN-002` 스플래시 로딩 컴포넌트의 기초로 재사용.
- `Button`, `Badge`, `Card`: 신규 홈 섹션의 기본 UI로 재사용.
- `MachineCard`의 `Machine` 타입과 상태 라벨 로직: 설비 상태 표시의 일부로 재사용.
- `MachineDetailModal/SmartLogTab`: 상세 로그 기능은 유지하되, 홈 Gantt와는 별도 상세 영역으로 남김.

### 데이터 / API
- `QUERY_KEYS` 팩토리와 `apiFetch`: 모든 신규 홈 데이터 조회에 재사용.
- `mockScenario.company`: 고객별 `themeId`, `dashboardPreset`, `enabledMetrics`, labels 기반으로 확장.
- `mockApi.ts`: 목업 endpoint를 추가해 실제 API 전환 전 화면 작업 가능.
- DB 스키마의 `devices`, `telemetry_logs`, `machine_event_logs`: 상태 요약과 ON/OFF 구간 산출의 원천 후보.

## 4. 수정할 것

### Frontend
- `DashboardPage.tsx`
  - 현재 `StatusHero + QuickActions + MachineList` 구조를 `HomeGreeting + StatusOverviewSection + EquipmentUsageSection + update/contact action` 중심으로 재배치.
  - `QuickActions`는 OCR 요구사항에 없으므로 홈에서는 숨기거나 하단/설정 쪽으로 이동 후보.
- `StatusHero.tsx`
  - OCR의 상태 정보 영역은 큰 hero보다 3개 상태 카드(설비/센서/서버)에 가까움.
  - 기존 hero는 유지 가능하지만 `StatusOverviewSection` 신규 구현 후 홈에서는 대체 후보.
- `MachineList.tsx`
  - 홈에서는 전체 카드 리스트보다 설비 선택 드롭다운과 Gantt가 우선.
  - 설비 목록은 상세 페이지(`/machines`) 또는 홈 하단 optional section으로 유지.
- `mockScenario.ts`
  - `home` 또는 `dashboardHome` 객체 추가 필요.
  - 최소 필드: `appVersion`, `lastUpdatedAt`, `maintenancePhone`, `statusOverview`, `equipmentUsage`, `runtimeSummary`, `periodOptions`.
- `queryKeys.ts`
  - `dashboardHome`, `equipmentUsage(period, machineId)` key 추가 필요.

### Backend
- `backend/app/features/machines/router.py`
  - 현재 `DANGER`를 `danger`로 매핑하지만 프론트 `Machine.status`는 `error`를 기대함. 실제 API 사용 시 상태 표시 버그가 날 수 있어 `DANGER -> error`로 수정 필요.
  - `imageUrl`이 외부 `placehold.co` URL을 만들고 있어 frontend 규칙(외부 이미지 URL 금지)과 충돌. 아이콘 기반 UI에 맞춰 제거 또는 빈 문자열 반환 필요.
- `backend/app/features/dashboard/router.py`
  - `/summary`는 설비 카운트만 제공하므로 상태 정보 영역(설비/센서/서버)에는 부족.
  - `/home` 또는 `/overview` 형태의 aggregate endpoint 추가 후보.
- `backend/app/main.py`
  - 루트 health 응답에 `version`은 있으나 OCR의 “DB에서 버전ID 호출”과는 다름.
  - v0.0.1에서는 backend config version 사용, 추후 DB-backed version table로 확장하는 단계적 접근 추천.

## 5. 새로 만들 것

### 컴포넌트
- `HomeGreeting`: 사용자 이름 기반 인사말, 최근 업데이트 시간 표시.
- `StatusOverviewSection`: 설비 / 센서 / 서버 상태 카드 그룹.
- `StatusInfoCard`: 상태 아이콘, 상태 문구, 양호/전체 카운트.
- `HelpOverlay`: 도움말 버튼 공통 overlay.
- `EquipmentUsageSection`: 기간 선택, 설비 드롭다운, Gantt, 요약.
- `EquipmentGanttChart`: `RUNNING`, `OFF`, `ERROR`, `NO_DATA` 세그먼트 렌더링.
- `MaintenanceCallButton`: 모바일 `tel:` 연결, 데스크탑 전화번호 팝업.
- 선택: `AppEntryPage` 또는 `EntrySplashGate`: `MAIN-001`, `MAIN-002`가 실제 UX로 필요할 때 추가.

### 데이터 타입 / Mock
```ts
type HomeStatusKind = 'healthy' | 'warning' | 'danger';
type EquipmentRunState = 'RUNNING' | 'OFF' | 'ERROR' | 'NO_DATA';
type HomePeriod = '24h' | '7d' | '30d' | '90d';

type DashboardHome = {
  appVersion: string;
  lastUpdatedAt: string;
  maintenancePhone: string;
  statusOverview: Array<{
    id: 'machines' | 'edgeSensors' | 'server';
    title: string;
    state: HomeStatusKind;
    healthyCount: number;
    totalCount: number;
    description: string;
  }>;
  equipmentUsage: {
    selectedPeriod: HomePeriod;
    periodOptions: Array<{ id: HomePeriod; label: string }>;
    machines: Array<{ id: string; name: string }>;
    segments: Array<{
      machineId: string;
      state: EquipmentRunState;
      startedAt: string;
      endedAt: string;
    }>;
    summary: {
      runningMinutes: number;
      offMinutes: number;
    };
  };
};
```

### API 후보
- Mock first: `GET /dashboard/home`
- Future backend:
  - `GET /dashboard/home`: 인사말/상태 카드/최근 업데이트/정비 연락처.
  - `GET /dashboard/equipment-usage?period=24h&machine_id=...`: Gantt 구간과 누적 시간.

## 6. 구현 우선순위

1. `mockScenario.dashboardHome`과 `mockApi` route 추가.
2. `QUERY_KEYS.dashboardHome`, `QUERY_KEYS.equipmentUsage(...)` 추가.
3. `StatusOverviewSection`, `HelpOverlay`, `MaintenanceCallButton` 구현.
4. `EquipmentUsageSection`, `EquipmentGanttChart` 구현.
5. `DashboardPage`를 OCR 홈 구조로 재배치.
6. backend 상태 매핑 버그(`DANGER -> error`)와 외부 `placehold.co` 제거.
7. 필요 시 `MAIN-001`, `MAIN-002`를 앱 시작 gate로 구현.

## 7. 주의사항

- OCR 이미지의 작은 글씨는 사람이 한 번 더 검수해야 함.
- `SmartLogTab`에는 `Math.random()` 기반 표시가 있어 `dashboard-feature-add` 규칙과 충돌. 홈 신규 구현에는 재사용하지 말고 mock/API 값을 사용해야 함.
- 모바일 pinch 기간 변경은 v0.0.1에서 UI 필수처럼 보이나 구현 비용이 높음. 1차는 기간 버튼으로 구현하고 chart 컴포넌트에 확장 포인트만 둠.
- 고객별 UI 분기는 만들지 않고 `dashboardPreset`, `enabledMetrics`, labels, theme로 제어한다.
