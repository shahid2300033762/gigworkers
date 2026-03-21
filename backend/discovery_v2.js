require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function discovery() {
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
    );

    console.log('--- Discovering required columns for Claims (v2) ---');
    const { error } = await supabase.from('Claims').insert([{
        payout_amount: 500
    }]);
    
    if (error) {
        console.log('Error Message:', error.message);
    } else {
        console.log('SUCCESS');
    }
}

discovery();
