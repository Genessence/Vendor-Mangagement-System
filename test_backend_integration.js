// Test script to verify backend integration
const axios = require('axios');

const BACKEND_URL = 'http://localhost:8000';

async function testBackendConnection() {
  console.log('🔍 Testing Backend Integration...\n');
  
  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BACKEND_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test 2: Root endpoint
    console.log('\n2. Testing root endpoint...');
    const rootResponse = await axios.get(`${BACKEND_URL}/`);
    console.log('✅ Root endpoint passed:', rootResponse.data);
    
    // Test 3: API docs
    console.log('\n3. Testing API docs...');
    const docsResponse = await axios.get(`${BACKEND_URL}/docs`);
    console.log('✅ API docs accessible (status:', docsResponse.status, ')');
    
    // Test 4: Check if vendor endpoints are available
    console.log('\n4. Testing vendor endpoints availability...');
    try {
      const vendorsResponse = await axios.get(`${BACKEND_URL}/api/v1/vendors/`);
      console.log('✅ Vendor endpoints accessible');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Vendor endpoints exist (authentication required)');
      } else {
        console.log('❌ Vendor endpoints not accessible:', error.message);
      }
    }
    
    console.log('\n🎉 Backend is running and accessible!');
    console.log('📚 API Documentation: http://localhost:8000/docs');
    console.log('🔗 ReDoc Documentation: http://localhost:8000/redoc');
    
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   - Backend is running on port 8000');
    console.log('   - No firewall blocking the connection');
    console.log('   - Backend started with: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000');
  }
}

// Run the test
testBackendConnection(); 