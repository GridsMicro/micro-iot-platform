// components/ui/Card.tsx
// Standard card component with glassmorphism

import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    neonColor?: string;
    delay?: string;
}

export function Card({ children, className = '', neonColor, delay = '0' }: CardProps) {
    return (
        <div className={`group relative animate-fade-in-up ${className}`} style={{ animationDelay: `${delay}ms` }}>
            {neonColor && (
                <div className={`absolute inset-0 bg-gradient-to-br ${neonColor} rounded-2xl blur-2xl opacity-0 group-hover:opacity-60 transition-all duration-500`}></div>
            )}
            <div className="relative glass-card p-6 rounded-2xl border-2 border-white/20 hover:border-white/40 transition-all duration-300">
                {children}
            </div>
        </div>
    );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <div className={`mb-4 ${className}`}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <h3 className={`text-2xl font-bold text-emerald-200 ${className}`}>
            {children}
        </h3>
    );
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <div className={`text-emerald-100/90 ${className}`}>
            {children}
        </div>
    );
}
