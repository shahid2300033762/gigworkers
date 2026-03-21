require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function guess() {
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
    );

    const dummyUuid = '00000000-0000-0000-0000-000000000000';
    const variations = ['policy_id', 'policyId', 'PolicyId', 'policy_ID', 'policyid'];

    for (const v of variations) {
        console.log(`Trying variation: ${v}...`);
        const { error } = await supabase.from('Claims').insert([{
            [v]: dummyUuid,
            trigger_type: 'test',
            payout_amount: 0
        }]);

        if (error) {
            console.log(`  Failed: ${error.message}`);
            if (error.message.includes('Could not find')) {
                // Keep trying
            } else {
                console.log(`  Interesting error: ${error.message} (Hint: ${error.hint})`);
                if (error.message.includes('violates foreign key constraint')) {
                  console.log(`  MATCH FOUND! ${v} exists but failed FK check (expected).`);
                  break;
                }
            }
        } else {
            console.log(`  SUCCESS with variation: ${v}`);
            break;
        }
    }
}

guess();
