import type { Machine } from '@/components/features/dashboard/MachineCard';
import type { ClientThemeId } from '@/lib/theme';
import type { DashboardHome } from '@/lib/contracts/dashboardHome';

type DashboardPreset = 'facility-poc' | 'cold-chain' | 'manufacturing';
type DashboardMetricId = 'statusSummary' | 'equipmentUsage' | 'machineList';

type NotificationSeed = {
    id: string;
    type: 'alert' | 'report' | 'maintenance';
    title: string;
    message: string;
    isRead: boolean;
    createdHoursAgo?: number;
    createdDaysAgo?: number;
};

type MaintenanceSeed = {
    id: string;
    device_id: string;
    action_type: 'CHECK' | 'CLEANING' | 'PART_REPLACE';
    description: string;
    performedDaysAgo: number;
};

type InsightPeriod = {
    score: number;
    status: string;
    summary: string;
    metrics: Array<{ label: string; value: string; change: string; isGood: boolean }>;
    timeline: Array<{ time: string; event: string; type: 'info' | 'warning' | 'alert' | 'success' }>;
    aiAdvice: string;
};

export const mockScenario = {
    company: {
        id: 'raven',
        name: 'Raven Materials',
        siteLabel: '인천 송도 본사 / 소재 공정 라인',
        domain: 'Black TiO2 visible-light photocatalyst',
        themeId: 'raven' satisfies ClientThemeId,
        dashboardPreset: 'facility-poc' satisfies DashboardPreset,
        enabledMetrics: ['statusSummary', 'equipmentUsage', 'machineList'] satisfies DashboardMetricId[],
        labels: {
            machine: '설비',
            usage: '장비 사용 상태',
            statusSummary: '설비 상태 요약',
        },
    },
    userProfile: {
        email: 'ops@raven-materials.com',
        full_name: 'Raven Materials 운영팀',
        role: '소재 공정 관리자',
    },
    dashboardSummary: { GOOD: 2, WARNING: 2, DANGER: 1 },
    dashboardHome: {
        appVersion: 'v0.0.1',
        lastUpdatedAt: '2026-06-02T08:30:00+09:00',
        maintenancePhone: '010-1234-5678',
        statusOverview: [
            {
                id: 'machines',
                title: '설비 구동 상태',
                state: 'danger',
                healthyCount: 2,
                totalCount: 5,
                description: '현재 설치된 5대 중 1대가 즉시 점검이 필요해요.',
            },
            {
                id: 'edgeSensors',
                title: '센서 상태',
                state: 'healthy',
                healthyCount: 12,
                totalCount: 12,
                description: '모든 센서가 정상으로 데이터를 수집하고 있어요.',
            },
            {
                id: 'server',
                title: '서버 상태',
                state: 'healthy',
                healthyCount: 1,
                totalCount: 1,
                description: '백엔드 서버가 안정적으로 응답하고 있어요.',
            },
        ],
        equipmentUsage: {
            selectedPeriod: '24h',
            periodOptions: [
                { id: '24h', label: '지난 24시간' },
                { id: '7d', label: '지난 7일' },
                { id: '30d', label: '지난 30일' },
                { id: '90d', label: '지난 90일' },
            ],
            machines: [
                { id: 'rp-reactor-01', name: 'RP 합성 반응조 01' },
                { id: 'ht-furnace-02', name: '산소결함 열처리로 02' },
                { id: 'rcb-coater-01', name: 'RCB 세라믹 블록 코팅 라인' },
                { id: 'voc-chamber-01', name: 'VOC 저감 성능 챔버' },
                { id: 'air-filter-rig-01', name: '공조 필터 테스트 리그' },
            ],
            segments: [
                { machineId: 'rp-reactor-01', state: 'RUNNING', startedAt: '2026-06-01T00:00:00+09:00', endedAt: '2026-06-01T08:00:00+09:00' },
                { machineId: 'rp-reactor-01', state: 'OFF', startedAt: '2026-06-01T08:00:00+09:00', endedAt: '2026-06-01T12:00:00+09:00' },
                { machineId: 'rp-reactor-01', state: 'RUNNING', startedAt: '2026-06-01T12:00:00+09:00', endedAt: '2026-06-01T20:00:00+09:00' },
                { machineId: 'rp-reactor-01', state: 'NO_DATA', startedAt: '2026-06-01T20:00:00+09:00', endedAt: '2026-06-02T00:00:00+09:00' },
                { machineId: 'ht-furnace-02', state: 'ERROR', startedAt: '2026-06-01T00:00:00+09:00', endedAt: '2026-06-01T06:00:00+09:00' },
                { machineId: 'ht-furnace-02', state: 'OFF', startedAt: '2026-06-01T06:00:00+09:00', endedAt: '2026-06-01T10:00:00+09:00' },
                { machineId: 'ht-furnace-02', state: 'ERROR', startedAt: '2026-06-01T10:00:00+09:00', endedAt: '2026-06-01T18:00:00+09:00' },
                { machineId: 'ht-furnace-02', state: 'OFF', startedAt: '2026-06-01T18:00:00+09:00', endedAt: '2026-06-02T00:00:00+09:00' },
                { machineId: 'rcb-coater-01', state: 'RUNNING', startedAt: '2026-06-01T00:00:00+09:00', endedAt: '2026-06-02T00:00:00+09:00' },
                { machineId: 'voc-chamber-01', state: 'RUNNING', startedAt: '2026-06-01T00:00:00+09:00', endedAt: '2026-06-01T10:00:00+09:00' },
                { machineId: 'voc-chamber-01', state: 'OFF', startedAt: '2026-06-01T10:00:00+09:00', endedAt: '2026-06-01T14:00:00+09:00' },
                { machineId: 'voc-chamber-01', state: 'RUNNING', startedAt: '2026-06-01T14:00:00+09:00', endedAt: '2026-06-02T00:00:00+09:00' },
                { machineId: 'air-filter-rig-01', state: 'RUNNING', startedAt: '2026-06-01T00:00:00+09:00', endedAt: '2026-06-02T00:00:00+09:00' },
            ],
            summary: {
                runningMinutes: 960,
                offMinutes: 240,
            },
        },
    } satisfies DashboardHome,
    machines: [
        {
            id: 'rp-reactor-01',
            name: 'RP 합성 반응조 01',
            location: 'LAB1 Black TiO2 합성 라인',
            status: 'warning',
            health: 64,
            prediction: '교반 모터 진동과 반응 온도 편차가 함께 상승해 산소결함 균일도 확인이 필요해요.',
            imageUrl: '',
            type: 'PHOTO_REACTOR',
        },
        {
            id: 'ht-furnace-02',
            name: '산소결함 열처리로 02',
            location: 'LAB1 열처리 / 환원 분위기 구간',
            status: 'error',
            health: 36,
            prediction: '챔버 배기 온도와 진동 RMS가 기준을 벗어났어요. 즉시 점검 대상입니다.',
            imageUrl: '',
            type: 'HEAT_TREATMENT_FURNACE',
        },
        {
            id: 'rcb-coater-01',
            name: 'RCB 세라믹 블록 코팅 라인',
            location: 'LAB2 TiO2-X 코팅 / 건조 라인',
            status: 'running',
            health: 92,
            prediction: '코팅 균일도와 건조 온도가 안정적이에요. 현재 패턴을 유지해 주세요.',
            imageUrl: '',
            type: 'CERAMIC_COATER',
        },
        {
            id: 'voc-chamber-01',
            name: 'VOC 저감 성능 챔버',
            location: 'LAB2 가시광 광촉매 검증실',
            status: 'warning',
            health: 71,
            prediction: '600-700nm 조사 구간에서 VOC 저감률이 기준 대비 낮아졌어요.',
            imageUrl: '',
            type: 'VOC_TEST_CHAMBER',
        },
        {
            id: 'air-filter-rig-01',
            name: '공조 필터 테스트 리그',
            location: '송도 RCB 응용 테스트존',
            status: 'running',
            health: 88,
            prediction: '차압과 풍량이 정상 범위예요. 필터 교체 주기만 유지하면 됩니다.',
            imageUrl: '',
            type: 'AIR_FILTER_TEST_RIG',
        },
    ] satisfies Machine[],
    notifications: [
        {
            id: 'notif-danger-furnace',
            type: 'alert',
            title: '열처리로 02 이상 감지',
            message: '배기 온도 상승과 진동 RMS 초과가 동시에 감지됐어요. 즉시 점검을 권장합니다.',
            isRead: false,
            createdHoursAgo: 1,
        },
        {
            id: 'notif-warning-reactor',
            type: 'maintenance',
            title: 'RP 합성 반응조 01 점검 필요',
            message: '교반 모터 진동 패턴이 주의 단계로 올라왔어요. 베어링과 온도 제어 상태를 확인해 주세요.',
            isRead: false,
            createdHoursAgo: 4,
        },
        {
            id: 'notif-report-raven',
            type: 'report',
            title: 'Raven 공정 AI 리포트 도착',
            message: '5대 중 3대에서 주의 이상의 센서 패턴이 확인됐어요. 조치 우선순위를 확인해 주세요.',
            isRead: true,
            createdDaysAgo: 1,
        },
    ] satisfies NotificationSeed[],
    maintenanceHistory: [
        {
            id: 'mnt-001',
            device_id: 'ht-furnace-02',
            action_type: 'CHECK',
            description: '열처리로 챔버 씰과 배기 라인 온도 센서 체결 상태 확인.',
            performedDaysAgo: 1,
        },
        {
            id: 'mnt-002',
            device_id: 'rp-reactor-01',
            action_type: 'CLEANING',
            description: '교반축 하우징 청소 및 온도 프로브 재캘리브레이션 완료.',
            performedDaysAgo: 3,
        },
        {
            id: 'mnt-003',
            device_id: 'rcb-coater-01',
            action_type: 'PART_REPLACE',
            description: '코팅 노즐 예비 부품 교체 및 분사 패턴 확인.',
            performedDaysAgo: 8,
        },
    ] satisfies MaintenanceSeed[],
    report: {
        statusSummary: {
            PASS: '공정 상태가 안정적입니다.',
            WARNING: '품질 편차 주의 신호가 포착되었습니다.',
            FAIL: '공정 정지 위험이 감지되었습니다.',
        },
        energy: {
            label: 'Process Efficiency',
            activeTitle: (saved: number) => `공정 손실 ₩${saved.toLocaleString()} 줄였어요`,
            inactiveTitle: '공정 효율 분석 중',
            description: '전력 부하와 품질 편차를 함께 반영한 예상 절감',
        },
        stats: {
            runtimeLabel: '센서 수집 시간',
            cycleLabel: '공정 배치 횟수',
            cycleUnit: '배치',
        },
    },
    analysis: {
        diagnosticsTitle: '공정 핵심 지표',
        diagnostics: [
            { key: 'comp', label: '열/반응 제어 모듈', goodDetail: '온도 편차와 응답 속도 안정', warnDetail: '온도 편차 상승 추적 필요' },
            { key: 'fan', label: '배기/송풍 모듈', goodDetail: '풍량과 차압 정상 범위', warnDetail: '차압 변동 및 팬 진동 주의' },
            { key: 'valve', label: '코팅/투입 밸브', goodDetail: '유량과 분사 패턴 양호', warnDetail: '유량 불규칙 패턴 감지' },
        ],
        liveSignalTitle: '실시간 설비 진동',
        forecastTitle: '72시간 공정 안정도 예보',
        forecastValueLabel: '예상 안정도',
        forecastFailureLabel: '위험 예상 시점',
        forecastHealthyLabel: '이상 징후 없음',
        forecastHealthyValue: '공정 안정도 확보',
        efficiencyTitle: '공정 효율 리포트',
        primaryMetricLabel: '전력 부하',
        primaryMetricDescription: (saved: number) => `전주 대비 ${Math.round((saved || 8000) / 1200)}% 개선 중`,
        secondaryMetricLabel: '광촉매 활성 지표',
        secondaryMetricUnit: '점',
        secondaryMetricDescription: '600-700nm 구간 VOC 저감률 주의',
        insightLabel: 'AI 공정 인사이트',
    },
    smartLog: {
        title: '센서 수집 요약',
        primaryMetricLabel: '수집 시간',
        secondaryMetricLabel: '공정 배치',
        secondaryMetricUnit: 'Batches',
    },
    aiInsight: {
        cardTitle: '현재 Raven 공정은 주의 관찰 중입니다.',
        cardHighlight: '주의 관찰',
        cardSubtitle: '열처리로 1대 위험 • VOC 챔버 저감률 저하',
        periods: [
            { id: 'daily', label: '일간' },
            { id: 'weekly', label: '주간' },
            { id: 'monthly', label: '월간' },
        ],
        periodData: {
            daily: {
                score: 74,
                status: 'Watch',
                summary: '대부분의 라인은 수집 중이나 열처리로 02에서 즉시 점검 신호가 있습니다.',
                metrics: [
                    { label: '공정 안정도', value: '74%', change: '-8%', isGood: false },
                    { label: 'VOC 저감률', value: '82%', change: '-5%', isGood: false },
                    { label: '이상 감지', value: '3건', change: '+2', isGood: false },
                ],
                timeline: [
                    { time: '09:10', event: 'RP 합성 반응조 센서 수집 시작', type: 'info' },
                    { time: '13:40', event: '열처리로 02 배기 온도 상승', type: 'alert' },
                    { time: '17:20', event: 'RCB 코팅 라인 균일도 정상', type: 'success' },
                ],
                aiAdvice: '열처리로 02를 먼저 점검하고, VOC 챔버의 600-700nm 조사 강도와 시료 위치를 다시 맞추는 것이 좋습니다.',
            },
            weekly: {
                score: 81,
                status: 'Controlled',
                summary: '주간 기준으로는 안정적이지만 열처리와 VOC 검증 구간에서 반복 신호가 있습니다.',
                metrics: [
                    { label: '평균 안정도', value: '81%', change: '-3%', isGood: false },
                    { label: '품질 편차', value: 'Low', change: 'Stable', isGood: true },
                    { label: '점검 권장', value: '2건', change: '+1', isGood: false },
                ],
                timeline: [
                    { time: '월요일', event: 'RCB 코팅 노즐 세정 완료', type: 'success' },
                    { time: '수요일', event: 'VOC 저감률 기준 대비 5% 하락', type: 'warning' },
                    { time: '금요일', event: '열처리로 진동 RMS 기준 초과', type: 'alert' },
                ],
                aiAdvice: '열처리로 배기 라인과 반응조 교반축을 같은 점검 창에 묶으면 라인 정지 시간을 줄일 수 있습니다.',
            },
            monthly: null,
        } satisfies Record<'daily' | 'weekly' | 'monthly', InsightPeriod | null>,
    },
};
