const fetch = require('node-fetch');
require('dotenv').config();

async function getColumns() {
    try {
        const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/Claims?select=*&limit=0`, {
            headers: {
                'apikey': process.env.SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
                'Prefer': 'count=exact'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('API Error:', error);
            return;
        }

        // PostgREST returns headers about the columns if we ask nicely, 
        // but it's easier to just see what's returned in a single row if available.
        // Or check the Content-Profile if enabled.
        
        console.log('Response Status:', response.status);
        console.log('Headers:', response.headers.raw());
        
        const data = await fetch(`${process.env.SUPABASE_URL}/rest/v1/Claims?select=*&limit=1`, {
            headers: {
                'apikey': process.env.SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
            }
        }).then(r => r.json());
        
        console.log('Sample Data (to see keys):', data);
        if (data.length > 0) {
            console.log('Column Names:', Object.keys(data[0]));
        } else {
            console.log('No data found in Claims table.');
            // Try to insert a dummy row or check OpenAPI spec
            const spec = await fetch(`${process.env.SUPABASE_URL}/rest/v1/`, {
                headers: {
                    'apikey': process.env.SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
                }
            }).then(r => r.json());
            
            if (spec.definitions && spec.definitions.Claims) {
                console.log('Claims Definition:', Object.keys(spec.definitions.Claims.properties));
            }
        }
    } catch (err) {
        console.error('Fetch Error:', err.message);
    }
}

getColumns();
