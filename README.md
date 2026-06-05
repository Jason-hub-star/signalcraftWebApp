# SignalCraft Biz — 무설정 AI 시설 관리 솔루션

> **"전원만 켜면 AI가 스스로 알아서 모니터링하고 보고합니다."**  
> 무인 매장(아이스크림 할인점 등), 소규모 공장 관리자를 위한 직관적이고 자동화된 통합 상태 모니터링 및 예지 보전 시스템(Web PWA)입니다.

---

## 1. 시스템 아키텍처

```mermaid
graph TB
  subgraph Client["📱 Frontend (React PWA)"]
    direction TB
    PWA["Vite + Tailwind CSS<br/>(Toss-Style UI)"]
    Dash["직관적 대시보드<br/>(3-State Logic)"]
  end

  subgraph Server["⚙️ Backend (Python / Google Cloud Run)"]
    direction TB
    API["FastAPI 벡엔드<br/>Numba 최적화"]
    subgraph Engine["Analysis Engine"]
      Magi["Magi (Robust Goertzel)"]
      Trim["Smart Trimming V5.7"]
      Otsu["Auto Threshold (Otsu)"]
    end
    Batch["Batch Worker<br/>(리포트 생성)"]
  end

  subgraph DB["🗄️ Database (Supabase / PostgreSQL)"]
    direction TB
    Tables["11 Tables (JSONB 최적화)<br/>RLS Enabled"]
    Auth["Supabase Auth"]
  end

  subgraph Device["🔌 Edge Device"]
    ESP32["ESP32<br/>(10초 주기 데이터 전송)"]
  end

  Device -->|"스트림 데이터 (Raw Data)"| DB
  API --> Engine
  Server -->|"SQL / RPC (분석 및 요약 저장)"| DB
  Client -->|"API 통신 (대시보드/요약 조회)"| Server
  Client -->|"실시간 구독 (상태 갱신)"| DB
  Client -->|"OAuth / JWT (인증)"| Auth

  style Client fill:#1e3a5f,stroke:#3b82f6,color:#e2e8f0
  style Server fill:#1a3a2a,stroke:#10b981,color:#e2e8f0
  style DB fill:#3a2a1a,stroke:#f59e0b,color:#e2e8f0
  style Engine fill:#0f172a,stroke:#8b5cf6,color:#e2e8f0
  style Device fill:#2a1a3a,stroke:#8b5cf6,color:#e2e8f0
```

---

## 2. 데이터 흐름 (주요 파이프라인)

```mermaid
flowchart LR
  subgraph 수집["📡 수집 (Telemetry)"]
    D1["센서 감지<br/>(진동/소음)"]
    D2["ESP32<br/>데이터 전송"]
  end

  subgraph 분석["🧠 분석 & 처리 (FastAPI)"]
    P1["Magi 알고리즘<br/>(주파수 에너지 추출)"]
    P2["Smart Trimming<br/>(노이즈/가동 분리)"]
    P3["Otsu 임계값<br/>(동적 상태 판별)"]
    P4["가우시안 프로세스<br/>(고장 예보)"]
  end

  subgraph 조치["🔔 리포트 & 조치"]
    A1["실시간 상태 갱신<br/>(정상/주의/위험)"]
    A2["이상 징후 알림<br/>(Push/Kakao)"]
    A3["일간/주간 리포트<br/>(영수증 형태 요약)"]
    A4["시멘틱 진단<br/>(부품별 상태)"]
  end

  수집 --> 분석
  P1 --> P2 --> P3
  P1 --> P4
  P3 --> A1
  P3 --> A2
  P2 --> A3
  P3 --> A4

  style 수집 fill:#1e3a5f,stroke:#3b82f6,color:#e2e8f0
  style 분석 fill:#1a3a2a,stroke:#10b981,color:#e2e8f0
  style 조치 fill:#3a1a2a,stroke:#ec4899,color:#e2e8f0
```

---

## 3. ERD (데이터베이스 관계도)

```mermaid
erDiagram
  users ||--o{ devices : "소유"
  users ||--o{ user_subscriptions : "구독"
  devices ||--o{ telemetry_logs : "생성"
  devices ||--o{ daily_reports : "요약 기록"
  devices ||--o{ incidents : "발생"
  devices ||--o{ maintenance_logs : "유지보수 기록"
  devices ||--o{ service_tickets : "수리 요청"
  devices ||--|| forecasts : "고장 예측"
  
  users {
    uuid id PK
    text email
  }
  
  devices {
    uuid id PK
    uuid user_id FK
    text external_id "ESP32 시리얼 (Unique)"
    text status "GOOD | WARNING | DANGER"
    jsonb config "AI Settings (Algo Ver)"
    timestamptz last_seen_at
  }
  
  telemetry_logs {
    bigint id PK
    uuid device_id FK
    jsonb features "주파수 에너지 데이터"
    text state_token "ON, OFF, STR 등"
    bool is_machine_on
    timestamptz captured_at
  }
  
  daily_reports {
    date report_date PK
    uuid device_id PK,FK
    int total_runtime
    int cycle_count
    int health_score "0~100 (EHI)"
    jsonb diagnostics "시멘틱 진단 (부품 상태)"
    text ai_summary "AI 한 줄 평"
  }
  
  incidents {
    uuid id PK
    uuid device_id FK
    text type "ANOMALY | OVERLOAD | OFFLINE"
    float severity "심각도 점수"
    jsonb details "당시 상황 스냅샷"
    text user_feedback "NONE | CONFIRMED | IGNORED (오탐튜닝용)"
  }
```

