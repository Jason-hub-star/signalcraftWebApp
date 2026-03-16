# 프로젝트 컨텍스트 (SignalCraft Biz)

기준일: 2026-03-16 (KST)
프로젝트명: SignalCraft Biz
현재 단계: Phase 6 (Notifications) 진행 중

## 1) 한 줄 정의
설치 후 전원만 켜면 AI가 24시간 환경을 학습하고, 매일 아침 영수증 형태의 요약 리포트를 제공하는 무설정 AI 시설 관리 솔루션.

## 2) 왜 만드는가
- 기존 산업용 모니터링 툴은 비전문가가 사용하기 어려움
- 무인 매장/공장 관리자는 "지금 기계가 잘 돌고 있나?"에 대한 간결한 답이 필요
- 실시간 그래프보다 요약된 결론과 행동 제안이 필요

## 3) 대상 사용자
- 무인 아이스크림 매장 점주
- 소규모 공장 관리자
- 비전문가 시설 운영자

## 4) 핵심 UX 컨셉
1. **Zero Config**: QR 스캔 → 24시간 자동 학습 → 알림 시작
2. **AI 리포트**: 매일 아침 영수증 형태의 자동 브리핑
3. **Toss-Style UI**: 3-State Logic (정상/주의/위험), 인간 중심 비유 (맥박, 골든타임)
4. **예지 보전**: 72H 고장 예보, 부품별 시멘틱 진단

## 5) 시스템 개요
- Frontend: React 19 + Vite + Tailwind CSS v4 (PWA)
- Backend: FastAPI + Numba (Python 3.x)
- DB: Supabase PostgreSQL (RLS 활성화)
- Device: ESP32 (10초 주기 데이터 전송)
- 흐름: ESP32 → Supabase → FastAPI (분석) → React PWA (대시보드/리포트)

## 6) 주요 화면
- 홈 대시보드: 카드형 설비 상태 (3-State Logic)
- 일간 리포트: 영수증 형태 요약
- 알림 설정: 푸시/카카오톡 상세 설정
- 유지보수 이력: 타임라인 형태 관리
- 정밀 진단: EHI 점수, 72H Forecast, 골든타임 카운트다운

## 7) 핵심 분석 엔진
- **Magi (Robust Goertzel)**: 60Hz, 120Hz, 180Hz 대역 에너지 추출
- **Smart Trimming V5.7**: 노이즈/가동 구간 분리
- **Auto Threshold (Otsu)**: 동적 임계값 결정
- **가우시안 프로세스**: 72H 고장 예보

## 8) 핵심 도메인 모델
- Device: id, user_id, external_id, name, status, config
- Telemetry Log: device_id, features(jsonb), state_token, captured_at
- Daily Report: report_date, device_id, health_score, ai_summary, diagnostics
- Incident: device_id, type, severity, user_feedback
- Forecast: device_id, prediction_data, golden_time

## 9) API 기준 (현재 구현)
- Devices: CRUD + 상태 조회
- Reports: 일간/주간 리포트 조회
- Notifications: 알림 설정 GET/POST
- Maintenance: 유지보수 이력 CRUD
- Health: 서버 상태 체크

## 10) 배포 정보
- Frontend: Vercel (signalcraft-web-app.vercel.app)
- Backend: Railway (signalcraft-api)
- Database: Supabase

## 11) 비기능/운영 원칙
- mutation 후 무효화는 대상 key만 정밀 invalidation
- 모든 엔드포인트는 소유권/권한 검증 포함
- `app/features/` 디렉토리는 Frontend 기능 구조와 1:1 대응
- 문서 기준 충돌 시 `docs/status/PROJECT-STATUS.md` 우선 확인

## 12) 참조 문서
- 프로젝트 현황: `docs/status/PROJECT-STATUS.md`
- 제품 요구사항: `docs/ref/PRD.md`
- DB 스키마: `docs/ref/schema.md`
- 마스터 플랜: `ai-context/master-plan.md`
