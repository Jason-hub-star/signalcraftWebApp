import type { Machine } from '@/components/features/dashboard/MachineCard';
import { mockScenario } from './mockScenario';

type NotificationSettings = {
    push_enabled: boolean;
    kakao_enabled: boolean;
    anomaly_alerts: boolean;
    report_alerts: boolean;
    push_token?: string;
};

type MockNotification = {
    id: string;
    type: 'alert' | 'report' | 'maintenance';
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
};

const now = new Date();
const isoHoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();
const isoDaysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
const isoDaysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

export const isMockApiEnabled = () => {
    const flag = import.meta.env.VITE_USE_MOCK_API;
    return flag !== 'false';
};

const machines: Machine[] = mockScenario.machines;

let notificationSettings: NotificationSettings = {
    push_enabled: true,
    kakao_enabled: true,
    anomaly_alerts: true,
    report_alerts: true,
    push_token: 'dev-mock-token',
};

let notifications: MockNotification[] = mockScenario.notifications.map((notification) => ({
    ...notification,
    createdAt: notification.createdDaysAgo
        ? isoDaysAgo(notification.createdDaysAgo)
        : isoHoursAgo(notification.createdHoursAgo || 1),
}));

let maintenanceHistory = mockScenario.maintenanceHistory.map(({ performedDaysAgo, ...record }) => ({
    ...record,
    performed_at: isoDaysAgo(performedDaysAgo),
}));

const jsonResponse = (data: unknown, init?: ResponseInit) =>
    new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        ...init,
    });

const readBody = async (init?: RequestInit) => {
    if (!init?.body || typeof init.body !== 'string') return {};
    try {
        return JSON.parse(init.body);
    } catch {
        return {};
    }
};

const machineById = (id: string | null) => machines.find((machine) => machine.id === id) || machines[0];

const reportForMachine = (machine: Machine, dayOffset = 0) => {
    const health = Math.max(20, machine.health - dayOffset * 2);
    const isDanger = machine.status === 'error' || health < 50;
    const isWarning = machine.status === 'warning' || health < 75;

    return {
        id: `report-${machine.id}-${dayOffset}`,
        report_date: isoDaysAgo(dayOffset || 0),
        device_id: machine.id,
        total_runtime: isDanger ? 1210 : isWarning ? 1295 : 1360,
        cycle_count: isDanger ? 28 : isWarning ? 22 : 14,
        health_score: health,
        roi_data: { saved: isDanger ? 0 : 126000, watt: isDanger ? 74.8 : isWarning ? 61.2 : 48.6, door_opens: isDanger ? 57 : isWarning ? 76 : 91 },
        diagnostics: {
            comp: isDanger ? 42 : isWarning ? 67 : 95,
            fan: isDanger ? 39 : isWarning ? 73 : 91,
            valve: isDanger ? 54 : isWarning ? 80 : 93,
        },
        ai_summary: machine.prediction,
        haccp_status: isDanger ? 'FAIL' : isWarning ? 'WARNING' : 'PASS',
        created_at: isoHoursAgo(2),
    };
};

const reportsForMachine = (machine: Machine) =>
    Array.from({ length: 10 }, (_, index) => reportForMachine(machine, index));

const analysisForMachine = (machine: Machine) => {
    const report = reportForMachine(machine);
    const decay = machine.status === 'error' ? [38, 32, 27, 21] : machine.status === 'warning' ? [62, 55, 47, 40] : [91, 90, 88, 87];

    return {
        report,
        forecast: {
            id: `forecast-${machine.id}`,
            device_id: machine.id,
            golden_time: machine.status === 'running' ? null : isoDaysFromNow(machine.status === 'error' ? 1 : 3),
            prediction_data: [
                { time: '현재', value: decay[0] },
                { time: '1일 뒤', value: decay[1] },
                { time: '2일 뒤', value: decay[2] },
                { time: '3일 뒤', value: decay[3] },
            ],
        },
    };
};

