from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base
import enum


class DocumentType(str, enum.Enum):
    GST_CERTIFICATE = "gst_certificate"
    PAN_CARD = "pan_card"
    BANK_STATEMENT = "bank_statement"
    MSME_CERTIFICATE = "msme_certificate"
    COMPANY_REGISTRATION = "company_registration"
    BUSINESS_LICENSE = "business_license"
    INSURANCE_CERTIFICATE = "insurance_certificate"
    QUALITY_CERTIFICATE = "quality_certificate"
    TAX_CERTIFICATE = "tax_certificate"
    OTHER = "other"


class DocumentStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    EXPIRED = "expired"


class VendorDocument(Base):
    __tablename__ = "vendor_documents"

    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=False)
    document_type = Column(Enum(DocumentType), nullable=False)
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String, nullable=False)
    status = Column(Enum(DocumentStatus), default=DocumentStatus.PENDING)
    expiry_date = Column(DateTime(timezone=True), nullable=True)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    review_comments = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    vendor = relationship("Vendor", back_populates="documents")
    uploader = relationship("User", foreign_keys=[uploaded_by])
    reviewer = relationship("User", foreign_keys=[reviewed_by]) 