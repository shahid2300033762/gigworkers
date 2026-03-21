const { Client } = require('pg');
require('dotenv').config();

async function reload() {
    const client = new Client({
        connectionString: `postgresql://postgres:${process.env.SUPABASE_DB_PASSWORD}@db.jhwqostgpakwnbechgjt.supabase.co:5432/postgres`
    });
    
    try {
        await client.connect();
        await client.query("NOTIFY pgrst, 'reload schema'");
        console.log('Successfully reloaded PostgREST schema cache!');
    } catch (err) {
        console.error('Error reloading schema cache:', err.message);
    } finally {
        await client.end();
    }
}

reload();
