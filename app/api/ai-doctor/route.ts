import { NextResponse } from 'next/server';
import { getAIDoctorAdvice } from '@/lib/ai-doctor';

export async function POST(req: Request) {
    try {
        const { healthData, userProfile } = await req.json();

        // ในระบบจริง ข้อมูล userProfile ควรดึงจาก Session/Database
        // เพื่อความปลอดภัยและป้องกันการปลอมแปลง Credit
        const adviceResult = await getAIDoctorAdvice(healthData, userProfile);

        return NextResponse.json(adviceResult);
    } catch (error) {
        return NextResponse.json(
            { error: 'failed', message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
