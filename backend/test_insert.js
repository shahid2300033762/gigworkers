require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testInsert() {
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
    );

    const dummyUuid = '00000000-0000-0000-0000-000000000000';
    
    console.log('--- Testing INSERT with worker_id and disruption_type ---');
    const { data, error } = await supabase.from('Claims').insert([{
        worker_id: dummyUuid,
        disruption_type: 'cortex_test',
        payout_amount: 0,
        status: 'failed'
    }]).select();

    if (error) {
        console.error('INSERT ERROR:', error.message);
        console.log('HINT:', error.hint);
        console.log('DETAILS:', error.details);
    } else {
        console.log('INSERT SUCCESS:', JSON.stringify(data, null, 2));
    }
}

testInsert();
