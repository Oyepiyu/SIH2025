import fetch from 'node-fetch';

async function testContactEndpoint() {
    try {
        console.log('🧪 Testing Contact Form Submission...');
        
        const testData = {
            name: "John Doe",
            email: "john.doe@example.com",
            message: "This is a test message from the contact form to verify that user input is being stored in the database.",
            subject: "Test Contact Form",
            phone: "+91-9876543210",
            category: "general"
        };

        const response = await fetch('http://localhost:3001/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        const result = await response.json();
        
        console.log('📊 Response Status:', response.status);
        console.log('📄 Response Data:', JSON.stringify(result, null, 2));
        
        if (response.status === 201) {
            console.log('✅ Contact form submission successful!');
        } else {
            console.log('❌ Contact form submission failed!');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testContactEndpoint();