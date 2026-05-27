// SignalCraft shared design tokens.
// Prefer importing these tokens for chart colors, inline styles, and non-Tailwind values.

import type { CSSProperties } from 'react';

export const colors = {
    signalBlue: '#3B82F6',
    signalBlueSoft: '#60A5FA',
    signalMint: '#10B981',
    signalOrange: '#F59E0B',
    signalOrangeSoft: '#FCD34D',
    signalRed: '#EF4444',
    signalRedSoft: '#FCA5A5',
    slate50: '#F8FAFC',
    slate100: '#F1F5F9',
    slate200: '#E2E8F0',
    slate400: '#94A3B8',
    slate900: '#0F172A',
    kakaoYellow: '#FEE500',
    kakaoText: '#3C1E1E',
    white: '#FFFFFF',
} as const;

export const cssVars = {
    radiusSm: 'var(--radius-sm)',
    radiusMd: 'var(--radius-md)',
    radiusLg: 'var(--radius-lg)',
    fontHeading: 'var(--font-heading)',
    durationNormal: 'var(--duration-normal)',
    easeOutQuart: 'var(--ease-out-quart)',
} as const;

export const effects = {
    headerFrosted: {
        backgroundColor: 'oklch(0.98 0.005 255 / 0.85)',
        backdropFilter: 'blur(12px)',
    },
    stickyFrosted: {
        backgroundColor: 'oklch(0.98 0.005 255 / 0.92)',
        backdropFilter: 'blur(12px)',
    },
    modalBackdrop: {
        backdropFilter: 'blur(4px)',
    },
    softShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
} satisfies Record<string, CSSProperties | string>;

export const chartTokens = {
    axisTick: colors.slate400,
    grid: colors.slate100,
    gridMajor: colors.slate200,
    surface: colors.slate50,
    primaryStroke: colors.signalBlue,
    primaryFill: colors.signalBlue,
} as const;

export const statusTokens = {
    running: {
        gradientStart: colors.signalBlue,
        gradientEnd: colors.signalBlueSoft,
    },
    warning: {
        gradientStart: colors.signalOrange,
        gradientEnd: colors.signalOrangeSoft,
    },
    error: {
        gradientStart: colors.signalRed,
        gradientEnd: colors.signalRedSoft,
    },
} as const;

export const brandTokens = {
    kakao: {
        bgClass: 'bg-kakao-yellow',
        textClass: 'text-kakao-brown',
        background: colors.kakaoYellow,
        text: colors.kakaoText,
    },
} as const;

