'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps {
    children: ReactNode;
    className?: string;
    neonColor?: string;
    delay?: string;
    title?: string;
    icon?: ReactNode; // Changed to ReactNode to support Lucide icons
    gradient?: string;
}

export function Card({ children, className = '', neonColor, delay = '0', title, icon, gradient }: CardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!cardRef.current) return;
            const { left, top } = cardRef.current.getBoundingClientRect();
            cardRef.current.style.setProperty('--mouse-x', `${e.clientX - left}px`);
            cardRef.current.style.setProperty('--mouse-y', `${e.clientY - top}px`);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            ref={cardRef}
            className={cn(
                "neon-card group h-full transition-all duration-700 font-inter",
                className
            )}
            style={{ animationDelay: `${delay}ms` } as React.CSSProperties}
        >
            {/* Spotlight Effect Layer */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(600px_circle_at_var(--mouse-x,0)_var(--mouse-y,0),rgba(255,255,255,0.03),transparent_40%)]" />

            {/* Neon Glow Layer */}
            {neonColor && (
                <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-1000",
                    neonColor
                )} />
            )}

            <div className={cn(
                "relative z-10 flex flex-col h-full",
                gradient && `bg-gradient-to-br ${gradient}`
            )}>
                {/* Header Section */}
                {(title || icon) && (
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            {icon && (
                                <div className="flex items-center justify-center w-12 h-12 border rounded-2xl bg-white/5 border-white/10 group-hover:scale-110 group-hover:border-brand-primary/40 transition-all duration-500 shadow-xl">
                                    {icon}
                                </div>
                            )}
                            {title && (
                                <h3 className="text-xl font-montserrat font-black tracking-tight text-white group-hover:text-brand-primary transition-colors duration-300">
                                    {title}
                                </h3>
                            )}
                        </div>
                        <div className="w-2 h-2 rounded-full bg-white/10 group-hover:bg-brand-primary transition-colors duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                )}

                {/* Content Section */}
                <div className="flex-1 text-slate-400 group-hover:text-slate-300 transition-colors duration-500">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Card;

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn("mb-6", className)}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <h3 className={cn("text-2xl font-montserrat font-black tracking-tighter text-white", className)}>
            {children}
        </h3>
    );
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn("leading-relaxed", className)}>
            {children}
        </div>
    );
}
