#!/usr/bin/env python3
"""
Test database connection directly
"""

import psycopg2
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_connection():
    """Test direct database connection"""
    
    # Get the DATABASE_URL from .env
    database_url = os.getenv('DATABASE_URL')
    print(f"🔍 DATABASE_URL from .env: {database_url}")
    
    # Parse the connection string manually
    if database_url and database_url.startswith('postgresql://'):
        # Extract components
        parts = database_url.replace('postgresql://', '').split('@')
        if len(parts) == 2:
            user_pass = parts[0].split(':')
            host_port_db = parts[1].split('/')
            
            if len(user_pass) >= 2 and len(host_port_db) >= 2:
                username = user_pass[0]
                password = user_pass[1]
                host_port = host_port_db[0].split(':')
                host = host_port[0]
                port = host_port[1] if len(host_port) > 1 else '5432'
                database = host_port_db[1]
                
                print(f"📊 Parsed connection details:")
                print(f"   Username: {username}")
                print(f"   Password: {password}")
                print(f"   Host: {host}")
                print(f"   Port: {port}")
                print(f"   Database: {database}")
                
                # Test connection
                try:
                    print(f"\n🔌 Testing connection...")
                    conn = psycopg2.connect(
                        host=host,
                        port=port,
                        database=database,
                        user=username,
                        password=password
                    )
                    
                    # Test query
                    cursor = conn.cursor()
                    cursor.execute("SELECT version();")
                    version = cursor.fetchone()
                    print(f"✅ Connection successful!")
                    print(f"   PostgreSQL version: {version[0]}")
                    
                    cursor.close()
                    conn.close()
                    return True
                    
                except psycopg2.Error as e:
                    print(f"❌ Connection failed: {e}")
                    return False
            else:
                print("❌ Could not parse user/password from DATABASE_URL")
                return False
        else:
            print("❌ Could not parse DATABASE_URL format")
            return False
    else:
        print("❌ DATABASE_URL not found or invalid format")
        return False

if __name__ == "__main__":
    print("🚀 Testing Database Connection")
    print("=" * 50)
    test_connection()
    print("=" * 50) 