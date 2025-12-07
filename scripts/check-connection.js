const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function checkConnection() {
    try {
        const envPath = path.join(__dirname, '..', '.env.local');
        if (!fs.existsSync(envPath)) {
            console.log('Error: .env.local not found');
            process.exit(1);
        }

        const envContent = fs.readFileSync(envPath, 'utf8');
        const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
        const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);

        if (!urlMatch || !keyMatch) {
            console.log('Error: Supabase URL or Key not found in .env.local');
            process.exit(1);
        }

        const supabaseUrl = urlMatch[1].trim();
        const supabaseKey = keyMatch[1].trim();

        console.log(`Checking connection to: ${supabaseUrl}`);

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Try to fetch a public table or just check health if possible.
        // Since RLS is on, we might get an empty list or error, but connection is what matters.
        const { data, error } = await supabase.from('habits').select('count', { count: 'exact', head: true });

        if (error) {
            // If code is 'PGRST301' (JWT expired) or 401, it means we connected but are unauthorized.
            // If code is unrelated to connection (e.g. 404 table not found), we also connected.
            // If it's a network error, we failed.
            console.log('Connection Response:', error.message);
            if (error.code || error.status) {
                console.log('Supabase appears reachable (received API response).');
            } else {
                console.log('Supabase might be unreachable.');
            }
        } else {
            console.log('Success! Connected to Supabase.');
        }

    } catch (err) {
        console.error('Unexpected error:', err.message);
    }
}

checkConnection();
