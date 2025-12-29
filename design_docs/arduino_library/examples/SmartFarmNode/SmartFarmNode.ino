/*
 * Example: Complete Smart Farm Node
 * Hardware: ESP32 + DHT22 + Soil Moisture + Relay
 */

#include <SmartFarmIoT.h>
#include <DHT.h>

// Pin definitions
#define DHTPIN 4
#define SOIL_PIN 34
#define RELAY_PIN 5

// DHT sensor
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// Device credentials (get from platform)
const char* DEVICE_ID = "ESP32_001";
const char* DEVICE_TOKEN = "your-device-token-here";

// WiFi credentials
const char* WIFI_SSID = "YourWiFi";
const char* WIFI_PASSWORD = "YourPassword";

// MQTT broker
const char* MQTT_SERVER = "192.168.1.100";  // Your MQTT broker IP

// SmartFarmIoT instance
SmartFarmIoT iot(DEVICE_ID, DEVICE_TOKEN);

// Timing
unsigned long lastSendTime = 0;
const unsigned long SEND_INTERVAL = 5000;  // 5 seconds

void setup() {
    Serial.begin(115200);
    
    // Initialize sensors
    dht.begin();
    pinMode(SOIL_PIN, INPUT);
    pinMode(RELAY_PIN, OUTPUT);
    digitalWrite(RELAY_PIN, LOW);
    
    // Connect to platform
    iot.begin(WIFI_SSID, WIFI_PASSWORD, MQTT_SERVER);
    
    // Register command handler
    iot.onCommand(handleCommand);
    
    Serial.println("✅ Smart Farm Node ready!");
}

void loop() {
    // Maintain connection
    iot.loop();
    
    // Send data every SEND_INTERVAL
    if (millis() - lastSendTime >= SEND_INTERVAL) {
        sendSensorData();
        lastSendTime = millis();
    }
}

void sendSensorData() {
    // Read sensors
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    int soilRaw = analogRead(SOIL_PIN);
    int soilMoisture = map(soilRaw, 4095, 1500, 0, 100);
    soilMoisture = constrain(soilMoisture, 0, 100);
    
    // Check for errors
    if (isnan(temperature) || isnan(humidity)) {
        Serial.println("❌ Failed to read DHT sensor!");
        return;
    }
    
    // Create sensor data JSON
    StaticJsonDocument<256> sensors;
    sensors["temperature"] = temperature;
    sensors["humidity"] = humidity;
    sensors["soil_moisture"] = soilMoisture;
    
    // Send to platform
    bool success = iot.sendTelemetry(sensors.as<JsonObject>());
    
    if (success) {
        Serial.printf("📊 Temp: %.1f°C | Humidity: %.1f%% | Soil: %d%%\n", 
                      temperature, humidity, soilMoisture);
    }
}

void handleCommand(String command, JsonObject params) {
    Serial.println("🎯 Executing command: " + command);
    
    if (command == "set_relay") {
        int relayId = params["relay_id"] | 1;
        String state = params["state"] | "OFF";
        int duration = params["duration"] | 0;
        
        if (relayId == 1) {
            if (state == "ON") {
                digitalWrite(RELAY_PIN, HIGH);
                Serial.println("💧 Pump ON");
                
                // Auto turn off after duration
                if (duration > 0) {
                    delay(duration * 1000);
                    digitalWrite(RELAY_PIN, LOW);
                    Serial.println("🛑 Pump OFF (timeout)");
                }
                
                iot.sendCommandResponse(params["request_id"] | "unknown", true, "Relay turned ON");
            } else {
                digitalWrite(RELAY_PIN, LOW);
                Serial.println("🛑 Pump OFF");
                iot.sendCommandResponse(params["request_id"] | "unknown", true, "Relay turned OFF");
            }
        }
    }
    else if (command == "restart") {
        iot.sendCommandResponse(params["request_id"] | "unknown", true, "Restarting...");
        delay(1000);
        ESP.restart();
    }
    else if (command == "update_interval") {
        int interval = params["interval"] | 5;
        iot.setSendInterval(interval * 1000);
        iot.sendCommandResponse(params["request_id"] | "unknown", true, "Interval updated");
    }
    else {
        iot.sendCommandResponse(params["request_id"] | "unknown", false, "Unknown command");
    }
}
