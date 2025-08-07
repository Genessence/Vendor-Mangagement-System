#!/usr/bin/env python3
"""
Script to add sample agreement data to the database for testing
"""

import sys
import os
from datetime import datetime, date
from sqlalchemy.orm import sessionmaker

# Add the parent directory to the path so we can import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine, get_db
from app.models.vendor import Vendor, VendorAgreementDetail

def add_sample_agreements():
    """Add sample agreement data to the database"""
    
    # Create a session
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Get the first vendor (assuming there's at least one)
        vendor = db.query(Vendor).first()
        
        if not vendor:
            print("No vendors found in the database. Please create a vendor first.")
            return
        
        print(f"Adding sample agreements for vendor: {vendor.company_name} (ID: {vendor.id})")
        
        # Sample agreement data
        sample_agreements = [
            {
                "title": "Non-Disclosure Agreement (NDA)",
                "type": "Legal",
                "status": "Signed",
                "signed_date": date(2024, 3, 25),
                "signed_by": "Rajesh Kumar (CEO)",
                "valid_until": "24/03/2027",
                "description": "Confidentiality agreement to protect sensitive business information and trade secrets",
                "version": "2.1",
                "document_size": "234 KB",
                "last_modified": date(2024, 3, 20),
                "witness_required": False,
                "auto_renewal": True
            },
            {
                "title": "Supplier Quality Agreement (SQA)",
                "type": "Quality",
                "status": "Signed",
                "signed_date": date(2024, 3, 25),
                "signed_by": "Rajesh Kumar (CEO)",
                "valid_until": "24/03/2027",
                "description": "Quality standards and requirements agreement ensuring product/service quality compliance",
                "version": "3.0",
                "document_size": "567 KB",
                "last_modified": date(2024, 3, 22),
                "witness_required": True,
                "auto_renewal": False
            },
            {
                "title": "4M Change Management Agreement",
                "type": "Operational",
                "status": "Signed",
                "signed_date": date(2024, 3, 26),
                "signed_by": "Rajesh Kumar (CEO)",
                "valid_until": "25/03/2027",
                "description": "Agreement for managing changes in Man, Machine, Material, and Method processes",
                "version": "1.5",
                "document_size": "345 KB",
                "last_modified": date(2024, 3, 24),
                "witness_required": False,
                "auto_renewal": True
            },
            {
                "title": "Code of Conduct Agreement",
                "type": "Compliance",
                "status": "Signed",
                "signed_date": date(2024, 3, 26),
                "signed_by": "Rajesh Kumar (CEO)",
                "valid_until": "Perpetual",
                "description": "Ethical business practices and conduct standards agreement",
                "version": "2.0",
                "document_size": "456 KB",
                "last_modified": date(2024, 3, 25),
                "witness_required": False,
                "auto_renewal": False
            },
            {
                "title": "Compliance Agreement",
                "type": "Legal",
                "status": "Pending Signature",
                "signed_date": None,
                "signed_by": None,
                "valid_until": "TBD",
                "description": "Regulatory and legal compliance requirements agreement",
                "version": "1.0",
                "document_size": "389 KB",
                "last_modified": date(2024, 7, 20),
                "witness_required": True,
                "auto_renewal": False
            },
            {
                "title": "Self Declaration Agreement",
                "type": "Declaration",
                "status": "Signed",
                "signed_date": date(2024, 3, 27),
                "signed_by": "Rajesh Kumar (CEO)",
                "valid_until": "Annual Renewal",
                "description": "Self-declaration of business capabilities, financial status, and compliance",
                "version": "1.2",
                "document_size": "278 KB",
                "last_modified": date(2024, 3, 26),
                "witness_required": False,
                "auto_renewal": True
            }
        ]
        
        # Check if agreements already exist for this vendor
        existing_agreements = db.query(VendorAgreementDetail).filter(
            VendorAgreementDetail.vendor_id == vendor.id
        ).count()
        
        if existing_agreements > 0:
            print(f"Vendor already has {existing_agreements} agreements. Skipping sample data creation.")
            return
        
        # Add sample agreements
        for agreement_data in sample_agreements:
            agreement = VendorAgreementDetail(
                vendor_id=vendor.id,
                **agreement_data
            )
            db.add(agreement)
            print(f"Added agreement: {agreement_data['title']}")
        
        # Commit the changes
        db.commit()
        print(f"Successfully added {len(sample_agreements)} sample agreements to vendor {vendor.company_name}")
        
    except Exception as e:
        print(f"Error adding sample agreements: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_sample_agreements() 