const { Client } = require('pg');
const fs = require('fs');
require('dotenv').config();

async function applySchema() {
    const client = new Client({
        connectionString: `postgresql://postgres:${process.env.SUPABASE_DB_PASSWORD}@db.jhwqostgpakwnbechgjt.supabase.co:5432/postgres`
    });

    try {
        await client.connect();
        console.log('Connected to Postgres');

        const schema = fs.readFileSync('../supabase_schema.sql', 'utf8');
        console.log('Applying schema...');

        // Add license column to Workers if it's missing from the file but used in code
        // Actually, let's just make sure the file has it.

        await client.query(schema);
        console.log('Schema applied successfully!');

    } catch (err) {
        console.error('Schema Error:', err.message);
    } finally {
        await client.end();
    }
}

applySchema();
