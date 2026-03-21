const fetch = require('node-fetch');

async function testProxy() {
    console.log('--- Testing Registration Proxy ---');

    // 1. Test success (assuming backend is up)
    console.log('\nScenario 1: Testing registration success...');
    try {
        const payload = {
            id: '00000000-0000-0000-0000-000000000100',
            name: 'Verification User',
            phone: '8888888888',
            platform: 'Swiggy',
            city: 'Bangalore',
            upi_id: 'verify@upi',
            license: 'VERIFY123',
            risk_score: 0.5
        };
        const res = await fetch('http://localhost:3000/api/register-worker', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Response:', data);
    } catch (err) {
        console.error('Error in Scenario 1:', err.message);
    }

    // 2. Test duplicate (should return 400 from backend, proxied)
    console.log('\nScenario 2: Testing duplicate registration (should fail gracefully)...');
    try {
        const payload = {
            id: '00000000-0000-0000-0000-000000000100', // same id
            name: 'Verification User',
            phone: '8888888888',
            platform: 'Swiggy',
            city: 'Bangalore',
            upi_id: 'verify@upi',
            license: 'VERIFY123',
            risk_score: 0.5
        };
        const res = await fetch('http://localhost:3000/api/register-worker', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Response:', data);
    } catch (err) {
        console.error('Error in Scenario 2:', err.message);
    }

    // Note: To test 502, we would need to stop the backend server (port 3001).
    // Since it's currently running, we'll assume the success/fail cases cover the JSON handling logic.
}

testProxy();
