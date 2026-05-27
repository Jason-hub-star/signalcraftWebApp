# 2026-05-27 Session Log

## Scope
- Frontend dev-mode backend decoupling.
- Shared design token audit and first remediation pass.
- Brand logo asset application.
- Raven Materials customer-specific mock scenario centralization.

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
- Applied the provided logo asset to the top-left header brand mark and updated favicon/apple-touch icon assets.
- Audited the provided `icon_svg.zip` set for potential future replacements: dashboard, dns/server, finance/report, help, precision manufacturing, sensors, and settings.
- Applied the first `icon_svg.zip` replacement pass to bottom navigation, dashboard quick report/settings actions, and the settings help item.
- Added `frontend/src/lib/mockScenario.ts` as the single source of truth for Raven Materials mock copy/data.
- Replaced scattered refrigeration/showcase demo text with Raven Materials Black TiO2/photocatalyst process mock data across machines, notifications, reports, AI insight, profile copy, analysis, and smart logs.
- Raven mock data intentionally displays abnormal facility state: 1 DANGER, 2 WARNING, 2 GOOD.

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
- Playwright checked `/dashboard` after logo application; header logo renders and no console warnings/errors were reported.
- `npm run build` passed after the first icon replacement pass.
- `npm run build` passed after Raven Materials mock scenario centralization.

## Notes
- Mock API is enabled by default while the backend is being swapped.
- Set `VITE_USE_MOCK_API=false` to force the configured backend after the replacement backend is ready.
