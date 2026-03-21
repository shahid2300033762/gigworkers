const { Client } = require('pg');
require('dotenv').config();
async function check() {
    const client = new Client({
        connectionString: 'postgresql://postgres:' + process.env.SUPABASE_DB_PASSWORD + '@db.jhwqostgpakwnbechgjt.supabase.co:5432/postgres'
    });
    await client.connect();
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';");
    console.log(res.rows);
    
    const cols = await client.query("SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name IN ('claims', 'Claims');");
    console.log(cols.rows);

    await client.query("NOTIFY pgrst, 'reload schema'");
    console.log('reloaded schema cache');
    await client.end();
}
check();
