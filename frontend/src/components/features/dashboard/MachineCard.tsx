import { useState } from 'react';
import { MoreHorizontal, Brain, Zap, AlertTriangle, CalendarClock, Trash2, Settings2, Snowflake, Thermometer, Wind, Box } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';

export interface Machine {
    id: string;
    name: string;
    location: string;
    status: 'running' | 'warning' | 'error';
    health: number;
    prediction: string;
    imageUrl: string;
    type: string;
}

interface MachineCardProps {
    machine: Machine;
    index: number;
    onClick?: (machine: Machine) => void;
    onManage?: (machine: Machine) => void;
    onDelete?: (id: string) => void;
}

export function MachineCard({ machine, index, onClick, onManage, onDelete }: MachineCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const getStatusVariant = (status: Machine['status']) => {
        if (status === 'running') return 'success';
        if (status === 'warning') return 'warning';
        return 'error';
    };

    const getStatusLabel = (status: Machine['status']) => {
        if (status === 'running') return '가동 중';
        if (status === 'warning') return '점검 필요';
        return '정지됨';
    };

    const PredictionIcon = machine.status === 'warning' ? AlertTriangle : machine.id.includes('2') ? CalendarClock : Brain;

    const getMachineIcon = (type: string) => {
        const t = type?.toUpperCase() || '';
        if (t.includes('FREEZER') || t.includes('BLAST')) return <Snowflake className="size-9 sm:size-10 text-blue-500" />;
        if (t.includes('REFRIGERATOR')) return <Thermometer className="size-9 sm:size-10 text-cyan-500" />;
        if (t.includes('SHOWCASE')) return <Wind className="size-9 sm:size-10 text-indigo-500" />;
        if (t.includes('COLD') || t.includes('STORAGE')) return <Box className="size-9 sm:size-10 text-slate-500" />;
        return <Snowflake className="size-9 sm:size-10 text-blue-500" />;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="px-2 sm:px-4 py-1.5 cursor-pointer relative"
        >
            <Card
                className="p-0 overflow-hidden border-slate-100 transition-shadow group relative"
                style={{ transitionDuration: 'var(--duration-normal)', transitionTimingFunction: 'var(--ease-out-quart)' }}
                onClick={() => onClick?.(machine)}
            >
                <div className="p-4 sm:p-5 flex gap-4 sm:gap-5 relative z-10">
                    <div
                        className="w-20 h-20 sm:w-22 sm:h-22 shrink-0 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 overflow-hidden flex items-center justify-center"
                        style={{ borderRadius: 'var(--radius-md)' }}
                    >
                        {getMachineIcon(machine.type)}
                    </div>

                    <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4
                                    className="text-[16px] sm:text-[17px] font-bold text-slate-900 leading-tight tracking-tight mb-0.5 group-hover:text-signal-blue transition-colors truncate"
                                    style={{ fontFamily: 'var(--font-heading)', transitionDuration: 'var(--duration-normal)' }}
                                >
                                    {machine.name}
                                </h4>
                                <p className="text-[12px] sm:text-[13px] text-slate-400 font-medium tracking-tight truncate">
                                    {machine.location}
                                </p>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsMenuOpen(!isMenuOpen);
                                    }}
                                    className="text-slate-300 p-2 hover:bg-slate-50 transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-2"
                                    style={{ borderRadius: 'var(--radius-md)' }}
                                    aria-label="설비 메뉴 열기"
                                >
                                    <MoreHorizontal size={20} />
                                </button>

                                <AnimatePresence>
                                    {isMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -8 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -8 }}
                                            transition={{ duration: 0.15, ease: [0.25, 1, 0.5, 1] }}
                                            className="absolute right-0 top-12 w-32 bg-white shadow-lg border border-slate-100 py-1.5 z-50 overflow-hidden"
                                            style={{ borderRadius: 'var(--radius-md)' }}
                                        >
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onManage?.(machine);
                                                    setIsMenuOpen(false);
                                                }}
                                                className="w-full px-4 py-2.5 flex items-center gap-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                                            >
                                                <Settings2 size={16} />
                                                관리
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDelete?.(machine.id);
                                                    setIsMenuOpen(false);
                                                }}
                                                className="w-full px-4 py-2.5 flex items-center gap-2 text-sm font-medium text-rose-500 hover:bg-rose-50 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                                삭제
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mt-auto">
                            <Badge variant={getStatusVariant(machine.status)}>
                                {getStatusLabel(machine.status)}
                            </Badge>

                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100"
                                style={{ borderRadius: 'var(--radius-sm)' }}
                            >
                                <Zap className={cn(
                                    "size-3.5",
                                    machine.health > 90 ? "text-signal-mint" : "text-signal-orange"
                                )} />
                                <span className="text-[12px] font-semibold text-slate-600">
                                    {machine.health}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className={cn(
                        "px-4 sm:px-5 py-3 sm:py-3.5 flex items-center gap-3 border-t border-slate-100",
                        machine.status === 'warning' ? "bg-red-50/50 text-signal-red" : "bg-slate-50/50 text-slate-600"
                    )}
                >
                    <div className={cn(
                        "p-2",
                        machine.status === 'warning' ? "bg-signal-red/10" : "bg-signal-blue/10"
                    )} style={{ borderRadius: 'var(--radius-sm)' }}>
                        <PredictionIcon className={cn(
                            "size-4",
                            machine.status === 'warning' ? "text-signal-red" : "text-signal-blue"
                        )} />
                    </div>
                    <p className="text-[13px] font-medium tracking-tight leading-snug">
                        {machine.prediction}
                    </p>
                </div>
            </Card>
        </motion.div>
    );
}
