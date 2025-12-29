```
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
    Droplets,
    Wind,
    ShoppingBag
} from 'lucide-react';
import { useState } from 'react';
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
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                active
                    ? "bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30"
                    : "text-[var(--foreground)]/60 hover:text-[var(--foreground)] hover:bg-white/5"
            )}
        >
            <Icon className={cn(
                "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                active && "text-[var(--accent-primary)] drop-shadow-[0_0_8px_var(--glow-color)]"
            )} />
            <span className="font-medium">{label}</span>
            {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] shadow-[0_0_8px_var(--glow-color)]" />
            )}
        </Link>
    );
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { theme, setTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();

    const navItems = [
        { href: '/', icon: Home, label: t('overview') },
        { href: '/dashboard', icon: LayoutDashboard, label: t('liveMonitor') },
        { href: '/smarthome', icon: Zap, label: t('smarthome') },
        { href: '/marketplace', icon: ShoppingBag, label: t('marketplace') },
        { href: '/devices', icon: Cpu, label: t('myDevices') },
        { href: '/settings', icon: Settings, label: t('settings') },
    ];

    const themes = [
        { id: 'nature', label: 'Nature', color: '#10b981' },
        { id: 'cyberpunk', label: 'Cyberpunk', color: '#f472b6' },
        { id: 'minimal', label: 'Minimal', color: '#0f172a' },
        { id: 'industrial', label: 'Industrial', color: '#3b82f6' },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-secondary)] text-[var(--foreground)] flex transition-colors duration-500">
            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-72 glass border-r border-white/10 transition-transform duration-300 transform md:translate-x-0 outline-none",
                !isSidebarOpen && "-translate-x-full"
            )}>
                <div className="flex flex-col h-full p-6">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-12">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[var(--accent-primary)] rounded-lg blur-lg opacity-40"></div>
                            <div className="relative bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] p-2 rounded-lg">
                                <Leaf className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
                            Smart Farm
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                        <p className="text-xs font-semibold text-[var(--foreground)]/40 uppercase tracking-widest mb-4 px-4">Menu</p>
                        {navItems.map((item) => (
                            <NavItem
                                key={item.href}
                                {...item}
                                active={pathname === item.href}
                            />
                        ))}
                    </nav>

                    {/* Bottom Profile/Logout */}
                    <div className="mt-auto pt-6 border-t border-white/5">
                        <div className="flex items-center gap-3 px-4 py-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] p-0.5">
                                <div className="w-full h-full rounded-full bg-[var(--bg-secondary)] flex items-center justify-center overflow-hidden">
                                    <User className="w-6 h-6 text-[var(--accent-primary)]" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate">Pro Farmer</p>
                                <p className="text-xs text-[var(--foreground)]/50 truncate">Premium Plan</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={cn(
                "flex-1 transition-all duration-300",
                isSidebarOpen ? "md:ml-72" : "ml-0"
            )}>
                {/* Topbar */}
                <header className="sticky top-0 z-40 h-16 glass-card border-b border-white/10 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <div className="h-6 w-[1px] bg-white/10"></div>

                        {/* Theme Selector */}
                        <div className="flex items-center gap-2">
                            {themes.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id as any)}
                                    title={t.label}
                                    className={cn(
                                        "w-6 h-6 rounded-full border-2 transition-all duration-300 hover:scale-110",
                                        theme === t.id ? "border-white scale-125 shadow-lg" : "border-transparent opacity-50"
                                    )}
                                    style={{ backgroundColor: t.color }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Language Switcher */}
                        <div className="flex p-0.5 bg-white/5 border border-white/10 rounded-lg">
                            <button
                                onClick={() => setLanguage('th')}
                                className={cn("px-2 py-1 text-[10px] font-bold rounded transition-all", language === 'th' ? "bg-[var(--accent-primary)] text-white" : "text-[var(--foreground)]/40")}
                            >
                                TH
                            </button>
                            <button
                                onClick={() => setLanguage('en')}
                                className={cn("px-2 py-1 text-[10px] font-bold rounded transition-all", language === 'en' ? "bg-[var(--accent-primary)] text-white" : "text-[var(--foreground)]/40")}
                            >
                                EN
                            </button>
                        </div>

                        <button className="p-2 relative hover:bg-white/5 rounded-lg transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--bg-secondary)]"></span>
                        </button>
                        <div className="h-4 w-[1px] bg-white/10 mx-2"></div>
                        <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-full border border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/10">
                            <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse"></div>
                            <span className="text-xs font-bold text-[var(--accent-primary)] uppercase">{t('templateMode')}</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
