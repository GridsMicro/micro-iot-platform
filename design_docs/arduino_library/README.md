# SmartFarmIoT Library

## ⚠️ MANDATORY LIBRARY - REQUIRED FOR CONNECTION

**This library is REQUIRED to connect to Smart Farm IoT Platform.**

Without this library, your device **CANNOT** communicate with the platform. The library enforces standardized data formats, authentication, and communication protocols.

---

## Why This Library is Required?

### 1. **Standardized Communication Protocol**
- All devices must send data in the exact JSON format
- Automatic validation of sensor values
- Proper MQTT topic structure
- Version compatibility checking

### 2. **Security & Authentication**
- Device token management
- Encrypted communication
- Automatic reconnection with authentication

### 3. **Data Quality Assurance**
- Sensor value validation (range checking)
- Timestamp synchronization
- Error handling and reporting

### 4. **Platform Compatibility**
- Guaranteed compatibility with platform updates
- Automatic protocol version negotiation
- Backward compatibility support

---

## Installation

### Method 1: Arduino Library Manager (Recommended)

1. Open Arduino IDE
2. Go to: `Sketch` → `Include Library` → `Manage Libraries`
3. Search: **"SmartFarmIoT"**
4. Click **Install**

### Method 2: Manual Installation

1. Download the library: [SmartFarmIoT.zip](https://github.com/GridsMicro/SmartFarmIoT/releases)
2. In Arduino IDE: `Sketch` → `Include Library` → `Add .ZIP Library`
3. Select the downloaded file

### Method 3: Git Clone

```bash
cd ~/Arduino/libraries/
git clone https://github.com/GridsMicro/SmartFarmIoT.git
```

---

## Quick Start

### 1. Include the Library

```cpp
#include <SmartFarmIoT.h>
#include <SmartFarmSensors.h>
```

### 2. Get Your Device Credentials

1. Login to [Smart Farm Dashboard](https://smartfarm.io/dashboard)
2. Go to: **Devices** → **Add New Device**
3. Copy your **Device ID** and **Device Token**

### 3. Basic Example

```cpp
#include <SmartFarmIoT.h>

const char* DEVICE_ID = "YOUR_DEVICE_ID";
const char* DEVICE_TOKEN = "YOUR_DEVICE_TOKEN";

SmartFarmIoT iot(DEVICE_ID, DEVICE_TOKEN);

void setup() {
  Serial.begin(115200);
  
  // Connect to platform
  iot.begin("WiFi_SSID", "WiFi_Password", "mqtt.smartfarm.io");
  
  // Register command handler
  iot.onCommand(handleCommand);
}

void loop() {
  iot.loop();
  
  // Send sensor data
  StaticJsonDocument<256> sensors;
  sensors["temperature"] = 28.5;
  sensors["humidity"] = 65.0;
  
  iot.sendTelemetry(sensors.as<JsonObject>());
  
  delay(5000);
}

void handleCommand(String command, JsonObject params) {
  // Handle commands from platform
}
```

---

## What Happens Without This Library?

### ❌ Connection Will Be REJECTED

The platform validates:
1. **Protocol Version** - Must match current version
2. **Data Format** - Must be exact JSON structure
3. **Authentication** - Must use proper token format
4. **Topic Structure** - Must follow `farm/{device_id}/{type}` pattern

**If any of these fail, your device will be disconnected.**

### Example of Manual Connection (WILL FAIL):

```cpp
// ❌ THIS WILL NOT WORK
PubSubClient mqtt;
mqtt.connect("my-device");
mqtt.publish("data", "{temp:25}");  // Wrong format!
// Platform will REJECT this message
```

### With Library (WORKS):

```cpp
// ✅ THIS WORKS
SmartFarmIoT iot("device-id", "token");
iot.begin(...);
iot.sendTelemetry(...);  // Automatically formatted correctly
```

---

## Supported Hardware

- ✅ ESP32 (all variants)
- ✅ ESP8266 / NodeMCU
- ✅ STM32 (with WiFi module)

---

## Supported Sensors

The library includes built-in support for:

### Environment
- DHT22, DHT11 (Temperature & Humidity)
- BH1750 (Light)

### Soil
- Capacitive Soil Moisture
- Resistive Soil Moisture

### Water
- pH Sensor (Analog)
- TDS Sensor
- Ultrasonic (Water Level)
- Flow Rate Sensor (YF-S201)

### Power
- Voltage Sensor (Battery monitoring)
- Current Sensor (ACS712)

---

## API Reference

### Core Functions

#### `SmartFarmIoT(deviceId, deviceToken)`
Create instance with your credentials.

#### `begin(ssid, password, mqttServer, port)`
Connect to WiFi and MQTT broker.

#### `loop()`
Maintain connection (call in `loop()`).

#### `sendTelemetry(JsonObject sensors, float battery, int rssi)`
Send sensor data to platform.

#### `onCommand(callback)`
Register callback for platform commands.

---

## License

**Proprietary License**

This library is proprietary software owned by Smart Farm Platform.

### Terms:
- ✅ **FREE** for personal and commercial use
- ✅ Can be used in your projects
- ❌ **CANNOT** modify or redistribute
- ❌ **CANNOT** reverse engineer
- ❌ **CANNOT** create derivative works

**By using this library, you agree to these terms.**

---

## Support

- 📧 Email: support@smartfarm.io
- 💬 LINE OA: @smartfarm
- 📖 Documentation: https://smartfarm.io/docs
- 🐛 Issues: https://github.com/GridsMicro/SmartFarmIoT/issues

---

## FAQ

### Q: Can I connect without this library?
**A: No.** The platform requires this library for standardized communication.

### Q: Is this library free?
**A: Yes**, the library is free to use. You only pay for platform services (Free tier available).

### Q: Can I modify the library?
**A: No.** The library is proprietary. Modifications will break compatibility.

### Q: What if I need custom sensors?
**A: Use the `SmartFarmSensors` class** which supports custom sensor integration.

### Q: Does this work offline?
**A: No.** The library requires internet connection to communicate with the platform.

---

## Version History

### v1.0.0 (2025-01-01)
- Initial release
- Support for ESP32, ESP8266, STM32
- Basic sensor integration
- MQTT communication
- Command handling

---

**© 2025 Smart Farm Platform. All Rights Reserved.**
