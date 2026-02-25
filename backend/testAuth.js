const testAuth = async () => {
    const email = `testuser_${Date.now()}@test.com`;
    const password = 'testpassword123';

    console.log('--- TESTING REGISTRATION ---');
    try {
        const regRes = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email,
                password,
                phone: '9988776655'
            })
        });
        const regData = await regRes.json();
        console.log('Registration Status:', regRes.status);
        console.log('Registration Data:', regData);

        if (regRes.ok) {
            console.log('\n--- TESTING LOGIN ---');
            const loginRes = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const loginData = await loginRes.json();
            console.log('Login Status:', loginRes.status);
            console.log('Login Data:', loginData);
        }
    } catch (error) {
        console.error('Auth Test Failed:', error.message);
    }
};

testAuth();