const logsForMachine = (machine: Machine) => [
    {
        id: `log-${machine.id}-1`,
        occurred_at: isoHoursAgo(1),
        event_type: machine.status === 'error' ? 'OFF' : 'ON',
        status: machine.status === 'error' ? '위험 신호' : '센서 수집 중',
        details: machine.status === 'running' ? '온도/진동/차압 정상 범위' : '온도 drift와 진동 RMS 기준치 초과',
    },
    {
        id: `log-${machine.id}-2`,
        occurred_at: isoHoursAgo(3),
        event_type: 'DEF',
        status: '공정 배치 기록',
        details: machine.status === 'running' ? '배치 종료 후 품질 지표 정상' : '가시광 조사/배기 조건 재확인 필요',
    },
    {
        id: `log-${machine.id}-3`,
        occurred_at: isoHoursAgo(6),
        event_type: 'ON',
        status: '센서 동기화',
        details: '온도, 진동, VOC, 차압 데이터 수집 재개',
    },
];

export async function mockApiFetch(path: string, init?: RequestInit): Promise<Response> {
    const url = new URL(path, 'https://signalcraft.dev');
    const method = init?.method?.toUpperCase() || 'GET';
    const body = await readBody(init);

    if (url.pathname === '/machines/') {
        return jsonResponse({ machines });
    }

    if (url.pathname === '/dashboard/summary') {
        return jsonResponse(mockScenario.dashboardSummary);
    }

    if (url.pathname === '/shared/user-profile/me') {
        return jsonResponse({
            user: {
                email: mockScenario.userProfile.email,
                full_name: mockScenario.userProfile.full_name,
                role: mockScenario.userProfile.role,
            },
            device_count: machines.length,
            plan: 'PRO',
        });
    }

    if (url.pathname === '/notifications/settings') {
        if (method === 'POST') {
            notificationSettings = { ...notificationSettings, ...body };
        }
        return jsonResponse(notificationSettings);
    }

    if (url.pathname === '/notifications/') {
        return jsonResponse({ notifications });
    }

    if (url.pathname.startsWith('/notifications/') && url.pathname.endsWith('/read')) {
        const id = url.pathname.split('/')[2];
        notifications = notifications.map((notification) =>
            notification.id === id ? { ...notification, isRead: true } : notification
        );
        return jsonResponse({ ok: true });
    }

    if (url.pathname === '/notifications/mark-all-read') {
        notifications = notifications.map((notification) => ({ ...notification, isRead: true }));
        return jsonResponse({ ok: true });
    }

    if (url.pathname === '/dashboard/machine-detail/analysis') {
        return jsonResponse(analysisForMachine(machineById(url.searchParams.get('machine_id'))));
    }

    if (url.pathname === '/dashboard/machine-detail/smart-log') {
        return jsonResponse(logsForMachine(machineById(url.searchParams.get('machine_id'))));
    }

    if (url.pathname === '/dashboard/machine-detail/maintenance') {
        if (method === 'POST') {
            const record = {
                id: `mnt-${Date.now()}`,
                ...body,
                performed_at: body.performed_at || new Date().toISOString(),
            };
            maintenanceHistory = [record, ...maintenanceHistory];
            return jsonResponse(record);
        }

        const machineId = url.searchParams.get('machine_id');
        return jsonResponse(
            maintenanceHistory.filter((record) => !machineId || record.device_id === machineId)
        );
    }

    if (url.pathname === '/dashboard/machine-detail/service-tickets') {
        return jsonResponse({ id: `ticket-${Date.now()}`, status: 'received', ...body });
    }

    if (url.pathname.startsWith('/reports/latest/')) {
        const id = url.pathname.split('/').pop() || null;
        return jsonResponse(reportForMachine(machineById(id)));
    }

    if (url.pathname === '/reports/') {
        return jsonResponse({ reports: reportsForMachine(machineById(url.searchParams.get('device_id'))) });
    }

    return jsonResponse({ message: `No mock route for ${url.pathname}` }, { status: 404 });
}
