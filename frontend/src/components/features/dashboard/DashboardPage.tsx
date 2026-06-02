import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Header } from '../../shared/Header';
import { BottomNav } from '../../shared/BottomNav';
import { EntrySplash } from './home/EntrySplash';
import { HomeGreeting } from './home/HomeGreeting';
import { StatusOverviewSection } from './home/StatusOverviewSection';
import { EquipmentUsageSection } from './home/EquipmentUsageSection';
import { MaintenanceCallButton } from './home/MaintenanceCallButton';
import { HelpOverlay } from './home/HelpOverlay';
import { apiFetch } from '@/lib/api';
import { mockScenario } from '@/lib/mockScenario';
import { QUERY_KEYS } from '@/lib/queryKeys';
import type { DashboardHome, HomePeriod } from '@/lib/contracts/dashboardHome';

interface UserProfile {
    user: {
        full_name: string;
    };
}

type HelpSection = 'status' | 'equipment' | null;

const ENTRY_SPLASH_FLAG = 'signalcraft:entrySplashShown';

function shouldShowEntrySplash(): boolean {
    if (typeof window === 'undefined') return false;
    try {
        return window.sessionStorage.getItem(ENTRY_SPLASH_FLAG) === null;
    } catch {
        return false;
    }
}

const HELP_COPY: Record<Exclude<HelpSection, null>, { title: string; description: string }> = {
    status: {
        title: '상태 정보 영역',
        description: '현재 설치된 설비와 엣지 센서, 서버 상태를 한눈에 확인할 수 있어요. 상태는 양호(초록), 보통(노랑), 불량(빨강)으로 표시돼요.',
    },
    equipment: {
        title: '설비 정보 영역',
        description: '선택한 기간 동안 설비가 가동·정지·이상 상태였던 구간을 그래프로 보여줘요. 기간 버튼과 설비 드롭다운으로 원하는 구간을 골라볼 수 있어요.',
    },
};

export function DashboardPage() {
    const dashboardConfig = mockScenario.company;
    const enabledMetrics = new Set(dashboardConfig.enabledMetrics);
    const [helpSection, setHelpSection] = useState<HelpSection>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<HomePeriod>('24h');
    const [showEntrySplash, setShowEntrySplash] = useState<boolean>(shouldShowEntrySplash);

    const dismissEntrySplash = useCallback(() => {
        try {
            window.sessionStorage.setItem(ENTRY_SPLASH_FLAG, '1');
        } catch {
            /* sessionStorage 사용 불가 환경(Safari private 등)에서는 무시 */
        }
        setShowEntrySplash(false);
    }, []);

    const { data: profile } = useQuery<UserProfile>({
        queryKey: QUERY_KEYS.userProfile,
        queryFn: async () => {
            const response = await apiFetch('/shared/user-profile/me');
            if (!response.ok) throw new Error('프로필 로딩 실패');
            return response.json();
        },
    });

    const { data: home, isPending: isHomeLoading, error: homeError } = useQuery<DashboardHome>({
        queryKey: QUERY_KEYS.dashboardHome,
        queryFn: async () => {
            const response = await apiFetch('/dashboard/home');
            if (!response.ok) throw new Error('홈 데이터 로딩 실패');
            return response.json();
        },
    });

    return (
        <div className="flex flex-col min-h-screen pb-24 bg-background">
            <Header />
            <main className="flex-1 overflow-y-auto pt-4">
                {isHomeLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
                        <Loader2 className="size-8 animate-spin" />
                        <p className="font-medium text-sm">홈 데이터를 불러오는 중이에요</p>
                    </div>
                ) : homeError || !home ? (
                    <div className="mx-6 p-6 bg-danger/10 text-danger text-center" style={{ borderRadius: 'var(--radius-md)' }}>
                        <p className="font-medium text-sm">홈 데이터를 불러오지 못했어요</p>
                        <p className="text-xs opacity-80 mt-1">잠시 후 다시 시도해 주세요</p>
                    </div>
                ) : (
                    <>
                        <HomeGreeting
                            fullName={profile?.user.full_name || '사용자'}
                            lastUpdatedAt={home.lastUpdatedAt}
                        />

                        {enabledMetrics.has('statusSummary') && (
                            <StatusOverviewSection
                                statusOverview={home.statusOverview}
                                onHelpClick={() => setHelpSection('status')}
                            />
                        )}

                        {enabledMetrics.has('equipmentUsage') && (
                            <EquipmentUsageSection
                                data={{ ...home.equipmentUsage, selectedPeriod }}
                                onPeriodChange={setSelectedPeriod}
                                onMachineChange={() => {}}
                                onHelpClick={() => setHelpSection('equipment')}
                            />
                        )}

                        <div className="px-6 mb-10">
                            <MaintenanceCallButton phone={home.maintenancePhone} />
                        </div>
                    </>
                )}
            </main>
            <BottomNav />

            <HelpOverlay
                isOpen={helpSection !== null}
                title={helpSection ? HELP_COPY[helpSection].title : ''}
                description={helpSection ? HELP_COPY[helpSection].description : ''}
                onClose={() => setHelpSection(null)}
            />

            <AnimatePresence>
                {showEntrySplash && (
                    <EntrySplash
                        version={home?.appVersion ?? 'v0.0.1'}
                        onClose={dismissEntrySplash}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
