// Simple backend connectivity test
const https = require('http');

function testBackend() {
  console.log('🔍 Testing backend connectivity...');
  
  const options = {
    hostname: 'localhost',
    port: 8000,
    path: '/health',
    method: 'GET'
  };

  const req = https.request(options, (res) => {
    console.log(`✅ Backend is running! Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('📄 Response:', data);
      console.log('🎉 Backend is accessible!');
    });
  });

  req.on('error', (error) => {
    console.log('❌ Backend connection failed:', error.message);
    console.log('💡 Make sure the backend is running on port 8000');
  });

  req.end();
}

testBackend(); 