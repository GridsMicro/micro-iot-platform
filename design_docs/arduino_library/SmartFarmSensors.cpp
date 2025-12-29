/*
 * SmartFarm Sensor Library - Implementation
 * Version: 1.0.0
 */

#include "SmartFarmSensors.h"

// ==================== TEMPERATURE & HUMIDITY ====================

TemperatureHumiditySensor::TemperatureHumiditySensor(uint8_t pin, uint8_t dhtType) {
    this->pin = pin;
    this->type = dhtType;
    this->dht = new DHT(pin, dhtType);
}

void TemperatureHumiditySensor::begin() {
    dht->begin();
    delay(2000);  // DHT sensors need time to stabilize
}

float TemperatureHumiditySensor::readTemperature() {
    float temp = dht->readTemperature();
    return isnan(temp) ? -999 : temp;
}

float TemperatureHumiditySensor::readHumidity() {
    float hum = dht->readHumidity();
    return isnan(hum) ? -999 : hum;
}

bool TemperatureHumiditySensor::isValid(float value) {
    return value != -999;
}

// ==================== SOIL SENSORS ====================

SoilMoistureSensor::SoilMoistureSensor(uint8_t analogPin) {
    this->pin = analogPin;
    this->dryValue = 4095;  // Default for ESP32 (12-bit ADC)
    this->wetValue = 1500;
}

void SoilMoistureSensor::calibrate(int dry, int wet) {
    this->dryValue = dry;
    this->wetValue = wet;
}

int SoilMoistureSensor::readRaw() {
    return analogRead(pin);
}

int SoilMoistureSensor::readMoisture() {
    int raw = readRaw();
    int moisture = map(raw, dryValue, wetValue, 0, 100);
    return constrain(moisture, 0, 100);
}

// ==================== WATER SENSORS ====================

PHSensor::PHSensor(uint8_t analogPin) {
    this->pin = analogPin;
    this->offset = 0.0;
}

void PHSensor::calibrate(float knownPH, float measuredVoltage) {
    // pH 7.0 should give ~2.5V (mid-point)
    this->offset = knownPH - ((measuredVoltage - 2.5) * 3.5);
}

float PHSensor::readVoltage() {
    int raw = analogRead(pin);
    return (raw / 4095.0) * 3.3;  // ESP32: 12-bit ADC, 3.3V reference
}

float PHSensor::readPH() {
    float voltage = readVoltage();
    float ph = 7.0 + ((2.5 - voltage) / 0.18);  // Standard pH sensor formula
    return ph + offset;
}

TDSSensor::TDSSensor(uint8_t analogPin) {
    this->pin = analogPin;
    this->temperature = 25.0;  // Default temperature
}

void TDSSensor::setTemperature(float temp) {
    this->temperature = temp;
}

float TDSSensor::readVoltage() {
    int raw = analogRead(pin);
    return (raw / 4095.0) * 3.3;
}

float TDSSensor::readTDS() {
    float voltage = readVoltage();
    
    // Temperature compensation
    float compensationCoefficient = 1.0 + 0.02 * (temperature - 25.0);
    float compensationVoltage = voltage / compensationCoefficient;
    
    // TDS calculation (ppm)
    float tds = (133.42 * compensationVoltage * compensationVoltage * compensationVoltage 
                - 255.86 * compensationVoltage * compensationVoltage 
                + 857.39 * compensationVoltage) * 0.5;
    
    return tds;
}

WaterLevelSensor::WaterLevelSensor(uint8_t trig, uint8_t echo, float height) {
    this->trigPin = trig;
    this->echoPin = echo;
    this->tankHeight = height;
    
    pinMode(trigPin, OUTPUT);
    pinMode(echoPin, INPUT);
}

float WaterLevelSensor::readDistance() {
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);
    
    long duration = pulseIn(echoPin, HIGH, 30000);  // 30ms timeout
    float distance = duration * 0.034 / 2;  // Speed of sound: 340 m/s
    
    return distance;
}

float WaterLevelSensor::readLevel() {
    float distance = readDistance();
    return tankHeight - distance;
}

int WaterLevelSensor::readPercent() {
    float level = readLevel();
    int percent = (level / tankHeight) * 100;
    return constrain(percent, 0, 100);
}

// Static instance for ISR
FlowRateSensor* FlowRateSensor::instance = nullptr;

FlowRateSensor::FlowRateSensor(uint8_t interruptPin, float factor) {
    this->pin = interruptPin;
    this->calibrationFactor = factor;
    this->pulseCount = 0;
    this->lastTime = 0;
    instance = this;
}

void FlowRateSensor::begin() {
    pinMode(pin, INPUT_PULLUP);
    attachInterrupt(digitalPinToInterrupt(pin), []() {
        if (instance) instance->pulseCounter();
    }, FALLING);
    lastTime = millis();
}

void FlowRateSensor::pulseCounter() {
    pulseCount++;
}

float FlowRateSensor::readFlowRate() {
    unsigned long currentTime = millis();
    unsigned long elapsedTime = currentTime - lastTime;
    
    if (elapsedTime >= 1000) {  // Calculate every second
        float flowRate = (pulseCount / calibrationFactor) / (elapsedTime / 1000.0);
        lastTime = currentTime;
        pulseCount = 0;
        return flowRate;
    }
    
    return 0;
}

float FlowRateSensor::getTotalLiters() {
    return pulseCount / calibrationFactor;
}

void FlowRateSensor::reset() {
    pulseCount = 0;
}

// ==================== POWER SENSORS ====================

VoltageSensor::VoltageSensor(uint8_t analogPin, float ratio, float vRef) {
    this->pin = analogPin;
    this->voltageDividerRatio = ratio;
    this->referenceVoltage = vRef;
}

float VoltageSensor::readVoltage() {
    int raw = analogRead(pin);
    float voltage = (raw / 4095.0) * referenceVoltage;
    return voltage / voltageDividerRatio;  // Compensate for voltage divider
}

int VoltageSensor::readPercent(float minV, float maxV) {
    float voltage = readVoltage();
    int percent = ((voltage - minV) / (maxV - minV)) * 100;
    return constrain(percent, 0, 100);
}

CurrentSensor::CurrentSensor(uint8_t analogPin, float sens, float voltage) {
    this->pin = analogPin;
    this->sensitivity = sens;
    this->vcc = voltage;
}

float CurrentSensor::readCurrent() {
    int raw = analogRead(pin);
    float voltage = (raw / 4095.0) * vcc;
    
    // ACS712 outputs VCC/2 at 0A
    float current = ((voltage - (vcc / 2.0)) / sensitivity) * 1000.0;
    
    return abs(current);
}

float CurrentSensor::readPower(float voltage) {
    return readCurrent() * voltage;
}

// ==================== LIGHT SENSOR ====================

LightSensor::LightSensor(uint8_t pin, bool digital) {
    this->pin = pin;
    this->isDigital = digital;
}

void LightSensor::begin() {
    if (isDigital) {
        // Initialize I2C for BH1750
        Wire.begin();
    } else {
        pinMode(pin, INPUT);
    }
}

float LightSensor::readLux() {
    if (isDigital) {
        // BH1750 implementation would go here
        // For now, return 0
        return 0;
    } else {
        // Analog LDR
        int raw = analogRead(pin);
        // Simple conversion (adjust based on your LDR)
        float lux = map(raw, 0, 4095, 0, 100000);
        return lux;
    }
}

int LightSensor::readPercent() {
    float lux = readLux();
    // Assume 50000 lux is 100% (bright sunlight)
    int percent = (lux / 50000.0) * 100;
    return constrain(percent, 0, 100);
}
