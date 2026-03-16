**SignalCraft Biz: 무설정 AI 시설 관리 솔루션** 개발을 위한 **제품 요구사항 정의서(PRD)** 초안입니다.

이 문서는 개발팀, 디자인팀, 그리고 이해관계자가 동일한 목표를 향해 달릴 수 있도록 **"무설정(Zero Config)", "자동 리포트(Auto-Report)", "직관성(Toss-Style)"**이라는 핵심 원칙을 중심으로 작성되었습니다.

---

# 📑 Product Requirements Document (PRD)

| 프로젝트명 | SignalCraft Biz (가칭) | 버전 | v1.0 |
| --- | --- | --- | --- |
| 작성일 | 2026. 01. 30 | 상태 | Draft |
| 타겟 유저 | 무인 아이스크림 매장 점주, 소규모 공장 관리자 | 플랫폼 | Web (React PWA) |

---

## 1. 배경 및 목적 (Overview)

### 1.1 해결하고자 하는 문제 (Problem)

* **복잡성:** 기존 산업용 모니터링 툴은 그래프가 어렵고 설정할 게 너무 많아 비전문가가 사용하기 어렵습니다.
* **불안감:** 무인 매장이나 공장 사장님은 "지금 기계가 잘 돌고 있나?"라는 불안감을 항상 가지고 있지만, 매번 가서 확인할 수 없습니다.
* **데이터 과잉:** 실시간 그래프보다는 "오늘 하루 잘 돌았는지", "내일 고장 나지는 않을지"에 대한 요약된 결론이 필요합니다.

### 1.2 솔루션 (Solution)

* **Zero Config:** 설치 후 전원만 켜면 24시간 동안 자동으로 환경을 학습하고 임계값을 설정합니다.
* **AI 리포트:** 매일 아침, 기계의 가동 시간과 건강 상태를 영수증처럼 요약해서 푸시 알림으로 보내줍니다.
* **직관적 UI (Human-Centric Translation):** 복잡한 주파수 차트를 제거하고, "기본 상태(맥박)", "고장까지 남은 시간" 등 인간의 언어로 번역된 직관화된 지표를 제공합니다.

---

## 2. 사용자 스토리 (User Stories)

| 순번 | Actor | User Story | 가치 (Value) |
| --- | --- | --- | --- |
| 1 | 사장님 | 앱을 켜자마자 내 매장의 모든 냉동고 상태를 한눈에 보고 싶다. | 심리적 안정, 시간 절약 |
| 2 | 사장님 | 복잡한 임계값 설정 없이 AI가 알아서 '이상'과 '정상'을 구분해 줬으면 좋겠다. | 사용 장벽 제거 (Zero Config) |
| 3 | 관리자 | 매일 아침 "어제 총 14시간 가동, 2회 과부하" 같은 요약 리포트를 받고 싶다. | 운영 효율화, 예지 보전 |
| 4 | 사장님 | 실제로 기계가 고장 날 징조(이상 진동)가 보일 때만 알림을 받고 싶다. | 알림 피로도 감소 |

---

## 3. 핵심 기능 명세 (Functional Requirements)

### 3.1 초기 설정 및 학습 (Onboarding & Learning)

* **QR 등록:** 기기에 부착된 QR코드를 찍으면 즉시 앱에 기기가 등록되어야 합니다.
* **초기 학습 모드 (Calibration):**
* 최초 24시간 동안은 알림을 발송하지 않고 `학습 중` 배지를 표시합니다.
* **V5.7 알고리즘**을 통해 평상시 소음(Noise Floor)과 가동 시 진동 패턴을 수집하여 기준점(Baseline)을 잡습니다.



### 3.2 실시간 모니터링 대시보드 (Dashboard)

* **카드형 UI:** 등록된 기기 리스트를 카드 형태로 나열합니다.
* **상태 표시 (3-State Logic):**
* `🟢 정상 (Good)`: 가동 중이며 Otsu 임계값 이내일 때.
* `🟡 주의 (Warning)`: 최근 24시간 내 가동 시간이 평균 대비 20% 이상 초과(과부하)되거나 단발성 피크 발생 시.
* `🔴 위험 (Danger)`: 연속적인 Otsu 임계값 초과 또는 특정 주파수(180Hz 등) 감지 시.



### 3.3 자동 리포트 시스템 (Reporting) - **Key Feature**

* **일간 리포트 (Daily Brief):**
* 매일 00:00 기준 배치 작업 실행.
* 포함 항목: `총 가동 시간`, `가동 사이클 횟수`, `평균 가동 지속 시간`, `이상 징후 감지 횟수`.
* Push 알림 발송: "OO점 일간 리포트가 도착했습니다."


