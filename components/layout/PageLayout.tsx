// components/layout/PageLayout.tsx
// Standard layout for all pages with glassmorphism theme

import Link from 'next/link';
import { ReactNode } from 'react';

interface PageLayoutProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
}

export default function PageLayout({ children, title, subtitle }: PageLayoutProps) {
    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-950">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-40 right-20 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-20 left-40 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>
            </div>

            {/* Navigation Bar */}
            <nav className="relative z-10 glass border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-400 rounded-lg blur-md group-hover:blur-lg transition-all opacity-50"></div>
                                <div className="relative bg-gradient-to-br from-emerald-400 to-teal-500 p-2 rounded-lg">
                                    <span className="text-2xl">🌱</span>
                                </div>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
                                Smart Farm
                            </span>
                        </Link>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center gap-1">
                            <NavLink href="/dashboard">Dashboard</NavLink>
                            <NavLink href="/docs">Docs</NavLink>
                            <NavLink href="/docs/hardware/esp32-setup">ESP32</NavLink>
                            <NavLink href="/docs/hardware/stm32-getting-started">STM32</NavLink>
                            <NavLink href="/docs/hardware/power-solutions">Power</NavLink>
                            <NavLink href="/docs/hardware/water-management">Water</NavLink>
                            <NavLink href="/docs/hardware/ai-crop-analysis">AI</NavLink>
                            <NavLink href="https://github.com/GridsMicro/micro-iot-platform" external>
                                GitHub
                            </NavLink>
                        </div>

                        {/* Mobile Menu Button */}
                        <button className="md:hidden p-2 rounded-lg glass-card">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="relative z-10 p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Page Header */}
                    {title && (
                        <div className="glass-card p-6 mb-6 border-2 border-emerald-400/30 animate-fade-in-up">
                            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-300 bg-clip-text text-transparent animate-gradient">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="text-emerald-200/70 mt-2 text-lg">{subtitle}</p>
                            )}
                        </div>
                    )}

                    {/* Page Content */}
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 glass border-t border-white/10 py-6 mt-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-emerald-200/60 text-sm">
                        © 2025 Smart Farm IoT Platform. Built with ❤️ for the Future of Farming.
                    </p>
                </div>
            </footer>
        </div>
    );
}

// Navigation Link Component
function NavLink({ href, children, external = false }: { href: string; children: React.ReactNode; external?: boolean }) {
    const className = "px-4 py-2 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-medium";

    if (external) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
                {children}
            </a>
        );
    }

    return (
        <Link href={href} className={className}>
            {children}
        </Link>
    );
}
