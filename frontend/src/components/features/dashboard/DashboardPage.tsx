import { useQuery } from '@tanstack/react-query';
import { Header } from '../../shared/Header';
import { BottomNav } from '../../shared/BottomNav';
import { StatusHero } from './StatusHero';
import { QuickActions } from './QuickActions';
import { MachineList } from './MachineList';

interface UserProfile {
    user: {
        full_name: string;
    };
}

interface DashboardSummary {
    GOOD: number;
    WARNING: number;
    DANGER: number;
}

export function DashboardPage() {
    const { data: profile } = useQuery<UserProfile>({
        queryKey: ['user', 'profile'],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/shared/user-profile/me`);
            if (!response.ok) throw new Error('프로필 로딩 실패');
            return response.json();
        },
    });

    const { data: summary, isLoading: isSummaryLoading } = useQuery<DashboardSummary>({
        queryKey: ['dashboard', 'summary'],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/dashboard/summary`);
            if (!response.ok) throw new Error('요약 정보 로딩 실패');
            return response.json();
        },
    });

    return (
        <div className="flex flex-col min-h-screen pb-24 bg-slate-50">
            <Header />
            <main className="flex-1 overflow-y-auto pt-4">
                <div className="px-6 mb-6">
                    <p className="text-slate-400 text-sm font-medium tracking-tight mb-1">
                        안녕하세요, {profile?.user.full_name || '사용자'} 님
                    </p>
                    <h2 className="text-slate-900 tracking-tight">좋은 아침입니다 👋</h2>
                </div>

                <StatusHero summary={summary} isLoading={isSummaryLoading} />

                <div className="mt-8">
                    <span className="px-6 section-label">Quick Actions</span>
                    <QuickActions />
                </div>

                <div className="mt-6 mb-4 px-6 flex items-center justify-between">
                    <span className="section-label mb-0">My Machines</span>
                    <button
                        className="text-[13px] font-semibold text-signal-blue px-3 py-1 bg-signal-blue/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-2"
                        style={{ borderRadius: 'var(--radius-lg)' }}
                    >
                        전체보기
                    </button>
                </div>
                <MachineList />
            </main>
            <BottomNav />
        </div>
    );
}
