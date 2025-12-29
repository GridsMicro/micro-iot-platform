# Environment Setup Guide

## Quick Start

1. **Copy the example file:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Get your Supabase credentials:**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project (or create a new one)
   - Navigate to: **Settings** → **API**
   - Copy these values:
     - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
     - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

3. **Update `.env.local` with your actual values**

4. **Run the app:**
   ```bash
   npm run dev
   ```

## Optional Configuration

### LINE Official Account
- Create a LINE OA at [LINE Official Account Manager](https://manager.line.biz/)
- Copy your LINE ID (e.g., `@smartfarm`)
- Update `LINE_OA_ID` in `.env.local`

### MQTT Broker
- For testing: Use the public broker (already configured)
- For production: Deploy your own EMQX instance and update the credentials

## Security Notes

⚠️ **NEVER commit `.env.local` to Git!**
- The `.gitignore` file already excludes it
- Only share credentials through secure channels
- Rotate keys if accidentally exposed
