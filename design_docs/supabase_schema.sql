-- ⚠️ IMPORTANT: This database already contains an existing table called 'id' (product catalog)
-- This script will NOT modify or drop any existing tables
-- All CREATE TABLE statements use IF NOT EXISTS for safety

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extends auth.users)
-- Create a table for public profiles because auth.users is private
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. FARMS
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id UUID REFERENCES public.profiles(id) NOT NULL,
    name TEXT NOT NULL,
    location TEXT,
    farm_type TEXT, -- e.g., 'hydroponic', 'field', 'greenhouse'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Farms
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own farms" 
ON public.farms FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own farms" 
ON public.farms FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own farms" 
ON public.farms FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Admins can view all farms" 
ON public.farms FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);


-- 3. DEVICES
CREATE TABLE IF NOT EXISTS public.devices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    device_type TEXT, -- 'esp32', 'esp8266'
    status TEXT DEFAULT 'offline',
    token TEXT UNIQUE DEFAULT uuid_generate_v4(), -- Secret token for MQTT auth
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Devices
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view devices in their farms" 
ON public.devices FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.farms WHERE id = devices.farm_id AND owner_id = auth.uid())
);

CREATE POLICY "Users can manage devices in their farms" 
ON public.devices FOR ALL USING (
    EXISTS (SELECT 1 FROM public.farms WHERE id = devices.farm_id AND owner_id = auth.uid())
);


-- 4. TELEMETRY (Sensor Data)
-- Note: In a real production scalable system, use TimescaleDB or partition this table.
CREATE TABLE IF NOT EXISTS public.telemetry (
    time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    device_id UUID REFERENCES public.devices(id),
    sensor_type TEXT NOT NULL, -- 'temperature', 'humidity', 'ph', 'ec'
    value NUMERIC NOT NULL,
    metadata JSONB
);

-- Index for fast time-series queries
CREATE INDEX idx_telemetry_time ON public.telemetry(time DESC);
CREATE INDEX idx_telemetry_device ON public.telemetry(device_id);

-- RLS: Telemetry
ALTER TABLE public.telemetry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view telemetry for their devices" 
ON public.telemetry FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.devices d
        JOIN public.farms f ON d.farm_id = f.id
        WHERE d.id = telemetry.device_id AND f.owner_id = auth.uid()
    )
);

-- Allow backend/Edge functions to insert data (Service Role)
-- Standard users usually don't INSERT directly; data comes via MQTT -> Bridge -> DB


-- 5. AUTOMATION RULES (No-Code Logic)
CREATE TABLE IF NOT EXISTS public.automation_rules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    condition_field TEXT, -- 'temperature'
    condition_operator TEXT, -- '>', '<', '='
    condition_value NUMERIC,
    action_device_id UUID REFERENCES public.devices(id),
    action_type TEXT, -- 'turn_on', 'turn_off'
    is_active BOOLEAN DEFAULT true
);

ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage rules for their farms" 
ON public.automation_rules FOR ALL USING (
    EXISTS (SELECT 1 FROM public.farms WHERE id = automation_rules.farm_id AND owner_id = auth.uid())
);


-- 6. MARKETPLACE (Themes & Extensions)
CREATE TABLE IF NOT EXISTS public.marketplace_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('template', 'extension')),
    price NUMERIC DEFAULT 0,
    rating NUMERIC DEFAULT 5.0,
    author TEXT,
    image_url TEXT,
    metadata JSONB, -- For specific extension configurations
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Marketplace Items
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view marketplace items" 
ON public.marketplace_items FOR SELECT USING (true);

-- Only admins can manage marketplace items
CREATE POLICY "Admins can manage marketplace items" 
ON public.marketplace_items FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);


-- 7. USER INSTALLATIONS
CREATE TABLE IF NOT EXISTS public.user_installations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_id UUID REFERENCES public.marketplace_items(id) ON DELETE CASCADE,
    installed_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'active',
    UNIQUE(user_id, item_id)
);

-- RLS: User Installations
ALTER TABLE public.user_installations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own installations" 
ON public.user_installations FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can install items" 
ON public.user_installations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can uninstall items" 
ON public.user_installations FOR DELETE USING (auth.uid() = user_id);
