'use client';

import { useState, useEffect } from 'react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Activity, Heart, Thermometer, Zap, Brain, User, Navigation } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Sample data for the timeline
const INITIAL_CHART_DATA = [
    { time: '09:00', level: 20 },
    { time: '10:00', level: 45 },
    { time: '11:00', level: 85 },
    { time: '12:00', level: 30 },
    { time: '13:00', level: 40 },
    { time: '14:00', level: 95 },
    { time: '15:00', level: 60 },
];

export default function SmartHealthPage() {
    const [aiAdvice, setAiAdvice] = useState("เลือกปุ่มด้านล่างเพื่อให้หมอวิเคราะห์ข้อมูลสุขภาพล่าสุดของคุณ");
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Real-time simulated data
    const [metrics, setMetrics] = useState({
        heartRate: 72,
        spo2: 98,
        temp: 36.6,
        isSittingTooLong: true
    });

    const [chartData, setChartData] = useState(INITIAL_CHART_DATA);

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(prev => ({
                heartRate: Math.floor(70 + Math.random() * 10),
                spo2: Math.min(100, Math.max(95, prev.spo2 + (Math.random() > 0.5 ? 0.1 : -0.1))),
                temp: Number((36.4 + Math.random() * 0.4).toFixed(1)),
                isSittingTooLong: prev.isSittingTooLong
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const consultDoctor = async () => {
        setIsAnalyzing(true);
        setAiAdvice("หมอกำลังอ่านผลเซนเซอร์ของคุณ และวิเคราะห์ด้วยฐานข้อมูลสุขภาพ... รอสักครู่ครับ");

        try {
            const response = await fetch('/api/ai-doctor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    healthData: {
                        heartRate: metrics.heartRate,
                        spo2: Math.round(metrics.spo2),
                        activityLog: "นั่งทำงานต่อเนื่อง 2 ชั่วโมง, ขยับตัวน้อย"
                    },
                    userProfile: {
                        id: 'demo-user',
                        ai_credits: 10
                    }
                })
            });

            const data = await response.json();
            if (data.success) {
                setAiAdvice(data.advice);

                // SAVE TO DATABASE
                await fetch('/api/health/log', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: 'demo-user',
                        metrics: metrics,
                        advice: data.advice
                    })
                });

            } else {
                setAiAdvice(data.message || "ขออภัย หมอไม่ว่างในขณะนี้");
            }
        } catch (error) {
            setAiAdvice("เกิดข้อผิดพลาดในการเชื่อมต่อกับคลินิก AI");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <DashboardShell>
            <div className="space-y-8 pb-10">
                {/* Header: AI Doctor Persona */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row items-center gap-6 p-8 glass rounded-[2.5rem] border border-[var(--accent-primary)]/20 bg-gradient-to-br from-[var(--accent-primary)]/10 via-transparent to-transparent shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--accent-primary)]/30 to-transparent flex items-center justify-center border border-[var(--accent-primary)]/40 relative flex-shrink-0 shadow-[0_0_30px_rgba(var(--accent-primary-rgb),0.2)]">
                        <Brain className={cn("w-12 h-12 text-[var(--accent-primary)] transition-all", isAnalyzing && "animate-pulse scale-110")} />
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-4 border-[#050b0a] flex items-center justify-center">
                            <div className={cn("w-2.5 h-2.5 bg-white rounded-full", isAnalyzing ? "animate-ping" : "animate-pulse")} />
                        </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                            <h1 className="text-3xl font-black text-white uppercase tracking-tighter font-montserrat italic">Doctor Grids</h1>
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-full border border-emerald-500/30">ONLINE</span>
                        </div>
                        <p className="text-[var(--accent-primary)] font-bold text-xs tracking-[0.3em] uppercase mb-4 flex items-center justify-center md:justify-start gap-2">
                            <Navigation className="w-3 h-3 fill-current" /> Office Syndrome Program Active
                        </p>
                        <div className="p-5 rounded-2xl bg-black/60 border border-white/10 relative overflow-hidden">
                            <motion.div
                                className="absolute left-0 top-0 w-1 h-full bg-[var(--accent-primary)]"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <p className="text-slate-200 text-sm leading-relaxed min-h-[3rem]">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={aiAdvice}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                    >
                                        {isAnalyzing && (
                                            <span className="flex items-center gap-2 mb-2 font-bold text-emerald-400">
                                                <Zap className="w-4 h-4 animate-bounce" />
                                                กำลังประมวลผลด้วย Grids AI Doctor...
                                            </span>
                                        )}
                                        "{aiAdvice}"
                                    </motion.span>
                                </AnimatePresence>
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                            <button
                                onClick={consultDoctor}
                                disabled={isAnalyzing}
                                className="px-8 py-4 bg-[var(--accent-primary)] text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(var(--accent-primary-rgb),0.4)] disabled:opacity-50 flex items-center gap-3 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                                <User className="w-5 h-5" />
                                {isAnalyzing ? "กำลังวินิจฉัย..." : "เริ่มการวิเคราะห์สุขภาพ (1 Credit)"}
                            </button>
                            <button className="px-6 py-4 bg-white/5 text-white/70 font-bold rounded-2xl hover:bg-white/10 transition-all border border-white/5">
                                ประวัติการรักษา
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Health Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <HealthCard
                        title="Heart Rate"
                        value={metrics.heartRate}
                        unit="BPM"
                        icon={Heart}
                        color="rose"
                        status="Optimal"
                        trend="+2"
                    />
                    <HealthCard
                        title="Blood Oxygen"
                        value={Math.round(metrics.spo2)}
                        unit="%"
                        icon={Activity}
                        color="blue"
                        status="Stable"
                        trend="0"
                    />
                    <HealthCard
                        title="Body Temp"
                        value={metrics.temp}
                        unit="°C"
                        icon={Thermometer}
                        color="amber"
                        status="Normal"
                        trend="-0.1"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Activity Timeline */}
                    <Card className="lg:col-span-2 overflow-hidden border-white/5 relative bg-black/40">
                        <div className="absolute top-0 right-0 p-4">
                            <span className="flex items-center gap-2 text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                LIVE ACTIVITY
                            </span>
                        </div>
                        <CardHeader>
                            <CardTitle className="flex flex-col gap-1">
                                <span>Lifestyle Activity Analysis</span>
                                <span className="text-xs text-slate-500 font-normal">กราฟวิเคราะห์พฤติกรรมการขยับร่างกายวันนี้</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                                        <XAxis
                                            dataKey="time"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748b', fontSize: 10 }}
                                        />
                                        <YAxis hide />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#050b0a',
                                                border: '1px solid #ffffff10',
                                                borderRadius: '12px',
                                                fontSize: '12px'
                                            }}
                                            itemStyle={{ color: 'var(--accent-primary)' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="level"
                                            stroke="var(--accent-primary)"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorLevel)"
                                            animationDuration={2000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Prescriptions */}
                    <Card className="border-emerald-500/10 bg-gradient-to-b from-black/40 to-transparent">
                        <CardHeader>
                            <CardTitle className="text-emerald-400 flex items-center gap-2">
                                <Zap className="w-5 h-5 fill-emerald-400" />
                                Doctor's Orders
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="p-5 rounded-[1.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-default group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-[10px] font-black text-[var(--accent-primary)] uppercase tracking-wider">Posture Alert</p>
                                    <span className="text-[8px] text-slate-500">NOW</span>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed group-hover:text-white transition-colors">
                                    คุณนั่งต่อเนื่องมาเกิน <span className="text-white font-bold text-lg mx-1">85</span> นาทีแล้ว กรุณาลุกขึ้นยืนยืดกล้ามเนื้อคอ 15 วินาที
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="p-5 rounded-[1.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-default group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-wider">Stress Factor</p>
                                    <span className="text-[8px] text-slate-500">2H AGO</span>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed group-hover:text-white transition-colors">
                                    พบการเต้นหัวใจสูงผิดปกติช่วง 11:30 น. (ขณะพิมพ์งานด่วน) แนะนำให้ฝึกหายใจแบบ <span className="text-rose-400 font-bold">4-7-8</span> เพื่อลด Cortisol
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="p-5 rounded-[1.5rem] bg-rose-500/10 border border-rose-500/20"
                            >
                                <div className="flex items-center gap-2 text-rose-400 mb-1">
                                    <AlertTriangle className="w-4 h-4" />
                                    <p className="text-[10px] font-black uppercase tracking-wider">Urgent Advice</p>
                                </div>
                                <p className="text-sm text-slate-300">ออกซิเจนในเลือดลดลงเล็กน้อย แนะนำให้เปิดหน้าต่างระบายอากาศ</p>
                            </motion.div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardShell>
    );
}

