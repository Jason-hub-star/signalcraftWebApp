import { useState } from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AIInsightModal } from './AIInsightModal';

export function AIInsightCard() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                onClick={() => setIsModalOpen(true)}
                className="relative overflow-hidden bg-slate-900 cursor-pointer group shadow-lg"
                style={{ borderRadius: 'var(--radius-lg)' }}
            >
                <div className="relative p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="size-8 bg-white/10 flex items-center justify-center" style={{ borderRadius: 'var(--radius-sm)' }}>
                                <Sparkles size={16} className="text-signal-blue" />
                            </div>
                            <span className="section-label text-slate-400 mb-0">AI Insight</span>
                        </div>
                        <div className="size-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/15 transition-colors"
                            style={{ transitionDuration: 'var(--duration-normal)' }}
                        >
                            <ChevronRight size={18} className="text-white" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                            오늘의 설비는 <span className="text-signal-blue">안정적</span>입니다.
                        </h3>
                        <p className="text-sm font-medium text-slate-400">
                            특이사항 없음 • 효율 94% 달성
                        </p>
                    </div>
                </div>
            </motion.div>

            <AIInsightModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
