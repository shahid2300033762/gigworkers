const { Client } = require('pg');
require('dotenv').config();

async function inspectDb() {
    const client = new Client({
        connectionString: `postgresql://postgres:${process.env.SUPABASE_DB_PASSWORD}@db.jhwqostgpakwnbechgjt.supabase.co:5432/postgres`
    });

    try {
        await client.connect();
        console.log('Connected to Postgres');

        const tables = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log('Tables:', tables.rows.map(r => r.table_name));

        for (const table of tables.rows) {
            const columns = await client.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = '${table.table_name}'
            `);
            console.log(`\nTable: ${table.table_name}`);
            console.table(columns.rows);
        }

    } catch (err) {
        console.error('DB Error:', err.message);
    } finally {
        await client.end();
    }
}

inspectDb();
