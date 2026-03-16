# SignalCraft Biz Master Plan

기준일: 2026-03-16 (KST)
프로젝트: SignalCraft Biz — 무설정 AI 시설 관리 솔루션
협업 문서 경로: `ai-context`

## 1) 현재 상태
- 현재 단계: **Phase 6 (Notifications) 진행 중**
- 배포 상태: FE(Vercel) + BE(Railway) 운영 중
- 제품 상태: 대시보드/리포트/알림설정/유지보수이력 구현 완료

## 2) 문서 우선순위
1. `ai-context/START-HERE.md`
2. `ai-context/master-plan.md`
3. `ai-context/project-context.md`
4. `ai-context/coding-guideline.md`
5. `docs/status/PROJECT-STATUS.md` (최신 상태)
6. `docs/ref/architecture-diagrams.md` (구조 확인)

## 3) 완료된 Phase

| Phase | Milestone | 상태 | 핵심 내용 |
|-------|-----------|------|----------|
| Phase 1 | Backend Core | 완료 | FastAPI 구축, V5.7 엔진, Supabase 연결 |
| Phase 2 | Reporting Engine | 완료 | 배치 작업 스케줄링(일일 리포트), 트리거 알림 |
| Phase 3 | Frontend MVP | 완료 | React PWA, FCM 알림 등록 |
| Phase 4 | Test & Tuning | 완료 | 실환경 테스트, 동적 Otsu 임계값 |
| Phase 5 | Advanced UX | 완료 | 다크 모드, Toss 톤앤매너 |
| Phase 6 | Notifications | 진행 중 | 알림 상세 설정 UI/API, 카카오톡 알림 |

## 4) 최근 완료 항목 (2026-02-15)
- 알림시스템 연동 (설정 UI + Backend API)
- 날짜 설정오류 수정
- 일반 버그 수정
- 유지보수 이력관리 (입력/조회/타임라인)
- 대시보드 카드 UI 최적화
- Backend Fly.io → Railway 마이그레이션

## 5) 다음 우선순위
1. Production 배포 검증 (알림시스템, 유지보수 이력)
2. FCM 푸시 알림 실제 발송 테스트
3. Backend API 안정성 점검
4. 리포트 공유 기능 안정화
5. Frontend E2E 자동화 (Playwright)
6. 다크 모드 구현

## 6) 운영 규칙
- 작업 중에는 `docs/daily/YYYY-MM-DD/` 중심 갱신
- 핵심 흐름 변경 시 본 파일 + status 동기화
- 완료된 상세 로그는 `ai-context/archive/YYYY-MM-DD/`에 보관
