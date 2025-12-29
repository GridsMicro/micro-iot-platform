'use client';

import React, { useState, useEffect } from 'react';
import { Sprout, ShieldCheck, AlertCircle, Scan, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
        <div className="glass-card overflow-hidden relative group">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <Brain className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">AI Crop Health</h3>
                        <p className="text-xs text-emerald-100/50">Edge Inference V2.4</p>
                    </div>
                </div>
                <button
                    onClick={startScan}
                    disabled={scanning}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${scanning ? 'bg-emerald-500/10 text-emerald-500/50' : 'bg-emerald-500 text-white hover:bg-emerald-400'
                        }`}
                >
                    {scanning ? 'Analyzing...' : 'Analyze Now'}
                </button>
            </div>

            <div className="relative h-48 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden">
                <AnimatePresence>
                    {scanning && (
                        <motion.div
                            initial={{ top: 0 }}
                            animate={{ top: '100%' }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] z-10"
                        />
                    )}
                </AnimatePresence>

                <div className="text-center z-0">
                    <Sprout className={`w-16 h-16 mx-auto mb-2 transition-all duration-700 ${scanning ? 'opacity-20 scale-90 blur-sm' : 'opacity-100 scale-100'
                        } ${status === 'healthy' ? 'text-emerald-400' : 'text-amber-400'}`} />
                    {!scanning && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="text-3xl font-black mb-1">{healthScore}%</div>
                            <div className="text-xs font-bold uppercase tracking-wider opacity-60">Health Index</div>
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-medium">Pathogens</span>
                    </div>
                    <div className="text-sm font-bold">None Detected</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-medium">Nutrients</span>
                    </div>
                    <div className="text-sm font-bold">Optimal</div>
                </div>
            </div>
        </div>
    );
}
