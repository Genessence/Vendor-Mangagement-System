const API_BASE_URL = 'http://localhost:8000/api/v1';

// Minimal test data
const testData = {
  business_vertical: "Amber Enterprises India Limited",
  company_name: "Test Company",
  country_origin: "IN",
  contact_person_name: "John Doe",
  email: "test4@example.com",
  phone_number: "+91-9876543213",
  nda: true,
  sqa: true,
  four_m: true,
  code_of_conduct: true,
  compliance_agreement: true,
  self_declaration: true
};

async function testAPI() {
  try {
    console.log('Testing API with minimal data...');
    console.log('Data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch(`${API_BASE_URL}/vendors/public-registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Response:', responseText);
    
    if (!response.ok) {
      console.error('Error:', response.status, responseText);
    } else {
      console.log('Success!');
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

testAPI(); 