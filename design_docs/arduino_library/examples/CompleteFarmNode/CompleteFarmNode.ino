/*
 * Complete Smart Farm Node Example
 * 
 * Hardware Setup:
 * - ESP32 DevKit V1
 * - DHT22 (Temperature & Humidity) → Pin 4
 * - Capacitive Soil Moisture → Pin 34
 * - pH Sensor → Pin 35
 * - TDS Sensor → Pin 32
 * - Ultrasonic (Water Level) → Trig: 5, Echo: 18
 * - Flow Sensor → Pin 2
 * - Voltage Sensor (Battery) → Pin 33
 * - Relay (Pump) → Pin 25
 * 
 * This example demonstrates the STANDARD way to read all sensors
 * and send data to Smart Farm Platform
 */

#include <SmartFarmIoT.h>
#include <SmartFarmSensors.h>

// ==================== DEVICE CREDENTIALS ====================
const char* DEVICE_ID = "FARM_NODE_001";
const char* DEVICE_TOKEN = "your-device-token-here";
const char* WIFI_SSID = "YourWiFi";
const char* WIFI_PASSWORD = "YourPassword";
const char* MQTT_SERVER = "192.168.1.100";

// ==================== SENSOR PINS ====================
#define DHT_PIN 4
#define SOIL_PIN 34
#define PH_PIN 35
#define TDS_PIN 32
#define TRIG_PIN 5
#define ECHO_PIN 18
#define FLOW_PIN 2
#define VOLTAGE_PIN 33
#define RELAY_PIN 25

// ==================== SENSOR INSTANCES ====================
SmartFarmIoT iot(DEVICE_ID, DEVICE_TOKEN);

// Environment Sensors
TemperatureHumiditySensor tempHumidity(DHT_PIN, DHT22);

// Soil Sensors
SoilMoistureSensor soilMoisture(SOIL_PIN);

// Water Quality Sensors
PHSensor phSensor(PH_PIN);
TDSSensor tdsSensor(TDS_PIN);

// Water Level & Flow
WaterLevelSensor waterLevel(TRIG_PIN, ECHO_PIN, 100);  // 100cm tank
FlowRateSensor flowRate(FLOW_PIN, 7.5);  // YF-S201 sensor

// Power Monitoring
VoltageSensor battery(VOLTAGE_PIN, 0.5, 3.3);  // Voltage divider 1:1

// ==================== TIMING ====================
unsigned long lastSendTime = 0;
const unsigned long SEND_INTERVAL = 5000;  // 5 seconds

