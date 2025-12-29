'use client';

import { useState, useEffect } from 'react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Activity, Heart, Thermometer, Zap, AlertTriangle, User, Brain } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

export default function SmartHealthPage() {
    const [aiAdvice, setAiAdvice] = useState("เลือกปุ่มด้านล่างเพื่อให้หมอวิเคราะห์ข้อมูลสุขภาพล่าสุดของคุณ");
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const consultDoctor = async () => {
        setIsAnalyzing(true);
        setAiAdvice("หมอกำลังอ่านผลเซนเซอร์ของคุณ และวิเคราะห์ด้วยฐานข้อมูลสุขภาพ... รอสักครู่ครับ");

        try {
            const response = await fetch('/api/ai-doctor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    healthData: {
                        heartRate: 72,
                        spo2: 98,
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
            <div className="space-y-8 animate-fade-in">
                {/* Header: AI Doctor Persona */}
                <div className="flex flex-col md:flex-row items-center gap-6 p-8 glass rounded-[2rem] border border-[var(--accent-primary)]/20 bg-gradient-to-r from-[var(--accent-primary)]/5 to-transparent">
                    <div className="w-20 h-20 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center border border-[var(--accent-primary)]/40 relative flex-shrink-0">
                        <Brain className={cn("w-10 h-10 text-[var(--accent-primary)]", isAnalyzing && "animate-pulse")} />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-[#050b0a] flex items-center justify-center">
                            <div className={cn("w-2 h-2 bg-white rounded-full", isAnalyzing ? "animate-ping" : "animate-pulse")} />
                        </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter font-montserrat">AI Personal Doctor</h1>
                        <p className="text-[var(--accent-primary)] font-bold text-sm tracking-widest uppercase mb-4">Office Syndrome Program Active</p>
                        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 relative group">
                            <div className="absolute -left-1 top-4 w-1 h-8 bg-[var(--accent-primary)] rounded-full opacity-50" />
                            <p className="text-slate-300 text-sm leading-relaxed italic">
                                {isAnalyzing && (
                                    <span className="flex items-center gap-2 mb-2 not-italic">
                                        <Zap className="w-4 h-4 text-emerald-400 animate-bounce" />
                                        กำลังประมวลผลด้วย Grids AI Doctor...
                                    </span>
                                )}
                                "{aiAdvice}"
                            </p>
                        </div>
                        <button
                            onClick={consultDoctor}
                            disabled={isAnalyzing}
                            className="mt-6 px-8 py-3 bg-[var(--accent-primary)] text-black font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(var(--accent-primary-rgb),0.3)] disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-3"
                        >
                            <User className="w-5 h-5" />
                            {isAnalyzing ? "กำลังวินิจฉัย..." : "เริ่มการวิเคราะห์สุขภาพ (1 Credit)"}
                        </button>
                    </div>
                </div>

                {/* Health Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <HealthCard title="Heart Rate" value="72" unit="BPM" icon={Heart} color="rose" status="Optimal" />
                    <HealthCard title="Blood Oxygen" value="98" unit="%" icon={Activity} color="blue" status="Normal" />
                    <HealthCard title="Body Temp" value="36.6" unit="°C" icon={Thermometer} color="amber" status="Normal" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Activity Timeline */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Lifestyle Activity Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                {/* Chart would go here */}
                                <div className="flex items-center justify-center h-full text-slate-500 text-sm italic">
                                    [ กราฟวิเคราะห์พฤติกรรมการนั่งและขยับตัวรายวัน ]
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Prescriptions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-emerald-400">Doctor's Orders</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <p className="text-xs font-black text-[var(--accent-primary)] uppercase mb-1">Posture Alert</p>
                                <p className="text-sm text-slate-300">คุณนั่งต่อเนื่องมา 85 นาทีแล้ว กรุณาลุกขึ้นยืนและยืดกล้ามเนื้อคอ 15 วินาที</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <p className="text-xs font-black text-rose-400 uppercase mb-1">Heart Rate Note</p>
                                <p className="text-sm text-slate-300">พบการเต้นหัวใจสูงผิดปกติช่วง 11:30 น. (ขณะพิมพ์งาน) แนะนำให้ฝึกหายใจแบบ 4-7-8</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardShell>
    );
}

function HealthCard({ title, value, unit, icon: Icon, color, status }: any) {
    return (
        <Card className="group hover:border-[var(--accent-primary)]/50 transition-all">
            <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{status}</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">{value}</span>
                    <span className="text-sm font-bold text-slate-500">{unit}</span>
                </div>
                <p className="text-[10px] font-bold text-slate-600 uppercase mt-2 tracking-widest">{title}</p>
            </CardContent>
        </Card>
    );
}
