#!/usr/bin/env python3
import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from app.database import SessionLocal
from app.models.vendor import Vendor

def clear_vendors():
    """Clear all vendor data from the database"""
    try:
        db = SessionLocal()
        
        # Get count before deletion
        count_before = db.query(Vendor).count()
        print(f"Found {count_before} vendors in database")
        
        if count_before > 0:
            # Delete all vendors
            db.query(Vendor).delete()
            db.commit()
            print("All vendors deleted successfully")
        else:
            print("No vendors found in database")
        
        # Verify deletion
        count_after = db.query(Vendor).count()
        print(f"Vendors remaining: {count_after}")
        
        db.close()
        return True
        
    except Exception as e:
        print(f"Error clearing vendors: {e}")
        return False

if __name__ == "__main__":
    success = clear_vendors()
    if success:
        print("Database cleared successfully!")
    else:
        print("Failed to clear database")
        sys.exit(1) 