export const classTokens = {
    text: {
        primary: 'text-slate-900',
        secondary: 'text-slate-600',
        muted: 'text-slate-500',
        subtle: 'text-slate-400',
        disabled: 'text-slate-300',
        inverse: 'text-white',
        brand: 'text-signal-blue',
        success: 'text-emerald-600',
        successIcon: 'text-emerald-500',
        warning: 'text-orange-600',
        warningIcon: 'text-orange-500',
        danger: 'text-red-600',
        dangerIcon: 'text-rose-500',
        info: 'text-blue-600',
        infoIcon: 'text-blue-500',
    },
    bg: {
        page: 'bg-slate-50',
        surface: 'bg-white',
        subtle: 'bg-slate-50',
        muted: 'bg-slate-100',
        brand: 'bg-signal-blue',
        brandSoft: 'bg-signal-blue/10',
        successSoft: 'bg-emerald-50',
        successDot: 'bg-emerald-500',
        warningSoft: 'bg-orange-50',
        warningDot: 'bg-orange-500',
        dangerSoft: 'bg-red-50',
        dangerDot: 'bg-red-500',
        infoSoft: 'bg-blue-50',
        infoDot: 'bg-blue-500',
    },
    border: {
        subtle: 'border-slate-100',
        muted: 'border-slate-200',
        brandSoft: 'border-signal-blue/30',
        successSoft: 'border-emerald-100',
        warningSoft: 'border-orange-100',
        dangerSoft: 'border-red-100',
        infoSoft: 'border-blue-100',
    },
    hover: {
        subtle: 'hover:bg-slate-50',
        muted: 'hover:bg-slate-100',
        brandBright: 'hover:brightness-110',
        dangerSoft: 'hover:bg-rose-50',
    },
    gradient: {
        loading: 'from-slate-400 to-slate-500',
        danger: 'from-rose-500 to-rose-600',
        warning: 'from-amber-400 to-amber-500',
        healthy: 'from-signal-blue to-blue-600',
        machineIcon: 'from-blue-50 to-indigo-50',
    },
    badge: {
        success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        warning: 'bg-orange-50 text-orange-600 border-orange-100',
        error: 'bg-red-50 text-red-600 border-red-100',
        info: 'bg-blue-50 text-blue-600 border-blue-100',
        neutral: 'bg-slate-50 text-slate-500 border-slate-100',
    },
    badgeDot: {
        success: 'bg-emerald-500',
        warning: 'bg-orange-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        neutral: 'bg-slate-400',
    },
    button: {
        primary: 'bg-signal-blue text-white hover:brightness-110',
        secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
        outline: 'border border-slate-200 bg-transparent text-slate-900 hover:bg-slate-50',
        ghost: 'bg-transparent text-slate-600 hover:bg-slate-50',
        danger: 'bg-signal-red/10 text-signal-red hover:bg-signal-red/15',
    },
    machineType: {
        freezer: 'text-blue-500',
        refrigerator: 'text-cyan-500',
        showcase: 'text-indigo-500',
        storage: 'text-slate-500',
    },
    machinePrediction: {
        danger: 'bg-red-50/50 text-signal-red',
        neutral: 'bg-slate-50/50 text-slate-600',
        dangerIconBg: 'bg-signal-red/10',
        neutralIconBg: 'bg-signal-blue/10',
        dangerIcon: 'text-signal-red',
        neutralIcon: 'text-signal-blue',
    },
    machineStatus: {
        running: {
            icon: 'text-signal-mint',
            bg: 'bg-signal-mint/10',
            border: 'border-signal-mint/20',
            badge: 'bg-blue-50 text-blue-600',
            dot: 'bg-blue-500',
            pin: 'bg-emerald-500 text-white',
        },
        warning: {
            icon: 'text-signal-orange',
            bg: 'bg-signal-orange/10',
            border: 'border-signal-orange/20',
            badge: 'bg-amber-50 text-amber-600',
            dot: 'bg-amber-500',
            pin: 'bg-amber-500 text-white',
        },
        error: {
            icon: 'text-signal-red',
            bg: 'bg-signal-red/10',
            border: 'border-signal-red/20',
            badge: 'bg-rose-50 text-rose-600',
            dot: 'bg-rose-500',
            pin: 'bg-rose-500 text-white',
        },
    },
    haccpStatus: {
        PASS: {
            summary: 'bg-emerald-50/50 border-emerald-100',
            stripe: 'bg-emerald-400',
            icon: 'bg-emerald-100 text-emerald-600',
            label: 'text-emerald-600/70',
            history: 'bg-emerald-50 text-emerald-600',
        },
        WARNING: {
            summary: 'bg-amber-50/50 border-amber-100',
            stripe: 'bg-amber-400',
            icon: 'bg-amber-100 text-amber-600',
            label: 'text-amber-600/70',
            history: 'bg-amber-50 text-amber-600',
        },
        FAIL: {
            summary: 'bg-rose-50/50 border-rose-100',
            stripe: 'bg-rose-400',
            icon: 'bg-rose-100 text-rose-600',
            label: 'text-rose-600/70',
            history: 'bg-rose-50 text-rose-600',
        },
    },
    eventType: {
        ON: 'bg-blue-100 text-blue-600',
        DEF: 'bg-amber-100 text-amber-600',
        OFF: 'bg-rose-100 text-rose-600',
        default: 'bg-rose-100 text-rose-600',
    },
    maintenanceAction: {
        CLEANING: {
            icon: 'text-signal-blue bg-signal-blue/10',
            badge: 'bg-blue-50 text-blue-500',
        },
        CHECK: {
            icon: 'text-amber-500 bg-amber-500/10',
            badge: 'bg-amber-500 text-white',
        },
        PART_REPLACE: {
            icon: 'text-emerald-500 bg-emerald-500/10',
            badge: 'bg-emerald-500 text-white',
        },
    },
    notificationType: {
        alert: 'text-rose-500 bg-rose-50',
        report: 'text-signal-blue bg-blue-50',
        maintenance: 'text-emerald-500 bg-emerald-50',
    },
    bottomNav: {
        active: 'text-signal-blue',
        inactive: 'text-slate-400',
        activeBg: 'bg-signal-blue/5',
    },
    profileMenu: {
        account: 'text-slate-400 bg-slate-50',
        subscription: 'text-signal-blue bg-blue-50',
        security: 'text-emerald-500 bg-emerald-50',
        appearance: 'text-slate-400 bg-slate-50',
    },
    healthForecast: {
        dangerCard: 'bg-rose-50 border-rose-100',
        healthyCard: 'bg-emerald-50 border-emerald-100',
        dangerMuted: 'text-rose-400',
        healthyMuted: 'text-emerald-400',
        dangerText: 'text-rose-600',
        healthyText: 'text-emerald-600',
        dangerSmall: 'text-rose-500',
        healthySmall: 'text-emerald-500',
        dangerDot: 'bg-rose-500',
    },
    componentScore: {
        good: 'bg-signal-blue',
        warning: 'bg-signal-orange',
        danger: 'bg-signal-red',
    },
    statProgress: {
        healthy: 'bg-emerald-400',
        warning: 'bg-amber-400',
    },
} as const;