* **주간 리포트 (Weekly Insight):**
* 전주 대비 가동 시간 증감률(%) 표시 (예: "지난주보다 2시간 더 돌았어요. 필터 청소가 필요할 수 있어요.").



### 3.4 알림 및 제어 (Notification & Control)

* **알림 채널 및 상세 설정**: 사용자가 앱 푸시 및 카카오톡 알림을 선택적으로 활성화하고, 이상 징후나 AI 리포트 중 원하는 알림만 골라서 받을 수 있는 상세 설정 UI 제공.
* **대시보드 퀵 액션**: 홈 화면 상단에서 현재 알림 상태를 확인하고 즉시 '일시정지' 또는 '재개'할 수 있는 인터랙션 제공 (설정 페이지와 실시간 동기화).
* **피드백 루프:** 사용자가 "오탐지(무시하기)" 버튼을 누르면, 해당 시점의 특징값을 `False Positive`로 분류하여 Otsu 민감도(Multiplier)를 자동으로 0.1 단위 둔감화.

### 3.5 정밀 진단 및 고장 예보 (Advanced Diagnostics & Prediction)

* **종합 건강 지수 (EHI: Equipment Health Index):** 배음 무결성, 위상 안정도를 종합한 0~100점 점수.
* **72H Forecast (고장 예보):** 가우시안 프로세스(GP) 모델을 통해 미래 3일간의 고장 가능성 궤적 시각화.
* **골든타임 카운트다운:** 고장 임계치 도달 예상 시점까지 남은 시간(예: 64h 12m)을 실시간으로 표시.
* **부품별 시멘틱 진단:** 컴프레서, 응축기 팬, 팽창 밸브의 개별 건강상태바 및 진단 근거(Reasoning Log) 제공.

### 3.6 가상 센서 리포트 & 스마트 일지 (Virtual ROI & Smart Log)

* **가상 ROI 분석:** 하드웨어 센서 없이 전력 소모(180Hz 기반), 문 열림(배경 소음 기반), 제상 효율(성에 축적도)을 계산하여 경제적 가치 산출.
* **HACCP 스마트 일지:** 1분 단위의 상세 가동 이력(ON/OFF/DEF/DOOR)을 자동 생성하여 법적 증빙 양식(PDF/Excel)으로 출력.

---

## 4. 기술 아키텍처 및 알고리즘 (Technical Specs)

### 4.1 알고리즘 (Backend Engine)

* **핵심 엔진:** Python (FastAPI + Numba).
* **신호 처리:**
* **Magi (Robust Goertzel):** 60Hz, 120Hz, 180Hz 대역 에너지 추출.
* **Smart Trimming (V5.7):** 노이즈와 실제 가동 구간(ON/OFF)을 명확히 분리하여 정확한 가동 시간 산출.
* **Auto Threshold (Otsu):** 별도 설정 없이 진동 에너지 분포에 따라 동적으로 임계값 결정.



### 4.2 시스템 구조

* **Device:** ESP32 (10초 주기 데이터 전송) → Supabase.
* **Server:** Fly.io (Always-on Docker Container).
* Role 1: 실시간 스트림 감시 (Watcher).
* Role 2: 일간/주간 리포트 생성 (Batch Worker).


* **Client:** React PWA (Vite + Tailwind CSS).

---

## 5. UI/UX 가이드라인 (Design Principles)

### 5.1 톤앤매너 (Tone & Manner)

* **Toss Style:** 금융 앱처럼 신뢰감 있고 간결하게.
* **Human Metaphor (인간적 비유):** 기술 데이터 대신 '맥박(Pulse)', '골든타임'과 같은 직관적인 단어와 애니메이션 사용.
* **Progressive Disclosure (점진적 노출):** 결론(1단계) -> 행동 제안(2단계) -> 기술적 근거(3단계) 순으로 정보를 노출하여 사장님의 인지 부하 감소.
* **색상 팔레트:**
* Primary: `Signal Blue` (신뢰)
* Status: `Mint Green` (정상), `Warm Orange` (주의), `Soft Red` (위험) - *원색적인 빨강/노랑 지양*.


* **타이포그래피:** 숫자는 크고 굵게, 설명은 친절한 대화체로 ("~하고 있어요").

### 5.2 주요 화면 와이어프레임 요건

1. **홈 화면:** "지금 안전한가요?"에 대한 답을 최상단에 큰 아이콘으로 배치.
2. **리포트 화면:** 영수증처럼 위에서 아래로 읽어 내려가는 구조. 마지막엔 "공유하기" 버튼 배치.
3. **알림 화면:** 긴급한 알림은 붉은색 틴트가 들어간 바텀 시트(Bottom Sheet)로 띄움.

