---
name: dashboard-feature-add
description: "대시보드 새 기능/화면 추가 — 대시보드, 카드 추가, 새 화면, 새 페이지, feature add"
---

## Trigger
사용자가 대시보드에 새 카드, 기능, 화면을 추가하려 할 때 활성화.

## Input Context
- 기능명/화면명
- UI 요구사항 (카드, 차트, 리스트 등)
- 데이터 소스 (어떤 API/테이블)

## Read First
1. `frontend/src/` 구조 — 기존 features/components 패턴
2. `ai-context/project-context.md` — UX 컨셉 (Toss-Style, 3-State Logic)
3. `ai-context/coding-guideline.md` — Frontend 규칙
4. `docs/ref/schema.md` — 관련 테이블

## Do (순서 엄수)
1. `frontend/src/features/{domain}/` — 기능 컴포넌트 생성
2. TanStack Query 훅 작성 (QUERY_KEYS 팩토리 사용)
3. UI는 Toss-Style 준수: 숫자 크게, 대화체, 3-State Color
4. Tailwind CSS v4 + Framer Motion 애니메이션
5. Lucide React 아이콘 사용 (외부 이미지 URL 금지)
6. 라우팅 필요 시 React Router 설정 추가
7. 반응형 레이아웃 확인

## Do Not
1. Math.random()이나 하드코딩 더미 데이터를 사용하지 않는다
2. 외부 이미지 URL (placehold.co 등)을 사용하지 않는다
3. QUERY_KEYS 팩토리를 우회하지 않는다
4. 기술 용어를 UI에 직접 노출하지 않는다 (인간 중심 비유 사용)

## Validation
- [ ] `npm run build` — 빌드 성공
- [ ] QUERY_KEYS 팩토리 사용 확인
- [ ] Toss-Style UI 가이드 준수
- [ ] 반응형 레이아웃 (모바일/데스크톱)

## Output Template
```
[dashboard-feature-add 완료]
- 기능: {feature name}
- 컴포넌트: {component files}
- 훅: {hook files}
- API 연동: {api/query key}
- UI 스타일: Toss-Style 준수
- 빌드: pass
```
