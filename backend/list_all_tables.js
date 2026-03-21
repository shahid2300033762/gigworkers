require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function listTables() {
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
    );

    console.log('--- Listing all tables from PostgREST ---');
    const { data: spec, error } = await supabase.rpc('get_service_config'); // This won't work likely
    
    // Better way: query the rpcs or just try to select from likely names
    const names = ['Workers', 'Workers', 'Policies', 'policies', 'Claims', 'claims', 'Claim', 'claim'];
    for (const n of names) {
        const { error: e } = await supabase.from(n).select('*').limit(0);
        if (!e) {
            console.log(`Table exists: ${n}`);
            const { data: cols } = await supabase.from(n).select('*').limit(1);
            if (cols && cols.length > 0) {
              console.log(`  Columns for ${n}: ${Object.keys(cols[0]).join(', ')}`);
            } else {
              // Try to find columns via bad query
              const { error: e2 } = await supabase.from(n).select('non_existent').limit(0);
              console.log(`  Columns for ${n} (from error): ${e2.message}`);
            }
        }
    }
}

listTables();
