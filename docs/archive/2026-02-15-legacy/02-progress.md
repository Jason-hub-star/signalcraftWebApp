# Progress

Last Updated: 2026-02-15

## 2026-02-15

### Backend Fly.io 마이그레이션
- 변경: Backend 호스팅을 Render에서 Fly.io로 마이그레이션 완료.
- 이유: Render 무료 티어의 cold start 지연 해결, 도쿄(nrt) 리전으로 한국 사용자 응답 속도 개선.
- 검증: `https://signalcraft-api.fly.dev/` health check 성공, 전 API 엔드포인트 정상 응답
- 영향: Dockerfile, fly.toml, .dockerignore 생성. Fly.io secrets 설정. 2대 머신 HA 구성.

### 공모전 데이터 품질 개선
- 변경: DB 시드 데이터 전면 보강 + Backend/Frontend 로직 수정.
- 이유: 공모전 심사위원 시연 시 데이터 신뢰도 확보.
- 검증: 7기기 모두 오늘 날짜 리포트, 개별 health 점수(23~98), 고유 diagnostics
- 영향:
  - devices: 한국어 기기명, model_type, location_info 추가 (7기기)
  - daily_reports: diagnostics 숫자 포맷 전환 + 2/5~2/15 신규 77행 삽입 (총 133행)
  - forecasts: prediction_data 7포인트 12시간 간격으로 보강
  - Backend: health 점수를 daily_reports 실제값 사용, location 실제값 사용
  - Frontend: placehold.co → Lucide 아이콘 교체, Math.random() ROI% 제거

### 알림시스템 연동
- 변경: 알림 설정 UI와 Backend API 연동 완료.
- 이유: 사용자별 알림 환경설정(푸시, 카카오톡, 이상 징후, 리포트) 저장/조회 필요.
- 검증: Commit `6018141`
- 영향: notification_settings 테이블 연동, TanStack Query 캐시 관리

### 날짜 설정오류 수정
- 변경: 날짜 관련 버그 수정.
- 이유: 날짜 설정에서 발생하는 오류 해결.
- 검증: Commit `e2bedbe`
- 영향: 날짜 관련 기능 정상 작동

### 오류수정
- 변경: 일반 버그 수정.
- 이유: 발견된 오류들 일괄 수정.
- 검증: Commit `0ef6b3b`
- 영향: 전반적 안정성 향상

### 유지보수 이력관리
- 변경: 유지보수 기록 입력/조회 기능 구현.
- 이유: 설비 유지보수 이력을 체계적으로 관리하여 AI 예지보전의 근거 데이터로 활용.
- 검증: Commit `22c183f`
- 영향:
  - MaintenanceRecordModal 구현
  - maintenance_logs 테이블 RLS 설정
  - 타임라인 형태의 이력 시각화

### 대시보드 카드 조절
- 변경: 설비 카드 UI 최적화.
- 이유: 대시보드 카드 레이아웃 및 디자인 개선.
- 검증: Commit `1f7e484`
- 영향: 대시보드 가독성 향상

## 2026-02-14 이전 (요약)

### Phase 21: Notification System & Preferences
- Granular Notification UI 구현
- Backend Settings API (GET/POST) 구축
- notification_settings 테이블 생성
- TanStack Query 도입

### Phase 20: Maintenance Record & History Management
- MaintenanceRecordModal 구현
- RLS Policy 설정
- History Timeline 시각화
- Component Refactoring

### Phase 18: Cloud Deployment (Backend)
- Render 배포 → Fly.io 마이그레이션 완료
- Environment 동기화
- CORS 설정

### Phase 17: Advanced Sharing & Reporting
- PDF/이미지 내보내기
- Smart Slicing
- Clipboard Sharing

### Phase 14: Dashboard & Infrastructure Integration
- Supabase 기기 상태 연동
- TanStack Query 전환
- Database Seeding

### Phase 12: Database V2 & Data Migration
- Schema V2 적용 (5개 핵심 테이블)
- Super Account 생성
- Legacy Migration (1,456건)

### Phase 1~11: Foundation (완료)
- Vite + React + TypeScript 환경 구축
- Atomic Design 기반 UI 컴포넌트
- Dashboard, Report, Settings 페이지
- PWA Foundation & Install UI
- Backend FastAPI 구조 설계
- Vercel/Fly.io 배포 파이프라인
