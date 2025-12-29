'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { useLanguage } from '@/components/dashboard/LanguageContext';
import {
    Thermometer,
    Droplets,
    Sprout,
    Sun,
    Zap,
    Activity,
    Signal,
    Battery,
    RefreshCcw,
    ArrowUpRight,
    ArrowDownRight,
    AlertCircle,
    Clock,
    Circle
} from 'lucide-react';
import AICropMonitor from '@/components/marketplace/AICropMonitor';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SensorReading {
    sensor_type: string;
    value: number;
    time: string;
}

interface Device {
    id: string;
    name: string;
    status: string;
    device_type: string;
}

export default function DashboardPage() {
    const { t, language } = useLanguage();
    const [latestData, setLatestData] = useState<Record<string, SensorReading>>({});
    const [devices, setDevices] = useState<Device[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        loadDevices();
    }, []);

    useEffect(() => {
        if (selectedDevice) {
            loadLatestData(selectedDevice);
            loadHistory(selectedDevice);
            const unsubscribe = subscribeToRealtime(selectedDevice);
            return unsubscribe;
        }
    }, [selectedDevice]);

    const loadDevices = async () => {
        const { data } = await supabase
            .from('devices')
            .select('id, name, status, device_type')
            .order('name');

        if (data && data.length > 0) {
            setDevices(data);
            setSelectedDevice(data[0].id);
        }
        setIsLoading(false);
    };

    const loadLatestData = async (deviceId: string) => {
        const { data } = await supabase
            .from('telemetry')
            .select('sensor_type, value, time')
            .eq('device_id', deviceId)
            .order('time', { ascending: false })
            .limit(20);

        if (data) {
            const latest: Record<string, SensorReading> = {};
            data.forEach(reading => {
                if (!latest[reading.sensor_type]) {
                    latest[reading.sensor_type] = reading;
                }
            });
            setLatestData(latest);
        }
    };

    const loadHistory = async (deviceId: string) => {
        const { data } = await supabase
            .from('telemetry')
            .select('time, value, sensor_type')
            .eq('device_id', deviceId)
            .eq('sensor_type', 'temperature')
            .order('time', { ascending: true })
            .limit(30);

        if (data) {
            setHistory(data.map(d => ({
                time: new Date(d.time).toLocaleTimeString(language === 'th' ? 'th-TH' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
                value: d.value
            })));
        }
    };

    const subscribeToRealtime = (deviceId: string) => {
        const channel = supabase
            .channel(`dashboard-${deviceId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'telemetry',
                    filter: `device_id=eq.${deviceId}`
                },
                (payload) => {
                    const newReading = payload.new as SensorReading;
                    setLatestData(prev => ({
                        ...prev,
                        [newReading.sensor_type]: newReading
                    }));

                    if (newReading.sensor_type === 'temperature') {
                        setHistory(prev => {
                            const newPoint = {
                                time: new Date(newReading.time).toLocaleTimeString(language === 'th' ? 'th-TH' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
                                value: newReading.value
                            };
                            return [...prev.slice(1), newPoint];
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    };

    const selectedDeviceData = devices.find(d => d.id === selectedDevice);

    return (
        <DashboardShell>
            <div className="space-y-8 animate-fade-in-up">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{t('healthMonitor')}</h1>
                        <p className="text-[var(--foreground)]/50">{t('monitoring')} {selectedDeviceData?.name || 'Device'}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-full border border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                            <span className="text-[10px] font-black text-emerald-400 tracking-widest">{t('live')}</span>
                        </div>
                        <select
                            value={selectedDevice}
                            onChange={(e) => setSelectedDevice(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[var(--accent-primary)]/50 outline-none transition-all cursor-pointer"
                        >
                            {devices.map(d => (
                                <option key={d.id} value={d.id} className="bg-[#050b0a]">{d.name}</option>
                            ))}
                        </select>
                        <button className="p-2 glass rounded-xl border border-white/10 hover:bg-white/10 transition-all active:scale-95 shadow-lg group">
                            <RefreshCcw className="w-5 h-5 text-[var(--accent-primary)] group-active:rotate-180 transition-transform duration-500" />
                        </button>
                    </div>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title={t('temperature')}
                        value={latestData.temperature?.value}
                        unit="°C"
                        icon={Thermometer}
                        color="emerald"
                        trend="+1.2"
                    />
                    <StatCard
                        title={t('humidity')}
                        value={latestData.humidity?.value}
                        unit="%"
                        icon={Droplets}
                        color="blue"
                        trend="-0.5"
                    />
                    <StatCard
                        title={t('soilMoisture')}
                        value={latestData.soil_moisture?.value}
                        unit="%"
                        icon={Sprout}
                        color="green"
                        trend="+3.4"
                    />
                    <StatCard
                        title={t('lightLevel')}
                        value={latestData.light_lux?.value}
                        unit="lux"
                        icon={Sun}
                        color="yellow"
                        trend="+12"
                    />
                </div>

                {/* Middle Content Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Real-time Chart */}
                    <div className="lg:col-span-2 glass-card rounded-3xl border border-white/10 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-[var(--accent-primary)]" />
                                    Environmental Trends
                                </h3>
                                <p className="text-xs text-[var(--foreground)]/40">Real-time analysis</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 rounded-lg bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-bold border border-[var(--accent-primary)]/30 shadow-lg shadow-[var(--glow-color)]/20">1H</button>
                                <button className="px-3 py-1 rounded-lg hover:bg-white/5 text-[var(--foreground)]/40 text-xs font-bold transition-all">24H</button>
                            </div>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={history}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                                    <XAxis
                                        dataKey="time"
                                        stroke="#ffffff20"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        minTickGap={30}
                                    />
                                    <YAxis
                                        stroke="#ffffff20"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(v) => `${v}°`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--bg-secondary)',
                                            borderRadius: '16px',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                        }}
                                        itemStyle={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="var(--accent-primary)"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Active Extension: AI Crop Health */}
                    <div className="space-y-6">
                        <AICropMonitor />

                        <div className="glass-card rounded-3xl border border-white/10 p-6">
                            <h3 className="text-lg font-bold mb-4">{t('quickActions')}</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all text-emerald-400 group">
                                    <Droplets className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{t('irrigation')}</span>
                                </button>
                                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition-all text-yellow-400 group">
                                    <Sun className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{t('lights')}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recent Alerts / Logs */}
                    <div className="glass-card rounded-3xl border border-white/10 overflow-hidden">
                        <div className="px-8 py-6 border-b border-white/5 bg-white/2 flex items-center justify-between">
                            <h3 className="font-bold flex items-center gap-2 text-lg">
                                <AlertCircle className="w-5 h-5 text-[var(--accent-primary)]" />
                                {t('activityAlerts')}
                            </h3>
                            <span className="text-xs text-[var(--foreground)]/40 font-medium">{t('last24h')}</span>
                        </div>
                        <div className="divide-y divide-white/5">
                            <LogItem
                                time="10:45 AM"
                                type="Auto"
                                message={language === 'th' ? "เริ่มรดน้ำ: ความชื้นดิน (28%) ต่ำกว่าเกณฑ์ (30%)" : "Irrigation started: Soil moisture (28%) below threshold (30%)"}
                                status="success"
                            />
                            <LogItem
                                time="09:12 AM"
                                type="System"
                                message={language === 'th' ? "อุปกรณ์ PWR-003 สลับไปใช้ Local Hub เนื่องอินเทอร์เน็ตไม่เสถียร" : "Device PWR-003 switched to Local Hub due to internet instability"}
                                status="warning"
                            />
                            <LogItem
                                time="08:00 AM"
                                type="Manual"
                                message={language === 'th' ? "ผู้ใช้ 'Pro Farmer' อัปเดตแผนการปลูกเป็น 'Vertical Garden v2'" : "User 'Pro Farmer' updated growth plan to 'Vertical Garden v2'"}
                                status="info"
                            />
                        </div>
                    </div>
                </div>
        </DashboardShell>
    );
}

function StatCard({ title, value, unit, icon: Icon, color, trend }: any) {
    const colors: any = {
        emerald: "from-emerald-400 to-teal-600 shadow-emerald-500/20",
        blue: "from-blue-400 to-indigo-600 shadow-blue-500/20",
        green: "from-green-400 to-emerald-600 shadow-green-500/20",
        yellow: "from-yellow-400 to-orange-600 shadow-yellow-500/20",
    };

    const isTrendUp = trend.startsWith('+');

    return (
        <div className="glass-card rounded-3xl border border-white/10 p-6 group hover:border-[var(--accent-primary)]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--glow-color)]/10">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${colors[color]} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                    {isTrendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trend}%
                </div>
            </div>

            <p className="text-sm font-medium text-emerald-200/40 mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">
                    {value !== undefined ? value.toFixed(1) : '--'}
                </span>
                <span className="text-lg font-bold text-emerald-200/40">{unit}</span>
            </div>
        </div >
    );
}

function StatusRow({ label, value, color, icon: Icon }: any) {
    return (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 text-${color}-400`} />
                <span className="text-sm text-emerald-100/60">{label}</span>
            </div>
            <span className={`text-sm font-bold text-${color}-400`}>{value}</span>
        </div>
    );
}

function LogItem({ time, type, message, status }: any) {
    const statusColors: any = {
        success: "bg-emerald-500/20 text-emerald-400",
        warning: "bg-yellow-500/20 text-yellow-400",
        info: "bg-blue-500/20 text-blue-400",
    }

    return (
        <div className="px-8 py-4 flex items-center gap-6 hover:bg-white/5 transition-all">
            <span className="text-xs font-bold text-emerald-200/20 w-20">{time}</span>
            <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${statusColors[status]}`}>
                {type}
            </div>
            <p className="text-sm text-emerald-100/70 flex-1">{message}</p>
        </div>
    );
}
