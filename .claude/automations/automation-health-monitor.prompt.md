# automation-health-monitor - health summary

## Meta
- Task: SignalCraft Biz automation health check
- Schedule: 평일 11:30 (Asia/Seoul)
- Role: Summarize automation run health and skill status
- Project root: `C:\Users\ezen601\Desktop\Jason\signalcraftapp`

## Source of Truth
- Automation prompts: `.claude/automations/*.prompt.md`
- Skill files: `.claude/skills/**/SKILL.md`
- Status docs: `docs/status/`
- Lock files: `docs/status/.*.lock`

## Procedure

### Step 1 - Check automation locks
1. Scan `docs/status/.*.lock` files.
2. Report any stuck locks (running > 2 hours).

### Step 2 - Verify skill inventory
1. Parse `.claude/skills/CLAUDE.md` inventory table.
2. Verify each listed skill has a valid `SKILL.md` file.
3. Report missing or malformed skills.

### Step 3 - Status doc freshness
1. Check `PROJECT-STATUS.md` last updated date.
2. Check `OPEN-ISSUES.md` last updated date.
3. Flag docs not updated in 7+ days.

### Step 4 - Report
1. Write summary to `docs/status/AUTOMATION-HEALTH.md`.
2. Append timestamped entry to `docs/status/AUTOMATION-HEALTH-HISTORY.ndjson`.

## Output Template
```
[automation-health-monitor 완료] YYYY-MM-DD HH:mm
- stuck_locks: {count}
- skill_integrity: {pass/fail} ({n}/{total})
- stale_docs: {count}
- overall: {healthy/needs-attention}
```
