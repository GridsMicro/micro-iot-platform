# EMQX MQTT Broker Installation Guide for Ubuntu

## Prerequisites
- Ubuntu 20.04, 22.04, or 24.04 (Desktop or Server)
- Sudo privileges
- Internet connection

---

## Step 1: Download and Install EMQX

### Option A: Using Package Manager (Recommended)

```bash
# Update package list
sudo apt update

# Download EMQX package
wget https://www.emqx.com/en/downloads/broker/5.4.0/emqx-5.4.0-ubuntu22.04-amd64.deb

# Install EMQX
sudo dpkg -i emqx-5.4.0-ubuntu22.04-amd64.deb

# If you get dependency errors, run:
sudo apt-get install -f
```

### Option B: Using Docker (Alternative)

```bash
# Install Docker (if not installed)
sudo apt install docker.io -y

# Run EMQX in Docker
sudo docker run -d \
  --name emqx \
  -p 1883:1883 \
  -p 8083:8083 \
  -p 8084:8084 \
  -p 8883:8883 \
  -p 18083:18083 \
  emqx/emqx:latest
```

---

## Step 2: Start EMQX Service

```bash
# Start EMQX
sudo systemctl start emqx

# Enable auto-start on boot
sudo systemctl enable emqx

# Check status
sudo systemctl status emqx
```

**Expected output:**
```
● emqx.service - EMQX Broker
   Loaded: loaded (/lib/systemd/system/emqx.service; enabled)
   Active: active (running) since ...
```

---

## Step 3: Access EMQX Dashboard

### Find Your IP Address

```bash
# Method 1: Command line
ip addr show | grep "inet " | grep -v "127.0.0.1"

# Method 2: GUI (Ubuntu Desktop)
# Settings → Network → Click your connection → See IPv4 Address
```

**Example output:**
```
inet 192.168.1.105/24
```

### Open Dashboard

1. **Open your browser** (Firefox, Chrome, etc.)
2. **Navigate to:** `http://localhost:18083` (on Ubuntu itself)
   - Or from another computer: `http://192.168.1.105:18083`
3. **Login with default credentials:**
   - Username: `admin`
   - Password: `public`

⚠️ **IMPORTANT:** Change the default password immediately!

---

## Step 4: Create Authentication (Username/Password)

### In EMQX Dashboard:

1. **Go to:** `Authentication` (left sidebar)
2. **Click:** `Create`
3. **Select:** `Password-Based` → `Built-in Database`
4. **Click:** `Create`
5. **Add a user:**
   - Click `Users` tab
   - Click `Add` button
   - Fill in:
     ```
     Username: smartfarm_device
     Password: YourSecurePassword123!
     ```
   - Click `Create`

---

## Step 5: Configure Firewall (Optional but Recommended)

```bash
# Allow MQTT ports
sudo ufw allow 1883/tcp   # MQTT
sudo ufw allow 8883/tcp   # MQTT over SSL
sudo ufw allow 18083/tcp  # Dashboard (only if needed from other computers)

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## Step 6: Test Connection

### Using MQTT CLI Tool

```bash
# Install MQTT CLI
sudo apt install mosquitto-clients -y

# Subscribe to a topic
mosquitto_sub -h localhost -t "test/topic" -u smartfarm_device -P YourSecurePassword123!

# In another terminal, publish a message
mosquitto_pub -h localhost -t "test/topic" -m "Hello MQTT!" -u smartfarm_device -P YourSecurePassword123!
```

**Expected:** You should see "Hello MQTT!" in the subscriber terminal.

---

## Step 7: Update Your Project Configuration

### On Windows (Next.js Project)

Edit `.env.local`:

```bash
# Replace with your Ubuntu IP address
MQTT_BROKER_URL=mqtt://192.168.1.105:1883
MQTT_USERNAME=smartfarm_device
MQTT_PASSWORD=YourSecurePassword123!
```

---

## Useful Commands

### Service Management
```bash
# Start EMQX
sudo systemctl start emqx

# Stop EMQX
sudo systemctl stop emqx

# Restart EMQX
sudo systemctl restart emqx

# Check status
sudo systemctl status emqx

# View logs
sudo journalctl -u emqx -f
```

### Check Ports
```bash
# See which ports EMQX is listening on
sudo netstat -tulpn | grep emqx
```

### Configuration File
```bash
# Edit main config
sudo nano /etc/emqx/emqx.conf

# After editing, restart service
sudo systemctl restart emqx
```

---

## Troubleshooting

### Problem: Service won't start
```bash
# Check logs for errors
sudo journalctl -u emqx -n 50

# Check if port 1883 is already in use
sudo lsof -i :1883
```

### Problem: Can't access Dashboard
```bash
# Check if port 18083 is open
sudo netstat -tulpn | grep 18083

# Check firewall
sudo ufw status

# Try accessing from localhost first
curl http://localhost:18083
```

### Problem: Connection refused from other devices
```bash
# Make sure EMQX is listening on all interfaces
sudo nano /etc/emqx/emqx.conf

# Find and ensure:
# listeners.tcp.default.bind = "0.0.0.0:1883"

# Restart after changes
sudo systemctl restart emqx
```

---

## Security Best Practices

### 1. Change Default Password
- Dashboard → System → Users → Edit admin user

### 2. Enable SSL/TLS (Production)
```bash
# Generate self-signed certificate
sudo mkdir -p /etc/emqx/certs
cd /etc/emqx/certs
sudo openssl req -new -x509 -days 365 -nodes \
  -out server.crt -keyout server.key

# Update config
sudo nano /etc/emqx/emqx.conf
```

Add:
```
listeners.ssl.default {
  bind = "0.0.0.0:8883"
  ssl_options {
    certfile = "/etc/emqx/certs/server.crt"
    keyfile = "/etc/emqx/certs/server.key"
  }
}
```

### 3. Restrict Dashboard Access
```bash
# Only allow from local network
sudo ufw delete allow 18083/tcp
sudo ufw allow from 192.168.1.0/24 to any port 18083
```

---

## Ports Reference

| Port | Protocol | Description |
|------|----------|-------------|
| 1883 | MQTT | Standard MQTT (unencrypted) |
| 8883 | MQTTS | MQTT over SSL/TLS |
| 8083 | WebSocket | MQTT over WebSocket |
| 8084 | WSS | MQTT over Secure WebSocket |
| 18083 | HTTP | Dashboard Web UI |

---

## Next Steps

1. ✅ EMQX is now running on your Ubuntu machine
2. ✅ You have created authentication credentials
3. ✅ Update your Next.js project's `.env.local` with the connection details
4. 🚀 Start developing your Smart Farm IoT Platform!

---

## Additional Resources

- [EMQX Official Documentation](https://www.emqx.io/docs/en/latest/)
- [MQTT Protocol Specification](https://mqtt.org/)
- [EMQX Dashboard Guide](https://www.emqx.io/docs/en/latest/dashboard/introduction.html)

---

**Last Updated:** 2025-12-29  
**EMQX Version:** 5.4.0  
**Ubuntu Versions:** 20.04, 22.04, 24.04
