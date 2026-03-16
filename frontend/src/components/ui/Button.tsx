import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
}

export function Button({
    children,
    className,
    variant = 'primary',
    size = 'md',
    loading,
    disabled,
    ...props
}: ButtonProps) {
    const variants = {
        primary: 'bg-signal-blue text-white hover:brightness-110',
        secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
        outline: 'border border-slate-200 bg-transparent text-slate-900 hover:bg-slate-50',
        ghost: 'bg-transparent text-slate-600 hover:bg-slate-50',
        danger: 'bg-signal-red/10 text-signal-red hover:bg-signal-red/15',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm min-h-[36px]',
        md: 'px-5 py-2.5 min-h-[44px]',
        lg: 'px-8 py-3.5 text-lg min-h-[52px]',
    };

    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.1 }}
            className={cn(
                "toss-button",
                variants[variant],
                sizes[size],
                loading && "opacity-70 pointer-events-none",
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {children}
        </motion.button>
    );
}
