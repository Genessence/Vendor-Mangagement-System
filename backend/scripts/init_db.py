#!/usr/bin/env python3
"""
Database initialization script with sample data
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine
from app.models import *
from app.auth import get_password_hash
from app.models.user import UserRole
from app.models.vendor import VendorStatus, VendorType, MSMEStatus
from app.models.vendor_approval import ApprovalLevel
from app.models.vendor_document import DocumentType, DocumentStatus

def init_db():
    """Initialize database with sample data"""
    db = SessionLocal()
    
    try:
        # Create sample users
        print("Creating sample users...")
        
        # Check if admin user already exists
        admin_user = db.query(User).filter(User.email == "admin@example.com").first()
        if not admin_user:
            admin_user = User(
                email="admin@example.com",
                username="admin",
                full_name="System Administrator",
                hashed_password=get_password_hash("admin123"),
                role=UserRole.ADMIN,
                is_active=True,
                is_verified=True
            )
            db.add(admin_user)
        
        # Create manager user
        manager_user = db.query(User).filter(User.email == "manager@example.com").first()
        if not manager_user:
            manager_user = User(
                email="manager@example.com",
                username="manager",
                full_name="Vendor Manager",
                hashed_password=get_password_hash("manager123"),
                role=UserRole.MANAGER,
                is_active=True,
                is_verified=True
            )
            db.add(manager_user)
        
        # Create approver user
        approver_user = db.query(User).filter(User.email == "approver@example.com").first()
        if not approver_user:
            approver_user = User(
                email="approver@example.com",
                username="approver",
                full_name="Vendor Approver",
                hashed_password=get_password_hash("approver123"),
                role=UserRole.APPROVER,
                is_active=True,
                is_verified=True
            )
            db.add(approver_user)
        
        db.commit()
        print("Sample users created successfully!")
        
        # Create sample vendors
        print("Creating sample vendors...")
        
        # Sample vendor 1
        vendor1 = db.query(Vendor).filter(Vendor.email == "techcorp@example.com").first()
        if not vendor1:
            vendor1 = Vendor(
                vendor_code="VND001",
                business_vertical="technology",
                company_name="TechCorp Solutions Pvt Ltd",
                registration_number="TECH001",
                contact_person_name="Rajesh Kumar",
                designation="CEO",
                email="techcorp@example.com",
                phone_number="+91 98765 43210",
                website="https://techcorp.com",
                year_established=2015,
                business_description="Leading technology solutions provider",
                supplier_type=VendorType.MANUFACTURER,
                supplier_group="Technology",
                supplier_category="Electronics",
                annual_turnover=50000000.0,
                products_services="Software, Hardware, IT Services",
                msme_status=MSMEStatus.MSME,
                msme_number="MSME123456",
                industry_sector="Technology",
                employee_count="50-100",
                certifications="ISO 9001, ISO 27001",
                status=VendorStatus.APPROVED
            )
            db.add(vendor1)
        
        # Sample vendor 2
        vendor2 = db.query(Vendor).filter(Vendor.email == "globalmanuf@example.com").first()
        if not vendor2:
            vendor2 = Vendor(
                vendor_code="VND002",
                business_vertical="manufacturing",
                company_name="Global Manufacturing Inc",
                registration_number="GLOB002",
                contact_person_name="John Smith",
                designation="Director",
                email="globalmanuf@example.com",
                phone_number="+1 555 123 4567",
                website="https://globalmanuf.com",
                year_established=2010,
                business_description="Global manufacturing solutions",
                supplier_type=VendorType.SUPPLIER,
                supplier_group="Manufacturing",
                supplier_category="Automotive",
                annual_turnover=250000000.0,
                products_services="Automotive parts, Manufacturing equipment",
                msme_status=MSMEStatus.NON_MSME,
                industry_sector="Manufacturing",
                employee_count="200-500",
                certifications="ISO 9001, IATF 16949",
                status=VendorStatus.PENDING
            )
            db.add(vendor2)
        
        db.commit()
        print("Sample vendors created successfully!")
        
        # Create sample addresses
        print("Creating sample addresses...")
        
        if vendor1 and not vendor1.addresses:
            address1 = VendorAddress(
                vendor_id=vendor1.id,
                address_type="registered",
                address="Plot 123, Sector 18",
                city="Gurgaon",
                state="Haryana",
                country="India",
                pincode="122015"
            )
            db.add(address1)
            
            address2 = VendorAddress(
                vendor_id=vendor1.id,
                address_type="supply",
                address="Plot 456, Sector 25",
                city="Gurgaon",
                state="Haryana",
                country="India",
                pincode="122002"
            )
            db.add(address2)
        
        if vendor2 and not vendor2.addresses:
            address3 = VendorAddress(
                vendor_id=vendor2.id,
                address_type="registered",
                address="1234 Industrial Blvd",
                city="Detroit",
                state="Michigan",
                country="USA",
                pincode="48201"
            )
            db.add(address3)
        
        db.commit()
        print("Sample addresses created successfully!")
        
        # Create sample bank information
        print("Creating sample bank information...")
        
        if vendor1 and not vendor1.bank_info:
            bank_info1 = VendorBankInfo(
                vendor_id=vendor1.id,
                bank_name="HDFC Bank",
                branch_name="Gurgaon Branch",
                account_number="50100123456789",
                account_type="Current",
                ifsc_code="HDFC0001234",
                swift_code="HDFCINBB",
                bank_address="HDFC Bank, Gurgaon, Haryana"
            )
            db.add(bank_info1)
        
        if vendor2 and not vendor2.bank_info:
            bank_info2 = VendorBankInfo(
                vendor_id=vendor2.id,
                bank_name="Chase Bank",
                branch_name="Detroit Branch",
                account_number="12345678901234",
                account_type="Business",
                ifsc_code="CHASUS33",
                swift_code="CHASUS33",
                bank_address="Chase Bank, Detroit, Michigan"
            )
            db.add(bank_info2)
        
        db.commit()
        print("Sample bank information created successfully!")
        
        # Create sample compliance information
        print("Creating sample compliance information...")
        
        if vendor1 and not vendor1.compliance:
            compliance1 = VendorCompliance(
                vendor_id=vendor1.id,
                preferred_currency="INR",
                tax_registration_number="TAX123456",
                pan_number="AABCT1234C",
                gst_number="07AABCT1234C1Z5",
                nature_of_assessee="Company",
                tan_number="TAN123456",
                place_of_supply="Haryana",
                business_license="BL123456",
                compliance_notes="All compliance requirements met",
                credit_rating="A+",
                insurance_coverage="General Liability",
                special_certifications="ISO 9001, ISO 27001"
            )
            db.add(compliance1)
        
        if vendor2 and not vendor2.compliance:
            compliance2 = VendorCompliance(
                vendor_id=vendor2.id,
                preferred_currency="USD",
                tax_registration_number="TAX789012",
                business_license="BL789012",
                compliance_notes="US compliance requirements met",
                credit_rating="AA",
                insurance_coverage="General Liability, Workers Comp",
                special_certifications="ISO 9001, IATF 16949"
            )
            db.add(compliance2)
        
        db.commit()
        print("Sample compliance information created successfully!")
        
        # Create sample agreements
        print("Creating sample agreements...")
        
        if vendor1 and not vendor1.agreements:
            agreements1 = VendorAgreement(
                vendor_id=vendor1.id,
                nda=True,
                sqa=True,
                four_m=True,
                code_of_conduct=True,
                compliance_agreement=True,
                self_declaration=True
            )
            db.add(agreements1)
        
        if vendor2 and not vendor2.agreements:
            agreements2 = VendorAgreement(
                vendor_id=vendor2.id,
                nda=True,
                sqa=True,
                four_m=False,
                code_of_conduct=True,
                compliance_agreement=False,
                self_declaration=True
            )
            db.add(agreements2)
        
        db.commit()
        print("Sample agreements created successfully!")
        
        # Create sample approvals
        print("Creating sample approvals...")
        
        if vendor1 and not vendor1.approvals:
            approval1 = VendorApproval(
                vendor_id=vendor1.id,
                approver_id=approver_user.id,
                level=ApprovalLevel.LEVEL_1,
                status="approved",
                comments="All requirements met, approved"
            )
            db.add(approval1)
            
            approval2 = VendorApproval(
                vendor_id=vendor1.id,
                approver_id=manager_user.id,
                level=ApprovalLevel.FINAL,
                status="approved",
                comments="Final approval granted"
            )
            db.add(approval2)
        
        if vendor2 and not vendor2.approvals:
            approval3 = VendorApproval(
                vendor_id=vendor2.id,
                approver_id=approver_user.id,
                level=ApprovalLevel.LEVEL_1,
                status="pending",
                comments="Under review"
            )
            db.add(approval3)
        
        db.commit()
        print("Sample approvals created successfully!")
        
        print("\nDatabase initialization completed successfully!")
        print("\nSample login credentials:")
        print("Admin: admin@example.com / admin123")
        print("Manager: manager@example.com / manager123")
        print("Approver: approver@example.com / approver123")
        
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db() 