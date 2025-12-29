# Hybrid Cloud-Local Strategy (Monetization & Reliability)

## Overview
To ensure reliability during internet outages while maintaining a subscription-based business model, we implement a **Hybrid Edge Architecture**.

---

## 1. Core Architecture: The "Edge Gateway"

We introduce a local control layer (running on a Raspberry Pi, ESP32 hub, or local PC) that acts as the "Farm Brain."

- **Local MQTT Broker**: Devices connect to a local broker (Mosquitto) first.
- **Local Logic Engine**: Basic automation (Moisture < 30% -> Pump ON) runs locally.
- **Data Sync**: The Edge Gateway caches data and syncs it to **Supabase** when the internet is available.

---

## 2. Monetization & Licensing (Anti-Piracy)

To ensure users pay even for local installs:

### A. Managed Heartbeat (Periodic Phone Home)
The local software requires a **License Key**.
- The system must connect to the Smart Farm Cloud at least once every **30 days** to renew its "Offline Permit."
- If it fails to connect after the grace period, the local dashboard locks, and advanced automations are disabled.

### B. Hardware-Software Bound
The License Key is bound to a unique hardware ID (CPU Serial, MAC Address). This prevents cloning local setups to multiple farms without payment.

---

## 3. Feature Gating (Basic vs. Premium)

| Feature | Local (Offline/Basic) | Cloud (Online/Premium) |
|---------|-----------------------|------------------------|
| **Core Automation** | ✅ Basic (On/Off) | ✅ Complex (Weather-based) |
| **Real-time Data** | ✅ Local Network Only | ✅ Global (Mobile App Anywhere) |
| **History** | ❌ 24 Hours Only | ✅ Unlimited (Supabase Storage) |
| **AI Analytics** | ❌ None | ✅ Full (Disease, Yield) |
| **Notifications** | ❌ Local Buzzer Only | ✅ Mobile Push / LINE OA |
| **Multi-farm** | ❌ 1 Location | ✅ Global Map View |

---

## 4. Implementation Details

### Edge Controller Setup:
1.  User registers on the **Smart Farm Web Platform**.
2.  User pays for a subscription and receives a **License Key**.
3.  User installs the **Smart Farm Edge Hub** (Docker / Image).
4.  Hub activates via internet once, then can run offline.

### Library Update:
The `SmartFarmIoT` library should support a `setSecondaryBroker(localIP)` to failover to a local MQTT if the Cloud MQTT is unreachable.

---

## 5. Security Measures

- **Encrypted Local Database**: To prevent manual tampering with subscription data.
- **Signed Payloads**: The platform sends signed "Enable" signals that only the Edge Hub can decrypt.

---

**Last Updated**: 2025-12-29  
**Strategy by**: Antigravity AI
