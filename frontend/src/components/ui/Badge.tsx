import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
    children: React.ReactNode;
}

export function Badge({ children, className, variant = 'neutral', ...props }: BadgeProps) {
    const variants = {
        success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        warning: 'bg-orange-50 text-orange-600 border-orange-100',
        error: 'bg-red-50 text-red-600 border-red-100',
        info: 'bg-blue-50 text-blue-600 border-blue-100',
        neutral: 'bg-slate-50 text-slate-500 border-slate-100',
    };

    const dotColors = {
        success: 'bg-emerald-500',
        warning: 'bg-orange-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        neutral: 'bg-slate-400',
    };

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold border uppercase tracking-wider",
                `rounded-[${String('var(--radius-sm)')}]`,
                variants[variant],
                className
            )}
            style={{ borderRadius: 'var(--radius-sm)' }}
            {...props}
        >
            <span className={cn("size-1.5 rounded-full", dotColors[variant])} />
            {children}
        </span>
    );
}
