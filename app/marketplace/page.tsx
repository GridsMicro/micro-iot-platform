'use client';

import React, { useState } from 'react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import {
    ShoppingBag,
    Palette,
    Puzzle,
    CheckCircle2,
    ArrowRight,
    Download,
    AlertCircle,
    ExternalLink,
    Star,
    Lock
} from 'lucide-react';
import { useTheme } from '@/components/dashboard/ThemeContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface MarketplaceItem {
    id: string;
    name: string;
    description: string;
    type: 'template' | 'extension';
    price: string;
    rating: number;
    author: string;
    isInstalled: boolean;
    image: string;
}

export default function MarketplacePage() {
    const { setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState<'all' | 'template' | 'extension'>('all');
    const [installingId, setInstallingId] = useState<string | null>(null);

    const [items, setItems] = useState<MarketplaceItem[]>([
        {
            id: 'template-nature',
            name: 'Default Nature',
            description: 'The standard green and organic look for smart farms.',
            type: 'template',
            price: 'Free',
            rating: 5.0,
            author: 'Grids Micro',
            isInstalled: true,
            image: 'https://images.unsplash.com/photo-1530836361253-efad5c468a73?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'template-cyberpunk',
            name: 'Cyberpunk Neon',
            description: 'Futuristic purple and pink vibes for high-tech setups.',
            type: 'template',
            price: '$9.99',
            rating: 4.8,
            author: 'AestheticLabs',
            isInstalled: false,
            image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'ext-weather',
            name: 'Weather Forecast Pro',
            description: 'AI-driven weather predictions directly in your dashboard.',
            type: 'extension',
            price: '$14.99',
            rating: 4.9,
            author: 'SmartAI',
            isInstalled: false,
            image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'ext-ai-bot',
            name: 'Crop Doctor AI',
            description: 'Image recognition to detect plant diseases via camera.',
            type: 'extension',
            price: '$29.99',
            rating: 4.7,
            author: 'AgriTech Solutions',
            isInstalled: false,
            image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'template-industrial',
            name: 'Industrial Pro',
            description: 'Dark, professional, and high-contrast for serious scale.',
            type: 'template',
            price: '$12.00',
            rating: 4.5,
            author: 'SteelUX',
            isInstalled: false,
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'template-midnight',
            name: 'Midnight OLED',
            description: 'Pure black background for maximum contrast and battery saving.',
            type: 'template',
            price: '$8.00',
            rating: 5.0,
            author: 'Grids Micro',
            isInstalled: false,
            image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'ext-ai-crop',
            name: 'AI Crop Health Monitor',
            description: 'Advanced edge-AI analyzing plant health via real-time vision.',
            type: 'extension',
            price: '$45.00',
            rating: 5.0,
            author: 'Grids Micro',
            isInstalled: false,
            image: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&w=400&q=80'
        }
    ]);

    const handleInstall = (id: string) => {
        setInstallingId(id);
        // Simulate installation
        setTimeout(() => {
            setItems(prev => prev.map(item =>
                item.id === id ? { ...item, isInstalled: true } : item
            ));
            setInstallingId(null);

            // If it's a template, maybe hint to try it
            const item = items.find(i => i.id === id);
            if (item?.type === 'template') {
                const themeId = id.split('-')[1];
                setTheme(themeId as any);
            }
        }, 2000);
    };

    const filteredItems = items.filter(item =>
        activeTab === 'all' || item.type === activeTab
    );

    return (
        <DashboardShell>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <ShoppingBag className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Marketplace</h1>
                            <p className="text-emerald-200/50">Expand your farm with premium templates and extensions</p>
                        </div>
                    </div>

                    <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl">
                        <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')} icon={ShoppingBag}>All</TabButton>
                        <TabButton active={activeTab === 'template'} onClick={() => setActiveTab('template')} icon={Palette}>Templates</TabButton>
                        <TabButton active={activeTab === 'extension'} onClick={() => setActiveTab('extension')} icon={Puzzle}>Extensions</TabButton>
                    </div>
                </div>

                {/* Banner */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-emerald-600 to-teal-700 p-12 text-white">
                    <div className="relative z-10 max-w-2xl">
                        <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-widest mb-4">New Launch</span>
                        <h2 className="text-4xl font-black mb-6 leading-tight">Holiday Sale: Get 30% off on all Premium Templates!</h2>
                        <button className="px-8 py-3 bg-white text-emerald-700 rounded-xl font-bold hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-black/20">
                            Explore Summer Deals <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                    {/* Abstract Circle Overlays */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/20 rounded-full -ml-12 -mb-12 blur-2xl"></div>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="group glass-card rounded-3xl border border-white/10 flex flex-col overflow-hidden hover:border-[var(--accent-primary)]/50 transition-all duration-300">
                            {/* Thumbnail */}
                            <div className="h-48 relative overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-tighter border border-white/10">
                                    {item.type}
                                </div>
                                <div className="absolute bottom-4 right-4 flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500 text-white text-[10px] font-bold">
                                    <Star className="w-3 h-3 fill-current" /> {item.rating}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-white group-hover:text-[var(--accent-primary)] transition-colors">{item.name}</h3>
                                    <span className="text-lg font-black text-[var(--accent-primary)]">{item.price}</span>
                                </div>
                                <p className="text-sm text-emerald-100/40 mb-6 flex-1 leading-relaxed">
                                    {item.description}
                                </p>

                                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">{item.author[0]}</div>
                                        <span className="text-[10px] text-emerald-200/30 uppercase font-bold tracking-widest">{item.author}</span>
                                    </div>

                                    <button
                                        onClick={() => !item.isInstalled && handleInstall(item.id)}
                                        disabled={item.isInstalled || installingId === item.id}
                                        className={cn(
                                            "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
                                            item.isInstalled
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                                : "bg-[var(--accent-primary)] text-white hover:scale-105 active:scale-95 shadow-lg shadow-[var(--glow-color)]"
                                        )}
                                    >
                                        {installingId === item.id ? (
                                            <RefreshCcw className="w-4 h-4 animate-spin" />
                                        ) : item.isInstalled ? (
                                            <>Installed <CheckCircle2 className="w-4 h-4" /></>
                                        ) : (
                                            <>Install Now <Download className="w-4 h-4" /></>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Manage Section */}
                <div className="glass-card rounded-3xl border border-white/10 p-8 mt-12">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                            <Puzzle className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold">Manage Extensions</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <Palette className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Theme Engine</p>
                                    <p className="text-xs text-emerald-200/30">Active: Nature</p>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-white/5 rounded-lg text-emerald-200/40"><ExternalLink className="w-4 h-4" /></button>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Real-time Analytics</p>
                                    <p className="text-xs text-emerald-200/30">Core Addon</p>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-white/5 rounded-lg text-emerald-200/40"><Lock className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}

function TabButton({ active, onClick, icon: Icon, children }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                active
                    ? "bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--glow-color)]"
                    : "text-emerald-200/40 hover:text-emerald-200"
            )}
        >
            <Icon className="w-4 h-4" />
            {children}
        </button>
    );
}

// Internal icons needed
function RefreshCcw(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>
    );
}

function Activity(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
    );
}
