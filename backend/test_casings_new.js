require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    console.log("Testing claims...");
    const { data: d1, error: e1 } = await supabase.from('claims').select('policy_id').limit(1);
    console.log("lowercase claims:", e1 ? e1.message : "OK");

    const { data: d2, error: e2 } = await supabase.from('Claims').select('policy_id').limit(1);
    console.log("Capitalized Claims:", e2 ? e2.message : "OK");
}
run();