function HealthCard({ title, value, unit, icon: Icon, color, status, trend }: any) {
    const colorMap: any = {
        rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-rose-500/5',
        blue: 'text-sky-400 bg-sky-500/10 border-sky-500/20 shadow-sky-500/5',
        amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-amber-500/5',
    };

    return (
        <Card className="group hover:border-[var(--accent-primary)]/50 transition-all duration-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-primary)]/5 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-[var(--accent-primary)]/10 transition-all duration-700" />
            <CardContent className="pt-6 relative">
                <div className="flex justify-between items-start mb-6">
                    <div className={cn("p-4 rounded-2xl border transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3", colorMap[color])}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">{status}</span>
                        <div className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1",
                            trend.startsWith('+') ? 'bg-emerald-500/20 text-emerald-400' :
                                trend.startsWith('-') ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-500/20 text-slate-500'
                        )}>
                            {trend !== '0' && (trend.startsWith('+') ? '↑' : '↓')} {trend}
                        </div>
                    </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={value}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl font-black text-white tracking-tighter"
                        >
                            {value}
                        </motion.span>
                    </AnimatePresence>
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-tighter">{unit}</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-4 h-[2px] bg-[var(--accent-primary)]" />
                    {title}
                </p>
            </CardContent>
        </Card>
    );
}
