# .claude/skills/

SignalCraft Biz skill assets for Claude Code interactive development.

## Structure
- `signalcraft-guide/` — 도메인 지식 기반 스킬 (pre-commit, api, dashboard)
- `meta/` — 문서 오케스트레이션 스킬 (sprint docs sync)

## Skill Format
- 모든 스킬은 `SKILL.md` (YAML front matter + 7 섹션)
- front matter: `name:`, `description:` (트리거 키워드 포함)
- 섹션: Trigger, Input Context, Read First, Do, Do Not, Validation, Output Template

## Automation Relationship
- Skills = 변경 시점에서 drift 방지 (preventive)
- Automations = 야간 drift 탐지 (detective)
- 상호 보완적 구조

## Full Inventory
| # | 스킬 | 트리거 키워드 | 경로 |
|---|------|-------------|------|
| 1 | **pre-commit-validate** | 커밋, pre-commit, 검증, build check | `signalcraft-guide/core/pre-commit-validate/` |
| 2 | **api-endpoint-add** | 새 API, 엔드포인트, 라우터 추가 | `signalcraft-guide/ops/api-endpoint-add/` |
| 3 | **dashboard-feature-add** | 대시보드 기능, 카드 추가, 새 화면 | `signalcraft-guide/ops/dashboard-feature-add/` |
| 4 | **sprint-docs-sync** | 문서 동기화, sprint docs | `meta/sprint-docs-sync/` |

## Legacy Skills (.agent/)
기존 `.agent/skills/`에 범용 참조 스킬이 유지됩니다:
- `auth-implementation-patterns` — 인증/인가 패턴
- `backend-development` — Backend 개발 참조 (14개 하위 문서)
- `react-best-practices` — React 개발 표준
- `react-vite-best-practices` — Vite + React 최적화 (45+ 파일)
- `supabase-postgres-best-practices` — DB 최적화
- `tanstack-query` — TanStack Query v5 패턴 (15+ 파일)