// ==================== SETUP ====================
void setup() {
    Serial.begin(115200);
    Serial.println("\n🌱 Smart Farm Node Starting...");
    
    // Initialize sensors
    Serial.println("📡 Initializing sensors...");
    tempHumidity.begin();
    soilMoisture.calibrate(4095, 1500);  // Calibrate for your soil
    waterLevel.readDistance();  // First read to initialize
    flowRate.begin();
    
    // Initialize relay
    pinMode(RELAY_PIN, OUTPUT);
    digitalWrite(RELAY_PIN, LOW);
    
    // Connect to platform
    Serial.println("🌐 Connecting to Smart Farm Platform...");
    iot.begin(WIFI_SSID, WIFI_PASSWORD, MQTT_SERVER);
    iot.onCommand(handleCommand);
    
    Serial.println("✅ Smart Farm Node Ready!");
    Serial.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

// ==================== MAIN LOOP ====================
void loop() {
    iot.loop();
    
    if (millis() - lastSendTime >= SEND_INTERVAL) {
        readAndSendAllSensors();
        lastSendTime = millis();
    }
}

// ==================== READ ALL SENSORS (STANDARD METHOD) ====================
void readAndSendAllSensors() {
    Serial.println("\n📊 Reading All Sensors...");
    
    // Create JSON document for sensors
    StaticJsonDocument<512> sensors;
    
    // 1. TEMPERATURE & HUMIDITY
    float temperature = tempHumidity.readTemperature();
    float humidity = tempHumidity.readHumidity();
    
    if (tempHumidity.isValid(temperature)) {
        sensors["temperature"] = temperature;
        Serial.printf("  🌡️  Temperature: %.1f°C\n", temperature);
    }
    
    if (tempHumidity.isValid(humidity)) {
        sensors["humidity"] = humidity;
        Serial.printf("  💧 Humidity: %.1f%%\n", humidity);
    }
    
    // 2. SOIL MOISTURE
    int soilMoistureValue = soilMoisture.readMoisture();
    sensors["soil_moisture"] = soilMoistureValue;
    Serial.printf("  🌱 Soil Moisture: %d%%\n", soilMoistureValue);
    
    // 3. WATER QUALITY
    float ph = phSensor.readPH();
    if (ph >= 0 && ph <= 14) {
        sensors["ph"] = ph;
        Serial.printf("  ⚗️  pH Level: %.2f\n", ph);
    }
    
    // Update TDS sensor with current temperature
    tdsSensor.setTemperature(temperature);
    float tds = tdsSensor.readTDS();
    if (tds >= 0 && tds <= 5000) {
        sensors["tds"] = tds;
        Serial.printf("  🧪 TDS: %.0f ppm\n", tds);
    }
    
    // 4. WATER LEVEL
    float waterLevelCm = waterLevel.readLevel();
    int waterLevelPercent = waterLevel.readPercent();
    sensors["water_level"] = waterLevelCm;
    Serial.printf("  💦 Water Level: %.1f cm (%d%%)\n", waterLevelCm, waterLevelPercent);
    
    // 5. FLOW RATE
    float flow = flowRate.readFlowRate();
    if (flow > 0) {
        sensors["flow_rate"] = flow;
        Serial.printf("  🚰 Flow Rate: %.2f L/min\n", flow);
    }
    
    // 6. BATTERY VOLTAGE
    float batteryVoltage = battery.readVoltage();
    int batteryPercent = battery.readPercent(3.0, 4.2);
    Serial.printf("  🔋 Battery: %.2fV (%d%%)\n", batteryVoltage, batteryPercent);
    
    // 7. SEND TO PLATFORM
    bool success = iot.sendTelemetry(sensors.as<JsonObject>(), batteryVoltage);
    
    if (success) {
        Serial.println("✅ Data sent successfully!");
    } else {
        Serial.println("❌ Failed to send data");
    }
    
    Serial.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    // AUTO-IRRIGATION LOGIC
    checkAutoIrrigation(soilMoistureValue, waterLevelPercent);
}

// ==================== AUTO-IRRIGATION ====================
void checkAutoIrrigation(int soilMoisture, int waterLevel) {
    // Only water if:
    // 1. Soil is dry (< 30%)
    // 2. Water tank has enough water (> 20%)
    
    if (soilMoisture < 30 && waterLevel > 20) {
        Serial.println("🚨 Soil too dry! Starting irrigation...");
        digitalWrite(RELAY_PIN, HIGH);
        
        // Water for 10 seconds
        delay(10000);
        
        digitalWrite(RELAY_PIN, LOW);
        Serial.println("✅ Irrigation complete");
        
        // Send status update
        StaticJsonDocument<128> status;
        status["action"] = "irrigation";
        status["duration"] = 10;
        status["reason"] = "low_soil_moisture";
        iot.sendTelemetry(status.as<JsonObject>());
    }
    else if (soilMoisture < 30 && waterLevel <= 20) {
        Serial.println("⚠️  Soil dry but water level too low!");
        // TODO: Send alert to platform
    }
}

// ==================== COMMAND HANDLER ====================
void handleCommand(String command, JsonObject params) {
    Serial.println("\n🎯 Command Received: " + command);
    
    if (command == "set_relay") {
        String state = params["state"] | "OFF";
        int duration = params["duration"] | 0;
        
        if (state == "ON") {
            digitalWrite(RELAY_PIN, HIGH);
            Serial.println("💧 Pump turned ON");
            
            if (duration > 0) {
                delay(duration * 1000);
                digitalWrite(RELAY_PIN, LOW);
                Serial.printf("🛑 Pump turned OFF after %d seconds\n", duration);
            }
            
            iot.sendCommandResponse(params["request_id"] | "unknown", true, "Pump ON");
        } else {
            digitalWrite(RELAY_PIN, LOW);
            Serial.println("🛑 Pump turned OFF");
            iot.sendCommandResponse(params["request_id"] | "unknown", true, "Pump OFF");
        }
    }
    else if (command == "read_sensors") {
        Serial.println("📊 Reading sensors on demand...");
        readAndSendAllSensors();
        iot.sendCommandResponse(params["request_id"] | "unknown", true, "Sensors read");
    }
    else if (command == "calibrate_soil") {
        int dryValue = params["dry"] | 4095;
        int wetValue = params["wet"] | 1500;
        soilMoisture.calibrate(dryValue, wetValue);
        Serial.printf("🔧 Soil sensor calibrated: Dry=%d, Wet=%d\n", dryValue, wetValue);
        iot.sendCommandResponse(params["request_id"] | "unknown", true, "Calibrated");
    }
    else if (command == "restart") {
        iot.sendCommandResponse(params["request_id"] | "unknown", true, "Restarting...");
        delay(1000);
        ESP.restart();
    }
    else {
        Serial.println("❌ Unknown command");
        iot.sendCommandResponse(params["request_id"] | "unknown", false, "Unknown command");
    }
}
