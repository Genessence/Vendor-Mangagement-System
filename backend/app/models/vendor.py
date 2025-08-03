from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, Text, ForeignKey, Float, Date
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base
import enum


class VendorStatus(str, enum.Enum):
    DRAFT = "draft"
    PENDING = "pending"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    SUSPENDED = "suspended"


class VendorType(str, enum.Enum):
    MANUFACTURER = "manufacturer"
    SUPPLIER = "supplier"
    SERVICE_PROVIDER = "service_proVIDER"
    DISTRIBUTOR = "distributor"


class MSMEStatus(str, enum.Enum):
    MSME = "msme"
    NON_MSME = "non_msme"
    PENDING = "pending"


class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(Integer, primary_key=True, index=True)
    vendor_code = Column(String, unique=True, index=True, nullable=False)
    
    # Company Information
    business_vertical = Column(String, nullable=False)
    company_name = Column(String, nullable=False)
    country_origin = Column(String, nullable=False)  # Country of origin for the vendor
    registration_number = Column(String, nullable=True)  # For Indian companies
    incorporation_certificate_path = Column(String, nullable=True)  # For non-Indian companies
    contact_person_name = Column(String, nullable=False)  # Name of person in charge
    designation = Column(String, nullable=True)
    email = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    website = Column(String, nullable=True)
    year_established = Column(Integer, nullable=True)
    business_description = Column(Text, nullable=True)
    
    # Categorization
    supplier_type = Column(Enum(VendorType), nullable=True)
    supplier_group = Column(String, nullable=True)
    supplier_category = Column(String, nullable=True)
    annual_turnover = Column(Float, nullable=True)
    products_services = Column(Text, nullable=True)
    msme_status = Column(Enum(MSMEStatus), default=MSMEStatus.PENDING)
    msme_category = Column(String, nullable=True)  # Micro, Small, Medium
    msme_number = Column(String, nullable=True)
    industry_sector = Column(String, nullable=True)
    employee_count = Column(String, nullable=True)
    certifications = Column(Text, nullable=True)
    
    # Status and Metadata
    status = Column(Enum(VendorStatus), default=VendorStatus.DRAFT)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    approved_at = Column(DateTime(timezone=True), nullable=True)
    approved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Relationships
    addresses = relationship("VendorAddress", back_populates="vendor", cascade="all, delete-orphan")
    bank_info = relationship("VendorBankInfo", back_populates="vendor", uselist=False, cascade="all, delete-orphan")
    compliance = relationship("VendorCompliance", back_populates="vendor", uselist=False, cascade="all, delete-orphan")
    agreements = relationship("VendorAgreement", back_populates="vendor", uselist=False, cascade="all, delete-orphan")
    documents = relationship("VendorDocument", back_populates="vendor", cascade="all, delete-orphan")
    approvals = relationship("VendorApproval", back_populates="vendor", cascade="all, delete-orphan")


class VendorAddress(Base):
    __tablename__ = "vendor_addresses"

    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=False)
    address_type = Column(String, nullable=False)  # 'registered' or 'supply'
    address = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    country = Column(String, nullable=False)
    pincode = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship
    vendor = relationship("Vendor", back_populates="addresses")


class VendorBankInfo(Base):
    __tablename__ = "vendor_bank_info"

    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=False)
    bank_name = Column(String, nullable=False)
    branch_name = Column(String, nullable=True)
    account_number = Column(String, nullable=False)
    account_type = Column(String, nullable=True)
    ifsc_code = Column(String, nullable=False)
    swift_code = Column(String, nullable=True)
    bank_address = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    vendor = relationship("Vendor", back_populates="bank_info")


class VendorCompliance(Base):
    __tablename__ = "vendor_compliance"

    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=False)
    preferred_currency = Column(String, default="INR")
    tax_registration_number = Column(String, nullable=True)
    pan_number = Column(String, nullable=True)
    gst_number = Column(String, nullable=True)
    nature_of_assessee = Column(String, nullable=True)
    tan_number = Column(String, nullable=True)
    place_of_supply = Column(String, nullable=True)
    vat_number = Column(String, nullable=True)
    business_license = Column(String, nullable=True)
    compliance_notes = Column(Text, nullable=True)
    credit_rating = Column(String, nullable=True)
    insurance_coverage = Column(String, nullable=True)
    special_certifications = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    vendor = relationship("Vendor", back_populates="compliance")


class VendorAgreement(Base):
    __tablename__ = "vendor_agreements"

    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=False)
    nda = Column(Boolean, default=False)
    sqa = Column(Boolean, default=False)
    four_m = Column(Boolean, default=False)
    code_of_conduct = Column(Boolean, default=False)
    compliance_agreement = Column(Boolean, default=False)
    self_declaration = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    vendor = relationship("Vendor", back_populates="agreements") 