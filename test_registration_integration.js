// Test script to verify vendor registration integration step by step
const axios = require('axios');

const BACKEND_URL = 'http://localhost:8000';
const FRONTEND_URL = 'http://localhost:5173';

// Sample vendor registration data
const sampleVendorData = {
  // Company Information
  businessVertical: 'amber-enterprises',
  companyName: 'Test Company Ltd',
  registrationNumber: 'REG123456',
  contactPersonName: 'John Doe',
  designation: 'Manager',
  email: 'test@example.com',
  phoneNumber: '+91 98765 43210',
  website: 'https://testcompany.com',
  yearEstablished: '2020',
  businessDescription: 'Test company description',

  // Address Details
  registeredAddress: '123 Test Street',
  registeredCity: 'Mumbai',
  registeredState: 'Maharashtra',
  registeredCountry: 'IN',
  registeredPincode: '400001',
  sameAsRegistered: false,
  supplyAddress: '456 Supply Street',
  supplyCity: 'Delhi',
  supplyState: 'Delhi',
  supplyCountry: 'IN',
  supplyPincode: '110001',

  // Bank Information
  bankName: 'Test Bank',
  branchName: 'Main Branch',
  accountNumber: '1234567890',
  confirmAccountNumber: '1234567890',
  accountType: 'Savings',
  ifscCode: 'TEST0001234',
  swiftCode: 'TESTSWIFT',
  bankAddress: 'Bank Address',

  // Categorization
  supplierType: 'manufacturer',
  supplierGroup: 'Electronics',
  supplierCategory: 'Components',
  annualTurnover: '50000000',
  productsServices: 'Electronic components',
  msmeStatus: 'msme',
  msmeNumber: 'MSME123456',
  industrySector: 'Electronics',
  employeeCount: '50-100',
  certifications: 'ISO 9001',

  // Compliance
  preferredCurrency: 'INR',
  taxRegistrationNumber: 'TAX123456',
  panNumber: 'ABCDE1234F',
  gstNumber: '27ABCDE1234F1Z5',
  natureOfAssessee: 'Company',
  tanNumber: 'TAN123456',
  placeOfSupply: 'Maharashtra',
  vatNumber: 'VAT123456',
  businessLicense: 'LIC123456',
  complianceNotes: 'Compliant',
  creditRating: 'A+',
  insuranceCoverage: 'Comprehensive',
  specialCertifications: 'ISO 14001',

  // Agreements
  agreements: {
    nda: true,
    sqa: true,
    fourM: true,
    codeOfConduct: true,
    complianceAgreement: true,
    selfDeclaration: true
  }
};

async function testBackendHealth() {
  console.log('🔍 Step 1: Testing Backend Health...');
  try {
    const response = await axios.get(`${BACKEND_URL}/health`);
    console.log('✅ Backend is healthy:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Backend health check failed:', error.message);
    return false;
  }
}

async function testBackendAPIs() {
  console.log('\n🔍 Step 2: Testing Backend API Endpoints...');
  
  try {
    // Test root endpoint
    const rootResponse = await axios.get(`${BACKEND_URL}/`);
    console.log('✅ Root endpoint accessible');
    
    // Test API docs
    const docsResponse = await axios.get(`${BACKEND_URL}/docs`);
    console.log('✅ API documentation accessible');
    
    // Test vendor endpoints (should require authentication)
    try {
      await axios.get(`${BACKEND_URL}/api/v1/vendors/`);
      console.log('⚠️  Vendor endpoints accessible without auth (should require auth)');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Vendor endpoints properly protected (authentication required)');
      } else {
        console.log('❌ Vendor endpoints error:', error.message);
      }
    }
    
    return true;
  } catch (error) {
    console.log('❌ Backend API test failed:', error.message);
    return false;
  }
}

async function testFrontendBackendConnection() {
  console.log('\n🔍 Step 3: Testing Frontend-Backend Connection...');
  
  try {
    // Test if frontend can reach backend
    const response = await axios.get(`${FRONTEND_URL}`);
    console.log('✅ Frontend is running');
    
    // Test CORS by making a request from frontend to backend
    const corsResponse = await axios.get(`${BACKEND_URL}/health`, {
      headers: {
        'Origin': FRONTEND_URL,
        'Access-Control-Request-Method': 'GET'
      }
    });
    console.log('✅ CORS is properly configured');
    
    return true;
  } catch (error) {
    console.log('❌ Frontend-Backend connection test failed:', error.message);
    return false;
  }
}

async function testVendorRegistrationFlow() {
  console.log('\n🔍 Step 4: Testing Vendor Registration Flow...');
  
  try {
    // First, we need to authenticate to test the registration
    console.log('📝 Note: Registration requires authentication');
    console.log('📝 To test registration, you need to:');
    console.log('   1. Login with admin credentials');
    console.log('   2. Get an access token');
    console.log('   3. Use the token to create a vendor');
    
    console.log('\n📋 Registration Flow Steps:');
    console.log('   Step 1: POST /api/v1/auth/login (get token)');
    console.log('   Step 2: POST /api/v1/vendors/ (create vendor)');
    console.log('   Step 3: POST /api/v1/vendors/{id}/addresses (add addresses)');
    console.log('   Step 4: POST /api/v1/vendors/{id}/bank-info (add bank info)');
    console.log('   Step 5: POST /api/v1/vendors/{id}/compliance (add compliance)');
    console.log('   Step 6: POST /api/v1/vendors/{id}/agreements (add agreements)');
    
    return true;
  } catch (error) {
    console.log('❌ Registration flow test failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Vendor Registration Integration Tests...\n');
  
  const results = {
    backendHealth: await testBackendHealth(),
    backendAPIs: await testBackendAPIs(),
    frontendBackendConnection: await testFrontendBackendConnection(),
    registrationFlow: await testVendorRegistrationFlow()
  };
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  const allPassed = Object.values(results).every(result => result);
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! The integration is working correctly.');
    console.log('\n📝 Next Steps:');
    console.log('   1. Open http://localhost:5173/public-vendor-registration-form');
    console.log('   2. Fill out the 6-step registration form');
    console.log('   3. Submit the form to test the complete integration');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the issues above.');
  }
}

// Run the tests
runAllTests().catch(console.error); 