require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    console.log("Testing claims structure...");
    
    // Check if we can select from claims
    const { data: cols, error: selErr } = await supabase.from('claims').select('policy_id').limit(1);
    if (selErr) {
        console.error("Select error:", selErr);
    } else {
        console.log("Select success, policy_id exists in schema cache!");
    }
}
run();
