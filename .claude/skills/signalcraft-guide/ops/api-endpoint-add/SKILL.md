---
name: api-endpoint-add
description: "새 API 엔드포인트 추가 — 새 API, 엔드포인트, 라우터 추가, endpoint, router"
---

## Trigger
사용자가 새 API 엔드포인트, 라우터, 서비스를 추가하려 할 때 활성화.

## Input Context
- 도메인명 (예: reports, devices, notifications)
- HTTP 메서드 + 경로
- 요청/응답 모델

## Read First
1. `backend/app/` 구조 — 기존 라우터/서비스 패턴 확인
2. `ai-context/coding-guideline.md` — Backend 규칙
3. `docs/ref/schema.md` — 관련 테이블 스키마

## Do (순서 엄수)
1. `backend/app/models/` — Pydantic 요청/응답 모델 정의
2. `backend/app/api/{domain}/router.py` — 라우터 엔드포인트 추가
3. `backend/app/services/{domain}.py` — 비즈니스 로직 구현 (필요 시)
4. 라우터를 `backend/app/main.py`에 등록 (미등록 시)
5. 소유권/권한 검증 로직 포함 (user_id 기반)
6. Frontend API 클라이언트 함수 추가 (`frontend/src/lib/api/`)
7. QUERY_KEYS 팩토리에 새 키 등록

## Do Not
1. 소유권 검증 없이 엔드포인트를 노출하지 않는다
2. Router에 비즈니스 로직을 직접 작성하지 않는다 (Service로 분리)
3. 기존 QUERY_KEYS 패턴을 무시하지 않는다

## Validation
- [ ] `python -m compileall app` — 컴파일 성공
- [ ] 소유권 검증 로직 포함 확인
- [ ] Router/Service 계층 분리 확인
- [ ] Frontend API 함수 + QUERY_KEYS 등록 확인

## Output Template
```
[api-endpoint-add 완료]
- 엔드포인트: {METHOD} /api/{path}
- 모델: {request/response model names}
- 서비스: {service file}
- FE API: {api client file}
- 소유권 검증: pass
- 빌드: pass
```
