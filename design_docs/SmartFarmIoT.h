/**
 * SmartFarmIoT.h - Custom Library for Micro IoT Platform
 * "The Bridge" - allowing easy connection to the server.
 * 
 * Target Hardware: ESP32 / ESP8266
 * Dependencies: PubSubClient (MQTT), ArduinoJson
 */

#ifndef SmartFarmIoT_h
#define SmartFarmIoT_h

#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

class SmartFarmIoT {
  private:
    const char* _ssid;
    const char* _password;
    const char* _server;
    const char* _device_id;
    const char* _device_secret;
    
    WiFiClient espClient;
    PubSubClient client;

    void reconnect();

  public:
    SmartFarmIoT(const char* device_id, const char* device_secret);
    void begin(const char* ssid, const char* password);
    void loop();
    void sendValue(const char* sensor_type, float value);
    void onCommand(void (*callback)(String, String)); // Callback for actions
};

#endif
