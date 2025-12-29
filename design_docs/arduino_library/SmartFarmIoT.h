/*
 * SmartFarmIoT Library - Standard Communication Module
 * Version: 1.0.0
 * Compatible with: ESP32, ESP8266, STM32 (with WiFi module)
 */

#ifndef SMARTFARMIOT_H
#define SMARTFARMIOT_H

#include <Arduino.h>

#ifdef ESP32
  #include <WiFi.h>
#elif defined(ESP8266)
  #include <ESP8266WiFi.h>
#endif

#include <PubSubClient.h>
#include <ArduinoJson.h>

// Protocol version
#define PROTOCOL_VERSION "1.0"

// Default MQTT settings
#define DEFAULT_MQTT_PORT 1883
#define DEFAULT_SEND_INTERVAL 5000  // 5 seconds

class SmartFarmIoT {
private:
    // Device credentials
    String _deviceId;
    String _deviceToken;
    
    // MQTT settings
    String _mqttServer;
    int _mqttPort;
    WiFiClient _wifiClient;
    PubSubClient _mqttClient;
    
    // Topics
    String _telemetryTopic;
    String _statusTopic;
    String _commandTopic;
    String _responseTopic;
    
    // Timing
    unsigned long _lastSendTime;
    unsigned long _sendInterval;
    
    // Callbacks
    void (*_commandCallback)(String command, JsonObject params);
    
    // Internal methods
    void reconnectMQTT();
    void mqttCallback(char* topic, byte* payload, unsigned int length);
    static SmartFarmIoT* _instance;  // For callback
    
public:
    // Constructor
    SmartFarmIoT(const char* deviceId, const char* deviceToken);
    
    // Setup
    void begin(const char* ssid, const char* password, const char* mqttServer, int mqttPort = DEFAULT_MQTT_PORT);
    void setSendInterval(unsigned long interval);
    
    // Main loop
    void loop();
    
    // Send data
    bool sendTelemetry(JsonObject sensors, float batteryVoltage = 0, int rssi = 0);
    bool sendStatus(const char* status, unsigned long uptime, const char* firmwareVersion);
    bool sendCommandResponse(const char* requestId, bool success, const char* message);
    
    // Receive commands
    void onCommand(void (*callback)(String command, JsonObject params));
    
    // Utility
    bool isConnected();
    int getRSSI();
    String getDeviceId();
};

#endif // SMARTFARMIOT_H
