const fetch = require('node-fetch');

async function verify() {
    console.log('--- Verifying Claim Fix ---');
    const workerId = 'fc16d4bd-12c8-472b-8a16-521946058020'; 
    const policyId = 'f1fcd8c0-1720-42ce-872f-537482f58020';
    
    try {
        const response = await fetch('http://localhost:3001/api/trigger-claim', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                policy_id: policyId,
                worker_id: workerId,
                trigger_type: 'Heavy Rain - Direct Policy ID Test',
                payout_amount: 850
            })
        });

        const data = await response.json();
        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(data, null, 2));

        if (data.success) {
            console.log('\n✅ VERIFICATION SUCCESSFUL: Claim processed with correct schema.');
        } else {
            console.error('\n❌ VERIFICATION FAILED:', data.error);
        }
    } catch (err) {
        console.error('\n❌ ERROR connecting to backend:', err.message);
        console.log('Hint: Make sure the backend server (server.js) is running on port 3001.');
    }
}

verify();
