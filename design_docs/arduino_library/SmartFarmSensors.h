/*
 * SmartFarm Sensor Library - Complete Sensor Integration
 * Version: 1.0.0
 * 
 * Supported Sensors:
 * - Temperature & Humidity: DHT22, DHT11, SHT31
 * - Soil: Capacitive Soil Moisture, Resistive
 * - Water: pH, TDS, Water Level, Flow Rate
 * - Power: Voltage, Current, Battery
 */

#ifndef SMARTFARM_SENSORS_H
#define SMARTFARM_SENSORS_H

#include <Arduino.h>
#include <DHT.h>
#include <Wire.h>

// ==================== TEMPERATURE & HUMIDITY ====================

class TemperatureHumiditySensor {
private:
    DHT* dht;
    uint8_t pin;
    uint8_t type;
    
public:
    TemperatureHumiditySensor(uint8_t pin, uint8_t dhtType = DHT22);
    void begin();
    float readTemperature();
    float readHumidity();
    bool isValid(float value);
};

// ==================== SOIL SENSORS ====================

class SoilMoistureSensor {
private:
    uint8_t pin;
    int dryValue;    // Calibration: value in dry air
    int wetValue;    // Calibration: value in water
    
public:
    SoilMoistureSensor(uint8_t analogPin);
    void calibrate(int dry, int wet);
    int readRaw();
    int readMoisture();  // Returns 0-100%
};

// ==================== WATER SENSORS ====================

class PHSensor {
private:
    uint8_t pin;
    float offset;  // Calibration offset
    
public:
    PHSensor(uint8_t analogPin);
    void calibrate(float knownPH, float measuredVoltage);
    float readPH();
    float readVoltage();
};

class TDSSensor {
private:
    uint8_t pin;
    float temperature;  // For temperature compensation
    
public:
    TDSSensor(uint8_t analogPin);
    void setTemperature(float temp);
    float readTDS();  // Returns ppm
    float readVoltage();
};

class WaterLevelSensor {
private:
    uint8_t trigPin;
    uint8_t echoPin;
    float tankHeight;  // cm
    
public:
    WaterLevelSensor(uint8_t trig, uint8_t echo, float height = 100);
    float readDistance();  // cm from sensor
    float readLevel();     // cm from bottom
    int readPercent();     // 0-100%
};

class FlowRateSensor {
private:
    uint8_t pin;
    volatile unsigned int pulseCount;
    float calibrationFactor;  // pulses per liter
    unsigned long lastTime;
    
public:
    FlowRateSensor(uint8_t interruptPin, float factor = 7.5);
    void begin();
    void pulseCounter();  // ISR function
    float readFlowRate();  // L/min
    float getTotalLiters();
    void reset();
    
    static FlowRateSensor* instance;  // For ISR
};

// ==================== POWER SENSORS ====================

class VoltageSensor {
private:
    uint8_t pin;
    float voltageDividerRatio;  // R1/(R1+R2)
    float referenceVoltage;     // ADC reference (usually 3.3V)
    
public:
    VoltageSensor(uint8_t analogPin, float ratio = 0.5, float vRef = 3.3);
    float readVoltage();
    int readPercent(float minV = 3.0, float maxV = 4.2);  // For battery
};

class CurrentSensor {
private:
    uint8_t pin;
    float sensitivity;  // mV/A (e.g., ACS712: 185mV/A for 5A version)
    float vcc;
    
public:
    CurrentSensor(uint8_t analogPin, float sens = 185, float voltage = 5.0);
    float readCurrent();  // Amperes
    float readPower(float voltage);  // Watts
};

// ==================== LIGHT SENSOR ====================

class LightSensor {
private:
    uint8_t pin;
    bool isDigital;  // true for BH1750, false for analog LDR
    
public:
    LightSensor(uint8_t pin, bool digital = false);
    void begin();
    float readLux();
    int readPercent();
};

#endif // SMARTFARM_SENSORS_H
