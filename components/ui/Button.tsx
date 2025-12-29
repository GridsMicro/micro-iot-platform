// components/ui/Button.tsx
// Standard button component with neon effects

import { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    disabled?: boolean;
}

export function Button({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false
}: ButtonProps) {
    const baseStyles = "group relative overflow-hidden rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";

    const variants = {
        primary: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400",
        secondary: "glass-card border-2 border-emerald-400/30 hover:border-emerald-400/60",
        danger: "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400"
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {/* Glow Effect */}
            <div className={`absolute inset-0 ${variants[variant]} opacity-0 group-hover:opacity-100 blur-xl transition-all duration-300`}></div>

            {/* Content */}
            <span className="relative text-white flex items-center justify-center gap-2">
                {children}
            </span>
        </button>
    );
}
