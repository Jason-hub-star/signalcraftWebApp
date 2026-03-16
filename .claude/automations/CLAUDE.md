# automations/

SignalCraft Biz automation prompt index for deterministic documentation and status maintenance.

## Principles
- Keep every automation deterministic and idempotent.
- State exact source-of-truth files before comparing or reporting.
- Use lock files to avoid duplicate runs.
- Do not edit `frontend/src/` or `backend/app/` from automation prompts.
- Default to `DRY_RUN=true` and require deliberate promotion to write mode.

## Prompt Files
| File | Purpose | Schedule |
|---|---|---|
| `code-doc-align.prompt.md` | Check code/docs alignment and drift. | 평일 10:30 KST |
| `automation-health-monitor.prompt.md` | Summarize automation run health. | 평일 11:30 KST |
| `docs-nightly-organizer.prompt.md` | Organize daily logs, weekly rollup. | 평일 22:00 KST |

## Execution Order
```text
10:30 code-doc-align
11:30 automation-health-monitor
22:00 docs-nightly-organizer
```
