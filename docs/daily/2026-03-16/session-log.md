# Session Log — 2026-03-16

## Scope
Supabase 프로젝트 전환 + 시드 데이터 대규모 보강

## 작업 내용

### 1. Supabase 프로젝트 전환
- 구 프로젝트 `zigwndnmxmxctcayeavx` → 신규 `zlcnanvidrjgpuugbcou` (signalcraft)
- `backend/.env`, `frontend/.env` 업데이트 완료
- Railway/Vercel 환경변수는 수동 변경 필요 (미완료)

### 2. 시드 데이터 보강 (`supabase/seed.sql`)
- `daily_reports`: 7기기 × 30일 = 210행 (상태별 health_score 분포)
- `incidents`: 12행 (ANOMALY/OVERLOAD/OFFLINE, DANGER/WARNING 기기 집중)
- `forecasts`: 7행 (기기별 golden_time — DANGER 3일, WARNING 12일, GOOD 42~60일)
- `machine_event_logs`: 870행 (최근 3일 ON/OFF/DEF/DOOR 이벤트)
- `notifications`: 6행 (alert/report/maintenance 타입)
- `maintenance_logs`: 기존 8 + 4행 추가 = 12행

### 3. 실행 방법
- Supabase CLI `db push` (migration으로 실행)
- 기존 migration history repair 후 push 성공

## 발견 사항
- `notifications` 테이블에 `type` CHECK 제약 존재 → 허용값: `alert`, `report`, `maintenance` (anomaly 아님)
- `incidents`, `machine_event_logs`, `forecasts` 테이블에 RLS SELECT 정책 미설정 → anon key로 읽기 불가

## Files Changed
- `backend/.env` — Supabase URL/KEY 변경
- `frontend/.env` — Supabase URL/KEY 변경
- `supabase/seed.sql` — 신규 생성
- `supabase/config.toml` — 기존 (변경 없음, 커밋 추가)
- `docs/status/PROJECT-STATUS.md` — 상태 갱신
- `docs/status/OPEN-ISSUES.md` — RLS/환경변수 이슈 추가
- `ai-context/master-plan.md` — 최근 완료 + 다음 우선순위 갱신
- `ai-context/project-context.md` — 배포 정보 갱신

## Next
1. Railway/Vercel 환경변수 수동 변경
2. RLS 정책 추가 (incidents, machine_event_logs, forecasts)
3. 프로덕션 배포 후 API 검증
