#!/usr/bin/env python3
"""
Debug script to test vendor registration and identify validation errors
"""

import requests
import json
from pydantic import ValidationError

# Test data for French vendor registration
test_data = {
    "business_vertical": "Technology",
    "company_name": "Test French Company",
    "country_origin": "FR",  # France
    "registration_number": "FR123456789",
    "incorporation_certificate_path": None,
    "contact_person_name": "Jean Dupont",
    "designation": "CEO",
    "email": "jean.dupont@testcompany.fr",
    "phone_number": "+33123456789",
    "website": "https://www.testcompany.fr",
    "year_established": 2020,
    "business_description": "Technology solutions provider",
    
    # Address information
    "registered_address": "123 Rue de la Paix",
    "registered_city": "Paris",
    "registered_state": "Île-de-France",
    "registered_country": "France",
    "registered_pincode": "75001",
    "supply_address": "123 Rue de la Paix",
    "supply_city": "Paris",
    "supply_state": "Île-de-France",
    "supply_country": "France",
    "supply_pincode": "75001",
    
    # Bank information
    "bank_name": "BNP Paribas",
    "account_number": "12345678901",
    "account_type": "Compte Professionnel",
    "ifsc_code": "BNPAFRPPXXX",
    "branch_name": "Paris La Défense",
    "currency": "EUR",
    
    # Supplier categorization
    "supplier_type": "supplier",  # Valid values: manufacturer, supplier, service_provider, distributor
    "supplier_group": "technology",
    "supplier_category": "software",
    "annual_turnover": 5000000.0,
    "products_services": "Software development, IT consulting",
    "msme_status": "non_msme",  # Valid values: msme, non_msme, pending
    "msme_category": None,
    "msme_number": None,
    "industry_sector": "Technology",
    "employee_count": "50-100",
    "certifications": "ISO 9001, ISO 27001",
    
    # Compliance information
    "pan_number": None,
    "gst_number": None,
    "preferred_currency": "EUR",
    "tax_registration_number": "FR12345678901",
    "vat_number": "FR12345678901",
    "business_license": "75001-2024-001234",
    "gta_registration": "yes",
    "compliance_notes": "Compliant with French commercial law",
    "credit_rating": "A+",
    "insurance_coverage": "€5,000,000",
    "special_certifications": "ISO 9001:2015, ISO 14001:2015",
    
    # Agreements
    "nda": True,
    "sqa": True,
    "four_m": True,
    "code_of_conduct": True,
    "compliance_agreement": True,
    "self_declaration": True,
    
    # Nested agreements object (alternative format)
    "agreements": {
        "nda": True,
        "sqa": True,
        "four_m": True,
        "code_of_conduct": True,
        "compliance_agreement": True,
        "self_declaration": True
    }
}

def test_registration():
    """Test the vendor registration endpoint"""
    
    url = "http://localhost:8000/api/v1/vendors/public-registration"
    headers = {
        "Content-Type": "application/json",
        "accept": "application/json"
    }
    
    try:
        print("Testing vendor registration...")
        print(f"URL: {url}")
        print(f"Data: {json.dumps(test_data, indent=2)}")
        
        response = requests.post(url, json=test_data, headers=headers)
        
        print(f"\nResponse Status: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("✅ Registration successful!")
            result = response.json()
            print(f"Vendor created with ID: {result.get('id')}")
            print(f"Vendor Code: {result.get('vendor_code')}")
        elif response.status_code == 422:
            print("❌ Validation Error (422 Unprocessable Entity)")
            try:
                error_detail = response.json()
                print(f"Error Details: {json.dumps(error_detail, indent=2)}")
                
                # Parse validation errors
                if 'detail' in error_detail:
                    for error in error_detail['detail']:
                        if 'loc' in error and 'msg' in error:
                            field_path = ' -> '.join(str(x) for x in error['loc'])
                            print(f"Field: {field_path}")
                            print(f"Error: {error['msg']}")
                            print(f"Type: {error.get('type', 'unknown')}")
                            print("---")
            except Exception as e:
                print(f"Could not parse error response: {e}")
                print(f"Raw response: {response.text}")
        else:
            print(f"❌ Unexpected status code: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Make sure the backend server is running on http://localhost:8000")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_schema_validation():
    """Test the Pydantic schema validation locally"""
    try:
        from app.schemas.vendor import VendorCreate
        
        print("\nTesting Pydantic schema validation...")
        vendor = VendorCreate(**test_data)
        print("✅ Schema validation passed!")
        print(f"Validated data: {vendor.dict()}")
        
    except ValidationError as e:
        print("❌ Schema validation failed:")
        for error in e.errors():
            field_path = ' -> '.join(str(x) for x in error['loc'])
            print(f"Field: {field_path}")
            print(f"Error: {error['msg']}")
            print(f"Type: {error.get('type', 'unknown')}")
            print("---")
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("Make sure you're running this from the backend directory")

if __name__ == "__main__":
    print("🔍 Vendor Registration Debug Tool")
    print("=" * 50)
    
    # Test schema validation first
    test_schema_validation()
    
    # Test API endpoint
    test_registration()
    
    print("\n" + "=" * 50)
    print("Debug complete!") 