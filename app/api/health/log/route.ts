import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { userId, metrics, advice } = await req.json();

        const { data, error } = await supabase
            .from('health_logs')
            .insert([
                {
                    user_id: userId,
                    heart_rate: metrics.heartRate,
                    spo2: metrics.spo2,
                    temperature: metrics.temp,
                    ai_advice: advice,
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) throw error;

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('Save Health Log Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
