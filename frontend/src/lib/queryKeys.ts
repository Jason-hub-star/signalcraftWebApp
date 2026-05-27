export const QUERY_KEYS = {
    machines: ['machines'] as const,
    notifications: ['notifications'] as const,
    notificationSettings: ['settings', 'notifications'] as const,
    userProfile: ['user', 'profile'] as const,
    dashboardSummary: ['dashboard', 'summary'] as const,
    machineAnalysis: (machineId: string) => ['machine-analysis', machineId] as const,
    machineSmartLogs: (machineId: string) => ['machine-smart-logs', machineId] as const,
    maintenanceHistory: (machineId: string) => ['maintenance-history', machineId] as const,
    reportsLatest: (deviceId: string | null) => ['reports', 'latest', deviceId] as const,
    reportsTrend: (deviceId: string | null) => ['reports', 'trend', deviceId] as const,
    reportsHistory: (deviceId: string | null) => ['reports', 'history', deviceId] as const,
} as const;
