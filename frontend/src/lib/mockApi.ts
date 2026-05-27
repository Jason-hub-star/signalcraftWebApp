import type { Machine } from '@/components/features/dashboard/MachineCard';

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
    return flag === 'true' || (import.meta.env.DEV && flag !== 'false');
};

const machines: Machine[] = [
    {
        id: 'freezer-a01',
        name: '1층 급속 냉동고 A',
        location: '성수점 제조실',
        status: 'warning',
        health: 62,
        prediction: '압축기 진동과 온도 회복 지연이 감지되어 점검이 필요해요.',
        imageUrl: '',
        type: 'BLAST_FREEZER',
    },
    {
        id: 'showcase-b02',
        name: '매장 쇼케이스 B',
        location: '성수점 판매존',
        status: 'error',
        health: 38,
        prediction: '팬 모터 이상음과 냉기 순환 저하가 겹쳐 즉시 확인이 필요해요.',
        imageUrl: '',
        type: 'SHOWCASE',
    },
    {
        id: 'coldroom-c03',
        name: '후면 저온 창고 C',
        location: '성수점 백룸',
        status: 'running',
        health: 91,
        prediction: '현재 패턴은 안정적이에요. 필터 청소 주기만 유지해 주세요.',
        imageUrl: '',
        type: 'COLD_STORAGE',
    },
];

let notificationSettings: NotificationSettings = {
    push_enabled: true,
    kakao_enabled: true,
    anomaly_alerts: true,
    report_alerts: true,
    push_token: 'dev-mock-token',
};

let notifications: MockNotification[] = [
    {
        id: 'notif-danger-showcase',
        type: 'alert',
        title: '쇼케이스 B 이상 감지',
        message: '팬 모터 회전음이 기준치를 벗어났어요. 24시간 안에 점검을 권장합니다.',
        isRead: false,
        createdAt: isoHoursAgo(1),
    },
    {
        id: 'notif-warning-freezer',
        type: 'maintenance',
        title: '급속 냉동고 A 점검 필요',
        message: '압축기 진동 패턴이 주의 단계로 올라왔어요. 소모품 상태를 확인해 주세요.',
        isRead: false,
        createdAt: isoHoursAgo(4),
    },
    {
        id: 'notif-report',
        type: 'report',
        title: '오늘의 AI 리포트 도착',
        message: '3대 중 2대에서 이상 징후가 확인되었어요. 조치 우선순위를 확인해 주세요.',
        isRead: true,
        createdAt: isoDaysAgo(1),
    },
];

let maintenanceHistory = [
    {
        id: 'mnt-001',
        device_id: 'showcase-b02',
        action_type: 'CHECK',
        description: '팬 모터 베어링 소음 확인. 교체 전 임시 윤활 조치 완료.',
        performed_at: isoDaysAgo(1),
    },
    {
        id: 'mnt-002',
        device_id: 'freezer-a01',
        action_type: 'CLEANING',
        description: '응축기 필터 청소 및 도어 패킹 밀착 상태 확인.',
        performed_at: isoDaysAgo(3),
    },
    {
        id: 'mnt-003',
        device_id: 'coldroom-c03',
        action_type: 'PART_REPLACE',
        description: '온도 센서 예비 부품 교체 및 캘리브레이션 완료.',
        performed_at: isoDaysAgo(8),
    },
];

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
        total_runtime: isDanger ? 1180 : 1320,
        cycle_count: isDanger ? 31 : isWarning ? 24 : 16,
        health_score: health,
        roi_data: { saved: isDanger ? 0 : 8400, watt: isDanger ? 58.4 : 42.5, door_opens: isDanger ? 23 : 12 },
        diagnostics: {
            comp: isDanger ? 45 : isWarning ? 68 : 96,
            fan: isDanger ? 38 : isWarning ? 72 : 92,
            valve: isDanger ? 57 : isWarning ? 81 : 94,
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
        status: machine.status === 'error' ? '비정상 정지' : '가동 중',
        details: machine.status === 'running' ? '정상 범위' : '이상음 기준치 초과',
    },
    {
        id: `log-${machine.id}-2`,
        occurred_at: isoHoursAgo(3),
        event_type: 'DEF',
        status: '제상 사이클',
        details: machine.status === 'running' ? '정상 종료' : '예상보다 긴 제상 시간',
    },
    {
        id: `log-${machine.id}-3`,
        occurred_at: isoHoursAgo(6),
        event_type: 'ON',
        status: '운전 재개',
        details: '온도 회복 추적 중',
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
        return jsonResponse({ GOOD: 1, WARNING: 1, DANGER: 1 });
    }

    if (url.pathname === '/shared/user-profile/me') {
        return jsonResponse({
            user: {
                email: 'signal_boss@example.com',
                full_name: '시그널 사장님',
                role: '매장 관리자',
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
