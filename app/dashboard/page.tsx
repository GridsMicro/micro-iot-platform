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
    Circle,
    ChevronRight,
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

import mqtt from 'mqtt';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function DashboardPage() {
    const { t, language } = useLanguage();
    const [latestData, setLatestData] = useState<Record<string, SensorReading>>({});
    const [devices, setDevices] = useState<Device[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [history, setHistory] = useState<any[]>([]);
    const [mqttStatus, setMqttStatus] = useState<'connected' | 'disconnected'>('disconnected');

    useEffect(() => {
        loadDevices();
    }, []);

    // MQTT Real-time Connection
    useEffect(() => {
        if (!selectedDevice) return;

        const client = mqtt.connect(process.env.NEXT_PUBLIC_MQTT_BROKER_URL!, {
            username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
            password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
            clientId: `web_client_${Math.random().toString(16).substring(2, 10)}`,
        });

        client.on('connect', () => {
            console.log('📡 Connected to EMQX Cloud');
            setMqttStatus('connected');
            // Subscribe to all telemetry for this device
            client.subscribe(`telemetry/${selectedDevice}/#`);
        });

        client.on('message', (topic, message) => {
            try {
                const payload = JSON.parse(message.toString());
                const sensorType = topic.split('/').pop(); // telemetry/device_id/temperature -> temperature

                if (sensorType && payload.value !== undefined) {
                    const newReading: SensorReading = {
                        sensor_type: sensorType,
                        value: payload.value,
                        time: new Date().toISOString()
                    };

                    setLatestData(prev => ({
                        ...prev,
                        [sensorType]: newReading
                    }));

                    if (sensorType === 'temperature') {
                        setHistory(prev => {
                            const newPoint = {
                                time: new Date().toLocaleTimeString(language === 'th' ? 'th-TH' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                                value: payload.value
                            };
                            return [...prev.slice(-29), newPoint];
                        });
                    }
                }
            } catch (e) {
                console.error('Failed to parse MQTT message', e);
            }
        });

        client.on('error', (err) => {
            console.error('MQTT Connection Error:', err);
            setMqttStatus('disconnected');
        });

        return () => {
            client.end();
        };
    }, [selectedDevice, language]);

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
                        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase font-montserrat">{t('healthMonitor')}</h1>
                        <p className="text-[var(--foreground)]/50 font-medium tracking-wide">{t('monitoring')} {selectedDeviceData?.name || 'Device'}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 glass rounded-2xl border border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                            <span className="text-[11px] font-black text-emerald-400 tracking-[0.2em]">{t('live')}</span>
                        </div>
                        <select
                            value={selectedDevice}
                            onChange={(e) => setSelectedDevice(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm font-semibold focus:ring-2 focus:ring-[var(--accent-primary)]/50 outline-none transition-all cursor-pointer backdrop-blur-xl hover:bg-white/10"
                        >
                            {devices.map(d => (
                                <option key={d.id} value={d.id} className="bg-[#050b0a] text-white py-2">{d.name}</option>
                            ))}
                        </select>
                        <button className="p-3 glass rounded-2xl border border-white/10 hover:bg-white/10 transition-all active:scale-90 shadow-xl group">
                            <RefreshCcw className="w-5 h-5 text-[var(--accent-primary)] group-active:rotate-180 transition-transform duration-700" />
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
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between pb-8">
                            <div>
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-[var(--accent-primary)]/10">
                                        <Activity className="w-5 h-5 text-[var(--accent-primary)]" />
                                    </div>
                                    Environmental Trends
                                </CardTitle>
                                <p className="text-xs text-[var(--foreground)]/40 mt-1">Global historical analysis</p>
                            </div>
                            <div className="flex gap-2 p-1 bg-black/20 rounded-xl border border-white/5">
                                <button className="px-4 py-1.5 rounded-lg bg-[var(--accent-primary)] text-black text-xs font-black transition-all shadow-lg shadow-[var(--glow-color)]/20">1H</button>
                                <button className="px-4 py-1.5 rounded-lg hover:bg-white/5 text-[var(--foreground)]/40 text-xs font-bold transition-all">24H</button>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="h-[320px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={history}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                                        <XAxis
                                            dataKey="time"
                                            stroke="#ffffff20"
                                            fontSize={11}
                                            tickLine={false}
                                            axisLine={false}
                                            minTickGap={30}
                                        />
                                        <YAxis
                                            stroke="#ffffff20"
                                            fontSize={11}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(v) => `${v}°`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(2, 6, 23, 0.95)',
                                                borderRadius: '20px',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                                                backdropFilter: 'blur(20px)'
                                            }}
                                            itemStyle={{ color: 'var(--accent-primary)', fontWeight: '800', fontSize: '14px' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="var(--accent-primary)"
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#colorValue)"
                                            animationDuration={2000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sidebar components */}
                    <div className="space-y-8">
                        <AICropMonitor />

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Quick Controls</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                <button className="flex flex-col items-center justify-center gap-3 p-5 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/15 hover:border-emerald-500/30 transition-all text-emerald-400 group relative overflow-hidden">
                                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />
                                    <Droplets className="w-7 h-7 group-hover:scale-110 transition-transform relative z-10" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] relative z-10">{t('irrigation')}</span>
                                </button>
                                <button className="flex flex-col items-center justify-center gap-3 p-5 rounded-3xl bg-yellow-500/5 border border-yellow-500/10 hover:bg-yellow-500/15 hover:border-yellow-500/30 transition-all text-yellow-400 group relative overflow-hidden">
                                    <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />
                                    <Sun className="w-7 h-7 group-hover:scale-110 transition-transform relative z-10" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] relative z-10">{t('lights')}</span>
                                </button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* System Activity Logs - Full Width Below */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-[var(--accent-primary)]" />
                            {t('activityAlerts')}
                        </CardTitle>
                        <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">{t('last24h')}</span>
                    </CardHeader>
                    <CardContent className="p-0">
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
                                message={language === 'th' ? "อุปกรณ์ PWR-003 เชื่อมต่อกับ Local Hub เรียบร้อยแล้ว" : "Device PWR-003 connected to Local Hub successfully"}
                                status="info"
                            />
                            <LogItem
                                time="04:08 AM"
                                type="Manual"
                                message={language === 'th' ? "ผู้ใช้ 'Pro Farmer' อนุมัติแผนเพาะปลูก 'Vertical Garden v2'" : "User 'Pro Farmer' approved planting plan 'Vertical Garden v2'"}
                                status="info"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
        </DashboardShell>
    );
}

function StatCard({ title, value, unit, icon: Icon, color, trend }: any) {
    const isTrendUp = trend.startsWith('+');

    return (
        <Card className="group">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className={cn(
                    "p-3 rounded-2xl shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                    color === 'emerald' && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                    color === 'blue' && "bg-blue-500/10 text-blue-400 border border-blue-500/20",
                    color === 'green' && "bg-green-500/10 text-green-400 border border-green-500/20",
                    color === 'yellow' && "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
                )}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className={cn(
                    "flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-lg",
                    isTrendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                )}>
                    {isTrendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trend}%
                </div>
            </CardHeader>

            <CardContent>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{title}</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white tracking-tighter">
                        {value !== undefined ? value.toFixed(1) : '--'}
                    </span>
                    <span className="text-sm font-bold text-slate-500 uppercase">{unit}</span>
                </div>
            </CardContent>
        </Card>
    );
}

function LogItem({ time, type, message, status }: any) {
    const statusColors: any = {
        success: "text-emerald-400",
        warning: "text-yellow-400",
        info: "text-blue-400",
    }

    return (
        <div className="px-8 py-5 flex items-center gap-6 hover:bg-white/[0.02] transition-all group">
            <span className="text-[10px] font-black text-slate-600 w-20 tracking-widest">{time}</span>
            <div className={cn(
                "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.22em] border",
                status === 'success' && "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                status === 'warning' && "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
                status === 'info' && "bg-blue-500/10 border-blue-500/20 text-blue-400",
            )}>
                {type}
            </div>
            <p className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors flex-1">{message}</p>
            <ChevronRight className="w-4 h-4 text-slate-700 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
        </div>
    );
}
