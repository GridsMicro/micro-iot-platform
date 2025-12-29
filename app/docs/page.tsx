
import Link from 'next/link';

export default function Docs() {
    return (
        <div className="min-h-screen py-10 px-4 sm:px-8 max-w-5xl mx-auto">
            <Link href="/" className="inline-block mb-6 px-4 py-2 glass rounded-full text-sm font-medium hover:bg-opacity-80 transition">
                ← Back to Home
            </Link>

            <header className="mb-12 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-300 dark:to-teal-200">
                    Smart Farm IoT Platform 2025
                </h1>
                <p className="text-xl opacity-90">
                    "Open Hardware, Closed Platform" Strategy
                </p>
            </header>

            <div className="grid gap-8 md:grid-cols-2">

                {/* Strategy Section */}
                <section className="glass-card md:col-span-2">
                    <h2 className="text-2xl font-semibold mb-4 text-emerald-700 dark:text-emerald-300">1. Business Model (The Strategy)</h2>
                    <ul className="space-y-3 list-disc list-inside opacity-90">
                        <li><strong className="text-teal-600 dark:text-teal-400">Target:</strong> Farmers & Makers who want stability + aesthetics for their Smart Farm.</li>
                        <li><strong className="text-teal-600 dark:text-teal-400">Hook:</strong> Content marketing: DIY Sensor tutorials using parts from <strong>Shopee/Lazada</strong> to onboard users.</li>
                        <li><strong className="text-teal-600 dark:text-teal-400">Monetization:</strong> Freemium model. Free basic usage. Subscription for advanced features: Long-term data storage & AI Plant Disease Analysis.</li>
                    </ul>
                </section>

                {/* Architecture Section */}
                <section className="glass-card">
                    <h2 className="text-2xl font-semibold mb-4 text-emerald-700 dark:text-emerald-300">2. Architecture (Stack 2025)</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-bold text-lg">Backend (The Engine)</h3>
                            <p className="opacity-80">Hybrid Cloud Architecture. <strong>EMQX</strong> (MQTT) for Live Data + <strong>Supabase</strong> (PostgreSQL) for User Data & History.</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Frontend (The Face)</h3>
                            <p className="opacity-80"><strong>Next.js</strong> Dashboard. Beautiful, fluid, mobile/tablet ready.</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Connection (The Bridge)</h3>
                            <p className="opacity-80">Custom Library (similar to <strong>Microgear</strong>). Write short code to connect instantly.</p>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="glass-card">
                    <h2 className="text-2xl font-semibold mb-4 text-emerald-700 dark:text-emerald-300">3. Winning Features</h2>
                    <ul className="space-y-3 opacity-90">
                        <li className="flex items-start">
                            <span className="mr-2">✨</span>
                            <span><strong>No-Code Automation:</strong> Drag & drop logic (e.g., Soil Dry &gt; Pump ON).</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">🔌</span>
                            <span><strong>Edge & Cloud:</strong> Local control when offline, Sync when online.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">🎨</span>
                            <span><strong>Personalization:</strong> "Farm Elements" (Earth, Water, Wind, Fire) themes.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">🔒</span>
                            <span><strong>Secure Multi-tenancy:</strong> Isolated access for User A vs User B, plus a dedicated <strong>Admin Console</strong> for complete system management.</span>
                        </li>
                    </ul>
                </section>

                {/* Roadmap Section */}
                <section className="glass-card md:col-span-2">
                    <h2 className="text-2xl font-semibold mb-4 text-emerald-700 dark:text-emerald-300">4. Roadmap - Phase 1</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-white/20 rounded-lg">
                            <div className="text-3xl mb-2">☁️</div>
                            <div className="font-bold">Platform First</div>
                            <div className="text-sm opacity-75">Deploy EMQX on Cloud</div>
                        </div>
                        <div className="p-4 bg-white/20 rounded-lg">
                            <div className="text-3xl mb-2">💻</div>
                            <div className="font-bold">Dashboard</div>
                            <div className="text-sm opacity-75">Next.js Device Mgmt</div>
                        </div>
                        <div className="p-4 bg-white/20 rounded-lg">
                            <div className="text-3xl mb-2">📚</div>
                            <div className="font-bold">Library</div>
                            <div className="text-sm opacity-75">Arduino/ESP32 Lib</div>
                        </div>
                        <div className="p-4 bg-white/20 rounded-lg">
                            <div className="text-3xl mb-2">🎥</div>
                            <div className="font-bold">Marketing</div>
                            <div className="text-sm opacity-75">Content Creation</div>
                        </div>
                    </div>
                </section>

                {/* Hardware Compatibility */}
                <section className="glass-card md:col-span-2">
                    <h2 className="text-2xl font-semibold mb-4 text-emerald-700 dark:text-emerald-300">Supported Hardware</h2>
                    <div className="grid md:grid-cols-2 gap-4 opacity-90">
                        <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-lg border border-emerald-100 dark:border-emerald-900">
                            <h3 className="font-bold text-lg mb-2 text-emerald-800 dark:text-emerald-400">✅ Recommended</h3>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li><strong>ESP32 DevKit V1</strong> (Best for beginners - Built-in WiFi)</li>
                                <li><strong>ESP32-S3</strong> (High performance, AI capable)</li>
                                <li><strong>ESP32-C3</strong> (Miniature, Low power)</li>
                                <li><strong>ESP8266 / NodeMCU v2/v3</strong> (Budget option)</li>
                                <li><strong>Wemos D1 Mini</strong> (Compact deployments)</li>
                                <li><strong>STM32F103C8T6 "Blue Pill"</strong> (Industrial grade, requires WiFi module)</li>
                                <li><strong>STM32F401CCU6 "Black Pill"</strong> (More powerful STM32)</li>
                            </ul>
                        </div>
                        <div className="p-4 bg-red-50/50 dark:bg-red-950/30 rounded-lg border border-red-100 dark:border-red-900">
                            <h3 className="font-bold text-lg mb-2 text-red-800 dark:text-red-400">❌ Not Supported (Directly)</h3>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li><strong>Arduino Uno / Mega / Nano</strong> (No built-in WiFi. Requires external modules which complicates the code)</li>
                                <li><strong>Raspberry Pi Pico (Non-W)</strong> (No WiFi)</li>
                                <li><strong>Micro:bit</strong> (Limited network stack)</li>
                            </ul>
                            <p className="mt-2 text-xs opacity-75">
                                *Note: Standard Raspberry Pi (3/4/5) can be used but requires a Python script instead of our C++ Library.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Hardware Setup Guide */}
                <section className="glass-card md:col-span-2">
                    <h2 className="text-2xl font-semibold mb-4 text-emerald-700 dark:text-emerald-300">5. Hardware Setup Guide</h2>
                    <div className="space-y-4 opacity-90">
                        <p>Follow our standard "Smart Farm Kit" wiring to ensure compatibility with the library.</p>

                        <div className="bg-black/5 p-4 rounded-lg dark:bg-white/5">
                            <h3 className="font-bold text-lg mb-2">Basic Sensor Node (ESP32)</h3>
                            <ul className="list-disc list-inside space-y-2">
                                <li><strong>DHT22 (Temp/Hum):</strong> Pin 1 (VCC 3.3V), Pin 2 (Data -&gt; GPIO 4), Pin 4 (GND)</li>
                                <li><strong>Relay Module (Pump):</strong> VCC (5V), GND, IN -&gt; GPIO 5</li>
                                <li><strong>Soil Moisture (Capacitive):</strong> VCC (3.3V), GND, AOUT -&gt; GPIO 34 (Analog)</li>
                            </ul>
                        </div>
                        <p className="text-sm italic text-gray-500">
                            *Tip: Use a waterproof box if deploying outdoors. Check our video tutorials for assembly.
                        </p>
                    </div>
                </section>

                {/* Library API Reference */}
                <section className="glass-card">
                    <h2 className="text-2xl font-semibold mb-4 text-emerald-700 dark:text-emerald-300">6. Library API Reference</h2>
                    <div className="space-y-4">
                        <div>
                            <code className="text-emerald-700 font-bold dark:text-emerald-400">begin(ssid, password)</code>
                            <p className="text-sm opacity-80 pl-4">Connects ESP32 to WiFi and Platform.</p>
                        </div>
                        <div>
                            <code className="text-emerald-700 font-bold dark:text-emerald-400">sendValue(type, value)</code>
                            <p className="text-sm opacity-80 pl-4">Sends sensor data. E.g., <span className="font-mono text-xs">sendValue("temp", 25.5)</span></p>
                        </div>
                        <div>
                            <code className="text-emerald-700 font-bold dark:text-emerald-400">onCommand(callback)</code>
                            <p className="text-sm opacity-80 pl-4">Registers a function to handle server commands (e.g., Turn Pump ON).</p>
                        </div>
                    </div>
                </section>

                {/* Troubleshooting */}
                <section className="glass-card">
                    <h2 className="text-2xl font-semibold mb-4 text-emerald-700 dark:text-emerald-300">7. Troubleshooting</h2>
                    <ul className="space-y-3 opacity-90 text-sm">
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 font-bold">❌</span>
                            <span><strong>Cannot Connect to WiFi:</strong> Check SSID/Password case sensitivity. Ensure 2.4GHz network.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 font-bold">❌</span>
                            <span><strong>MQTT Auth Failed:</strong> Verify your `Device ID` and `Secret Key` in the sketch match the Dashboard.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-500 font-bold">⚠️</span>
                            <span><strong>Sensor Value 0/NaN:</strong> Check loose wiring. Re-plug the sensor while ESP32 is off.</span>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
