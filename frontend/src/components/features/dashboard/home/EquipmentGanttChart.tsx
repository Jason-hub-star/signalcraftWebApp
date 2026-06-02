import { useMemo } from 'react';
import { colors, classTokens, cssVars } from '@/styles/tokens';
import { cn } from '@/lib/utils';
import type { EquipmentRunState, GanttSegment } from '@/lib/contracts/dashboardHome';

interface EquipmentGanttChartProps {
    segments: GanttSegment[];
    selectedMachineId: string;
    selectedMachineName?: string;
    periodLabel: string;
    periodStartAt: string;
    periodEndAt: string;
}

const STATE_FILL: Record<EquipmentRunState, string> = {
    RUNNING: colors.primary,
    OFF: colors.danger,
    ERROR: colors.warning,
    NO_DATA: 'transparent',
};

const STATE_LABEL: Record<EquipmentRunState, string> = {
    RUNNING: '가동',
    OFF: '정지',
    ERROR: '이상',
    NO_DATA: '데이터 없음',
};

const LEGEND_STATES: EquipmentRunState[] = ['RUNNING', 'OFF', 'ERROR', 'NO_DATA'];
const NO_DATA_PATTERN =
    'repeating-linear-gradient(45deg, var(--border) 0 2px, transparent 2px 7px)';

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

function formatDurationShort(ms: number): string {
    if (ms < HOUR_MS) return `${Math.max(1, Math.round(ms / 60000))}분`;
    if (ms < DAY_MS) return `${Math.floor(ms / HOUR_MS)}시간`;
    return `${Math.floor(ms / DAY_MS)}일`;
}

function buildAxisLabels(startMs: number, endMs: number): string[] {
    if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) return [];
    const span = endMs - startMs;
    const useHour = span < 48 * HOUR_MS;
    const formatter = new Intl.DateTimeFormat('ko-KR', useHour
        ? { hour: '2-digit', minute: '2-digit', hour12: false }
        : { month: 'numeric', day: 'numeric' });
    return [0, 0.25, 0.5, 0.75, 1].map((ratio) => formatter.format(new Date(startMs + span * ratio)));
}

export function EquipmentGanttChart({
    segments,
    selectedMachineId,
    selectedMachineName,
    periodLabel,
    periodStartAt,
    periodEndAt,
}: EquipmentGanttChartProps) {
    const startMs = new Date(periodStartAt).getTime();
    const endMs = new Date(periodEndAt).getTime();
    const totalMs = endMs - startMs;

    const visibleSegments = useMemo(() => {
        if (!(totalMs > 0)) return [];
        return segments
            .filter((segment) => segment.machineId === selectedMachineId)
            .map((segment) => {
                const segStart = Math.max(new Date(segment.startedAt).getTime(), startMs);
                const segEnd = Math.min(new Date(segment.endedAt).getTime(), endMs);
                const duration = segEnd - segStart;
                if (duration <= 0) return null;
                return {
                    ...segment,
                    leftPct: ((segStart - startMs) / totalMs) * 100,
                    widthPct: (duration / totalMs) * 100,
                    durationMs: duration,
                };
            })
            .filter((segment): segment is NonNullable<typeof segment> => segment !== null);
    }, [segments, selectedMachineId, startMs, endMs, totalMs]);

    const axisLabels = useMemo(() => buildAxisLabels(startMs, endMs), [startMs, endMs]);
    const isEmpty = visibleSegments.length === 0;

    return (
        <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-3">
                <h4 className={cn('text-sm font-bold tracking-tight', classTokens.text.primary)}>
                    {periodLabel} 가동 타임라인
                </h4>
                {selectedMachineName && (
                    <span className={cn('text-[11px] font-medium truncate', classTokens.text.muted)}>
                        {selectedMachineName}
                    </span>
                )}
            </div>

            <div className="relative">
                <div
                    role="img"
                    aria-label={`${selectedMachineName ?? '설비'} ${periodLabel} 가동 타임라인`}
                    className={cn('relative flex h-10 w-full overflow-hidden bg-muted border', classTokens.border.subtle)}
                    style={{ borderRadius: cssVars.radiusSm }}
                >
                    {isEmpty ? (
                        <div className={cn('flex w-full items-center justify-center text-[11px] font-medium', classTokens.text.muted)}>
                            기록된 가동 데이터가 없어요
                        </div>
                    ) : (
                        visibleSegments.map((segment) => {
                            const isNoData = segment.state === 'NO_DATA';
                            const showLabel = segment.widthPct >= 15;
                            return (
                                <div
                                    key={`${segment.machineId}-${segment.startedAt}-${segment.state}`}
                                    className="relative flex items-center justify-center text-[10px] font-bold text-white"
                                    style={{
                                        width: `${segment.widthPct}%`,
                                        backgroundColor: isNoData ? 'transparent' : STATE_FILL[segment.state],
                                        backgroundImage: isNoData ? NO_DATA_PATTERN : undefined,
                                    }}
                                    title={`${STATE_LABEL[segment.state]} · ${formatDurationShort(segment.durationMs)}`}
                                >
                                    {showLabel && (
                                        <span
                                            className={cn(
                                                'truncate px-1.5 whitespace-nowrap drop-shadow-sm',
                                                isNoData ? classTokens.text.muted : '',
                                            )}
                                        >
                                            {STATE_LABEL[segment.state]} {formatDurationShort(segment.durationMs)}
                                        </span>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="pointer-events-none absolute inset-0 grid grid-cols-4">
                    <div className="border-r border-white/40" />
                    <div className="border-r border-white/40" />
                    <div className="border-r border-white/40" />
                    <div />
                </div>

                <div className="pointer-events-none absolute right-0 -top-1 bottom-0 flex flex-col items-end">
                    <span
                        className={cn(
                            'mb-0.5 px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-sm',
                            classTokens.bg.brand,
                            classTokens.text.inverse,
                        )}
                    >
                        지금
                    </span>
                    <span className="block h-full border-r-2 border-dashed border-primary" />
                </div>
            </div>

            {axisLabels.length > 0 && (
                <div className={cn('grid grid-cols-5 text-[10px] font-medium', classTokens.text.muted)}>
                    {axisLabels.map((label, index) => (
                        <span
                            key={`${label}-${index}`}
                            className={cn(
                                index === 0 && 'text-left',
                                index === axisLabels.length - 1 && 'text-right',
                                index !== 0 && index !== axisLabels.length - 1 && 'text-center',
                            )}
                        >
                            {label}
                        </span>
                    ))}
                </div>
            )}

            <ul className={cn('flex flex-wrap gap-x-4 gap-y-1.5 pt-1 text-[11px] font-medium', classTokens.text.muted)}>
                {LEGEND_STATES.map((state) => (
                    <li key={state} className="flex items-center gap-1.5">
                        <span
                            aria-hidden
                            className="inline-block size-2.5"
                            style={{
                                backgroundColor: state === 'NO_DATA' ? 'transparent' : STATE_FILL[state],
                                backgroundImage: state === 'NO_DATA' ? NO_DATA_PATTERN : undefined,
                                border: state === 'NO_DATA' ? '1px solid var(--border)' : 'none',
                                borderRadius: '2px',
                            }}
                        />
                        {STATE_LABEL[state]}
                    </li>
                ))}
            </ul>
        </div>
    );
}
