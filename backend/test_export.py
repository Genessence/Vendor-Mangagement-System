#!/usr/bin/env python3
"""
Test script for vendor export functionality
"""

import requests
import json

# Configuration
BASE_URL = "http://localhost:8000"
LOGIN_URL = f"{BASE_URL}/api/v1/auth/login"

def test_export_functionality():
    """Test the export functionality"""
    
    # First, login to get access token
    login_data = {
        "email": "admin@example.com",
        "password": "admin123"
    }
    
    try:
        # Login
        print("🔐 Logging in...")
        login_response = requests.post(LOGIN_URL, json=login_data)
        
        if login_response.status_code != 200:
            print(f"❌ Login failed: {login_response.status_code}")
            print(login_response.text)
            return
        
        token_data = login_response.json()
        access_token = token_data.get("access_token")
        
        if not access_token:
            print("❌ No access token received")
            return
        
        print("✅ Login successful")
        
        # Test PDF export
        print("\n📄 Testing PDF export...")
        pdf_url = f"{BASE_URL}/api/v1/vendors/1/export/pdf"
        headers = {"Authorization": f"Bearer {access_token}"}
        
        pdf_response = requests.get(pdf_url, headers=headers)
        
        if pdf_response.status_code == 200:
            print("✅ PDF export successful")
            print(f"   Content-Type: {pdf_response.headers.get('Content-Type')}")
            print(f"   Content-Length: {len(pdf_response.content)} bytes")
            
            # Save PDF for inspection
            with open("test_vendor_export.pdf", "wb") as f:
                f.write(pdf_response.content)
            print("   📁 PDF saved as 'test_vendor_export.pdf'")
        else:
            print(f"❌ PDF export failed: {pdf_response.status_code}")
            print(pdf_response.text)
        
        # Test Excel export
        print("\n📊 Testing Excel export...")
        excel_url = f"{BASE_URL}/api/v1/vendors/1/export/excel"
        
        excel_response = requests.get(excel_url, headers=headers)
        
        if excel_response.status_code == 200:
            print("✅ Excel export successful")
            print(f"   Content-Type: {excel_response.headers.get('Content-Type')}")
            print(f"   Content-Length: {len(excel_response.content)} bytes")
            
            # Save Excel for inspection
            with open("test_vendor_export.xlsx", "wb") as f:
                f.write(excel_response.content)
            print("   📁 Excel saved as 'test_vendor_export.xlsx'")
        else:
            print(f"❌ Excel export failed: {excel_response.status_code}")
            print(excel_response.text)
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection error: Make sure the backend server is running on http://localhost:8000")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("🚀 Testing Vendor Export Functionality")
    print("=" * 50)
    test_export_functionality()
    print("\n" + "=" * 50)
    print("✅ Test completed!") 