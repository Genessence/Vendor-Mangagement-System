// Comprehensive System Test for Vendor Management System
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000/api/v1';
const FRONTEND_URL = 'http://localhost:5173';

class SystemTester {
    constructor() {
        this.testResults = [];
        this.vendorId = null;
    }

    async log(message, type = 'INFO') {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${type}] ${message}`);
        this.testResults.push({ timestamp, type, message });
    }

    async testBackendHealth() {
        try {
            this.log('Testing backend health...');
            const response = await axios.get(`${API_BASE_URL}/health`);
            this.log(`Backend health check passed: ${response.status}`, 'SUCCESS');
            return true;
        } catch (error) {
            this.log(`Backend health check failed: ${error.message}`, 'ERROR');
            return false;
        }
    }

    async testVendorRegistration() {
        try {
            this.log('Testing vendor registration...');
            
            const vendorData = {
                company_name: "Test Company Pvt Ltd",
                email: `test${Date.now()}@example.com`,
                phone: "+91-9876543210",
                country_of_origin: "India",
                business_vertical: "Amber Enterprises India Limited",
                contact_person_name: "John Doe",
                company_registration_number: "123456789012345",
                
                // Address Details
                address_line1: "123 Test Street",
                address_line2: "Test Area",
                city: "Mumbai",
                state: "Maharashtra",
                country: "India",
                postal_code: "400001",
                
                // Bank Information
                bank_name: "Test Bank",
                account_number: "1234567890",
                ifsc_code: "TEST0001234",
                account_type: "current",
                bank_letterhead: "signed_stamped_letterhead",
                
                // Supplier Categorization
                supplier_group: "OEM-Customer Referred Supplier",
                supplier_category: "RW-Raw Material",
                msme_status: "msme",
                msme_category: "Micro",
                udyam_registration_number: "UDYAM-TEST-123456",
                annual_turnover: "5000000",
                currency: "INR",
                
                // Compliance
                gta: "yes",
                
                // Agreements
                agreements: {
                    nda: true,
                    sqa: true,
                    four_m_change_control: true,
                    code_of_conduct: true,
                    compliance_agreement: true,
                    self_declaration: true
                }
            };

            const response = await axios.post(`${API_BASE_URL}/vendors/public-registration`, vendorData);
            this.vendorId = response.data.id;
            this.log(`Vendor registration successful. ID: ${this.vendorId}`, 'SUCCESS');
            return true;
        } catch (error) {
            this.log(`Vendor registration failed: ${error.response?.data || error.message}`, 'ERROR');
            return false;
        }
    }

    async testGetVendors() {
        try {
            this.log('Testing get vendors endpoint...');
            const response = await axios.get(`${API_BASE_URL}/vendors`);
            this.log(`Retrieved ${response.data.length} vendors`, 'SUCCESS');
            return true;
        } catch (error) {
            this.log(`Get vendors failed: ${error.response?.data || error.message}`, 'ERROR');
            return false;
        }
    }

    async testGetVendorById() {
        if (!this.vendorId) {
            this.log('No vendor ID available for testing', 'WARNING');
            return false;
        }

        try {
            this.log(`Testing get vendor by ID: ${this.vendorId}...`);
            const response = await axios.get(`${API_BASE_URL}/vendors/${this.vendorId}`);
            this.log(`Retrieved vendor: ${response.data.company_name}`, 'SUCCESS');
            return true;
        } catch (error) {
            this.log(`Get vendor by ID failed: ${error.response?.data || error.message}`, 'ERROR');
            return false;
        }
    }

    async testVendorApproval() {
        if (!this.vendorId) {
            this.log('No vendor ID available for approval testing', 'WARNING');
            return false;
        }

        try {
            this.log('Testing vendor approval workflow...');
            
            // First, create an approval record
            const approvalData = {
                vendor_id: this.vendorId,
                status: "pending",
                reviewer_id: 1, // Assuming admin user ID
                review_date: new Date().toISOString(),
                questionnaire_answers: {
                    supplier_term_of_payment: "30 days",
                    quality_certification: "ISO 9001",
                    delivery_capability: "Within 7 days",
                    technical_support: "Available 24/7",
                    financial_stability: "Excellent",
                    commodity_code: "HSN-123456"
                }
            };

            const response = await axios.post(`${API_BASE_URL}/approvals`, approvalData);
            this.log(`Vendor approval created. ID: ${response.data.id}`, 'SUCCESS');
            return true;
        } catch (error) {
            this.log(`Vendor approval failed: ${error.response?.data || error.message}`, 'ERROR');
            return false;
        }
    }

    async testFrontendConnectivity() {
        try {
            this.log('Testing frontend connectivity...');
            const response = await axios.get(FRONTEND_URL, { timeout: 5000 });
            this.log('Frontend is accessible', 'SUCCESS');
            return true;
        } catch (error) {
            this.log(`Frontend connectivity failed: ${error.message}`, 'ERROR');
            return false;
        }
    }

    async runAllTests() {
        this.log('Starting comprehensive system test...', 'INFO');
        
        const tests = [
            { name: 'Backend Health', test: () => this.testBackendHealth() },
            { name: 'Frontend Connectivity', test: () => this.testFrontendConnectivity() },
            { name: 'Vendor Registration', test: () => this.testVendorRegistration() },
            { name: 'Get All Vendors', test: () => this.testGetVendors() },
            { name: 'Get Vendor by ID', test: () => this.testGetVendorById() },
            { name: 'Vendor Approval Workflow', test: () => this.testVendorApproval() }
        ];

        let passedTests = 0;
        let totalTests = tests.length;

        for (const test of tests) {
            this.log(`\n--- Running ${test.name} ---`);
            const result = await test.test();
            if (result) {
                passedTests++;
            }
            this.log(`--- ${test.name} ${result ? 'PASSED' : 'FAILED'} ---\n`);
        }

        this.log(`\n=== TEST SUMMARY ===`);
        this.log(`Total Tests: ${totalTests}`);
        this.log(`Passed: ${passedTests}`);
        this.log(`Failed: ${totalTests - passedTests}`);
        this.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%`);

        if (passedTests === totalTests) {
            this.log('🎉 ALL TESTS PASSED! System is working correctly.', 'SUCCESS');
        } else {
            this.log('❌ Some tests failed. Please check the logs above.', 'ERROR');
        }

        return passedTests === totalTests;
    }

    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total: this.testResults.length,
                success: this.testResults.filter(r => r.type === 'SUCCESS').length,
                error: this.testResults.filter(r => r.type === 'ERROR').length,
                warning: this.testResults.filter(r => r.type === 'WARNING').length
            },
            results: this.testResults
        };

        console.log('\n=== DETAILED TEST REPORT ===');
        console.log(JSON.stringify(report, null, 2));
        
        return report;
    }
}

// Run the tests
async function main() {
    const tester = new SystemTester();
    
    try {
        await tester.runAllTests();
        tester.generateReport();
    } catch (error) {
        console.error('Test execution failed:', error);
    }
}

// Check if axios is available
if (typeof require !== 'undefined' && require.main === module) {
    try {
        require('axios');
        main();
    } catch (error) {
        console.error('Axios not found. Please install it with: npm install axios');
        console.error('Or run this in the vendorhub directory where axios is available');
    }
}

module.exports = SystemTester; 