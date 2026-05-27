import { PlusCircle, BarChart3, BellOff, Bell, Settings2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/queryKeys';

interface NotificationSettings {
    push_enabled: boolean;
    kakao_enabled: boolean;
    anomaly_alerts: boolean;
    report_alerts: boolean;
}

export function QuickActions() {
    const queryClient = useQueryClient();

    // Fetch notification settings
    const { data: settings, isLoading } = useQuery<NotificationSettings>({
        queryKey: QUERY_KEYS.notificationSettings,
        queryFn: async () => {
            const response = await apiFetch('/notifications/settings');
            if (!response.ok) throw new Error('알림 설정 로드 실패');
            return response.json();
        }
    });

    // Toggle push notifications mutation
    const toggleMutation = useMutation({
        mutationFn: async (newValue: boolean) => {
            const response = await apiFetch('/notifications/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ push_enabled: newValue }),
            });
            if (!response.ok) throw new Error('알림 설정 변경 실패');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificationSettings });
        }
    });

    const isPushEnabled = settings?.push_enabled ?? false;

    const actions = [
        { id: 'add', icon: PlusCircle, label: '기기 추가', color: 'text-signal-blue', path: '#' },
        { id: 'report', icon: BarChart3, label: '리포트 보기', color: 'text-emerald-500', path: '/report' },
        {
            id: 'silence',
            icon: isLoading ? Loader2 : (isPushEnabled ? Bell : BellOff),
            label: isPushEnabled ? '알림 끄기' : '알림 켜기',
            color: isPushEnabled ? 'text-signal-blue' : 'text-slate-400',
            onClick: () => toggleMutation.mutate(!isPushEnabled),
            isLoading: toggleMutation.isPending || isLoading,
            isActive: isPushEnabled
        },
        { id: 'settings', icon: Settings2, label: '고급 설정', color: 'text-slate-500', path: '/settings' },
    ];

    return (
        <div className="flex gap-3 overflow-x-auto px-4 py-4 no-scrollbar">
            {actions.map((action, idx) => {
                const isSilenceAction = action.id === 'silence';
                const Icon = action.icon;

                return (
                    <motion.div
                        key={action.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                        className="flex-shrink-0"
                    >
                        {isSilenceAction ? (
                            <button
                                onClick={action.onClick}
                                disabled={action.isLoading}
                                className={`flex items-center gap-2.5 h-12 px-5 border transition-colors active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-2 ${action.isActive
                                    ? 'bg-blue-50 border-blue-100 text-slate-900'
                                    : 'bg-white border-slate-100 text-slate-400'
                                    }`}
                                style={{ borderRadius: 'var(--radius-md)' }}
                            >
                                <Icon className={`${action.color} ${action.isLoading ? 'animate-spin' : ''}`} size={18} />
                                <span className={`whitespace-nowrap font-medium text-sm ${action.isActive ? 'text-signal-blue' : ''}`}>
                                    {action.label}
                                </span>
                            </button>
                        ) : (
                            <Link
                                to={action.path as string}
                                className="flex items-center gap-2.5 h-12 px-5 bg-white border border-slate-100 text-slate-900 text-sm font-medium hover:border-blue-100 transition-colors active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-2"
                                style={{ borderRadius: 'var(--radius-md)' }}
                            >
                                <Icon className={action.color as string} size={18} />
                                <span className="whitespace-nowrap">{action.label}</span>
                            </Link>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}
