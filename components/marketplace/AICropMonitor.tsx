'use client';

import React, { useState, useEffect } from 'react';
import { Sprout, ShieldCheck, AlertCircle, Scan, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Card from '@/components/ui/Card';

export default function AICropMonitor() {
    const [scanning, setScanning] = useState(false);
    const [healthScore, setHealthScore] = useState(94);
    const [status, setStatus] = useState('healthy');

    const startScan = () => {
        setScanning(true);
        setTimeout(() => {
            setScanning(false);
            const score = Math.floor(Math.random() * (100 - 85 + 1)) + 85;
            setHealthScore(score);
            setStatus(score > 90 ? 'healthy' : 'warning');
        }, 3000);
    };

    return (
        <Card
            title="AI Crop Health"
            icon={<Brain className="w-5 h-5 text-emerald-400" />}
            className="overflow-hidden"
        >
            <div className="absolute top-6 right-6">
                <button
                    onClick={startScan}
                    disabled={scanning}
                    className={cn(
                        "btn-primary text-[10px] py-1.5 px-3 transform-none",
                        scanning && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {scanning ? 'Analyzing...' : 'Analyze Now'}
                </button>
            </div>

            <div className="relative h-44 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden mb-6">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent-primary)_0%,transparent_70%)]" />
                </div>

                <AnimatePresence>
                    {scanning && (
                        <motion.div
                            initial={{ top: 0 }}
                            animate={{ top: '100%' }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-0.5 bg-[var(--accent-primary)] shadow-[0_0_20px_var(--accent-glow)] z-10"
                        />
                    )}
                </AnimatePresence>

                <div className="text-center z-0">
                    <motion.div
                        animate={scanning ? { scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Sprout className={cn(
                            "w-16 h-16 mx-auto mb-2 transition-all duration-700",
                            scanning ? "filter blur-sm" : "drop-shadow-[0_0_15px_var(--accent-glow)]",
                            status === 'healthy' ? 'text-emerald-400' : 'text-amber-400'
                        )} />
                    </motion.div>

                    {!scanning && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <div className="text-4xl font-display font-black mb-0 text-white leading-none">{healthScore}%</div>
                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Health Index</div>
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 group/stat hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1 rounded bg-emerald-500/10">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Pathogens</span>
                    </div>
                    <div className="text-xs font-bold text-white">None Detected</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 group/stat hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1 rounded bg-[var(--accent-primary)]/10">
                            <AlertCircle className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Nutrients</span>
                    </div>
                    <div className="text-xs font-bold text-white">Optimal</div>
                </div>
            </div>
        </Card>
    );
}
