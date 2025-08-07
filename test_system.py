#!/usr/bin/env python3
import requests
import json
from datetime import datetime

class SystemTester:
    def __init__(self):
        self.base_url = "http://localhost:8000/api/v1"
        self.test_results = []
        self.vendor_id = None

    def log(self, message, type="INFO"):
        timestamp = datetime.now().isoformat()
        print(f"[{timestamp}] [{type}] {message}")
        self.test_results.append({"timestamp": timestamp, "type": type, "message": message})

    def test_backend_health(self):
        try:
            self.log("Testing backend connectivity...")
            response = requests.get(f"{self.base_url}/vendors/public-registration", timeout=5)
            self.log("Backend is accessible", "SUCCESS")
            return True
        except requests.exceptions.RequestException as e:
            self.log(f"Backend connectivity failed: {e}", "ERROR")
            return False

    def test_vendor_registration(self):
        try:
            self.log("Testing vendor registration...")
            
            vendor_data = {
                "company_name": "Test Company Pvt Ltd",
                "email": f"test{datetime.now().timestamp()}@example.com",
                "phone_number": "+91-9876543210",
                "country_origin": "India",
                "business_vertical": "Amber Enterprises India Limited",
                "contact_person_name": "John Doe",
                "registration_number": "123456789012345",
                
                # Address Details
                "registered_address": "123 Test Street, Test Area",
                "registered_city": "Mumbai",
                "registered_state": "Maharashtra",
                "registered_country": "India",
                "registered_pincode": "400001",
                
                # Bank Information
                "bank_name": "Test Bank",
                "account_number": "1234567890",
                "ifsc_code": "TEST0001234",
                "account_type": "current",
                "currency": "INR",
                
                # Supplier Categorization
                "supplier_group": "OEM-Customer Referred Supplier",
                "supplier_category": "RW-Raw Material",
                "msme_status": "msme",
                "msme_category": "Micro",
                "msme_number": "UDYAM-TEST-123456",
                "annual_turnover": 5000000,
                
                # Compliance
                "gta_registration": "yes",
                
                # Agreements
                "nda": True,
                "sqa": True,
                "four_m": True,
                "code_of_conduct": True,
                "compliance_agreement": True,
                "self_declaration": True
            }

            response = requests.post(f"{self.base_url}/vendors/public-registration", 
                                   json=vendor_data, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                self.vendor_id = result.get('id')
                self.log(f"Vendor registration successful. ID: {self.vendor_id}", "SUCCESS")
                return True
            else:
                self.log(f"Vendor registration failed: {response.status_code} - {response.text}", "ERROR")
                return False
                
        except Exception as e:
            self.log(f"Vendor registration error: {e}", "ERROR")
            return False

    def test_frontend_connectivity(self):
        try:
            self.log("Testing frontend connectivity...")
            response = requests.get("http://localhost:5173", timeout=5)
            self.log("Frontend is accessible", "SUCCESS")
            return True
        except requests.exceptions.RequestException as e:
            self.log(f"Frontend connectivity failed: {e}", "ERROR")
            return False

    def run_comprehensive_test(self):
        self.log("Starting comprehensive system test...", "INFO")
        
        tests = [
            ("Backend Connectivity", self.test_backend_health),
            ("Frontend Connectivity", self.test_frontend_connectivity),
            ("Vendor Registration", self.test_vendor_registration)
        ]

        passed = 0
        total = len(tests)

        for test_name, test_func in tests:
            self.log(f"\n--- Running {test_name} ---")
            if test_func():
                passed += 1
                self.log(f"✅ {test_name} PASSED")
            else:
                self.log(f"❌ {test_name} FAILED")
            self.log(f"--- {test_name} completed ---\n")

        self.log(f"\n=== TEST SUMMARY ===")
        self.log(f"Total Tests: {total}")
        self.log(f"Passed: {passed}")
        self.log(f"Failed: {total - passed}")
        self.log(f"Success Rate: {((passed / total) * 100):.2f}%")

        if passed == total:
            self.log("🎉 ALL TESTS PASSED! System is working correctly.", "SUCCESS")
        else:
            self.log("❌ Some tests failed. Please check the logs above.", "ERROR")

        return passed == total

if __name__ == "__main__":
    tester = SystemTester()
    tester.run_comprehensive_test() 