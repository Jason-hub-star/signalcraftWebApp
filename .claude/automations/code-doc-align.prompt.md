# code-doc-align - code and docs integrity check

## Meta
- Task: SignalCraft Biz code-to-doc integrity scan
- Schedule: 평일 10:30 (Asia/Seoul)
- Role: Detect drift between implemented features and status documentation, then report it
- Project root: `C:\Users\ezen601\Desktop\Jason\signalcraftapp`

## Source of Truth
- Code truth:
  - `frontend/src/` — 기능 컴포넌트/페이지
  - `backend/app/api/` — API 라우터
  - `backend/app/services/` — 비즈니스 로직
- Board and status docs:
  - `docs/status/PROJECT-STATUS.md`
  - `docs/status/OPEN-ISSUES.md`
- Local rule chain:
  - `CLAUDE.md`
  - `docs/CLAUDE.md`
  - `docs/status/CLAUDE.md`

## Lock
- Lock file: `docs/status/.code-doc-align.lock`
- On start write `{"status":"running","started_at":"<ISO>"}`
- On finish write `{"status":"released","released_at":"<ISO>"}`
- If lock is already `running`, exit immediately

## Procedure

### Step 1 - Collect feature facts
1. Parse frontend pages/components from `frontend/src/`.
2. Parse backend API routes from `backend/app/api/`.
3. Parse `PROJECT-STATUS.md` feature table.
4. Parse `OPEN-ISSUES.md` issue list.

### Step 2 - Compare
1. `UNTRACKED_FEATURE = implemented features not in PROJECT-STATUS`
2. `ORPHAN_STATUS = PROJECT-STATUS entries with no corresponding code`
3. `RESOLVED_ISSUE = OPEN-ISSUES entries that are actually resolved in code`

### Step 3 - Report
1. If `DRY_RUN=true`, print report body only.
2. Otherwise write `docs/status/INTEGRITY-REPORT.md` with:
   - summary counts
   - drift item lists

### Step 4 - Release
1. Release the lock file.

## Must Not
- Do not edit `frontend/src/` or `backend/app/`.
- Do not auto-change status entries.
- Only report drift unless explicitly upgraded to write mode.

## DRY_RUN=true
- Print report content only.
- Final line: `[DRY_RUN] no files changed`
