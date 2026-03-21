require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function seed() {
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
    );

    console.log('--- SEEDING ---');
    try {
        // 1. Create Worker
        const { data: worker, error: wError } = await supabase.from('Workers').insert([{
            name: 'Alex Rivera',
            phone: '9876543210',
            platform: 'Swiggy',
            city: 'Bangalore',
            upi_id: 'alex@okaxis',
            risk_score: 0.1
        }]).select().single();

        if (wError) throw wError;
        console.log('Worker created:', worker.id);

        // 2. Create Policy
        const { data: policy, error: pError } = await supabase.from('Policies').insert([{
            worker_id: worker.id,
            weekly_premium: 245,
            coverage_amount: 50000,
            status: 'active'
        }]).select().single();

        if (pError) throw pError;
        console.log('Policy created:', policy.id);

        console.log('SEED_SUCCESS');
        console.log('WORKER_ID:', worker.id);
    } catch (e) {
        console.error('SEED_ERROR:', e.message);
        console.error('HINT:', e.hint);
    }
}

seed();