---

## 4. 사용자 여정 (User Journey)

```mermaid
journey
  title SignalCraft Biz 초기 설정부터 모니터링까지
  section 온보딩 (Zero Config)
    QR코드 스캔 & 기기 등록: 5: 사장님
    24시간 초기 학습 (Calibration): 4: System
  section 알림 및 인지
    일간 리포트 (아침 영수증 푸시): 5: System, 사장님
    비정상 가동 감지 알림: 5: System
    오탐지 신고 (False Alarm - 무시하기): 4: 사장님, System
  section 분석 및 대응
    앱 대시보드로 상태(맥박) 확인: 5: 사장님
    골든타임 및 수리 필요 부품 인지: 4: 사장님
    수리 기사 호출 (Service Ticket): 4: 사장님
    관리 및 조치 결과 기록: 4: 사장님
```

---

## 5. 핵심 가치 및 주요 기능 (Core Features)

### 🚀 1. Zero Config (무설정)
- **쉬운 등록**: 기기에 전원만 켜고 QR코드를 찍으면 즉시 앱과 연동됩니다. (ESP32 -> Supabase 동기화)
- **자가 학습**: 첫 24시간 동안은 알림 없이 기계의 평상시 소음(Noise Floor)과 가동 진동 패턴을 파악하여 **기준점(Baseline)**을 설정합니다.

### 📊 2. AI 리포트 (Auto-Report)
- **매일 아침 자동 브리핑**: "어제 총 14시간 가동, 2회 과부하"와 같이, 복잡한 그래프 대신 하루의 성과와 안심도를 영수증처럼 출력하여 푸시 발송.
- **가상 센서 리포트 (Virtual ROI)**: 진동/소음 센서만으로 전력 소모(180Hz), 문 열림(배경 소음), 제상 효율을 뽑아내어 간접적/경제적 이득을 산출합니다.

### 💡 3. 인간 중심의 직관성 (Human-Centric UX)
- **Toss Style 대화형 인터페이스**: 기술적 단어 대신 "맥박(Pulse)", "고장까지 남은 골든타임", "~하고 있어요" 등 친근한 언어를 사용하여 심리적 허들을 없앱니다.
- **3-State Logic**: 수많은 데이터를 단순 분류하여 🟢 `정상 (Good)`, 🟡 `주의 (Warning)`, 🔴 `위험 (Danger)`으로 대시보드에서 1초 만에 파악 가능하도록 제공합니다.

### 🛠️ 4. 정밀 진단 및 피드백 루프 (Predictive Maintenance)
- **오탐지 튜닝**: "무시하기" 동작 수행 시 해당 피처를 False Positive로 학습하여 Otsu 민감도 파라미터를 자동 완화.
- **고장 예보 엔진 (72H Forecast)**: 가우시안 프로세스를 통한 고장 도달 확률 계산 및 부품(컴프레서/팬/밸브)에 대한 개별 시멘틱(원인) 분석 제공.

---

## 6. 기술 스택 요약 (Tech Specs)

```mermaid
mindmap
  root((SignalCraft<br/>Biz))
    Frontend (PWA)
      React (Vite)
      Tailwind CSS
      Toss-Style UI/UX
      Kakao / 알림 연동
    Backend (Engine)
      FastAPI (Python)
      Numba (연산 가속)
      Magi Algorithm
      Smart Trimming V5.7
    Database
      Supabase (PostgreSQL)
      Row Level Security
      TimeScaleDB Pattern (JSONB)
    Device & Infra
      ESP32 (C++)
      Google Cloud Run (asia-northeast3, BE)
      Vercel (FE 호스팅)
```

---

## 7. 업데이트 로드맵 (Milestones)

| Phase | Milestone | 상태 | 핵심 내용 |
| --- | --- | --- | --- |
| **Phase 1** | Backend Core | `완료` | FastAPI 구축, V5.7 엔진, Supabase 연결 완료 |
| **Phase 2** | Reporting Engine | `완료` | 배치 작업 스케줄링(일일 리포트), 트리거 알림 개발 |
| **Phase 3** | Frontend MVP | `완료` | React PWA 인터페이스 시안, FCM 알림 등록 |
| **Phase 4** | Test & Tuning | `완료` | 실환경 테스트 및 동적 Otsu 임계값, 학습 모드 조정 |
| **Phase 5** | Advanced UX | `완료` | 다크 모드, Toss 톤앤매너 텍스트 최적화 적용 |
| **Phase 6** | Notifications | `진행 중` | 카카오 알림 및 상세 설정(무시하기 피드백 포함) 고도화 확장 |
