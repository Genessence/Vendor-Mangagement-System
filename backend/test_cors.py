#!/usr/bin/env python3
"""
Test script to verify CORS configuration
"""

import requests
import json

def test_cors():
    """Test CORS configuration"""
    backend_url = "http://localhost:8000"
    
    # Test OPTIONS request (preflight)
    print("Testing CORS preflight request...")
    try:
        response = requests.options(
            f"{backend_url}/api/v1/auth/login",
            headers={
                "Origin": "http://localhost:4173",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type,Authorization"
            }
        )
        print(f"Preflight Status: {response.status_code}")
        print(f"Access-Control-Allow-Origin: {response.headers.get('Access-Control-Allow-Origin')}")
        print(f"Access-Control-Allow-Methods: {response.headers.get('Access-Control-Allow-Methods')}")
        print(f"Access-Control-Allow-Headers: {response.headers.get('Access-Control-Allow-Headers')}")
        print()
    except Exception as e:
        print(f"Preflight test failed: {e}")
        print()
    
    # Test actual POST request with form data
    print("Testing actual POST request...")
    try:
        response = requests.post(
            f"{backend_url}/api/v1/auth/login",
            headers={
                "Origin": "http://localhost:4173",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data={
                "email": "admin@example.com",
                "password": "admin123"
            }
        )
        print(f"POST Status: {response.status_code}")
        print(f"Access-Control-Allow-Origin: {response.headers.get('Access-Control-Allow-Origin')}")
        if response.status_code == 200:
            print("✅ CORS is working correctly!")
            print(f"Response: {response.json()}")
        else:
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"POST test failed: {e}")

if __name__ == "__main__":
    print("🚀 Testing CORS Configuration")
    print("=" * 50)
    test_cors()
    print("=" * 50) 