---

## 6. 개발 마일스톤 (Milestones)

| 단계 | 목표 | 주요 작업 내역 | 예상 기간 |
| --- | --- | --- | --- |
| **Phase 1** | **Backend Core** | FastAPI 구축, V5.7 로직 이식, Fly.io 배포, Supabase 연동 | 1주 |
| **Phase 2** | **Reporting Engine** | 일간 리포트 생성 로직 구현(배치), 알림 트리거 개발 | 1주 |
| **Phase 3** | **Frontend (MVP)** | React PWA 구축, 대시보드/리포트 UI 구현, FCM 연동 | 2주 |
| **Phase 4** | **Test & Tuning** | 실환경 테스트, 자동 임계값 튜닝 검증, "학습 모드" UX 개선 | 1주 |
| **Phase 5** | **Advanced UX** | 다크 모드(Dark Mode) 지원 및 테마 최적화 | 1주 |
| **Phase 6** | **Notifications** | 알림 상세 설정 UI, 백엔드 API, DB 스키마 구축 | 현재 |

---

## 7. 데이터 및 성과 지표 (Metrics)

* **리포트 오픈율 (Report Open Rate):** 사용자가 푸시를 받고 실제로 리포트를 열어보는 비율.
* **오탐지 신고율 (False Alarm Rate):** 알림에 대해 "무시하기"를 누르는 비율 (알고리즘 튜닝 지표).
* **DAU (Daily Active Users):** 매일 앱에 접속하여 상태를 확인하는 사장님 수.


8. 데이터베이스 설계 초안(Database Schema)시스템의 핵심인 초기 학습(Calibration), 실시간 상태 추적, 리포트 요약을 효율적으로 처리하기 위한 Supabase 스키마입니다.8.1 ERD 개요 (Entity Relationships)User (1) : (N) Devices (한 사장님이 여러 기기 관리)Device (1) : (N) Sound Logs (10초 단위 Raw 데이터)Device (1) : (N) Daily Reports (하루 1개의 요약 리포트)Device (1) : (N) Incidents (이상 징후 발생 이벤트)8.2 테이블 상세 명세1️⃣ Devices (기기 관리 테이블)기기의 현재 상태와 "AI 학습 파라미터"를 저장하는 핵심 테이블입니다.컬럼명 (Column)타입 (Type)설명 (Description)비고device_idtext (PK)기기 고유 ID (예: machine_01)ESP32 하드코딩 값owner_iduuid (FK)소유주 ID (auth.users)RLS 정책 적용 대상nametext사용자 지정 이름 (예: "워크인 1번")statusenumGOOD / WARNING / DANGER실시간 대시보드 표시용is_calibratingboolean학습 모드 여부 (True/False)True일 경우 알림 미발송sensitivityfloatOtsu 알고리즘 민감도 계수 (기본 1.0)오탐지 신고 시 자동 조정last_activetimestamp마지막 통신 시간기기 오프라인 감지용2️⃣ Sound Logs (센서 데이터 로그)ESP32가 전송하는 Raw 데이터를 저장합니다. (기존 구조 유지)컬럼명 (Column)타입 (Type)설명 (Description)비고idbigint (PK)자동 증가 IDdevice_idtext (FK)기기 IDfeaturesjsonb82개 주파수 에너지 배열60/120Hz 대역 데이터created_attimestamp데이터 생성 시각3️⃣ Daily Reports (일간 요약 리포트) - Key Feature앱 로딩 속도를 위해 Raw 데이터를 매번 계산하지 않고, 매일 밤 배치(Batch) 작업으로 요약된 결과를 저장합니다.컬럼명 (Column)타입 (Type)설명 (Description)비고report_iduuid (PK)리포트 고유 IDdevice_idtext (FK)기기 IDreport_datedate리포트 기준 날짜 (YYYY-MM-DD)인덱스(Index) 필수total_runtimeinteger총 가동 시간 (초 단위)cycle_countintegerON/OFF 가동 횟수health_scoreinteger기기 건강 점수 (0~100)진동 분산값 기반 계산summary_texttextAI 한 줄 요약 멘트"어제보다 2시간 더 돌았어요."4️⃣ Incidents (이상 징후 이벤트)타임라인에 표시될 중요 이벤트와 사용자 피드백을 저장합니다.컬럼명 (Column)타입 (Type)설명 (Description)비고iduuid (PK)이벤트 IDdevice_idtext (FK)기기 IDoccurred_attimestamp발생 시각typeenumANOMALY_PEAK (급격한 진동), LONG_RUN (과부하)severityfloat심각도 (초과율 %)user_feedbackenumNULL / CONFIRMED / IGNOREDIGNORED 시 민감도 하향 조정