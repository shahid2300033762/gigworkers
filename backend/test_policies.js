require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function checkSchema() {
  // Try querying information schema via rpc or a direct query
  const { data, error } = await supabase.from('Policies').insert([{
    worker_id: '00000000-0000-0000-0000-000000000000',
    weekly_premium: 100,
    coverage_amount: 1000
  }]).select();

  console.log("Insert result:", data, error);
}
checkSchema();
