require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function list() {
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
    );

    console.log('--- Listing inserted claims ---');
    const { data, error } = await supabase.from('Claims').select('*').order('timestamp', { ascending: false }).limit(1);
    
    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('Inserted Row:', JSON.stringify(data[0], null, 2));
        console.log('Columns:', Object.keys(data[0]));
    }
}

list();
