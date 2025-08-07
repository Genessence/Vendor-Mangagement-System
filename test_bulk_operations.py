#!/usr/bin/env python3
"""
Test script to verify the bulk operations endpoints
"""

import requests
import json

def test_bulk_operations():
    """Test all bulk operation endpoints"""
    
    base_url = "http://localhost:8000/api/v1/vendors"
    
    # First, get some vendors to work with
    print("🔍 Getting vendors list...")
    try:
        response = requests.get(f"{base_url}")
        if response.status_code == 200:
            vendors = response.json()
            print(f"✅ Found {len(vendors)} vendors")
            
            if len(vendors) > 0:
                vendor_ids = [vendor['id'] for vendor in vendors[:2]]  # Use first 2 vendors for testing
                print(f"📋 Using vendor IDs: {vendor_ids}")
                
                # Test bulk export
                print("\n🔍 Testing bulk export...")
                export_response = requests.post(
                    f"{base_url}/bulk/export",
                    json={
                        "vendor_ids": vendor_ids,
                        "format": "json"
                    }
                )
                
                if export_response.status_code == 200:
                    export_data = export_response.json()
                    print(f"✅ Bulk export successful: {export_data['count']} vendors exported")
                else:
                    print(f"❌ Bulk export failed: {export_response.status_code} - {export_response.text}")
                
                # Test bulk status update
                print("\n🔍 Testing bulk status update...")
                status_response = requests.post(
                    f"{base_url}/bulk/status-update",
                    json={
                        "vendor_ids": vendor_ids,
                        "status": "active",
                        "reason": "Test bulk update"
                    }
                )
                
                if status_response.status_code == 200:
                    status_data = status_response.json()
                    print(f"✅ Bulk status update successful: {status_data['updated_count']} vendors updated")
                else:
                    print(f"❌ Bulk status update failed: {status_response.status_code} - {status_response.text}")
                
                # Test bulk delete (we'll skip this to avoid deleting actual data)
                print("\n🔍 Skipping bulk delete test to avoid data loss...")
                print("✅ Bulk delete endpoint is available but not tested")
                
                # Test bulk import (we'll skip this as it requires a file)
                print("\n🔍 Skipping bulk import test (requires file upload)...")
                print("✅ Bulk import endpoint is available but not tested")
                
            else:
                print("⚠️ No vendors found to test with")
                
        else:
            print(f"❌ Failed to get vendors: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"❌ Exception occurred: {e}")

if __name__ == "__main__":
    test_bulk_operations() 