# Progress Archive

누적 진행 기록. 기존 `docs/02-progress.md`에서 이전.

## 2026-02-15

### Backend Fly.io 마이그레이션
- 변경: Backend 호스팅을 Render에서 Fly.io로 마이그레이션 완료.
- 이유: Render 무료 티어의 cold start 지연 해결, 도쿄(nrt) 리전으로 한국 사용자 응답 속도 개선.
- 검증: health check 성공, 전 API 엔드포인트 정상 응답
- 영향: Dockerfile, fly.toml, .dockerignore 생성. 2대 머신 HA 구성.

### 공모전 데이터 품질 개선
- 변경: DB 시드 데이터 전면 보강 + Backend/Frontend 로직 수정.
- 이유: 공모전 심사위원 시연 시 데이터 신뢰도 확보.
- 영향: devices 7기기, daily_reports 133행, forecasts 보강, Lucide 아이콘 교체

### 알림시스템 연동
- 변경: 알림 설정 UI와 Backend API 연동 완료. Commit: `6018141`

### 날짜 설정오류 수정
- 변경: 날짜 관련 버그 수정. Commit: `e2bedbe`

### 유지보수 이력관리
- 변경: 유지보수 기록 입력/조회 기능 구현. Commit: `22c183f`
- 영향: MaintenanceRecordModal, maintenance_logs RLS, 타임라인 시각화

### 대시보드 카드 조절
- 변경: 설비 카드 UI 최적화. Commit: `1f7e484`

## 2026-02-14 이전 (요약)

| Phase | 내용 |
|-------|------|
| Phase 21 | Notification System & Preferences |
| Phase 20 | Maintenance Record & History Management |
| Phase 18 | Cloud Deployment (Render → Fly.io) |
| Phase 17 | Advanced Sharing & Reporting (PDF/이미지) |
| Phase 14 | Dashboard & Infrastructure Integration |
| Phase 12 | Database V2 & Data Migration (5개 테이블, 1,456건) |
| Phase 1~11 | Foundation (Vite+React+TS, Atomic Design, PWA, FastAPI, Vercel/Fly.io) |
