require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function seedData() {
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
    );

    console.log('Seeding data...');

    // 1. Create Worker
    const { data: worker, error: wError } = await supabase.from('Workers').insert([{
        name: 'Test Worker',
        phone: '1234567890',
        platform: 'Swiggy',
        city: 'Bangalore',
        upi_id: 'test@upi'
    }]).select().single();

    if (wError) {
        console.error('Worker Seed Error:', wError.message);
        return;
    }
    console.log('Worker created:', worker.id);

    // 2. Create Policy
    console.log('Creating policy for worker:', worker.id);
    let policyData = {
        weekly_premium: 245,
        coverage_amount: 50000,
        status: 'active'
    };

    // Try both snake_case and camelCase
    let policy;
    let pError;

    console.log('Trying snake_case (worker_id)...');
    ({ data: policy, error: pError } = await supabase.from('Policies').insert([{
        ...policyData,
        worker_id: worker.id
    }]).select().single());

    if (pError) {
        console.warn('snake_case failed:', pError.message);
        console.log('Trying camelCase (workerId)...');
        ({ data: policy, error: pError } = await supabase.from('Policies').insert([{
            ...policyData,
            workerId: worker.id
        }]).select().single());
    }

    if (pError) {
        console.error('Policy Seed Error (Both failed):', pError.message);
        console.error('HINT:', pError.hint);
        return;
    }
    console.log('Policy created:', policy.id);

    // Store in localStorage analog for the script
    console.log('\nSUCCESS! Use this worker_id for testing:', worker.id);
}

seedData();
