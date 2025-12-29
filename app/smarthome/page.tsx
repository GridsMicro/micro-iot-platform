import Link from "next/link";
import PageLayout from "@/components/layout/PageLayout";
import Card from "@/components/ui/Card";

export default function SmartHomePage() {
    return (
        <PageLayout
            title="Smart Home & Urban Farming"
            subtitle="Bringing nature into your living space with intelligent automation."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Indoor Garden Control */}
                <Card
                    title="Indoor Garden"
                    icon="🪴"
                    gradient="from-emerald-500/20 to-teal-500/20"
                >
                    <div className="space-y-4">
                        <p className="text-emerald-100/70 text-sm">
                            Manage your hydroponic systems, grow lights, and nutrient delivery from one place.
                        </p>
                        <div className="flex justify-between items-center p-3 glass rounded-xl border border-white/10">
                            <span className="text-emerald-200">Grow Lights</span>
                            <span className="text-emerald-400 font-bold">ON</span>
                        </div>
                        <div className="flex justify-between items-center p-3 glass rounded-xl border border-white/10">
                            <span className="text-emerald-200">Soil Moisture</span>
                            <span className="text-emerald-400 font-bold">45%</span>
                        </div>
                    </div>
                </Card>

                {/* Climate Control */}
                <Card
                    title="Living Climate"
                    icon="🌡️"
                    gradient="from-blue-500/20 to-cyan-500/20"
                >
                    <div className="space-y-4">
                        <p className="text-emerald-100/70 text-sm">
                            Combine smart home comfort with optimal growing conditions for your indoor plants.
                        </p>
                        <div className="flex justify-between items-center p-3 glass rounded-xl border border-white/10">
                            <span className="text-emerald-200">Temperature</span>
                            <span className="text-emerald-400 font-bold">24.5°C</span>
                        </div>
                        <div className="flex justify-between items-center p-3 glass rounded-xl border border-white/10">
                            <span className="text-emerald-200">Humidity</span>
                            <span className="text-emerald-400 font-bold">60%</span>
                        </div>
                    </div>
                </Card>

                {/* Energy Monitoring */}
                <Card
                    title="Energy Efficiency"
                    icon="⚡"
                    gradient="from-yellow-500/20 to-orange-500/20"
                >
                    <div className="space-y-4">
                        <p className="text-emerald-100/70 text-sm">
                            Monitor energy usage of your grow lights and smart appliances in real-time.
                        </p>
                        <div className="flex justify-between items-center p-3 glass rounded-xl border border-white/10">
                            <span className="text-emerald-200">Current Load</span>
                            <span className="text-emerald-400 font-bold">120W</span>
                        </div>
                        <div className="flex justify-between items-center p-3 glass rounded-xl border border-white/10">
                            <span className="text-emerald-200">Daily Total</span>
                            <span className="text-emerald-400 font-bold">2.4 kWh</span>
                        </div>
                    </div>
                </Card>

                {/* Automation Rules */}
                <Card
                    title="Home Routines"
                    icon="⚙️"
                    gradient="from-purple-500/20 to-pink-500/20"
                >
                    <div className="space-y-4">
                        <p className="text-emerald-100/70 text-sm">
                            Custom routines that sync your home life with your plant's schedule.
                        </p>
                        <ul className="space-y-2 text-xs text-emerald-200/60">
                            <li>• Sunrise: Gradually dim grow lights</li>
                            <li>• 10:00 PM: Activate silent pump mode</li>
                            <li>• If Low Water: Send mobile notification</li>
                        </ul>
                    </div>
                </Card>

                {/* Air Quality */}
                <Card
                    title="Air Quality"
                    icon="🌬️"
                    gradient="from-teal-500/20 to-emerald-500/20"
                >
                    <div className="space-y-4">
                        <p className="text-emerald-100/70 text-sm">
                            Indoor plants are natural air purifiers. Watch them improve your home's air.
                        </p>
                        <div className="flex justify-between items-center p-3 glass rounded-xl border border-white/10">
                            <span className="text-emerald-200">CO2 Levels</span>
                            <span className="text-emerald-400 font-bold">450 ppm</span>
                        </div>
                        <div className="flex justify-between items-center p-3 glass rounded-xl border border-white/10">
                            <span className="text-emerald-200">PM2.5</span>
                            <span className="text-emerald-400 font-bold">12 μg/m³</span>
                        </div>
                    </div>
                </Card>

                {/* Community & Shares */}
                <Card
                    title="Urban Harmony"
                    icon="🤝"
                    gradient="from-indigo-500/20 to-purple-500/20"
                >
                    <div className="space-y-4">
                        <p className="text-emerald-100/70 text-sm">
                            Share your indoor harvest with neighbors and join local urban farming groups.
                        </p>
                        <Link href="/community" className="block text-center py-2 glass rounded-xl border border-emerald-500/30 text-emerald-300 text-xs hover:bg-emerald-500/10 transition-all">
                            Join Local Group
                        </Link>
                    </div>
                </Card>
            </div>

            <div className="mt-12 p-8 glass rounded-3xl border border-white/10 text-center animate-fade-in-up">
                <h2 className="text-2xl font-bold text-white mb-4">Start Your Indoor Farm Today</h2>
                <p className="text-emerald-100/70 mb-8 max-w-2xl mx-auto">
                    From kitchen herbs to balcony vertical gardens, the Smart Farm platform
                    makes urban farming easy, automated, and beautiful.
                </p>
                <div className="flex justify-center gap-4">
                    <Link href="/docs/hardware/urban-setup" className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full font-bold transition-all">
                        View Urban Kits
                    </Link>
                    <Link href="/dashboard" className="px-6 py-3 glass border border-white/20 text-white rounded-full font-bold hover:bg-white/10 transition-all">
                        Open Dashboard
                    </Link>
                </div>
            </div>
        </PageLayout>
    );
}
