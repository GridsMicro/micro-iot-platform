// types/telemetry.ts
// Data types for Smart Farm IoT Platform

export interface SensorData {
    temperature?: number;      // °C (-40 to 80)
    humidity?: number;         // % (0 to 100)
    soil_moisture?: number;    // % (0 to 100)
    light_lux?: number;        // lux (0 to 100000)
    ph?: number;               // pH (0 to 14)
    tds?: number;              // ppm (0 to 5000)
    co2?: number;              // ppm (0 to 5000)
    water_level?: number;      // cm
    flow_rate?: number;        // L/min
}

export interface TelemetryMessage {
    device_id: string;
    timestamp: number;         // Unix epoch
    sensors: SensorData;
    battery_voltage?: number;  // V (0 to 5)
    rssi?: number;             // dBm (-120 to 0)
    protocol_version?: string; // e.g., "1.0"
}

export interface DeviceStatus {
    device_id: string;
    status: 'online' | 'offline' | 'error';
    uptime: number;            // seconds
    firmware_version: string;
    free_memory?: number;      // bytes
    last_restart_reason?: string;
}

export interface CommandParams {
    relay_id?: number;
    state?: 'ON' | 'OFF';
    duration?: number;         // seconds
    sensor?: string;
    min?: number;
    max?: number;
    value?: number;
    interval?: number;         // seconds
}

export interface Command {
    command: 'set_relay' | 'set_threshold' | 'restart' | 'update_interval' | 'calibrate_sensor';
    params: CommandParams;
    request_id: string;
}

export interface CommandResponse {
    request_id: string;
    status: 'success' | 'error';
    message: string;
    timestamp: number;
}

// Validation functions
export const validateTemperature = (value: number): boolean => {
    return value >= -40 && value <= 80;
};

export const validateHumidity = (value: number): boolean => {
    return value >= 0 && value <= 100;
};

export const validateSoilMoisture = (value: number): boolean => {
    return value >= 0 && value <= 100;
};

export const validatePH = (value: number): boolean => {
    return value >= 0 && value <= 14;
};

export const validateTDS = (value: number): boolean => {
    return value >= 0 && value <= 5000;
};

export const validateLux = (value: number): boolean => {
    return value >= 0 && value <= 100000;
};

export const validateSensorData = (data: SensorData): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (data.temperature !== undefined && !validateTemperature(data.temperature)) {
        errors.push('Temperature out of range (-40 to 80°C)');
    }

    if (data.humidity !== undefined && !validateHumidity(data.humidity)) {
        errors.push('Humidity out of range (0 to 100%)');
    }

    if (data.soil_moisture !== undefined && !validateSoilMoisture(data.soil_moisture)) {
        errors.push('Soil moisture out of range (0 to 100%)');
    }

    if (data.ph !== undefined && !validatePH(data.ph)) {
        errors.push('pH out of range (0 to 14)');
    }

    if (data.tds !== undefined && !validateTDS(data.tds)) {
        errors.push('TDS out of range (0 to 5000 ppm)');
    }

    if (data.light_lux !== undefined && !validateLux(data.light_lux)) {
        errors.push('Light out of range (0 to 100000 lux)');
    }

    return {
        valid: errors.length === 0,
        errors
    };
};
