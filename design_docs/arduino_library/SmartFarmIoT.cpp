/*
 * SmartFarmIoT Library - Implementation
 * Version: 1.0.0
 */

#include "SmartFarmIoT.h"

// Static instance for callback
SmartFarmIoT* SmartFarmIoT::_instance = nullptr;

// Constructor
SmartFarmIoT::SmartFarmIoT(const char* deviceId, const char* deviceToken) {
    _deviceId = String(deviceId);
    _deviceToken = String(deviceToken);
    _mqttPort = DEFAULT_MQTT_PORT;
    _sendInterval = DEFAULT_SEND_INTERVAL;
    _lastSendTime = 0;
    _commandCallback = nullptr;
    _instance = this;
    
    // Setup topics
    _telemetryTopic = "farm/" + _deviceId + "/telemetry";
    _statusTopic = "farm/" + _deviceId + "/status";
    _commandTopic = "farm/" + _deviceId + "/command";
    _responseTopic = "farm/" + _deviceId + "/response";
}

// Setup WiFi and MQTT
void SmartFarmIoT::begin(const char* ssid, const char* password, const char* mqttServer, int mqttPort) {
    _mqttServer = String(mqttServer);
    _mqttPort = mqttPort;
    
    // Connect to WiFi
    Serial.print("Connecting to WiFi");
    WiFi.begin(ssid, password);
    
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    
    Serial.println("\nWiFi connected!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
    
    // Setup MQTT
    _mqttClient.setClient(_wifiClient);
    _mqttClient.setServer(_mqttServer.c_str(), _mqttPort);
    _mqttClient.setCallback([](char* topic, byte* payload, unsigned int length) {
        if (_instance) {
            _instance->mqttCallback(topic, payload, length);
        }
    });
    
    reconnectMQTT();
}

// Main loop
void SmartFarmIoT::loop() {
    if (!_mqttClient.connected()) {
        reconnectMQTT();
    }
    _mqttClient.loop();
}

// Reconnect to MQTT
void SmartFarmIoT::reconnectMQTT() {
    while (!_mqttClient.connected()) {
        Serial.print("Connecting to MQTT...");
        
        if (_mqttClient.connect(_deviceId.c_str(), _deviceId.c_str(), _deviceToken.c_str())) {
            Serial.println("connected!");
            
            // Subscribe to command topic
            _mqttClient.subscribe(_commandTopic.c_str(), 1);  // QoS 1
            
            // Send online status
            sendStatus("online", millis() / 1000, PROTOCOL_VERSION);
            
        } else {
            Serial.print("failed, rc=");
            Serial.print(_mqttClient.state());
            Serial.println(" retrying in 5s");
            delay(5000);
        }
    }
}

// Send telemetry data
bool SmartFarmIoT::sendTelemetry(JsonObject sensors, float batteryVoltage, int rssi) {
    if (!_mqttClient.connected()) {
        return false;
    }
    
    // Create JSON document
    StaticJsonDocument<512> doc;
    doc["device_id"] = _deviceId;
    doc["timestamp"] = millis() / 1000;  // Simple timestamp (use NTP for real time)
    doc["protocol_version"] = PROTOCOL_VERSION;
    doc["sensors"] = sensors;
    
    if (batteryVoltage > 0) {
        doc["battery_voltage"] = batteryVoltage;
    }
    
    if (rssi != 0) {
        doc["rssi"] = rssi;
    } else {
        doc["rssi"] = getRSSI();
    }
    
    // Serialize to string
    String payload;
    serializeJson(doc, payload);
    
    // Publish (QoS 0 for telemetry)
    bool success = _mqttClient.publish(_telemetryTopic.c_str(), payload.c_str(), false);
    
    if (success) {
        Serial.println("📤 Telemetry sent: " + payload);
    } else {
        Serial.println("❌ Failed to send telemetry");
    }
    
    return success;
}

// Send device status
bool SmartFarmIoT::sendStatus(const char* status, unsigned long uptime, const char* firmwareVersion) {
    if (!_mqttClient.connected()) {
        return false;
    }
    
    StaticJsonDocument<256> doc;
    doc["device_id"] = _deviceId;
    doc["status"] = status;
    doc["uptime"] = uptime;
    doc["firmware_version"] = firmwareVersion;
    doc["free_memory"] = ESP.getFreeHeap();
    
    String payload;
    serializeJson(doc, payload);
    
    // Publish with retain flag (QoS 1)
    return _mqttClient.publish(_statusTopic.c_str(), payload.c_str(), true);
}

// Send command response
bool SmartFarmIoT::sendCommandResponse(const char* requestId, bool success, const char* message) {
    if (!_mqttClient.connected()) {
        return false;
    }
    
    StaticJsonDocument<256> doc;
    doc["request_id"] = requestId;
    doc["status"] = success ? "success" : "error";
    doc["message"] = message;
    doc["timestamp"] = millis() / 1000;
    
    String payload;
    serializeJson(doc, payload);
    
    return _mqttClient.publish(_responseTopic.c_str(), payload.c_str(), false);
}

// MQTT callback for incoming messages
void SmartFarmIoT::mqttCallback(char* topic, byte* payload, unsigned int length) {
    // Parse JSON
    StaticJsonDocument<512> doc;
    DeserializationError error = deserializeJson(doc, payload, length);
    
    if (error) {
        Serial.println("❌ Failed to parse command JSON");
        return;
    }
    
    String command = doc["command"] | "";
    String requestId = doc["request_id"] | "";
    JsonObject params = doc["params"];
    
    Serial.println("📥 Command received: " + command);
    
    // Call user callback
    if (_commandCallback) {
        _commandCallback(command, params);
    }
}

// Register command callback
void SmartFarmIoT::onCommand(void (*callback)(String command, JsonObject params)) {
    _commandCallback = callback;
}

// Set send interval
void SmartFarmIoT::setSendInterval(unsigned long interval) {
    _sendInterval = interval;
}

// Check connection
bool SmartFarmIoT::isConnected() {
    return _mqttClient.connected();
}

// Get WiFi RSSI
int SmartFarmIoT::getRSSI() {
    return WiFi.RSSI();
}

// Get device ID
String SmartFarmIoT::getDeviceId() {
    return _deviceId;
}
