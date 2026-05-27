# 2026-05-27 Session Log

## Scope
- Frontend dev-mode backend decoupling.
- Shared design token audit and first remediation pass.

## Changes
- Added `frontend/src/lib/api.ts` as the single frontend API gateway.
- Added `frontend/src/lib/mockApi.ts` with dev-mode mock responses for machines, dashboard summary, notifications, reports, smart logs, analysis, service tickets, and maintenance history.
- Mock data intentionally includes abnormal facility state: 1 DANGER, 1 WARNING, 1 GOOD.
- Added `frontend/src/lib/queryKeys.ts` and moved TanStack Query keys/invalidation calls to the shared `QUERY_KEYS` factory.
- Added `frontend/src/styles/tokens.ts` for imported chart, brand, effect, and CSS variable tokens.
- Replaced direct hardcoded chart/Kakao/header/export colors with shared tokens where non-Tailwind inline values were found.
- Added imported class-token maps for shared UI primitives and high-traffic dashboard status surfaces.
- Added semantic class-token maps for machine status, HACCP status, event types, maintenance actions, notifications, bottom nav, profile menu, forecast health, component score, and stat progress.
- Rewired core shared/status/report/machine surfaces to consume semantic class tokens instead of repeating state color branches in each component.
- Added Tailwind theme colors for Kakao tokens in `frontend/src/index.css`.
- Added `mobile-web-app-capable` meta tag to avoid the current PWA deprecation warning.
- Added `useElementSize` and replaced Recharts `ResponsiveContainer` in checked chart surfaces to avoid initial negative-size warnings.

## Design Token Audit
- Existing shared CSS tokens were already defined in `frontend/src/index.css` through Tailwind v4 `@theme`.
- Direct backend/API usage was scattered across feature components before this session.
- Direct design literals found in TS/TSX before remediation:
  - Kakao colors in `SettingsPage.tsx` and `ShareModal.tsx`
  - Recharts/SVG chart colors in `AnalysisTab.tsx`, `ReportPage.tsx`, and `AIInsightModal.tsx`
  - Frosted header background values in `Header.tsx` and `MachinePage.tsx`
  - Export background color in `exportUtils.ts`
- Hex/OKLCH/RGB literals in TS/TSX are centralized in `frontend/src/styles/tokens.ts`.
- Tailwind color utilities still exist in legacy page markup, but core UI primitives, status/brand/chart surfaces, reports, notifications, navigation, profile menu, and maintenance/event badges now import shared class tokens from `frontend/src/styles/tokens.ts`.

## Validation
- `npm install`
- `npm run build` passed after the final semantic token pass.
- Playwright smoke checked:
  - `/dashboard`: hero displays `즉시 점검이 필요한 설비가 있어요`, `위험 1건 / 주의 1건 감지`.
  - `/machines`: 3 mock machines render, including warning/error prediction copy.
  - `/report`: latest report and trend data render from mock API; Recharts negative-size warning cleared.
- Playwright rechecked `/dashboard` and `/report` after semantic tokenization; no console warnings or errors were reported.

## Notes
- Development mode uses mock API by default.
- Set `VITE_USE_MOCK_API=false` to force the configured backend during local development.
- Set `VITE_USE_MOCK_API=true` to force mock API in deployed preview/production builds while the backend is being swapped.
