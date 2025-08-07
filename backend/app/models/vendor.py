from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, Text, ForeignKey, Float, Date, UniqueConstraint
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
    SERVICE_PROVIDER = "service_provider"
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
    
    # Address information
    registered_address = Column(String, nullable=True)
    registered_city = Column(String, nullable=True)
    registered_state = Column(String, nullable=True)
    registered_country = Column(String, nullable=True)
    registered_pincode = Column(String, nullable=True)
    supply_address = Column(String, nullable=True)
    supply_city = Column(String, nullable=True)
    supply_state = Column(String, nullable=True)
    supply_country = Column(String, nullable=True)
    supply_pincode = Column(String, nullable=True)
    
    # Bank information
    bank_name = Column(String, nullable=True)
    account_number = Column(String, nullable=True)
    account_type = Column(String, nullable=True)
    ifsc_code = Column(String, nullable=True)
    branch_name = Column(String, nullable=True)
    currency = Column(String, nullable=True)
    
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
    
    # Compliance information
    pan_number = Column(String, nullable=True)
    gst_number = Column(String, nullable=True)
    preferred_currency = Column(String, nullable=True)
    tax_registration_number = Column(String, nullable=True)
    vat_number = Column(String, nullable=True)
    business_license = Column(String, nullable=True)
    gta_registration = Column(String, nullable=True)
    compliance_notes = Column(Text, nullable=True)
    credit_rating = Column(String, nullable=True)
    insurance_coverage = Column(String, nullable=True)
    special_certifications = Column(Text, nullable=True)
    
    # Agreements
    nda = Column(Boolean, default=False)
    sqa = Column(Boolean, default=False)
    four_m = Column(Boolean, default=False)
    code_of_conduct = Column(Boolean, default=False)
    compliance_agreement = Column(Boolean, default=False)
    self_declaration = Column(Boolean, default=False)
    
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
    agreement_details = relationship("VendorAgreementDetail", back_populates="vendor", cascade="all, delete-orphan")
    compliance_certificates = relationship("VendorComplianceCertificate", back_populates="vendor", cascade="all, delete-orphan")
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
    gta_registration = Column(String, nullable=True)  # 'yes' or 'no'
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


class VendorAgreementDetail(Base):
    __tablename__ = "vendor_agreement_details"

    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=False)
    
    # Agreement Information
    title = Column(String, nullable=False)  # e.g., "Non-Disclosure Agreement (NDA)"
    type = Column(String, nullable=False)  # Legal, Quality, Operational, Compliance, Declaration
    status = Column(String, default="Pending Signature")  # Signed, Pending Signature, Expired, Under Review
    signed_date = Column(Date, nullable=True)
    signed_by = Column(String, nullable=True)  # e.g., "Rajesh Kumar (CEO)"
    valid_until = Column(String, nullable=True)  # Date string or "Perpetual", "TBD", "Annual Renewal"
    description = Column(Text, nullable=True)
    version = Column(String, nullable=True)  # e.g., "2.1"
    document_size = Column(String, nullable=True)  # e.g., "234 KB"
    last_modified = Column(Date, nullable=True)
    witness_required = Column(Boolean, default=False)
    auto_renewal = Column(Boolean, default=False)
    
    # Document paths
    agreement_document_path = Column(String, nullable=True)
    signed_document_path = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    vendor = relationship("Vendor", back_populates="agreement_details")


class VendorComplianceCertificate(Base):
    __tablename__ = "vendor_compliance_certificates"

    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=False)
    
    # Certificate Information
    title = Column(String, nullable=False)  # e.g., "ISO 9001:2015 Quality Management"
    certificate_number = Column(String, nullable=False)
    status = Column(String, default="Compliant")  # Compliant, Expiring Soon, Non-Compliant, Under Review
    issued_date = Column(Date, nullable=False)
    expiry_date = Column(Date, nullable=False)
    issuing_authority = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    risk_level = Column(String, default="Low")  # Low, Medium, High
    
    # Document paths
    certificate_document_path = Column(String, nullable=True)
    audit_report_path = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    vendor = relationship("Vendor", back_populates="compliance_certificates")
    
    # Unique constraint: Each vendor can have only one certificate with a specific certificate_number
    __table_args__ = (
        UniqueConstraint('vendor_id', 'certificate_number', name='uq_vendor_certificate_number'),
    ) 