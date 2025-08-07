const API_BASE_URL = 'http://localhost:8000/api/v1';

// Sample vendor data that should work
const testVendorData = {
  business_vertical: "Amber Enterprises India Limited",
  company_name: "Test Company",
  country_origin: "IN",
  registration_number: "123456789",
  contact_person_name: "John Doe",
  designation: "Manager",
  email: "test@example.com",
  phone_number: "+91-9876543210",
  website: "https://test.com",
  year_established: 2020,
  business_description: "Test business",
  
  // Address information
  registered_address: "123 Test Street",
  registered_city: "Mumbai",
  registered_state: "Maharashtra",
  registered_country: "IN",
  registered_pincode: "400001",
  supply_address: "123 Test Street",
  supply_city: "Mumbai",
  supply_state: "Maharashtra",
  supply_country: "IN",
  supply_pincode: "400001",
  
  // Bank information
  bank_name: "Test Bank",
  account_number: "1234567890",
  account_type: "savings",
  ifsc_code: "TEST0001234",
  branch_name: "Test Branch",
  currency: "INR",
  
  // Supplier categorization
  supplier_type: "manufacturer",
  supplier_group: "oem-customer",
  supplier_category: "rw-raw-material",
  annual_turnover: 1000000,
  products_services: "Test products",
  msme_status: "msme",
  msme_category: "small",
  msme_number: "UDYAM-TEST-123",
  industry_sector: "Manufacturing",
  employee_count: "50-100",
  certifications: "ISO 9001",
  
  // Compliance information
  pan_number: "ABCDE1234F",
  gst_number: "27ABCDE1234F1Z5",
  preferred_currency: "INR",
  tax_registration_number: "TAX123456",
  vat_number: "VAT123456",
  business_license: "LIC123456",
  gta_registration: "yes",
  compliance_notes: "Compliant",
  credit_rating: "A",
  insurance_coverage: "Yes",
  special_certifications: "ISO 14001",
  
  // Agreements
  nda: true,
  sqa: true,
  four_m: true,
  code_of_conduct: true,
  compliance_agreement: true,
  self_declaration: true
};

async function testFormSubmission() {
  try {
    console.log('Testing form submission...');
    console.log('API URL:', `${API_BASE_URL}/vendors/public-registration`);
    console.log('Data being sent:', JSON.stringify(testVendorData, null, 2));
    
    const response = await fetch(`${API_BASE_URL}/vendors/public-registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testVendorData)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
    if (!response.ok) {
      console.error('Error response:', response.status, responseText);
    } else {
      console.log('Success! Vendor created successfully.');
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

// Run the test
testFormSubmission(); 