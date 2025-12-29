'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Leaf,
    Home,
    Cpu,
    Settings,
    Bell,
    User,
    Menu,
    X,
    Zap,
    ShoppingBag,
    ChevronRight,
    Search,
    Activity
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTheme } from './ThemeContext';
import { useLanguage } from './LanguageContext';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface NavItemProps {
    href: string;
    icon: any;
    label: string;
    active?: boolean;
}

function NavItem({ href, icon: Icon, label, active }: NavItemProps) {
    return (
        <Link
            href={href}
            className={cn(
                "group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-500",
                active
                    ? "bg-gradient-to-r from-[var(--accent-primary)]/20 to-transparent text-[var(--accent-primary)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
        >
            {active && (
                <div className="absolute left-0 w-1 h-8 bg-[var(--accent-primary)] rounded-r-full shadow-[0_0_15px_var(--accent-glow)]" />
            )}
            <Icon className={cn(
                "w-5 h-5 transition-all duration-500",
                active ? "drop-shadow-[0_0_8px_var(--accent-glow)]" : "group-hover:scale-110"
            )} />
            <span className="font-semibold tracking-tight">{label}</span>
            <ChevronRight className={cn(
                "ml-auto w-4 h-4 transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1",
                active && "opacity-100"
            )} />
        </Link>
    );
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const { theme, setTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();

    // Auto-close sidebar on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const navItems = [
        { href: '/', icon: Home, label: t('overview') },
        { href: '/dashboard', icon: LayoutDashboard, label: t('liveMonitor') },
        { href: '/smarthome', icon: Zap, label: t('smarthome') },
        { href: '/marketplace', icon: ShoppingBag, label: t('marketplace') },
        { href: '/devices', icon: Cpu, label: t('myDevices') },
        { href: '/health', icon: Activity, label: t('smartHealth') },
        { href: '/settings', icon: Settings, label: t('settings') },
    ];

    const themes = [
        { id: 'nature', label: 'Nature', color: '#10b981' },
        { id: 'cyberpunk', label: 'Cyberpunk', color: '#f472b6' },
        { id: 'minimal', label: 'Minimal', color: '#64748b' },
        { id: 'industrial', label: 'Industrial', color: '#3b82f6' },
        { id: 'midnight', label: 'Midnight', color: '#fafafa' },
    ];

    return (
        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] flex overflow-x-hidden font-inter">
            {/* Mobile Scrim */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-500"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-72 glass border-r border-[var(--glass-border)] transition-all duration-500 ease-emphasized transform bg-[var(--bg-primary)]/80 backdrop-blur-3xl shadow-2xl",
                !isSidebarOpen ? "-translate-x-full" : "translate-x-0"
            )}>
                <div className="flex flex-col h-full p-6">
                    {/* Logo Section */}
                    <div className="flex items-center gap-4 mb-14 px-2">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-[var(--accent-primary)] rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                            <div className="relative bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] p-2.5 rounded-2xl shadow-xl">
                                <Leaf className="w-6 h-6 text-black" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-display font-black tracking-tighter text-white font-montserrat">
                                SMART FARM
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--accent-primary)] opacity-80">
                                IoT PLATFORM
                            </span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 px-4">Management Console</p>
                        {navItems.map((item) => (
                            <NavItem
                                key={item.href}
                                {...item}
                                active={pathname === item.href}
                            />
                        ))}
                    </nav>

                    {/* User Profile */}
                    <div className="mt-8 pt-8 border-t border-[var(--glass-border)]">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-[var(--accent-primary)] rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                <div className="w-10 h-10 rounded-full border border-[var(--glass-border)] flex items-center justify-center bg-slate-900 overflow-hidden">
                                    <User className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <p className="text-sm font-bold text-white truncate">Pro Farmer</p>
                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Premium Access</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Wrapper */}
            <main className={cn(
                "flex-1 transition-all duration-500 ease-emphasized min-w-0",
                isSidebarOpen ? "lg:ml-72" : "ml-0"
            )}>
                {/* Modern Topbar */}
                <header className={cn(
                    "sticky top-0 z-30 h-20 px-4 md:px-8 flex items-center justify-between transition-all duration-500",
                    scrolled ? "glass border-b border-[var(--glass-border)] shadow-2xl" : "bg-transparent"
                )}>
                    <div className="flex items-center gap-4 md:gap-6">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2.5 hover:bg-white/10 rounded-xl transition-all active:scale-95 group"
                        >
                            {isSidebarOpen ? <X className="w-5 h-5 text-slate-400 group-hover:text-white" /> : <Menu className="w-5 h-5 text-slate-400 group-hover:text-white" />}
                        </button>

                        <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/5 group focus-within:border-[var(--accent-primary)]/50 transition-all">
                            <Search className="w-4 h-4 text-slate-500 group-focus-within:text-[var(--accent-primary)]" />
                            <input
                                type="text"
                                placeholder="Search platform..."
                                className="bg-transparent border-none outline-none text-sm w-40 lg:w-64 text-white placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Theme Visual Selector */}
                        <div className="hidden xs:flex items-center p-1.5 bg-black/20 rounded-2xl border border-white/5 gap-1.5">
                            {themes.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id as any)}
                                    title={t.label}
                                    className={cn(
                                        "w-6 h-6 md:w-7 md:h-7 rounded-lg transition-all duration-300 hover:scale-110 relative",
                                        theme === t.id ? "scale-100 shadow-[0_0_15px_rgba(255,255,255,0.2)] ring-1 ring-white/50" : "opacity-40 grayscale-[0.5]"
                                    )}
                                    style={{ backgroundColor: t.color }}
                                >
                                    {theme === t.id && <div className="absolute inset-0 bg-white/20 animate-pulse rounded-lg" />}
                                </button>
                            ))}
                        </div>

                        <div className="hidden xs:block h-6 w-[1px] bg-white/10" />

                        <div className="flex p-1 bg-black/20 border border-white/5 rounded-xl">
                            {['TH', 'EN'].map((l) => (
                                <button
                                    key={l}
                                    onClick={() => setLanguage(l.toLowerCase() as any)}
                                    className={cn(
                                        "px-2 md:px-2.5 py-1 text-[10px] font-black rounded-lg transition-all",
                                        language === l.toLowerCase() ? "bg-[var(--accent-primary)] text-black" : "text-slate-500 hover:text-white"
                                    )}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>

                        {/* Connection Status Badge */}
                        <div className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-xl border",
                            process.env.NEXT_PUBLIC_OPERATION_MODE === 'local'
                                ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        )}>
                            <div className={cn(
                                "w-1.5 h-1.5 rounded-full animate-pulse",
                                process.env.NEXT_PUBLIC_OPERATION_MODE === 'local' ? "bg-blue-400" : "bg-emerald-400"
                            )} />
                            <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">
                                {process.env.NEXT_PUBLIC_OPERATION_MODE === 'local' ? 'Edge Hub' : 'Cloud Sync'}
                            </span>
                        </div>

                        <button className="p-2.5 relative hover:bg-white/10 rounded-xl transition-all group">
                            <Bell className="w-5 h-5 text-slate-400 group-hover:text-white" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--bg-primary)] ring-2 ring-red-500/30 animate-pulse"></span>
                        </button>
                    </div>
                </header>

                {/* Page Canvas */}
                <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-[calc(100vh-5rem)] relative">
                    {/* Background subtle decorations */}
                    <div className="absolute top-40 right-40 w-80 h-80 bg-[var(--accent-primary)] rounded-full blur-[150px] opacity-10 pointer-events-none" />
                    <div className="absolute bottom-40 left-40 w-60 h-60 bg-[var(--accent-secondary)] rounded-full blur-[120px] opacity-5 pointer-events-none" />

                    <div className="relative z-10">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
