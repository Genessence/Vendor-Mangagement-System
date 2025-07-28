from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base
import enum


class ApprovalStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    RETURNED_FOR_REVISION = "returned_for_revision"


class ApprovalLevel(str, enum.Enum):
    LEVEL_1 = "level_1"
    LEVEL_2 = "level_2"
    LEVEL_3 = "level_3"
    FINAL = "final"


class VendorApproval(Base):
    __tablename__ = "vendor_approvals"

    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=False)
    approver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    level = Column(Enum(ApprovalLevel), nullable=False)
    status = Column(Enum(ApprovalStatus), default=ApprovalStatus.PENDING)
    comments = Column(Text, nullable=True)
    approved_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    vendor = relationship("Vendor", back_populates="approvals")
    approver = relationship("User") 