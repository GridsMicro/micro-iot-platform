# Smart Farm IoT Platform - Database Schema Design
## Technology: PostgreSQL + TimescaleDB

### 1. Users & Farms (Relational Data)
Standard relational tables for user management and farm configuration.

```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    subscription_plan VARCHAR(20) DEFAULT 'free' -- free, pro
);

-- Farms Table (A user can have multiple farms)
CREATE TABLE farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    theme VARCHAR(20) DEFAULT 'earth', -- earth, water, wind, fire
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Devices Table (ESP32/Arduino nodes)
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    serial_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(50),
    type VARCHAR(50), -- e.g., 'sensor_node', 'actuator_controller'
    secret_key VARCHAR(100), -- For device authentication (Custom Library)
    is_online BOOLEAN DEFAULT false,
    last_seen TIMESTAMPTZ
);
```

### 2. Sensor Data (Time-Series Data)
Optimized using TimescaleDB hypertable.

```sql
-- Sensor Data Table
CREATE TABLE sensor_data (
    time TIMESTAMPTZ NOT NULL,
    device_id UUID REFERENCES devices(id),
    sensor_type VARCHAR(50), -- e.g., 'temperature', 'humidity', 'soil_moisture'
    value DOUBLE PRECISION NOT NULL,
    metadata JSONB -- Extra info like unit, error codes
);

-- Convert to Hypertable (TimescaleDB magic)
SELECT create_hypertable('sensor_data', 'time');

-- Index for fast queries by device and time
CREATE INDEX ix_sensor_data_device_time ON sensor_data (device_id, time DESC);
```

### 3. Automation Rules (No-Code Logic)
Storing user-defined logic.

```sql
CREATE TABLE automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID REFERENCES farms(id),
    name VARCHAR(100),
    condition_json JSONB, -- e.g., { "sensor": "soil_moisture", "operator": "<", "value": 30 }
    action_json JSONB,    -- e.g., { "device": "pump_01", "command": "ON" }
    is_active BOOLEAN DEFAULT true
);
```
