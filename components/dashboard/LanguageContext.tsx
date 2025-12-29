'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'th' | 'en';

interface Translations {
    [key: string]: {
        th: string;
        en: string;
    };
}

const translations: Translations = {
    // Navigation
    overview: { th: 'ภาพรวม', en: 'Overview' },
    liveMonitor: { th: 'มอนิเตอร์สด', en: 'Live Monitor' },
    smarthome: { th: 'บ้านอัจฉริยะ', en: 'Smart Home' },
    marketplace: { th: 'ตลาดซื้อขาย', en: 'Marketplace' },
    myDevices: { th: 'อุปกรณ์ของฉัน', en: 'My Devices' },
    settings: { th: 'ตั้งค่า', en: 'Settings' },
    smartHealth: { th: 'สุขภาพอัจฉริยะ', en: 'Smart Health' },

    // Dashboard
    healthMonitor: { th: 'ติดตามสุขภาพพืช', en: 'Health Monitor' },
    monitoring: { th: 'กำลังติดตาม', en: 'Monitoring' },
    live: { th: 'สด', en: 'LIVE' },
    selectDevice: { th: 'เลือกอุปกรณ์', en: 'Select Device' },

    // Sensors
    temperature: { th: 'อุณหภูมิ', en: 'Temperature' },
    humidity: { th: 'ความชื้น', en: 'Humidity' },
    soilMoisture: { th: 'ความชื้นดิน', en: 'Soil Moisture' },
    lightLevel: { th: 'ระดับแสง', en: 'Light Level' },

    // System Status
    systemHealth: { th: 'สุขภาพระบบ', en: 'System Health' },
    connection: { th: 'การเชื่อมต่อ', en: 'Connection' },
    powerLevel: { th: 'ระดับพลังงาน', en: 'Power Level' },
    cpuLoad: { th: 'ภาระ CPU', en: 'CPU Load' },
    localHub: { th: 'ฮับท้องถิ่น', en: 'Local Hub' },
    stable: { th: 'เสถียร', en: 'Stable' },
    connected: { th: 'เชื่อมต่อแล้ว', en: 'Connected' },

    // Actions
    quickActions: { th: 'สั่งงานด่วน', en: 'Quick Actions' },
    irrigation: { th: 'ระบบรดน้ำ', en: 'Irrigation' },
    lights: { th: 'ไฟส่องสว่าง', en: 'Lights' },

    // Alerts
    activityAlerts: { th: 'กิจกรรมและการแจ้งเตือน', en: 'Activity & Alerts' },
    last24h: { th: '24 ชั่วโมงที่ผ่านมา', en: 'Last 24 hours' },
    templateMode: { th: 'โหมดเทมเพลต', en: 'Template Mode' }
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('th');

    useEffect(() => {
        const savedLang = localStorage.getItem('smartfarm-lang') as Language;
        if (savedLang) {
            setLanguageState(savedLang);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('smartfarm-lang', lang);
    };

    const t = (key: string) => {
        return translations[key]?.[language] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
