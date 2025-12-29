// app/api/telemetry/route.ts
// API endpoint to receive telemetry data from MQTT bridge or direct HTTP

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { TelemetryMessage, validateSensorData } from '@/types/telemetry';

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const data: TelemetryMessage = await request.json();

        // Validate required fields
        if (!data.device_id || !data.timestamp || !data.sensors) {
            return NextResponse.json(
                { error: 'Missing required fields: device_id, timestamp, sensors' },
                { status: 400 }
            );
        }

        // Validate sensor data
        const validation = validateSensorData(data.sensors);
        if (!validation.valid) {
            return NextResponse.json(
                { error: 'Invalid sensor data', details: validation.errors },
                { status: 400 }
            );
        }

        // Verify device exists and get farm_id
        const { data: device, error: deviceError } = await supabase
            .from('devices')
            .select('id, farm_id, status')
            .eq('id', data.device_id)
            .single();

        if (deviceError || !device) {
            return NextResponse.json(
                { error: 'Device not found', code: 1001 },
                { status: 404 }
            );
        }

        // Update device status to online
        await supabase
            .from('devices')
            .update({
                status: 'online',
                last_seen: new Date().toISOString()
            })
            .eq('id', data.device_id);

        // Insert telemetry data
        const telemetryRecords = Object.entries(data.sensors).map(([sensor_type, value]) => ({
            device_id: data.device_id,
            sensor_type,
            value: value as number,
            metadata: {
                battery_voltage: data.battery_voltage,
                rssi: data.rssi,
                protocol_version: data.protocol_version
            }
        }));

        const { error: insertError } = await supabase
            .from('telemetry')
            .insert(telemetryRecords);

        if (insertError) {
            console.error('Failed to insert telemetry:', insertError);
            return NextResponse.json(
                { error: 'Failed to store data' },
                { status: 500 }
            );
        }

        // Check automation rules (optional)
        await checkAutomationRules(device.farm_id, data.sensors);

        return NextResponse.json({
            success: true,
            message: 'Telemetry data received',
            records_inserted: telemetryRecords.length
        });

    } catch (error) {
        console.error('Telemetry API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Check and execute automation rules
async function checkAutomationRules(farmId: string, sensors: any) {
    const { data: rules } = await supabase
        .from('automation_rules')
        .select('*')
        .eq('farm_id', farmId)
        .eq('is_active', true);

    if (!rules) return;

    for (const rule of rules) {
        const sensorValue = sensors[rule.condition_field];
        if (sensorValue === undefined) continue;

        let shouldTrigger = false;

        switch (rule.condition_operator) {
            case '>':
                shouldTrigger = sensorValue > rule.condition_value;
                break;
            case '<':
                shouldTrigger = sensorValue < rule.condition_value;
                break;
            case '=':
                shouldTrigger = sensorValue === rule.condition_value;
                break;
        }

        if (shouldTrigger) {
            // TODO: Send command to device via MQTT
            console.log(`🎯 Rule triggered: ${rule.name}`);
            console.log(`Action: ${rule.action_type} on device ${rule.action_device_id}`);
        }
    }
}
