---
name: pre-commit-validate
description: "커밋 전 검증 실행 — pre-commit, 커밋, validate, 검증, build check, 빌드 확인"
---

## Trigger
사용자가 "commit", "커밋", "pre-commit", "검증"을 요청하거나, git commit을 생성하려 할 때 활성화.

## Input Context
없음 (모든 검증은 전역)

## Read First
1. 루트 `CLAUDE.md` — Execution Rules 섹션
2. `ai-context/coding-guideline.md` — 빌드 검증 섹션

## Do (순서 엄수)
1. `cd frontend && npm run build` — FE 빌드 성공 확인
2. `cd backend && python -m compileall app` — BE 컴파일 체크
3. `.env` 계열 파일이 staging에 포함되지 않았는지 확인
4. 모든 코드/문서가 UTF-8 + LF인지 확인
5. 변경된 API 엔드포인트가 있다면 소유권 검증 로직 포함 확인

## Do Not
1. 어떤 단계도 건너뛰지 않는다
2. 빌드 실패 상태로 커밋하지 않는다
3. `.env` 파일을 커밋하지 않는다
4. UTF-8이 아닌 인코딩의 파일을 커밋하지 않는다

## Validation
- [ ] `npm run build` — exit code 0
- [ ] `python -m compileall app` — exit code 0
- [ ] `.env` 파일 미포함 확인
- [ ] UTF-8 + LF 인코딩 확인
- [ ] API 소유권 검증 확인 (해당 시)

## Output Template
```
[pre-commit-validate 완료]
- FE 빌드: pass
- BE 컴파일: pass
- .env 체크: pass
- UTF-8 검증: pass
- API 소유권: {pass/N/A}
- 커밋 준비: OK
```
