import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Error: Supabase credentials not found in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    console.log('--- Testing Supabase Connection ---');
    console.log(`URL: ${supabaseUrl}`);

    try {
        const { data, error } = await supabase.from('devices').select('count', { count: 'exact', head: true });

        if (error) {
            throw error;
        }

        console.log('✅ Success: Connected to Supabase!');
        console.log(`📊 Device count in database: ${data === null ? 0 : 'Available'}`);
    } catch (err: any) {
        console.error('❌ Connection Failed!');
        console.error(`Reason: ${err.message}`);
        process.exit(1);
    }
}

testConnection();
