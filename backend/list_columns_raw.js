require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function list() {
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
    );

    console.log('--- Listing inserted claims (un-ordered) ---');
    // Just select everything and take the first one
    const { data, error } = await supabase.from('Claims').select('*').limit(1);
    
    if (error) {
        console.error('Error:', error.message);
        console.log('Hint:', error.hint);
    } else {
        console.log('Sample Row:', JSON.stringify(data[0], null, 2));
        if (data[0]) {
            console.log('Actual Columns:', Object.keys(data[0]));
        } else {
            console.log('No rows found.');
        }
    }
}

list();
