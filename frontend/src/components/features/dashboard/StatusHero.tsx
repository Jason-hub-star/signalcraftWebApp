import { useState } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { AIInsightModal } from '../reports/AIInsightModal';
import { classTokens, cssVars } from '@/styles/tokens';
import { cn } from '@/lib/utils';

const containerVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.15
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] }
    }
};

interface DashboardSummary {
    GOOD: number;
    WARNING: number;
    DANGER: number;
}

interface StatusHeroProps {
    summary?: DashboardSummary;
    isLoading?: boolean;
}

export function StatusHero({ summary, isLoading }: StatusHeroProps) {
    const [isInsightOpen, setIsInsightOpen] = useState(false);

    const hasDanger = (summary?.DANGER || 0) > 0;
    const hasWarning = (summary?.WARNING || 0) > 0;

    const getStatusInfo = () => {
        if (isLoading) {
            return {
                title: "설비 상태를\n확인하는 중입니다",
                subtitle: "잠시만 기다려 주세요...",
                color: classTokens.gradient.loading,
                icon: <Loader2 className="size-10 text-white animate-spin" />,
                isInitial: true
            };
        }
        if (hasDanger) {
            return {
                title: "즉시 점검이 필요한\n설비가 있어요",
                subtitle: `위험 ${summary?.DANGER}건 / 주의 ${summary?.WARNING}건 감지`,
                color: classTokens.gradient.danger,
                icon: <AlertCircle className="size-10 text-white" />
            };
        }
        if (hasWarning) {
            return {
                title: "설비 상태를\n확인해 주세요",
                subtitle: `주의 ${summary?.WARNING}건이 발생했어요`,
                color: classTokens.gradient.warning,
                icon: <AlertTriangle className="size-10 text-white" />
            };
        }
        return {
            title: "설비가 안전하게\n보호되고 있어요",
            subtitle: "현재 모든 시스템이 정상입니다",
            color: classTokens.gradient.healthy,
            icon: <CheckCircle2 className="size-10 text-white" />
        };
    };

    const status = getStatusInfo();

    return (
        <>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="px-4 py-2 pb-6"
            >
                <div
                    className={`w-full bg-linear-to-br ${status.color} text-white flex flex-col items-center justify-center text-center relative overflow-hidden transition-colors`}
                    style={{
                        borderRadius: cssVars.radiusLg,
                        padding: 'var(--space-2xl) var(--space-lg)',
                        transitionDuration: 'var(--duration-slow)',
                        transitionTimingFunction: cssVars.easeOutQuart,
                    }}
                >
                    <div className="relative z-10 flex flex-col items-center gap-5">
                        <motion.div variants={itemVariants}>
                            <div className="p-3.5 bg-white/15 rounded-full border border-white/20">
                                {status.icon}
                            </div>
                        </motion.div>

                        <div className="space-y-2">
                            <motion.h1
                                variants={itemVariants}
                                className="text-[2rem] font-extrabold tracking-tight leading-tight whitespace-pre-line"
                                style={{ fontFamily: 'var(--font-heading)' }}
                            >
                                {status.title}
                            </motion.h1>
                            <motion.p
                                variants={itemVariants}
                                className="text-white/75 font-medium text-base"
                            >
                                {status.subtitle}
                            </motion.p>
                        </div>

                        {!isLoading && (
                            <motion.button
                                variants={itemVariants}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setIsInsightOpen(true)}
                                className="flex items-center gap-2 bg-white/12 px-5 py-2.5 border border-white/10 transition-colors hover:bg-white/18 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                                style={{ borderRadius: cssVars.radiusLg }}
                            >
                                <span className={cn("size-2 rounded-full", classTokens.bg.successDot)} />
                                <span className="text-xs font-semibold uppercase tracking-wider text-white/90">AI Live Monitoring</span>
                            </motion.button>
                        )}
                    </div>
                </div>
            </motion.div>

            <AIInsightModal
                isOpen={isInsightOpen}
                onClose={() => setIsInsightOpen(false)}
            />
        </>
    );
}
