# [Archived] Backend Railway Residue

> **Archived on 2026-06-08** — 본 레포 `backend/` 디렉토리는 2026-06-05부로 DEPRECATED 처리되어 Google Cloud Run 외부 서비스로 이관 완료.
> 활성 백엔드 스펙은 `docs/ref/cloud-run-api-spec.md` 를 참조.

## 보존 사유
- 본 레포 `backend/` 코드 (구 Railway FastAPI)는 rollback 대비로 잔존 중이지만, 신규 작업/호출 금지.
- 이전 문서에 흩어져 있던 Railway 관련 설명을 한곳에 모아 활성 문서의 가독성을 보존.
- 회귀 시 "Railway 시절 도메인/엔드포인트가 어떻게 연결되어 있었는지" 확인용.

## Railway 시절 배경
- 구 백엔드: 본 레포 `backend/` (FastAPI, Railway 배포)
- 본 레포에 백엔드 코드와 프론트엔드 코드가 한 monorepo로 묶여 있었으나, 운영 부담과 도메인 격리를 위해 외부 Cloud Run 서비스로 이관.
- DB는 그대로 Supabase 사용.

## 이관 후 경계
- **활성 백엔드**: 외부 Google Cloud Run (asia-northeast3) FastAPI 서비스 — 본 레포에서 관리하지 않음.
- **본 레포 `backend/`**: rollback 대비 잔존, 신규 작업 금지.
- **본 레포 `frontend/`**: 외부 staging API 호출 (`https://v1.api.stag.serving.signalcraft.kr`).

## 잔재 검색 방법
- `backend/` 디렉토리 자체는 git 히스토리에 그대로 남음.
- 활성 문서에서 "Railway" 또는 "구 mock URL" 단어 잔재가 발견되면 본 archive 파일을 참조하도록 링크 처리.

## 관련 활성 문서
- `docs/ref/cloud-run-api-spec.md` — 활성 백엔드 스펙
- `docs/ref/cloud-run-frontend-deployment.md` — FE Cloud Run 이전 가이드
- `CLAUDE.md` (root) — `backend/` DEPRECATED 경계 명시
- `docs/archive/2026-06-08/cloud-run-mock-spec.md` — 구 mock URL 시절 메모
