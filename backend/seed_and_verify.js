require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

async function endToEndTest() {
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
    );

    console.log('--- End-to-End Verification ---');

    try {
        // 1. Create a fresh worker
        const phone = '9' + Math.floor(Math.random() * 9000000000);
        console.log(`Creating worker with phone: ${phone}...`);
        const { data: worker, error: wError } = await supabase.from('Workers').insert([{
            name: 'Verification Bot',
            phone: phone,
            platform: 'Swiggy',
            city: 'Bangalore',
            upi_id: 'bot@upi'
        }]).select().single();

        if (wError) throw wError;
        console.log('✅ Worker created:', worker.id);

        // 2. Create an active policy for the worker
        console.log('Creating active policy...');
        const { data: policy, error: pError } = await supabase.from('Policies').insert([{
            worker_id: worker.id,
            weekly_premium: 150,
            coverage_amount: 50000,
            weekly_payout: 50000,
            status: 'active'
        }]).select().single();

        if (pError) throw pError;
        console.log('✅ Policy created:', policy.id);

        // 3. Trigger a claim via the backend API
        console.log('Triggering claim via backend API...');
        const response = await fetch('http://localhost:3001/api/trigger-claim', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                worker_id: worker.id,
                trigger_type: 'Cyclone - E2E Test',
                payout_amount: 1200
            })
        });

        const claimResult = await response.json();
        console.log('API Response Status:', response.status);
        console.log('API Response:', JSON.stringify(claimResult, null, 2));

        if (claimResult.success) {
            console.log('\n✨ E2E VERIFICATION SUCCESSFUL! ✨');
            console.log('Claim Column Check:', {
                worker_id: claimResult.claim.worker_id,
                disruption_type: claimResult.claim.disruption_type
            });
        } else {
            console.error('\n❌ E2E VERIFICATION FAILED:', claimResult.error);
        }

    } catch (err) {
        console.error('\n❌ TEST ERROR:', err.message);
    }
}

endToEndTest();
