import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type Machine, MachineCard } from './MachineCard';
import { MachineDetailModal } from './MachineDetailModal';
import { Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/queryKeys';

export function MachineList() {
    const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
    const [initialView, setInitialView] = useState<'analysis' | 'maintenance'>('analysis');

    const { data, isPending, error } = useQuery<{ machines: Machine[] }>({
        queryKey: QUERY_KEYS.machines,
        queryFn: async () => {
            const response = await apiFetch('/machines/');
            if (!response.ok) throw new Error('설비 목록을 불러오는데 실패했습니다.');
            return response.json();
        },
    });

    const machines = data?.machines || [];

    const handleCardClick = (machine: Machine) => {
        setInitialView('analysis');
        setSelectedMachine(machine);
    };

    const handleManage = (machine: Machine) => {
        setInitialView('maintenance');
        setSelectedMachine(machine);
    };

    const handleDelete = (id: string) => {
        if (confirm('정말 이 설비를 삭제하시겠습니까?')) {
            console.log('Delete machine:', id);
            // In a real app, you would call an API here
        }
    };

    return (
        <div className="px-4 space-y-3 pb-10">
            <div className="flex items-center justify-between py-2">
                <h3 className="text-slate-900 tracking-tight">설비 현황</h3>
                <button className="text-signal-blue text-sm font-medium p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-2"
                    style={{ borderRadius: 'var(--radius-sm)' }}
                >
                    전체 보기
                </button>
            </div>

            <div className="flex flex-col gap-3">
                {isPending ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                        <Loader2 className="size-8 animate-spin" />
                        <p className="font-medium text-sm">설비 정보를 불러오는 중...</p>
                    </div>
                ) : error ? (
                    <div className="p-6 bg-rose-50 text-rose-500 text-center" style={{ borderRadius: 'var(--radius-md)' }}>
                        <p className="font-medium text-sm">목록 로드 실패</p>
                        <p className="text-xs opacity-80 mt-1">네트워크 상태를 확인해주세요</p>
                    </div>
                ) : machines.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400 bg-white border border-dashed border-slate-200"
                        style={{ borderRadius: 'var(--radius-lg)' }}
                    >
                        <p className="font-medium text-sm">등록된 설비가 없습니다</p>
                        <p className="text-xs">새 기기를 등록해 모니터링을 시작하세요</p>
                    </div>
                ) : (
                    machines.map((machine, idx) => (
                        <MachineCard
                            key={machine.id}
                            machine={machine}
                            index={idx}
                            onClick={handleCardClick}
                            onManage={handleManage}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>

            <MachineDetailModal
                machine={selectedMachine}
                isOpen={!!selectedMachine}
                onClose={() => setSelectedMachine(null)}
                initialView={initialView}
            />
        </div>
    );
}
