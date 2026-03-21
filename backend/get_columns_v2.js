require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function check() {
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
    );

    console.log('--- Checking Claims table presence ---');
    const { data: cData, error: cError } = await supabase.from('Claims').select('*').limit(1);
    
    if (cError) {
        console.error('Error selecting from Claims:', cError.message);
        console.log('Hint:', cError.hint);
    } else {
        console.log('Claims table exists.');
        if (cData.length > 0) {
            console.log('Columns in first row:', Object.keys(cData[0]));
        } else {
            console.log('Claims table is empty. Trying "bad" insert for schema discovery...');
            const { error: iError } = await supabase.from('Claims').insert([{ 
                "non_existent_column_123": "val" 
            }]);
            console.log('Insert error message:', iError.message);
            console.log('Insert error hint:', iError.hint);
            console.log('Insert error details:', iError.details);
        }
    }
}

check();
