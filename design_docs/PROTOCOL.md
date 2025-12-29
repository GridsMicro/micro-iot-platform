# Smart Farm IoT Communication Protocol

## Overview

โปรโตคอลมาตรฐานสำหรับการสื่อสารระหว่าง Hardware และ Platform

---

## Message Format (JSON)

### 1. Telemetry Data (Hardware → Platform)

**Topic**: `farm/{device_id}/telemetry`

**Payload Structure:**
```json
{
  "device_id": "ESP32_001",
  "timestamp": 1704000000,
  "sensors": {
    "temperature": 28.5,
    "humidity": 65.0,
    "soil_moisture": 45,
    "light_lux": 35000,
    "ph": 6.5,
    "tds": 450
  },
  "battery_voltage": 3.7,
  "rssi": -65
}
```

**Field Specifications:**

| Field | Type | Unit | Range | Required |
|-------|------|------|-------|----------|
| `device_id` | string | - | - | ✅ |
| `timestamp` | integer | Unix epoch | - | ✅ |
| `sensors.temperature` | float | °C | -40 to 80 | ❌ |
| `sensors.humidity` | float | % | 0 to 100 | ❌ |
| `sensors.soil_moisture` | integer | % | 0 to 100 | ❌ |
| `sensors.light_lux` | integer | lux | 0 to 100000 | ❌ |
| `sensors.ph` | float | pH | 0 to 14 | ❌ |
| `sensors.tds` | integer | ppm | 0 to 5000 | ❌ |
| `battery_voltage` | float | V | 0 to 5 | ❌ |
| `rssi` | integer | dBm | -120 to 0 | ❌ |

---

### 2. Device Status (Hardware → Platform)

**Topic**: `farm/{device_id}/status`

**Payload:**
```json
{
  "device_id": "ESP32_001",
  "status": "online",
  "uptime": 3600,
  "firmware_version": "1.0.0",
  "free_memory": 45000,
  "last_restart_reason": "power_on"
}
```

---

### 3. Commands (Platform → Hardware)

**Topic**: `farm/{device_id}/command`

**Payload:**
```json
{
  "command": "set_relay",
  "params": {
    "relay_id": 1,
    "state": "ON",
    "duration": 300
  },
  "request_id": "cmd_12345"
}
```

**Supported Commands:**

| Command | Description | Params |
|---------|-------------|--------|
| `set_relay` | Control relay | `relay_id`, `state`, `duration` |
| `set_threshold` | Update sensor threshold | `sensor`, `min`, `max` |
| `restart` | Restart device | - |
| `update_interval` | Change data send interval | `interval` (seconds) |
| `calibrate_sensor` | Calibrate sensor | `sensor`, `value` |

---

### 4. Command Response (Hardware → Platform)

**Topic**: `farm/{device_id}/response`

**Payload:**
```json
{
  "request_id": "cmd_12345",
  "status": "success",
  "message": "Relay 1 turned ON for 300 seconds",
  "timestamp": 1704000000
}
```

---

## Data Validation Rules

### Temperature
```typescript
const validateTemperature = (value: number): boolean => {
  return value >= -40 && value <= 80;
};
```

### Humidity
```typescript
const validateHumidity = (value: number): boolean => {
  return value >= 0 && value <= 100;
};
```

### Soil Moisture
```typescript
const validateSoilMoisture = (value: number): boolean => {
  return value >= 0 && value <= 100;
};
```

### pH
```typescript
const validatePH = (value: number): boolean => {
  return value >= 0 && value <= 14;
};
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 1001 | Invalid device_id | Device ID not found |
| 1002 | Invalid timestamp | Timestamp out of range |
| 1003 | Invalid sensor value | Value outside valid range |
| 1004 | Missing required field | Required field not present |
| 1005 | Authentication failed | Invalid token |
| 2001 | Command not supported | Unknown command |
| 2002 | Invalid parameters | Command params invalid |

---

## QoS Levels

**MQTT QoS:**
- **Telemetry**: QoS 0 (Fire and forget) - OK to lose some data
- **Commands**: QoS 1 (At least once) - Important
- **Status**: QoS 1 (At least once)

---

## Retained Messages

**Retained:**
- `farm/{device_id}/status` - Last known status
- `farm/{device_id}/config` - Device configuration

**Not Retained:**
- `farm/{device_id}/telemetry` - Real-time data
- `farm/{device_id}/command` - One-time commands

---

## Authentication

**MQTT Username**: `{device_id}`  
**MQTT Password**: `{device_token}` (from Supabase `devices` table)

**Example:**
```
Username: ESP32_001
Password: a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

---

## Rate Limiting

**Telemetry**: Max 1 message per 5 seconds (recommended)  
**Commands**: Max 10 commands per minute  
**Status**: Max 1 message per 60 seconds

---

## Example: Complete Flow

### 1. Device Sends Telemetry
```json
// Topic: farm/ESP32_001/telemetry
{
  "device_id": "ESP32_001",
  "timestamp": 1704000000,
  "sensors": {
    "temperature": 28.5,
    "humidity": 65.0,
    "soil_moisture": 35
  },
  "rssi": -65
}
```

### 2. Platform Detects Low Soil Moisture
```javascript
// Backend logic
if (data.sensors.soil_moisture < 40) {
  sendCommand('ESP32_001', {
    command: 'set_relay',
    params: { relay_id: 1, state: 'ON', duration: 600 }
  });
}
```

### 3. Platform Sends Command
```json
// Topic: farm/ESP32_001/command
{
  "command": "set_relay",
  "params": {
    "relay_id": 1,
    "state": "ON",
    "duration": 600
  },
  "request_id": "cmd_12345"
}
```

### 4. Device Executes & Responds
```json
// Topic: farm/ESP32_001/response
{
  "request_id": "cmd_12345",
  "status": "success",
  "message": "Relay 1 ON for 600s",
  "timestamp": 1704000005
}
```

---

## Backward Compatibility

**Version Header:**
```json
{
  "protocol_version": "1.0",
  "device_id": "ESP32_001",
  ...
}
```

Platform will support:
- v1.0 (current)
- v0.9 (legacy, deprecated 2025-06-01)

---

**Last Updated**: 2025-12-29  
**Version**: 1.0
