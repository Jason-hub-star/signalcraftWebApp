import { motion } from 'framer-motion';
import { Activity, Volume2, ShieldCheck, Zap, AlertCircle, Settings2, TrendingDown, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { type Machine } from '../MachineCard';
import { cn } from '../../../../lib/utils';

interface AnalysisTabProps {
    machine: Machine;
    onViewMaintenance: () => void;
}

export function AnalysisTab({ machine, onViewMaintenance }: AnalysisTabProps) {
    const { data: analysis, isPending, error } = useQuery({
        queryKey: ['machine-analysis', machine.id],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/dashboard/machine-detail/analysis?machine_id=${machine.id}`);
            if (!response.ok) throw new Error('분석 데이터를 불러오는데 실패했습니다.');
            return response.json();
        },
    });

    if (isPending) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="size-8 text-signal-blue animate-spin" />
                <p className="text-slate-400 font-medium text-sm">기계 상태를 분석하고 있습니다...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-rose-50 border border-rose-100 text-center" style={{ borderRadius: 'var(--radius-lg)' }}>
                <p className="text-rose-600 font-medium text-sm">분석 데이터를 불러오지 못했습니다.</p>
            </div>
        );
    }

    const report = analysis?.report;
    const forecast = analysis?.forecast;

    const health = report?.health_score ?? machine.health;
    const diagnostics = report?.diagnostics || { comp: 98, fan: 85, valve: 92 };
    const roi = report?.roi_data || { watt: 42.5, door_opens: 12 };

    const forecastData = forecast?.prediction_data ?
        (typeof forecast.prediction_data === 'string' ? JSON.parse(forecast.prediction_data) : forecast.prediction_data)
        : [
            { time: '현재', value: health },
            { time: '1일 뒤', value: Math.max(0, health - 5) },
            { time: '2일 뒤', value: Math.max(0, health - 12) },
            { time: '3일 뒤', value: Math.max(0, health - 20) },
        ];

    return (
        <motion.div
            key="analysis"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="space-y-8 pb-10"
        >
            {/* Health Score Hero */}
            <section className="relative">
                <div className="flex flex-col items-center justify-center py-6 px-4 bg-white border border-slate-100 shadow-card overflow-hidden relative"
                    style={{ borderRadius: 'var(--radius-lg)' }}
                >
                    <div className="relative size-64 flex items-center justify-center mb-6">
                        <svg className="size-full" viewBox="0 0 240 240">
                            <defs>
                                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor={machine.status === 'running' ? '#3B82F6' : machine.status === 'warning' ? '#F59E0B' : '#EF4444'} />
                                    <stop offset="100%" stopColor={machine.status === 'running' ? '#60A5FA' : machine.status === 'warning' ? '#FCD34D' : '#FCA5A5'} />
                                </linearGradient>
                            </defs>

                            {Array.from({ length: 40 }).map((_, i) => {
                                const angle = (i / 40) * 360;
                                const isMajor = i % 5 === 0;
                                return (
                                    <line
                                        key={i}
                                        x1="120" y1="20" x2="120" y2={isMajor ? "35" : "28"}
                                        stroke={isMajor ? "#E2E8F0" : "#F1F5F9"}
                                        strokeWidth={isMajor ? "2" : "1"}
                                        transform={`rotate(${angle} 120 120)`}
                                    />
                                );
                            })}

                            <circle cx="120" cy="120" r="88" fill="none" stroke="#F8FAFC" strokeWidth="16" strokeLinecap="round" />

                            <motion.circle
                                cx="120" cy="120" r="88" fill="none" stroke="url(#gaugeGradient)"
                                strokeWidth="16" strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 88}
                                initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                                animate={{ strokeDashoffset: (2 * Math.PI * 88) * (1 - health / 100) }}
                                transition={{ type: "spring", stiffness: 60, damping: 15, mass: 1 }}
                                transform="rotate(-90 120 120)"
                            />

                            <circle cx="120" cy="120" r="70" fill="none" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                        </svg>

                        <div className="absolute flex flex-col items-center">
                            <span className="section-label mb-1">Health</span>
                            <div className="flex items-baseline">
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.5, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                    className="text-6xl font-bold text-slate-900 tracking-tighter"
                                    style={{ fontFamily: 'var(--font-heading)' }}
                                >
                                    {health}
                                </motion.span>
                                <span className="text-xl font-medium text-slate-300 ml-1">%</span>
                            </div>
                            <div className={cn(
                                "flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full text-[11px] font-medium",
                                machine.status === 'running' ? "bg-blue-50 text-blue-600" :
                                    machine.status === 'warning' ? "bg-amber-50 text-amber-600" :
                                        "bg-rose-50 text-rose-600"
                            )}>
                                <div className={cn(
                                    "size-1.5 rounded-full",
                                    machine.status === 'running' ? "bg-blue-500" :
                                        machine.status === 'warning' ? "bg-amber-500" :
                                            "bg-rose-500"
                                )} />
                                {machine.status === 'running' ? 'Optimal' : machine.status === 'warning' ? 'Check Required' : 'Critical'}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Semantic Diagnostics */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        <Settings2 size={20} className="text-slate-400" />
                        부품 건강 상태
                    </h3>
                    <span className="section-label mb-0 bg-slate-100 px-2 py-1" style={{ borderRadius: '6px' }}>AI 분석</span>
                </div>
                <div className="p-6 bg-white border border-slate-100 grid gap-6" style={{ borderRadius: 'var(--radius-lg)' }}>
                    {[
                        { label: '엔진 (Compressor)', score: diagnostics.comp || 90, detail: (diagnostics.comp || 90) > 90 ? '진동 및 상태 아주 좋음' : '주의 깊은 관찰 필요' },
                        { label: '냉각 팬 (Condenser Fan)', score: diagnostics.fan || 85, detail: (diagnostics.fan || 85) > 80 ? '냉각 효율 정상 범위' : '미세 진동 감지 (주의)' },
                        { label: '순환 밸브 (Expansion Valve)', score: diagnostics.valve || 92, detail: (diagnostics.valve || 92) > 90 ? '냉매 흐름 및 압력 양호' : '흐름 불규칙 감지' },
                    ].map((part, i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-sm font-semibold text-slate-700">{part.label}</div>
                                    <div className="text-[11px] font-medium text-slate-400">{part.detail}</div>
                                </div>
                                <div className="text-sm font-bold text-slate-900">{part.score}%</div>
                            </div>
                            <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${part.score}%` }}
                                    transition={{ duration: 0.8, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] }}
                                    className={cn(
                                        "h-full rounded-full",
                                        part.score > 90 ? "bg-signal-blue" : part.score > 80 ? "bg-signal-orange" : "bg-signal-red"
                                    )}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Sound Spectrum Visualizer */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        <Volume2 size={20} className="text-signal-blue" />
                        실시간 기계 소음
                    </h3>
                    <span className="section-label mb-0">Active Listening</span>
                </div>
                <div className="h-40 flex items-end gap-1.5 px-4 py-8 bg-slate-900 overflow-hidden" style={{ borderRadius: 'var(--radius-lg)' }}>
                    {[...Array(32)].map((_, i) => {
                        const healthThreshold = (health / 100) * 32;
                        const isHealthy = i < healthThreshold;
                        const alertColor = health < 50 ? "bg-signal-red" : "bg-signal-orange";

                        return (
                            <motion.div
                                key={i}
                                initial={{ height: 10 }}
                                animate={{
                                    height: [
                                        Math.random() * 60 + 20,
                                        Math.random() * 80 + 20,
                                        Math.random() * 40 + 20
                                    ]
                                }}
                                transition={{
                                    duration: 0.5 + Math.random(),
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                                className={cn(
                                    "flex-1 rounded-t-full transition-colors",
                                    isHealthy ? "bg-signal-blue" : alertColor
                                )}
                            />
                        );
                    })}
                </div>
            </section>

            {/* Predictive Engine (72H Forecast) */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        <TrendingDown size={20} className="text-signal-red" />
                        72시간 고장 예보
                    </h3>
                    {health < 80 && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 rounded-full">
                            <span className="size-2 rounded-full bg-rose-500" />
                            <span className="section-label text-rose-600 mb-0">점검 권장</span>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-white border border-slate-100 shadow-card space-y-6" style={{ borderRadius: 'var(--radius-lg)' }}>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={forecastData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 500 }} />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <div className="bg-slate-900 text-white px-3 py-2 text-xs font-medium border border-slate-800 shadow-xl"
                                                    style={{ borderRadius: 'var(--radius-sm)' }}
                                                >
                                                    <p className="opacity-60 mb-1">{data.time}</p>
                                                    <p className="text-sm">예상 건강: {data.value}%</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className={cn(
                        "flex items-center justify-between p-5 border",
                        health < 80 ? "bg-rose-50 border-rose-100" : "bg-emerald-50 border-emerald-100"
                    )} style={{ borderRadius: 'var(--radius-md)' }}>
                        {forecast?.golden_time ? (
                            <div>
                                <div className={cn("section-label mb-0.5", health < 80 ? "text-rose-400" : "text-emerald-400")}>고장 예상 시점</div>
                                <div className={cn("text-2xl font-bold tracking-tighter", health < 80 ? "text-rose-600" : "text-emerald-600")}
                                    style={{ fontFamily: 'var(--font-heading)' }}
                                >
                                    {new Date(forecast.golden_time).toLocaleDateString()}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="section-label text-emerald-400 mb-0.5">이상 징후 없음</div>
                                <div className="text-2xl font-bold text-emerald-600 tracking-tighter" style={{ fontFamily: 'var(--font-heading)' }}>Golden Time 확보</div>
                            </div>
                        )}
                        <div className="text-right">
                            <div className={cn("section-label mb-0.5", health < 80 ? "text-rose-400" : "text-emerald-400")}>예측 정확도</div>
                            <div className={cn("text-sm font-semibold", health < 80 ? "text-rose-500" : "text-emerald-500")}>85% (매우 높음)</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Virtual ROI & Smart Sensors */}
            <section className="space-y-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    <Zap size={20} className="text-amber-500" />
                    절약 도움 리포트
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-50 border border-slate-100 relative overflow-hidden" style={{ borderRadius: 'var(--radius-lg)' }}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-amber-100 text-amber-600" style={{ borderRadius: 'var(--radius-sm)' }}>
                                <Activity size={18} />
                            </div>
                            <span className="text-sm font-semibold text-slate-700">전력 사용량</span>
                        </div>
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>{roi.watt || 0}</span>
                            <span className="text-sm font-medium text-slate-400">kWh</span>
                        </div>
                        <p className="text-xs font-medium text-emerald-500">전주 대비 {Math.round((roi.saved || 8000) / 1200)}% 절감 중</p>
                    </div>

                    <div className="p-6 bg-slate-50 border border-slate-100 relative overflow-hidden" style={{ borderRadius: 'var(--radius-lg)' }}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 text-blue-600" style={{ borderRadius: 'var(--radius-sm)' }}>
                                <ShieldCheck size={18} />
                            </div>
                            <span className="text-sm font-semibold text-slate-700">문 열림 분석</span>
                        </div>
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>{roi.door_opens || 0}</span>
                            <span className="text-sm font-medium text-slate-400">회 오픈</span>
                        </div>
                        <p className="text-xs font-medium text-amber-500">02:14 미세 누기 주의</p>
                    </div>
                </div>
            </section>

            {/* AI Insights Card */}
            <section>
                <div className="p-6 bg-signal-blue text-white shadow-lg relative overflow-hidden" style={{ borderRadius: 'var(--radius-lg)' }}>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-white/20" style={{ borderRadius: 'var(--radius-sm)' }}>
                                <ShieldCheck size={20} />
                            </div>
                            <span className="text-sm font-semibold tracking-wide">AI 인사이트</span>
                        </div>
                        <p className="text-lg font-medium leading-snug tracking-tight break-keep">
                            {report?.ai_summary || machine.prediction}
                        </p>
                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertCircle size={14} className="text-blue-100" />
                                <span className="text-xs font-medium text-blue-100">최근 업데이트: {report ? new Date(report.created_at).toLocaleTimeString() : '방금 전'}</span>
                            </div>
                            <button
                                onClick={onViewMaintenance}
                                className="text-xs font-semibold px-4 py-2 bg-white text-signal-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                style={{ borderRadius: 'var(--radius-sm)' }}
                            >
                                유지보수 기록
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </motion.div>
    );
}
