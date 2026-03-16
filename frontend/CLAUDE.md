# frontend/

React 19 + Vite + Tailwind CSS v4 기반 PWA.

## Tech
- React 19, TypeScript, Vite
- Tailwind CSS v4, Framer Motion
- TanStack Query v5, Lucide React
- PWA (Service Worker, 오프라인 지원)

## 디렉토리 구조
```
src/
├── App.tsx              — 라우팅 + 레이아웃
├── main.tsx             — 엔트리포인트
├── components/
│   ├── features/        — 기능별 컴포넌트 (Backend 1:1 대응)
│   │   ├── dashboard/   — 대시보드 카드, 상태 표시
│   │   ├── machines/    — 설비 관리
│   │   ├── reports/     — 리포트 뷰어
│   │   └── settings/    — 알림/환경 설정
│   ├── shared/          — 공유 컴포넌트
│   └── ui/              — 기본 UI 컴포넌트
├── lib/
│   ├── utils/           — 유틸리티
│   └── usePWAInstall.ts — PWA 설치 훅
└── assets/              — 정적 리소스
```

## Rules
- Query Key는 `QUERY_KEYS` 팩토리만 사용
- mutation 후 무효화는 대상 key만 정밀 invalidation
- `components/features/`는 Backend `app/features/`와 1:1 대응
- 외부 이미지 URL 금지 → Lucide React 아이콘 사용
- UI 텍스트는 Toss-Style 대화체 ("~하고 있어요")

## Build & Dev
```bash
npm install
npm run dev      # 개발 서버 (port 5173)
npm run build    # 프로덕션 빌드
```

## Deployment
- Vercel (signalcraft-web-app.vercel.app)
- vercel.json: SPA rewrites 설정
