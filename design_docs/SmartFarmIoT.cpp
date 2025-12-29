#include "SmartFarmIoT.h"

SmartFarmIoT::SmartFarmIoT(const char* device_id, const char* device_secret) {
  _device_id = device_id;
  _device_secret = device_secret;
  _server = "mqtt.smartfarm-platform.com"; // Placeholder Server Address
  client.setClient(espClient);
  client.setServer(_server, 1883);
}

void SmartFarmIoT::begin(const char* ssid, const char* password) {
  _ssid = ssid;
  _password = password;
  
  Serial.begin(115200);
  Serial.print("Connecting to WiFi");
  WiFi.begin(_ssid, _password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" Connected!");
}

void SmartFarmIoT::loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}

void SmartFarmIoT::sendValue(const char* sensor_type, float value) {
  // Topic: farm/{device_id}/telemetry
  String topic = String("farm/") + _device_id + "/telemetry";
  
  // JSON Payload: { "sensor": "temp", "val": 25.5 }
  StaticJsonDocument<200> doc;
  doc["sensor"] = sensor_type;
  doc["val"] = value;
  
  char buffer[256];
  serializeJson(doc, buffer);
  
  client.publish(topic.c_str(), buffer);
}

void SmartFarmIoT::reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Use Device ID as Client ID, Secret as Password (simplification)
    if (client.connect(_device_id, _device_id, _device_secret)) {
      Serial.println("connected");
      // Subscribe to commands: farm/{device_id}/command
      String cmdTopic = String("farm/") + _device_id + "/command";
      client.subscribe(cmdTopic.c_str());
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      delay(5000);
    }
  }
}
