require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function test() {
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
    );

    const tables = ['Claims', 'claims'];
    const columns = ['worker_id', 'payout_amount', 'disruption_type'];

    for (const t of tables) {
        console.log(`--- Testing table: ${t} ---`);
        const { data, error } = await supabase.from(t).select('*').limit(1);
        if (error) {
            console.log(`  Select * Error: ${error.message}`);
        } else {
            console.log(`  Select * Success. Columns: ${Object.keys(data[0] || {}).join(', ')}`);
        }

        for (const c of columns) {
            const { error: cError } = await supabase.from(t).select(c).limit(1);
            if (cError) {
                console.log(`  Select ${c} Error: ${cError.message}`);
            } else {
                console.log(`  Select ${c} Success.`);
            }
        }
    }
}

test();
