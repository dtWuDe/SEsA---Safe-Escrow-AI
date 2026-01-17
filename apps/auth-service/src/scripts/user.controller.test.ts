import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testGetUser(id: string) {
    console.log(`🔎 Testing GET /users/${id}`);

    const res = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const text = await res.text();

    console.log('Status:', res.status);
        try {
            const json = JSON.parse(text);
            console.log('Response:', JSON.stringify(json, null, 2));
        } catch {
            console.log('Raw response:', text);
        }
    }

    const id = process.argv[2];

    if (!id) {
        console.error('❌ Please provide user id');
        console.error('Usage: tsx scripts/test-get-user.ts <userId>');
        process.exit(1);
    }

    testGetUser(id).catch(err => {
    console.error('💥 Error:', err);
    process.exit(1);
});
